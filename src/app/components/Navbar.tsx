'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Phone, Mail, ArrowUpRight, Shield, Megaphone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth(); // Get auth state
  const router = useRouter();
  
  // Check if user is Admin (Matches your Env Variable)
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileLinksRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // --- SCROLL & ANIMATION LOGIC ---
  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
      setIsScrolled(window.scrollY > 50);
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

  // --- MOBILE MENU ANIMATION ---
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';

    if (!tl.current && mobileMenuRef.current && mobileLinksRef.current) {
      tl.current = gsap.timeline({ paused: true });
      tl.current
      .to(mobileMenuRef.current, { duration: 0.5, autoAlpha: 1, ease: "power3.inOut" })
      .from(mobileLinksRef.current.children, { y: 20, opacity: 0, stagger: 0.1, duration: 0.4, ease: "power2.out" }, "-=0.3");
    }

    if (tl.current) {
      isMobileMenuOpen ? tl.current.play() : tl.current.reverse();
    }
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = async () => {
    try {
        await logout();
        closeMobileMenu();
        router.push('/');
    } catch (error) {
        console.error("Logout failed", error);
    }
  };

  return (
    <>
      <div ref={wrapperRef} className="fixed top-0 left-0 right-0 z-[100] flex flex-col items-center pt-4 md:pt-6 px-4 pointer-events-none">
        
        {/* TOP CONTACT BAR */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isScrolled || isMobileMenuOpen ? 'h-0 opacity-0 mb-0' : 'h-6 opacity-100 mb-4'}`}>
          <div className="flex gap-6 text-[10px] uppercase tracking-widest font-bold text-slate-400 pointer-events-auto justify-center md:justify-start">
            <a href="tel:+14388559083" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone size={10} className="text-red-500" /> <span className="hidden sm:inline">+1 (438) 855-90-83</span>
            </a>
            <span className="text-slate-700">|</span>
            <a href="mailto:rgagoaltending@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail size={10} className="text-red-500" /> <span className="hidden sm:inline">rgagoaltending@gmail.com</span>
            </a>
          </div>
        </div>

        {/* NAVBAR CONTAINER */}
        <nav 
          ref={navRef}
          className={`pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] relative z-[101]
            ${isScrolled 
              ? 'w-full md:w-auto px-2 py-2 rounded-full bg-black backdrop-blur-xl  ' 
              : 'w-full max-w-7xl px-0 bg-transparent border-transparent'
            }
          `}
        >
          <div className={`flex items-center justify-between relative transition-all duration-500 ${isScrolled ? 'gap-4 md:gap-8' : 'w-full'}`}>
            
            {/* LOGO */}
            <Link 
              href="/" 
              className={`group relative flex items-center h-full px-2 md:px-4 transition-all duration-500 ${isScrolled ? 'scale-90' : 'scale-100'}`} 
              onClick={closeMobileMenu}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -left-2 md:-left-4 h-24 w-24 md:h-24 md:w-24 flex-shrink-0 z-20">
                 <Image src="/img/logo.png" alt="Goalie School Logo" fill className="object-contain drop-shadow-xl" priority/>
              </div>

              <div className="relative hidden sm:block ml-14 md:ml-20">
                <div className="text-xl font-black italic tracking-tighter text-white uppercase leading-none">
                  Goaltending <span className="text-red-600">Academy</span>
                </div>
                <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full"></div>
              </div>
            </Link>

            {/* --- DESKTOP LINKS --- */}
            <div className="hidden md:flex items-center bg-slate-950/50 rounded-full border border-white/5 p-1 backdrop-blur-md relative z-10">
              <NavLink href="/about" text="The Story" />
              <NavLink href="/#price" text="Training" />
              <NavLink href="/camps" text="Camps" /> {/* NEW LINK */}
              <NavLink href="/gallery" text="Gallery" />
              
              {/* Conditional Auth Links */}
              {isAdmin && (
                 <Link href="/admin" className="relative px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#D52B1E] hover:text-white transition-colors group flex items-center gap-2">
                    <Shield size={12} /> <span className="relative z-10">Command Center</span>
                 </Link>
              )}
              
              {user && !isAdmin && (
                 <NavLink href="/my-bookings" text="My Bookings" />
              )}
            </div>

            {/* --- RIGHT SIDE ACTIONS --- */}
            <div className="flex items-center gap-2 relative z-10">
                
                {/* 1. Login/Logout Button (Desktop) */}
                <div className="hidden md:block">
                    {user ? (
                        <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Sign Out">
                           Sign Out
                        </button>
                    ) : (
                        <Link href="/login" className="p-2 text-slate-400 hover:text-white transition-colors" title="Sign In">
                            Sign In
                        </Link>
                    )}
                </div>

                {/* 2. Book Now CTA */}
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
                      <span className="hidden sm:inline">Book Session</span> <span className="sm:hidden">Book</span> <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </Link>

                {/* 3. Mobile Toggle */}
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
              <MobileLink href="/about" text="The Story" onClick={closeMobileMenu} />
              <MobileLink href="/#price" text="Training" onClick={closeMobileMenu} />
              <MobileLink href="/camps" text="Camps & Events" onClick={closeMobileMenu} /> {/* NEW LINK */}
              <MobileLink href="/gallery" text="Gallery" onClick={closeMobileMenu} />
              
              {/* Mobile Auth Links */}
              {user ? (
                 <>
                    {isAdmin && <MobileLink href="/admin" text="Command Center" onClick={closeMobileMenu} color="text-red-500" />}
                    {!isAdmin && <MobileLink href="/my-bookings" text="My Bookings" onClick={closeMobileMenu} />}
                    <button onClick={handleLogout} className="text-xl font-bold uppercase tracking-widest text-slate-500 hover:text-white mt-4 flex items-center gap-2">
                         Sign Out
                    </button>
                 </>
              ) : (
                 <MobileLink href="/login" text="Login" onClick={closeMobileMenu} />
              )}
              
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

// Helper Components
function NavLink({ href, text }: { href: string, text: string }) {
  return (
    <Link href={href} className="relative px-5 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors group">
      <span className="relative z-10">{text}</span>
      <span className="absolute inset-0 bg-white/10 rounded-full scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ease-out"></span>
    </Link>
  );
}

function MobileLink({ href, text, onClick, color = "text-white" }: { href: string, text: string, onClick: () => void, color?: string }) {
    return (
      <Link href={href} onClick={onClick} className={`relative text-3xl font-black uppercase tracking-tighter ${color} hover:text-red-500 transition-colors`}>
        {text}
      </Link>
    );
}