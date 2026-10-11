import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { MATERIAL_IMAGES, resolveMaterialImage } from '../assets/materialImages';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Plus,
  Check,
  Pause,
  Play,
  ShieldCheck,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';

interface HighlightSlide {
  id: string;
  divisionTag: string;
  badge: string;
  title: string;
  subtitle: string;
  highlights: string[];
  categoryFilter: string;
  spotlightProductId: string;
  image: string;
  accentLabel: string;
}

const HIGHLIGHT_SLIDES: HighlightSlide[] = [
  {
    id: 'slide-panels',
    divisionTag: '01 / 06 · Architectural Wall Panels & Louvers',
    badge: 'Wall Panels & Louvers',
    title: 'Materials That Shape Better Interior Spaces.',
    subtitle:
      'Charcoal & walnut fluted wall panels, teak gold WPC louvers, and full-height 8×4 ft Italian Statuario UV marble sheets—moisture-resistant and crafted for clean interior execution.',
    highlights: [
      'Charcoal Fluted, WPC Louvers & 8×4 ft UV Marble',
      '100% Waterproof & Termite-Impervious Polymer Core',
      'Fast Dry-Wall Mounting with Concealed Clips',
    ],
    categoryFilter: 'Fluted Panels',
    spotlightProductId: 'mp-prod-003',
    image: MATERIAL_IMAGES.heroShowroom,
    accentLabel: 'Wall Panels & Louvers',
  },
  {
    id: 'slide-ceilings',
    divisionTag: '02 / 06 · Acoustic Ceiling Systems & T-Grids',
    badge: 'Interior Ceiling Systems',
    title: 'Micro-Perforated Acoustic Ceiling Tiles & Grids.',
    subtitle:
      'High-NRC mineral fiber and gypsum composite 2×2 ft ceiling modules engineered to reduce echo and deliver crisp monolithic overhead geometry in offices and commercial interiors.',
    highlights: [
      '0.70 NRC Acoustic Reverberation Control',
      '595 × 595 mm Tegular Recessed Edge Tiles',
      '88% Diffused Daylight Reflectance Finish',
    ],
    categoryFilter: 'Interior Ceiling Panels',
    spotlightProductId: 'mp-prod-006',
    image: MATERIAL_IMAGES.pvcMarbleCeiling,
    accentLabel: 'Ceiling Systems',
  },
  {
    id: 'slide-profiles',
    divisionTag: '03 / 06 · Architectural Metal Profiles & Trims',
    badge: 'Metal Profiles & Trims',
    title: 'Anodized Brushed Gold & Matte Black Aluminium Trims.',
    subtitle:
      'Extruded 6063-T5 aluminium T-profiles, L-edge guards, and U-channels that create clean shadow lines and seamless transitions across wall panels, marble sheets, and tile joints.',
    highlights: [
      'T-Divider, L-Corner Guard & U-Channel Profiles',
      'Brushed Champagne Gold, Rose Gold & Matte Black',
      'Full 8 ft (2440 mm) Architectural Extrusions',
    ],
    categoryFilter: 'Metal Profiles & Trims',
    spotlightProductId: 'mp-prod-009',
    image: MATERIAL_IMAGES.hardwareProfilesTrims,
    accentLabel: 'Metal Profiles & Trims',
  },
  {
    id: 'slide-fasteners',
    divisionTag: '04 / 06 · Industrial Fasteners & Screws',
    badge: 'Fasteners & Screws',
    title: 'Precision Drywall Screws & Self-Drilling Fasteners.',
    subtitle:
      'High-tensile black phosphated twinfast drywall screws and partition fasteners engineered for rapid, zero-slip fixing into GI channels, wood battens, and gypsum boards.',
    highlights: [
      'Black Phosphated Anti-Corrosive Finish',
      'Sharp Twinfast Dual-Lead Threads',
      'Bulk Contractor Boxes (1,000 Pcs / Pack)',
    ],
    categoryFilter: 'Fasteners & Screws',
    spotlightProductId: 'mp-prod-001',
    image: MATERIAL_IMAGES.fastenersAnchors,
    accentLabel: 'Fasteners & Screws',
  },
  {
    id: 'slide-anchors',
    divisionTag: '05 / 06 · Structural Anchors & Mounting Hardware',
    badge: 'Anchor Bolts & Hardware',
    title: 'Expansion Anchor Bolts, GI Channels & SS Clips.',
    subtitle:
      'Torque-controlled yellow-zinc M10 sleeve anchor bolts, galvanized steel ceiling channels, and concealed stainless steel interlocking clips for structural fixing.',
    highlights: [
      'Carbon Steel Class 5.8 Sleeve Expansion Bolts',
      'Yellow Zinc Dichromate Rust Passivation',
      'Grade 304 SS Concealed Panel Clips & GI Channels',
    ],
    categoryFilter: 'Anchor Bolts & Hardware',
    spotlightProductId: 'mp-prod-002',
    image: MATERIAL_IMAGES.fastenersAnchors,
    accentLabel: 'Anchors & Hardware',
  },
  {
    id: 'slide-adhesives-tools',
    divisionTag: '06 / 06 · Adhesives, Joint Tapes & Site Tools',
    badge: 'Adhesives & Tools',
    title: 'High-Grab Polymer Adhesives, Mesh Tapes & Layout Kits.',
    subtitle:
      'Instant-grab hybrid polymer panel adhesives, alkali-resistant fiberglass drywall joint mesh tapes, and precision snap-chalk layout reels for clean site execution.',
    highlights: [
      'Zero-Sag Instant-Grab MS Polymer Adhesive (300 ml)',
      '50m Self-Adhesive Fiberglass Crack-Stop Joint Mesh',
      'High-Contrast Blue Layout Chalk Line & Reel Kits',
    ],
    categoryFilter: 'Adhesives, Sealants & Tapes',
    spotlightProductId: 'mp-prod-010',
    image: MATERIAL_IMAGES.adhesivesSealantsTools,
    accentLabel: 'Adhesives & Tools',
  },
];

