import React, { createContext, useContext, useEffect } from 'react';

export interface SEOHelmetProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: 'website' | 'product' | 'article';
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
  structuredData?: Record<string, any> | Record<string, any>[];
}

interface HelmetContextValue {
  siteName: string;
}

const HelmetContext = createContext<HelmetContextValue>({
  siteName: 'MetaPro Enterprises',
});

export const HelmetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <HelmetContext.Provider value={{ siteName: 'MetaPro Enterprises' }}>
      {children}
    </HelmetContext.Provider>
  );
};

function upsertMetaTag(
  attrName: 'name' | 'property',
  attrValue: string,
  content: string
) {
  if (typeof document === 'undefined') return;
  let tag = document.head.querySelector(
    `meta[${attrName}="${attrValue}"]`
  ) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attrName, attrValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertCanonicalLink(href: string) {
  if (typeof document === 'undefined') return;
  let link = document.head.querySelector(
    'link[rel="canonical"]'
  ) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

/**
 * React Helmet SEO component that dynamically sets document <title>,
 * <meta name="description">, OpenGraph tags, Twitter cards, canonical URLs,
 * and Schema.org JSON-LD structured data in <head>.
 */
export const SEOHelmet: React.FC<SEOHelmetProps> = ({
  title,
  description,
  canonicalPath,
  ogType = 'website',
  image,
  keywords,
  noIndex = false,
  structuredData,
}) => {
  const { siteName } = useContext(HelmetContext);

  const fullTitle = title.includes(siteName)
    ? title
    : `${title} | ${siteName}`;

  const cleanDescription =
    description.length > 160
      ? `${description.slice(0, 157).trim()}...`
      : description;

  const origin =
    typeof window !== 'undefined' ? window.location.origin : '';
  const pathname =
    canonicalPath ||
    (typeof window !== 'undefined' ? window.location.pathname : '/');
  const canonicalUrl = `${origin}${pathname}`;

  const absoluteImageUrl = image
    ? image.startsWith('http')
      ? image
      : `${origin}${image.startsWith('/') ? '' : '/'}${image}`
    : `${origin}/favicon.svg`;

  useEffect(() => {
    document.title = fullTitle;

    upsertMetaTag('name', 'description', cleanDescription);
    upsertMetaTag(
      'name',
      'robots',
      noIndex ? 'noindex, nofollow' : 'index, follow'
    );

    if (keywords && keywords.length > 0) {
      upsertMetaTag('name', 'keywords', keywords.join(', '));
    }

    // OpenGraph Tags
    upsertMetaTag('property', 'og:title', fullTitle);
    upsertMetaTag('property', 'og:description', cleanDescription);
    upsertMetaTag('property', 'og:type', ogType);
    upsertMetaTag('property', 'og:site_name', siteName);
    upsertMetaTag('property', 'og:url', canonicalUrl);
    upsertMetaTag('property', 'og:image', absoluteImageUrl);

    // Twitter Card Tags
    upsertMetaTag('name', 'twitter:card', 'summary_large_image');
    upsertMetaTag('name', 'twitter:title', fullTitle);
    upsertMetaTag('name', 'twitter:description', cleanDescription);
    upsertMetaTag('name', 'twitter:image', absoluteImageUrl);

    // Canonical URL
    upsertCanonicalLink(canonicalUrl);
  }, [
    fullTitle,
    cleanDescription,
    noIndex,
    keywords,
    ogType,
    siteName,
    canonicalUrl,
    absoluteImageUrl,
  ]);

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={cleanDescription} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={cleanDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={cleanDescription} />
      <meta name="twitter:image" content={absoluteImageUrl} />
      <link rel="canonical" href={canonicalUrl} />
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
    </>
  );
};

export { SEOHelmet as Helmet };
