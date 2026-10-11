import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { AdminLayout } from '../../components/AdminLayout';
import {
  Check,
  AlertTriangle,
  Building2,
  Globe,
  MessageSquare,
  Share2,
  Star,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const {
    settings,
    updateSettings,
    products,
    featuredProduct,
    setFeaturedProduct,
  } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab =
    searchParams.get('tab') === 'website' ? 'website' : 'business';

  const [businessName, setBusinessName] = useState(settings.businessName);
  const [whatsAppNumber, setWhatsAppNumber] = useState(settings.whatsAppNumber);
  const [businessPhone, setBusinessPhone] = useState(settings.businessPhone);
  const [businessEmail, setBusinessEmail] = useState(settings.businessEmail);
  const [businessAddress, setBusinessAddress] = useState(
    settings.businessAddress
  );

  const [heroHeadline, setHeroHeadline] = useState(settings.heroHeadline);
  const [heroSubheadline, setHeroSubheadline] = useState(
    settings.heroSubheadline
  );
  const [aboutText, setAboutText] = useState(settings.aboutText);

  const [instagramUrl, setInstagramUrl] = useState(settings.instagramUrl || '');
  const [facebookUrl, setFacebookUrl] = useState(settings.facebookUrl || '');
  const [youtubeUrl, setYoutubeUrl] = useState(settings.youtubeUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(settings.linkedinUrl || '');

  const [selectedFeaturedId, setSelectedFeaturedId] = useState(
    featuredProduct?.id || ''
  );

  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    setBusinessName(settings.businessName);
    setWhatsAppNumber(settings.whatsAppNumber);
    setBusinessPhone(settings.businessPhone);
    setBusinessEmail(settings.businessEmail);
    setBusinessAddress(settings.businessAddress);
    setHeroHeadline(settings.heroHeadline);
    setHeroSubheadline(settings.heroSubheadline);
    setAboutText(settings.aboutText);
    setInstagramUrl(settings.instagramUrl || '');
    setFacebookUrl(settings.facebookUrl || '');
    setYoutubeUrl(settings.youtubeUrl || '');
    setLinkedinUrl(settings.linkedinUrl || '');
  }, [settings]);

  useEffect(() => {
    if (featuredProduct?.id) {
      setSelectedFeaturedId(featuredProduct.id);
    }
  }, [featuredProduct]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setNotification(null);
    try {
      await updateSettings({
        businessName: businessName.trim() || 'MetaPro Enterprises',
        whatsAppNumber: whatsAppNumber.replace(/[^0-9]/g, '') || '917666323894',
        businessPhone: businessPhone.trim(),
        businessEmail: businessEmail.trim(),
        businessAddress: businessAddress.trim(),
        heroHeadline: heroHeadline.trim(),
        heroSubheadline: heroSubheadline.trim(),
        aboutText: aboutText.trim(),
        instagramUrl: instagramUrl.trim(),
        facebookUrl: facebookUrl.trim(),
        youtubeUrl: youtubeUrl.trim(),
        linkedinUrl: linkedinUrl.trim(),
      });

      if (selectedFeaturedId && selectedFeaturedId !== featuredProduct?.id) {
        await setFeaturedProduct(selectedFeaturedId);
      }

      setNotification({
        message:
          'Settings saved to PostgreSQL. Customer website updated immediately.',
        type: 'success',
      });
    } catch (err: any) {
      setNotification({
        message: err?.message || 'Failed to save settings.',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout
      title={
        activeTab === 'website' ? 'Website Settings' : 'Business Settings'
      }
      subtitle="Manage contact details, WhatsApp number, social media links, and homepage content without changing code"
    >
      <div className="max-w-4xl space-y-6">
        {/* Section Switcher Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'business'
                ? 'bg-[#08142C] text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-950'
            }`}
          >
            <Building2 className="w-4 h-4 text-[#EAB01E]" />
            <span>Business & Contact Settings</span>
          </button>

          <button
            type="button"
            onClick={() => setSearchParams({ tab: 'website' })}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'website'
                ? 'bg-[#08142C] text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-950'
            }`}
          >
            <Globe className="w-4 h-4 text-[#EAB01E]" />
            <span>Website Content & Featured Product</span>
          </button>
        </div>

        {notification && (
          <div
            className={`p-4 rounded-xl border text-xs font-medium flex items-center gap-2 ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            {notification.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {activeTab === 'business' ? (
            <>
              {/* WhatsApp Configuration */}
              <div className="bg-white rounded-xl p-6 border border-stone-200 space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-semibold text-stone-950">
                    WhatsApp Enquiry Configuration
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    WhatsApp Number (with Country Code, digits only)
                  </label>
                  <input
                    type="text"
                    value={whatsAppNumber}
                    onChange={(e) => setWhatsAppNumber(e.target.value)}
                    placeholder="917666323894"
                    className="w-full max-w-md px-3.5 py-2 rounded-lg border border-stone-300 text-sm font-mono focus:outline-none focus:border-[#08142C]"
                  />
                  <p className="text-[11px] text-stone-500 mt-1">
                    All customer material enquiries and "Talk to Us" buttons on
                    the website send messages to this WhatsApp number.
                  </p>
                </div>
              </div>

              {/* Contact Details */}
              <div className="bg-white rounded-xl p-6 border border-stone-200 space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <Building2 className="w-4 h-4 text-stone-700" />
                  <h3 className="text-sm font-semibold text-stone-950">
                    Business Contact Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#08142C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Business Phone
                    </label>
                    <input
                      type="text"
                      value={businessPhone}
                      onChange={(e) => setBusinessPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm font-mono focus:outline-none focus:border-[#08142C]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Business Email
                    </label>
                    <input
                      type="email"
                      value={businessEmail}
                      onChange={(e) => setBusinessEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#08142C]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Showroom / Business Address
                    </label>
                    <textarea
                      rows={2}
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#08142C]"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Accounts */}
              <div className="bg-white rounded-xl p-6 border border-stone-200 space-y-4">
                <div className="border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-amber-600" />
                    <h3 className="text-sm font-semibold text-stone-950">
                      Social Media Accounts
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Only social icons with a configured URL below will be
                    displayed on the customer website. Leave blank to hide an
                    icon.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                      placeholder="https://instagram.com/..."
                      className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-[#08142C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      value={facebookUrl}
                      onChange={(e) => setFacebookUrl(e.target.value)}
                      placeholder="https://facebook.com/..."
                      className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-[#08142C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      YouTube URL
                    </label>
                    <input
                      type="url"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://youtube.com/..."
                      className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-[#08142C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/company/..."
                      className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-[#08142C]"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Homepage Featured Product Selection */}
              <div className="bg-white rounded-xl p-6 border border-stone-200 space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <Star className="w-4 h-4 text-[#EAB01E] fill-[#EAB01E]" />
                  <h3 className="text-sm font-semibold text-stone-950">
                    Primary Homepage Featured Product
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Active Featured Product (Only one active at a time)
                  </label>
                  <select
                    value={selectedFeaturedId}
                    onChange={(e) => setSelectedFeaturedId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-sm focus:outline-none focus:border-[#08142C]"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — ₹{p.price.toLocaleString('en-IN')} /{' '}
                        {p.unit || 'Unit'} ({p.availability})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Selecting a product here automatically sets the previous
                    featured product to false and highlights the chosen product
                    on the customer homepage.
                  </p>
                </div>
              </div>

              {/* Website Copy & Messaging */}
              <div className="bg-white rounded-xl p-6 border border-stone-200 space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <Globe className="w-4 h-4 text-stone-700" />
                  <h3 className="text-sm font-semibold text-stone-950">
                    Customer Website Headlines & About Text
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Homepage Headline
                    </label>
                    <input
                      type="text"
                      value={heroHeadline}
                      onChange={(e) => setHeroHeadline(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#08142C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Homepage Subheadline
                    </label>
                    <textarea
                      rows={2}
                      value={heroSubheadline}
                      onChange={(e) => setHeroSubheadline(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#08142C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      About MetaPro Enterprises Description
                    </label>
                    <textarea
                      rows={4}
                      value={aboutText}
                      onChange={(e) => setAboutText(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#08142C]"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#08142C] hover:bg-stone-800 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4 text-[#EAB01E]" />
              <span>{isSaving ? 'Saving Settings...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
