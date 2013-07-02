/*
 * @(#) DebugWindow.java
 * 
 * Tangible Object Placement Codes (TopCodes)
 * Copyright (c) 2007 Michael S. Horn
 * 
 *           Michael S. Horn (michael.horn@tufts.edu)
 *           Tufts University Computer Science
 *           161 College Ave.
 *           Medford, MA 02155
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
package topcodes;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.FilenameFilter;
import java.io.FileOutputStream;

import java.util.List;

import java.awt.*;
import java.awt.event.*;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.awt.geom.AffineTransform;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.UIManager;
import javax.swing.JFileChooser;
import com.sun.image.codec.jpeg.*;



/**
 * Debug window for TopCode scanner
 *
 * @author Michael Horn
 * @version $Revision: 1.8 $, $Date: 2008/02/04 15:02:38 $
 */
public class DebugWindow extends JPanel implements
KeyListener,
WindowListener,
MouseListener,
MouseMotionListener,
FilenameFilter
{

   
   /** The main app window */
   protected JFrame frame;

   protected Scanner scanner;

   protected AffineTransform tform;

   protected boolean binary;

   protected boolean show_spots;

   protected boolean annotate;

   protected List spots;

   protected int test_x;

   protected int test_y;

   protected int file_index;

   protected String [] files;


   public DebugWindow() {
      super(true);
      setOpaque(true);
      setPreferredSize(new Dimension(1024, 768));
      addKeyListener(this);
      addMouseListener(this);
      addMouseMotionListener(this);

      this.scanner = new Scanner();
      this.scanner.setMaxCodeDiameter(56);

      // create file list
      this.file_index = 0;
      this.files = (new File(".")).list(this);
      clear();

      //--------------------------------------------------
      //Create and set up the frame.
      //--------------------------------------------------
      this.frame = new JFrame("TopCode Debugger");
      frame.setDefaultCloseOperation(JFrame.DO_NOTHING_ON_CLOSE);
      frame.setContentPane(this);
      frame.addWindowListener(this);
      frame.pack();
      frame.setVisible(true);
      
      requestFocusInWindow();
      loadTest();
   }



   public void clear() {
      this.tform      = new AffineTransform();
      this.spots      = null;
      this.show_spots = true;
      this.binary     = false;
      this.annotate   = false;
      this.test_x     = -1;
      this.test_y     = -1;
   }



   protected void paintComponent(Graphics graphics) {
      Graphics2D g = (Graphics2D)graphics;

      int w = getWidth();
      int h = getHeight();
      g.setColor(Color.WHITE);
      g.fillRect(0, 0, w, h);

      g.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
                         RenderingHints.VALUE_ANTIALIAS_ON);

      BufferedImage image;

      if (this.binary) {
         image = scanner.getPreview();
      } else {
         image = scanner.getImage();
      }
      
      g.drawRenderedImage(image, this.tform);

      g.transform(tform);

      if (show_spots && spots != null) {
         for (int i=0; i<spots.size(); i++) {
            TopCode spot = (TopCode)spots.get(i);
            spot.draw(g);
         }
      }

      if (annotate && spots != null) {
         for (int i=0; i<spots.size(); i++) {
            TopCode spot = (TopCode)spots.get(i);
            spot.annotate(g, scanner);
         }
      }

      if (test_x >= 0 && test_y >= 0) {
         TopCode spot = new TopCode();
         spot.decode(scanner, test_x, test_y);
         if (spot.isValid()) {
            spot.draw(g);
         }
         else {
            spot.annotate(g, scanner);
         }
      } 
         
   }

   

//-----------------------------------------------------------------
// Load the next image from the test directory
//-----------------------------------------------------------------
   public void load(String file) {
      clear();
      if (file == null) return;
      if (!(new File(file)).exists()) return;

      frame.setTitle(file);
      
      try {
         long start_t = System.currentTimeMillis();
         this.spots = scanner.scan(file);
         start_t = System.currentTimeMillis() - start_t;
         System.out.println("Found " + spots.size() + " codes.");
         System.out.println(scanner.getCandidateCount() + " candidates.");
         System.out.println(scanner.getTestedCount() + " tested.");
         TopCode top;
         for (int i=0; i<spots.size(); i++) {
            top = (TopCode)spots.get(i);
            top.printBits(top.getCode());
         }
         System.out.println(start_t + "ms elapsed time.");
      }
      catch (IOException iox) {
         iox.printStackTrace();
      }
   }



   public void loadTest() {
      if (files == null || file_index >= files.length) return;
      System.out.println(files[file_index]);
      
      load(files[file_index]);
   }


   
   public void zoom(double factor) {
      int w = getWidth();
      int h = getHeight();

      double dx = w/2.0;
      double dy = h/2.0;

      this.tform.preConcatenate(
         new AffineTransform().getTranslateInstance(-dx, -dy));
      this.tform.preConcatenate(
         new AffineTransform().getScaleInstance(factor, factor));
      this.tform.preConcatenate(
         new AffineTransform().getTranslateInstance(dx, dy));

      repaint();
   }



   public void pan(int dx, int dy) {
      double sx = this.tform.getScaleX();
      double sy = this.tform.getScaleY();
      this.tform.translate(dx / sx, dy / sy);
      repaint();
   }



