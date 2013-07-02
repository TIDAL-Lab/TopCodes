#include "topcode.h"
#include <math.h>
#include "MyTime.h"

#define _iround(v)  (int)((v < 0.0) ? v - 0.5 : v + 0.5)
#define _fround(v)  (float)((int)((v < 0.0) ? v - 0.5 : v + 0.5))

void setupCodeMap(unsigned short mCodeMap[1190]) {
	memset(mCodeMap, 0, sizeof(unsigned short)*1190);
	unsigned short i=0;
	mCodeMap[31]=i++;mCodeMap[47]=i++	;mCodeMap[55]=i++	;mCodeMap[59]=i++;
	mCodeMap[61]=i++	;mCodeMap[79]=i++		;mCodeMap[87]=i++		;mCodeMap[91]=i++;
	mCodeMap[93]=i++	;mCodeMap[103]=i++	;mCodeMap[107]=i++	;mCodeMap[109]=i++;
	mCodeMap[115]=i++;mCodeMap[117]=i++	;mCodeMap[121]=i++	;mCodeMap[143]=i++;
	mCodeMap[151]=i++;mCodeMap[155]=i++	;mCodeMap[157]=i++	;mCodeMap[167]=i++;
	mCodeMap[171]=i++;mCodeMap[173]=i++	;mCodeMap[179]=i++	;mCodeMap[181]=i++;
	mCodeMap[185]=i++;mCodeMap[199]=i++	;mCodeMap[203]=i++	;mCodeMap[205]=i++;
	mCodeMap[211]=i++;mCodeMap[213]=i++	;mCodeMap[217]=i++	;mCodeMap[227]=i++;
	mCodeMap[229]=i++;mCodeMap[233]=i++	;mCodeMap[241]=i++	;mCodeMap[271]=i++;
	mCodeMap[279]=i++;mCodeMap[283]=i++	;mCodeMap[285]=i++	;mCodeMap[295]=i++;
	mCodeMap[299]=i++;mCodeMap[301]=i++	;mCodeMap[307]=i++	;mCodeMap[309]=i++;
	mCodeMap[313]=i++;mCodeMap[327]=i++	;mCodeMap[331]=i++	;mCodeMap[333]=i++;
	mCodeMap[339]=i++;mCodeMap[341]=i++	;mCodeMap[345]=i++	;mCodeMap[355]=i++;
	mCodeMap[357]=i++;mCodeMap[361]=i++	;mCodeMap[369]=i++	;mCodeMap[391]=i++;
	mCodeMap[395]=i++;mCodeMap[397]=i++	;mCodeMap[403]=i++	;mCodeMap[405]=i++;
	mCodeMap[409]=i++;mCodeMap[419]=i++	;mCodeMap[421]=i++	;mCodeMap[425]=i++;	;mCodeMap[433]=i++;
	mCodeMap[453]=i++;mCodeMap[457]=i++	;mCodeMap[465]=i++	;mCodeMap[551]=i++;
	mCodeMap[555]=i++;mCodeMap[557]=i++	;mCodeMap[563]=i++	;mCodeMap[565]=i++;
	mCodeMap[569]=i++;mCodeMap[583]=i++	;mCodeMap[587]=i++	;mCodeMap[589]=i++;
	mCodeMap[595]=i++;mCodeMap[597]=i++	;mCodeMap[601]=i++	;mCodeMap[611]=i++;
	mCodeMap[613]=i++;mCodeMap[617]=i++	;mCodeMap[651]=i++	;mCodeMap[653]=i++;
	mCodeMap[659]=i++;mCodeMap[661]=i++	;mCodeMap[665]=i++	;mCodeMap[675]=i++;
	mCodeMap[677]=i++;mCodeMap[681]=i++	;mCodeMap[713]=i++	;mCodeMap[793]=i++;
	mCodeMap[805]=i++;mCodeMap[809]=i++	;mCodeMap[841]=i++	;mCodeMap[1171]=i++;
	mCodeMap[1173]=i++;mCodeMap[1189]=i++;
};

