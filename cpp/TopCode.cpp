/*
 * Tangible Object Placement Codes (TopCodes)
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
#import "TopCode.h"
#include <opencv2/imgproc.hpp> 
#include <iostream>

int dist(cv::Mat &image, int x, int y, int dx, int dy);
int getSample3x3(cv::Mat &image, int x, int y);


/* Number of sectors in the data ring */
const int SECTORS = 13;

/* Width of the code in units (ring widths) */
const int WIDTH = 8;

/* Span of a data sector in radians */
const double ARC = (2.0 * M_PI / 13.0);


TopCode::TopCode() {
  code = -1;
  unit = 9.0;
  orientation = 0.0;
  x = 0.0;
  y = 0.0;
}


TopCode::TopCode(double cx, double cy) {
  code = -1;
  unit = 9.0;
  orientation = 0.0;
  x = cx;
  y = cy;
}


TopCode::TopCode(TopCode * other) {
    code = other->code;
    unit = other->unit;
    orientation = other->orientation;
    x = other->x;
    y = other->y;
}


double TopCode::getDiameter() {
  return unit * WIDTH;
}


double TopCode::getRadius() {
  return unit * WIDTH * 0.5;
}


int TopCode::contains(double tx, double ty) {
  double d = (x - tx) * (x - tx) + (y - ty) * (y - ty);
  double r = unit * WIDTH * 0.5;
  return (d <= r * r);
}


void TopCode::draw(cv::Mat &image) {
  cv::circle(image, cv::Point(x, y), unit * WIDTH * 0.65, cv::Scalar( 0, 0, 0, 100 ), -1, 8);
}


/*
 * Attempts to decode a TopCode from an image bitmap.  If successful, code
 * will be a positive integer and the center, unit, and orientation
 * properties will be set. If unsuccessful, code will be -1.
 */
int TopCode::decode(cv::Mat &image) {
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
        score = readCode(image, arca);
        if (score > maxs) {
            maxs = score;
            maxc = code;
            maxa = arca;
        }
    }
    
    if (maxs > 0) {
        code = rotateLowest(maxc, arca);
    }
    return code;
}


int TopCode::readCode(cv::Mat &image, double arca) {
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

        int cut = 128 - 75;
      
        // white rings
        if (core[1] <= cut || core[3] <= cut || core[4] <= cut || core[6] <= cut) {
           return 0;
        }
      
        // black rings
        cut = 128 + 75;
        if (core[2] > cut || core[5] > cut) {
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
int TopCode::rotateLowest(int bits, double arca) {
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
    int h = image.rows;
    int w = image.cols;
    if (x < 1 || x > w-2 || y < 1 || y > h-2) return 0;
    
    //return (image.at<uchar>(y, x) == 255) ? 255 : 0;
    int sum = 0;
    int p;
    
    for (int j=y-1; j<=y+1; j++) {
        for (int i=x-1; i<=x+1; i++) {
            p = (image.at<uchar>(j, i) == 255) ? 1 : 0;
            sum += p;
        }
    }
    return (sum * 255) / 9;
}


/*
 * Counts the number of pixels from (x, y) until a color change
 */
int dist(cv::Mat &image, int x, int y, int dx, int dy) {
    int p;
    int dist = 0;
    int start = (image.at<uchar>(y, x) == 255) ? 1 : 0;
    bool changed = false;
    
    while (true) {
        x += dx;
        y += dy;
        dist++;
        if (x <= 0 || x >= image.cols || y <= 0 || y >= image.rows) {
            return dist;
        } else {
            p = (image.at<uchar>(y, x) == 255) ? 1 : 0;
            if (p != start) {
                if (changed) {
                    return dist;
                } else {
                    changed = true;
                    start = p;
                }
            }
        }
    }
}


std::string TopCode::toJSON() {
    char json[256];
    sprintf(json, 
        "{ \"code\" : %d, \"x\" : %f, \"y\" : %f, \"unit\" : %f, \"angle\" : %f }",
        code, x, y, unit, orientation);
    return std::string(json);
}


std::ostream& operator<<(std::ostream &strm, const TopCode &top) {
    strm << "{ ";
    strm << "\"code\": " << top.code << ", ";
    strm << "\"x\": " << top.x << ", " << "\"y\": " << top.y << ", ";
    strm << "\"unit\": " << top.unit << ", ";
    strm << "\"angle\": " << top.orientation << " }";
    return strm;
}



