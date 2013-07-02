#ifndef GPU_SCANNER_H
#define GPU_SCANNER_H

#include "topcode.h"
#include "cuda.h"
#include "cuda_runtime_api.h" 

#include <vector>

namespace TopCodes { 
	class GPUScanner : public Scanner {
	public:
		GPUScanner(int w, int h);
		virtual ~GPUScanner();
		virtual std::vector<Code*> scan(const Image *image, ScanListener *l = NULL, Image *annotate = NULL);
		virtual void clear(); // release allocated resources after usage.
		virtual std::vector<Code*> findCodes(ScanListener *l=NULL);
	protected:
		int            mImgW, mImgH;
		unsigned char  *m_dInRunSum, *m_dOut;
		unsigned short *m_hOut;
		size_t         imgSize, imgSizeOut, imgSizeRunSum;
		cudaArray      *cua_Data;
	};
}

#endif
