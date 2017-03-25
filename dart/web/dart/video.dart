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
part of topcodes;

/**
 * Works with an HTML video stream to continuously scan and track topcodes
 */
class VideoScanner {

  /* original canvas ID */
  String canvasId;

  /* <canvas> tag drawing context */
  CanvasRenderingContext2D _ctx;

  /* this is where we get the video frames from */
  VideoElement _video = null;

  /* used to scan video frame on a periodic timer */
  Timer _timer = null;

  /* used to identify topcodes in video frames */
  Scanner _scanner;


  VideoScanner(this.canvasId) {
    _scanner = new Scanner();
    CanvasElement canvas = querySelector("#$canvasId");
    _ctx = canvas.getContext("2d");
    _video = new VideoElement() .. id = "$canvasId-video"; //querySelector("#$videoId");
    _video.autoplay = true;
    _video.style.display = "none";
    document.body.append(_video);

    _video.onPlay.listen((e) {
      print("video width: ${_video.videoWidth}");
      print("video height: ${_video.videoHeight}");
      _timer = new Timer.periodic(const Duration(milliseconds : 60), _scanFrame);
    });

    _video.onPause.listen((e) {
      print("pause");
      if (_timer != null) _timer.cancel();
      _timer = null;
    });
  }


  void startStopVideoScan() {
    (_timer != null) ? stopVideoScan() : startVideoScan();
  }


  void startVideoScan() {
    js.context["TopCodes"].callMethod("startVideoScan", [ canvasId ]);
  }


  void stopVideoScan() {
    js.context["TopCodes"].callMethod("stopVideoScan", [ canvasId ]);
  }


/*
 * Called at a regular frame rate while the camera is on
 */
  void _scanFrame(Timer t) {

    // draw a frame from the video stream onto the canvas (flipped horizontally)
    _ctx.save();
    {
      _ctx.translate(_video.videoWidth, 0);
      _ctx.scale(-1, 1);
      _ctx.drawImage(_video, 0, 0);
    }
    _ctx.restore();


    // grab a bitmap from the canvas
    ImageData id = _ctx.getImageData(0, 0, _video.videoWidth, _video.videoHeight);
    List<TopCode> codes = _scanner.scan(id, _ctx);

    // draw topcodes
    var json = { "canvasId" : canvasId, "topcodes" : [] };
    for (TopCode top in codes) {
      top.draw(_ctx);
      json["topcodes"].add(top.toJSON());
    }

    // export JSON to javascript callback
    js.context["TopCodes"].callMethod("_relayFrameData", [ canvasId, JSON.encode(json) ]);
  }
}

