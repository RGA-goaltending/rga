'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Star, Trophy, GraduationCap, Heart, Globe, Shield, Zap, Mail, Phone } from 'lucide-react';

// =========================================================
// 1. HELPER: MARQUEE
// =========================================================
const Marquee = () => {
  const items = [
    "PRACTICAL EXPERIENCE",
    "GOALTENDING ACADEMY",
    "INDIVIDUAL APPROACH",
    "RUSSIAN TECHNIQUE",
  ];

  return (
    <div className="relative flex overflow-hidden border-y border-white/10 bg-black py-8 md:py-12 select-none z-20">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10"></div>
      
      <style jsx>{`
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
        .marquee-track { animation: scroll 25s linear infinite; }
        .russian-text {
          background-image: linear-gradient(180deg, #FFFFFF 33%, #0039A6 33%, #0039A6 66%, #D52B1E 66%);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
        }
      `}</style>

      <div className="flex min-w-full marquee-track">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center shrink-0">
            {items.map((text, index) => (
              <div key={index} className="flex items-center">
                <span className="russian-text mx-8 text-5xl md:text-8xl font-black uppercase font-normal italic">
                  {text}
                </span>
                <span className="text-white/20 text-3xl">★</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// =========================================================
// 2. HELPER: TEXT PRESSURE (Fixed Visibility)
// =========================================================
interface TextPressureProps {
  text?: string;
  fontFamily?: string;
  fontUrl?: string;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  alpha?: boolean;
  flex?: boolean;
  stroke?: boolean;
  scale?: boolean;
  textColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
  minFontSize?: number;
}

const TextPressure: React.FC<TextPressureProps> = ({
  text = 'Compressa',
  fontFamily = 'Compressa VF',
  fontUrl = 'https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2',
  width = true,
  weight = true,
  italic = true,
  alpha = false,
  flex = true,
  stroke = false,
  scale = false,
  textColor = '#FFFFFF',
  strokeColor = '#FF0000',
  strokeWidth = 2,
  className = '',
  minFontSize = 24
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);

  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);

  const chars = text.split('');

  const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      cursorRef.current.x = t.clientX;
      cursorRef.current.y = t.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    if (containerRef.current) {
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = left + width / 2;
      mouseRef.current.y = top + height / 2;
      cursorRef.current.x = mouseRef.current.x;
      cursorRef.current.y = mouseRef.current.y;
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const setSize = () => {
    if (!containerRef.current || !titleRef.current) return;
    const { width: containerW, height: containerH } = containerRef.current.getBoundingClientRect();
    let newFontSize = containerW / (chars.length / 2);
    newFontSize = Math.max(newFontSize, minFontSize);
    setFontSize(newFontSize);
    setScaleY(1);
    setLineHeight(1);
  };

  useEffect(() => {
    setSize();
    window.addEventListener('resize', setSize);
    return () => window.removeEventListener('resize', setSize);
  }, [scale, text]);

  useEffect(() => {
    let rafId: number;
    const animate = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;

      if (titleRef.current) {
        const titleRect = titleRef.current.getBoundingClientRect();
        const maxDist = titleRect.width / 2;

        spansRef.current.forEach(span => {
          if (!span) return;
          const rect = span.getBoundingClientRect();
          const charCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2
          };
          const d = dist(mouseRef.current, charCenter);
          const getAttr = (distance: number, minVal: number, maxVal: number) => {
            const val = maxVal - Math.abs((maxVal * distance) / maxDist);
            return Math.max(minVal, val + minVal);
          };

          const wdth = width ? Math.floor(getAttr(d, 5, 200)) : 100;
          const wght = weight ? Math.floor(getAttr(d, 100, 900)) : 400;
          const italVal = italic ? getAttr(d, 0, 1).toFixed(2) : '0';
          const alphaVal = alpha ? getAttr(d, 0, 1).toFixed(2) : '1';

          span.style.opacity = alphaVal;
          span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;
        });
      }
      rafId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(rafId);
  }, [width, weight, italic, alpha, chars.length]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-transparent z-10">
      <style>{`
        @font-face {
          font-family: '${fontFamily}';
          src: url('${fontUrl}');
          font-style: normal;
        }
        .stroke span { position: relative; color: ${textColor}; }
        .stroke span::after {
          content: attr(data-char);
          position: absolute; left: 0; top: 0; color: transparent; z-index: -1;
          -webkit-text-stroke-width: ${strokeWidth}px;
          -webkit-text-stroke-color: ${strokeColor};
        }
        /* FIXED SELECTOR: The class applies directly to the h1 */
        h1.russian-text-fill {
           background-image: linear-gradient(180deg, #FFFFFF 35%, #0039A6 35%, #0039A6 65%, #D52B1E 65%);
           background-size: 100%;
           -webkit-background-clip: text;
           background-clip: text;
           -webkit-text-fill-color: transparent; 
           color: transparent;
        }
      `}</style>

      <h1
        ref={titleRef}
        className={`text-pressure-title ${className} ${flex ? 'flex justify-between' : ''} ${stroke ? 'stroke' : ''} uppercase text-center`}
        style={{
          fontFamily,
          fontSize: fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          transformOrigin: 'center top',
          margin: 0,
          fontWeight: 100,
          color: stroke ? undefined : textColor
        }}
      >
        {chars.map((char, i) => (
          <span key={i} ref={el => { spansRef.current[i] = el; }} data-char={char} className="inline-block">
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
};

// =========================================================
// 3. MAIN PAGE COMPONENT
// =========================================================

export default function AboutCoachPage() {
  return (
    <div className="relative font-sans text-white bg-[#050505] selection:bg-[#D52B1E] selection:text-white overflow-x-hidden">
      
      {/* Global Cinematic Grain */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.06] z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

      {/* ==================== SECTION 1: HERO & BIO ==================== */}
      <section className="relative min-h-screen w-full overflow-hidden bg-[#050505]">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
            
            {/* Desktop Static Image */}
            <div className="hidden lg:block lg:col-span-5 relative h-screen sticky top-0 border-r border-white/5">
                <div className="absolute inset-0 bg-gray-900">
                    <Image 
                      src="/img/co.webp" 
                      alt="Nariman Volkov" 
                      fill 
                      className="object-cover object-top"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-[#050505]"></div>
                </div>
                <div className="absolute bottom-12 left-12 origin-bottom-left -rotate-90 pointer-events-none select-none">
                      <h1 className="text-[12vh] font-black uppercase text-transparent text-stroke-white opacity-20 whitespace-nowrap">
                            Nariman Volkov
                      </h1>
                </div>
            </div>

            {/* Right: Content */}
            <div className="col-span-1 lg:col-span-7 flex flex-col relative">
                <div className="p-6 md:p-12 lg:p-24 max-w-4xl mx-auto w-full">
                    
                    {/* Mobile Image */}
                    <div className="block lg:hidden relative w-full aspect-[4/5] mb-10 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                        <Image 
                           src="/img/co.webp" 
                           alt="Nariman Volkov" 
                           fill 
                           className="object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#D52B1E] mb-2 block">Founder</span>
                            <h2 className="text-3xl font-black uppercase">Nariman Volkov</h2>
                        </div>
                    </div>

                    <div className="mb-8 relative z-10">
                        <div className="flex items-center gap-3 mb-2 text-[#D52B1E]">
                            <Star size={14} fill="currentColor" />
                            <span className="text-xs font-bold uppercase tracking-[0.3em]">RGA Founder</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-medium uppercase leading-[0.9]">
                            Nariman <span className="font-serif italic text-gray-500">Volkov</span>
                        </h1>
                    </div>

                    <div className="space-y-8 text-gray-300 font-light leading-relaxed">
                        <p className="text-xl text-white">
                            Hockey Goalie Coach, RGA Founder. A graduate of the <b className="text-[#0039A6]">Kazan Hockey Academy</b>.
                        </p>
                        <div className="w-full h-[1px] bg-white/10"></div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                 <div className="flex items-center gap-2 text-[#D52B1E] font-bold uppercase text-xs tracking-widest">
                                    <Trophy size={14} /> Competition
                                 </div>
                                 <p className="text-sm">Competed in Russia&apos;s Junior Hockey League and at the University level.</p>
                            </div>
                            <div className="space-y-2">
                                 <div className="flex items-center gap-2 text-[#D52B1E] font-bold uppercase text-xs tracking-widest">
                                    <GraduationCap size={14} /> Education
                                 </div>
                                 <p className="text-sm">Certified Goalie Specialist. Bachelor&apos;s Degree in Physical Education.</p>
                            </div>
                        </div>

                        <div className="bg-white/5 p-6 border-l-2 border-[#0039A6] rounded-r-lg">
                            <h4 className="text-white font-bold uppercase text-sm tracking-widest mb-3">Experience</h4>
                            <p className="text-sm text-gray-300">
                                Coached goalies on the Kazan women&apos;s team and elite goaltenders playing in: 
                                <span className="text-white font-medium block mt-2 text-sm tracking-wide">KHL • VHL • MHL • Junior A • AAA</span>
                            </p>
                        </div>
                        
                        <div>
                            <div className="flex items-center gap-2 text-[#D52B1E] font-bold uppercase text-xs tracking-widest mb-2">
                                <Heart size={14} /> Social Impact
                            </div>
                            <p className="text-sm">
                                Organizer of Kind Heart charity games and Cool Ice championships for youth development.
                            </p>
                        </div>

                        <p className="font-serif italic text-2xl text-white pt-4 border-t border-white/10 mt-8">
                            I am thrilled to share my knowledge with Canadian goaltenders!
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <Marquee />

      {/* ==================== SECTION 2: PHILOSOPHY ("CLASH OF ELEMENTS") ==================== */}
      <section className="relative w-full bg-[#1d1919] border-t border-white/10 overflow-hidden">
         
         <div className="absolute inset-0 z-0">
             {/* Ice/Blue */}
             <div className="absolute top-0 left-0 w-1/2 h-full bg-[#020c1b]">
                 <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/shattered-island.png')] mix-blend-overlay"></div>
                 <div className="absolute inset-0 bg-gradient-to-r from-[#040a16]/20 to-transparent"></div>
             </div>
             {/* Fire/Red */}
             <div className="absolute top-0 right-0 w-1/2 h-full bg-[#1a0505]">
                 <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
                 <div className="absolute inset-0 bg-gradient-to-l from-[#2c0806]/20 to-transparent"></div>
             </div>
             <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/20 shadow-[0_0_30px_rgba(255,255,255,0.5)] z-10"></div>
             <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-white/5 rounded-full blur-[120px] mix-blend-overlay"></div>
         </div>

         <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 md:py-48">
             <div className="text-center mb-24 relative">
                 <div className="inline-flex items-center gap-3 border border-white/20 px-5 py-2 rounded-full mb-8 bg-black/60 backdrop-blur-md shadow-2xl">
                     <Shield size={16} className="text-white" />
                     <span className="text-xs font-bold uppercase tracking-[0.3em]">The Methodology</span>
                 </div>
                 
                 <h2 className="text-5xl md:text-9xl font-black uppercase font-normal leading-none relative z-10 drop-shadow-2xl">
                     Two Worlds. <br/>
                     <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-[#0039A6] to-[#D52B1E]">
                        One System.
                     </span>
                 </h2>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 relative">
                 <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 bg-[#080808] border border-white/20 rounded-full items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                    <span className="font-black italic text-white/50 text-sm">VS</span>
                 </div>

                 <div className="text-center md:text-right space-y-6 relative group">
                     <div className="absolute inset-0 bg-[#0039A6] opacity-0 group-hover:opacity-5 blur-[50px] transition-opacity duration-700 pointer-events-none"></div>
                     <div className="inline-block p-4 bg-gradient-to-br from-[#0039A6]/20 to-black rounded-2xl mb-4 border border-[#0039A6]/30 shadow-[0_0_30px_rgba(0,57,166,0.2)]">
                        <Globe size={40} className="text-[#0039A6]" />
                     </div>
                     <h3 className="text-3xl md:text-5xl font-black uppercase text-white"><span className="text-[#0039A6]">European</span> <br/> Technique</h3>
                     <div className="h-1 w-20 bg-[#0039A6] ml-auto mr-auto md:mr-0 md:ml-auto"></div>
                     <p className="text-lg text-blue-100/70 leading-relaxed font-light">
                        Built on the Soviet foundation of <strong className="text-white">fluid skating</strong>, positional discipline, and tactical IQ. We teach efficiency over wasted movement.
                     </p>
                 </div>

                 <div className="text-center md:text-left space-y-6 relative group">
                     <div className="absolute inset-0 bg-[#D52B1E] opacity-0 group-hover:opacity-5 blur-[50px] transition-opacity duration-700 pointer-events-none"></div>
                     <div className="inline-block p-4 bg-gradient-to-bl from-[#D52B1E]/20 to-black rounded-2xl mb-4 border border-[#D52B1E]/30 shadow-[0_0_30px_rgba(213,43,30,0.2)]">
                        <Shield size={40} className="text-[#D52B1E]" />
                     </div>
                     <h3 className="text-3xl md:text-5xl font-black uppercase text-white"><span className="text-[#D52B1E]">American</span> <br/> Aggression</h3>
                     <div className="h-1 w-20 bg-[#D52B1E] mx-auto md:mx-0"></div>
                     <p className="text-lg text-red-100/70 leading-relaxed font-light">
                        Forged in the fires of North American hockey. We instill <strong className="text-white">battle mentality</strong>, crease control, and the ability to fight through traffic.
                     </p>
                 </div>
             </div>
             
             <div className="mt-32 text-center max-w-3xl mx-auto relative z-10">
                 <p className="text-2xl md:text-4xl font-light text-white leading-tight">
                    Our goal isn&apos;t just to teach saves. It is to engineer <span className="text-white font-bold underline decoration-[#D52B1E] underline-offset-8 decoration-4">dominance</span>.
                 </p>
             </div>
         </div>
      </section>

      {/* ==================== SPACER: TEXT PRESSURE (Smaller Text) ==================== */}
      <div className="w-full md:h-[50vh] h-60 p-8 flex  text-center items-center justify-center bg-[#181313] relative overflow-hidden border border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]"></div>
          
          <TextPressure 
            text="DOMINANCE" 
            textColor="transparent" 
            className="russian-text-fill" 
            minFontSize={40} 
          />
          
          <div className="absolute bottom-10 left-0 w-full text-center">
             <p className="text-[#D52B1E] font-mono tracking-widest text-xs animate-pulse">INTERACTIVE // MOVE CURSOR</p>
          </div>
      </div>

      {/* ==================== SECTION 3: SIGN UP (AURORA STYLE) ==================== */}
      <section className="relative w-full py-32 bg-gray-800 overflow-hidden border-t border-white/10">
         <div className="absolute inset-0 z-0">
             <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[150%] bg-[#D52B1E] blur-[150px] opacity-10 animate-aurora"></div>
             <div className="absolute bottom-[-50%] right-[-20%] w-[80%] h-[150%] bg-[#0039A6] blur-[150px] opacity-10 animate-aurora-reverse"></div>
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] z-10"></div>
             <div className="absolute inset-0 z-10 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
         </div>

         <div className="relative z-20 w-full max-w-7xl px-6 mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
             <div>
                 <div className="mb-6 flex items-center gap-3">
                     <div className="h-[1px] w-8 bg-[#D52B1E]"></div>
                     <span className="font-mono text-xs uppercase tracking-[0.4em] text-[#D52B1E] font-bold">
                       Excellence Awaits
                     </span>
                 </div>
                 
                 <h2 className="text-6xl md:text-8xl font-black uppercase  leading-[1] mb-6 text-white font-normal">
                     Train With <br/>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D52B1E] via-white to-[#D52B1E] animate-shine bg-[length:200%_auto]">
                       The Best
                     </span>
                 </h2>
                 
                 <p className="text-xl text-gray-400 font-light max-w-sm border-l-2 border-white/20 pl-4">
                     Limited spots available for the upcoming season.
                 </p>
             </div>

             <div className="flex justify-center md:justify-end">
                 <div className="group relative cursor-pointer">
                     <div className="absolute inset-0 bg-[#D52B1E] blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                     
                     <div className="w-48 h-48 border border-white/20 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-300 hover:scale-105 hover:border-white/50 shadow-2xl">
                         <div className="absolute inset-0 bg-[#D52B1E] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)]"></div>
                         
                         <div className="relative z-10 flex flex-col items-center text-center gap-1 text-white transition-colors duration-300">
                             <span className="text-lg font-bold uppercase tracking-widest">
                                 Join <br/> Now
                             </span>
                             <ArrowRight className="w-5 h-5 mt-1" />
                         </div>
                     </div>
                 </div>
             </div>
         </div>
      </section>

      <style jsx global>{`
        .text-stroke-white { -webkit-text-stroke: 1px white; color: transparent; }
        @media (min-width: 768px) { .text-stroke-white { -webkit-text-stroke: 2px white; } }
        
        @keyframes aurora {
             0% { transform: translate(0, 0) rotate(0deg); }
             50% { transform: translate(10%, 10%) rotate(5deg); }
             100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes aurora-reverse {
             0% { transform: translate(0, 0) rotate(0deg); }
             50% { transform: translate(-10%, -10%) rotate(-5deg); }
             100% { transform: translate(0, 0) rotate(0deg); }
        }
        .animate-aurora { animation: aurora 15s ease-in-out infinite; }
        .animate-aurora-reverse { animation: aurora-reverse 20s ease-in-out infinite; }
        
        @keyframes shine { to { background-position: 200% center; } }
        .animate-shine { animation: shine 4s linear infinite; }
      `}</style>
    </div>
  );
}