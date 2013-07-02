TopCodes
========

Tangible Object Placement Codes: A simple computer vision fiducial library for tangible interaction.

    
Overview

The TopCode computer vision library is designed to quickly and easily identify and track tangible objects on a flat surface. Just tag any physical object with a TopCode (a circular black and white symbol) and the system will return:

* An ID number
* Location of the tag
* Angular orientation of the tag
* Diameter of the tag 

The TopCode library will identify 99 unique codes and can accurately recognize codes as small as 25 x 25 pixels. 
The image processing algorithms work in a variety of lighting conditions without the need for human calibration. 
The core TopCode library is available in Java, Android, Dart, and C++ (thanks to Raveh Gonen). 

Pros

* Free and open source
* Fast and accurate
* Will work in a variety of lighting conditions
* Can recognize up to 99 unique codes in a single image. 

Cons

* The camera must be orthogonal to the interaction surface.
* Requires programming knowledge to use


Quick Start Guide (Java)

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

Other computer vision libraries you might try:

* ARToolKit from the HITLab at the University of Washington
* reacTIVision from the Music Technology Group at Pompeu Fabra University in Barcelona
* CanTag and TinyTag from the University of Cambridge in the U.K.
* Vuforia from Qualcomm


References

The TopCode library was developed by Michael Horn at Tufts University and Northwestern University. The library is based on TRIP from the University of Cambridge in the U.K. and on adaptive thresholding techniques developed by Pierre Wellner.

Comments & Feedback

Please send comments, suggestions, and bug fixes to Michael Horn (michael-horn <at> northwestern dot edu). 
