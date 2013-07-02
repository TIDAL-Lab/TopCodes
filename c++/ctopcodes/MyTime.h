#ifndef MY_TIME_H
#define MY_TIME_H

#ifndef WIN32
#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <iostream>
#include <time.h>
#include <sys/time.h>
#include <sys/types.h>
#include <limits.h>
#else
#include <sys/timeb.h>
#include <ctime>
#include <cstdio>
#include <cstdlib>
#include <iostream>
#include <windows.h>
#endif

// msg = up to 32 characters
#define TIME_COMMAND(msg, x) { MY_TimeStamp t0 = MY_Time::getTime(); x; MY_TimeStamp t1 = MY_Time::getTime(); printf("%-32s%9.4f ms\n", msg, MY_Time::getTimeDiff(t0, t1)); }

/**
   this file contains a class that supports time queries
   using a set of static methods.
*/
#if defined WIN32	
  typedef LONGLONG MY_TimeStamp;
#else
  typedef unsigned long MY_TimeStamp;
#endif
  

/**
\ingroup Util_grp 
\class MY_Time
*/
class  MY_Time {
public:
	/**
	   @return the current time in an
	   MY_TimeStamp format.
	*/
	static MY_TimeStamp getTime() {
#ifdef WIN32
		LARGE_INTEGER t1;
		QueryPerformanceCounter(&t1);
		return t1.QuadPart;
#else	
		struct timeval tv;
		struct timezone tz;
		gettimeofday (&tv, &tz);
		return ((MY_TimeStamp) (tv.tv_sec * 1000000 + tv.tv_usec));
#endif
	}

	/**
	   @return the difference between times taken by getTime() 
	   @param MY_TimeStamp t1 the first time.
	   @param MY_TimeStamp t2 the second time.
	*/
	static double getTimeDiff  (MY_TimeStamp t1, MY_TimeStamp t2) {
#ifdef WIN32
		static bool first_time = true;
		static LARGE_INTEGER freq;
		if (first_time){
			first_time = false;
			QueryPerformanceFrequency(&freq);		
		}
		return ((double)( t2 - t1) / (double)freq.QuadPart * 1000.0);
#else
		return ((double)(t2 - t1) / (double) 1000);
#endif
	}

	/**
	   write the time together with a text message
	   to an output stream which defaults to stderr.
	   @return MY_TimeStamp the current time.
	*/
	static MY_TimeStamp timetrace (MY_TimeStamp t0, 
					const char    *msg, 
					std::ostream       &os) {
	  MY_TimeStamp t1 = getTime ();	// timediff dosn't include next prints      
	  os << msg << ":" << getTimeDiff (t0, t1)   << " ms" << std::endl;
	  return getTime();		// next time dosn't include last prints      
	}
};  

#endif
