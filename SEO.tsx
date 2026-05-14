import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  name?: string;
  type?: string;
  canonical?: string;
}

export const SEO = ({
  title,
  description,
  name = 'DSTRKT',
  type = 'website',
  canonical = 'https://dstrkt.co.za',
}: SEOProps) => {
  const allKeywords = [
    "DSTRKT", "luxury streetwear", "designer duffel bags", "premium fashion",
    "graffiti art fashion", "wearable art", "limited edition bags",
    "urban style", "hypebeast accessories", "handmade streetwear",
    "street art fashion", "premium canvas duffel", "worldwide shipping"
  ];

  return (
    <Helmet>
      {/* Standard metadata */}
      <title>{`${title} | ${name}`}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords.join(', ')} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonical} />

      {/* Global Geo Targeting */}
      <meta name="geo.region" content="ZA, US, GB, NG, GH, KE, AE, FR, JP" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="target" content="USA, UK, Europe, Africa, Middle East, Asia, Global" />
      <meta name="revisit-after" content="3 days" />

      {/* Hreflang for Global English */}
      <link rel="alternate" hreflang="en" href={canonical} />
      <link rel="alternate" hreflang="en-us" href={canonical} />
      <link rel="alternate" hreflang="en-gb" href={canonical} />
      <link rel="alternate" hreflang="en-za" href={canonical} />
      <link rel="alternate" hreflang="x-default" href={canonical} />

      {/* Geo targeting for SA market */}
      <meta name="geo.region" content="ZA" />
      <meta name="geo.placename" content="Johannesburg, South Africa" />
      <meta name="geo.position" content="-26.2041;28.0473" />
      <meta name="ICBM" content="-26.2041, 28.0473" />
      
      {/* Additional categories */}
      <meta name="category" content="Streetwear, Fashion, Accessories, Bags, Urban Fashion" />
      <meta name="rating" content="General" />
      <meta name="language" content="English" />

      {/* Structured Data (JSON-LD) for AI and Search Engines */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "DSTRKT Premium Graffiti Duffel Bag",
          "description": "Limited edition premium duffel bag engraved with exclusive graffiti art. Built for the bold. Ships worldwide.",
          "brand": {
            "@type": "Brand",
            "name": "DSTRKT"
          },
          "image": "https://bjylzveziwmocmlfyfgm.supabase.co/storage/v1/object/public/Assets/Blood%20Splatter.png",
          "url": "https://dstrkt.co.za",
          "offers": {
            "@type": "Offer",
            "priceCurrency": "USD",
            "price": "280",
            "priceValidUntil": "2026-12-31",
            "availability": "https://schema.org/InStock",
            "url": "https://dstrkt.co.za",
            "seller": {
              "@type": "Organization",
              "name": "DSTRKT"
            }
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5",
            "reviewCount": "1"
          },
          "review": {
            "@type": "Review",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "author": {
              "@type": "Person",
              "name": "DSTRKT Customer"
            },
            "reviewBody": "Absolutely premium quality. The graffiti engraving is unlike anything else on the market. Worth every cent."
          },
          "audience": {
            "@type": "Audience",
            "audienceType": "Gen Z and Millennials aged 17-35",
            "geographicArea": "Worldwide"
          }
        })}
      </script>

      {/* Open Graph metadata */}
      <meta property="og:title" content={`${title} | ${name} | Worldwide Shipping`} />
      <meta property="og:description" content="Premium duffel bags engraved with exclusive graffiti art. Built for the bold. Trusted globally. Ships to USA, UK, Europe, Africa and beyond. Shop now in USD." />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={name} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="en_GB" />
      <meta property="og:locale:alternate" content="en_ZA" />

      {/* Twitter metadata */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${title} | ${name} | Ships Worldwide`} />
      <meta name="twitter:description" content="The boldest graffiti duffel bags on the planet. Carry Culture. Ships globally in USD. Shop DSTRKT now." />
    </Helmet>
  );
};
