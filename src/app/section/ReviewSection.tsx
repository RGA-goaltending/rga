'use client';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "Johnathan Kimelman",
    role: "Student",
    quote: "Working with Coach Roma has had a large impact on the way I play the game. He offers a vastly different experience due to his training in Russia. Goalies in North America simply don't work on the fundamentals the same way."
  },
  {
    id: 2,
    name: "Ilya Golubev",
    role: "Ak-Bars Kazan (Pro)",
    quote: "The type of coach that pushes you to the limits and helps you to step up when you think it’s impossible. The attitude given by Nariman is essential when you play professional hockey."
  },
  {
    id: 3,
    name: "Ruslan Baygeldin",
    role: "Irbis Kazan",
    quote: "I worked with Nariman during my recovery. He is a qualified professional with an individual approach. By the beginning of the season, I was 100% ready. Highly recommend this coach."
  },
  {
    id: 4,
    name: "Edor",
    role: "GTHL U16 AAA",
    quote: "Coach Roma identified areas to improve immediately. We appreciate the training intensity he brings on ice everyday. Play hard, practice harder—Edor learns mental toughness and focus."
  }
];

export default function AwardWinningReviews() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const containerRef = useRef(null);
  const quoteRef = useRef(null);
  const detailsRef = useRef(null);
  const bgTextRef = useRef(null);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  // --- ANIMATION LOGIC ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      
      const tl = gsap.timeline({
        onComplete: () => setIsAnimating(false)
      });

      // 1. Text Entry Animation
      // Since the image is gone, we focus purely on the text sliding up smoothly
      tl.fromTo([quoteRef.current, detailsRef.current], 
        { 
          y: 50, 
          opacity: 0 
        },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          ease: "power3.out", 
          stagger: 0.1 
        }
      );

      // Background Text Parallax Shift
      gsap.to(bgTextRef.current, {
        x: -50 * current, // Moves slightly on every slide change
        duration: 1.5,
        ease: "power2.out"
      });

    }, containerRef);

    return () => ctx.revert();
  }, [current]);

  return (
    <section ref={containerRef} className="relative min-h-screen bg-[#050505] text-white flex flex-col justify-center py-20 overflow-hidden font-sans selection:bg-[#D52B1E] selection:text-white" id='reviews'>
      
      {/* ==================================================================
          BACKGROUND: GIANT TYPOGRAPHY
      ================================================================== */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full select-none pointer-events-none z-0">
          <h1 ref={bgTextRef} className="text-[35vw] font-normal uppercase text-[#111] whitespace-nowrap leading-none opacity-50 text-center">
              Impact
          </h1>
      </div>

      {/* ==================================================================
          MAIN CONTENT
          Centered Layout since Image is removed
      ================================================================== */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 w-full h-full flex flex-col items-center justify-center">

         {/* --- QUOTE & DETAILS --- */}
         <div className="w-full max-w-4xl mx-auto flex flex-col justify-center">
             
             {/* Metadata */}
             <div className="flex items-center gap-3 mb-10 text-[#0039A6]">
                 <span className="text-xs font-bold uppercase tracking-[0.3em]">Live Client Feedback</span>
                 <div className="w-12 h-[1px] bg-white/20"></div>
                 <span className="text-xs font-bold uppercase tracking-[0.3em]">2025</span>
             </div>

             {/* The Quote */}
             <div ref={quoteRef} className="relative">
                 <Quote className="absolute -top-10 -left-12 md:-left-20 text-white/10 w-20 h-20 md:w-32 md:h-32 transform -scale-x-100" />
                 <h2 className="text-3xl md:text-5xl lg:text-6xl font-normal uppercase mb-12 leading-tight">
                     {reviews[current].quote}
                 </h2>
             </div>

             {/* Author Details & Navigation */}
             <div ref={detailsRef} className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-t border-white/10 pt-8">
                 
                 {/* Name */}
                 <div>
                     <h3 className="text-3xl font-bold uppercase text-white mb-1">
                         {reviews[current].name}
                     </h3>
                     <p className="font-serif italic text-gray-400 text-lg">
                         {reviews[current].role}
                     </p>
                 </div>

                 {/* Navigation Buttons */}
                 <div className="flex gap-4">
                     <button 
                       onClick={prevSlide}
                       disabled={isAnimating}
                       className="w-16 h-16 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 rounded-full md:rounded-none"
                     >
                        <ArrowLeft size={24} />
                     </button>
                     <button 
                       onClick={nextSlide}
                       disabled={isAnimating}
                       className="w-16 h-16 bg-[#D52B1E] text-white flex items-center justify-center hover:bg-[#0039A6] transition-all duration-300 disabled:opacity-50 rounded-full md:rounded-none"
                     >
                        <ArrowRight size={24} />
                     </button>
                 </div>

             </div>

         </div>

      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-0 left-0 h-2 bg-[#111] w-full">
          <div 
            className="h-full bg-[#D52B1E] transition-all duration-700 ease-out"
            style={{ width: `${((current + 1) / reviews.length) * 100}%` }}
          ></div>
      </div>

    </section>
  );
}