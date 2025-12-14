'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Star } from 'lucide-react';
import Copy from '../components/Copy'; // Ensure this path matches where you saved Copy.tsx

gsap.registerPlugin(ScrollTrigger);

export default function AboutTeaser() {
  const containerRef = useRef(null);
  const zoomTargetRef = useRef(null);
  const contentLayerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=1500", 
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      // --- OPTIMIZED ZOOM SEQUENCE ---
      // Scale 1972 text up
      tl.to(zoomTargetRef.current, {
        scale: 12, 
        duration: 2,
        ease: "power2.inOut",
        force3D: true,
      })
      // Fade it out
      .to(zoomTargetRef.current, {
        autoAlpha: 0, 
        duration: 0.2,
        ease: "power1.out"
      }, "-=0.5")

      // --- REVEAL CONTENT CONTAINER ---
      // We only fade in the container here. 
      // The text inside will animate itself via the <Copy /> component.
      .fromTo(contentLayerRef.current,
        { autoAlpha: 0, y: 20 }, 
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.2"
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-black text-white overflow-hidden flex items-center justify-center font-sans">
      
      {/* --- LAYER 1: BACKGROUND VIDEO --- */}
      <div className="absolute inset-0 z-0 bg-black">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover opacity-60 will-change-transform"
        >
           <source src="/img/h1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* --- LAYER 2: THE "1972" PORTAL --- */}
      <div 
        ref={zoomTargetRef} 
        className="absolute z-10 inset-0 flex items-center justify-center bg-black origin-center will-change-transform"
        style={{ backfaceVisibility: 'hidden' }}
      >
         <h1 
            className="text-[25vw] font-bold leading-none select-none bg-clip-text text-transparent"
            style={{
                backgroundImage: 'linear-gradient(180deg, #ffffff 33%, #0039A6 33%, #0039A6 66%, #D52B1E 66%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                transform: 'translateZ(0)',
            }}
         >
           1972
         </h1>
      </div>

      {/* --- LAYER 3: CENTERED CONTENT --- */}
      <div ref={contentLayerRef} className="relative z-20 w-full max-w-5xl mx-auto px-6 text-center flex flex-col items-center justify-center h-full opacity-0 will-change-transform">
        
        {/* Top Label */}
        <div className="mb-8 flex items-center gap-2 border border-white/20 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md">
            <Star size={12} className="text-[#D52B1E] fill-[#D52B1E]" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/90">
                The Origin Story
            </span>
        </div>

        {/* MASSIVE HEADLINE (Using Copy) */}
        <div className="mb-10">
            <Copy>
                <h2 className="text-6xl md:text-8xl font-normal uppercase leading-none">
                    <span className="block text-white">Chance &</span>
                    <span className="block text-white drop-shadow-2xl">History</span>
                </h2>
            </Copy>
        </div>

        {/* THE STORY TEXT (Using Copy) */}
        <div className="max-w-3xl space-y-8 text-xl md:text-2xl font-light leading-relaxed text-gray-200">
            <Copy delay={0.1}>
                <p>
                    My dream began in 2014 at a veterans game with <strong className="text-white font-bold">Phil Esposito</strong>. 
                    I spoke no English, but I showed up with a retro Soviet jersey to honor the &apos;72 Super Series.
                </p>
            </Copy>
            
            <Copy delay={0.2}>
                <p>
                    He looked at my uniform and jokingly said: <br/>
                    <span className="text-[#D52B1E] font-serif italic text-3xl block mt-4"> Maybe the USSR national team lacked a goalie like that.</span>
                </p>
            </Copy>

            <Copy delay={0.3}>
                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                    That moment changed everything. I realized I wanted to immerse myself in North American hockey, learning from the true masters of their craft.
                </p>
            </Copy>
        </div>

        {/* CTA BUTTON */}
        <div className="mt-12">
            <Link href="/about" className="group relative inline-flex items-center gap-4 px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-[#D52B1E] hover:text-white transition-all duration-300 rounded-sm">
                <span>Read Full Legend</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>

      </div>

      <style jsx global>{`
        .text-stroke-white {
          -webkit-text-stroke: 1px rgba(255,255,255,0.8);
          color: transparent;
        }
        @media (min-width: 768px) {
            .text-stroke-white {
              -webkit-text-stroke: 2px rgba(255,255,255,0.8);
            }
        }
      `}</style>
    </section>
  );
}