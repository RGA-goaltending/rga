"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./Gallery.css";

interface GalleryItem {
  name: string;
  image: string;
}

interface GalleryProps {
  items?: GalleryItem[];
}

const DEFAULT_ITEMS: GalleryItem[] = [
  { image: "/img/g1.webp", name: "Velvet" },
  { image: "/img/g2.jpg", name: "Glass Relay" },
  { image: "/img/g3.jpg", name: "Noir-17" },
  { image: "/img/g4.jpg", name: "Driftline" },
  { image: "/img/g5.jpg", name: "Pulse 9" },
  { image: "/img/g6.jpg", name: "Cold Meridian" },
  { image: "/img/g7.jpg", name: "Astra" },
  { image: "/img/g8.jpg", name: "Mono Circuit" },
  { image: "/img/g9.jpg", name: "Lumen-04" },
  { image: "/img/g10.jpg", name: "Shadow Bloom" },
  { image: "/img/b1.jpeg", name: "Shadow Bloom" },
  { image: "/img/b2.jpeg", name: "Shadow Bloom" },
  { image: "/img/b3.jpeg", name: "Shadow Bloom" },
  { image: "/img/b4.jpeg", name: "Shadow Bloom" },
  { image: "/img/b5.jpeg", name: "Shadow Bloom" },
  { image: "/img/b6.jpeg", name: "Shadow Bloom" },
  { image: "/img/b8.jpeg", name: "Shadow Bloom" },
  { image: "/img/b9.jpeg", name: "Shadow Bloom" },
  
];

