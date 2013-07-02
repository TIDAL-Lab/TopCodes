/*
 * @(#) Scanner.java
 * 
 * Tangible Object Placement Codes (TopCodes)
 * Copyright (c) 2011 Michael S. Horn
 * 
 *           Michael S. Horn (michael.horn@tufts.edu)
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
package topcodes;

import java.util.List;
import android.graphics.Bitmap;

/**
 * Loads and scans images for TopCodes.  The algorithm does a single
 * sweep of an image (scanning one horizontal line at a time) looking
 * for a TopCode bullseye patterns.  If the pattern matches and the
 * black and white regions meet certain ratio constraints, then the
 * pixel is tested as the center of a candidate TopCode.
 *
 * @author Michael Horn
 */
public class Scanner {


   /** Total width of image */
   protected int w;

   /** Total height of image */
   protected int h;

   /** Holds processed binary pixel data */
   protected int[] data;

   /** Candidate code count */
   protected int ccount;

   /** Number of candidates tested */
   protected int tcount;

   /** Maximum width of a TopCode unit in pixels */
   protected int maxu;
   


/**
 * Default constructor
 */
   public Scanner() {
      this.w       = 0;
      this.h       = 0;
      this.data    = null;
      this.ccount  = 0;
      this.tcount  = 0;
      this.maxu    = 80;
   }


/**
 * Scan the given image and return a list of all topcodes found in it.
 */
   public List<TopCode> scan(Bitmap image) {
      this.w       = image.getWidth();
      this.h       = image.getHeight();
      if (data == null || data.length < w * h) {
         this.data  = new int[w * h];
      }
      image.getPixels(this.data, 0, w, 0, 0, w, h);
      
      threshold();          // run the adaptive threshold filter
      return findCodes();   // scan for topcodes
   }


/**
 * Returns the width in pixels of the current image (or zero if no image is
 * loaded).
 */
   public int getImageWidth() {
      return this.w;
   }

   
/**
 * Returns the width in pixels of the current image (or zero if no image is
 * loaded).
 */
   public int getImageHeight() {
      return this.h;
   }
   

/**
 * Sets the maximum allowable diameter (in pixels) for a TopCode
 * identified by the scanner.  Setting this to a reasonable value for
 * your application will reduce false positives (recognizing codes that
 * aren't actually there) and improve performance (because fewer
 * candidate codes will be tested).  Setting this value to as low as 50
 * or 60 pixels could be advisable for some applications.  However,
 * setting the maximum diameter too low will prevent valid codes from
 * being recognized.  The default value is 640 pixels.
 */
   public void setMaxCodeDiameter(int diameter) {
      float f = diameter / 8.0f;
      this.maxu = (int)Math.ceil(f);
   }

   
/**
 * Returns the number of candidate topcodes found during a scan
 */
   protected int getCandidateCount() {
      return this.ccount;
   }


/**
 * Returns the number of topcodes tested during a scan
 */
   protected int getTestedCount() {
      return this.tcount;
   }


/**
 * Binary (thresholded black/white) value for pixel (x,y)   
 */
   protected int getBW(int x, int y) {
      int pixel = data[y * w + x];
      return (pixel >> 24) & 0x01;
   }

   
/**
 * Average of thresholded pixels in a 3x3 region around (x,y).
 * Returned value is between 0 (black) and 255 (white).   
 */
   protected int getSample3x3(int x, int y) {
      if (x < 1 || x > w-2 || y < 1 || y >= h-2) return 0;
      int pixel, sum = 0;
      
      for (int j=y-1; j<=y+1; j++) {
         for (int i=x-1; i<=x+1; i++) {
            pixel = data[j * w + i];
            if ((pixel & 0x01000000) > 0) {
               sum += 0xff;
            }
         }
      }
      //return (sum >= 5) ? 1 : 0;
      return (sum / 9);
   }

   
/**
 * Average of thresholded pixels in a 3x3 region around (x,y).
 * Returned value is either 0 (black) or 1 (white).
 */
   protected int getBW3x3(int x, int y) { 
      if (x < 1 || x > w-2 || y < 1 || y >= h-2) return 0;
      int pixel, sum = 0;
      
      for (int j=y-1; j<=y+1; j++) {
         for (int i=x-1; i<=x+1; i++) {
            pixel = data[j * w + i];
            sum += ((pixel >> 24) & 0x01);
         }
      }
      return (sum >= 5) ? 1 : 0;
   }

/**
 * Perform Wellner adaptive thresholding to produce binary pixel
 * data.  Also mark candidate spotcode locations.
 *
 * "Adaptive Thresholding for the DigitalDesk"   
 * EuroPARC Technical Report EPC-93-110
 */
   protected void threshold() {

      int pixel, r, g, b, a;
      int threshold, sum = 128;
      int s = 30;
      int k;
      int b1, w1, b2, level, dk;

      this.ccount = 0;

      for (int j=0; j<h; j++) {
         level = b1 = b2 = w1 = 0;

         //----------------------------------------
         // Process rows back and forth (alternating
         // left-to-right, right-to-left)
         //----------------------------------------
         k = (j % 2 == 0) ? 0 : w-1;
         k += (j * w);
         
         for (int i=0; i<w; i++) { 

            //----------------------------------------
            // Calculate pixel intensity (0-255)
            //----------------------------------------
            pixel = data[k];
            r = (pixel >> 16) & 0xff;
            g = (pixel >> 8) & 0xff;
            b = pixel & 0xff;
            a = (r + g + b) / 3;
            //a = r;
            
            //----------------------------------------
            // Calculate sum as an approximate sum
            // of the last s pixels
            //----------------------------------------
            sum += a - (sum / s);
         
            //----------------------------------------
            // Factor in sum from the previous row
            //----------------------------------------
            if (k >= w) {
               threshold = (sum + (data[k-w] & 0xffffff)) / (2*s);
            } else {
               threshold = sum / s;
            }
            
            //----------------------------------------
            // Compare the average sum to current pixel
            // to decide black or white
            //----------------------------------------
            double f = 0.85;
            f = 0.975;
            a = (a < threshold * f)? 0 : 1;

            //----------------------------------------
            // Repack pixel data with binary data in 
            // the alpha channel, and the running sum
            // for this pixel in the RGB channels
            //----------------------------------------
            data[k] = (a << 24) + (sum & 0xffffff);

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
                      Math.abs(b1 + b2 - w1) <= (b1 + b2) &&
                      Math.abs(b1 + b2 - w1) <= w1 &&
                      Math.abs(b1 - b2) <= b1 &&
                      Math.abs(b1 - b2) <= b2) {
                     mask = 0x2000000;

                     dk = 1 + b2 + w1/2;
                     if (j % 2 == 0) {
                        dk = k - dk; 
                     } else {
                        dk = k + dk;
                     }
                     
                     data[dk - 1] |= mask;
                     data[dk] |= mask;
                     data[dk + 1] |= mask;
                     ccount += 3;  // count candidate codes
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
      
/**
 * Scan the image line by line looking for TopCodes   
 */
   protected List<TopCode> findCodes() {
      this.tcount = 0;
      List<TopCode> spots = new java.util.ArrayList<TopCode>();

      TopCode spot = new TopCode();
      int k = w * 2;
      for (int j=2; j<h-2; j++) {
         for (int i=0; i<w; i++) {
            if ((data[k] & 0x2000000) > 0) {
               if ((data[k-1] & 0x2000000) > 0 &&
                   (data[k+1] & 0x2000000) > 0 &&
                   (data[k-w] & 0x2000000) > 0 &&
                   (data[k+w] & 0x2000000) > 0) {
/*
               if ((data[k-w] & 0x2000000) > 0 ||
                   (data[k+w] & 0x2000000) > 0)) {
*/                    
                  if (!overlaps(spots, i, j)) {
                     this.tcount++;
                     spot.decode(this, i, j);
                     if (spot.isValid()) {
                        spots.add(spot);
                        spot = new TopCode();
                     }
                  }
               }
            }
            k++;
         }
      }

      return spots;
   }

/**
 * Returns true if point (x,y) is in an existing TopCode bullseye   
 */
   protected boolean overlaps(List<TopCode> spots, int x, int y) {
      for (TopCode top : spots) {
         if (top.inBullsEye(x, y)) return true;
      }
      return false;
   }
   
/**
 * Counts the number of vertical pixels from (x,y) until a color
 * change is perceived. 
 */
   protected int ydist(int x, int y, int d) {
      int sample;
      int start  = getBW3x3(x, y);

      for (int j=y+d; j>1 && j<h-1; j+=d) {
         sample = getBW3x3(x, j);
         if (start + sample == 1) {
            return (d > 0) ? j - y : y - j;
         }
      }
      return -1;
   }

   
/**
 * Counts the number of horizontal pixels from (x,y) until a color
 * change is perceived. 
 */
   protected int xdist(int x, int y, int d) {
      int sample;
      int start = getBW3x3(x, y);
      
      for (int i=x+d; i>1 && i<w-1; i+=d) {
         sample = getBW3x3(i, y);
         if (start + sample == 1) { 
            return (d > 0) ? i - x : x - i;
         }
      }
      return -1;
   }

}
