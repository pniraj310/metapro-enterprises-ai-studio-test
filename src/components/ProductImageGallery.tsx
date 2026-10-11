import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  Sparkles, 
  Maximize2, 
  X, 
  Eye, 
  Check, 
  Share2 
} from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  badge?: string;
  category?: string;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images: initialImages,
  productName,
  badge,
  category,
}) => {
  // Ensure we always have at least 1 image and filter out empty strings
  const validImages = initialImages && initialImages.length > 0 
    ? initialImages.filter(img => Boolean(img && img.trim()))
    : ['https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=1200&q=80'];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [zoomCoords, setZoomCoords] = useState<{ x: number; y: number } | null>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  // Reset index when image list changes
  useEffect(() => {
    setActiveIndex(0);
  }, [initialImages]);

  // Keyboard navigation for image cycling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'Escape' && isZoomOpen) {
        setIsZoomOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, validImages.length, isZoomOpen]);

  const goToPrevious = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const goToNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomCoords({ x, y });
  };

  const handleMouseLeave = () => {
    setZoomCoords(null);
  };

  return (
    <div className="w-full flex flex-col-reverse sm:flex-row gap-4 select-none">
      
      {/* 1. THUMBNAIL STRIP (Vertical on Tablet/Desktop, Horizontal scroll on Mobile) */}
      <div 
        ref={thumbnailContainerRef}
        className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto sm:max-h-[560px] pb-2 sm:pb-0 scroll-smooth shrink-0"
        style={{ scrollbarWidth: 'thin' }}
      >
        {validImages.map((imgUrl, idx) => {
          const isActive = activeIndex === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              onMouseEnter={() => setActiveIndex(idx)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 p-1 bg-white cursor-pointer transition-all duration-200 shrink-0 overflow-hidden group ${
                isActive
                  ? 'border-[#DF9E26] shadow-md ring-2 ring-[#DF9E26]/40 scale-[1.02]'
                  : 'border-slate-200 hover:border-slate-400 hover:shadow-xs opacity-80 hover:opacity-100'
              }`}
              aria-label={`Select product image view ${idx + 1}`}
              aria-current={isActive ? 'true' : 'false'}
            >
              <img
                src={imgUrl}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => {
                  // Fallback if image fails
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=400&q=80';
                }}
              />
              {isActive && (
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#DF9E26]" />
              )}
            </button>
          );
        })}
      </div>

      {/* 2. MAIN STAGE HERO VIEWER */}
      <div 
        className="flex-1 relative aspect-square sm:aspect-auto sm:h-[560px] bg-[#fafafa] rounded-2xl border border-slate-200 p-6 sm:p-8 flex items-center justify-center overflow-hidden group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          handleMouseLeave();
        }}
        onMouseMove={handleMouseMove}
      >
        {/* Main Product Image */}
        <div 
          className="w-full h-full flex items-center justify-center cursor-zoom-in"
          onClick={() => setIsZoomOpen(true)}
        >
          <img
            src={validImages[activeIndex]}
            alt={`${productName} - View ${activeIndex + 1}`}
            className="max-w-full max-h-full object-contain transition-transform duration-200 group-hover:scale-[1.03]"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=1200&q=80';
            }}
          />
        </div>

        {/* Floating Top Badge (e.g. Best Seller / Amazon's Choice) */}
        {badge && (
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center gap-1.5 bg-[#0B1528] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm border border-[#DF9E26]/40">
              <Sparkles className="w-3.5 h-3.5 text-[#DF9E26]" />
              <span>{badge}</span>
            </span>
          </div>
        )}

        {/* Counter Badge: Shows current view / total views */}
        <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1.5">
          <Eye className="w-3 h-3 text-[#DF9E26]" />
          <span>{activeIndex + 1} / {validImages.length} Images</span>
        </div>

        {/* Left Arrow: Cycle to previous image */}
        {validImages.length > 1 && (
          <button
            type="button"
            onClick={goToPrevious}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer opacity-90 group-hover:opacity-100"
            aria-label="Previous product image"
          >
            <ChevronLeft className="w-5 h-5 text-slate-800" />
          </button>
        )}

        {/* Right Arrow: Cycle to next image */}
        {validImages.length > 1 && (
          <button
            type="button"
            onClick={goToNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer opacity-90 group-hover:opacity-100"
            aria-label="Next product image"
          >
            <ChevronRight className="w-5 h-5 text-slate-800" />
          </button>
        )}

        {/* Bottom Expand / Fullscreen Button */}
        <button
          type="button"
          onClick={() => setIsZoomOpen(true)}
          className="absolute bottom-4 right-4 z-10 bg-white/95 hover:bg-white text-slate-800 border border-slate-300 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:border-[#DF9E26] hover:text-[#0B1528] cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5 text-[#DF9E26]" />
          <span>Click to Zoom</span>
        </button>

        {/* Mobile Dot Navigation Indicators */}
        {validImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 sm:hidden flex items-center gap-1.5 z-10 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-200">
            {validImages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeIndex === i ? 'bg-[#DF9E26] w-4' : 'bg-slate-300'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}

      </div>

      {/* 3. FULLSCREEN INTERACTIVE ZOOM MODAL */}
      {isZoomOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsZoomOpen(false)}
        >
          <div 
            className="relative w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="space-y-0.5 max-w-xl">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#DF9E26]">
                  {category || 'Product Gallery'}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#0B1528] truncate">
                  {productName}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                  Image {activeIndex + 1} of {validImages.length}
                </span>
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(false)}
                  className="w-9 h-9 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close zoomed viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image Main Stage with Cycling Controls */}
            <div className="relative flex-1 bg-white p-6 flex items-center justify-center min-h-[380px] sm:min-h-[500px] overflow-hidden">
              <img
                src={validImages[activeIndex]}
                alt={`${productName} high resolution view ${activeIndex + 1}`}
                className="max-h-[60vh] max-w-full object-contain rounded-lg"
              />

              {/* Prev / Next Buttons in Modal */}
              {validImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white shadow-lg flex items-center justify-center transition-all cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    type="button"
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white shadow-lg flex items-center justify-center transition-all cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Modal Thumbnail Strip Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-center gap-2.5 overflow-x-auto">
              {validImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`w-14 h-14 rounded-lg border-2 p-1 bg-white cursor-pointer transition-all shrink-0 ${
                    activeIndex === i 
                      ? 'border-[#DF9E26] shadow-sm ring-2 ring-[#DF9E26]/50' 
                      : 'border-slate-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-contain rounded"
                  />
                </button>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
