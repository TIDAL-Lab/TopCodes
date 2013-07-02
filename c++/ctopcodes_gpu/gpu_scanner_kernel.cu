#define DIVUP(a,b) (((a%b)==0)?(a/b):((a/b)+1))
#define SECTORS 13
#define PI      3.14159265f
#define ARC     ((2.0f*PI)/(float)SECTORS)
#define WIDTH   8
#define ARCS    10 
#define COLS_PER_THREAD 16 // 16 gives performance of 45ms
#define BLOCKWIDTH 16
#define BLOCKHEIGHT 16

__device__ inline float _fround(float v) {
	return (float)((int)((v < 0.0f) ? v - 0.5f : v + 0.5f));
}
__device__ inline int _iround(float v) {
	return (int)((v < 0.0f) ? v - 0.5f : v + 0.5f);
}
__device__ unsigned int getBW3x3(const unsigned int *data, int x, int y, int width, int height) {
	if (x < 1 || x > width-2 || y < 1 || y >= height-2) return 0;
	unsigned int pixel, sum = 0;    
	#pragma unroll
	for (int j=y-1; j<=y+1; j++) {
		#pragma unroll
		for (int i=x-1; i<=x+1; i++) {
			pixel = data[j * width + i];
			sum += ((pixel >> 24) & 0x01);
		}
	}
	return (sum >= 5) ? 1 : 0;
}
__device__ int xdist(const unsigned int *data, int x, int y, int d, int width, int height) {
	unsigned int sample;
	unsigned int start = getBW3x3(data, x, y, width, height);
	#pragma unroll
	for (int i=x+d; i>1 && i<width-1; i+=d) {
		sample = getBW3x3(data, i, y, width, height);
		if (start + sample == 1) { 
			return (d > 0) ? i - x : x - i;
		}
	}
	return -1;
}
__device__ int ydist(const unsigned int *data, int x, int y, int d, int width, int height) {
	unsigned int sample;
	unsigned int start = getBW3x3(data, x, y, width, height);
	#pragma unroll
	for (int j=y+d; j>1 && j<height-1; j+=d) {
		sample = getBW3x3(data, x, j, width, height);
		if (start + sample == 1) {			
			return (d > 0) ? j - y : y - j;
		}
	}
	return -1;
}

