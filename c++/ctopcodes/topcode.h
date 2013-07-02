#ifndef TOPCODE_H
#define TOPCODE_H

/** Identifies Visual TopCodes in an RGB Image. 
	1. TopCodes are	printed on size of about 2cm.
	2. Digital Camera should be placed around 65 above table
	3. Camera should be parallel to table
	4. Support 99 Different Codes
	5. All returned codes have (x,y) in image and code number
	6. Codes are black and white. Surroundings can be colorfull.
*/
#include <vector>
namespace TopCodes {

	struct Image  {
		unsigned char *ucdata; 
		int           width; 
		int           height; 
		int           widthStep; 
	};

	class Scanner;
	class Code {
	public:
		enum INFO { _WIDTH=8 };
		Code();
		virtual ~Code() {}
		virtual Code* clone() const;
		inline bool isValid() const {return this->code > 0;}
		int         decode(Scanner &scanner, int cx, int cy);

		int   code;       /** TopCodes code */
		float unit;       /** The width of a single ring. */
		float orientation;/** The angular orientation of the symbol (in radians) */		
		float x;          /** Horizontal center of a symbol in image */		
		float y;          /** Vertical center of a symbol in image */

	protected:
		float       readUnit(Scanner &scanner);
		int         readCode(Scanner &scanner, float unit, float arca);
		int         rotateLowest(int bits, float arca);		
		bool        checksum(int bits);
		int   SECTORS; /** Number of sectors in the data ring */
		int   WIDTH;   /** Width of the code in units (ring widths) */
		float PI;   
		float ARC;   /** Span of a data sector in radians */		
		int   core[_WIDTH]; /** The symbol's code, or -1 if invalid. */
	};

	/** virtual API for generating user defined codes 
		Used when calling Scanner::setCodeFactory() 
	*/
	class CodeFactory {
	public:
		virtual ~CodeFactory() {}
		virtual Code* create() = 0;
	};

	/** Used when calling Scanner::scan() */
	class ScanListener {
	public:
		virtual ~ScanListener() {}
		/** Start Finding Codes */
		virtual int onBegin() = 0;
		/** New Code Found */
		virtual int onNewCode(Code*) = 0;
		/** Finished Finding Codes */
		virtual int onEnd() = 0;
	};

	class Scanner {
	public:
		enum INFO { MAXU=80 };
		Scanner();
		virtual ~Scanner();
		/** all successive calls to this instance should be with an image
			with the same dimensions as the first given image!
			@param [in] l if not null, use progressive scan. 
			send events of new found codes
			Use disposeCodes() to dispose memory allocated by scan().
		*/
		virtual std::vector<Code*> scan(	const Image  *src, 
										ScanListener *l = NULL, 
										Image        *annotate = NULL);
		void            disposeCodes(std::vector<Code*> &codes);
		void            setCodeFactory(CodeFactory *cf) {mCodeFactory=cf;}
		int             xdist(int x, int y, int d);
		int             ydist(int x, int y, int d);
		int             getSample3x3(int x, int y);
		inline int      getImageWidth()  { return (image) ? image->width : 0; }
		inline int      getImageHeight() { return (image) ? image->height: 0; }

		unsigned int    *gData; // running sum
		const Image *image;/** Original image, Shallow Copy Only! */
		int             getBW3x3(int x, int y);		
		void            clear();
		/** return -1 on error or 0..98 inclusive  */
		unsigned short  code_map(unsigned short original_code); 
	protected:
		void             threshold();
		virtual std::vector<Code*> findCodes(ScanListener *l=NULL);
		void             colorSpotMap(int x, int y, Code *spot, unsigned char *spotMapPtr);			
		unsigned char    *spotMap; /** Holds processed binary pixel data */		
		int              maxu;   /** Maximum width of a TopCode unit in pixels */
		unsigned short   mCodeMap[1190];
		CodeFactory      *mCodeFactory;
	};
}

#endif
