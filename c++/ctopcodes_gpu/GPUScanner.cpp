#include "MyTime.h"
#include "GPUScanner.h"
#include "gpu_scanner_kernel.h"

bool cudad2d(unsigned char *device_ptr_src, unsigned char *device_ptr_dest, size_t size) {if (cudaMemcpy(device_ptr_dest, device_ptr_src, size, cudaMemcpyDeviceToDevice) != CUDA_SUCCESS) { fprintf(stderr, "Error CUDA Memcpy\n"); return false;} return true;}
bool cudad2h(unsigned char *device_ptr    , unsigned char *host_ptr       , size_t size) {if (cudaMemcpy(host_ptr       , device_ptr    , size, cudaMemcpyDeviceToHost)   != CUDA_SUCCESS) { fprintf(stderr, "Error CUDA Memcpy\n"); return false;}	return true;}
bool cudah2d(unsigned char *host_ptr      , unsigned char *device_ptr     , size_t size) {if (cudaMemcpy(device_ptr     , host_ptr      , size, cudaMemcpyHostToDevice)   != CUDA_SUCCESS) { fprintf(stderr, "Error CUDA Memcpy\n"); return false;}	return true;}

#define CUDA_TIME_START {cudaEvent_t start, stop; cudaEventCreate(&start); cudaEventCreate(&stop); float timeInMs; cudaEventRecord(start, 0);
#define CUDA_TIME_REPORT(msg) cudaEventRecord(stop, 0); cudaEventSynchronize(stop); cudaEventElapsedTime(&timeInMs, start, stop); printf("%-32s%9.4f ms\n", msg, timeInMs); cudaEventDestroy(start); cudaEventDestroy(stop);}
#define TIME_COMMAND_CUDA(msg, x) CUDA_TIME_START x; CUDA_TIME_REPORT(msg)

TopCodes::GPUScanner::GPUScanner(int w, int h) 
	: m_dInRunSum(NULL), m_dOut(NULL), mImgW(w), mImgH(h)
{
	imgSize = mImgW*mImgH*sizeof(unsigned char);
	imgSizeOut = mImgW*mImgH*sizeof(unsigned short);
	imgSizeRunSum = mImgW*mImgH*sizeof(unsigned int);
	if (cudaMalloc((void**)&m_dInRunSum, imgSizeRunSum)!= CUDA_SUCCESS) {
		fprintf(stderr, "Error CUDA Malloc\n");
		return;
	}
	if (cudaMalloc((void**)&m_dOut, imgSizeOut)!= CUDA_SUCCESS) {
		fprintf(stderr, "Error CUDA Malloc\n");
		return;
	}
	if (cudaHostAlloc((void**)&m_hOut, imgSizeOut, cudaHostAllocWriteCombined)!= CUDA_SUCCESS) {
		fprintf(stderr, "Error CUDA Malloc\n");
		return;
	}	
}
TopCodes::GPUScanner::~GPUScanner() {
	clear();
}
std::vector<TopCodes::Code*>
TopCodes::GPUScanner::scan(const Image *image, ScanListener *l, Image *annotate) {
	std::vector<Code*> topcode_codes;
	if (image->height != mImgH || 
		image->widthStep != mImgW) {
			fprintf(stderr, "Error in sizes while calling TopCodes::GPUScanner::scan \n");
			return topcode_codes;
	}

	if (NULL==gData) 
		gData = (unsigned int*)malloc(image->width*image->height*sizeof(unsigned int));
	memset(gData, 0, imgSize*sizeof(unsigned int));
	this->image = image;

	TIME_COMMAND     ("threshold", threshold();)
	TIME_COMMAND_CUDA("h2d"      , cudah2d((unsigned char*)gData, m_dInRunSum, imgSizeRunSum);)
	TIME_COMMAND_CUDA("memset"   , cudaMemset(m_dOut, 0, imgSizeOut);)
	TIME_COMMAND_CUDA("compute"  , gpu_scanner_compute((const unsigned int*)m_dInRunSum, (unsigned short*)m_dOut, mImgW, mImgH);)
	TIME_COMMAND_CUDA("d2h"      , cudad2h(m_dOut, (unsigned char*)m_hOut, imgSizeOut);)

	size_t cnt=0;
	TopCodes::Code *nc;	
	int cr0=0,cr=mImgW*mImgH, c=0, r=0;
	unsigned short *m_hOutPtr = m_hOut;
	TIME_COMMAND("build-list", 
	while (cr0<cr) {
		if (*m_hOutPtr > 0) {
			nc = new TopCodes::Code();
			nc->x = c;
			nc->y = r;
			nc->code = *m_hOutPtr;
			nc->unit = 5.0f;
			topcode_codes.push_back(nc);
		}
		++c;
		if (c>=mImgW) {
			++r;
			c=0;
		}
		++cr0;
		++m_hOutPtr;
	}
	)
	return topcode_codes;
}
void 
TopCodes::GPUScanner::clear() {
	cudaFree(m_dOut);
}
std::vector<TopCodes::Code*> 
TopCodes::GPUScanner::findCodes(ScanListener *l) {
	std::vector<Code*> r;
	return r;
}

