import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from '../../components/SEOHelmet';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { MetaProLogo } from '../../components/MetaProLogo';
import { METAPRO_BUSINESS_INFO } from '../../services/productService';
import {
  ArrowLeft,
  MessageSquare,
  ClipboardList,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  MapPin,
  ExternalLink,
} from 'lucide-react';

const WHY_METAPRO_POINTS = [
  {
    index: '01',
    title: 'Quality Materials',
    description:
      'Carefully selected wall panels, ceiling systems, and structural fasteners suited for interior finishing work.',
  },
  {
    index: '02',
    title: 'Reliable Supply',
    description:
      'Consistent batch finishes and clear stock communication for ongoing residential and commercial site schedules.',
  },
  {
    index: '03',
    title: 'Practical Solutions',
    description:
      'Surface materials and compatible installation hardware available under one roof for straightforward specification.',
  },
  {
    index: '04',
    title: 'Direct Support',
    description:
      'Send your material enquiry list directly on WhatsApp for quick clarification on dimensions, quantities, and pricing.',
  },
];

export const AboutUs: React.FC = () => {
  const { settings, whatsAppNumber } = useProducts();
  const { cart, setIsCartDrawerOpen } = useCart();
  const location = useLocation();


  const directWhatsAppUrl = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(
    `Hello ${settings.businessName}, I would like to discuss interior materials for my upcoming project.`
  )}`;

  const configuredSocials = [
    settings.instagramUrl
      ? { label: 'Instagram', url: settings.instagramUrl, icon: Instagram }
      : null,
    settings.facebookUrl
      ? { label: 'Facebook', url: settings.facebookUrl, icon: Facebook }
      : null,
    settings.youtubeUrl
      ? { label: 'YouTube', url: settings.youtubeUrl, icon: Youtube }
      : null,
    settings.linkedinUrl
      ? { label: 'LinkedIn', url: settings.linkedinUrl, icon: Linkedin }
      : null,
  ].filter(Boolean) as { label: string; url: string; icon: React.FC<any> }[];

  return (
    <div className="w-full bg-[#FAF9F6] text-[#141413] min-h-screen font-sans">
      <Helmet
        title={`About & Contact — ${settings.businessName || 'MetaPro Enterprises'}`}
        description={settings.aboutText}
        canonicalPath="/about"
      />
      {/* Top Breadcrumb */}
      <div className="border-b border-stone-200/90 bg-white/70 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between text-xs text-stone-500">
          <Link
            to="/"
            className="hover:text-stone-950 flex items-center gap-1.5 font-medium text-stone-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <span>About {settings.businessName}</span>
        </div>
      </div>

      {/* About MetaPro & Why MetaPro */}
      <section className="py-16 sm:py-20 border-b border-stone-200/80 bg-[#F5F3EE]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-5">
              <MetaProLogo
                variant="stacked"
                theme="light"
                size="lg"
                showCornerFrame
                className="w-full max-w-md"
              />
            </div>
            <div className="lg:col-span-7 space-y-4 text-sm sm:text-base text-stone-700 leading-relaxed">
              <div className="text-xs font-semibold uppercase tracking-widest text-amber-800">
                About {settings.businessName}
              </div>
              <h1
                className="text-3xl sm:text-4xl font-semibold text-stone-950 tracking-tight leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {settings.heroHeadline ||
                  'Interior Materials & Practical Finishing Hardware.'}
              </h1>
              <p>{settings.aboutText}</p>
              <div className="pt-2 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-stone-600">
                <span>• Homes & Residential Interiors</span>
                <span>• Offices & Workspaces</span>
                <span>• Commercial Spaces</span>
                <span>• Interior Renovation Projects</span>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-stone-300/80">
            <div className="mb-8">
              <div className="text-xs text-stone-500">Our Approach</div>
              <h2
                className="text-2xl sm:text-3xl font-semibold text-stone-950 mt-1"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Why MetaPro
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {WHY_METAPRO_POINTS.map((point) => (
                <div
                  key={point.index}
                  className="bg-white rounded-xl p-6 border border-stone-200/90 space-y-2.5"
                >
                  <span className="text-xs font-mono text-amber-800">
                    {point.index}.
                  </span>
                  <h3 className="text-base font-semibold text-stone-950">
                    {point.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Showroom Details */}
      <section className="py-16 sm:py-20 bg-[#FAF9F6]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#141413] text-white rounded-2xl p-8 sm:p-12 border border-stone-800">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-[#EAB01E]">
                  Direct Enquiry & Showroom Desk · {settings.businessName}
                </div>
                <h2
                  className="text-3xl sm:text-4xl font-semibold text-white tracking-tight"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Connect with {settings.businessName}
                </h2>
                <p className="text-sm text-stone-300 max-w-xl leading-relaxed">
                  Reach out on WhatsApp, phone, or visit our showroom to check
                  wall & ceiling panels, fasteners, anchor bolts, metal
                  profiles, and material availability.
                </p>

                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs text-stone-300 border-t border-stone-800">
                  {settings.businessPhone && (
                    <div>
                      <span className="text-stone-500 block uppercase tracking-wider text-[10px] mb-1">
                        Phone
                      </span>
                      <a
                        href={`tel:${settings.businessPhone}`}
                        className="font-mono text-sm text-white hover:text-[#EAB01E] transition-colors"
                      >
                        {settings.businessPhone}
                      </a>
                    </div>
                  )}

                  <div>
                    <span className="text-stone-500 block uppercase tracking-wider text-[10px] mb-1">
                      WhatsApp
                    </span>
                    <a
                      href={directWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-white hover:text-[#EAB01E] transition-colors"
                    >
                      +{whatsAppNumber}
                    </a>
                  </div>

                  {settings.businessEmail && (
                    <div>
                      <span className="text-stone-500 block uppercase tracking-wider text-[10px] mb-1">
                        Email
                      </span>
                      <a
                        href={`mailto:${settings.businessEmail}`}
                        className="text-sm text-white hover:text-[#EAB01E] transition-colors break-all"
                      >
                        {settings.businessEmail}
                      </a>
                    </div>
                  )}

                  <div>
                    <span className="text-stone-500 block uppercase tracking-wider text-[10px] mb-1">
                      Business
                    </span>
                    <span className="text-sm text-white font-medium">
                      {settings.businessName}
                    </span>
                  </div>

                  {settings.businessAddress && (
                    <div className="sm:col-span-2">
                      <span className="text-stone-500 block uppercase tracking-wider text-[10px] mb-1">
                        Showroom & Office Address
                      </span>
                      <p className="text-sm text-white leading-relaxed">
                        {settings.businessAddress}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-3 justify-end lg:pt-6">
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-lg bg-[#EAB01E] hover:bg-amber-400 text-stone-950 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Talk to MetaPro (+{whatsAppNumber})</span>
                </a>
                {settings.businessPhone && (
                  <a
                    href={`tel:${settings.businessPhone}`}
                    className="w-full py-3 px-6 rounded-lg border border-stone-700 hover:border-stone-500 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Call: {settings.businessPhone}</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setIsCartDrawerOpen(true)}
                  className="w-full py-3 px-6 rounded-lg border border-stone-800 bg-stone-900 hover:border-stone-600 text-stone-200 font-medium text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ClipboardList className="w-4 h-4 text-[#EAB01E]" />
                  <span>Review Enquiry List ({cart.length})</span>
                </button>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {configuredSocials.length > 0 ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone-400">Follow Us:</span>
                  {configuredSocials.map((soc) => {
                    const Icon = soc.icon;
                    return (
                      <a
                        key={soc.label}
                        href={soc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-[#EAB01E] text-xs text-stone-200 hover:text-[#EAB01E] transition-colors"
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{soc.label}</span>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs text-stone-400">
                  Visit our Nagpur showroom or message us on WhatsApp for
                  catalogue assistance.
                </div>
              )}

              <a
                href={METAPRO_BUSINESS_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#EAB01E] hover:underline"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Open Showroom on Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
