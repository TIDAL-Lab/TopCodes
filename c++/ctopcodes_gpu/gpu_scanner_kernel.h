#ifndef GPU_SCANNER_KERNEL_H
#define GPU_SCANNER_KERNEL_H
void gpu_scanner_compute(const unsigned int *devInRunSum, unsigned short *devOut, int w, int h);
#endif