/******************************************************************/
/*                       KEYBOARD EVENTS                          */
/******************************************************************/
   public void keyPressed(KeyEvent e) {
      int k = e.getKeyCode();
      switch (k) {
      // F10

      case KeyEvent.VK_A:
         this.annotate = !this.annotate;
         repaint();
         break;
         
      case KeyEvent.VK_B:
         this.binary = !this.binary;
         repaint();
         break;

      case KeyEvent.VK_T:
         this.show_spots = !this.show_spots;
         repaint();
         break;

      case KeyEvent.VK_O:
         if (e.isControlDown()) {
            int result;
            JFileChooser chooser = new JFileChooser(new File("."));
            result = chooser.showOpenDialog(null);
            if (result == JFileChooser.APPROVE_OPTION) {
               load(chooser.getSelectedFile().getAbsolutePath());
            }
         }
         repaint();
         break;

      case KeyEvent.VK_MINUS:
         zoom(0.95);
         repaint();
         break;

      case KeyEvent.VK_EQUALS:
         zoom(1/0.95);
         repaint();
         break;
         
      case KeyEvent.VK_PAGE_UP:
         if (files != null && file_index < files.length) {
            this.file_index++;
         }
         loadTest();
         repaint();
         break;

      case KeyEvent.VK_PAGE_DOWN:
         if (file_index > 0) {
            file_index--;
         }
         loadTest();
         repaint();
         break;
      }
   }
   public void keyReleased(KeyEvent e) { }
   public void keyTyped(KeyEvent e) { }


   
/******************************************************************/
/*                        WINDOW EVENTS                           */
/******************************************************************/
   public void windowClosing(WindowEvent e) {
      frame.setVisible(false);
      frame.dispose();
      System.exit(0);
   }
   public void windowActivated(WindowEvent e) { } 
   public void windowClosed(WindowEvent e) { }
   public void windowDeactivated(WindowEvent e) { }
   public void windowDeiconified(WindowEvent e) { } 
   public void windowIconified(WindowEvent e) { } 
   public void windowOpened(WindowEvent e) { }



   int mouseX;
   int mouseY;
   double point[] = new double[2];
   public void mouseReleased(MouseEvent e) { }
   public void mouseClicked(MouseEvent e) { }
   public void mouseMoved(MouseEvent e) { }
   public void mouseEntered(MouseEvent e) { }
   public void mouseExited(MouseEvent e) { }
   public void mousePressed(MouseEvent e) {
      mouseX = e.getX();
      mouseY = e.getY();
      if (e.isControlDown()) {
         point[0] = mouseX;
         point[1] = mouseY;
         try {
            this.tform.inverseTransform(point, 0, point, 0, 1);
            this.test_x = (int)Math.round(point[0]);
            this.test_y = (int)Math.round(point[1]);
         } catch (Exception x) { ; }
         
         repaint();
      }
   }
   public void mouseDragged(MouseEvent e) {
      pan(e.getX() - mouseX, e.getY() - mouseY);
      mouseX = e.getX();
      mouseY = e.getY();
   }



   public boolean accept(File dir, String name) {
      return (name.toLowerCase().endsWith(".jpg"));
   }



/**
 * main entry point
 */
   public static void main(String[] args) {

      //--------------------------------------------------
      // Fix cursor flicker problem (sort of :( )
      //--------------------------------------------------
      System.setProperty("sun.java2d.noddraw", "");

      
      //--------------------------------------------------
      // Use standard Windows look and feel
      //--------------------------------------------------
      try { 
         UIManager.setLookAndFeel(
            UIManager.getSystemLookAndFeelClassName());
      } catch (Exception x) { ; }

      
      //--------------------------------------------------
      // Schedule a job for the event-dispatching thread:
      // creating and showing this application's GUI.
      //--------------------------------------------------
      javax.swing.SwingUtilities.invokeLater(new Runnable() {
            public void run() {
               new DebugWindow();
            }
         });
   }
}

