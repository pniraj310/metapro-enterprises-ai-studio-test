import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from '../../components/SEOHelmet';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { ProductCard } from '../../components/ProductCard';
import { resolveMaterialImage, MATERIAL_IMAGES } from '../../assets/materialImages';
import {
  ArrowRight,
  ShieldCheck,
  Plus,
  MessageSquare,
  Sparkles,
  Layers,
  Truck,
  FileCheck2,
  Clock,
  CheckCircle2,
  Award,
  ChevronRight,
} from 'lucide-react';

const SPACE_APPLICATIONS = [
  {
    title: 'Living Rooms & TV Feature Walls',
    materials: 'Fluted Louvers · UV Marble Cladding',
    description:
      'Creates tactile warmth, clean vertical rhythm, and hidden cable management behind entertainment centers.',
    image: MATERIAL_IMAGES.heroShowroom,
  },
  {
    title: 'Executive Offices & Commercial Lobbies',
    materials: 'WPC Louvers · Acoustic Tegular Ceiling Tiles',
    description:
      'Balances sound absorption with high-durability surface geometry across conference rooms and reception desks.',
    image: MATERIAL_IMAGES.spaceApplications,
  },
  {
    title: 'Boutique Retail & Salons',
    materials: '3D Relief Tiles · Champagne Gold Aluminium Trims',
    description:
      'Sculptural geometric shadow lines paired with brushed metallic edge transitions for distinctive feature walls.',
    image: MATERIAL_IMAGES.pvcMarbleCeiling,
  },
  {
    title: 'Waterproof & High-Humidity Bath Zones',
    materials: '100% Waterproof PVC Stone-Core Marble Sheets',
    description:
      'Impervious to water, humidity, and mold with rapid dry-wall mounting directly over plaster or existing tiles.',
    image: MATERIAL_IMAGES.flutedWpcPanels,
  },
];

