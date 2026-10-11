import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from '../../components/SEOHelmet';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { usePincode } from '../../context/PincodeContext';
import { productService } from '../../services/productService';
import { ProductCard } from '../../components/ProductCard';
import { resolveMaterialImage } from '../../assets/materialImages';
import { Product } from '../../types/product';
import {
  ArrowLeft,
  MessageSquare,
  Plus,
  Minus,
  Check,
  ClipboardList,
  Share2,
  ChevronRight,
  ChevronLeft,
  ZoomIn,
  X,
  ShieldCheck,
  Truck,
  Tag,
  MapPin,
  FileText,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const { getProduct, products, whatsAppNumber, settings, isLoading } = useProducts();
  const { cart, addToCart, setIsCartDrawerOpen } = useCart();
  const { currentPincode, setPincode, pincodeInfo } = usePincode();

  const lookupKey = slug || id;
  const product = lookupKey ? getProduct(lookupKey) : undefined;

  const [selectedQuantity, setSelectedQuantity] = useState(5);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [pincodeInput, setPincodeInput] = useState(currentPincode || '440026');
  const [pincodeChecked, setPincodeChecked] = useState(true);

  const touchStartXRef = useRef<number | null>(null);

  // Reset gallery and quantity whenever navigating to a different product
  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedQuantity(5);
  }, [slug, id]);

  // Lightweight loading skeleton while initial products array is loading
  if (isLoading && !product) {
    return (
      <div className="w-full bg-[#F1F3F6] min-h-[70vh] py-6 px-3 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-[1440px] mx-auto space-y-6">
          <div className="h-6 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-4">
              <div className="aspect-square w-full bg-gray-100 rounded-lg animate-pulse" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-12 bg-gray-200 rounded animate-pulse" />
                <div className="h-12 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="lg:col-span-7 space-y-4">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-16 w-full bg-gray-100 rounded animate-pulse" />
              <div className="h-24 w-full bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#F1F3F6] font-sans">
        <Helmet
          title="Material Not Found"
          description="Browse interior wall panels, fluted louvers, and ceiling tiles from MetaPro Enterprises."
          noIndex={true}
        />
        <div className="bg-white p-8 rounded-xl border border-gray-200 max-w-md space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-[#FF9F00] flex items-center justify-center mx-auto">
            <ClipboardList className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Material Not Found</h1>
          <p className="text-xs text-gray-600">
            The material you requested could not be located in our active showroom catalogue.
          </p>
          <div className="pt-2">
            <Link
              to="/materials"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#FF9F00] hover:bg-[#F39000] text-gray-950 font-bold text-xs shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Materials Catalogue</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Gallery images of the selected product
  const rawProductImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];
  const images = Array.from(
    new Set(
      rawProductImages
        .filter(Boolean)
        .map((img) => resolveMaterialImage(img, product.category))
    )
  );

  const isAvailable = product.availability === 'Available';
  const existingItem = cart.find((item) => item.product.id === product.id);

  const singleItemWhatsAppUrl = productService.generateWhatsAppUrl(
    product,
    selectedQuantity,
    whatsAppNumber
  );

  // Specifications
  const enteredSpecs = (product.specifications || []).filter(
    (s) => s.label && s.value
  );

  // Applications
  const enteredApplications = (product.applications || []).filter(Boolean);

  // Highlights
  const productHighlights: { label: string; value: string }[] = [
    ...enteredSpecs.slice(0, 4),
    ...(enteredApplications.length > 0
      ? [
          {
            label: 'Suitable Spaces',
            value: enteredApplications.slice(0, 3).join(', '),
          },
        ]
      : []),
  ];

  // Related Materials
  const configuredRelated = (product.relatedProductIds || [])
    .map((rid) => products.find((p) => p.id === rid || p.slug === rid))
    .filter(Boolean) as Product[];

  const sameCategoryMaterials = products.filter(
    (p) => p.id !== product.id && p.category === product.category
  );
  const relatedCategoryFallback = products.filter(
    (p) =>
      p.id !== product.id &&
      p.category !== product.category &&
      ((product.category.includes('Panel') && p.category.includes('Panel')) ||
        (!product.category.includes('Panel') && !p.category.includes('Panel')))
  );
  const relatedMaterials = Array.from(
    new Set([...configuredRelated, ...sameCategoryMaterials, ...relatedCategoryFallback])
  ).slice(0, 4);

  const relatedIds = new Set(relatedMaterials.map((r) => r.id));

  // You May Also Like
  const youMayAlsoLike = products
    .filter((p) => p.id !== product.id && !relatedIds.has(p.id))
    .slice(0, 4);

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || images.length <= 1) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        handleNextImage();
      } else {
        handlePrevImage();
      }
    }
    touchStartXRef.current = null;
  };

  const handleAddToEnquiry = () => {
    addToCart(product, selectedQuantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2500);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincodeInput.trim()) {
      setPincode(pincodeInput.trim());
      setPincodeChecked(true);
    }
  };

  const indicativeMRP = Math.round(product.price * 1.25);
  const discountPercent = Math.round(((indicativeMRP - product.price) / indicativeMRP) * 100);

  const canonicalProductPath = `/product/${product.slug || product.id}`;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const seoTitle = `${product.name} — ${product.category}`;
  const seoDescription = `${product.name} (${product.category}) — Indicative Price ₹${product.price.toLocaleString('en-IN')}/${product.unit || 'Unit'}. ${product.description}`;

  const productStructuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      sku: product.sku || product.id,
      category: product.category,
      image: images.map((img) =>
        img.startsWith('http') ? img : `${origin}${img}`
      ),
      brand: {
        '@type': 'Brand',
        name: settings.businessName || 'MetaPro Enterprises',
      },
      offers: {
        '@type': 'Offer',
        url: `${origin}${canonicalProductPath}`,
        priceCurrency: 'INR',
        price: product.price,
        availability: isAvailable
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: settings.businessName || 'MetaPro Enterprises',
        },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${origin}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Materials',
          item: `${origin}/materials`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: product.category,
          item: `${origin}/materials/${encodeURIComponent(product.category)}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: product.name,
          item: `${origin}${canonicalProductPath}`,
        },
      ],
    },
  ];

  return (
    <div className="w-full bg-[#F1F3F6] text-gray-900 font-sans pb-16">
      <Helmet
        title={seoTitle}
        description={seoDescription}
        canonicalPath={canonicalProductPath}
        ogType="product"
        image={images[0]}
        keywords={[
          product.name,
          product.category,
          ...(product.sku ? [product.sku] : []),
          ...enteredApplications,
          'MetaPro Enterprises',
          'Interior Materials Nagpur',
        ]}
        structuredData={productStructuredData}
      />

      {/* 1. TOP BREADCRUMB: Home → Materials → Category → Product Name */}
      <div className="border-b border-gray-200 bg-white py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4 text-xs text-gray-500">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap">
            <Link to="/" className="hover:text-[#2874F0] text-gray-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <Link to="/materials" className="hover:text-[#2874F0] text-gray-600 transition-colors">
              Materials
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <Link
              to={`/materials/${encodeURIComponent(product.category)}`}
              className="hover:text-[#2874F0] text-gray-600 transition-colors"
            >
              {product.category}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="text-gray-900 font-semibold truncate max-w-[220px] sm:max-w-md">
              {product.name}
            </span>
          </nav>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-gray-600 hover:text-[#2874F0] cursor-pointer shrink-0 font-medium"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        {/* 2. MAIN PRODUCT SHOWCASE (Flipkart-Style White Container Card) */}
        <section className="bg-white rounded-xl border border-gray-200 p-4 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Gallery with Vertical Thumbnails (Flipkart Style) */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                {/* Vertical Thumbnail Rail (Desktop) / Horizontal (Mobile) */}
                {images.length > 1 && (
                  <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto max-h-[380px] shrink-0 pb-1 sm:pb-0 scrollbar-none">
                    {images.map((img, idx) => (
                      <button
                        key={`${img}-${idx}`}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        onMouseEnter={() => setActiveImageIndex(idx)}
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded border overflow-hidden shrink-0 transition-all cursor-pointer ${
                          activeImageIndex === idx
                            ? 'border-[#2874F0] ring-2 ring-[#2874F0]/30'
                            : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} thumbnail ${idx + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Main Large Product Image */}
                <div
                  className="relative aspect-4/3 sm:aspect-square w-full rounded-lg overflow-hidden bg-gray-50 border border-gray-200 select-none group"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <img
                    src={images[activeImageIndex] || images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    onClick={() => setIsLightboxOpen(true)}
                    className="w-full h-full object-cover cursor-zoom-in transition-all duration-300"
                  />

                  {/* Previous / Next Controls */}
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevImage}
                        aria-label="Previous image"
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-gray-200 text-gray-800 flex items-center justify-center shadow-xs transition-all cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextImage}
                        aria-label="Next image"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-gray-200 text-gray-800 flex items-center justify-center shadow-xs transition-all cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Badge & Zoom trigger */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/95 backdrop-blur-xs border border-blue-200 text-[#2874F0] text-[10px] font-bold shadow-2xs">
                      <ShieldCheck className="w-3 h-3 text-[#2874F0]" />
                      <span>MetaPro Assured</span>
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5">
                    <button
                      type="button"
                      onClick={() => setIsLightboxOpen(true)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/95 hover:bg-white border border-gray-200 text-gray-800 text-xs font-semibold shadow-xs cursor-pointer"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Zoom</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Flipkart-Style Action Buttons Directly Below Image (Sticky/Prominent) */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToEnquiry}
                  className={`py-3.5 px-4 rounded-md text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                    addedFeedback
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#FF9F00] hover:bg-[#F39000] text-gray-950 border border-[#F09600]'
                  }`}
                >
                  {addedFeedback ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add to Enquiry</span>
                    </>
                  )}
                </button>

                <a
                  href={singleItemWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-4 rounded-md bg-[#FB641B] hover:bg-[#E65612] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs text-center"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Enquire on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* RIGHT COLUMN: Amazon-Inspired Product Information Hierarchy */}
            <div className="lg:col-span-7 space-y-5">
              {/* Title & Brand */}
              <div className="space-y-1.5 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-semibold text-[#2874F0]">Brand: MetaPro Enterprises</span>
                  <span aria-hidden="true">·</span>
                  <Link
                    to={`/materials/${encodeURIComponent(product.category)}`}
                    className="hover:underline text-gray-600"
                  >
                    Category: {product.category}
                  </Link>
                  {product.sku && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-gray-500">SKU: {product.sku}</span>
                    </>
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-snug">
                  {product.name}
                </h1>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-1">
                  {product.description}
                </p>
              </div>

              {/* Price Block (Amazon/Flipkart format) */}
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Special Showroom Offer
                  </span>
                  <span className="text-xs text-gray-500">Indicative Trade Price</span>
                </div>

                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tabular-nums">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.unit && (
                    <span className="text-sm font-semibold text-gray-600">/ {product.unit}</span>
                  )}
                  <span className="text-sm text-gray-400 line-through tabular-nums">
                    ₹{indicativeMRP.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm font-bold text-[#388E3C]">
                    {discountPercent}% off
                  </span>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed">
                  *Prices may vary depending on bulk quantity, selected surface finish, and site delivery logistics. Contact MetaPro for official project quotations.
                </p>
              </div>

              {/* Flipkart-Style "Available Offers" Box */}
              <div className="border border-gray-200 rounded-lg p-3.5 space-y-2 text-xs">
                <div className="font-bold text-gray-800 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#2874F0]" />
                  <span>Available Showroom Offers & Trade Benefits</span>
                </div>
                <ul className="space-y-1.5 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-gray-800 shrink-0">• Contractor Bulk Rate:</span>
                    <span>Additional tiered discount available on commercial quantities over 250 units.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-gray-800 shrink-0">• Material Finish Swatch:</span>
                    <span>Request physical samples dispatched to your design studio or project site.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-gray-800 shrink-0">• GST Tax Invoicing:</span>
                    <span>Eligible for 18% Input Tax Credit on verified GST registration.</span>
                  </li>
                </ul>
              </div>

              {/* Delivery & Pincode Checker (Amazon/Flipkart Style) */}
              <div className="border border-gray-200 rounded-lg p-3.5 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-gray-800">
                    <MapPin className="w-3.5 h-3.5 text-[#2874F0]" />
                    <span>Delivery Location</span>
                  </div>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isAvailable ? 'In Stock · Ready to Dispatch' : 'Out of Stock'}</span>
                  </span>
                </div>

                <form onSubmit={handlePincodeCheck} className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincodeInput}
                    onChange={(e) => setPincodeInput(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Enter 6-digit Pincode"
                    className="w-36 px-2.5 py-1.5 rounded border border-gray-300 text-xs font-semibold focus:outline-none focus:border-[#2874F0]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs cursor-pointer border border-gray-300"
                  >
                    Check
                  </button>
                  {pincodeChecked && (
                    <span className="text-[11px] text-gray-600">
                      Standard Road Freight to <strong>{pincodeInput}</strong> (2–4 business days)
                    </span>
                  )}
                </form>
              </div>

              {/* Quantity Selector & Indicative Total */}
              <div className="space-y-2 border-b border-gray-100 pb-4">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="product-qty-select" className="font-bold text-gray-800">
                    Enquiry Quantity ({product.unit || 'Units'}):
                  </label>
                  <span className="text-gray-600 font-medium">
                    Indicative Subtotal:{' '}
                    <strong className="text-gray-900">
                      ₹{(product.price * selectedQuantity).toLocaleString('en-IN')}
                    </strong>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center border border-gray-300 rounded bg-gray-50 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setSelectedQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      id="product-qty-select"
                      type="number"
                      min="1"
                      value={selectedQuantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val) && val > 0) setSelectedQuantity(val);
                      }}
                      className="w-14 text-center py-1.5 text-xs font-bold text-gray-900 bg-white border-x border-gray-300 focus:outline-none tabular-nums"
                    />
                    <button
                      type="button"
                      onClick={() => setSelectedQuantity((q) => q + 1)}
                      className="px-3 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1 text-xs">
                    {[5, 10, 25, 50].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setSelectedQuantity(preset)}
                        className={`px-2.5 py-1.5 rounded border text-xs font-semibold cursor-pointer ${
                          selectedQuantity === preset
                            ? 'bg-[#2874F0] text-white border-[#2874F0]'
                            : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300'
                        }`}
                      >
                        ×{preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Highlights List */}
              {productHighlights.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Product Highlights
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {productHighlights.map((hl) => (
                      <div key={hl.label} className="p-2 rounded bg-gray-50 border border-gray-200">
                        <span className="text-gray-500 block text-[10px]">{hl.label}</span>
                        <span className="font-semibold text-gray-900">{hl.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 3. FLIPKART-STYLE SPECIFICATIONS TABLE */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-b border-gray-200 pb-3">
            Specifications & Material Details
          </h2>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="divide-y divide-gray-200 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-12 p-3 bg-gray-50 font-medium">
                <span className="sm:col-span-4 text-gray-500 font-semibold">Material Name</span>
                <span className="sm:col-span-8 text-gray-900 font-bold">{product.name}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-12 p-3 bg-white font-medium">
                <span className="sm:col-span-4 text-gray-500 font-semibold">Category</span>
                <span className="sm:col-span-8 text-gray-900">{product.category}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-12 p-3 bg-gray-50 font-medium">
                <span className="sm:col-span-4 text-gray-500 font-semibold">Standard Unit</span>
                <span className="sm:col-span-8 text-gray-900">{product.unit || 'sq ft'}</span>
              </div>
              {product.sku && (
                <div className="grid grid-cols-1 sm:grid-cols-12 p-3 bg-white font-medium">
                  <span className="sm:col-span-4 text-gray-500 font-semibold">SKU Identifier</span>
                  <span className="sm:col-span-8 text-gray-900 font-mono">{product.sku}</span>
                </div>
              )}
              {enteredSpecs.map((spec, i) => (
                <div
                  key={spec.label}
                  className={`grid grid-cols-1 sm:grid-cols-12 p-3 font-medium ${
                    i % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <span className="sm:col-span-4 text-gray-500 font-semibold">{spec.label}</span>
                  <span className="sm:col-span-8 text-gray-900">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. APPLICATIONS SECTION */}
        {enteredApplications.length > 0 && (
          <section className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-b border-gray-200 pb-3">
              Suitable Interior Applications
            </h2>
            <div className="flex flex-wrap gap-2">
              {enteredApplications.map((app) => (
                <span
                  key={app}
                  className="px-3 py-1.5 rounded-full bg-blue-50 text-[#2874F0] border border-blue-200 text-xs font-semibold"
                >
                  {app}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* 5. RELATED MATERIALS SHELF (Flipkart Style) */}
        {relatedMaterials.length > 0 && (
          <section className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Similar Materials in {product.category}
                </h2>
                <p className="text-xs text-gray-500">
                  Compare complementary finishes and profiles from the same material family
                </p>
              </div>
              <Link
                to={`/materials/${encodeURIComponent(product.category)}`}
                className="px-3.5 py-1.5 rounded-xs bg-[#2874F0] hover:bg-[#1f62cf] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
              >
                View Category
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedMaterials.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* 6. YOU MAY ALSO LIKE */}
        {youMayAlsoLike.length > 0 && (
          <section className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  You May Also Like
                </h2>
                <p className="text-xs text-gray-500">
                  Popular fixing hardware, wall cladding & architectural supplies
                </p>
              </div>
              <Link
                to="/materials"
                className="px-3.5 py-1.5 rounded-xs bg-[#2874F0] hover:bg-[#1f62cf] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {youMayAlsoLike.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-gray-900 shadow-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={images[activeImageIndex] || images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-auto max-h-[82vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};
