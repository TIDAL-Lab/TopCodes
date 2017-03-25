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



class TopCode {
  
  /** Number of sectors in the data ring */
  static final int SECTORS = 13;
  
  /** Width of the code in units (ring widths) */
  static final int WIDTH = 8;
  
  /** Span of a data sector in radians */
  static final double ARC = (2.0 * PI / 13.0);
  
  /** Symbol's id code or -1 if invalid */
  int code = -1;
  
  /** Width of a single ring in pixels */
  double unit = 9.0;
  
  /** Angular orientation of the topcode in radians */
  double orientation = 0.0;

  /** Center of the symbol in pixels */
  double x = 0.0, y = 0.0;
  
  /** Buffer used to decode sectors */
  List<int> core = [ 0, 0, 0, 0, 0, 0, 0, 0 ];
  
  
  TopCode();
  
  
  TopCode.clone(TopCode top) {
    code = top.code;
    unit = top.unit;
    orientation = top.orientation;
    x = top.x;
    y = top.y;
  }


  double get diameter => unit * WIDTH;
         set diameter(double d) => unit = d / WIDTH;

         
  double get radius => unit * WIDTH / 2;
         set radius(double r) => unit = r * 2 / WIDTH;
         

  bool get isValid => code > 0;


  Map toJSON() {
    return { "code" : code, "x" : x, "y" : y, "radius" : radius, "angle" : orientation };
  }
  
  
  bool contains(double tx, double ty) {
    double d = (x - tx) * (x - tx) + (y - ty) * (y - ty);
    double r = unit * 4;
    return (d <= r * r);
  }


  double targetX(num dx, num dy) {
    double d = diameter;
    double o = orientation;
    return (x + dx * d * cos(o) - dy * d * sin(o));
  }


  double angleBetween(TopCode b) {
    return atan2(y - b.y, x - b.x);
  }

   
  double targetY(num dx, num dy) {
    double d = diameter;
    double o = orientation;
    return (y + dx * d * sin(o) + dy * d * cos(o));
  }
   
  
  int decode(Scanner scanner, int cx, int cy) {
    int up    = scanner.dist(cx, cy, 0, -1);
    int down  = scanner.dist(cx, cy, 0, 1);
    int left  = scanner.dist(cx, cy, -1, 0);
    int right = scanner.dist(cx, cy, 1, 0);
    
    x = cx.toDouble();
    y = cy.toDouble();
    x += (right - left) / 2.0;
    y += (down - up) / 2.0;
    unit = (right + left + up + down) / 8.0;
    code = -1;
    
    int c = 0;
    int maxc = 0;
    double arca;
    double maxa = 0.0;
    
    for (int a = 0; a < 5; a++) {
      arca = a * ARC / 5.0;
      c = readCode(scanner, unit, arca);
      if (c > maxc) {
        maxc = c;
        maxa = arca;
      }
    }

    if (maxc > 0) {
      readCode(scanner, unit, maxa);
      code = rotateLowest(code, maxa);
    }

    return code;
  }
  
  
  int readCode(Scanner scanner, double unit, double arca) {
    double dx, dy;
    double dist;
    int c = 0;
    int sx, sy;
    int bit, bits = 0;
    code = -1;
    int checksum = 0;
    
    for (int sector = 0; sector<SECTORS; sector++) {
      dx = cos(ARC * sector + arca);
      dy = sin(ARC * sector + arca);
      
      for (int i=0; i<WIDTH; i++) {
        dist = (i - 3.5) * unit;
        
        sx = (x + dx * dist).round().toInt();
        sy = (y + dy * dist).round().toInt();
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
      
      c += (core[1] + core[3] + core[4] + core[6] +
            (0xff - core[2]) + (0xff - core[5]));
      
      c += (core[7] * 2 - 0xff).abs();
      
      bit = (core[7] > 128)? 1 : 0;
      checksum += bit;
      bits <<= 1;
      bits += bit;
    }
    
    if (checksum == 5) {
      code = bits;
      return c;
    } else {
      return 0;
    }
  }
  

/*
 * Rotates the code to find the lowest resulting number
 */
  int rotateLowest(int bits, double arca) {
    int min = bits;
    int mask = 0x1fff;
    
    // correct arc-adjustment
    arca -= (ARC * 0.5);

    orientation = 0.0;
    
    for (int i=1; i<=SECTORS; i++) {
      bits = (((bits << 1) & mask) | (bits >> (SECTORS - 1)));
      if (bits < min) {
        min = bits;
        this.orientation = (i * ARC);
      }
    }
    
    orientation += arca;
    return min;
  }
  
  
  void draw(CanvasRenderingContext2D ctx, [double scale = 1.0]) {
    int bits = code;
    double u = unit * scale;
    double r = WIDTH * u * 0.5;
    double o = orientation;
    
    // background circle
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, PI * 2, true);
    ctx.fill();

    for (int i=0; i<SECTORS; i++) {
      double start = i * -ARC + o;
      ctx.fillStyle = ((bits & 0x1) > 0)? "white" : "black";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x, y, r, start, start - ARC, true);
      ctx.closePath();
      ctx.fill();
      bits >>= 1;
    }
    
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x, y, r - u, 0, PI * 2, true);
    ctx.fill();
    
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(x, y, r - u * 2, 0, PI * 2, true);
    ctx.fill();
    
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x, y, r - u * 3, 0, PI * 2, true);
    ctx.fill();
    
    /*
    ctx.lineWidth = u * 0.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + cos(o) * r * 1.5,
               y + sin(o) * r * 1.5);
    ctx.strokeStyle = "yellow";
    ctx.stroke();
    */
  }
}