'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Mail, Phone, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const links = [
    { name: "About our School", href: "/about" },
   
    { name: "Prices", href: "/prices" },
    { name: "Reviews", href: "/reviews" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contacts", href: "/contacts" },
    { name:"Camps", href:"/camps" }
  ];

  return (
    <footer className="relative bg-[#050505] text-[#Eaeaea] font-sans overflow-hidden pt-32 pb-12">
      
      {/* ==================== 1. RUSSIAN THEME BORDER (White/Blue/Red) ==================== */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-white via-[#0039A6] to-[#D52B1E] z-50"></div>

      {/* ==================== 2. CINEMATIC BACKGROUND ==================== */}
      <div className="absolute inset-0 pointer-events-none z-0">
          {/* Ambient Glows (Russian Colors) */}
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#0039A6] opacity-[0.08] blur-[150px] rounded-full"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#D52B1E] opacity-[0.08] blur-[150px] rounded-full"></div>
          
          {/* Textures */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay"></div>
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/shattered-island.png')] mix-blend-overlay"></div>
      </div>

      {/* ==================== 3. GIANT TYPOGRAPHY BACKGROUND ==================== */}
      <div className="absolute top-20 left-0 w-full overflow-hidden pointer-events-none opacity-[0.02]">
        <span className="text-[25vw] leading-none font-black whitespace-nowrap text-white select-none">
          RGA ELITE
        </span>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* --- COL 1: BRAND & BIG LOGO --- */}
          <div className="lg:col-span-5 flex flex-col space-y-8">
            <div className="relative group w-fit">
                {/* Glow behind logo */}
                <div className="absolute inset-0 bg-white/10 blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700"></div>
                
                {/* BIG LOGO CONTAINER */}
                <div className="relative w-48 h-48 md:w-56 md:h-56  transition-all duration-700 ease-out">
                    <Image 
                        src="/img/logo.png" 
                        alt="GoalieSchool Logo" 
                        fill 
                        className="object-contain drop-shadow-2xl"
                    />
                </div>
            </div>

            <div className="space-y-4 max-w-md">
                 <h2 className="text-3xl font-black uppercase tracking-tighter">
                    Goaltending <span className="text-[#D52B1E]">Academy</span>
                 </h2>
                 <p className="text-neutral-400 leading-relaxed font-light border-l-2 border-[#0039A6] pl-4">
                    Forging elite goaltenders through the fusion of Soviet discipline and Canadian intensity.
                 </p>
            </div>
          </div>

          {/* --- COL 2: NAVIGATION (Russian Hover Effect) --- */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[#0039A6] mb-8 flex items-center gap-2">
               <span className="w-2 h-2 bg-[#0039A6] rounded-full"></span> Explore
            </h3>
            <ul className="space-y-4">
              {links.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="group flex items-center gap-3 text-xl md:text-2xl font-medium tracking-tight text-neutral-300 hover:text-white transition-all duration-300"
                  >
                    <span className="text-xs opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 text-[#D52B1E]">
                        <ArrowUpRight size={16} />
                    </span>
                    <span className="bg-gradient-to-r from-white via-white to-white bg-[length:0%_2px] bg-no-repeat bg-left-bottom group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out group-hover:from-white group-hover:via-[#0039A6] group-hover:to-[#D52B1E]">
                        {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* --- COL 3: CONTACTS --- */}
          <div className="lg:col-span-4 flex flex-col lg:items-end text-left lg:text-right">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[#D52B1E] mb-8 flex items-center gap-2 lg:flex-row-reverse">
               <span className="w-2 h-2 bg-[#D52B1E] rounded-full"></span> Contact
            </h3>
            
            <div className="space-y-2 mb-8">
              <p className="text-2xl font-black text-white uppercase">Nariman Volkov</p>
              <p className="text-neutral-500 font-mono text-sm tracking-widest uppercase">Founder & Head Coach</p>
            </div>

            <div className="space-y-6 flex flex-col lg:items-end">
              <a href="tel:4388559083" className="group flex items-center gap-3 text-lg text-neutral-300 hover:text-white transition-colors lg:flex-row-reverse">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#0039A6] group-hover:text-[#0039A6] transition-colors">
                    <Phone size={18} />
                </div>
                <span className="font-mono">438-855-9083</span>
              </a>

              <a href="mailto:narimanvolkov@gmail.com" className="group flex items-center gap-3 text-lg text-neutral-300 hover:text-white transition-colors lg:flex-row-reverse">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#D52B1E] group-hover:text-[#D52B1E] transition-colors">
                    <Mail size={18} />
                </div>
                <span className="border-b border-transparent group-hover:border-white transition-all">rgagoaltending@gmail.com</span>
              </a>

              <div className="flex items-center gap-3 lg:flex-row-reverse mt-4">
                  <div className="group flex items-center gap-2 text-sm text-neutral-500 cursor-pointer hover:text-[#0039A6] transition-colors">
                      <MapPin size={14} /> <span>Toronto , ON</span>
                  </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs text-neutral-600 uppercase tracking-widest font-bold">
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center text-center md:text-left">
            <p className="flex items-center gap-2">
                © {new Date().getFullYear()} RGA
                <span className="inline-block w-1.5 h-1.5 bg-[#D52B1E] rounded-full"></span>
            </p>
            <p>Made for Elite Goaltenders</p>
          </div>

          <div className="flex gap-8 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="hover:text-white transition-colors cursor-pointer">Terms & Conditions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}