const CAROUSEL_FILTER_TABS = [
  { label: 'All Highlighted Products', value: 'ALL' },
  { label: 'Wall Panels & Ceilings', value: 'Panels & Ceilings' },
  { label: 'Metal Profiles & Trims', value: 'Metal Profiles & Trims' },
  { label: 'Fasteners & Screws', value: 'Fasteners & Screws' },
  { label: 'Anchors & Hardware', value: 'Anchor Bolts & Hardware' },
  { label: 'Adhesives & Tools', value: 'Adhesives & Tools' },
];

export const ProductHighlightSlider: React.FC = () => {
  const { products, whatsAppNumber } = useProducts();
  const { addToCart, cart } = useCart();

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [activeTrackFilter, setActiveTrackFilter] = useState<string>('ALL');

  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HIGHLIGHT_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const currentSlide = HIGHLIGHT_SLIDES[activeSlide];
  const spotlightProduct =
    products.find((p) => p.id === currentSlide.spotlightProductId) ||
    products.find((p) => p.category === currentSlide.categoryFilter) ||
    products[0];

  const directWhatsAppUrl = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(
    `Hello MetaPro Enterprises, I am interested in ${currentSlide.accentLabel} (${
      spotlightProduct?.name || ''
    }). Please share details and availability.`
  )}`;

  const handleQuickAdd = (productId: string, qty = 1) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    addToCart(prod, qty);
    setAddedId(productId);
    setTimeout(() => setAddedId(null), 1800);
  };

  const carouselProducts = products.filter((p) => {
    if (activeTrackFilter === 'ALL') return true;
    if (activeTrackFilter === 'Adhesives & Tools') {
      return (
        p.category === 'Adhesives, Sealants & Tapes' ||
        p.category.includes('Installation Tools')
      );
    }
    if (activeTrackFilter === 'Panels & Ceilings') {
      return p.category.includes('Panel') || p.category.includes('Ceiling');
    }
    return p.category === activeTrackFilter;
  });

  const scrollTrack = (direction: 'left' | 'right') => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({
      left: direction === 'left' ? -360 : 360,
      behavior: 'smooth',
    });
  };

  return (
    <section className="w-full bg-[#F6F4EE] text-stone-900 border-b border-stone-200/90 overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pt-8 sm:pb-16 space-y-8">
        {/* Main Bright Architectural Hero Slider Card */}
        <div
          className="relative rounded-2xl bg-white border border-stone-200/90 shadow-sm overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left 6 Columns: Clean Light Showroom Copy & Highlighted Product */}
            <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6 bg-white">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap text-xs text-stone-500">
                  <span className="font-mono font-medium text-amber-800">
                    {currentSlide.divisionTag}
                  </span>
                  <span>MetaPro Material Collection</span>
                </div>

                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-950 tracking-tight leading-[1.1]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {currentSlide.title}
                </h1>

                <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                  {currentSlide.subtitle}
                </p>

                <div className="grid grid-cols-1 gap-2 pt-1">
                  {currentSlide.highlights.map((point) => (
                    <div
                      key={point}
                      className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-700"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spotlight Product Card on Warm Stone Surface */}
              {spotlightProduct && (
                <div className="bg-[#FAF8F4] rounded-xl p-4 sm:p-5 border border-stone-200/90 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 text-[11px] text-stone-500">
                        <span className="text-amber-800 font-semibold">
                          Highlighted Material
                        </span>
                        {spotlightProduct.sku && (
                          <>
                            <span>·</span>
                            <span className="font-mono">
                              {spotlightProduct.sku}
                            </span>
                          </>
                        )}
                      </div>
                      <Link
                        to={`/product/${spotlightProduct.slug || spotlightProduct.id}`}
                        className="text-sm sm:text-base font-semibold text-stone-950 hover:text-amber-800 transition-colors truncate block"
                      >
                        {spotlightProduct.name}
                      </Link>
                      <div className="text-xs text-stone-600 tabular-nums">
                        <span className="text-base font-semibold text-stone-950">
                          ₹{spotlightProduct.price.toLocaleString('en-IN')}
                        </span>{' '}
                        <span className="text-stone-500">
                          / {spotlightProduct.unit || 'Unit'} (Indicative Price)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(spotlightProduct.id, 5)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          addedId === spotlightProduct.id
                            ? 'bg-emerald-700 text-white'
                            : 'bg-[#1C1917] hover:bg-stone-800 text-white'
                        }`}
                      >
                        {addedId === spotlightProduct.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added to List</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 text-amber-400" />
                            <span>Add to Enquiry</span>
                          </>
                        )}
                      </button>

                      <Link
                        to={`/product/${spotlightProduct.slug || spotlightProduct.id}`}
                        className="inline-flex items-center gap-1 px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white hover:border-stone-900 text-stone-800 text-xs font-medium transition-colors"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Primary Hero Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/materials"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#1C1917] hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold transition-colors"
                >
                  <span>Browse Material Catalogue ({products.length})</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </Link>

                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-stone-300 bg-white hover:border-stone-900 text-stone-800 text-xs sm:text-sm font-semibold transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                  <span>Enquire on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right 6 Columns: High-Resolution Material Photography */}
            <div className="lg:col-span-6 relative min-h-[300px] sm:min-h-[420px] bg-[#EFECE6] overflow-hidden flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-stone-200">
              <img
                src={currentSlide.image}
                alt={currentSlide.title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/65 via-stone-950/10 to-transparent" />

              {/* Top Overlay Category Link */}
              <div className="relative z-10 p-5 flex items-center justify-between">
                <span className="px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-md border border-stone-200 text-xs font-semibold text-stone-900 shadow-2xs">
                  {currentSlide.badge}
                </span>
                <Link
                  to={`/materials/${encodeURIComponent(currentSlide.categoryFilter)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-md border border-stone-200 text-xs font-medium text-stone-800 hover:text-amber-800 transition-colors shadow-2xs"
                >
                  <span>Open Category</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {/* Bottom Slide Selector Strip */}
              <div className="relative z-10 p-5">
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {HIGHLIGHT_SLIDES.map((s, idx) => {
                    const active = idx === activeSlide;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setActiveSlide(idx);
                          setIsPaused(true);
                        }}
                        className={`text-left p-2 rounded-lg backdrop-blur-md border transition-all cursor-pointer ${
                          active
                            ? 'bg-white text-stone-950 border-white font-semibold shadow-sm'
                            : 'bg-stone-900/65 text-stone-100 border-white/20 hover:bg-stone-900/80'
                        }`}
                      >
                        <div className="text-[10px] font-mono opacity-75">
                          0{idx + 1}
                        </div>
                        <div className="text-[11px] leading-tight line-clamp-1">
                          {s.accentLabel}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Sliding Product Strip on Bright Showroom Surface */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {CAROUSEL_FILTER_TABS.map((tab) => {
                const active = activeTrackFilter === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setActiveTrackFilter(tab.value)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#1C1917] text-white font-semibold'
                        : 'bg-white text-stone-600 hover:text-stone-950 border border-stone-200/90'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-stone-500 hidden sm:inline">
                Slide Materials:
              </span>
              <button
                type="button"
                onClick={() => scrollTrack('left')}
                className="p-2 rounded-lg bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 transition-colors cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollTrack('right')}
                className="p-2 rounded-lg bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 transition-colors cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={trackRef}
            className="flex gap-4 overflow-x-auto pb-3 pt-1 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'thin' }}
          >
            {carouselProducts.map((product) => {
              const img = resolveMaterialImage(product.image, product.category);
              const inList = cart.find((item) => item.product.id === product.id);
              const isJustAdded = addedId === product.id;

              return (
                <div
                  key={product.id}
                  className="min-w-[275px] sm:min-w-[305px] max-w-[305px] snap-start bg-white rounded-xl border border-stone-200/90 hover:border-stone-400 shadow-2xs transition-all flex flex-col overflow-hidden shrink-0 group"
                >
                  <Link
                    to={`/product/${product.slug || product.id}`}
                    className="aspect-16/10 w-full bg-[#F4F2ED] overflow-hidden relative block"
                  >
                    <img
                      src={img}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      loading="lazy"
                    />
                  </Link>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="text-[11px] text-stone-500">
                        {product.category} · {product.unit || 'Unit'}
                      </div>
                      <Link
                        to={`/product/${product.slug || product.id}`}
                        className="text-sm font-semibold text-stone-950 hover:text-amber-800 transition-colors line-clamp-2 block"
                      >
                        {product.name}
                      </Link>
                    </div>

                    <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-sm font-semibold text-stone-950 tabular-nums">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-stone-500 block">
                          per {product.unit || 'Unit'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleQuickAdd(product.id, 1)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          isJustAdded
                            ? 'bg-emerald-700 text-white'
                            : 'bg-stone-100 hover:bg-[#1C1917] text-stone-800 hover:text-white border border-stone-200'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>
                              {inList
                                ? `In List (${inList.quantity})`
                                : '+ Enquiry'}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
