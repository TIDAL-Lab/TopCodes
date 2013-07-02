#include "cv.h"      // OpenCV API
#include "highgui.h" // OpenCV Camera Capture API
#include "topcode.h"
#include "DirectedGraphScanner.h"
#include "GPUScanner.h"
#include "MyTime.h"

// GLOBALS
IplImage *colourImageOriginal;

/** This function just draws the found Visual Codes on the given image */
void recognize_codes(std::vector<TopCodes::Code*> &topcode_codes, IplImage *src, IplImage *annotate) {
	if (topcode_codes.empty()) return;
	CvFont font; cvInitFont(&font, CV_FONT_HERSHEY_SIMPLEX, 0.5, 0.5, 0, 1);
	std::vector<TopCodes::Code*>::iterator it = topcode_codes.begin();
	char t[32];
	while (it != topcode_codes.end()) {
		TopCodes::Code *code = (*it);
		cvCircle(annotate, cvPoint((int)code->x, (int)code->y), (int)(code->unit*2.2), CV_RGB(0,255,0), 1, 8, 0);
		sprintf(t, "%04d", code->code);
		cvPutText(annotate, t, cvPoint((int)code->x, (int)code->y), &font, CV_RGB(255,255,255));
		++it;
	}
}

void saveFrame() {
	char name[64];
	SYSTEMTIME lt;
	GetLocalTime(&lt);
	sprintf(name, "capture_in_%d_%d_%d_%d_%d_%d.bmp", lt.wDay,
		lt.wMonth, lt.wYear,
		lt.wHour, lt.wMinute, lt.wSecond);
	fprintf(stderr, "\nCapturing %s...", name);
	cvSaveImage(name, colourImageOriginal);
	fprintf(stderr, "Finished");
}

int help(int argc, char **argv) {
	return 0;
}

int main(int argc, char* argv[])
{
	const char *runSingleFrame  = NULL;
	float topcodeWidthInPixels  = 45.0f;
	float topcodeHeightInPixels = 45.0f;
	int   camera_res_width      = 640;
	int   camera_res_height     = 480;

	if (1==argc) {
		help(argc, argv);
	}
	int i=1;
	while (i<argc) {
		// process single image from disk
		if (0==strcmp(argv[i],"-i")) {
			runSingleFrame=argv[i+1];
			i+=2;
		}
		else if (0==strcmp(argv[i],"-h")) {
			return help(argc, argv);
		}
		else if (0==strcmp(argv[i],"-cw")) {
			camera_res_width = atoi(argv[i+1]);
			i+=2;
		}
		else if (0==strcmp(argv[i],"-ch")) {
			camera_res_height = atoi(argv[i+1]);
			i+=2;
		}
		// single topcode width, height in pixels (including the surrounding border)
		else if (0==strcmp(argv[i],"-tcw")) {
			topcodeWidthInPixels=(float)atof(argv[i+1]);
			i+=2;
		}
		else if (0==strcmp(argv[i],"-tch")) {
			topcodeHeightInPixels=(float)atof(argv[i+1]);
			i+=2;
		}
	}

	TopCodes::Scanner *topcode_scanner=NULL;		
	TopCodes::Image                topcode_image;
	std::vector<TopCodes::Code*>   topcode_codes;

    colourImageOriginal = NULL;	
	IplImage *thisFrameAsGray = NULL;
	IplImage *colourImage = NULL;

	cvNamedWindow("TopCodes", CV_WINDOW_AUTOSIZE);
	CvCapture *input = NULL;
	CvSize screenCaptureSize;

	if (runSingleFrame != NULL && strlen(runSingleFrame)>0) {
		colourImageOriginal = cvLoadImage(runSingleFrame);
		screenCaptureSize.width = colourImageOriginal->width;
		screenCaptureSize.height = colourImageOriginal->height;
	}
	else {
		// Setup Video Capture
		input = cvCreateCameraCapture(0);
		// Try 960x720
		screenCaptureSize.width  = camera_res_width;
		screenCaptureSize.height = camera_res_height;
		cvSetCaptureProperty(input, CV_CAP_PROP_FRAME_WIDTH, screenCaptureSize.width);
		cvSetCaptureProperty(input, CV_CAP_PROP_FRAME_HEIGHT, screenCaptureSize.height);
		colourImageOriginal = cvQueryFrame(input);
		// Take value of size returned by opencv if the requested
		// resolution can not be matched by current hardware.
		screenCaptureSize.width = colourImageOriginal->width;
		screenCaptureSize.height = colourImageOriginal->height;
	}

	if (!topcode_scanner) {
		topcode_scanner = new TopCodes::GPUScanner(screenCaptureSize.width, screenCaptureSize.height);
		// gonen topcode_scanner = new TopCodes::DirectedGraphScanner();
	}

	// Images to use in the program.
	thisFrameAsGray = cvCreateImage(screenCaptureSize, IPL_DEPTH_8U, 1);
	int key=0;
	while (key != 27) {
		// Get a frame from the input video.
		if (runSingleFrame != NULL && strlen(runSingleFrame)>0) {}
		else {
			colourImageOriginal = cvQueryFrame(input);
		}
		if (!colourImage) 
			colourImage = cvCloneImage(colourImageOriginal);
		else 
			cvCopyImage(colourImageOriginal, colourImage);

		// Convert to grey-scale
		cvCvtColor(colourImage, thisFrameAsGray, CV_RGB2GRAY);

		// Compute TopCodes
		topcode_image.ucdata = (unsigned char*)thisFrameAsGray->imageData;
		topcode_image.width = thisFrameAsGray->width;
		topcode_image.height = thisFrameAsGray->height;
		topcode_image.widthStep = thisFrameAsGray->widthStep;

		TIME_COMMAND("scan", topcode_codes = topcode_scanner->scan(&topcode_image, NULL);)

		if (!topcode_codes.empty()) {			
			recognize_codes(topcode_codes, thisFrameAsGray, colourImage);
			char so[32];
			sprintf(so, "%03d(c)", topcode_codes.size());
			CvFont font; cvInitFont(&font, CV_FONT_HERSHEY_SIMPLEX, 0.3, 0.3, 0, 1);
			cvPutText(colourImage, so, cvPoint(10, 40), &font, CV_RGB(255,255,255));
			topcode_scanner->disposeCodes(topcode_codes);
		}

		// Show the captured annotated video frame.
		cvShowImage("TopCodes", colourImage);
		key=cvWaitKey(1); // wait 1 milliseconds

		if (key=='c') {
			saveFrame();
		}
	}
	cvReleaseImage(&colourImage);
	cvReleaseImage(&thisFrameAsGray);
	if (input != NULL) cvReleaseCapture(&input);
	cvDestroyWindow("TopCodes");
	return 0;
}