__device__ float readUnit(const unsigned int *data, float x, float y, int width, int height) {
	int sx = _iround(x);
	int sy = _iround(y);
	bool whiteL = true;
	bool whiteR = true;
	bool whiteU = true;
	bool whiteD = true;  
	unsigned int sample;
	int distL = 0, distR = 0, distU = 0, distD = 0;
	#pragma unroll
	for (int i=1; true; i++) {
		if (sx - i < 1 || sx + i >= width - 1 ||
			sy - i < 1 || sy + i >= height - 1 ||
			i > 100) {
			return -1;
		}
		// Left sample
		sample = getBW3x3(data, sx - i, sy, width, height);
		if (distL <= 0) { 
			if (whiteL && sample == 0) {
				whiteL = false;
			} else if (!whiteL && sample == 1) {
				distL = i;
			}
		}
		// Right sample
		sample = getBW3x3(data, sx + i, sy, width, height);
		if (distR <= 0) { 
			if (whiteR && sample == 0) {
				whiteR = false;
			} else if (!whiteR && sample == 1) {
				distR = i;
			}
		}

		// Up sample
		sample = getBW3x3(data, sx, sy - i, width, height);
		if (distU <= 0) {
			if (whiteU && sample == 0) {
				whiteU = false;
			} else if (!whiteU && sample == 1) {
				distU = i;
			}
		}
	 
		// Down sample
		sample = getBW3x3(data, sx, sy + i, width, height);
		if (distD <= 0) {
			if (whiteD && sample == 0) {
				whiteD = false;
			} else if (!whiteD && sample == 1) {
				distD = i;
			}
		}

		if (distR > 0 && distL > 0 && distU > 0 && distD > 0) {
			return (float)(distR + distL + distU + distD) / 8.0f;
		}
	}
}
__device__ unsigned int getSample3x3(const unsigned int *data, int x, int y, int w, int h) {
	if (x < 1 || x > w-2 || y < 1 || y >= h-2) return 0;
	unsigned int sum = 0;      
	#pragma unroll
	for (int j=y-1; j<=y+1; j++) {
		#pragma unroll
		for (int i=x-1; i<=x+1; i++) {
			if ((data[j * w + i] & (unsigned int)0x01000000) > 0) {
				sum += (unsigned int)0xff;
			}
		}
	}
	return (sum / 9);
}
__device__ bool checksum(unsigned int bits) {
	unsigned int sum = 0;
	#pragma unroll
	for (int i=0; i<SECTORS; i++) {
		sum += (bits & (unsigned int)0x01);
		bits = bits >> 1;
	}
	return (sum == (unsigned int)5);
}
/** return uint2(c, code) */
__device__ uint2 readCode(const unsigned int *data, float unit, float arca, float x, float y, int w, int h) {
	float dx, dy;  // direction vector
	float dist;
	int c = 0;
	int sx, sy;
	int bit;
	unsigned bits = 0;
	int code = -1;
	unsigned int core[WIDTH];
	#pragma unroll
	for (int sector = SECTORS-1; sector >= 0; sector--) {
		dx = (float)cos(ARC * (float)sector + arca);
		dy = (float)sin(ARC * (float)sector + arca);
		// Take 8 samples across the diameter of the symbol
		#pragma unroll
		for (int i=0; i<WIDTH; i++) {
			dist = ((float)i - 3.5f) * unit;
			sx = (int)_fround(x + dx * dist);
			sy = (int)_fround(y + dy * dist);
			core[i] = getSample3x3(data, sx, sy, w, h);
		}

		// white rings
		if (core[1] <= 128 || core[3] <= 128 ||	core[4] <= 128 || core[6] <= 128) {
			return make_uint2(0,0);
		}

		// black ring
		if (core[2] > 128 || core[5] > 128) {
			return make_uint2(0,0);
		}

		// compute confidence in core sample
		c += (core[1] + core[3] + core[4] + core[6] + // white rings
		(0xff - core[2]) + (0xff - core[5]));  // black ring

		// data rings
		c += abs((int)core[7] * 2 - 0xff);

		// opposite data ring
		c += (0xff - abs((int)core[0] * 2 - 0xff));

		bit = (core[7] > 128)? 1 : 0;
		bits <<= 1;
		bits += bit;
	}
	if (checksum(bits)) {
		code = bits;
		return make_uint2(c, code);
	} else {
		return make_uint2(0,0);
	}
}
__device__ unsigned int rotateLowest(unsigned int bits, float arca) {
	unsigned int _min = bits;
	int mask = 0x1fff;
	// slightly overcorrect arc-adjustment ideal correction would be (ARC / 2),
	// but there seems to be a positive bias that falls out of the algorithm.
	arca -= (ARC * 0.65f);      
	float orientation = 0;
	#pragma unroll
	for (int i=1; i<=SECTORS; i++) {
		bits = (((bits << 1) & mask) | (bits >> (SECTORS - 1)));
		if (bits < _min) { 
			_min = bits;
			orientation = ((float)i * -ARC);
		}
	}
	orientation += arca;
	return _min;
}   
__device__ unsigned int cuda_krnl_decode(const unsigned int *data, int cx, int cy, int width, int height) {
	int up =	ydist(data, cx    , cy    , -1, width, height) + 
				ydist(data, cx - 1, cy    , -1, width, height) + 
				ydist(data, cx + 1, cy    , -1, width, height);
	int down =  ydist(data, cx    , cy    , 1 , width, height) +
				ydist(data, cx - 1, cy    , 1 , width, height) +
				ydist(data, cx + 1, cy    , 1 , width, height);
	int left =  xdist(data, cx    , cy    , -1, width, height) +
				xdist(data, cx    , cy - 1, -1, width, height) +
				xdist(data, cx    , cy + 1, -1, width, height);
	int right = xdist(data, cx    , cy    , 1 , width, height) +
				xdist(data, cx    , cy - 1, 1 , width, height) +
				xdist(data, cx    , cy + 1, 1 , width, height);
	float x = (float)cx;
	float y = (float)cy;
	x += (right - left) / 6.0f;
	y += (down - up) / 6.0f;
	int unit = readUnit(data, x, y, width, height);
	if (unit < 0) 
		return -1;

	unsigned int code = 0;
	unsigned int c = 0;
	int   maxc = 0;
	float arca;
	float maxa = 0;
	float maxu = 0;
	
	//-----------------------------------------
	// Try different unit and arc adjustments,
	// save the one that produces a maximum
	// confidence reading...
	//-----------------------------------------
	float dARC = 1.0f/(float)ARCS;
	float hdARC = dARC/2.0f;
	uint2 ui2;
    #pragma unroll
	for (int u = -2; u <= 2; u++) { 
		#pragma unroll
		for (int a = 0; a < ARCS; a++) {
			arca = (float)a * ARC * dARC;
			ui2 = readCode(data, unit + (unit * hdARC * u), arca, x, y, width, height);			
			c = ui2.x;
			code = ui2.y;
			if (c > maxc) { 
				maxc = c;
				maxa = arca;
				maxu = unit + (unit * hdARC * u);
			}
		}
	}
	
	// One last call to readCode to reset orientation and code
	if (maxc > 0) {
		unit = maxu;
		ui2 = readCode(data, unit, maxa, x, y, width, height);
		c = ui2.x;
		code = ui2.y;
		code = rotateLowest(code, maxa);
	}
	return code; 
}

__global__ void cuda_krnl_topcodes(const unsigned int  *data, 
								   unsigned short      *out, 
								   int                 w, 
								   int                 h) {
	int X = (__umul24(blockIdx.x, blockDim.x) + threadIdx.x);
	int Y = (__umul24(blockIdx.y, blockDim.y) + threadIdx.y);		
	if (X>=2 && X<w-2 && Y>=2 && Y<h-2) {
		int d;
		size_t pos;
        #pragma unroll
		for (int pk=0; pk<COLS_PER_THREAD; ++pk) {
			pos = (Y*w)+(COLS_PER_THREAD*X)+pk;
			if ((data[pos]&0x2000000) && (data[pos-1]&0x2000000) && (data[pos+1]&0x2000000) &&  (data[pos-w]&0x2000000) && (data[pos+w]&0x2000000)) {
				d = cuda_krnl_decode(data, COLS_PER_THREAD*X+pk, Y, w, h);			
				if (d>=1) 
					out[pos]=(unsigned short)d;
			}		
		}
	}	
}

__host__ void gpu_scanner_compute(const unsigned int *devInRunSum, 
								  unsigned short     *devOut, 
								  int                w, 
								  int                h) {	
	const dim3 threads(BLOCKWIDTH, BLOCKHEIGHT); 
	const dim3 grid(DIVUP(w/COLS_PER_THREAD, threads.x), DIVUP(h, (threads.y)));
	cuda_krnl_topcodes <<< grid, threads >>> (devInRunSum, devOut, w, h);
}

