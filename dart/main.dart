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
library TopCodes;

import 'dart:html';
import 'dart:math';
import 'dart:async';

part 'scanner.dart';
part 'topcode.dart';


const VIDEO_WIDTH = 800;
const VIDEO_HEIGHT = 600;


CanvasRenderingContext2D ctx;
Scanner scanner;
VideoElement video = null;
Timer timer;
MediaStream stream;


void main() {
  
  CanvasElement canvas = document.query("#main-canvas");
  ctx = canvas.getContext("2d");
  scanner = new Scanner();
  video = new VideoElement();
  video.autoplay = true;
  video.onPlay.listen((e) {
    ctx.drawImage(video, 0, 0);
    timer = new Timer.periodic(const Duration(milliseconds : 30), scan);
  });
  
  document.query("#camera-button").onClick.listen((e) { startStopVideo(); });
}


void startStopVideo() {
  
  if (stream == null) {
    var vconfig = {'mandatory' : { 'minWidth' : VIDEO_WIDTH, 'minHeight' : VIDEO_HEIGHT } };
    
    window.navigator.getUserMedia(audio : false, video : vconfig).then((var ms) {
      video.src = Url.createObjectUrl(ms);
      stream = ms;
    });
  }
  else {
    if (timer != null) timer.cancel();
    video.pause();
    stream.stop();
    stream = null;
  }
}


/*
 * Called 30 frames a second
 */
void scan(Timer timer) {
  
  // 1. draw a frame from the video stream onto the canvas
  ctx.drawImage(video, 0, 0);
  
  
  // 2. grab a bitmap from the canvas
  ImageData img = ctx.getImageData(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
  
  
  // 3. scan the bitmap for topcodes
  /*
  List<TopCode> codes = scanner.scan(img);


  // 4. draw the topcodes slighly enlarged
  for (TopCode top in codes) {
    top.draw(ctx, 1.3);
  }
  */
}

