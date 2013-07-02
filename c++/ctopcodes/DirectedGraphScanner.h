#ifndef DIRECTED_GRAPH_SCANNER_H
#define DIRECTED_GRAPH_SCANNER_H

#include "topcode.h"
#include <vector>
#include <map>

struct CvGraph;
struct CvGraphVtx;
struct CvMemStorage;

namespace TopCodes {	

	class CvGraphCode : public Code {
	public:
		CvGraphCode();
		virtual Code* clone() const;
		CvGraphVtx *mCvGraphVtx;
	};

	class CvGraphCodeFactory : public CodeFactory {
	public:
		virtual Code* create();
	};

	class DirectedGraphScanner : public Scanner {
	public:
		DirectedGraphScanner();
		virtual ~DirectedGraphScanner();
		virtual std::vector<Code*> scan(const Image *image, ScanListener *l = NULL, Image *annotate = NULL);
		virtual void clear(); // release allocated resources after usage.
		CvGraph *mGraph;
		std::map<int, CvGraphCode*> mCvGraphCodeInGraphMap;
	private:
		CvMemStorage *mMemStorage;
	};
}

#endif
