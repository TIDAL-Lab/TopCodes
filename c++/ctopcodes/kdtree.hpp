#ifndef KDTREE_H
#define KDTREE_H

#include <math.h>
#include <vector>
#include <algorithm>
#include <queue>


//---------------------------------------------------------------------------------
// KDTree class: static data structure for k-nearest neighbors queries
//    It templated on <class Point> which requires:
//       .x, .y (convertable from to double)
//       Default constructor
//       (T,T) contructor where T is the point element type.
//    Given a set of points, one should first push_back the points into the
//    KDTree, then the balance() method should be run.
//    Given a point (x,y), the method findNearest returns the list of k-nearest
//    neighbors.
//---------------------------------------------------------------------------------
template <class Point>
class KDTree : public std::vector<Point> {
	public:
		class QPoint {
			public:
				Point *point;
				float dist;
		};
	private:
		float radius;
		void buildSubKDTree(int start, int end, int axis);
		void findSubNearest(Point position, int count, int start, int end, int axis);
		struct sort_func {
			int sort_axis;
			sort_func(int axis) : sort_axis(axis) {}
			bool operator()(Point p1, Point p2) {
				if (sort_axis==0) return p1.x<p2.x;
				else return  p1.y<p2.y;
			}
		};
		struct priority_func {
			bool operator()(QPoint* p1, QPoint* p2) {
				return  p1->dist<p2->dist;
			}
		};
		std::priority_queue<QPoint*, std::vector<QPoint*>, priority_func> nearest_queue;
	public:
		// balance atually constructs the tree from the set of points already pushed
		// back. It simply does a recursive sorting of the points by changing the
		// coordinates (x,y) in each sub sorting.
		void balance();

		// query the k-nearest neighbors (after balance was run).
		void query(
			const Point position,     // query point
			const int count,          // number of neighbors to return
			const float max_radius, // maximum radius constrain
			std::vector<Point> &pnts           // vector of returned points
		);
};

//---------------------------------------------------------------------------------
// Implementation
//---------------------------------------------------------------------------------

#ifndef SQR
#define SQR(n) ((n)*(n))
#endif

template <class Point>
void KDTree<Point>::buildSubKDTree(int start, int end, int axis) {

	std::sort(begin()+start, begin()+end+1, sort_func(axis));

  int midpoint = ((end-start)>>1) + start;

  if (start<midpoint-1)
    buildSubKDTree(start,midpoint-1,!axis);
  if (end>midpoint+1)
    buildSubKDTree(midpoint+1, end,!axis);
}

template <class Point>
void KDTree<Point>::balance() {
  buildSubKDTree(0,size()-1,0);
}

template <class Point>
inline void KDTree<Point>::findSubNearest(
					  const Point position,
					  const int count,
					  const int start,
					  const int end,
					  const int axis)
{

  int midpoint = ((end-start)>>1) + start;

  if (axis==0)
    {
      if ((*this)[midpoint].x-radius<=position.x)
	if (end>=midpoint+1)
	  findSubNearest(position, count, midpoint+1, end,1);

      if ((*this)[midpoint].x+radius>=position.x)
	if (start<=midpoint-1)
	  findSubNearest(position, count, start, midpoint-1,1);
    } else
      {
	if ((*this)[midpoint].y-radius<=position.y)
	  if (end>=midpoint+1)
	    findSubNearest(position, count, midpoint+1, end,0);

	if ((*this)[midpoint].y+radius>=position.y)
	  if (start<=midpoint-1)
	    findSubNearest(position, count, start, midpoint-1,0);
      }
  float dist = sqrt(
		SQR(position.x-(*this)[midpoint].x)+
		SQR(position.y-(*this)[midpoint].y)
		);
  QPoint *qPoint;
  if (nearest_queue.size()>=(unsigned int)count) {
    qPoint = nearest_queue.top();
    radius=qPoint->dist;
    if (dist<qPoint->dist) {
      nearest_queue.pop();
      qPoint->point = &((*this)[midpoint]);
      qPoint->dist = dist;
      //radius = dist;
      nearest_queue.push(qPoint);
    }
  } else {
    qPoint = new QPoint;
    qPoint->point = &((*this)[midpoint]);
    qPoint->dist = dist;

    nearest_queue.push(qPoint);
  }
}

template <class Point>
void KDTree<Point>::query(
			      const Point position,
			      const int count,
			      const float max_radius,
			      std::vector<Point> &pnts
			      )
{
  pnts.clear();
  if (size()==0) return;
  radius=max_radius;
  float mrad=radius;
  findSubNearest(position, count, 0, size()-1,0);
  QPoint *qPoint;
  while (!nearest_queue.empty()) {
    qPoint = nearest_queue.top();
    if (qPoint->dist<mrad) {
      pnts.push_back(*qPoint->point);
    }
    nearest_queue.pop();
    delete qPoint;
  }
}

#endif
