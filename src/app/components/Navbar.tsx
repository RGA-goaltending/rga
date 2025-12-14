'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Phone, Mail, ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // --- Refs with TypeScript Types ---
  const navRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileLinksRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // --- 1. Scroll & Initial Entrance Effects ---
  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);

      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    if (wrapperRef.current) {
      gsap.fromTo(wrapperRef.current, 
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.2 }
      );
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);


  // --- 2. Mobile Menu Animation Handling ---
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    if (!tl.current && mobileMenuRef.current && mobileLinksRef.current) {
      tl.current = gsap.timeline({ paused: true });
      
      tl.current
      .to(mobileMenuRef.current, {
        duration: 0.5,
        autoAlpha: 1,
        ease: "power3.inOut"
      })
      .from(mobileLinksRef.current.children, {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.4,
        ease: "power2.out"
      }, "-=0.3");
    }

    if (tl.current) {
      if (isMobileMenuOpen) {
        tl.current.play();
      } else {
        tl.current.reverse();
      }
    }

  }, [isMobileMenuOpen]);


  const closeMobileMenu = () => setIsMobileMenuOpen(false);


  return (
    <>
      {/* --- MAIN NAVBAR WRAPPER --- */}
      <div ref={wrapperRef} className="fixed top-0 left-0 right-0 z-[100] flex flex-col items-center pt-4 md:pt-6 px-4 pointer-events-none">
        
        {/* --- TOP CONTACT TICKER --- */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isScrolled || isMobileMenuOpen ? 'h-0 opacity-0 mb-0' : 'h-6 opacity-100 mb-4'}`}>
          <div className="flex gap-6 text-[10px] uppercase tracking-widest font-bold text-slate-400 pointer-events-auto justify-center md:justify-start">
            <a href="tel:+14388559083" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone size={10} className="text-red-500" /> <span className="hidden sm:inline">+1 (438) 855-90-83</span>
            </a>
            <span className="text-slate-700">|</span>
            <a href="mailto:goalieschool1@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail size={10} className="text-red-500" /> <span className="hidden sm:inline">goalieschool1@gmail.com</span>
            </a>
          </div>
        </div>

        {/* --- THE FLOATING DYNAMIC ISLAND --- */}
        <nav 
          ref={navRef}
          className={`pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] relative z-[101]
            ${isScrolled 
              ? 'w-full md:w-auto px-2 py-2 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]' 
              : 'w-full max-w-7xl px-0 bg-transparent border-transparent'
            }
          `}
        >
          {/* Ensure this container does NOT have overflow-hidden so the logo can pop out */}
          <div className={`flex items-center justify-between relative transition-all duration-500 ${isScrolled ? 'gap-4 md:gap-8' : 'w-full'}`}>
            
            {/* --- LOGO SECTION (UPDATED FOR OVERFLOW) --- */}
            <Link 
              href="/" 
              // Removed gap-3, added explicit flex centering behavior
              className={`group relative flex items-center h-full px-2 md:px-4 transition-all duration-500 ${isScrolled ? 'scale-90' : 'scale-100'}`} 
              onClick={closeMobileMenu}
            >
              {/* Logo Image Container - MODIFIED 
                  1. Changed to 'absolute'.
                  2. Increased size significantly (h-16/w-16 up to h-24/w-24).
                  3. Positioned using top/left/translate to center it and let it hang out.
                  4. Added z-20 to sit above navbar borders.
              */}
              <div className="absolute top-1/2 -translate-y-1/2 -left-2 md:-left-4 h-24 w-24 md:h-24 md:w-24 flex-shrink-0 z-20">
                 <Image 
                   src="/img/logo.png" 
                   alt="Goalie School Logo"
                   fill
                   // Added drop-shadow for better separation when overflowing
                   className="object-contain drop-shadow-xl"
                   priority
                 />
              </div>

              {/* Site Name Text - MODIFIED
                  1. Added large ml (margin-left) because the image is now absolute 
                     and doesn't take up space in the flex flow. We need to push the text over.
              */}
              <div className="relative hidden sm:block ml-14 md:ml-20">
                <div className="text-xl font-black italic tracking-tighter text-white uppercase leading-none">
                  Goalie<span className="text-red-600">School</span>
                </div>
                <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full"></div>
              </div>
            </Link>

            {/* --- DESKTOP LINKS (Center) --- */}
            <div className="hidden md:flex items-center bg-slate-950/50 rounded-full border border-white/5 p-1 backdrop-blur-md relative z-10">
              <NavLink href="/about" text="The Story" />
              <NavLink href="/#price" text="Training" />
              <NavLink href="/#reviews" text="Reviews" />
              <NavLink href="/gallery" text="Gallery" />
            </div>

            {/* --- RIGHT SIDE ACTIONS --- */}
            <div className="flex items-center gap-2 relative z-10">
                
                {/* BOOK BUTTON */}
                <Link 
                href="/book" 
                className={`
                    relative group overflow-hidden bg-white text-black font-bold uppercase text-xs tracking-widest flex items-center gap-2 transition-all duration-500
                    ${isScrolled ? 'px-4 md:px-5 py-2.5 rounded-full' : 'px-6 md:px-8 py-3 rounded-none skew-x-[-10deg]'}
                `}
                onClick={closeMobileMenu}
                >
                <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className={`relative z-10 flex items-center gap-2 ${isScrolled ? '' : 'skew-x-[10deg]'}`}>
                    <span className="hidden sm:inline">Book Now</span> <span className="sm:hidden">Book</span> <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
                </Link>

                {/* --- MOBILE HAMBURGER TOGGLE --- */}
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className={`md:hidden relative z-[102] p-2 group ${isScrolled ? 'mr-1' : ''}`}
                    aria-label="Toggle Menu"
                >
                    <div className="flex flex-col justify-between w-[24px] h-[16px] transform transition-all duration-300 origin-center overflow-hidden">
                        <span className={`bg-white h-[2px] w-full transform transition-all duration-300 origin-left ${isMobileMenuOpen ? 'rotate-[42deg] translate-x-px' : ''}`}></span>
                        <span className={`bg-white h-[2px] w-3/4 ml-auto transform transition-all duration-300 ${isMobileMenuOpen ? '-translate-x-10 opacity-0' : ''} group-hover:w-full`}></span>
                        <span className={`bg-white h-[2px] w-full transform transition-all duration-300 origin-left ${isMobileMenuOpen ? '-rotate-[42deg] translate-x-px' : ''}`}></span>
                    </div>
                </button>

            </div>
          </div>
        </nav>
      </div>

        {/* --- MOBILE MENU OVERLAY --- */}
        <div 
            ref={mobileMenuRef}
            className="fixed inset-0 z-[90] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center invisible opacity-0 md:hidden"
            aria-hidden={!isMobileMenuOpen}
        >
            <div ref={mobileLinksRef} className="flex flex-col items-center gap-8 text-center">
                <MobileLink href="/#about" text="The Story" onClick={closeMobileMenu} />
                <MobileLink href="/#price" text="Training" onClick={closeMobileMenu} />
                <MobileLink href="/#reviews" text="Reviews" onClick={closeMobileMenu} />
                <MobileLink href="/gallery" text="Gallery" onClick={closeMobileMenu} />
                
                <div className="pt-8 mt-8 border-t border-white/10 flex flex-col gap-4">
                    <a href="tel:+14388559083" className="text-slate-400 uppercase tracking-widest text-xs flex items-center gap-2">
                        <Phone size={14} className="text-red-500"/> +1 (438) 855-90-83
                    </a>
                </div>
            </div>
        </div>
    </>
  );
}

// --- Helpers (Unchanged) ---
function NavLink({ href, text }: { href: string, text: string }) {
  return (
    <Link href={href} className="relative px-5 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors group">
      <span className="relative z-10">{text}</span>
      <span className="absolute inset-0 bg-white/10 rounded-full scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ease-out"></span>
    </Link>
  );
}

function MobileLink({ href, text, onClick }: { href: string, text: string, onClick: () => void }) {
    return (
      <Link href={href} onClick={onClick} className="relative text-3xl font-black uppercase tracking-tighter text-white hover:text-red-500 transition-colors">
        {text}
      </Link>
    );
}