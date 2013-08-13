/*
 * Tangible Object Placement Codes (TopCodes)
 * Copyright (c) 2013 Michael S. Horn
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
#import "TopCode.h"


/* Number of sectors in the data ring */
const int SECTORS = 13;

/* Width of the code in units (ring widths) */
const int WIDTH = 8;

/* Span of a data sector in radians */
const double ARC = (2.0 * M_PI / 13.0);



@implementation TopCode
- (id)init
{
    self = [super init];
    if (self) {
        code = -1;
        unit = 9.0;
        orientation = 0.0;
        x = 0.0;
        y = 0.0;
    }
    return self;
}


-(double) getCenterX {
    return x;
}


-(double) getCenterY {
    return y;
}


-(double) getDiameter {
    return unit * WIDTH;
}


-(void) setDiameter:(double)d {
    unit = d / WIDTH;
}


-(double) getRadius {
    return unit * WIDTH / 2;
}


-(void) setRadius:(double)r {
    unit = r * 2 / WIDTH;
}


-(void) setCenter:(double)cx cy:(double)cy {
    x = cx;
    y = cy;
}


-(BOOL) isValid {
    return code > 0;
}


-(BOOL) contains:(double)tx ty:(double)ty {
    double d = (x - tx) * (x - tx) + (y - ty) * (y - ty);
    double r = unit * WIDTH / 2;
    return (d <= r * r);
}


-(void) draw:(cv::Mat &)image {
    cv::circle(image, cv::Point(y, x), unit * WIDTH * 0.65, cv::Scalar( 255, 0, 0, 100 ), -1, 8);
}


-(NSString *)toJSON {
    NSString *f = @"{ \"code\" : %d, \"x\" : %f, \"y\" : %f, \"unit\" : %f, \"orientation\" : %f }";
    return [NSString stringWithFormat:f, code, (x - 100), (600 - y), unit, orientation];
}


/*
 * Attempts to decode a TopCode from an image bitmap.  If successful, code
 * will be a positive integer and the center, unit, and orientation
 * properties will be set. If unsuccessful, code will be -1.
 */
-(int) decode:(cv::Mat &)image {
    int cx    = (int)x;
    int cy    = (int)y;
    int up    = dist(image, cx, cy, 0, -1);
    int down  = dist(image, cx, cy, 0, 1);
    int left  = dist(image, cx, cy, -1, 0);
    int right = dist(image, cx, cy, 1, 0);
    
    x += (right - left) / 2.0;
    y += (down - up) / 2.0;
    unit = (right + left + up + down) / 8.0;
    code = -1;
    
    int score = 0;
    int maxs = 0;      // maximum confidence score so far
    int maxc = -1;     // maximum code so far
    double maxa = 0.0; // maximum arc adjustment so far
    double arca;
    
    for (int a = 0; a < 5; a++) {
        arca = a * ARC / 5.0;
        score = [self readCode:image arca:arca];
        if (score > maxs) {
            maxs = score;
            maxc = code;
            maxa = arca;
        }
    }
    
    if (maxs > 0) {
        code = [self rotateLowest:maxc arca:maxa];
    }
    return code;
}


-(int) readCode:(cv::Mat &)image arca:(double)arca {
    double dx, dy;
    double dist;
    int score = 0;
    int sx, sy;
    int bit, bits = 0;
    int checksum = 0;
    int core[] = { 0, 0, 0, 0, 0, 0, 0, 0 };
    code = -1;
   
    for (int sector = 0; sector<SECTORS; sector++) {
        dx = cos(ARC * sector + arca);
        dy = sin(ARC * sector + arca);
      
        // take a core sample at this orientation
        for (int i=0; i<WIDTH; i++) {
            dist = (i - 3.5) * unit;
            sx = (int)(x + dx * dist);
            sy = (int)(y + dy * dist);
            core[i] = getSample3x3(image, sx, sy);
        }
      
        // white rings
        if (core[1] <= 128 || core[3] <= 128 || core[4] <= 128 || core[6] <= 128) {
           return 0;
        }
      
        // black rings
        if (core[2] > 128 || core[5] > 128) {
            return 0;
        }
 
        // compute running accuracy score for this configuration     
        score += core[1] + core[3] + core[4] + core[6];
        score += (0xff - core[2]) + (0xff - core[5]);
        score += abs(core[7] * 2 - 0xff);

        // decode bits in outer ring
        bit = (core[7] > 128)? 1 : 0;
        checksum += bit;
        bits <<= 1;
        bits += bit;
    }
    
    if (checksum == 5) {
        code = bits;
        return score;
    } else {
        return 0;
    }
}


/*
 * Start with decoded bits and rotate the TopCode to find the orientation that 
 * produces the lowest code.  Returns the lowest code and set the orientation 
 * property
 */
-(int) rotateLowest:(int)bits arca:(double)arca {
    int min = bits;
    int mask = 0x1fff;
   
    arca -= (ARC * 0.5);
    orientation = 0.0;
   
    for (int i=1; i<=SECTORS; i++) {
        bits = (((bits << 1) & mask) | (bits >> (SECTORS - 1)));
        if (bits < min) {
            min = bits;
            orientation = (i * -ARC);
        }
    }
    orientation += arca;
    return min;
}


/*
 * Average of thresholded pixels in a 3x3 region around x,y
 */
int getSample3x3(cv::Mat &image, int x, int y) {
    int w = image.rows;
    int h = image.cols;
    if (x < 1 || x > w-2 || y < 1 || y > h-2) return 0;
    int sum = 0;
    int p;
    
    for (int j=y-1; j<=y+1; j++) {
        for (int i=x-1; i<=x+1; i++) {
            p = image.at<int>(i, j) & 0x01;
            sum += p * 0xff;
        }
    }
    return sum / 9;
}


/*
 * Counts the number of pixels from (x, y) until a color change
 */
int dist(cv::Mat &image, int x, int y, int dx, int dy) {
    int p;
    int dist = 0;
    int start = image.at<int>(x, y) & 0x01;
    bool changed = false;
    
    while (true) {
        x += dx;
        y += dy;
        dist++;
        if (x <= 0 || x >= image.rows || y <= 0 || y >= image.cols) {
            return dist;
        } else {
            p = image.at<int>(x, y) & 0x01;
            if (p != start) {
                if (changed) {
                    return dist;
                } else {
                    changed = true;
                    start = image.at<int>(x, y) & 0x01;
                }
            }
        }
    }
}


@end
