import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Layers, 
  Tag, 
  Clock, 
  Flame, 
  CheckCircle2,
  Percent
} from 'lucide-react';

export interface PromoBanner {
  id: string;
  promoTag: string;
  promoIcon: React.ReactNode;
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  description: string;
  discountBadge?: string;
  highlights: string[];
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  isWhatsAppSecondary?: boolean;
  bgImage: string;
  themeColor: string;
  accentBg: string;
}

interface HomeSliderProps {
  whatsAppNumber?: string;
}

export const HomeSlider: React.FC<HomeSliderProps> = ({ 
  whatsAppNumber = '919876543210' 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 = next, -1 = prev
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const SLIDE_DURATION = 6000; // 6 seconds per slide

  const banners: PromoBanner[] = [
    {
      id: 'fasteners-promo',
      promoTag: 'MEGA CONTRACTOR SALE',
      promoIcon: <Flame className="w-3.5 h-3.5 text-amber-950 fill-amber-950" />,
      badge: 'METAPRO DIRECT FACTORY SUPPLY',
      title: 'Precision Drywall Screws & ',
      titleHighlight: 'Twinfast Fasteners',
      subtitle: 'Engineered for Steel Studs, Gypsum & False Ceilings',
      description: 'Manufactured from C1022 case-hardened steel with anti-corrosion black phosphating. Guarantees zero head-snaps and flush countersinking every time.',
      discountBadge: 'FLAT 35% OFF ON 10,000+ LOTS',
      highlights: ['Twinfast High-Low Thread', 'Black Phosphated Finish', 'Box & Bag Packs Available'],
      primaryCtaText: 'Shop Fasteners Catalog',
      primaryCtaLink: '/products?category=Fasteners+%26+Screws',
      secondaryCtaText: 'Get Wholesale Quote',
      secondaryCtaLink: `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent('Hello MetaPro, I need bulk contractor wholesale rates for drywall screws.')}`,
      isWhatsAppSecondary: true,
      bgImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2000&q=80',
      themeColor: '#DF9E26',
      accentBg: 'from-[#DF9E26] to-[#f5b041]'
    },
    {
      id: 'anchors-promo',
      promoTag: 'HEAVY MECHANICAL FIXINGS',
      promoIcon: <ShieldCheck className="w-3.5 h-3.5 text-amber-950" />,
      badge: 'STRUCTURAL CONCRETE RATED',
      title: 'Heavy-Duty Yellow Zinc ',
      titleHighlight: 'Expansion Anchor Bolts',
      subtitle: 'Certified M8, M10 & M12 Tensile Anchors',
      description: 'Engineered for extreme tensile loads up to 650kg in solid concrete. Ideal for outdoor AC condenser frames, structural steel channels, and architectural railings.',
      discountBadge: 'CONTRACTOR BUNDLE SAVINGS',
      highlights: ['Up to 650kg Tensile Pullout', 'Yellow Zinc Electroplated', 'Solid C25 Concrete Ready'],
      primaryCtaText: 'Explore Anchor Bolts',
      primaryCtaLink: '/products?category=Anchor+Bolts',
      secondaryCtaText: 'Technical Specs Sheet',
      secondaryCtaLink: `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent('Hello MetaPro, please provide test certificate and pricing for M8/M10/M12 expansion anchors.')}`,
      isWhatsAppSecondary: true,
      bgImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=2000&q=80',
      themeColor: '#ffa41c',
      accentBg: 'from-[#ffa41c] to-[#ffb84d]'
    },
    {
      id: 'panels-promo',
      promoTag: 'NEW 2026 ARCHITECTURAL ARRIVALS',
      promoIcon: <Sparkles className="w-3.5 h-3.5 text-cyan-950 fill-cyan-950" />,
      badge: 'INTERIOR & EXTERIOR CLADDING',
      title: 'Charcoal Fluted & ',
      titleHighlight: 'UV PVC Marble Sheets',
      subtitle: 'Luxury Waterproof Wall Panels & Acoustic Louvers',
      description: '100% waterproof, zero-formaldehyde, and termite-proof decorative panels for luxury TV feature walls, modern corporate offices, and humid bathroom backdrops.',
      discountBadge: 'FACTORY DIRECT STOCK AVAILABLE',
      highlights: ['100% Moisture Proof', 'Zero Formaldehyde Emissions', 'Seamless Tongue & Groove'],
      primaryCtaText: 'Browse Wall Panels',
      primaryCtaLink: '/products?category=Wall+Panels',
      secondaryCtaText: 'Request Swatch Box',
      secondaryCtaLink: `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent('Hello MetaPro, I would like to request sample swatches for charcoal fluted louvers and PVC marble sheets.')}`,
      isWhatsAppSecondary: true,
      bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80',
      themeColor: '#38bdf8',
      accentBg: 'from-[#38bdf8] to-[#0284c7]'
    },
    {
      id: 'express-promo',
      promoTag: 'PAN-INDIA SITE LOGISTICS',
      promoIcon: <Truck className="w-3.5 h-3.5 text-emerald-950" />,
      badge: 'EXPRESS METRO DISPATCH',
      title: '24 to 48hr Direct ',
      titleHighlight: 'Site Delivery Service',
      subtitle: 'Over 2,000+ Pincodes Serviced Direct from Central Hub',
      description: 'Order today with Cash on Delivery (COD) or UPI. Every delivery comes with a 100% compliant B2B GST tax invoice for seamless input tax credit claiming.',
      discountBadge: 'FREE DELIVERY ON BULK SHIPMENTS',
      highlights: ['Same-Day Dispatch before 2 PM', 'Live Order Milestones', 'GST Input Credit Invoice'],
      primaryCtaText: 'Track Your Active Order',
      primaryCtaLink: '/track-order',
      secondaryCtaText: 'Explore Entire Catalog',
      secondaryCtaLink: '/products',
      isWhatsAppSecondary: false,
      bgImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80',
      themeColor: '#10b981',
      accentBg: 'from-[#10b981] to-[#059669]'
    }
  ];

  // Auto-play progress loop
  useEffect(() => {
    if (isPaused) return;

    const intervalStep = 50; // update every 50ms
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          paginate(1);
          return 0;
        }
        return prev + (intervalStep / SLIDE_DURATION) * 100;
      });
    }, intervalStep);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setProgress(0);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) return banners.length - 1;
      if (nextIndex >= banners.length) return 0;
      return nextIndex;
    });
  };

  const setSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setProgress(0);
    setCurrentIndex(index);
  };

  // Framer Motion slide variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 280, damping: 32 },
        opacity: { duration: 0.45 },
        scale: { duration: 0.45 },
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring' as const, stiffness: 280, damping: 32 },
        opacity: { duration: 0.35 },
      },
    }),
  };

  const currentBanner = banners[currentIndex];

  return (
    <div 
      className="relative bg-[#0B1528] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="MetaPro Featured Hero Slider"
    >
      {/* Sliding Viewport with generous vertical clearance */}
      <div className="relative w-full h-[470px] sm:h-[520px] lg:h-[560px] overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentBanner.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(11, 21, 40, 0.95) 0%, rgba(11, 21, 40, 0.85) 45%, rgba(11, 21, 40, 0.5) 85%, rgba(11, 21, 40, 0.75) 100%), linear-gradient(to bottom, rgba(11, 21, 40, 0.1) 0%, rgba(11, 21, 40, 0.6) 70%, rgba(234, 237, 237, 1) 100%), url('${currentBanner.bgImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Banner Inner Content - Positioned cleanly in upper-mid viewport */}
            <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-start pt-6 sm:pt-10 lg:pt-12 pb-20 text-white">
              <div className="max-w-3xl space-y-3">
                
                {/* Promo Strip & Badges */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="flex flex-wrap items-center gap-2"
                >
                  {/* High Impact Promotion Badge */}
                  <div 
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[#0B1528] text-xs font-black tracking-wider uppercase shadow-md"
                    style={{ backgroundColor: currentBanner.themeColor }}
                  >
                    {currentBanner.promoIcon}
                    <span>{currentBanner.promoTag}</span>
                  </div>

                  {currentBanner.discountBadge && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold">
                      <Percent className="w-3 h-3 text-rose-400" />
                      <span>{currentBanner.discountBadge}</span>
                    </span>
                  )}

                  <span className="hidden sm:inline text-xs text-slate-300 font-semibold">
                    • {currentBanner.badge}
                  </span>
                </motion.div>

                {/* Main Headline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.45 }}
                >
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white drop-shadow-md leading-tight">
                    {currentBanner.title}
                    <span 
                      className="block sm:inline"
                      style={{ color: currentBanner.themeColor }}
                    >
                      {currentBanner.titleHighlight}
                    </span>
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 mt-1">
                    {currentBanner.subtitle}
                  </p>
                </motion.div>

                {/* Description */}
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.45 }}
                  className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed drop-shadow-sm font-normal"
                >
                  {currentBanner.description}
                </motion.p>

                {/* Key Specification Highlights */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                  className="flex flex-wrap items-center gap-2 pt-0.5"
                >
                  {currentBanner.highlights.map((highlight, hIdx) => (
                    <div 
                      key={hIdx}
                      className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-200 bg-white/10 backdrop-blur-xs px-2.5 py-0.5 rounded-lg border border-white/15 shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </motion.div>

                {/* CTA Action Buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.45 }}
                  className="pt-2 flex flex-wrap items-center gap-3"
                >
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      to={currentBanner.primaryCtaLink}
                      className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] text-[#0f1111] font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all border border-[#fcd200] flex items-center gap-2 cursor-pointer"
                    >
                      <span>{currentBanner.primaryCtaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    {currentBanner.isWhatsAppSecondary ? (
                      <a
                        href={currentBanner.secondaryCtaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white/95 hover:bg-white text-slate-900 font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-600" />
                        <span>{currentBanner.secondaryCtaText}</span>
                      </a>
                    ) : (
                      <Link
                        to={currentBanner.secondaryCtaLink}
                        className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white/95 hover:bg-white text-slate-900 font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Package className="w-4 h-4 text-slate-700" />
                        <span>{currentBanner.secondaryCtaText}</span>
                      </Link>
                    )}
                  </motion.div>
                </motion.div>

              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrow: Previous */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => paginate(-1)}
        className="absolute left-2 sm:left-4 top-[38%] -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/45 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-xl"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </motion.button>

      {/* Navigation Arrow: Next */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => paginate(1)}
        className="absolute right-2 sm:right-4 top-[38%] -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/45 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-xl"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </motion.button>

      {/* Bottom Bar: Indicators & Timer Progress */}
      <div className="absolute bottom-5 sm:bottom-6 left-0 right-0 z-20 flex flex-col items-center gap-2 px-4 pointer-events-none">
        
        {/* Slide Selector Pills (Clickable) */}
        <div className="flex items-center justify-center gap-2 pointer-events-auto bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-md">
          {banners.map((b, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={b.id}
                onClick={() => setSlide(idx)}
                className="relative group p-1 cursor-pointer focus:outline-none"
                aria-label={`Jump to slide ${idx + 1}`}
              >
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'w-8 bg-[#DF9E26] shadow-xs' 
                      : 'w-2.5 bg-white/40 group-hover:bg-white/70'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Dynamic Progress Line */}
        <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-xs">
          <motion.div 
            className="h-full bg-[#DF9E26]"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>

      </div>

      {/* Bottom Right Promo Category Jump Bar (Desktop Only) */}
      <div className="hidden xl:flex absolute bottom-5 right-8 z-20 items-center gap-1.5 bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 text-xs text-white shadow-lg">
        {banners.map((b, idx) => (
          <button
            key={b.id}
            onClick={() => setSlide(idx)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              idx === currentIndex
                ? 'bg-[#DF9E26] text-[#0B1528] shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {b.id === 'fasteners-promo' ? '🔩 Fasteners' : b.id === 'anchors-promo' ? '🧱 Anchors' : b.id === 'panels-promo' ? '✨ Wall Panels' : '🚚 Site Delivery'}
          </button>
        ))}
      </div>

    </div>
  );
};
