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
library topcodes;

import 'dart:html';
import 'dart:math';
import 'dart:async';
import 'dart:js' as js;
import 'dart:convert';

part 'scanner.dart';
part 'topcode.dart';
part 'video.dart';


void initVideoScanner(String canvasId) {
  new VideoScanner(canvasId);
}


void main() {
  js.context['topcodes_initVideoScanner'] = initVideoScanner;
}
