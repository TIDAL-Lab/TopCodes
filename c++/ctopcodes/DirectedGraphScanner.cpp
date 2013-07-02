#include "DirectedGraphScanner.h"
#include "cv.h" // OpenCV API
#include "kdtree.hpp"
#include "MyTime.h"
#include <map>

namespace TopCodes {

DirectedGraphScanner::DirectedGraphScanner()
   : mGraph(NULL),
mMemStorage(NULL){
	   Scanner::setCodeFactory(new CvGraphCodeFactory);
}
DirectedGraphScanner::~DirectedGraphScanner() {
	clear();
}

struct P2 {
    double x,y;
    int    code;
    CvGraphCode *mycode;
    P2(double _x=0.0, double _y=0.0): x(_x),y(_y),code(NULL){}
};

std::vector<Code*>
DirectedGraphScanner::scan(	const Image  *image,
							ScanListener *l,
							Image        *annotate) {
	clear();
	std::vector<Code*> topcode_codes = Scanner::scan(image, l);
	if (topcode_codes.empty())
		return topcode_codes;
	// WE HAVE CODES
	KDTree<P2> kdtree;
	P2 p2;
	mCvGraphCodeInGraphMap.clear();
	CvGraph *G;
	mMemStorage = cvCreateMemStorage();
	G = cvCreateGraph(	CV_ORIENTED_GRAPH, sizeof(CvGraph),
						sizeof(CvGraphVtx), sizeof(CvGraphEdge),
						mMemStorage);
	std::vector<TopCodes::Code*>::iterator it;
	it = topcode_codes.begin();
	while (it != topcode_codes.end()) {
		TopCodes::Code *code = (*it);
		CvGraphCode *mycode = (CvGraphCode*)code;
		p2.x      = code->x;
		p2.y      = code->y;
		p2.mycode = mycode;
		kdtree.push_back(p2);
		// ADD NODE TO GRAPH FOR EACH TopCode
		int vv = cvGraphAddVtx(G);
		CvGraphVtx *v = cvGetGraphVtx(G, vv);
		mycode->mCvGraphVtx = v;
		// add to map
		mCvGraphCodeInGraphMap[vv] = mycode;
		++it;
	}
	kdtree.balance();

	// Estimate the average distance between TopCodes on grid
	// Using HISTOGRAM ANALYSIS. This code on every scale of TopCodes in image
	float searchRadius;
	int cnt=0;
	it = topcode_codes.begin();
	int histBinSz=10;
	int histSz = (image->width/histBinSz);
	unsigned short *hist = new unsigned short[histSz];
	memset(hist, 0, sizeof(unsigned short)*histSz);
	int histPeakIndex=-1;
	int histPeakValue=-1;
	const int NNEIGHBORS=8;
	while (it != topcode_codes.end()) {
		TopCodes::Code *code = (*it);
		p2.x=code->x;
		p2.y=code->y;
		p2.code = code->code;
		std::vector<P2> pnts;
		kdtree.query(p2, NNEIGHBORS, image->width/2,pnts);
		for (int i=0; i<pnts.size();++i) {
			if (fabs(p2.x-pnts[i].x)>=1 && fabs(p2.y-pnts[i].y)>=1) {
				searchRadius=sqrt( (p2.x-pnts[i].x)*(p2.x-pnts[i].x) +
								   (p2.y-pnts[i].y)*(p2.y-pnts[i].y)
								   );
				int histIndex = (int)searchRadius/histBinSz;
				hist[histIndex]++;
				if (hist[histIndex]>histPeakValue) {
					histPeakValue=hist[histIndex];
					histPeakIndex=histIndex;
				}
			}
		}
		++it;
	}
	delete [] hist;
	searchRadius = sqrt(2.5)*histPeakIndex*histBinSz;

	// INSERT GRAPH EDGES USING KDTREE Queries
	it = topcode_codes.begin();
	while (it != topcode_codes.end()) {
		TopCodes::Code *code = (*it);
		CvGraphCode *mycode = (CvGraphCode*)code;
		p2.x=code->x;
		p2.y=code->y;
		p2.code = code->code;
		p2.mycode = mycode;
		std::vector<P2> pnts;
		kdtree.query(p2,NNEIGHBORS,searchRadius,pnts);
		CvScalar lineColor;
		const float D_AABB = searchRadius/2.0f;
		for (int i=0; i<pnts.size();++i) {
			if (pnts[i].x>p2.x && fabs(pnts[i].y-p2.y)<=D_AABB)	{
				// IDENTIFIED ALMOST-HORIZ LINE
				if (annotate) {
					lineColor = CV_RGB(255,0,255);
					cvLine(annotate, cvPoint(p2.x,p2.y),cvPoint(pnts[i].x,pnts[i].y),lineColor);
				}
				// Connect In Graph
				cvGraphAddEdgeByPtr(G, mycode->mCvGraphVtx, pnts[i].mycode->mCvGraphVtx);
			}
			else if (pnts[i].y>p2.y && fabs(pnts[i].x-p2.x)<=D_AABB)	{
				// IDENTIFIED ALMOST-VERT LINE
				if (annotate) {
					lineColor = CV_RGB(0,0,255);
					cvLine(annotate, cvPoint(p2.x,p2.y),cvPoint(pnts[i].x,pnts[i].y),lineColor);
				}
				// Connect In Graph
				cvGraphAddEdgeByPtr(G, mycode->mCvGraphVtx, pnts[i].mycode->mCvGraphVtx);
			}
		}
		++it;
	}

	this->mGraph = G;
	return topcode_codes;
}

	CvGraphCode::CvGraphCode() : mCvGraphVtx(NULL) {}
	Code* CvGraphCode::clone() const {
		return new CvGraphCode();
	}

	Code* CvGraphCodeFactory::create() {
		return new CvGraphCode();
	}

	void DirectedGraphScanner::clear() {
		if (mGraph) {
			cvClearGraph(mGraph);
			mGraph=NULL;
		}
		mCvGraphCodeInGraphMap.clear();
		cvReleaseMemStorage(&mMemStorage);
		mMemStorage=NULL;
	}
}
