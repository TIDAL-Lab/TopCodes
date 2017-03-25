/*
 * Tern Tangible Programming Language
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


// Helper functions that are called by dart to start and stop the video
// stream. Unfortunately the dart-sdk doesn't handle this correctly.  

var TopCodes = {


  startStopVideoScan : function(canvasId) {
    TopCodes._mediaStreams[canvasId] ? 
      TopCodes.stopVideoScan(canvasId) : 
      TopCodes.startVideoScan(canvasId);
  },


  startVideoScan : function(canvasId) {
    // initialize the video scanner if necessary
    if (!(canvasId in TopCodes._mediaStreams)) {
      topcodes_initVideoScanner(canvasId);
    }
    var canvas = document.querySelector("#" + canvasId);
    var video = document.querySelector("#" + canvasId + "-video");
    if (canvas && video) {
      var vw = parseInt(canvas.getAttribute('width'));
      var vh = parseInt(canvas.getAttribute('height'));
      var vc = { audio: false, video: { mandatory : { minWidth: vw, maxWidth : vw, minHeight : vh, maxHeight : vh }}}; 
      navigator.mediaDevices.getUserMedia(vc)
        .then(function(mediaStream) {
          video.srcObject = mediaStream;
          TopCodes._mediaStreams[canvasId] = mediaStream;
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  },


  stopVideoScan : function(canvasId) {
    var video = document.querySelector("#" + canvasId + "-video");
    var mediaStream = TopCodes._mediaStreams[canvasId];
    if (video && mediaStream) {
      mediaStream.getTracks().forEach(function (track) { track.stop(); })
      TopCodes._mediaStreams[canvasId] = null;
      video.pause();
    }
  },


  setVideoFrameCallback : function(canvasId, callback) {
    TopCodes._callbacks[canvasId] = callback;
  },


  _relayFrameData : function(canvasId, json) {
    if (canvasId in TopCodes._callbacks) {
      TopCodes._callbacks[canvasId](json);
    }
  },


  _mediaStreams : { },
  _callbacks : { }
}
