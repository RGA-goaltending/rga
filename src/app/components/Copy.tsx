"use client";

import gsap from "gsap";
// NOTE: SplitText is a premium Club GSAP plugin. 
// If you don't have a license, this import will fail unless you use the trial package.
import { SplitText } from "gsap/SplitText"; 
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, ScrollTrigger);

interface SplitTextInstance {
  lines: Element[];
  revert: () => void;
}

interface CopyProps {
  children: React.ReactNode;
  animateOnScroll?: boolean;
  delay?: number;
  className?: string; // Added className prop for styling flexibility
}

export default function Copy({
  children,
  animateOnScroll = true,
  delay = 0,
  className = "",
}: CopyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // We don't need elementRef or linesRef for persistent storage usually, 
  // but we can keep them inside the effect if needed.
  
  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Select the target. Since we always wrap in a div now, 
      // the containerRef points to the wrapper.
      const target = containerRef.current;

      // Create SplitText instance
      // We assume the children render text. If they render complex HTML,
      // SplitText might need nested targeting.
      const split = new SplitText(target, {
        type: "lines",
        linesClass: "line overflow-hidden", // 'overflow-hidden' is useful for reveal effects
      }) as unknown as SplitTextInstance;

      // Initial state: hide lines (push them down)
      gsap.set(split.lines, { yPercent: 100, opacity: 0 });

      // Animation definition
      const animationProps = {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
        delay: delay,
      };

      if (animateOnScroll) {
        gsap.to(split.lines, {
          ...animationProps,
          scrollTrigger: {
            trigger: target,
            start: "top 85%", // Trigger when top of element hits 85% of viewport height
            toggleActions: "play none none reverse", // Optional: replay on scroll up
          },
        });
      } else {
        gsap.to(split.lines, animationProps);
      }

      // Cleanup function to revert text splitting on unmount
      return () => {
        split.revert();
      };
    },
    {
      scope: containerRef,
      dependencies: [animateOnScroll, delay],
    }
  );

  return (
    <div
      ref={containerRef}
      className={className} // Allows you to pass Tailwind classes like "text-4xl font-bold"
      data-copy-wrapper="true"
      style={{ overflow: "hidden" }} // Ensures the 'yPercent: 100' hides the text initially
    >
      {children}
    </div>
  );
}