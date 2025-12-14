'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, Instagram, Facebook, Linkedin, ArrowUpRight } from 'lucide-react';

export default function FounderCTA() {
  return (
    <section className="relative w-full bg-[#050505] text-white overflow-hidden py-16 border-t border-white/10">
      
      {/* ==================== STATIC BACKGROUND (No Blinking) ==================== */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay"></div>
          {/* Static Gradient Washes */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#0039A6] opacity-[0.06] blur-[100px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#D52B1E] opacity-[0.06] blur-[100px] rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        
        {/* COMPACT CARD LAYOUT */}
        <div className="flex flex-col md:flex-row items-center bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
            
            {/* ==================== LEFT: IMAGE & NAME ==================== */}
            <div className="relative w-full md:w-5/12 h-[400px] md:h-[450px] group overflow-hidden">
                {/* Background for Text Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-80"></div>
                
                {/* Image */}
                <Image 
                    src="/img/co1.jpg" 
                    alt="Nariman Volkov"
                    fill
                    className="object-cover object-top  transition-all duration-700 ease-out"
                />

                {/* Name Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                    <p className="text-[#D52B1E] font-bold uppercase tracking-widest text-xs mb-2">Head Coach</p>
                    <h2 className="text-5xl font-black uppercase tracking-tighter leading-none text-white">
                        Nariman <br/> Volkov
                    </h2>
                </div>
            </div>

            {/* ==================== RIGHT: INFO & CONTACTS ==================== */}
            <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-between h-full space-y-8">
                
                {/* Bio Snippet */}
                <div>
                    <h3 className="text-2xl font-medium text-white mb-4">Forging Elite Goaltenders.</h3>
                    <p className="text-gray-400 font-light leading-relaxed max-w-md">
                        Founder of GoalieSchool.ca. Bringing world-class Russian technique and discipline to the Canadian crease since 2014.
                    </p>
                </div>

                {/* Contact Rows */}
                <div className="space-y-4">
                    {/* Phone */}
                    <a href="tel:4388559083" className="flex items-center justify-between p-4 bg-[#111] border border-white/5 rounded-xl hover:border-[#D52B1E] hover:bg-[#161616] transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-white/5 rounded-lg text-gray-400 group-hover:text-white transition-colors">
                                <Phone size={20} />
                            </div>
                            <div>
                                <span className="block text-[10px] text-gray-500 uppercase tracking-widest font-bold">Direct Line</span>
                                <span className="block text-lg font-mono text-white">438-855-9083</span>
                            </div>
                        </div>
                        <ArrowUpRight className="text-[#D52B1E] opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                    </a>

                    {/* Email */}
                    <a href="mailto:narimanvolkov@gmail.com" className="flex items-center justify-between p-4 bg-[#111] border border-white/5 rounded-xl hover:border-[#0039A6] hover:bg-[#161616] transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-white/5 rounded-lg text-gray-400 group-hover:text-white transition-colors">
                                <Mail size={20} />
                            </div>
                            <div className="overflow-hidden">
                                <span className="block text-[10px] text-gray-500 uppercase tracking-widest font-bold">Email</span>
                                <span className="block text-lg font-mono text-white truncate">narimanvolkov@gmail.com</span>
                            </div>
                        </div>
                        <ArrowUpRight className="text-[#0039A6] opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                    </a>
                </div>

                {/* Socials */}
                <div className="pt-6 border-t border-white/10 flex items-center gap-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-600 mr-2">Socials</span>
                    <SocialIcon icon={<Instagram size={18} />} />
                    <SocialIcon icon={<Facebook size={18} />} />
                    <SocialIcon icon={<Linkedin size={18} />} />
                </div>

            </div>

        </div>
      </div>
    </section>
  );
}

// Compact Social Icon Helper
const SocialIcon = ({ icon }: { icon: React.ReactNode }) => (
    <Link href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all hover:scale-105">
        {icon}
    </Link>
);