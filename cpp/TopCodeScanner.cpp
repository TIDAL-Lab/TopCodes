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
#import "TopCodeScanner.h"
#import "TopCode.h"
#include <iostream>

using namespace cv;

TopCodeScanner::TopCodeScanner() {
}


TopCodeScanner::~TopCodeScanner() {
}


std::vector<TopCode *> *TopCodeScanner::scan(Mat &image) {

    cleanup();
    _candidates.clear();
    _codes.clear();

    threshold(image);
    
    for (int i=0; i<_candidates.size(); i++) {
        TopCode *top = _candidates[i];
        int overlap = 0; // false
        for (int j=0; j<_codes.size(); j++) {
            if (_codes[j]->contains(top->x, top->y)) {
                overlap = 1; // true
                break;
            }
        }
        if (!overlap) {
            top->decode(image);
            if (top->isValid()) {
                _codes.push_back(new TopCode(top));
                top->draw(image);
                //std::cout << top->toJSON();
                //std::cout << (*top) << std::endl;
            }
        }

        // cleanup candidates array
        _candidates[i] = NULL;
        delete top;
    }
    return &_codes;
}


void TopCodeScanner::cleanup() {
    for (int i=0; i<_codes.size(); i++) {
        if (_codes[i] != NULL) {
            delete _codes[i];
        }
        _codes[i] = NULL;
    }
}


/*
 * Compute a Wellner adaptive threshold for the image and store the
 * binary threshold pixel in the lowest order bit of each pixel.
 * Returns a list of candidate TopCodes
 */
void TopCodeScanner::threshold(Mat &image)
{

    int pixel, threshold, sum = 128;
    int b1, w1, b2, level, dk;
    
    for (int i=0; i<image.rows; i++) {
        
        level = b1 = b2 = w1 = 0;
        uchar * ptr = image.ptr(i);
        
        for (int j=0; j<image.cols; j++) {
            pixel = ptr[j]; 
            sum += pixel - (sum >> 3);
            threshold = (sum >> 3);
            
            pixel = (pixel < threshold * 0.87) ? 0 : 1;
            ptr[j] = pixel ? 255 : 200;
            
            switch (level) {
                    
            // On a white region. No black pixels yet
            case 0:
                if (pixel == 0) {  // first black patch encountered
                    level = 1;
                    b1 = 1;
                    w1 = 0;
                    b2 = 0;
                }
                break;
                
            // On first black region
            case 1:
                if (pixel == 0) {
                    b1++;
                } else {
                    level = 2;
                    w1 = 1;
                }
                break;
                
            // On second white region (bulls-eye?)
            case 2:
                if (pixel == 0) {
                    level = 3;
                    b2 = 1;
                } else {
                    w1++;
                }
                break;
                
            // On second black region
            case 3:
                if (pixel == 0) {
                    b2++;
                }
                else {  // This could be a top code
                    if (b1 >= 2 && b2 >= 2 && w1 >= 4 &&
                        (b1 + b2 - w1) <= w1 &&
                        (b2 - b1) <= b1 &&
                        (b1 - b2) <= b2) {
                        // add candidate
                        dk = j - (1 + b2 + (w1>>1));
                        _candidates.push_back(new TopCode(dk, i));
                        //ptr[dk] = 0; 
                    }
                    b1 = b2;
                    w1 = 1;
                    b2 = 0;
                    level = 2;
                }
                break;
            }  
        }
    }
}

