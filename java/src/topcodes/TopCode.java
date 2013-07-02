/*
 * @(#) TopCode.java
 * 
 * Tangible Object Placement Codes (TopCodes)
 * Copyright (c) 2007 Michael S. Horn
 * 
 *           Michael S. Horn (michael.horn@tufts.edu)
 *           Tufts University Computer Science
 *           161 College Ave.
 *           Medford, MA 02155
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

import java.awt.Color;
import java.awt.BasicStroke;
import java.awt.Graphics2D;
import java.awt.geom.Arc2D;
import java.awt.geom.Line2D;
import java.awt.geom.Ellipse2D;
import java.awt.geom.Rectangle2D;


/**
 * TopCodes (Tangible Object Placement Codes) are black-and-white
 * circular fiducials designed to be recognized quickly by
 * low-resolution digital cameras with poor optics. The TopCode symbol
 * format is based on the open SpotCode format:
 *
 *  http://www.highenergymagic.com/spotcode/symbols.html
 *
 * Each TopCode encodes a 13-bit number in a single data ring on the
 * outer edge of the symbol. Zero is represented by a black sector and
 * one is represented by a white sector.
 *
 * @author Michael Horn
 * @version $Revision: 1.4 $, $Date: 2007/10/15 13:12:30 $
 */
public class TopCode {

   /** Number of sectors in the data ring */
   protected static int SECTORS = 13;

   /** Width of the code in units (ring widths) */
   protected static int WIDTH = 8;
   
   protected static float PI = (float)Math.PI;
   
   /** Span of a data sector in radians */
   protected static float ARC = (2 * PI / SECTORS);

   /** The symbol's code, or -1 if invalid. */
   protected int code;

   /** The width of a single ring. */
   protected float unit;
   
   /** The angular orientation of the symbol (in radians) */
   protected float orientation;

   /** Horizontal center of a symbol */
   protected float x;

   /** Vertical center of a symbol */
   protected float y;

