/*
 * Tern Tangible Programming Language
 * Copyright (c) 2016 Michael S. Horn
 * 
 *           Michael S. Horn (michael-horn@northwestern.edu)
 *           Northwestern University
 *           2120 Campus Drive
 *           Evanston, IL 60613
 * 
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License (version 2) as
 * published by the Free Software Foundation.
 * 
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
 */
part of topcodes;



/**
 * Scan a bitmap image for TopCodes
 */
class Scanner {

  ImageData _image;
  int w, h;

  
  Scanner() { }
  
/*
 * Scan the image and return a list of all topcodes found.
 */
  List<TopCode> scan(ImageData id, CanvasRenderingContext2D ctx) {
    _image = id;
    w = _image.width;
    h = _image.height;

    // adaptive threshold
    List<Candidate> candidates = threshold();

    // test all candidate spots
    List<TopCode> codes = new List<TopCode>();

    for (Candidate c in candidates) {
      if (!overlaps(codes, c.x, c.y)) {
        TopCode top = new TopCode();
        top.decode(this, c.x, c.y);
        if (top.isValid) {

          // reject topcodes too close to the edges
          if (top.x > top.radius &&
              top.x < w - top.radius &&
              top.y > top.radius &&
              top.y < h - top.radius) {
            codes.add(top);
          }
        }
      }
    }
    return codes;
  }
  
  
/*
 * Returns true if point (x, y) is in an existing topcode
 */
  bool overlaps(List<TopCode> codes, int x, int y) {
    for (TopCode top in codes) {
      if (top.contains(x.toDouble(), y.toDouble())) return true;
    }
    return false;
  }
  

/*
 * Perform Wellner adaptive thresholding to produce binary pixel
 * data.  Also mark candidate spotcode locations.
 *
 * "Adaptive Thresholding for the DigitalDesk"   
 * EuroPARC Technical Report EPC-93-110
 */
  List<Candidate> threshold() {
    List<Candidate> candidates = new List<Candidate>();
    
    int r, g, b, a;
    int threshold, sum = 128;
    int k = 0;
    int b1, w1, b2, level, dk;

    for (int j=0; j<h; j++) {
      level = b1 = b2 = w1 = 0;
  
      k = (j % 2 == 0) ? 0 : w - 1;
      k += (j * w);

      for (int i=0; i<w; i++) {
  
        r = _image.data[k * 4];
        g = _image.data[k * 4 + 1];
        b = _image.data[k * 4 + 2];
        a = (r + g + b);

        sum += a - (sum >> 3);
                    
        threshold = (sum >> 3);
        
        r = (r & 0xfe);
        a = (a < threshold * 0.975)? 0 : 1;
        
        // store threshold data in the R pixel
        _image.data[k * 4] = r + a;
        
        switch (level) {
          
          // On a white region. No black pixels yet
          case 0:
            if (a == 0) {  // first black patch encountered
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
          
          // On second white region (bulls-eye?)
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
            else {  // This could be a top code
              if (b1 >= 4 && b2 >= 4 && w1 >= 6 &&
                  (b1 + b2 - w1) <= (b1 + b2) &&
                  (b1 + b2 - w1) <= w1 &&
                  (b2 - b1) <= b1 &&
                  (b1 - b2) <= b2) {
                
                dk = 1 + b2 + (w1>>1);
                if (j % 2 == 0) {
                  dk = k - dk;
                } else {
                  dk = k + dk;
                }
                
                // add candidate
                candidates.add(new Candidate(dk % w, j));
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

    return candidates;
  }
  
  
/*
 * Average of thresholded pixels in a 3x3 region around x,y
 */
  int getSample3x3(int x, int y) {
    if (x < 1 || x > w-2 || y < 1 || y > h-2) return 0;
    int sum = 0;
    int p;
    
    for (int j=y-1; j<=y+1; j++) {
      for (int i=x-1; i<=x+1; i++) {
        p = _image.data[((j * w) + i) * 4];
        sum += (p & 0x01) * 0xff;
      }
    }
    return sum ~/ 9;
  }
  
  
/*
 * Counts the number of pixels from (x, y) until a color change
 */
  int dist(int x, int y, int dx, int dy) {
    int k = y * w + x;
    int p;
    int dist = 0;
    int start = _image.data[k * 4] & 0x01;
    bool changed = false;
    
    while (true) {
      k += (dx + dy * w);
      dist++;
      if (k <= 0 || k >= w * h) {
        return dist;
      } else {
        p = _image.data[k * 4] & 0x01;
        if (p != start) {
          if (changed) {
            return dist;
          } else {
            changed = true;
            start = _image.data[k * 4] & 0x01;
          }
        }
      }
    }
  }
}


class Candidate {
  int x, y;
  
  Candidate(this.x, this.y);
}

