'use client';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowLeft, ArrowRight, Quote, Star } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "Johnathan Kimelman",
    role: "Student",
    quote: "Working with Coach Roma has had a large impact. He offers a vastly different experience due to his training in Russia. Goalies in North America simply don't work on the fundamentals the same way."
  },
  {
    id: 2,
    name: "Ilya Golubev",
    role: "Ak-Bars Kazan (Pro)",
    quote: "The type of coach that pushes you to the limits and helps you step up when you think it’s impossible. The attitude given by Nariman is essential when you play professional hockey."
  },
  {
    id: 3,
    name: "Ruslan Baygeldin",
    role: "Irbis Kazan",
    quote: "I worked with Nariman during my recovery. He is a qualified professional with an individual approach. By the beginning of the season, I was 100% ready. Highly recommend."
  },
  {
    id: 4,
    name: "Edor",
    role: "GTHL U16 AAA",
    quote: "Coach Roma identified areas to improve immediately. We appreciate the training intensity he brings on ice everyday. Play hard, practice harder—Edor learns mental toughness."
  }
];

export default function AwardWinningReviews() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const containerRef = useRef(null);
  const contentRef = useRef(null);
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

      // 1. Content Fade Out/In
      tl.fromTo(contentRef.current, 
        { y: 20, opacity: 0, filter: "blur(10px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.6, ease: "power2.out" }
      );

      // 2. Parallax Text Shift
      gsap.to(bgTextRef.current, {
        x: -20 * current, 
        duration: 1.2,
        ease: "power2.out"
      });

    }, containerRef);

    return () => ctx.revert();
  }, [current]);

  return (
    <section ref={containerRef} className="relative min-h-[80vh] bg-[#050505] text-white flex flex-col justify-center py-24 overflow-hidden font-sans selection:bg-[#D52B1E] selection:text-white border-t border-white/10" id='reviews'>
      
      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
          {/* Subtle Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          
          {/* Giant Text */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full overflow-hidden">
             <h1 ref={bgTextRef} className="text-[12vw] font-black uppercase text-white/5 whitespace-nowrap leading-none text-center tracking-tighter">
                 Performance
             </h1>
          </div>

          {/* Red Glow Spot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D52B1E] opacity-[0.05] blur-[120px] rounded-full"></div>
      </div>

      {/* --- MAIN CONTENT CARD --- */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6">
         
         <div className="bg-white/5 border border-white/10 backdrop-blur-md p-8 md:p-16 relative overflow-hidden group">
            
            {/* Decorative Top Line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D52B1E] to-transparent opacity-50"></div>
            
            <div ref={contentRef} className="relative z-10">
                
                {/* Header: Stars & Index */}
                <div className="flex justify-between items-start mb-8">
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className="fill-[#D52B1E] text-[#D52B1E]" />
                        ))}
                    </div>
                    <div className="font-mono text-xs text-gray-500 uppercase tracking-widest">
                        Case Study 0{current + 1} / 0{reviews.length}
                    </div>
                </div>

                {/* Main Quote */}
                <div className="mb-10 relative">
                    <Quote className="absolute -top-6 -left-8 text-white/10 w-16 h-16 transform -scale-x-100 hidden md:block" />
                    <p className="text-xl md:text-3xl font-light leading-relaxed text-gray-200">
                        {reviews[current].quote}
                    </p>
                </div>

                {/* Footer: Name & Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-white/5">
                    
                    {/* Author Info */}
                    <div className="text-center md:text-left">
                        <h4 className="text-lg font-bold uppercase tracking-wide text-white">{reviews[current].name}</h4>
                        <p className="text-xs font-mono text-[#D52B1E] uppercase tracking-widest mt-1">{reviews[current].role}</p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2">
                        <button 
                          onClick={prevSlide}
                          disabled={isAnimating}
                          className="w-12 h-12 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300 disabled:opacity-50"
                        >
                           <ArrowLeft size={18} />
                        </button>
                        <button 
                          onClick={nextSlide}
                          disabled={isAnimating}
                          className="w-12 h-12 bg-[#D52B1E] text-white flex items-center justify-center hover:bg-[#0039A6] transition-all duration-300 disabled:opacity-50"
                        >
                           <ArrowRight size={18} />
                        </button>
                    </div>

                </div>
            </div>

         </div>

      </div>

    </section>
  );
}