export default function Gallery({ items = DEFAULT_ITEMS }: GalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const state = useRef({
    currentIndicatorRotation: 0,
    targetIndicatorRotation: 0,
    currentSpinnerRotation: 0,
    targetSpinnerRotation: 0,
    lastTime: 0,
    lastSegmentIndex: -1,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const container = containerRef.current;
    if (!container) return;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const createSVG = (type: string, attrs: Record<string, string | number> = {}) => {
      const el = document.createElementNS("http://www.w3.org/2000/svg", type);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, String(v)));
      return el;
    };

    let svg: SVGSVGElement | null = null;
    let animationFrameId: number;

    const buildInterface = () => {
      const existingSvg = container.querySelector(".gallery-svg-layer");
      if (existingSvg) existingSvg.remove();

      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;

      // --- RESPONSIVE CONFIGURATION ---
      // If mobile, we use width as base to make it big enough for thumbs.
      // If desktop, we keep it proportional but anchor to bottom.
      const baseSize = isMobile ? width : Math.min(width, height);
      
      // Much larger radius logic since it's only a half-circle at the bottom
      const outerRadius = isMobile ? baseSize * 0.45 : baseSize * 0.35; 
      const innerRadius = isMobile ? baseSize * 0.25 : baseSize * 0.20; 
      // --------------------------

      const centerX = width / 2;
      // Anchor to the bottom of the viewport
      const centerY = height; 

      svg = createSVG("svg", { class: "gallery-svg-layer" }) as SVGSVGElement;
      const defs = createSVG("defs");
      svg.appendChild(defs);

      const anglePerSegment = (2 * Math.PI) / items.length;

      items.forEach((item, i) => {
        // We start drawing from the bottom (-Math.PI/2 is top, so we adjust phases if needed)
        // Standard circle math is fine, we just rotate the whole group later.
        const startAngle = i * anglePerSegment - Math.PI / 2;
        const endAngle = (i + 1) * anglePerSegment - Math.PI / 2;
        const midAngle = (startAngle + endAngle) / 2;

        const clipId = `clip-${i}`;
        const clipPath = createSVG("clipPath", { id: clipId });
        
        const pathData = [
          `M ${centerX + outerRadius * Math.cos(startAngle)} ${centerY + outerRadius * Math.sin(startAngle)}`,
          `A ${outerRadius} ${outerRadius} 0 0 1 ${centerX + outerRadius * Math.cos(endAngle)} ${centerY + outerRadius * Math.sin(endAngle)}`,
          `L ${centerX + innerRadius * Math.cos(endAngle)} ${centerY + innerRadius * Math.sin(endAngle)}`,
          `A ${innerRadius} ${innerRadius} 0 0 0 ${centerX + innerRadius * Math.cos(startAngle)} ${centerY + innerRadius * Math.sin(startAngle)}`,
          "Z"
        ].join(" ");

        clipPath.appendChild(createSVG("path", { d: pathData }));
        defs.appendChild(clipPath);

        const g = createSVG("g", {
          "clip-path": `url(#${clipId})`,
          "data-segment": i,
        });

        const segmentRadius = (innerRadius + outerRadius) / 2;
        const segmentX = centerX + Math.cos(midAngle) * segmentRadius;
        const segmentY = centerY + Math.sin(midAngle) * segmentRadius;

        // Image calculations
        const arcLength = outerRadius * anglePerSegment;
        const imgWidth = Math.max(arcLength * 1.5, 100); // Ensure minimum size
        const imgHeight = Math.max((outerRadius - innerRadius) * 1.5, 100);
        const rotation = (midAngle * 180) / Math.PI + 90;

        const image = createSVG("image", {
          href: item.image,
          width: imgWidth,
          height: imgHeight,
          x: segmentX - imgWidth / 2,
          y: segmentY - imgHeight / 2,
          preserveAspectRatio: "xMidYMid slice",
          transform: `rotate(${rotation} ${segmentX} ${segmentY})`,
        });

        g.appendChild(image);
        svg!.appendChild(g);
      });

      // Indicator logic - Pointing UP from the bottom
      const indicatorLen = 30;
      const indicator = createSVG("line", {
        class: "gallery-indicator",
        id: "gallery-indicator-line",
        x1: centerX,
        y1: centerY - innerRadius + 10, // Start slightly inside inner circle
        x2: centerX,
        y2: centerY - outerRadius - 10, // Extend slightly beyond outer circle
      });
      svg.appendChild(indicator);

      container.appendChild(svg);
    };

    const updateContent = () => {
      if (!titleRef.current || !previewRef.current) return;

      const s = state.current;
      // Adjust rotation calculation because our visual "active" point is now at the top of the wheel (which is bottom of screen)
      const relativeRotation = (((s.currentIndicatorRotation - s.currentSpinnerRotation) % 360) + 360) % 360;
      
      // Calculate index based on 360 degrees
      const segmentIndex = Math.floor(relativeRotation / (360 / items.length)) % items.length;

      if (segmentIndex !== s.lastSegmentIndex && items[segmentIndex]) {
        s.lastSegmentIndex = segmentIndex;

        titleRef.current.textContent = items[segmentIndex].name;

        const img = document.createElement("img");
        img.src = items[segmentIndex].image;
        img.alt = items[segmentIndex].name;
        
        gsap.set(img, { opacity: 0 });
        previewRef.current.appendChild(img);
        gsap.to(img, { opacity: 1, duration: 0.5, ease: "power2.out" });

        const allImages = previewRef.current.querySelectorAll("img");
        if (allImages.length > 2) {
            // Keep fewer images in DOM for performance
            allImages[0].remove();
        }
      }
    };

    const animate = (time: number) => {
      const s = state.current;
      let deltaTime = (time - s.lastTime) / 1000;
      s.lastTime = time;
      deltaTime = Math.min(deltaTime, 0.1); 

      s.targetIndicatorRotation += 10 * deltaTime; // Slower auto-rotation
      s.targetSpinnerRotation -= 10 * 0.25 * deltaTime;

      s.currentIndicatorRotation = lerp(s.currentIndicatorRotation, s.targetIndicatorRotation, 0.1);
      s.currentSpinnerRotation = lerp(s.currentSpinnerRotation, s.targetSpinnerRotation, 0.1);

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight; // Animate relative to bottom

      const indicator = document.getElementById("gallery-indicator-line");
      if (indicator) {
        // Indicator rotates around the bottom center
        indicator.setAttribute(
          "transform",
          `rotate(${s.currentIndicatorRotation % 360} ${centerX} ${centerY})`
        );
      }

      if (svg) {
        const segments = svg.querySelectorAll("[data-segment]");
        segments.forEach((seg) => {
          seg.setAttribute(
            "transform",
            `rotate(${s.currentSpinnerRotation % 360} ${centerX} ${centerY})`
          );
        });
      }

      updateContent();
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * 0.1; // Increased sensitivity slightly
      state.current.targetIndicatorRotation += delta;
      state.current.targetSpinnerRotation -= delta;
    };

    // Touch support for mobile swiping
    let startY = 0;
    const handleTouchStart = (e: TouchEvent) => {
        startY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
        const currentY = e.touches[0].clientY;
        const delta = (startY - currentY) * 0.5;
        state.current.targetIndicatorRotation += delta;
        state.current.targetSpinnerRotation -= delta;
        startY = currentY;
    };

    state.current.lastTime = performance.now();
    buildInterface();
    animationFrameId = requestAnimationFrame(animate);

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("resize", buildInterface);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", buildInterface);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationFrameId);
      if (svg) svg.remove();
    };
  }, [items]);

  return (
    <div className="gallery-root">
      <section className="gallery-container" ref={containerRef}>
        <div className="gallery-preview-img" ref={previewRef}></div>
       
      </section>
    </div>
  );
}