import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import NextLink from 'next/link';
import MainLayout from '../layouts/Main/MainLayout';
import Page from '../components/Page';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.commercialuk.co.uk';
const PAGE_PATH = '/for-commercial-agents';
const CANONICAL_URL = `${SITE_URL}${PAGE_PATH}`;
const META_TITLE = 'For Commercial Agents | List Commercial Property UK | CommercialUK.co.uk';
const META_DESCRIPTION =
  'List commercial property on CommercialUK.co.uk — the UK commercial property portal for agents. SEO listings, AI valuations, office, retail, industrial. Join today.';

// Design tokens from HTML
const tokens = {
  gold: '#f2c514',
  goldDeep: '#c9a200',
  goldPale: '#fdf5cc',
  goldMuted: '#f9e270',
  white: '#ffffff',
  offWhite: '#fafaf8',
  dark: '#0f0e0a',
  darkMid: '#1c1a13',
  grayWarm: '#6b6450',
  grayLight: '#e8e4d8',
};

const titleFont = '"Montserrat", sans-serif';
const sans = '"Plus Jakarta Sans", sans-serif';
const mono = '"DM Mono", monospace';

function buildJsonLd() {
  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: META_TITLE,
    description: META_DESCRIPTION,
    url: CANONICAL_URL,
    publisher: { '@type': 'Organization', name: 'CommercialUK.co.uk', url: SITE_URL },
    mainEntity: {
      '@type': 'Service',
      name: 'Commercial Property Listing for Agents',
      description: 'List commercial property for sale and to let across the UK. SEO-optimised listings and AI-powered valuations for commercial agents.',
      provider: { '@type': 'Organization', name: 'CommercialUK.co.uk' },
      areaServed: { '@type': 'Country', name: 'United Kingdom' },
    },
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Why should commercial agents list on CommercialUK.co.uk?', acceptedAnswer: { '@type': 'Answer', text: 'CommercialUK.co.uk is a dedicated UK commercial property portal. Agents get targeted exposure to occupiers, investors and developers, SEO-optimised listings, direct enquiries, and access to AI-powered valuation technology.' } },
      { '@type': 'Question', name: 'What types of commercial property can I list?', acceptedAnswer: { '@type': 'Answer', text: 'You can list office space, retail, industrial units, warehouses, commercial investment property, development land, mixed-use schemes, and leisure and hospitality premises across England, Scotland, Wales and Northern Ireland.' } },
      { '@type': 'Question', name: 'Does CommercialUK.co.uk offer AI property valuations?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. CommercialUK.co.uk is the first commercial property portal in the UK and Europe to offer AI-powered commercial property appraisal, helping agents with data-driven valuations and pricing guidance.' } },
    ],
  };
  return { webPage, faqSchema };
}

// Styled sections
const HeroRoot = styled(Box)(({ theme }) => ({
  background: tokens.dark,
  position: 'relative',
  overflow: 'hidden',
  padding: '110px 24px 100px',
  textAlign: 'center',
  [theme.breakpoints.up('md')]: { paddingLeft: 48, paddingRight: 48 },
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    background: 'radial-gradient(ellipse 80% 55% at 50% 115%, rgba(242,197,20,0.2) 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 85% 5%, rgba(242,197,20,0.06) 0%, transparent 60%)',
  },
}));

