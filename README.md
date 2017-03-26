# TopCodes

The TopCode computer vision library is designed to quickly and easily identify and track tangible objects on a flat surface. Just tag any physical object with a TopCode (a circular black and white symbol) and the system will return:

* An ID number
* Location of the tag
* Angular orientation of the tag
* Diameter of the tag 

The TopCode library will identify 99 unique codes and can accurately recognize codes as small as 25 x 25 pixels. 
The image processing algorithms work in a variety of lighting conditions without the need for human calibration. 
The core TopCode library is available in JavaScript, Java, Android, Dart, and C++ (thanks to Raveh Gonen). 

### Pros

* Free and open source
* Fast and accurate
* Will work in a variety of lighting conditions
* Can recognize up to 99 unique codes in a single image. 

### Cons

* The camera must be orthogonal to the interaction surface.
* Requires programming knowledge to use

--------------------------------


## Quick Start Guide for JavaScript

* To load up TopCodes in your browser, start by downloading the [topcodes.js](https://raw.githubusercontent.com/TIDAL-Lab/TopCodes/master/javascript/topcodes.js) library.

* Then create a simple HTML file in the same directory as the library file (you can copy this code):

```html
<!DOCTYPE html>
<html>
<head>
  <title>TopCodes Example</title>
</head>

<body>
  <canvas id="video-canvas" width="800" height="600" style="background: #ddd;"></canvas>
  <br/>
  <button id="camera-button" onclick="TopCodes.startStopVideoScan('video-canvas')">Start / Stop</button>

  <script src="topcodes.js"></script>
</body>
</html>
```

* Load this file into a browser (Chrome or Firefox) and try pressing the Start / Stop button. If everything works a video stream should open from your built-in web camera. 

* Next try printing out some [TopCodes](https://github.com/TIDAL-Lab/TopCodes/blob/master/topcodes.pdf) and holding them in front of the camera. You should see TopCode symbols being drawn over the sheet of paper in the video stream. 

* Now we can actually do something with the TopCodes from the video stream. First we have to define a callback function that will receive JSON data frame by frame from the video stream.  Add this `<script>` tag at the end of your HTML file right before the close `</body>` tag.

```html
  <script>

  // register a callback function with the TopCode library
  TopCodes.setVideoFrameCallback("video-canvas", function(jsonString) {

    // convert the JSON string to an object
    var json = JSON.parse(jsonString);

    // get the list of topcodes from the JSON object
    var topcodes = json.topcodes;

    // obtain a drawing context from the <canvas> 
    var ctx = document.querySelector("#video-canvas").getContext('2d');

    // draw a circle over the top of each TopCode
    ctx.fillStyle = "rgba(255, 0, 0, 0.3)";   // very translucent red
    for (i=0; i<topcodes.length; i++) {
      ctx.beginPath();
      ctx.arc(topcodes[i].x, topcodes[i].y, topcodes[i].radius, 0, Math.PI*2, true);
      ctx.fill();
    }
  });
  </script>
```

* If this works, you'll see pinkish circle drawn over each of the TopCode symbols found in the video stream. 

* Each TopCode is a JSON object with the following structure:

```json
{
    code : 31,
    x : 35.0,
    y : 87.0,
    radius : 52,
    angle : 0.135032
}
```

--------------------------------

## Quick Start Guide for Java

To get started with the Java TopCode library:

* Download and install the Java JDK
* Extract the TopCode library on your local machine.

* An easy way to get started is to use the TopCode debugger app. Start by opening a shell and changing to the directory where you installed the library. Then run this command:

        $ java -cp lib/topcodes.jar topcodes.DebugWindow 

* This allows you to test the library on an image. If there are any JPEG images in your working directory, they will be loaded automatically. The basic key commands are:

    CTRL-o 	Open a JPEG file
    + 	Zoom in
    - 	Zoom out
    b 	See the image after thresholding
    t 	Show / hide topcode highlighting
    Page Up 	Load the next image in the directory
    Page Dn 	Load the previous image in the directory
    Clicking and dragging with the mouse will pan the image.

All of the TopCode ID numbers will be printed on the command line each time an image is loaded.

------------------------------

## Other computer vision libraries you might try:

* ARToolKit from the HITLab at the University of Washington
* reacTIVision from the Music Technology Group at Pompeu Fabra University in Barcelona
* CanTag and TinyTag from the University of Cambridge in the U.K.
* Vuforia from Qualcomm

## References

The TopCode library was developed by Michael Horn at Tufts University and Northwestern University. The library is based on TRIP from the University of Cambridge in the U.K. and on adaptive thresholding techniques developed by Pierre Wellner.

## Comments & Feedback

Please send comments, suggestions, and bug fixes to Michael Horn (michael-horn <at> northwestern dot edu). 


## Valid TopCodes

This is a list of valid TopCode ID numbers:

    0 0000 0001 1111  = 31
    0 0000 0010 1111  = 47
    0 0000 0011 0111  = 55
    0 0000 0011 1011  = 59
    0 0000 0011 1101  = 61
    0 0000 0100 1111  = 79
    0 0000 0101 0111  = 87
    0 0000 0101 1011  = 91
    0 0000 0101 1101  = 93
    0 0000 0110 0111  = 103
    0 0000 0110 1011  = 107
    0 0000 0110 1101  = 109
    0 0000 0111 0011  = 115
    0 0000 0111 0101  = 117
    0 0000 0111 1001  = 121
    0 0000 1000 1111  = 143
    0 0000 1001 0111  = 151
    0 0000 1001 1011  = 155
    0 0000 1001 1101  = 157
    0 0000 1010 0111  = 167
    0 0000 1010 1011  = 171
    0 0000 1010 1101  = 173
    0 0000 1011 0011  = 179
    0 0000 1011 0101  = 181
    0 0000 1011 1001  = 185
    0 0000 1100 0111  = 199
    0 0000 1100 1011  = 203
    0 0000 1100 1101  = 205
    0 0000 1101 0011  = 211
    0 0000 1101 0101  = 213
    0 0000 1101 1001  = 217
    0 0000 1110 0011  = 227
    0 0000 1110 0101  = 229
    0 0000 1110 1001  = 233
    0 0000 1111 0001  = 241
    0 0001 0000 1111  = 271
    0 0001 0001 0111  = 279
    0 0001 0001 1011  = 283
    0 0001 0001 1101  = 285
    0 0001 0010 0111  = 295
    0 0001 0010 1011  = 299
    0 0001 0010 1101  = 301
    0 0001 0011 0011  = 307
    0 0001 0011 0101  = 309
    0 0001 0011 1001  = 313
    0 0001 0100 0111  = 327
    0 0001 0100 1011  = 331
    0 0001 0100 1101  = 333
    0 0001 0101 0011  = 339
    0 0001 0101 0101  = 341
    0 0001 0101 1001  = 345
    0 0001 0110 0011  = 355
    0 0001 0110 0101  = 357
    0 0001 0110 1001  = 361
    0 0001 0111 0001  = 369
    0 0001 1000 0111  = 391
    0 0001 1000 1011  = 395
    0 0001 1000 1101  = 397
    0 0001 1001 0011  = 403
    0 0001 1001 0101  = 405
    0 0001 1001 1001  = 409
    0 0001 1010 0011  = 419
    0 0001 1010 0101  = 421
    0 0001 1010 1001  = 425
    0 0001 1011 0001  = 433
    0 0001 1100 0101  = 453
    0 0001 1100 1001  = 457
    0 0001 1101 0001  = 465
    0 0010 0010 0111  = 551
    0 0010 0010 1011  = 555
    0 0010 0010 1101  = 557
    0 0010 0011 0011  = 563
    0 0010 0011 0101  = 565
    0 0010 0011 1001  = 569
    0 0010 0100 0111  = 583
    0 0010 0100 1011  = 587
    0 0010 0100 1101  = 589
    0 0010 0101 0011  = 595
    0 0010 0101 0101  = 597
    0 0010 0101 1001  = 601
    0 0010 0110 0011  = 611
    0 0010 0110 0101  = 613
    0 0010 0110 1001  = 617
    0 0010 1000 1011  = 651
    0 0010 1000 1101  = 653
    0 0010 1001 0011  = 659
    0 0010 1001 0101  = 661
    0 0010 1001 1001  = 665
    0 0010 1010 0011  = 675
    0 0010 1010 0101  = 677
    0 0010 1010 1001  = 681
    0 0010 1100 1001  = 713
    0 0011 0001 1001  = 793
    0 0011 0010 0101  = 805
    0 0011 0010 1001  = 809
    0 0011 0100 1001  = 841
    0 0100 1001 0011  = 1171
    0 0100 1001 0101  = 1173
    0 0100 1010 0101  = 1189
    99 codes.