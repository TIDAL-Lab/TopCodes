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
#import <Cordova/CDV.h>
#import <opencv2/highgui/cap_ios.h>
#import "TopCodeScanner.h"
#import "TopCodeViewController.h"


@interface TopCodePlugin : CDVPlugin<CvVideoCameraDelegate>
{
    TopCodeViewController *viewc;
    TopCodeScanner *scanner;
}

- (void)startScan:(CDVInvokedUrlCommand*)command;

- (void)stopScan:(CDVInvokedUrlCommand*)command;

- (void)reportTopCodes:(NSString *)json;


@end
