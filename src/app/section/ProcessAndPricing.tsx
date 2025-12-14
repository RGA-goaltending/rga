'use client';

import React from 'react';
import { Check, MapPin, Calendar, Activity, ArrowRight, Zap, Users, Star } from 'lucide-react';
import Copy from '../components/Copy'; // Ensure this path matches where you saved Copy.tsx

export default function CinematicPricing() {
  return (
    <section className="relative min-h-screen bg-[#110c0c] text-white font-sans overflow-hidden py-24 md:py-32 selection:bg-[#D52B1E] selection:text-white border-t border-white/20" id='price'>
      
      {/* ==================== 1. ARENA BACKGROUND SYSTEM ==================== */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Spotlight Effect (Top Center) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vw] h-[800px] bg-[radial-gradient(circle_at_top,rgba(133,80,80,0.15)_0%,transparent_70%)] blur-[60px]"></div>
          
          {/* Cold Blue/Red Ambient Glows */}
          <div className="absolute top-[20%] right-[-10%] w-[800px] h-[800px] bg-[#0039A6] opacity-[0.08] blur-[150px] rounded-full"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-[#D52B1E] opacity-[0.08] blur-[150px] rounded-full"></div>

          {/* "Scratched Ice" Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.15] bg-[url('https://www.transparenttextures.com/patterns/scratch-pad.png')] mix-blend-overlay"></div>
          
          {/* Tactical Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6">
        
        {/* ==================== HEADER ==================== */}
        <div className="text-center mb-20 relative">
            <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 px-6 py-2 rounded-full backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <Star size={14} className="text-[#D52B1E] fill-[#D52B1E]" />
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-white">Elite Training Rates</span>
                <Star size={14} className="text-[#0039A6] fill-[#0039A6]" />
            </div>
            
            <div className="mb-6">
                <Copy>
                    <h2 className="text-7xl md:text-[10rem] font-black uppercase drop-shadow-2xl leading-[0.85]">
                        Price <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">List</span>
                    </h2>
                </Copy>
            </div>
            
            <p className="text-gray-400 font-mono text-sm uppercase tracking-widest bg-black/50 inline-block px-4 py-2 rounded border border-white/10">
                ⚠️ Note: Ice rental fees are paid separately
            </p>
        </div>

        {/* ==================== PRICING CARDS ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32 relative items-start">
            
            {/* CARD 1: INDIVIDUAL (RED) */}
            <div className="group relative bg-[#111] border border-[#333] rounded-[2rem] p-1 overflow-hidden hover:border-[#D52B1E] transition-colors duration-500 shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D52B1E] to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="bg-[#0a0a0a] rounded-[1.8rem] p-8 h-full relative z-10">
                    <div className="flex justify-between items-start mb-8">
                        <div className="p-4 bg-[#D52B1E] rounded-2xl text-white shadow-[0_0_20px_rgba(213,43,30,0.4)]">
                            <Zap size={28} fill="currentColor" />
                        </div>
                        <div className="text-right">
                            <h3 className="text-3xl font-black uppercase italic">Individual</h3>
                            <p className="text-[#D52B1E] font-bold uppercase text-xs tracking-widest">1 on 1 Focus</p>
                        </div>
                    </div>

                    <div className="space-y-6 mb-10">
                        <PriceItem label="1 Session" price="135" />
                        <PriceItem label="5 Sessions" price="125" sub="/session" />
                        <PriceItem label="10 Sessions" price="110" sub="/session" activeColor="text-[#D52B1E]" />
                    </div>

                    <button className="w-full py-4 bg-[#1a1a1a] border border-white/10 rounded-xl uppercase font-black tracking-widest hover:bg-[#D52B1E] hover:text-white hover:border-[#D52B1E] transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-[0_0_30px_rgba(213,43,30,0.4)]">
                        Select Plan <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            {/* CARD 2: GROUP OF 2 (BLUE - HERO) */}
            <div className="group relative bg-[#111] border-2 border-[#0039A6] rounded-[2rem] p-1 overflow-hidden transform lg:-translate-y-6 shadow-[0_0_50px_rgba(0,57,166,0.15)] z-20">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#0039A6] text-white text-xs font-black uppercase tracking-widest px-6 py-2 rounded-b-xl z-20 shadow-lg">
                    Most Popular
                </div>

                <div className="bg-[#080808] rounded-[1.8rem] p-8 md:p-10 h-full relative z-10">
                    <div className="flex justify-between items-start mb-10 mt-4">
                        <div className="p-4 bg-[#0039A6] rounded-2xl text-white shadow-[0_0_20px_rgba(0,57,166,0.4)]">
                            <Users size={32} fill="currentColor" />
                        </div>
                        <div className="text-right">
                            <h3 className="text-4xl font-black uppercase italic text-white">Group of 2</h3>
                            <p className="text-[#0039A6] font-bold uppercase text-xs tracking-widest">Per Person</p>
                        </div>
                    </div>

                    <div className="space-y-6 mb-12">
                        <PriceItem label="1 Session" price="100" />
                        <PriceItem label="5 Sessions" price="90" sub="/session" />
                        <PriceItem label="10 Sessions" price="80" sub="/session" activeColor="text-[#0039A6]" />
                    </div>

                    <button className="w-full py-5 bg-[#0039A6] text-white rounded-xl uppercase font-black tracking-widest hover:bg-white hover:text-[#0039A6] transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,57,166,0.4)]">
                        Select Plan <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            {/* CARD 3: GROUP OF 3 (WHITE) */}
            <div className="group relative bg-[#111] border border-[#333] rounded-[2rem] p-1 overflow-hidden hover:border-white transition-colors duration-500 shadow-2xl">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="bg-[#0a0a0a] rounded-[1.8rem] p-8 h-full relative z-10">
                    <div className="flex justify-between items-start mb-8">
                        <div className="p-4 bg-white/10 rounded-2xl text-white border border-white/20">
                            <Activity size={28} />
                        </div>
                        <div className="text-right">
                            <h3 className="text-3xl font-black uppercase italic">Group of 3</h3>
                            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Per Person</p>
                        </div>
                    </div>

                    <div className="space-y-6 mb-10">
                        <PriceItem label="1 Session" price="85" />
                        <PriceItem label="5 Sessions" price="75" sub="/session" />
                        <PriceItem label="10 Sessions" price="65" sub="/session" activeColor="text-white" />
                    </div>

                    <button className="w-full py-4 bg-[#1a1a1a] border border-white/10 rounded-xl uppercase font-black tracking-widest hover:bg-white hover:text-black hover:border-white transition-all duration-300 flex items-center justify-center gap-2">
                        Select Plan <ArrowRight size={18} />
                    </button>
                </div>
            </div>

        </div>

        {/* ==================== PROCESS SECTION ==================== */}
        <div className="bg-[#000000] border border-white/10 rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
            
            <div className="relative z-10">
                <div className="flex flex-col md:flex-row gap-12 items-start">
                    
                    <div className="md:w-1/3">
                        <Copy>
                            <h3 className="text-6xl md:text-7xl font-normal uppercase mb-6 ">
                                The <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D52B1E] to-[#0039A6]">Protocol</span>
                            </h3>
                        </Copy>
                        
                        <Copy delay={0.2}>
                            <p className="text-gray-400 text-lg font-light leading-relaxed max-w-sm">
                                A seamless path from registration to on-ice dominance. System designed for efficiency.
                            </p>
                        </Copy>
                    </div>

                    <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ProcessCard 
                            num="01" 
                            title="Sign Up" 
                            desc="Contact us via the booking form to secure your spot."
                            icon={<Check size={20} />}
                        />
                        <ProcessCard 
                            num="02" 
                            title="Location" 
                            desc="We deploy to a rink near you or attend your team practice."
                            icon={<MapPin size={20} />}
                        />
                        <ProcessCard 
                            num="03" 
                            title="Session" 
                            desc="Intense technical refinement and drill execution."
                            icon={<Activity size={20} />}
                        />
                        <ProcessCard 
                            num="04" 
                            title="Custom Plan" 
                            desc="Long-term development strategy based on your data."
                            icon={<Calendar size={20} />}
                        />
                    </div>
                </div>
            </div>
        </div>

      </div>

      <style jsx global>{`
        .text-stroke-white { -webkit-text-stroke: 1px white; color: transparent; }
        @media (min-width: 768px) { .text-stroke-white { -webkit-text-stroke: 2px white; } }
      `}</style>
    </section>
  );
}

// --- SUB-COMPONENTS WITH TYPES ---

interface PriceItemProps {
  label: string;
  price: string | number;
  sub?: string;
  activeColor?: string;
}

const PriceItem: React.FC<PriceItemProps> = ({ label, price, sub, activeColor = "text-white" }) => (
    <div className="flex justify-between items-end border-b border-white/10 pb-4 last:border-0 hover:border-white/30 transition-colors">
        <span className="font-mono text-sm text-gray-400 uppercase font-bold">{label}</span>
        <div className="text-right leading-none">
            <span className={`text-3xl font-black ${activeColor}`}>${price}</span>
            {sub && <span className="text-[10px] text-gray-500 uppercase font-bold ml-1">{sub}</span>}
        </div>
    </div>
);

interface ProcessCardProps {
  num: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const ProcessCard: React.FC<ProcessCardProps> = ({ num, title, desc, icon }) => (
    <div className="bg-[#111] hover:bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-300 group">
        <div className="flex justify-between items-start mb-4">
            <span className="text-3xl font-black text-white/10 group-hover:text-white/40">{num}</span>
            <div className="text-white opacity-50 group-hover:opacity-100 group-hover:text-[#D52B1E] transition-all">
                {icon}
            </div>
        </div>
        <h4 className="text-lg font-black uppercase mb-2">{title}</h4>
        <p className="text-sm text-gray-400">{desc}</p>
    </div>
);