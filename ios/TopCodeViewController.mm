//
//  TopCodeViewController.m
//  StickerBook
//
//  Created by Michael Stephen Horn on 8/8/13.
//
//

#import "TopCodeViewController.h"
using namespace cv;


@interface TopCodeViewController ()
{
    /* Camera interface */
    CvVideoCamera *videoCamera;
    
    /* Link back to the parent view controller */
    UIViewController *parent;

}
@end


@implementation TopCodeViewController


- (id)initWithParent:(UIViewController *)vc
{
    self = [super init];
    if (self) parent = vc;
    return self;
}


- (void)startCamera:(id<CvVideoCameraDelegate>)delegate {
    videoCamera = [[CvVideoCamera alloc] initWithParentView:imageView];
    videoCamera.delegate = delegate;
    videoCamera.defaultAVCaptureSessionPreset = AVCaptureSessionPresetiFrame960x540;
    videoCamera.defaultAVCaptureDevicePosition = AVCaptureDevicePositionBack;
    videoCamera.defaultAVCaptureVideoOrientation = AVCaptureVideoOrientationPortrait;
    
    [videoCamera start];
}


- (void)viewDidLoad {
    [super viewDidLoad];
}


- (void)viewDidUnload {
    [super viewDidUnload];
    videoCamera = nil;
}


- (IBAction)closeView:(id)sender {
    [videoCamera stop];
    [parent dismissViewControllerAnimated:YES completion:nil];
}


- (void)stopCamera {
    [videoCamera stop];
}


@end