   /** Buffer used to decode sectors */
   protected int [] core;


/**
 * Default constructor
 */
   public TopCode() {
      this.code = -1;
      this.unit = 72.0f / WIDTH;
      this.orientation = 0;
      this.x = 0;
      this.y = 0;
      this.core = new int[WIDTH];
   }


/**
 * Create a TopCode with the given id number.
 */
   public TopCode(int code) {
      this();
      this.code = code;
   }

   
/**
 * Returns the ID number for this symbol.  Calling the decode()
 * function will set this value automatically.
 */
   public int getCode() {
      return this.code;
   }

/**
 * Sets the ID number for this symbol.
 */
   public void setCode(int code) {
      this.code = code;
   }


   
/**
 * Returns the orientation of this code in radians and accurate
 * to about plus or minus one degree.  This value gets set
 * automatically by the decode() function.
 */
   public float getOrientation() {
      return this.orientation;
   }

/**
 * Sets the angular orientation of this code in radians.
 */
   public void setOrientation(float orientation) {
      this.orientation = orientation;
   }


   
/**
 * Returns the diameter of this code in pixels.  This value
 * will be set automatically by the decode() function.
 */
   public float getDiameter() {
      return this.unit * WIDTH;
   }
   
/**
 * Sets the diameter of this code in pixels.
 */
   public void setDiameter(float diameter) {
      this.unit = diameter / WIDTH;
   }


   
/**
 * Returns the x-coordinate for the center point of the symbol.
 * This gets set automatically by the decode() function.
 */
   public float getCenterX() {
      return this.x;
   }

/**
 * Returns the y-coordinate for the center point of the symbol.
 * This gets set automatically by the decode() function.
 */
   public float getCenterY() {
      return this.y;
   }

/**
 * Sets the x- and y-coordinates for the center point of the symbol.
 */
   public void setLocation(float x, float y) {
      this.x = x;
      this.y = y;
   }

   
/**
 * Returns true if this code was sucessfully decoded.
 */
   public boolean isValid() {
      return this.code > 0;
   }
   
   
/**
 * Decodes a symbol given any point (cx, cy) inside the center
 * circle (bulls-eye) of the code.  
 */
   public int decode(Scanner scanner, int cx, int cy) {

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

      this.x = cx;
      this.y = cy;
      this.x += (right - left) / 6.0f;
      this.y += (down - up) / 6.0f;
      this.unit = readUnit(scanner);
      this.code = -1;
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
      for (int u = -2; u <= 2; u++) { 
         for (int a = 0; a < 10; a++) {
            arca = a * ARC * 0.1f;
            c = readCode(scanner,
                         unit + (unit * 0.05f * u),
                         arca);
            if (c > maxc) { 
               maxc = c;
               maxa = arca;
               maxu = unit + (unit * 0.05f * u);
            }
         }
      }
         
      // One last call to readCode to reset orientation and code
      if (maxc > 0) {
         unit = maxu;
         readCode(scanner, unit, maxa);
         this.code = rotateLowest(code, maxa);
      }
      
      return this.code;
   }

   
   
/**
 * Attempts to decode the binary pixels of an image into a code
 * value.
 *
 * scanner - image scanner
 * unit    - width of a single ring (codes are 8 units wide)
 * arca    - Arc adjustment.  Rotation correction delta value.    
 */
   protected int readCode(Scanner scanner, float unit, float arca) {

      float dx, dy;  // direction vector
      float dist;
      int c = 0;
      int sx, sy;
      int bit, bits = 0;
      this.code = -1;

      for (int sector = SECTORS-1; sector >= 0; sector--) {
         dx = (float)Math.cos(ARC * sector + arca);
         dy = (float)Math.sin(ARC * sector + arca);
      
         // Take 8 samples across the diameter of the symbol
         for (int i=0; i<WIDTH; i++) {
            dist = (i - 3.5f) * unit;

            sx = (int)Math.round(x + dx * dist);
            sy = (int)Math.round(y + dy * dist);
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
         c += Math.abs(core[7] * 2 - 0xff);

         // opposite data ring
         c += (0xff - Math.abs(core[0] * 2 - 0xff));

         bit = (core[7] > 128)? 1 : 0;
         bits <<= 1;
         bits += bit;
      }

      if (checksum(bits)) {
         this.code = bits;
         return c;
      } else {
         return 0;
      }
   }

      
/**
 * rotateLowest() tries each of the possible rotations and returns
 * the lowest.  
 */
   protected int rotateLowest(int bits, float arca) {
      int min = bits;
      int mask = 0x1fff;

      // slightly overcorrect arc-adjustment
      // ideal correction would be (ARC / 2),
      // but there seems to be a positive bias
      // that falls out of the algorithm.
      arca -= (ARC * 0.65f);
      
      this.orientation = 0;

      for (int i=1; i<=SECTORS; i++) {

         bits = (((bits << 1) & mask) |
                 (bits >> (SECTORS - 1)));
         if (bits < min) { 
            min = bits;
            this.orientation = (i * -ARC);
         }
      }

      this.orientation += arca;
      return min;
   }
   
   
/**
 * Only codes with a checksum of 5 are valid
 */
   protected boolean checksum(int bits) {
      int sum = 0;
      for (int i=0; i<SECTORS; i++) {
         sum += (bits & 0x01);
         bits = bits >> 1;
      }
      return (sum == 5);
   }

   
/**
 * Returns true if the given point is inside the bulls-eye
 */
   protected boolean inBullsEye(float px, float py) {
      return (((x - px) * (x - px) + (y - py) * (y - py)) <= (unit * unit));
   }


/**
 * Determines the symbol's unit length by counting the number
 * of pixels between the outer edges of the first black ring. 
 * North, south, east, and west readings are taken and the average
 * is returned.
 */
   protected float readUnit(Scanner scanner) { 
      int sx = (int)Math.round(x);
      int sy = (int)Math.round(y);
      int iwidth = scanner.getImageWidth();
      int iheight = scanner.getImageHeight();

      boolean whiteL = true;
      boolean whiteR = true;
      boolean whiteU = true;
      boolean whiteD = true;  
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

         if (distR > 0 && distL > 0 && distU > 0 && distD > 0) {
            float u = (distR + distL + distU + distD) / 8.0f;
            if (Math.abs(distR + distL - distU - distD) > u) {
               return -1;
            } else {
               return u;
            }
         }
      }
   }


