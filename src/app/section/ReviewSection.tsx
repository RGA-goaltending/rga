'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "Johnathan Kimelman",
    role: "Student",
    image: "/img/r1.jpg", // Placeholder
    quote: "Working with Coach Roma has had a large impact on the way I play the game. He offers a vastly different experience due to his training in Russia. Goalies in North America simply don't work on the fundamentals the same way."
  },
  {
    id: 2,
    name: "Ilya Golubev",
    role: "Ak-Bars Kazan (Pro)",
    image: "/img/r2.png", // Placeholder
    quote: "The type of coach that pushes you to the limits and helps you to step up when you think it’s impossible. The attitude given by Nariman is essential when you play professional hockey."
  },
  {
    id: 3,
    name: "Ruslan Baygeldin",
    role: "Irbis Kazan",
    image: "/img/r3.png", // Placeholder
    quote: "I worked with Nariman during my recovery. He is a qualified professional with an individual approach. By the beginning of the season, I was 100% ready. Highly recommend this coach."
  },
  {
    id: 4,
    name: "Edor",
    role: "GTHL U16 AAA",
    image: "/img/r4.png", // Placeholder
    quote: "Coach Roma identified areas to improve immediately. We appreciate the training intensity he brings on ice everyday. Play hard, practice harder—Edor learns mental toughness and focus."
  }
];

export default function AwardWinningReviews() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const containerRef = useRef(null);
  const imageRef = useRef(null);
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

      // 1. Text Exit (Fade Up & Out)
      tl.to([quoteRef.current, detailsRef.current], {
        y: -50,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        stagger: 0.1
      })
      
      // 2. Image Exit (Scale Down / Clip)
      .to(imageRef.current, {
        clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)", // Wipe out downwards
        duration: 0.5,
        ease: "power4.in"
      }, "<") // overlap with text exit

      // --- STATE UPDATE HAPPENS VISUALLY HERE ---
      
      // 3. Image Enter (Wipe In from bottom)
      .set(imageRef.current, { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" }) 
      .to(imageRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", // Reveal full
        duration: 0.8,
        ease: "power4.out",
        delay: 0.1
      })

      // 4. Text Enter (Slide Up from bottom)
      .fromTo([quoteRef.current, detailsRef.current], 
        { y: 100, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          ease: "power3.out", 
          stagger: 0.1 
        }, 
        "-=0.6"
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
          Like the "TRUST" text in your reference image
      ================================================================== */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full select-none pointer-events-none z-0">
          <h1 ref={bgTextRef} className="text-[35vw] font-normal uppercase text-[#111] whitespace-nowrap leading-none  opacity-50">
              Impact
          </h1>
      </div>

     

      {/* ==================================================================
          MAIN CONTENT GRID
          Matches your reference: Image Left, Text Right
      ================================================================== */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 w-full h-full flex flex-col lg:flex-row items-center gap-12 lg:gap-24">

         {/* --- LEFT: PORTRAIT IMAGE --- */}
         <div className="w-full lg:w-5/12 aspect-[4/5] relative">
             {/* Decorative Border Frame */}
             <div className="absolute -inset-4 border border-white/10 z-0 hidden lg:block"></div>
             
             {/* The Image Container with Masking */}
             <div className="relative w-full h-full overflow-hidden bg-[#111]">
                 <div ref={imageRef} className="w-full h-full relative">
                     <Image 
                        src={reviews[current].image}
                        alt={reviews[current].name}
                        fill
                        className="object-cover "
                        priority
                     />
                     {/* Gradient Overlay for Text Readability if needed */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                 </div>
             </div>

             {/* Floating Badge */}
             <div className="absolute -top-6 -right-6 bg-[#D52B1E] text-white w-24 h-24 rounded-full flex items-center justify-center font-normal text-3xl rotate-12 shadow-2xl z-20">
                 99
             </div>
         </div>


         {/* --- RIGHT: QUOTE & DETAILS --- */}
         <div className="w-full lg:w-7/12 flex flex-col justify-center">
             
             {/* Metadata */}
             <div className="flex items-center gap-3 mb-8 text-[#0039A6]">
                 <span className="text-xs font-bold uppercase tracking-[0.3em]">Live Client Feedback</span>
                 <div className="w-12 h-[1px] bg-white/20"></div>
                 <span className="text-xs font-bold uppercase tracking-[0.3em]">2025</span>
             </div>

             {/* The Quote */}
             <div ref={quoteRef} className="relative">
                 <Quote className="absolute -top-8 -left-10 text-white/10 w-24 h-24 transform -scale-x-100" />
                 <h2 className="text-3xl md:text-5xl lg:text-4xl font-normal uppercase mb-12">
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
                        className="w-16 h-16 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50"
                     >
                        <ArrowLeft size={24} />
                     </button>
                     <button 
                        onClick={nextSlide}
                        disabled={isAnimating}
                        className="w-16 h-16 bg-[#D52B1E] text-white flex items-center justify-center hover:bg-[#0039A6] transition-all duration-300 disabled:opacity-50"
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