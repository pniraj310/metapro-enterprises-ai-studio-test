import React from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  ClipboardList,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  MapPin,
  ArrowRight,
  Truck,
  ShieldCheck,
  ChevronUp,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { MetaProLogo } from './MetaProLogo';

export const Footer: React.FC = () => {
  const { settings, categories, whatsAppNumber } = useProducts();
  const { cart, setIsCartDrawerOpen } = useCart();

  const activeCategories = categories
    .filter((c) => c.active !== false)
    .slice(0, 6);

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

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  const directWhatsAppUrl = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(
    `Hello ${settings.businessName || 'MetaPro Enterprises'}, I would like to enquire about your interior materials catalogue.`
  )}`;

  return (
    <footer className="w-full font-sans mt-auto">
      {/* Amazon-Style "Back to top" bar */}
      <button
        type="button"
        onClick={scrollToTop}
        className="w-full bg-[#37475A] hover:bg-[#485769] text-white text-xs font-semibold py-3 text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5"
      >
        <ChevronUp className="w-4 h-4" />
        <span>Back to top</span>
      </button>

      {/* Main Flipkart / Amazon Dark Navy-Charcoal Footer */}
      <div className="bg-[#172337] text-gray-300">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-gray-700/60">
            {/* Col 1: About MetaPro */}
            <div className="space-y-4">
              <Link to="/" className="inline-block">
                <MetaProLogo variant="full" theme="dark" size="sm" />
              </Link>
              <p className="text-xs text-gray-400 leading-relaxed">
                {settings.aboutText ||
                  'MetaPro Enterprises supplies interior materials, architectural wall and ceiling panels, and installation fasteners for contractors, architects, and homeowners.'}
              </p>
              <div className="pt-1">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold transition-colors border border-gray-700"
                >
                  <span>About Our Business</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FF9F00]" />
                </Link>
              </div>

              {configuredSocials.length > 0 && (
                <div className="pt-2 space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block">
                    Follow MetaPro
                  </span>
                  <div className="flex items-center gap-2">
                    {configuredSocials.map((soc) => {
                      const Icon = soc.icon;
                      return (
                        <a
                          key={soc.label}
                          href={soc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 rounded bg-gray-800 hover:bg-[#2874F0] text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                          aria-label={soc.label}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Col 2: Categories */}
            <div className="space-y-3">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider">
                Material Categories
              </h4>
              <ul className="space-y-2 text-xs text-gray-400">
                {activeCategories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/materials/${encodeURIComponent(cat.name)}`}
                      className="hover:text-white hover:underline transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/materials"
                    className="text-[#FF9F00] hover:underline font-semibold"
                  >
                    View All Categories →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Customer Service & Help */}
            <div className="space-y-3">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider">
                Help & Services
              </h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li>
                  <button
                    type="button"
                    onClick={() => setIsCartDrawerOpen(true)}
                    className="hover:text-white hover:underline transition-colors text-left cursor-pointer flex items-center gap-1.5"
                  >
                    <ClipboardList className="w-3.5 h-3.5 text-[#FF9F00]" />
                    <span>Review Enquiry List ({cart.length})</span>
                  </button>
                </li>
                <li>
                  <a
                    href={directWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white hover:underline transition-colors flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>Instant WhatsApp Quotation</span>
                  </a>
                </li>
                <li>
                  <Link
                    to="/track-order"
                    className="hover:text-white hover:underline transition-colors flex items-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5 text-gray-400" />
                    <span>Track Material Dispatch</span>
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white hover:underline transition-colors">
                    Contractor & Bulk Rates
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white hover:underline transition-colors">
                    Showroom Working Hours
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Registered Office & Address */}
            <div className="space-y-3">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider">
                Showroom & Warehouse
              </h4>
              <div className="space-y-2 text-xs text-gray-400 leading-relaxed">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#FF9F00] shrink-0 mt-0.5" />
                  <span>
                    {settings.businessAddress ||
                      'Pili Nadi, Sunday Market, Plot No. 02, Kamptee Road, Nagpur, Maharashtra 440026, India'}
                  </span>
                </div>
                <div className="pt-1">
                  <span className="text-gray-500 block">Phone / WhatsApp:</span>
                  <a
                    href={directWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-white hover:text-[#FF9F00] transition-colors"
                  >
                    +91 {settings.whatsAppNumber || '7666323894'}
                  </a>
                </div>
                <div>
                  <span className="text-gray-500 block">Email:</span>
                  <a
                    href={`mailto:${settings.businessEmail || 'pdheeraj351@gmail.com'}`}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {settings.businessEmail || 'pdheeraj351@gmail.com'}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Verified Trust */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                © {new Date().getFullYear()} {settings.businessName || 'MetaPro Enterprises'}. All Rights Reserved.
              </span>
            </div>

            <div className="flex items-center gap-4 text-gray-400 text-[11px]">
              <span>Interior Materials Digital Showroom</span>
              <span>·</span>
              <span>Nagpur, Maharashtra, India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