const HeroGrid = styled(Box)(() => ({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  backgroundImage: 'linear-gradient(rgba(242,197,20,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(242,197,20,0.03) 1px, transparent 1px)',
  backgroundSize: '64px 64px',
}));

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <Typography component="span" sx={{ fontFamily: mono, fontSize: '0.66rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: tokens.goldDeep, marginBottom: 1.5, display: 'block' }}>
    {children}
  </Typography>
);

export default function ForCommercialAgentsPage() {
  const { webPage, faqSchema } = buildJsonLd();
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = refs.current.indexOf(e.target as HTMLElement);
            if (i >= 0) setRevealed((prev) => new Set(prev).add(i));
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const rv = (i: number) => ({
    ref: (el: HTMLElement | null) => { refs.current[i] = el; },
    sx: {
      opacity: revealed.has(i) ? 1 : 0,
      transform: revealed.has(i) ? 'none' : 'translateY(24px)',
      transition: 'opacity 0.65s ease, transform 0.65s ease',
    },
  });

  const benefits = [
    { icon: '🎯', title: 'Targeted Commercial Property Audience', desc: 'Reach serious occupiers, investors and developers looking for commercial spaces across the UK.' },
    { icon: '🗺️', title: 'Nationwide UK Exposure', desc: 'Your listings are visible across the UK to the right commercial audience, wherever they search.' },
    { icon: '🔍', title: 'SEO-Optimised Property Listings', desc: 'Quality listings that rank and attract more qualified enquiries through strategic search engine optimisation.' },
    { icon: '📩', title: 'Direct Enquiries from Buyers & Tenants', desc: 'Receive enquiries directly from interested parties for a faster, more efficient flow — no middlemen.' },
    { icon: '🏢', title: 'Enhanced Brand Visibility for Your Agency', desc: 'Strengthen your agency presence on a dedicated commercial property platform trusted across the industry.' },
    { icon: '💳', title: 'Flexible, Transparent Billing Packages', desc: 'Clear pricing and options so you use the platform with full confidence and no hidden fees.' },
  ];

  const propertyTypes = [
    { icon: '🏢', title: 'Office Space to Rent', desc: 'From city serviced offices to suburban office premises.' },
    { icon: '🏪', title: 'Retail Property to Let', desc: 'List high-street units and retail trade sites.' },
    { icon: '🏭', title: 'Industrial Units & Warehouses', desc: 'Target logistics and manufacturing occupiers.' },
    { icon: '📈', title: 'Commercial Investment Property', desc: 'Reach investors looking for long-term commercial returns.' },
    { icon: '🌱', title: 'Development Land', desc: 'Connect with developers and investors seeking opportunities.' },
    { icon: '🔑', title: 'Mixed-Use Schemes', desc: 'Showcase versatile assets with multiple income streams.' },
    { icon: '🍽️', title: 'Leisure & Hospitality Premises', desc: 'Hotels, restaurants, pubs, gyms and leisure assets.' },
    { icon: '⚡', title: 'And Many More', desc: 'Specialist commercial sectors across England, Scotland, Wales & Northern Ireland.' },
  ];

  const seoTags = [
    { term: 'Commercial Property for Sale UK', sub: 'High-intent keyword targeting' },
    { term: 'Commercial Property to Let', sub: 'Nationwide tenant reach' },
    { term: 'Office Space to Rent', sub: 'Local & regional ranking' },
    { term: 'Industrial Units to Let', sub: 'Logistics sector focus' },
    { term: 'Retail Units for Rent', sub: 'High-street visibility' },
    { term: 'Commercial Investment Property', sub: 'Investor attraction' },
  ];

  const aiList = [
    'RICS / data-driven valuation support grounded in real market data',
    'Stronger evidence for landlord and vendor discussions',
    'Enhanced credibility during appraisals and client presentations',
    'Competitive advantage when pitching for new instructions',
    'Insight into pricing strategy and market positioning',
  ];

  const winPillars = [
    { icon: '🏛️', title: 'A Dedicated Commercial Property Portal' },
    { icon: '🤖', title: 'Advanced AI Valuation Technology' },
    { icon: '📊', title: 'SEO-Driven Marketing' },
    { icon: '🎯', title: 'A Focused Commercial Audience' },
  ];

  const uploadItems = [
    { num: 1, title: 'Detailed Property Descriptions', desc: 'Comprehensive, SEO-rich descriptions that convert browsers into enquiries.', ico: '📝' },
    { num: 2, title: 'High-Resolution Images', desc: 'Professional imagery that showcases your properties in the best light.', ico: '📷' },
    { num: 3, title: 'Floorplans', desc: 'Accurate floor plans that help tenants and investors visualise the space.', ico: '📐' },
    { num: 4, title: 'EPC Certificates', desc: 'Upload energy performance certificates for full compliance and transparency.', ico: '📋' },
    { num: 5, title: 'Brochures (PDF)', desc: 'Professional brochures that position your properties as premium assets.', ico: '📄' },
    { num: 6, title: 'Assessment & Yield Information', desc: 'Investment data that speaks directly to buyers and institutional investors.', ico: '💹' },
  ];

  const packages = [
    { tag: 'Independent', title: 'Independent Commercial Agents', desc: 'Give your agency the tools with a listing package designed for sole traders and small teams entering the commercial market.', list: ['Unlimited property listings', 'SEO-optimised listing pages', 'Direct enquiry routing', 'AI appraisal access'], featured: false },
    { tag: 'Regional Firms', title: 'Regional Property Firms', desc: 'Help your agency grow with targeted commercial exposure and local market positioning designed for regional commercial specialists.', list: ['Priority search placement', 'Enhanced brand profile page', 'Analytics & reporting dashboard', 'Dedicated support manager'], featured: true },
    { tag: 'National', title: 'National Consultancies', desc: 'Package options tailored to your entire portfolio across all offices in coastal and regional areas with full national coverage.', list: ['Multi-office management', 'Custom branding options', 'Bulk upload tools', 'White-glove onboarding'], featured: false },
  ];

  const ctaBenefits = ['Increase commercial property enquiries', 'Improve online visibility', 'Win more landlord & vendor instructions', 'Leverage AI-powered appraisal technology'];

  return (
    <Page title="For Commercial Agents - List Commercial Property | CommercialUK.co.uk">
      <Head>
        <title>{META_TITLE}</title>
        <meta name="description" content={META_DESCRIPTION} />
        <link rel="canonical" href={CANONICAL_URL} />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="commercial agent, list commercial property UK, commercial property portal, commercial property for sale, commercial property to let, office space to rent, industrial units to let, AI property valuation, CommercialUK" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL} />
        <meta property="og:title" content={META_TITLE} />
        <meta property="og:description" content={META_DESCRIPTION} />
        <meta property="og:site_name" content="CommercialUK.co.uk" />
        <meta property="og:locale" content="en_GB" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={META_TITLE} />
        <meta name="twitter:description" content={META_DESCRIPTION} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      <Box component="main" sx={{ fontFamily: sans, background: tokens.white, color: tokens.dark, overflowX: 'hidden' }}>
        {/* Hero */}
        <Box component="header" role="banner">
          <HeroRoot>
            <HeroGrid />
            <Box {...rv(0)} sx={{ position: 'relative', zIndex: 1 }}>
              <Typography component="div" sx={{ fontFamily: mono, fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: tokens.gold, border: `1px solid rgba(242,197,20,0.3)`, padding: '6px 20px', display: 'inline-block', mb: 3.75, background: 'rgba(242,197,20,0.06)' }}>
                For Commercial Agents
              </Typography>
              <Typography component="h1" sx={{ fontFamily: titleFont, fontSize: { xs: '2.6rem', md: 'clamp(2.6rem, 5.5vw, 5rem)' }, fontWeight: 800, lineHeight: 1.05, color: tokens.white, mb: 2.75, letterSpacing: '-0.04em' }}>
                List Commercial Property on
                <br />
                <Box component="em" sx={{ color: tokens.gold, fontStyle: 'normal', fontWeight: 800 }}>CommercialUK</Box>
              </Typography>
              <Typography sx={{ maxWidth: 580, mx: 'auto', mb: 4, fontSize: '1rem', fontWeight: 400, lineHeight: 1.8, color: 'rgba(255,255,255,0.52)' }}>
                Welcome to CommercialUK — the UK&apos;s dedicated commercial property portal built exclusively for commercial real estate agents.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.75, justifyContent: 'center', flexWrap: 'wrap' }}>
                <NextLink href="/commercial-seller-property-marketing" passHref legacyBehavior>
                  <Box component="a" href="/commercial-seller-property-marketing" sx={{ background: tokens.gold, color: tokens.dark, fontFamily: sans, fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', py: 2, px: 4.75, textDecoration: 'none', display: 'inline-block', transition: 'background 0.2s, transform 0.15s, boxShadow 0.2s', '&:hover': { background: tokens.goldMuted, transform: 'translateY(-2px)', boxShadow: '0 10px 36px rgba(242,197,20,0.28)' } }}>
                    List Commercial Property
                  </Box>
                </NextLink>
                <NextLink href="/auth/register" passHref legacyBehavior>
                  <Box component="a" href="/auth/register" sx={{ background: 'transparent', color: tokens.white, fontFamily: sans, fontSize: '0.82rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', py: 1.875, px: 4.75, border: '1px solid rgba(255,255,255,0.22)', textDecoration: 'none', display: 'inline-block', transition: 'border-color 0.2s, color 0.2s, transform 0.15s', '&:hover': { borderColor: tokens.gold, color: tokens.gold, transform: 'translateY(-2px)' } }}>
                    Register as an Agent
                  </Box>
                </NextLink>
              </Box>
            </Box>
          </HeroRoot>
        </Box>

        {/* Intro band */}
        <Box {...rv(1)} sx={{ background: tokens.white, py: 10, px: { xs: 2, md: 6 } }}>
          <Box sx={{ maxWidth: 820, mx: 'auto', textAlign: 'center', fontSize: '1.08rem', fontWeight: 400, lineHeight: 1.85, color: tokens.grayWarm }}>
            If you are a commercial property agent looking to <strong style={{ color: tokens.dark }}>increase exposure</strong>, generate <strong style={{ color: tokens.dark }}>high-quality enquiries</strong>, and win more instructions, CommercialUK provides a focused, <strong style={{ color: tokens.dark }}>SEO-driven platform</strong> designed specifically for the UK commercial property market.
          </Box>
        </Box>

        {/* Why List */}
        <Box sx={{ background: tokens.offWhite, py: 12.5, px: { xs: 2, md: 6 } }}>
          <Box sx={{ maxWidth: 1160, mx: 'auto' }}>
            <Box {...rv(2)} sx={{ textAlign: 'center', mb: 6 }}>
              <SectionLabel>The Platform Advantage</SectionLabel>
              <Typography component="h2" sx={{ fontFamily: titleFont, fontSize: { xs: '1.9rem', md: '2.9rem' }, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em', color: tokens.dark }}>
                Why List With <Box component="span" sx={{ color: tokens.goldDeep, fontWeight: 800 }}>CommercialUK</Box>?
              </Typography>
              <Box sx={{ width: 44, height: 3, background: tokens.gold, mx: 'auto', mt: 2.25 }} />
              <Typography sx={{ fontSize: '0.95rem', lineHeight: 1.75, color: tokens.grayWarm, maxWidth: 560, mx: 'auto', mt: 1.5 }}>
                CommercialUK specialises purely in commercial property for sale and to let in the UK. That means your listings are seen by serious occupiers, investors, developers, and business owners — not residential browsers.
              </Typography>
            </Box>
            <Typography {...rv(3)} sx={{ textAlign: 'center', mb: 5, fontFamily: mono, fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: tokens.grayWarm, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Box component="span" sx={{ flex: 1, maxWidth: 120, height: 1, background: tokens.grayLight }} />
              Key Benefits for Commercial Agents
              <Box component="span" sx={{ flex: 1, maxWidth: 120, height: 1, background: tokens.grayLight }} />
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: '2px', background: tokens.grayLight }}>
              {benefits.map((b, i) => (
                <Box
                  key={i}
                  {...rv(4 + i)}
                  sx={{
                    background: tokens.white,
                    p: 5,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'background 0.25s',
                    '&:hover': { background: tokens.goldPale },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: tokens.gold,
                      transform: 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.3s',
                    },
                    '&:hover::after': { transform: 'scaleX(1)' },
                  }}
                >
                  <Box sx={{ width: 46, height: 46, background: tokens.goldPale, border: `1px solid rgba(242,197,20,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2.25, fontSize: '1.25rem' }}>{b.icon}</Box>
                  <Typography component="h4" sx={{ fontSize: '0.92rem', fontWeight: 600, color: tokens.dark, mb: 1 }}>{b.title}</Typography>
                  <Typography sx={{ fontSize: '0.83rem', fontWeight: 300, lineHeight: 1.7, color: tokens.grayWarm }}>{b.desc}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Property Types */}
        <Box sx={{ background: tokens.dark, py: 12.5, px: { xs: 2, md: 6 } }}>
          <Box sx={{ maxWidth: 1160, mx: 'auto' }}>
            <Box {...rv(10)} sx={{ textAlign: 'center', mb: 6.5 }}>
              <SectionLabel>Full Coverage</SectionLabel>
              <Typography component="h2" sx={{ fontFamily: titleFont, fontSize: { xs: '1.9rem', md: '2.9rem' }, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em', color: tokens.white }}>
                Market All Commercial <Box component="span" sx={{ color: tokens.gold, fontWeight: 800 }}>Property Types</Box>
              </Typography>
              <Box sx={{ width: 44, height: 3, background: tokens.gold, mx: 'auto', mt: 2.25 }} />
              <Typography sx={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.42)', mx: 'auto', mt: 1.5 }}>
                Our portal supports every major commercial property sector, including:
              </Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: '1px', background: 'rgba(242,197,20,0.08)', border: '1px solid rgba(242,197,20,0.08)', mb: 5 }}>
              {propertyTypes.map((t, i) => (
                <Box key={i} {...rv(11 + i)} sx={{ background: tokens.darkMid, p: 3.75, display: 'flex', alignItems: 'flex-start', gap: 1.75, '&:hover': { background: 'rgba(242,197,20,0.05)' } }}>
                  <Box sx={{ fontSize: '1.4rem', flexShrink: 0 }}>{t.icon}</Box>
                  <Box>
                    <Typography component="h4" sx={{ fontSize: '0.88rem', fontWeight: 600, color: tokens.white, mb: 0.5 }}>{t.title}</Typography>
                    <Typography sx={{ fontSize: '0.77rem', fontWeight: 300, color: 'rgba(255,255,255,0.4)', lineHeight: 1.55 }}>{t.desc}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Typography {...rv(19)} sx={{ textAlign: 'center', fontStyle: 'italic', fontWeight: 300, fontSize: '0.9rem', color: 'rgba(255,255,255,0.35)' }}>
              Whether you operate locally or nationally, CommercialUK helps you promote commercial property across England, Scotland, Wales, and Northern Ireland.
            </Typography>
          </Box>
        </Box>

        {/* SEO */}
        <Box sx={{ py: 12.5, px: { xs: 2, md: 6 }, background: tokens.white }}>
          <Box sx={{ maxWidth: 1160, mx: 'auto', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 4, md: 10 }, alignItems: 'center' }}>
            <Box {...rv(20)}>
              <SectionLabel>Search Dominance</SectionLabel>
              <Typography component="h2" sx={{ fontFamily: titleFont, fontSize: { xs: '1.9rem', md: '2.9rem' }, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em', color: tokens.dark }}>
                SEO-Optimised Commercial
                <br />
                Property <Box component="span" sx={{ color: tokens.goldDeep, fontWeight: 800 }}>Listings</Box>
              </Typography>
              <Box sx={{ width: 44, height: 3, background: tokens.gold, mt: 2.25 }} />
              <Typography sx={{ fontSize: '0.95rem', lineHeight: 1.75, color: tokens.grayWarm, maxWidth: 420, mt: 2 }}>
                Each listing on CommercialUK is structured to rank more effectively for high-value search terms, including:
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25, mt: 4 }}>
                {seoTags.map((tag, i) => (
                  <Box key={i} sx={{ background: tokens.offWhite, borderLeft: `3px solid ${tokens.gold}`, p: 1.625, fontSize: '0.8rem', fontWeight: 500, color: tokens.dark, '&:hover': { background: tokens.goldPale } }}>
                    {tag.term}
                    <Box component="span" sx={{ display: 'block', fontSize: '0.71rem', fontWeight: 300, color: tokens.grayWarm, mt: 0.5 }}>{tag.sub}</Box>
                  </Box>
                ))}
              </Box>
              <Typography sx={{ mt: 3, fontStyle: 'italic', fontSize: '0.875rem', color: tokens.grayWarm, lineHeight: 1.7, fontWeight: 300 }}>
                Our platform is built with search engine optimisation (SEO) at its core, helping your properties gain stronger online visibility and attract more qualified enquiries.
              </Typography>
            </Box>
            <Box {...rv(21)} sx={{ position: 'relative' }}>
              <Box sx={{ width: '100%', aspectRatio: '4/3', background: 'linear-gradient(135deg, #0f0e0a 0%, #231f10 100%)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', '&::before': { content: '""', position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 25% 65%, rgba(242,197,20,0.14) 0%, transparent 70%)' } }}>
                <Box sx={{ width: '68%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(242,197,20,0.18)', p: 2.75, position: 'relative', zIndex: 1 }}>
                  <Box sx={{ height: 7, background: tokens.gold, width: '45%', mb: 1.5, borderRadius: 1 }} />
                  <Box sx={{ height: 4, background: 'rgba(255,255,255,0.07)', width: '80%', mb: 1, borderRadius: 1 }} />
                  <Box sx={{ height: 4, background: 'rgba(255,255,255,0.07)', width: '65%', mb: 1, borderRadius: 1 }} />
                  <Box sx={{ height: 4, background: 'rgba(255,255,255,0.07)', width: '50%', mb: 1.75, borderRadius: 1 }} />
                  <Box sx={{ height: 4, background: 'rgba(255,255,255,0.07)', width: '75%', mb: 1, borderRadius: 1 }} />
                  <Box sx={{ height: 4, background: 'rgba(255,255,255,0.07)', width: '55%', mb: 1, borderRadius: 1 }} />
                  <Box sx={{ height: 4, background: 'rgba(242,197,20,0.3)', width: '45%', borderRadius: 1 }} />
                </Box>
                <Box sx={{ position: 'absolute', bottom: -18, left: -18, background: tokens.gold, color: tokens.dark, p: 2, zIndex: 2, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  <Box component="span" sx={{ display: 'block', fontFamily: titleFont, fontSize: '2.2rem', fontWeight: 800, lineHeight: 1, mb: 0.25, letterSpacing: '-0.04em' }}>#1</Box>
                  SEO-Driven
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* AI */}
        <Box sx={{ background: tokens.offWhite, py: 12.5, px: { xs: 2, md: 6 }, position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', right: -60, top: '50%', transform: 'translateY(-50%)', fontFamily: titleFont, fontSize: '22rem', fontWeight: 700, color: 'rgba(242,197,20,0.04)', pointerEvents: 'none', lineHeight: 1 }}>AI</Box>
          <Box sx={{ maxWidth: 1160, mx: 'auto', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 4, md: 10 }, alignItems: 'center', position: 'relative', zIndex: 1 }}>
            <Box sx={{ order: { xs: 0, md: -1 } }} {...rv(22)}>
              <Box sx={{ width: '100%', aspectRatio: '4/3', background: 'linear-gradient(145deg, #1a1710 0%, #0f0e0a 100%)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', '&::before': { content: '""', position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 70% 35%, rgba(242,197,20,0.11) 0%, transparent 65%)' } }}>
                <Box sx={{ width: '70%', background: 'rgba(242,197,20,0.05)', border: '1px solid rgba(242,197,20,0.18)', p: 2.5, position: 'relative', zIndex: 1 }}>
                  <Box sx={{ height: 6, background: tokens.gold, width: '40%', mb: 1.5, borderRadius: 1 }} />
                  <Box sx={{ height: 4, background: 'rgba(255,255,255,0.07)', width: '80%', mb: 1, borderRadius: 1 }} />
                  <Box sx={{ height: 4, background: 'rgba(255,255,255,0.07)', width: '62%', mb: 1, borderRadius: 1 }} />
                  <Box sx={{ height: 4, background: 'rgba(255,255,255,0.07)', width: '48%', mb: 1.75, borderRadius: 1 }} />
                  <Box sx={{ height: 4, background: 'rgba(255,255,255,0.07)', width: '75%', mb: 1, borderRadius: 1 }} />
                  <Box sx={{ height: 4, background: 'rgba(255,255,255,0.07)', width: '55%', mb: 1.5, borderRadius: 1 }} />
                  <Box sx={{ height: 5, width: '50%', background: 'rgba(242,197,20,0.45)', borderRadius: 1 }} />
                </Box>
                <Box sx={{ position: 'absolute', top: -16, right: -16, width: 76, height: 76, background: tokens.gold, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2, textAlign: 'center' }}>
                  <Box sx={{ fontSize: '1.3rem' }}>🤖</Box>
                  <Box sx={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: tokens.dark, lineHeight: 1.2 }}>AI<br />Powered</Box>
                </Box>
              </Box>
            </Box>
            <Box {...rv(23)}>
              <SectionLabel>Proprietary Technology</SectionLabel>
              <Typography component="h2" sx={{ fontFamily: titleFont, fontSize: { xs: '1.9rem', md: '2.9rem' }, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em', color: tokens.dark }}>
                UK & Europe&apos;s First
                <br />
                <Box component="span" sx={{ color: tokens.goldDeep, fontWeight: 800 }}>AI-Powered</Box> Appraisal
              </Typography>
              <Box sx={{ width: 44, height: 3, background: tokens.gold, mt: 2.25 }} />
              <Typography sx={{ fontSize: '0.95rem', lineHeight: 1.75, color: tokens.grayWarm, maxWidth: 440, mt: 2 }}>
                CommercialUK is proud to be the first commercial property portal in the UK and Europe to introduce AI-powered commercial property appraisal technology.
              </Typography>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.11em', textTransform: 'uppercase', color: tokens.dark, mt: 3.5, mb: 1.25 }}>What This Means for Commercial Agents</Typography>
              <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                {aiList.map((item, i) => (
                  <Box key={i} component="li" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, fontSize: '0.875rem', fontWeight: 300, color: tokens.grayWarm, lineHeight: 1.6, '&::before': { content: '"→"', color: tokens.goldDeep, fontWeight: 700, flexShrink: 0 } }}>
                    {item}
                  </Box>
                ))}
              </Box>
              <Typography sx={{ mt: 2.5, fontStyle: 'italic', fontSize: '0.875rem', color: tokens.grayWarm, lineHeight: 1.7, fontWeight: 300 }}>
                Our AI-powered appraisal tool helps agents combine professional expertise with advanced data intelligence — giving you a powerful edge in today&apos;s competitive commercial property market.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <NextLink href="/AICalculator" passHref legacyBehavior>
                  <Box component="a" href="/AICalculator" sx={{ color: tokens.gold, fontWeight: 600, fontSize: '0.9rem', '&:hover': { color: tokens.goldDeep } }}>
                    Try the AI Property Appraisal tool →
                  </Box>
                </NextLink>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Win More */}
        <Box sx={{ background: tokens.gold, py: 11.25, px: { xs: 2, md: 6 }, position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px,transparent 1px), linear-gradient(90deg,rgba(0,0,0,0.04) 1px,transparent 1px)', backgroundSize: '42px 42px' }} />
          <Box sx={{ maxWidth: 1160, mx: 'auto', position: 'relative', zIndex: 1 }}>
            <Box {...rv(24)} sx={{ textAlign: 'center', mb: 6.5 }}>
              <SectionLabel>Your Competitive Edge</SectionLabel>
              <Typography component="h2" sx={{ fontFamily: titleFont, fontSize: { xs: '1.9rem', md: '2.9rem' }, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em', color: tokens.dark }}>
                Win More Instructions
              </Typography>
              <Box sx={{ width: 44, height: 3, background: 'rgba(0,0,0,0.2)', mx: 'auto', mt: 2.25 }} />
              <Typography sx={{ fontSize: '0.95rem', color: 'rgba(0,0,0,0.6)', maxWidth: 600, mx: 'auto', mt: 1.5 }}>
                Landlords and vendors expect maximum exposure and modern marketing. By listing on CommercialUK, you demonstrate that you are using:
              </Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 1.75 }}>
              {winPillars.map((p, i) => (
                <Box key={i} {...rv(25 + i)} sx={{ background: tokens.dark, p: 4.25, textAlign: 'center', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                  <Box sx={{ fontSize: '1.75rem', mb: 1.5, display: 'block' }}>{p.icon}</Box>
                  <Typography component="h4" sx={{ fontSize: '0.84rem', fontWeight: 600, color: tokens.white, lineHeight: 1.45 }}>{p.title}</Typography>
                </Box>
              ))}
            </Box>
            <Typography {...rv(29)} sx={{ textAlign: 'center', mt: 4.75, fontStyle: 'italic', fontSize: '0.98rem', fontWeight: 300, color: 'rgba(0,0,0,0.55)' }}>
              This strengthens your position during valuations and helps differentiate your agency from competitors.
            </Typography>
          </Box>
        </Box>

        {/* Designed for */}
        <Box sx={{ background: tokens.white, py: 12.5, px: { xs: 2, md: 6 } }}>
          <Box sx={{ maxWidth: 1160, mx: 'auto', textAlign: 'center' }}>
            <Box {...rv(30)}>
              <SectionLabel>Professional-Grade Tools</SectionLabel>
              <Typography component="h2" sx={{ fontFamily: titleFont, fontSize: { xs: '1.9rem', md: '2.9rem' }, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em', color: tokens.dark }}>
                Designed for Commercial Real Estate <Box component="span" sx={{ color: tokens.goldDeep, fontWeight: 800 }}>Professionals</Box>
              </Typography>
              <Box sx={{ width: 44, height: 3, background: tokens.gold, mx: 'auto', mt: 2.25 }} />
              <Typography sx={{ fontSize: '0.95rem', color: tokens.grayWarm, mt: 1.5 }}>Our system allows you to upload:</Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: '2px', background: tokens.grayLight, mt: 6.5, border: `2px solid ${tokens.grayLight}` }}>
              {uploadItems.map((u, i) => (
                <Box key={i} {...rv(31 + i)} sx={{ background: tokens.white, p: 4.75, display: 'flex', alignItems: 'flex-start', gap: 2.25, '&:hover': { background: tokens.goldPale } }}>
                  <Box sx={{ fontFamily: titleFont, fontSize: '2.2rem', fontWeight: 800, color: tokens.gold, lineHeight: 1, flexShrink: 0, minWidth: 46, letterSpacing: '-0.04em' }}>{u.num}</Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography component="h4" sx={{ fontSize: '0.9rem', fontWeight: 600, color: tokens.dark, mb: 0.5 }}>{u.title}</Typography>
                    <Typography sx={{ fontSize: '0.81rem', fontWeight: 300, color: tokens.grayWarm, lineHeight: 1.65 }}>{u.desc}</Typography>
                  </Box>
                  <Box sx={{ fontSize: '1.2rem', opacity: 0.35, flexShrink: 0, alignSelf: 'center' }}>{u.ico}</Box>
                </Box>
              ))}
            </Box>
            <Typography {...rv(37)} sx={{ mt: 5.5, fontStyle: 'italic', fontSize: '0.9rem', color: tokens.grayWarm, fontWeight: 300 }}>
              We make it simple to showcase commercial assets professionally to serious buyers, tenants, and investors.
            </Typography>
          </Box>
        </Box>

        {/* Packages */}
        <Box sx={{ background: tokens.darkMid, py: 12.5, px: { xs: 2, md: 6 } }}>
          <Box sx={{ maxWidth: 1160, mx: 'auto' }}>
            <Box {...rv(38)} sx={{ textAlign: 'center', mb: 6.5 }}>
              <SectionLabel>Tailored Solutions</SectionLabel>
              <Typography component="h2" sx={{ fontFamily: titleFont, fontSize: { xs: '1.9rem', md: '2.9rem' }, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em', color: tokens.white }}>
                Flexible Packages for Commercial
                <br />
                Property <Box component="span" sx={{ color: tokens.gold, fontWeight: 800 }}>Agents</Box>
              </Typography>
              <Box sx={{ width: 44, height: 3, background: tokens.gold, mx: 'auto', mt: 2.25 }} />
              <Typography sx={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.38)', mt: 1.5 }}>
                CommercialUK offers straightforward packages suitable for:
              </Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: '2px', background: 'rgba(242,197,20,0.07)', border: '1px solid rgba(242,197,20,0.07)' }}>
              {packages.map((pkg, i) => (
                <Box
                  key={i}
                  {...rv(39 + i)}
                  sx={{
                    background: pkg.featured ? 'rgba(242,197,20,0.07)' : tokens.dark,
                    borderTop: pkg.featured ? `3px solid ${tokens.gold}` : 'none',
                    p: 5.5,
                    transition: 'background 0.25s',
                    '&:hover': { background: 'rgba(242,197,20,0.04)' },
                  }}
                >
                  <Typography component="span" sx={{ fontFamily: mono, fontSize: '0.64rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: tokens.gold, mb: 2.25, display: 'block' }}>{pkg.tag}</Typography>
                  <Typography component="h3" sx={{ fontFamily: titleFont, fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.02em', color: tokens.white, mb: 1.25 }}>{pkg.title}</Typography>
                  <Typography sx={{ fontSize: '0.84rem', fontWeight: 300, lineHeight: 1.7, color: 'rgba(255,255,255,0.4)', pb: 2.75, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{pkg.desc}</Typography>
                  <Box component="ul" sx={{ listStyle: 'none', m: 0, mt: 2.75, p: 0, display: 'flex', flexDirection: 'column', gap: 1.125 }}>
                    {pkg.list.map((item, j) => (
                      <Box key={j} component="li" sx={{ display: 'flex', gap: 1.25, fontSize: '0.81rem', fontWeight: 300, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, '&::before': { content: '"✓"', color: tokens.gold, fontWeight: 700, flexShrink: 0 } }}>
                        {item}
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
            <Typography {...rv(42)} sx={{ textAlign: 'center', mt: 4, fontStyle: 'italic', fontSize: '0.875rem', color: 'rgba(255,255,255,0.25)', fontWeight: 300 }}>
              No residential crossover. No unnecessary add-ons. Just focused commercial property marketing.
            </Typography>
          </Box>
        </Box>

        {/* CTA Final */}
        <Box sx={{ background: tokens.dark, py: 13.75, px: { xs: 2, md: 6 }, position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
          <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 75% at 50% 100%, rgba(242,197,20,0.14) 0%, transparent 65%)' }} />
          <Box sx={{ maxWidth: 800, mx: 'auto', position: 'relative', zIndex: 1 }}>
            <Typography {...rv(43)} component="span" sx={{ fontFamily: mono, fontSize: '0.66rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: tokens.gold, mb: 2.5, display: 'block' }}>
              Join CommercialUK Today
            </Typography>
            <Typography {...rv(44)} component="h2" sx={{ fontFamily: titleFont, fontSize: { xs: '2rem', md: '3.4rem' }, fontWeight: 800, letterSpacing: '-0.035em', color: tokens.white, lineHeight: 1.08, mb: 2.5 }}>
              CommercialUK is your dedicated
              <br />
              commercial property <Box component="span" sx={{ color: tokens.gold, fontWeight: 800 }}>portal</Box>
            </Typography>
            <Typography {...rv(45)} sx={{ fontSize: '0.98rem', fontWeight: 300, lineHeight: 1.8, color: 'rgba(255,255,255,0.45)', mb: 6 }}>
              If you are a UK commercial real estate agent, list your commercial property on CommercialUK today. Use your clients&apos; commercial property on CommercialUK to grow your portfolio across the UK.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.75, mb: 6, textAlign: 'left' }}>
              {ctaBenefits.map((item, i) => (
                <Box key={i} {...rv(46 + i)} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', p: 2, fontSize: '0.84rem', fontWeight: 400, color: 'rgba(255,255,255,0.65)' }}>
                  <Box sx={{ width: 7, height: 7, background: tokens.gold, flexShrink: 0 }} />
                  {item}
                </Box>
              ))}
            </Box>
            <Box {...rv(50)} sx={{ display: 'flex', gap: 1.75, justifyContent: 'center', flexWrap: 'wrap' }}>
              <NextLink href="/commercial-seller-property-marketing" passHref legacyBehavior>
                <Box component="a" href="/commercial-seller-property-marketing" sx={{ background: tokens.gold, color: tokens.dark, fontFamily: sans, fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', py: 2, px: 4.75, textDecoration: 'none', display: 'inline-block', transition: 'background 0.2s, transform 0.15s', '&:hover': { background: tokens.goldMuted, transform: 'translateY(-2px)', boxShadow: '0 10px 36px rgba(242,197,20,0.28)' } }}>
                  List Commercial Property
                </Box>
              </NextLink>
              <NextLink href="/auth/register" passHref legacyBehavior>
                <Box component="a" href="/auth/register" sx={{ background: 'transparent', color: tokens.white, fontFamily: sans, fontSize: '0.82rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', py: 1.875, px: 4.75, border: '1px solid rgba(255,255,255,0.22)', textDecoration: 'none', display: 'inline-block', transition: 'border-color 0.2s, color 0.2s, transform 0.15s', '&:hover': { borderColor: tokens.gold, color: tokens.gold, transform: 'translateY(-2px)' } }}>
                  Register as an Agent
                </Box>
              </NextLink>
            </Box>
            <Typography {...rv(51)} sx={{ mt: 5.5, fontSize: '0.875rem', fontStyle: 'italic', fontWeight: 300, color: 'rgba(255,255,255,0.25)' }}>
              CommercialUK — The UK&apos;s Dedicated Portal for Agents. By Agents. Exclusively Commercial.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Page>
  );
}

ForCommercialAgentsPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
