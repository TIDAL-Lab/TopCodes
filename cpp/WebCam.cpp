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
#include <opencv2/opencv.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <opencv2/imgproc/imgproc.hpp>
 
#include <iostream>
#include <stdio.h>
#include <stdlib.h>

#include "TopCode.h"
#include "TopCodeScanner.h"
#include "easywsclient.h"
 
using namespace std;
using namespace cv;
using easywsclient::WebSocket;



void handle_message(const std::string & message)
{
    printf(">>> %s\n", message.c_str());
}

 
int main( int argc, const char** argv )
{

  int camera_number = 0;
  char socket_url[512];
  TopCodeScanner scanner;
  WebSocket *socket = NULL;

  if (argc < 2) {
    cerr << "expected: " << argv[0] << " <camera_number> [socket server]" << endl;
    cerr << "    example: > topcodes 0 ws://localhost:8126/topcodes" << endl;
    return -1;
  }

  // get the camera number
  camera_number = atoi(argv[1]);  // 0 if error

  if (argc >= 3) {
    socket = WebSocket::from_url(argv[2]);
  } else {
    socket = WebSocket::from_url("ws://localhost:8126/topcodes");
  }

  // open the default camera  
  VideoCapture cap(camera_number); 
  if (!cap.isOpened()) {
    cerr << "Error: Unable to open webcam " << camera_number << endl;
    return -1;
  }
 
  for(;;)
  {
    Mat frame, grey, flipped;

    // capture the next still video frame
    cap >> frame; 

    // flip the image horizontally so that it gives you a mirror reflection
    flip(frame, flipped, 1);

    // convert to greyscale
    cvtColor(flipped, grey, CV_RGB2GRAY);

    // scan for topcodes
    vector<TopCode*> *codes = scanner.scan(grey);

    // send topcode info through the websocket
    if (socket) {
      string json = "[\n";
      for (int i=0; i<codes->size(); i++) {
        TopCode *code = (*codes)[i];
        json += ("   " + code->toJSON() + ",\n");
      }
      json += "]";
      socket->send(json);
      socket->poll();
      socket->dispatch(handle_message);
    }

    // show the resulting image (debuggin)
    imshow("webcam", grey);

    // press the 'q' key to quit
    if (waitKey(30) >= 0) break;
  }

  if (socket) delete socket;
}
