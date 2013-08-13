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
#import "TopCodePlugin.h"
using namespace cv;


@implementation TopCodePlugin


- (void)pluginInitialize {
    [super pluginInitialize];
    viewc = nil;
    scanner = [TopCodeScanner new];
}


- (void)onReset {
    [super onReset];
    viewc = nil;
    scanner = nil;
}


- (void)dispose {
    [super dispose];
    viewc = nil;
    scanner = nil;
}


- (void)startScan:(CDVInvokedUrlCommand*)command
{
    if (viewc != nil) viewc = nil;
    viewc = [[TopCodeViewController alloc] initWithParent:self.viewController];
    [self.viewController presentViewController:viewc animated:YES completion:nil];
    [viewc startCamera:self];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)stopScan:(CDVInvokedUrlCommand*)command {
    if (viewc != nil) {
        [viewc stopCamera];
        [self.viewController dismissViewControllerAnimated:YES completion:nil];
    }
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId ];
}


- (void)reportTopCodes:(NSString *)json {
    NSString *js = [NSString stringWithFormat:@"reportTopCodes('%@');", json];
    [self.commandDelegate evalJs:js scheduledOnRunLoop:YES];
}


#ifdef __cplusplus

- (void)processImage:(Mat&)image;
{
    NSMutableArray *codes = [scanner scan:image];
    
    if (codes.count > 0) {
        NSString *json = [scanner toJSON:codes];
        //NSLog(@"%@", json);
        [self reportTopCodes:json];
    }
}

#endif


@end
