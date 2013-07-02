/*
 * @(#) TopCodePrinter.java
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

import java.awt.*;
import java.awt.geom.*;
import java.awt.print.*;
import java.awt.event.*;
import java.awt.image.*;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JScrollPane;


public class TopCodePrinter extends JPanel implements Printable, KeyListener {

   static int INCH = 72;
   
   static final int PAGE_WIDTH  = 792; // INCH * 11
   static final int PAGE_HEIGHT = 612; // INCH * 8.5
   static final int PAGE_COUNT = 2;

   
   public static JFrame frame;

   TopCode [] codes;


   
   public TopCodePrinter() {
      super();
      addKeyListener(this);
      this.codes = TopCode.generateCodes();

      for (int i=0; i<codes.length; i++) {
         codes[i].setDiameter(inches(0.75));
      }
   }


   protected float inches(double val) {
      return INCH * (float)val;
   }

   

   protected void drawCodes(Graphics2D g, int top, int index) {
      float y = top + inches(1.4);
      float x = inches(1.5);
      
      for (int j=0; j<6; j++) {
         for (int i=0; i<9; i++) {
            codes[index].setLocation(x, y);
            codes[index].draw(g);
            g.setColor(Color.BLACK);
            g.drawString(String.valueOf(codes[index].getCode()),
                         x - inches(0.1), y + inches(0.55));
            x += inches(1);
            index++;
            if (index >= codes.length) return;
         }
         y += inches(1);
         x = inches(1.5);
      }
   }
   


//==================================================================
// PAGE 1
//==================================================================
   protected void page1(Graphics2D g, int top) {
      drawCodes(g, top, 0);

   }
   
//==================================================================
// PAGE 2
//==================================================================
   protected void page2(Graphics2D g, int top) {
      drawCodes(g, top, 54);
   }
   


   public int print(Graphics graphics, PageFormat pf, int page) {
      Graphics2D g = (Graphics2D)graphics;

      AffineTransform tform = new AffineTransform();
      tform.translate(PAGE_HEIGHT, 0);
      tform.rotate(Math.PI / 2);
      g.transform(tform);

      switch(page) {
      case 0:
         page1(g, 0);
         return PAGE_EXISTS;
      case 1:
         page2(g, 0);
         return PAGE_EXISTS;
      default:
         return NO_SUCH_PAGE;
      }
   }

   
   protected void paintComponent(Graphics graphics) {
      Graphics2D g = (Graphics2D)graphics;

      g.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
                         RenderingHints.VALUE_ANTIALIAS_ON);

      g.setColor(Color.white);
      g.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT * PAGE_COUNT);
      for (int i=0; i<PAGE_COUNT; i++) {
         g.setColor(Color.black);
         g.drawLine(0, PAGE_HEIGHT * (i + 1),
                    PAGE_WIDTH, PAGE_HEIGHT * (i + 1));
         g.setColor(Color.blue);
         g.drawRect(INCH, INCH + PAGE_HEIGHT * i,
                    PAGE_WIDTH - INCH * 2,
                    PAGE_HEIGHT - INCH * 2);
      }

      page1(g, 0);
      page2(g, PAGE_HEIGHT);
   }

   
   public void keyPressed(KeyEvent e) {  }
   public void keyReleased(KeyEvent e) {
      if (e.isControlDown() && e.getKeyCode() == e.VK_P) {
         PrinterJob job = PrinterJob.getPrinterJob();
         job.setPrintable(this);
         if (job.printDialog()) {
            try { job.print(); }
            catch (PrinterException px) {
               System.out.println(px);
            }
         }
      }
   }
   public void keyTyped(KeyEvent e) { }
   

   private static void createAndShowGUI() {
      //Create and set up the window.
      frame = new JFrame("TopCode Printer");
      frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

      // Main content pane
      TopCodePrinter panel = new TopCodePrinter();
      panel.setOpaque(true);

      // 8 1/2 x 11 inches
      panel.setPreferredSize(
         new Dimension(PAGE_WIDTH, PAGE_HEIGHT * PAGE_COUNT));
      
      // Scroll pane
      JScrollPane scroll = new JScrollPane(panel);
      scroll.setPreferredSize(
         new Dimension(PAGE_WIDTH + 10, PAGE_HEIGHT + 25));
      frame.setContentPane(scroll);
      
      //Display the window.
      frame.pack();
      frame.setVisible(true);
      
      panel.requestFocusInWindow();
      
   }
   
   public static void main(String[] args) {
      javax.swing.SwingUtilities.invokeLater(new Runnable() {
            public void run() { createAndShowGUI(); }
         });
   }
}   
