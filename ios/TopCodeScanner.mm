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
#import "TopCodeScanner.h"
#import "TopCode.h"

using namespace cv;

@implementation TopCodeScanner


- (NSMutableArray *)scan:(Mat&)image
{
    NSMutableArray *candidates = [self threshold:image];
    
    NSMutableArray *codes = [NSMutableArray new];
    
    for (int i=0; i<candidates.count; i++) {
        TopCode *top = candidates[i];
        BOOL overlap = FALSE;
        for (int j=0; j<codes.count; j++) {
            if ([codes[j] contains:[top getCenterX] ty:[top getCenterY]]) {
                overlap = TRUE;
            }
        }
        if (!overlap) {
            [top decode:image];
            if ([top isValid]) {
                [top draw:image];
                [codes addObject:top];
            }
        }
    }
    
    [candidates removeAllObjects];
    candidates = nil;
    
    return codes;
}


/*
 * Encodes a list of topcodes as a JSON string
 */
- (NSString *)toJSON:(NSMutableArray *)codes
{
    NSString * json = @"{ \"topcodes\" : [";
    if (codes.count > 0) {
        json = [NSString stringWithFormat:@"%@ %@", json, [codes[0] toJSON] ];
        for (int i=1; i<codes.count; i++) {
            json = [NSString stringWithFormat:@"%@, %@", json, [codes[i] toJSON] ];
        }
    }
    return [NSString stringWithFormat:@"%@]}", json];
}


/*
 * Compute a Wellner adaptive threshold for the image and store the
 * binary threshold pixel in the lowest order bit of each pixel.
 * Returns a list of candidate TopCodes
 */
- (NSMutableArray *)threshold:(Mat&)image
{
    NSMutableArray *codes = [NSMutableArray new];
    
    int bgra, r, g, b, a;
    int threshold, sum = 128;
    int b1, w1, b2, level, dk;
    TopCode *top;
    
    
    for (int i=0; i<image.rows; i++) {
        
        level = b1 = b2 = w1 = 0;
        int k = (i % 2 == 1) ? 0 : image.cols - 1;
        int * ptr = image.ptr<int>(i);
        
        for (int j=0; j<image.cols; j++) {
            bgra = ptr[k]; //image.at<int>(i, j);
            r = (bgra & 0xff0000) >> 16;
            g = (bgra & 0x00ff00) >> 8;
            b = (bgra & 0x0000ff);
            a = (r + g + b);
            
            sum += a - (sum >> 3);
            threshold = (sum >> 3);
            
            a = (a < threshold * 0.975) ? 0 : 1;
            b = (b & 0xfe) + a;
            
            // store threshold data in the B pixel
            ptr[k] = 0xff000000 | (r << 16) | (g << 8) | b;
            
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
                            (b1 + b2 - w1) <= w1 &&
                            (b2 - b1) <= b1 &&
                            (b1 - b2) <= b2) {
                            
                            dk = 1 + b2 + (w1>>1);
                            if (i % 2 == 1) {
                                dk = k - dk;
                            } else {
                                dk = k + dk;
                            }
                            
                            // add candidate
                            top = [TopCode new];
                            [top setCenter:i cy:dk];
                            [codes addObject:top];
                            
                            bgra = 0;
                        }
                        b1 = b2;
                        w1 = 1;
                        b2 = 0;
                        level = 2;
                    }
                    break;
            }  
            
            k += (i % 2 == 1) ? 1 : -1;
        }
    }
    return codes;
}



@end
