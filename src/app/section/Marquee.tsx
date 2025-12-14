"use client";

import React from "react";

const Marquee = () => {
  const items = [
    "PRACTICAL EXPERIENCE",
    "GOALTENDING ACADEMY",
    "PRACTICAL EXPERIENCE"," INDIVIDUAL ACADEMY",
  ];

  return (
    <>
      {/* Inject custom animation styles since we can't touch tailwind.config */}
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .marquee-track {
          animation: scroll 55s linear infinite;
        }
        /* Russian Flag Text Gradient */
        .russian-flag-text {
          background-image: linear-gradient(
            180deg, 
            #FFFFFF 33%, 
            #0039A6 33%, 
            #0039A6 66%, 
            #D52B1E 66%
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
      `}</style>

      <div className="relative w-full overflow-hidden bg-[#050505] border-y border-white/10 py-6 md:py-8">
        {/* Left Fade */}
        <div className="absolute top-0 left-0 z-10 h-full w-24 bg-gradient-to-r from-[#050505] to-transparent" />
        {/* Right Fade */}
        <div className="absolute top-0 right-0 z-10 h-full w-24 bg-gradient-to-l from-[#050505] to-transparent" />

        <div className="flex w-fit marquee-track">
          {/* Loop 1 */}
          <div className="flex items-center whitespace-nowrap">
            {items.map((text, i) => (
              <div key={`loop1-${i}`} className="flex items-center">
                <span className="russian-flag-text mx-6 text-4xl md:text-6xl font-black italic tracking-tighter uppercase">
                  {text}
                </span>
                <span className="text-white/20 text-2xl mx-2">★</span>
              </div>
            ))}
          </div>

          {/* Loop 2 (Duplicate for seamless scroll) */}
          <div className="flex items-center whitespace-nowrap">
            {items.map((text, i) => (
              <div key={`loop2-${i}`} className="flex items-center">
                <span className="russian-flag-text mx-6 text-4xl md:text-6xl font-black italic tracking-tighter uppercase">
                  {text}
                </span>
                <span className="text-white/20 text-2xl mx-2">★</span>
              </div>
            ))}
          </div>
          
           {/* Loop 3 (Extra buffer for wide screens) */}
           <div className="flex items-center whitespace-nowrap">
            {items.map((text, i) => (
              <div key={`loop3-${i}`} className="flex items-center">
                <span className="russian-flag-text mx-6 text-4xl md:text-6xl font-black italic tracking-tighter uppercase">
                  {text}
                </span>
                <span className="text-white/20 text-2xl mx-2">★</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Marquee;