static bool savePgmImage(char *pixels, size_t width, size_t height, size_t bytesPerPixel, const char *filename) {
  FILE *f = fopen(filename, "wb");
  if (NULL == f) {
    fprintf(stderr, "Error: Failed to open file:%s for binary writing\n", filename);
    return false;	
  }
  fprintf(f, "P5\n%d %d\n255\n", width, height);  
  fwrite(pixels, 1, width*height*bytesPerPixel, f);
  fclose(f);
  return true;
}

namespace TopCodes {
	int Code::decode(Scanner &scanner, int cx, int cy) {
		int up = (scanner.ydist(cx, cy, -1) +
				  scanner.ydist(cx - 1, cy, -1) +
				  scanner.ydist(cx + 1, cy, -1));
		int down = (scanner.ydist(cx, cy, 1) +
				    scanner.ydist(cx - 1, cy, 1) +
				    scanner.ydist(cx + 1, cy, 1));
		int left = (scanner.xdist(cx, cy, -1) +
				    scanner.xdist(cx, cy - 1, -1) +
				    scanner.xdist(cx, cy + 1, -1));
		int right = (scanner.xdist(cx, cy, 1) +
				     scanner.xdist(cx, cy - 1, 1) +
				     scanner.xdist(cx, cy + 1, 1));		
		this->x = (float)cx;
		this->y = (float)cy;
		this->x += (right - left) / 6.0f;
		this->y += (down - up) / 6.0f;
		this->unit = readUnit(scanner);
		this->code = -1;
		if (unit < 0) return -1;
		int c = 0;
		int maxc = 0;
		float arca;
		float maxa = 0;
		float maxu = 0;
		
		//-----------------------------------------
		// Try different unit and arc adjustments,
		// save the one that produces a maximum
		// confidence reading...
		//-----------------------------------------
		int ARCS=10;
		float dARC = 1.0f/(float)ARCS;
		float hdARC = dARC/2.0f;
		for (int u = -2; u <= 2; u++) { 
		 for (int a = 0; a < ARCS; a++) {
			arca = a * ARC * dARC;
			c = readCode(scanner, unit + (unit * hdARC * u), arca);
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
		 readCode(scanner, unit, maxa);
		 this->code = rotateLowest(code, maxa);
		}
		return this->code;
   }

	int Code::readCode(Scanner &scanner, float unit, float arca) {

      float dx, dy;  // direction vector
      float dist;
      int c = 0;
      int sx, sy;
      int bit, bits = 0;
      this->code = -1;

      for (int sector = SECTORS-1; sector >= 0; sector--) {
         dx = (float)cos(ARC * sector + arca);
         dy = (float)sin(ARC * sector + arca);
      
         // Take 8 samples across the diameter of the symbol
         for (int i=0; i<WIDTH; i++) {
            dist = (i - 3.5f) * unit;

            sx = (int)_fround(x + dx * dist);
            sy = (int)_fround(y + dy * dist);
            core[i] = scanner.getSample3x3(sx, sy);
         }

         // white rings
         if (core[1] <= 128 || core[3] <= 128 ||
             core[4] <= 128 || core[6] <= 128) {
            return 0;
         }

         // black ring
         if (core[2] > 128 || core[5] > 128) {
            return 0;
         }

         // compute confidence in core sample
         c += (core[1] + core[3] + core[4] + core[6] + // white rings
               (0xff - core[2]) + (0xff - core[5]));  // black ring

         // data rings
         c += abs(core[7] * 2 - 0xff);

         // opposite data ring
         c += (0xff - abs(core[0] * 2 - 0xff));

         bit = (core[7] > 128)? 1 : 0;
         bits <<= 1;
         bits += bit;
      }

      if (checksum(bits)) {
         this->code = bits;
         return c;
      } else {
         return 0;
      }
   }

	int Code::rotateLowest(int bits, float arca) {
      int min = bits;
      int mask = 0x1fff;

      // slightly overcorrect arc-adjustment
      // ideal correction would be (ARC / 2),
      // but there seems to be a positive bias
      // that falls out of the algorithm.
      arca -= (ARC * 0.65f);      
      this->orientation = 0;
      for (int i=1; i<=SECTORS; i++) {
         bits = (((bits << 1) & mask) |
                 (bits >> (SECTORS - 1)));
         if (bits < min) { 
            min = bits;
            this->orientation = (i * -ARC);
         }
      }

      this->orientation += arca;
      return min;
   }   
	int Scanner::getSample3x3(int x, int y) {
		int w=image->width;
		int h=image->height;
		if (x < 1 || x > w-2 || y < 1 || y >= h-2) return 0;
		int pixel, sum = 0;      
		for (int j=y-1; j<=y+1; j++) {
		 for (int i=x-1; i<=x+1; i++) {
			pixel = gData[j * w + i];
			if ((pixel & 0x01000000) > 0) {
			   sum += 0xff;
			}
		 }
		}
		return (sum / 9);
   }
	bool Code::checksum(int bits) {
      int sum = 0;
      for (int i=0; i<SECTORS; i++) {
         sum += (bits & 0x01);
         bits = bits >> 1;
      }
      return (sum == 5);
   }

	float Code::readUnit(Scanner &scanner) { 
      int sx = _iround(x);
      int sy = _iround(y);
      int iwidth = scanner.getImageWidth();
      int iheight = scanner.getImageHeight();

      bool whiteL = true;
      bool whiteR = true;
      bool whiteU = true;
      bool whiteD = true;  
      int sample;
      int distL = 0, distR = 0, distU = 0, distD = 0;

      for (int i=1; true; i++) {
         if (sx - i < 1 || sx + i >= iwidth - 1 ||
             sy - i < 1 || sy + i >= iheight - 1 ||
             i > 100) {
            return -1;
         }

         // Left sample
         sample = scanner.getBW3x3(sx - i, sy);
         if (distL <= 0) { 
            if (whiteL && sample == 0) {
               whiteL = false;
            } else if (!whiteL && sample == 1) {
               distL = i;
            }
         }

         // Right sample
         sample = scanner.getBW3x3(sx + i, sy);
         if (distR <= 0) { 
            if (whiteR && sample == 0) {
               whiteR = false;
            } else if (!whiteR && sample == 1) {
               distR = i;
            }
         }

         // Up sample
         sample = scanner.getBW3x3(sx, sy - i);
         if (distU <= 0) {
            if (whiteU && sample == 0) {
               whiteU = false;
            } else if (!whiteU && sample == 1) {
               distU = i;
            }
         }
         
         // Down sample
         sample = scanner.getBW3x3(sx, sy + i);
         if (distD <= 0) {
            if (whiteD && sample == 0) {
               whiteD = false;
            } else if (!whiteD && sample == 1) {
               distD = i;
            }
         }

		 // gonen: new code
		 if (distR > 0 && distL > 0 && distU > 0 && distD > 0) {
			return (distR + distL + distU + distD) / 8.0f;
		 }
		 /* gonen: removed because rejected too many good codes
         if (distR > 0 && distL > 0 && distU > 0 && distD > 0) {
            float u = (distR + distL + distU + distD) / 8.0f;
            if (abs(distR + distL - distU - distD) > u) {				
				return -1;
            } else {
               return u;
            }
         }
		 */
      }
   }

	int Scanner::getBW3x3(int x, int y) { 
      if (x < 1 || x > image->width-2 || y < 1 || y >= image->height-2) return 0;
      int pixel, sum = 0;    
      for (int j=y-1; j<=y+1; j++) {
         for (int i=x-1; i<=x+1; i++) {
            pixel = gData[j * image->width + i];
            sum += ((pixel >> 24) & 0x01);
         }
      }
      return (sum >= 5) ? 1 : 0;
   }


	int Scanner::ydist(int x, int y, int d) {
      int sample;
      int start = getBW3x3(x, y);
      for (int j=y+d; j>1 && j<image->height-1; j+=d) {
         sample = getBW3x3(x, j);
         if (start + sample == 1) {			
            return (d > 0) ? j - y : y - j;
         }
      }
      return -1;
   }

   int Scanner::xdist(int x, int y, int d) {
      int sample;
      int start = getBW3x3(x, y);
      
      for (int i=x+d; i>1 && i<image->width-1; i+=d) {
         sample = getBW3x3(i, y);
         if (start + sample == 1) { 
            return (d > 0) ? i - x : x - i;
         }
      }
      return -1;
   }

   Scanner::Scanner(): gData(NULL), 

	   spotMap(NULL), maxu(MAXU), image(NULL),
	   mCodeFactory(NULL)
   {
	   setupCodeMap(mCodeMap);
   }
   Scanner::~Scanner() {
	   clear();
   }
   void Scanner::clear() {
   	   if (gData != NULL) {
   		 free(gData);
		 free(spotMap);
	   }
	   spotMap = NULL;
	   gData = NULL;
   }

	std::vector<Code*> Scanner::scan(	const Image  *image, 
									ScanListener *l, 
									Image        *annotate) {
		clear();
		this->image = image;
		if (NULL==gData) {
			gData = (unsigned int*)malloc(image->width*image->height*sizeof(unsigned int));
			spotMap = (unsigned char*)malloc(image->width*image->height);
		}
		memset(gData, 0, image->width*image->height*sizeof(unsigned int));
		memset(spotMap, 0, image->width*image->height);
		TIME_COMMAND("threshold", threshold();)
		std::vector<Code*> codes;
		TIME_COMMAND("findCodes", codes = findCodes(l);)
		return codes;
	}
	void Scanner::threshold() {

      int threshold, sum = 128;
      int s = 30;
      int k;
      int b1, w1, b2, level, dk;
	  int w=image->width;
	  int h=image->height;
	  float f = 0.975f;
	  int r,g,b,a;

	  // copy one byte to 4 bytes
	  k=0;
	  for (int j=0; j<h; j++) 
		  for (int i=0; i<w; i++) {
			r = g = b = image->ucdata[k];
			gData[k] = (r<<16) | (g<<8) | (b);
			++k;
		  }

	  int pixel;
	  k=0;
      for (int j=0; j<h; j++) {
         level = b1 = b2 = w1 = 0;
         //----------------------------------------
         // Process rows back and forth (alternating
         // left-to-right, right-to-left)
         //----------------------------------------
         k = (j % 2 == 0) ? 0 : w-1;
         k += (j * w);         
         for (int i=0; i<w; i++) { 
            pixel = gData[k];           
            r = (pixel >> 16) & 0xff;
            g = (pixel >> 8) & 0xff;
            b = pixel & 0xff;
            a = (r + g + b) / 3;

            //----------------------------------------
            // Calculate sum as an approximate sum
            // of the last s pixels
            //----------------------------------------
            sum += a - (sum / s);
         
            //----------------------------------------
            // Factor in sum from the previous row
            //----------------------------------------
            if (k >= w) {
               threshold = (sum + (gData[k-w] & 0xffffff)) / (2*s);
            } else {
               threshold = sum / s;
            }
            
            //----------------------------------------
            // Compare the average sum to current pixel
            // to decide black or white
            //----------------------------------------
            double f = 0.975;
            a = (a < threshold * f)? 0 : 1;

            //----------------------------------------
            // Repack pixel data with binary data in 
            // the alpha channel, and the running sum
            // for this pixel in the RGB channels
            //----------------------------------------
            gData[k] = (a << 24) + (sum & 0xffffff);

            switch (level) {
               
            // On a white region. No black pixels yet
            case 0:
               if (a == 0) {  // First black encountered
                  level = 1;
                  b1 = 1;
                  w1 = 0;
                  b2 = 0;
               }
               break;

            // On first black region
            case 1:
               if (a == 0) {
                  b1++;
               } else {
                  level = 2;
                  w1 = 1;
               }
               break;

            // On second white region (bulls-eye of a code?)
            case 2:
               if (a == 0) {
                  level = 3;
                  b2 = 1;
               } else {
                  w1++;
               }
               break;
               
            // On second black region
            case 3:
               if (a == 0) {
                  b2++;
               }
               // This could be a top code
               else {
                  int mask;
                  if (b1 >= 2 && b2 >= 2 &&  // less than 2 pixels... not interested
                      b1 <= maxu && b2 <= maxu && w1 <= (maxu + maxu) &&
                      abs(b1 + b2 - w1) <= (b1 + b2) &&
                      abs(b1 + b2 - w1) <= w1 &&
                      abs(b1 - b2) <= b1 &&
                      abs(b1 - b2) <= b2) {
                     mask = 0x2000000;

                     dk = 1 + b2 + w1/2;
                     if (j % 2 == 0) {
                        dk = k - dk; 
                     } else {
                        dk = k + dk;
                     }
                     
                     gData[dk - 1] |= mask;
                     gData[dk    ] |= mask;
                     gData[dk + 1] |= mask;
                  }
                  b1 = b2;
                  w1 = 1;
                  b2 = 0;
                  level = 2;
               }
               break;
            }
            k += (j % 2 == 0) ? 1 : -1;
         }
      }
   }

   std::vector<Code*> Scanner::findCodes(ScanListener *l) {
		std::vector<Code*> spots;
		int w=image->width;
		int h=image->height;
		Code *spot = NULL;
		if (mCodeFactory) {
			spot = mCodeFactory->create();
		}
		else {
			spot = new Code();
		}
		if (l) l->onBegin();
		int k = w * 2;	  // start from third row.
		unsigned char *spotMapPtr = spotMap+k;
		bool overlap;
		for (int j=2; j<h-2; j++) {
			for (int i=0; i<w; i++) {
				overlap = *spotMapPtr>0; // FAST OVERLAP QUERY 
				if (!overlap && 
					(gData[k]  &0x2000000) && 
					(gData[k-1]&0x2000000) && 
					(gData[k+1]&0x2000000) && 
					(gData[k-w]&0x2000000) && 
					(gData[k+w]&0x2000000)) {
					spot->decode(*this, i, j);		
					if (spot->isValid()) {
						spot->x = i;
						spot->y = j;
						// COLOR MAP FOR FAST OVERLAP QUERY 
						colorSpotMap(i, j, spot, spotMapPtr);
						if (l) {
							// use listener
							if (l->onNewCode(spot)!=0) {
								return spots;
							}
						}
						else {
							// no listener
							spots.push_back(spot);
						}
						if (mCodeFactory) {
							spot = mCodeFactory->create();
						}
						else {
							spot = new Code();
						}
					}
					else {
					}
				}
				k++;
				spotMapPtr++;
			}
		}
		if (l) l->onEnd();
		return spots;
   }	

	void Scanner::colorSpotMap(int x, int y, Code *spot, unsigned char *spotMapPtr) {
		int radius = 2*(int)spot->unit;
		int c0 = (x>=radius) ? radius : x;
		int c1 = (x+radius<image->width)  ? radius : image->width-x;
		int radius_c = c0+c1;

		int r0 = (y>=radius) ? radius : y;
		int r1 = (y+radius<image->height) ? radius : image->height-y;
		int radius_r = r0+r1;

		unsigned char *spotMapPtrChange = spotMapPtr - (int)(r0) * image->width - (int)(c0);
		for (int RR=0; RR<radius_r;++RR) {
			memset(spotMapPtrChange, 0xFF, radius_c);
			spotMapPtrChange+=image->width;
		}
	}
   Code::Code() : x(0), y(0), code(-1), SECTORS(13), 
			WIDTH(_WIDTH), unit(72.0f/(float)WIDTH), 
			PI(22.0f/7.0f), ARC(2.0f*PI/SECTORS), orientation(0.f) {
	}

   unsigned short Scanner::code_map(unsigned short original_code) {
	   if (original_code>=1190) {
		   fprintf(stderr, "Error in code_map: code should be between 31 and 1189\n");
		   return 100;
	   }
	   return mCodeMap[original_code];
   }
   Code* Code::clone() const {
	   return new Code(*this);
   }

   void Scanner::disposeCodes(std::vector<Code*> &codes) {
	   	std::vector<TopCodes::Code*>::iterator it = codes.begin();
		while (it != codes.end()) {					
			TopCodes::Code *code = (*it);
			delete code;
			++it;
		}
		codes.clear();
   }
}
