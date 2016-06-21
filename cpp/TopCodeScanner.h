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
#import <opencv2/highgui/highgui.hpp>
#include <vector>

class TopCode;

class TopCodeScanner {

public:

  TopCodeScanner();

  ~TopCodeScanner();

/*
 * Scans a bitmap and returns a list of TopCode objects contained in the image
 */
  std::vector<TopCode *> *scan(cv::Mat &image);

/*
 * Release memory used to store topcodes after each scan
 */
  void cleanup();   

private:

  std::vector<TopCode *> _codes;

  std::vector<TopCode *> _candidates;

  void threshold(cv::Mat &image);

};