   public void annotate(Graphics2D g, Scanner scanner) {
      float dx, dy;
      float dist;
      int sx, sy;
      int bits = 0;

      for (int sector=SECTORS-1; sector>=0; sector--) {
         dx = (float)Math.cos(ARC * sector + orientation);
         dy = (float)Math.sin(ARC * sector + orientation);
      
         // Take 8 samples across the diameter of the symbol
         int sample = 0;
         for (int i=3; i<WIDTH; i++) {
            dist = (i - 3.5f) * unit;

            sx = (int)Math.round(x + dx * dist);
            sy = (int)Math.round(y + dy * dist);
            sample = scanner.getBW3x3(sx, sy);
            
            g.setColor((sample == 0) ? Color.BLACK : Color.WHITE);
            Rectangle2D rect = new Rectangle2D.Float(
               sx - 0.6f, sy - 0.6f, 1.2f, 1.2f);
            g.fill(rect);
            g.setColor(Color.RED);
            g.setStroke(new BasicStroke(0.25f));
            g.draw(rect);
         }
      }
   }

   
/**
 * Draws this spotcode with its current location and orientation
 */
   public void draw(Graphics2D g) {

      int bits = this.code;

      Arc2D arc = new Arc2D.Float(Arc2D.PIE);
      float sweep = 360.0f / SECTORS;
      float sweepa = (-orientation * 180 / PI);

      float r = WIDTH * 0.5f * unit;
      

      Ellipse2D circ = new Ellipse2D.Float(
         x - r, y - r, r * 2, r * 2);
      g.setColor(Color.white);
      g.fill(circ);
      
      for (int i=SECTORS-1; i>=0; i--) {
         arc.setArc(x - r, y - r, r * 2, r * 2,
                    i * sweep + sweepa, sweep, Arc2D.PIE);
         g.setColor(((bits & 0x1) > 0)? Color.white : Color.black);
         g.fill(arc);
         bits >>= 1;
      }

      r -= unit;
      g.setColor(Color.white);
      circ.setFrame(x - r, y - r, r * 2, r * 2);
      g.fill(circ);

      r -= unit;
      g.setColor(Color.black);
      circ.setFrame(x - r, y - r, r * 2, r * 2);
      g.fill(circ);

      r -= unit;
      g.setColor(Color.white);
      circ.setFrame(x - r, y - r, r * 2, r * 2);
      g.fill(circ);
   }



/**
 * Debug routine that prints the 13 least significant bits of a
 * integer.    
 */
   protected void printBits(int bits) {
      for (int i=SECTORS-1; i>=0; i--) {
         if (((bits>>i) & 0x01) == 1) {
            System.out.print("1");
         } else {
            System.out.print("0");
         }
         if ((44 - i) % 4 == 0) {
            System.out.print(" ");
         }
      }
      System.out.println(" = " + bits);
   }


   
/**
 * Generates a list of all valid TopCodes
 */
   public static TopCode [] generateCodes() {

      int n = 99, base = 0; 
      TopCode [] list = new TopCode[n];
      TopCode code = new TopCode();

      int bits;
      int count = 0;
      
      while (count < n) {
         bits = code.rotateLowest(base, 0);

         // Found a valid code
         if (bits == base && code.checksum(bits)) {
            code.setCode(bits);
            code.setOrientation(0);
            list[count++] = code;
            code = new TopCode();
         }

         // Try next value
         base++;
      }
      return list;
   }
}
