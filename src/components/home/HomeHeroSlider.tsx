import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Sparkles,
  Zap,
  Package,
  Layers
} from 'lucide-react';

interface Slide {
  id: string;
  badge: string;
  badgeIcon: React.ReactNode;
  title: string;
  titleHighlight: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  isWhatsAppSecondary?: boolean;
  bgImage: string;
  accentColor: string;
  keyPills: string[];
}

interface HomeHeroSliderProps {
  whatsAppNumber: string;
}

export const HomeHeroSlider: React.FC<HomeHeroSliderProps> = ({ whatsAppNumber }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  const slides: Slide[] = [
    {
      id: 'fasteners',
      badge: 'METAPRO ENTERPRISES OFFICIAL STORE',
      badgeIcon: <Sparkles className="w-3.5 h-3.5 text-[#0B1528] fill-[#0B1528]" />,
      title: 'Build Better. ',
      titleHighlight: 'Finish Better.',
      description: 'Direct manufacturer and wholesale supplier of precision twinfast drywall screws, self-drilling fasteners, and C1022 case-hardened steel hardware.',
      primaryCtaText: 'Shop All Fasteners',
      primaryCtaLink: '/products?category=Fasteners+%26+Screws',
      secondaryCtaText: 'Wholesale WhatsApp Quote',
      secondaryCtaLink: `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent('Hello MetaPro Enterprises, I would like to inquire about bulk wholesale contractor pricing for drywall screws.')}`,
      isWhatsAppSecondary: true,
      bgImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2000&q=80',
      accentColor: '#DF9E26',
      keyPills: ['Twinfast Thread', 'Black Phosphated', 'From ₹349 / 1,000 Pcs']
    },
    {
      id: 'anchors',
      badge: 'STRUCTURAL MECHANICAL FASTENERS',
      badgeIcon: <ShieldCheck className="w-3.5 h-3.5 text-[#0B1528]" />,
      title: 'Heavy-Duty Expansion ',
      titleHighlight: 'Anchor Bolts.',
      description: 'Yellow zinc electroplated M8, M10, and M12 mechanical anchors engineered for solid concrete, AC condenser framing, and heavy masonry load holding.',
      primaryCtaText: 'Explore Anchor Bolts',
      primaryCtaLink: '/products?category=Anchor+Bolts',
      secondaryCtaText: 'Wholesale Price List',
      secondaryCtaLink: `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent('Hello MetaPro, please provide contractor pricing for M8/M10/M12 yellow zinc expansion anchors.')}`,
      isWhatsAppSecondary: true,
      bgImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=2000&q=80',
      accentColor: '#ffa41c',
      keyPills: ['Up to 650kg Pullout', 'Yellow Zinc Plated', 'C25 Concrete Rated']
    },
    {
      id: 'panels',
      badge: 'ARCHITECTURAL WALL SYSTEMS',
      badgeIcon: <Layers className="w-3.5 h-3.5 text-[#0B1528]" />,
      title: 'Charcoal Fluted & ',
      titleHighlight: 'PVC Marble Panels.',
      description: '100% waterproof, zero-formaldehyde interior fluted louvers and UV-coated marble sheets for luxury TV backdrops, bathrooms, and acoustic wall accents.',
      primaryCtaText: 'Browse Wall Panels',
      primaryCtaLink: '/products?category=Wall+Panels',
      secondaryCtaText: 'Inquire Panel Catalog',
      secondaryCtaLink: `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent('Hello MetaPro, I want to see the catalog and sample finishes for charcoal fluted louvers and PVC marble sheets.')}`,
      isWhatsAppSecondary: true,
      bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80',
      accentColor: '#38bdf8',
      keyPills: ['100% Moisture Proof', 'Zero Formaldehyde', 'Acoustic 3D Louvers']
    },
    {
      id: 'logistics',
      badge: 'NATIONWIDE DIRECT SITE DISPATCH',
      badgeIcon: <Truck className="w-3.5 h-3.5 text-[#0B1528]" />,
      title: 'Express 24-48hr ',
      titleHighlight: 'Site Delivery.',
      description: 'Orders dispatch direct from our central logistics hub across 2,000+ Indian pincodes. Cash on Delivery (COD), UPI, and B2B GST tax invoices supported.',
      primaryCtaText: 'Track Your Order',
      primaryCtaLink: '/track-order',
      secondaryCtaText: 'View All Products',
      secondaryCtaLink: '/products',
      isWhatsAppSecondary: false,
      bgImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80',
      accentColor: '#10b981',
      keyPills: ['Same-Day Dispatch', 'Cash on Delivery', 'Full GST Input Credit']
    }
  ];

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartXRef.current = null;
  };

  const current = slides[currentSlide];

  return (
    <div 
      className="relative bg-[#0B1528] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Home page featured banners slider"
    >
      {/* Background Slides with crossfade */}
      <div className="relative w-full h-[380px] sm:h-[440px] lg:h-[490px]">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
              style={{
                backgroundImage: `linear-gradient(to right, rgba(11, 21, 40, 0.92) 0%, rgba(11, 21, 40, 0.72) 45%, rgba(11, 21, 40, 0.4) 100%), linear-gradient(to bottom, rgba(11, 21, 40, 0.1) 0%, rgba(11, 21, 40, 0.6) 65%, rgba(234, 237, 237, 1) 100%), url('${slide.bgImage}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Content Box */}
              <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center pt-2 pb-24 text-white">
                <div className="max-w-3xl space-y-3.5 animate-in fade-in slide-in-from-left-4 duration-500">
                  
                  {/* Category Pill & Badge */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div 
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-[#0B1528] text-xs font-black tracking-wider uppercase shadow-xs transition-colors"
                      style={{ backgroundColor: slide.accentColor }}
                    >
                      {slide.badgeIcon}
                      <span>{slide.badge}</span>
                    </div>

                    {/* Key feature pills */}
                    <div className="hidden sm:flex items-center gap-1.5">
                      {slide.keyPills.map((pill, pIdx) => (
                        <span 
                          key={pIdx}
                          className="text-[11px] font-semibold text-slate-300 bg-white/10 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/15"
                        >
                          {pill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Main Headline */}
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-md leading-tight">
                    {slide.title}
                    <span style={{ color: slide.accentColor }}>
                      {slide.titleHighlight}
                    </span>
                  </h1>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-slate-200 max-w-xl leading-relaxed drop-shadow-sm font-normal">
                    {slide.description}
                  </p>

                  {/* CTA Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <Link
                      to={slide.primaryCtaLink}
                      className="px-6 py-3 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] text-[#0f1111] font-bold text-sm tracking-wide shadow-md transition-all border border-[#fcd200] flex items-center gap-2 cursor-pointer active:scale-98"
                    >
                      <span>{slide.primaryCtaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    {slide.isWhatsAppSecondary ? (
                      <a
                        href={slide.secondaryCtaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-full bg-white/90 hover:bg-white text-slate-900 font-bold text-sm tracking-wide shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-600" />
                        <span>{slide.secondaryCtaText}</span>
                      </a>
                    ) : (
                      <Link
                        to={slide.secondaryCtaLink}
                        className="px-6 py-3 rounded-full bg-white/90 hover:bg-white text-slate-900 font-bold text-sm tracking-wide shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98"
                      >
                        <Package className="w-4 h-4 text-slate-700" />
                        <span>{slide.secondaryCtaText}</span>
                      </Link>
                    )}
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Left Navigation Arrow */}
      <button
        onClick={handlePrev}
        className="absolute left-2 sm:left-4 top-[40%] -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/75 text-white/90 hover:text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs active:scale-95 shadow-lg group"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      {/* Right Navigation Arrow */}
      <button
        onClick={handleNext}
        className="absolute right-2 sm:right-4 top-[40%] -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/75 text-white/90 hover:text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs active:scale-95 shadow-lg group"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Slide Indicator Tabs / Dots (Amazon Style, Easy Tap) */}
      <div className="absolute bottom-24 sm:bottom-28 left-0 right-0 z-20 flex items-center justify-center gap-2 px-4">
        {slides.map((s, idx) => {
          const isActive = idx === currentSlide;
          return (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer h-2.5 ${
                isActive 
                  ? 'w-8 bg-[#DF9E26] shadow-xs' 
                  : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
              title={`Go to slide: ${s.title.trim()}`}
              aria-label={`Slide ${idx + 1}`}
            />
          );
        })}
      </div>

      {/* Quick Category Jump Strip on the bottom right (Desktop Only) */}
      <div className="hidden xl:flex absolute bottom-24 right-8 z-20 items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-xs text-white">
        <span className="text-[11px] text-slate-300 font-bold uppercase tracking-wider pl-1">
          Featured:
        </span>
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlide(idx)}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              idx === currentSlide
                ? 'bg-[#DF9E26] text-[#0B1528] font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {s.id === 'fasteners' ? 'Fasteners' : s.id === 'anchors' ? 'Anchor Bolts' : s.id === 'panels' ? 'Wall Panels' : 'Express Delivery'}
          </button>
        ))}
      </div>

    </div>
  );
};