export const Home: React.FC = () => {
  const { products, featuredProduct, categories, settings, whatsAppNumber } = useProducts();
  const { addToCart } = useCart();

  const activeCategories = categories.filter((c) => c.active !== false);

  // Spotlight / Featured Product
  const spotlight =
    featuredProduct ||
    products.find((p) => p.featured) ||
    products.find((p) => p.slug === 'wpc-fluted-panel-natural-oak') ||
    products[0];

  // Flipkart-style Shelves
  const wallPanels = products
    .filter((p) => p.category.includes('Panel') || p.category.includes('Fluted') || p.category.includes('PVC'))
    .slice(0, 4);

  const fastenersAndHardware = products
    .filter((p) => p.category.includes('Fastener') || p.category.includes('Screw') || p.category.includes('Anchor') || p.category.includes('Hardware'))
    .slice(0, 4);

  const ceilingAndDecorative = products
    .filter((p) => p.category.includes('Ceiling') || p.category.includes('Decorative'))
    .slice(0, 4);

  const directWhatsAppUrl = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(
    `Hello ${settings.businessName || 'MetaPro Enterprises'}, I would like to enquire about your interior materials catalogue.`
  )}`;

  const spotlightMRP = spotlight ? Math.round(spotlight.price * 1.25) : 0;
  const spotlightDiscount = spotlight ? Math.round(((spotlightMRP - spotlight.price) / spotlightMRP) * 100) : 0;

  return (
    <div className="w-full bg-[#F1F3F6] text-gray-900 min-h-screen font-sans pb-12">
      <Helmet
        title={`${settings.businessName || 'MetaPro Enterprises'} — Materials That Shape Better Spaces`}
        description={
          settings.heroSubheadline ||
          'Explore interior materials, architectural wall & ceiling panels, metal profiles, and precision fixing hardware from MetaPro Enterprises.'
        }
        canonicalPath="/"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'HomeAndConstructionBusiness',
          name: settings.businessName || 'MetaPro Enterprises',
          description: settings.aboutText,
          telephone: settings.businessPhone,
          email: settings.businessEmail,
          address: {
            '@type': 'PostalAddress',
            streetAddress: settings.businessAddress,
            addressLocality: 'Nagpur',
            addressRegion: 'Maharashtra',
            postalCode: '440026',
            addressCountry: 'IN',
          },
        }}
      />

      {/* 1. FLIPKART-STYLE CATEGORY ICON STRIP */}
      <section className="bg-white border-b border-gray-200 py-3 shadow-2xs mb-4">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 overflow-x-auto scrollbar-none py-1">
            {activeCategories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                to={`/materials/${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center text-center group min-w-[80px] sm:min-w-[95px] shrink-0"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border border-gray-200 group-hover:border-[#2874F0] p-1 bg-gray-50 group-hover:shadow-xs transition-all">
                  <img
                    src={resolveMaterialImage(cat.image, cat.name)}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full group-hover:scale-108 transition-transform"
                    loading="lazy"
                  />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-gray-700 group-hover:text-[#2874F0] transition-colors mt-1.5 line-clamp-1 max-w-[100px]">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        {/* 2. HERO PROMOTIONAL BANNER (Amazon / Flipkart Hybrid Banner) */}
        <section className="rounded-xl overflow-hidden bg-white border border-gray-200 shadow-xs relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Left Promotional Content */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#2874F0] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interior Materials Digital Showroom</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
                Materials That Shape Better Spaces.
              </h1>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-xl">
                Source architectural wall panels, fluted louvers, acoustic ceiling systems, and industrial-grade fasteners directly for your home, commercial, or contractor project.
              </p>

              {/* Action Buttons (Amazon / Flipkart Style) */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/materials"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#FF9F00] hover:bg-[#F39000] text-gray-950 font-bold text-xs sm:text-sm transition-all shadow-xs border border-[#F09600]"
                >
                  <span>Explore Materials</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm transition-all shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Talk to Us on WhatsApp</span>
                </a>
              </div>

              {/* 3 Pillars */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100 text-[11px] sm:text-xs text-gray-600">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2874F0] shrink-0" />
                  <span>Direct Factory Rates</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#2874F0] shrink-0" />
                  <span>Pan-India Site Dispatch</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-[#2874F0] shrink-0" />
                  <span>GST Invoicing</span>
                </div>
              </div>
            </div>

            {/* Right Banner Image */}
            <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full min-h-[300px] bg-gray-100 overflow-hidden">
              <img
                src={MATERIAL_IMAGES.heroShowroom}
                alt="MetaPro Interior Materials Showroom"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
              <div className="absolute bottom-4 left-4 right-4 lg:hidden text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Featured Cladding
                </span>
                <p className="text-sm font-semibold">Fluted Louvers & UV Marble Cladding</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. FLIPKART "DEAL OF THE DAY / FEATURED MATERIAL" SHELF */}
        {spotlight && (
          <section className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="px-2.5 py-1 rounded bg-[#2874F0] text-white font-bold text-xs uppercase tracking-wide">
                  Spotlight Deal
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">
                    Featured Material of the Week
                  </h2>
                  <p className="text-xs text-gray-500">
                    High-demand architectural profile configured in the Admin Panel
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-1.5 rounded border border-gray-200 self-start sm:self-auto">
                <Clock className="w-3.5 h-3.5 text-[#FF9F00]" />
                <span>Special Contractor Pricing Live</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* Product Image */}
              <div className="lg:col-span-5">
                <Link
                  to={`/product/${spotlight.slug || spotlight.id}`}
                  className="block aspect-4/3 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group relative"
                >
                  <img
                    src={resolveMaterialImage(spotlight.image, spotlight.category)}
                    alt={spotlight.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-emerald-600 text-white text-[11px] font-bold shadow-2xs">
                    {spotlightDiscount}% Off Indicative MRP
                  </span>
                </Link>
              </div>

              {/* Product Information */}
              <div className="lg:col-span-7 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#2874F0] uppercase tracking-wider">
                    {spotlight.category}
                  </span>
                  <Link to={`/product/${spotlight.slug || spotlight.id}`} className="block">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-[#2874F0] transition-colors">
                      {spotlight.name}
                    </h3>
                  </Link>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {spotlight.description}
                  </p>
                </div>

                {/* Price Box */}
                <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200/90 space-y-1">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                    Indicative Price
                  </span>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-2xl font-bold text-gray-900 tabular-nums">
                      ₹{spotlight.price.toLocaleString('en-IN')}
                    </span>
                    {spotlight.unit && (
                      <span className="text-sm text-gray-600 font-medium">/ {spotlight.unit}</span>
                    )}
                    <span className="text-sm text-gray-400 line-through tabular-nums">
                      ₹{spotlightMRP.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-bold text-[#388E3C]">
                      Special Showroom Offer
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 pt-0.5">
                    *Prices may vary depending on order quantity, finish & site delivery location.
                  </p>
                </div>

                {/* Applications & Features */}
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-semibold text-gray-700">Suitable For:</span>
                  {(spotlight.applications || ['Feature Walls', 'TV Units', 'Office Partitions']).map((app) => (
                    <span
                      key={app}
                      className="px-2 py-0.5 rounded bg-blue-50 text-[#2874F0] font-medium border border-blue-200/60"
                    >
                      {app}
                    </span>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => addToCart(spotlight, 5)}
                    className="px-5 py-2.5 rounded-md bg-[#FF9F00] hover:bg-[#F39000] text-gray-950 font-bold text-xs sm:text-sm transition-all shadow-xs border border-[#F09600] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add 5 Units to Enquiry</span>
                  </button>

                  <Link
                    to={`/product/${spotlight.slug || spotlight.id}`}
                    className="px-5 py-2.5 rounded-md bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-semibold text-xs sm:text-sm transition-colors"
                  >
                    View Product Details →
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 4. FLIPKART PRODUCT SHELF 1: "Trending in Wall Panels & Fluted Louvers" */}
        {wallPanels.length > 0 && (
          <section className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Trending in Wall Panels & Fluted Louvers
                </h2>
                <p className="text-xs text-gray-500">
                  Dry-wall cladding, fluted profiles & PVC stone-core marble sheets
                </p>
              </div>

              {/* Flipkart signature blue "VIEW ALL" button */}
              <Link
                to="/materials/Fluted%20Panels"
                className="px-3.5 py-1.5 rounded-xs bg-[#2874F0] hover:bg-[#1f62cf] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs shrink-0"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {wallPanels.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* 5. FLIPKART PRODUCT SHELF 2: "Best-Selling Fasteners & Structural Hardware" */}
        {fastenersAndHardware.length > 0 && (
          <section className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Best-Selling Fasteners & Hardware
                </h2>
                <p className="text-xs text-gray-500">
                  Self-drilling screws, anchor bolts, drywall anchors & framing fixers
                </p>
              </div>

              <Link
                to="/materials/Fasteners%20%26%20Screws"
                className="px-3.5 py-1.5 rounded-xs bg-[#2874F0] hover:bg-[#1f62cf] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs shrink-0"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {fastenersAndHardware.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* 6. FLIPKART PRODUCT SHELF 3: "Interior Ceilings & Decorative Panels" */}
        {ceilingAndDecorative.length > 0 && (
          <section className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Ceilings & Decorative Cladding
                </h2>
                <p className="text-xs text-gray-500">
                  Acoustic tegular ceiling tiles, 3D relief panels & metal trims
                </p>
              </div>

              <Link
                to="/materials/Interior%20Ceiling%20Panels"
                className="px-3.5 py-1.5 rounded-xs bg-[#2874F0] hover:bg-[#1f62cf] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs shrink-0"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ceilingAndDecorative.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* 7. AMAZON-STYLE 4-CARD FEATURE GRID ("Why Shop with MetaPro") */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Why Contractors & Architects Choose MetaPro
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Transparent trade pricing, verified material durability, and direct site logistics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#2874F0] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">Direct Factory Sourcing</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Save up to 25% by procuring interior materials and fixings directly without multiple intermediary distributor margins.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-2">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-[#FF9F00] flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">Finish Swatch Samples</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Need to verify texture and color match? Request physical material finish swatches dispatched to your design studio.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">GST Invoice Ready</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                All dispatches are accompanied by tax-compliant GST invoices for corporate and commercial input tax credit claims.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-2">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">Doorstep Site Delivery</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Safe protective packaging with prompt road freight to your job site or workshop across Nagpur, Maharashtra, and pan-India.
              </p>
            </div>
          </div>
        </section>

        {/* 8. SPACE APPLICATIONS & INSPIRATION */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Applications & Space Inspirations
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                See how MetaPro materials are specified across living spaces, offices, and retail showrooms.
              </p>
            </div>

            <Link
              to="/materials"
              className="text-xs sm:text-sm font-semibold text-[#2874F0] hover:underline inline-flex items-center gap-1"
            >
              <span>Explore All 26+ Materials</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SPACE_APPLICATIONS.map((space) => (
              <div
                key={space.title}
                className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden flex flex-col sm:flex-row group hover:shadow-xs transition-shadow"
              >
                <div className="w-full sm:w-2/5 aspect-4/3 sm:aspect-auto overflow-hidden bg-gray-200">
                  <img
                    src={space.image}
                    alt={space.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="w-full sm:w-3/5 p-4 sm:p-5 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-[#2874F0] uppercase tracking-wider block">
                      {space.materials}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">
                      {space.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {space.description}
                    </p>
                  </div>
                  <Link
                    to="/materials"
                    className="text-xs font-semibold text-[#2874F0] hover:underline inline-flex items-center gap-1 pt-1"
                  >
                    <span>View suitable materials</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 9. BOTTOM ENQUIRY CTA BANNER */}
        <section className="bg-gradient-to-r from-gray-900 to-[#172337] rounded-xl p-6 sm:p-10 text-white shadow-md">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight">
              Ready to Furnish Your Next Project?
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Add your required wall panels, fluted louvers, and screws to your Enquiry List to receive a fast, itemized project quotation directly on WhatsApp.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/materials"
                className="px-6 py-3 rounded-md bg-[#FF9F00] hover:bg-[#F39000] text-gray-950 font-bold text-xs sm:text-sm transition-all shadow-xs"
              >
                Browse Materials Catalogue
              </Link>
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-md bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
