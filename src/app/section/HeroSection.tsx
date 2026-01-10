'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowRight, Star } from 'lucide-react';

export default function HeroSection() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // --- SETUP ---
      // 1. Text starts spaced out (x-axis) and hidden
      gsap.set(".hero-word-1", { x: -100, opacity: 0 });
      gsap.set(".hero-word-2", { x: 100, opacity: 0 });
      
      // 2. Lines start at width 0
      gsap.set(".flag-line", { scaleX: 0, transformOrigin: "left center" });
      
      // 3. Misc
      gsap.set(".fade-in", { opacity: 0, y: 20 });
      gsap.set(videoRef.current, { scale: 1.1, opacity: 0 });

      tl
        // 1. Video & Background Reveal
        .to(videoRef.current, {
          opacity: 1,
          scale: 1,
          duration: 2,
          ease: "power2.out"
        })

        // 2. The Text Slams In (From sides to center)
        .to(".hero-word-1", {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power4.out"
        }, "-=1.5")
        .to(".hero-word-2", {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power4.out"
        }, "-=0.8")

        // 3. The Flag Line Shoots Across (Between the words)
        .to(".flag-line-white", { scaleX: 1, duration: 0.5, ease: "power2.inOut" }, "-=0.5")
        .to(".flag-line-blue", { scaleX: 1, duration: 0.5, ease: "power2.inOut" }, "-=0.4")
        .to(".flag-line-red", { scaleX: 1, duration: 0.5, ease: "power2.inOut" }, "-=0.4")

        // 4. Details Fade In
        .to(".fade-in", {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out"
        }, "-=0.2");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative h-screen w-full bg-[#050505] text-white overflow-hidden flex flex-col justify-center"
    >
      
      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0 select-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src="/img/h1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60 z-10" />
        
      </div>

      {/* --- MAIN CONTENT LAYER --- */}
      <div className="relative z-20 w-full px-4 md:px-12 lg:px-20 flex flex-col justify-center h-full">
        
        {/* TOP META DATA (Floating top left) */}
        <div className="absolute top-24 left-6 md:left-20 fade-in hidden md:block">
            <div className="flex items-center gap-3">
                <div className="flex gap-1">
                    <Star size={10} fill="#D52B1E" stroke="none" />
                    <Star size={10} fill="#0039A6" stroke="none" />
                    <Star size={10} fill="white" stroke="none" />
                </div>
               
            </div>
        </div>

        {/* --- DYNAMIC TYPOGRAPHY LAYOUT --- */}
        <div className="w-full max-w-[1600px] mx-auto relative flex flex-col py-10">

            {/* 1. TOP WORD (Aligned Left) */}
            <h1 className="hero-word-1 relative z-10 text-[13vw] leading-[0.8] font-black tracking-tighter uppercase text-white mix-blend-normal drop-shadow-2xl text-left">
                Defend
            </h1>

            {/* 2. MIDDLE DIVIDER & CTA (Spanning the gap) */}
            <div className="w-full flex items-center justify-between my-2 md:my-6 relative">
                
                {/* The Flag Line (Now runs full width between words) */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] md:h-[4px] flex z-0 opacity-50">
                    <div className="flag-line flag-line-white h-full bg-white w-full"></div>
                    <div className="flag-line flag-line-blue h-full bg-[#0039A6] w-full"></div>
                    <div className="flag-line flag-line-red h-full bg-[#D52B1E] w-full"></div>
                </div>

                {/* Subtext embedded IN the gap (Right aligned relative to Defend) */}
                <div className="relative z-10 ml-auto mr-[10vw] md:mr-[20vw] bg-black/80 backdrop-blur-sm px-4 py-2 border-l-2 border-[#D52B1E] fade-in max-w-[280px] md:max-w-md">
                     <p className="text-xs md:text-sm text-gray-300 font-light leading-relaxed">
                        Merging <span className="text-white font-medium">European Discipline</span> with <span className="text-[#D52B1E] font-medium">North American Power</span>.
                    </p>
                </div>
            </div>

            {/* 3. BOTTOM WORD (Aligned Right) */}
            <h1 className="hero-word-2 relative z-10 text-[13vw] leading-[0.8] font-black tracking-tighter uppercase text-[#D52B1E] drop-shadow-2xl text-right">
                The Paint
            </h1>

        </div>

        {/* --- BOTTOM CONTROLS --- */}
        <div className="mt-8 md:mt-0 flex flex-wrap items-center justify-between w-full max-w-[1600px] mx-auto fade-in">
             <button className="group flex items-center gap-3 border border-white/30 px-6 py-3 bg-black/40 hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-md">
                <span className="uppercase font-bold tracking-widest text-xs">Start Campaign</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Status Indicator */}
            <div className="flex items-center gap-4 mt-6 md:mt-0">
                <div className="text-right hidden md:block">
                    <span className="block text-[10px] text-gray-500 uppercase tracking-widest">Moscow / Toronto</span>
                </div>
                <div className="h-8 w-[1px] bg-white/20 hidden md:block"></div>
                <div className="flex items-center gap-2">
                    <div className="animate-pulse w-2 h-2 bg-[#D52B1E] rounded-full shadow-[0_0_10px_#D52B1E]"/>
                    <span className="font-mono text-[10px] text-white tracking-widest uppercase opacity-80">Online</span>
                </div>
            </div>
        </div>

      </div>
    </section>
  );
}