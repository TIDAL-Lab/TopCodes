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
// #import <Foundation/Foundation.h>
#import <opencv2/highgui/highgui.hpp>
#include <string>

class TopCode {

public:

  /* Symbol's id code or -1 if invalid */
  int code;
   
  /* Width of a single ring in pixels */
  double unit;
   
  /* Angular orientation of the topcode in radians */
  double orientation;
   
  /* Center of the symbol in pixels */
  double x, y;

  TopCode();

  TopCode(double cx, double cy);

  TopCode(TopCode *other);

  double getCenterX() { return x; }

  double getCenterY() { return y; }

  double getDiameter();

  double getRadius();

  int isValid() { return code > 0; }

  int contains(double tx, double ty);

  void draw(cv::Mat &image);

  int decode(cv::Mat &image);

  std::string toJSON();

private:

  int readCode(cv::Mat &image, double arca);

  int rotateLowest(int bits, double arca);

};


std::ostream& operator<<(std::ostream &strm, const TopCode &top);
