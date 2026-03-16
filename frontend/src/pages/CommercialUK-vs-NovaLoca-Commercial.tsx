import React from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MainLayout from '../layouts/Main/MainLayout';
import Page from '../components/Page';

// SEO – static metadata (no client-side dependency)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.commercialuk.co.uk';
const PAGE_PATH = '/CommercialUK-vs-NovaLoca-Commercial';
const CANONICAL_URL = `${SITE_URL}${PAGE_PATH}`;

export const METADATA = {
  title: 'CommercialUK vs NovaLoca Commercial | Compare UK Portals',
  description:
    'Compare CommercialUK with NovaLoca. £25 PCM, 3 free valuations, zero commission, full listing control. UK-focused commercial property for landlords and sellers.',
  keywords: [
    'commercial property portal UK',
    'CommercialUK vs NovaLoca',
    'NovaLoca commercial',
    'UK commercial property listing',
    'commercial property comparison',
    'office space UK',
    'commercial real estate portal',
  ],
  openGraph: {
    type: 'website',
    url: CANONICAL_URL,
    title: 'CommercialUK vs NovaLoca Commercial | Compare UK Portals',
    description:
      'Compare CommercialUK with NovaLoca. £25 PCM, 3 free valuations, zero commission, full listing control. UK-focused commercial property for landlords and sellers.',
    siteName: 'CommercialUK',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CommercialUK vs NovaLoca Commercial | Compare UK Portals',
    description:
      'Compare CommercialUK with NovaLoca. £25 PCM, 3 free valuations, zero commission, full listing control.',
  },
  robots: 'index, follow',
  canonical: CANONICAL_URL,
};

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: METADATA.title,
  description: METADATA.description,
  url: CANONICAL_URL,
  datePublished: '2025-01-01',
  publisher: { '@type': 'Organization', name: 'CommercialUK', url: SITE_URL },
  mainEntityOfPage: { '@type': 'WebPage', '@id': CANONICAL_URL },
  keywords: METADATA.keywords.join(', '),
};

const colors = {
  yellow: '#f2c514',
  yellowDark: '#d4ab0f',
  yellowPale: '#fef9e0',
  black: '#0a0a0a',
  gray700: '#3a3a3f',
  gray500: '#6b6b72',
  gray300: '#c8c8d0',
  gray100: '#f4f4f6',
  white: '#ffffff',
  border: '#e8e8ec',
  green: '#1a9e5f',
  red: '#cc3b3b',
};

const HeroRoot = styled(Box)(({ theme }) => ({
  background: colors.black,
  position: 'relative',
  overflow: 'hidden',
  paddingTop: 0,
  [theme.breakpoints.down('sm')]: { paddingTop: 0 },
}));

const HeroInner = styled(Box)(({ theme }) => ({
  padding: '100px 24px 96px',
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.up('md')]: { paddingLeft: 60, paddingRight: 60 },
}));

const HeroGridOverlay = styled(Box)(() => ({
  position: 'absolute',
  inset: 0,
  backgroundImage: `
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
  `,
  backgroundSize: '48px 48px',
  pointerEvents: 'none',
}));

const HeroBar = styled(Box)(() => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  height: 5,
  background: colors.yellow,
}));

const PageBody = styled(Box)(({ theme }) => ({
  padding: '0 24px 120px',
  [theme.breakpoints.up('md')]: { paddingLeft: 60, paddingRight: 60 },
}));

const SectionBlock = styled(Box)(() => ({
  paddingTop: 88,
  margin: 16,
}));

// Table: plain text only (no colored pills in rows)
function CellPill({ type, children }: { type: 'yes' | 'no' | 'warn' | null; children: React.ReactNode }) {
  return <>{children}</>;
}

const novaLocaRows: Array<{
  feature: string;
  cuLabel: string;
  cuPill: 'yes' | 'no' | 'warn' | null;
  otherLabel: string;
  otherPill: 'yes' | 'no' | 'warn' | null;
}> = [
  { feature: 'Monthly Listing Fee', cuLabel: '£25 PCM (discounted) – simple, transparent pricing', cuPill: null, otherLabel: 'Listing options start around £75 (+VAT) for 6 months or £130 (+VAT) for 12 months for individual listings (agent pricing)', otherPill: 'no' },
  { feature: 'Free Valuations Included', cuLabel: '3 free commercial property valuations', cuPill: 'yes', otherLabel: 'Not included', otherPill: 'no' },
  { feature: 'Commission', cuLabel: 'Zero', cuPill: 'yes', otherLabel: 'Not directly — typically sold via agents (portal is agent-facing)', otherPill: 'no' },
  { feature: 'Listing Control', cuLabel: 'Full control for individual landlords and sellers', cuPill: 'yes', otherLabel: 'Listings typically managed by agents on behalf of clients', otherPill: 'no' },
  { feature: 'Direct Enquiries to You', cuLabel: 'Yes', cuPill: 'yes', otherLabel: 'Yes (but enquiries often routed via agent)', otherPill: 'warn' },
  { feature: 'UK Market Focus', cuLabel: 'Entirely UK-focused with landlord/seller control', cuPill: 'yes', otherLabel: 'Focused on UK commercial property listings', otherPill: 'yes' },
  { feature: 'Exposure & Reach', cuLabel: 'Targeted audience of UK buyers and tenants', cuPill: null, otherLabel: 'Large existing commercial property database used by occupiers and agents', otherPill: null },
  { feature: 'User Experience', cuLabel: 'Clean, straightforward listing process', cuPill: null, otherLabel: 'Longer-established portal with advanced search features', otherPill: null },
  { feature: 'GDPR & Compliance', cuLabel: 'Fully GDPR compliant', cuPill: 'yes', otherLabel: 'UK GDPR compliant', otherPill: 'yes' },
];

export default function CommercialUKVsNovaLocaPage() {
  return (
    <Page title={METADATA.title}>
      <Head>
        <title>{METADATA.title}</title>
        <meta name="description" content={METADATA.description} />
        <meta name="keywords" content={METADATA.keywords.join(', ')} />
        <link rel="canonical" href={METADATA.canonical} />
        <meta name="robots" content={METADATA.robots} />
        <meta property="og:type" content={METADATA.openGraph.type} />
        <meta property="og:url" content={METADATA.openGraph.url} />
        <meta property="og:title" content={METADATA.openGraph.title} />
        <meta property="og:description" content={METADATA.openGraph.description} />
        <meta property="og:site_name" content={METADATA.openGraph.siteName} />
        <meta name="twitter:card" content={METADATA.twitter.card} />
        <meta name="twitter:title" content={METADATA.twitter.title} />
        <meta name="twitter:description" content={METADATA.twitter.description} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Manrope:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <header role="banner">
        <HeroRoot>
          <HeroGridOverlay />
          <HeroInner>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                background: colors.yellow,
                color: colors.black,
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                px: 1.75,
                py: 0.75,
                borderRadius: '3px',
                mb: 4.5,
              }}
            >
              Platform Comparison
            </Box>
            <Typography
              component="h1"
              sx={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 800,
                fontSize: { xs: '2.25rem', sm: 'clamp(38px, 6vw, 72px)' },
                lineHeight: 1.04,
                letterSpacing: '-0.03em',
                color: colors.white,
                maxWidth: 820,
                mb: 3.5,
                mx: 'auto',
              }}
            >
              <Box component="span" sx={{ color: colors.yellow }}>CommercialUK</Box> vs{' '}
              NovaLoca
              <br />
              Commercial
            </Typography>
            <Typography
              component="p"
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontSize: { xs: 17, sm: 19 },
                fontWeight: 400,
                color: 'rgba(255,255,255,0.7)',
                maxWidth: 580,
                lineHeight: 1.7,
                mx: 'auto',
              }}
            >
              Compare UK commercial property platforms. See how CommercialUK offers lower-cost listing, full landlord control, and free valuations versus NovaLoca.
            </Typography>
          </HeroInner>
          <HeroBar />
        </HeroRoot>
      </header>

      <main id="main-content" style={{ fontFamily: '"Manrope", sans-serif' }}>
        <PageBody>
          <Container maxWidth="lg">
            <section aria-labelledby="page-intro">
              <Typography
                id="page-intro"
                component="p"
                sx={{
                  fontSize: { xs: 17, md: 18 },
                  lineHeight: 1.75,
                  color: colors.gray700,
                  maxWidth: 720,
                  mx: 'auto',
                  mt: 4,
                  textAlign: 'center',
                }}
              >
                Choosing the right commercial property portal in the UK can save you time and money. Below we compare{' '}
                <NextLink href="/" passHref legacyBehavior>
                  <Box component="a" sx={{ color: 'inherit', textDecoration: 'underline', fontWeight: 600 }}>
                    CommercialUK
                  </Box>
                </NextLink>
                {' '}with NovaLoca Commercial on pricing, features, UK market focus, and compliance so you can decide which platform fits your commercial listings best.
              </Typography>
            </section>
            <section aria-labelledby="comparison-novaloca">
            <SectionBlock>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ width: 28, height: 3, background: colors.yellow, borderRadius: '2px', flexShrink: 0 }} />
                <Typography sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: colors.gray500 }}>
                  Comparison 01
                </Typography>
              </Box>
              <Typography
                id="comparison-novaloca"
                component="h2"
                sx={{
                  fontFamily: '"Montserrat", sans-serif',
                  fontWeight: 800,
                  fontSize: { xs: '1.6rem', md: '2.6rem' },
                  letterSpacing: '-0.025em',
                  lineHeight: 1.1,
                  color: colors.black,
                  mb: 5,
                }}
              >
                CommercialUK vs <Box component="span" sx={{ color: colors.yellowDark }}>NovaLoca</Box>
              </Typography>

              <TableContainer
                sx={{
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: `1px solid ${colors.border}`,
                  mb: 9,
                  margin: 2,
                  boxShadow: '0 2px 24px rgba(0,0,0,0.05)',
                }}
              >
                <Table sx={{ tableLayout: 'fixed', width: '100%' }} aria-label="CommercialUK vs NovaLoca comparison">
                  <TableHead>
                    <TableRow sx={{ background: colors.gray100 }}>
                      <TableCell
                        sx={{
                          py: 2.5,
                          px: 3,
                          fontFamily: '"Montserrat", sans-serif',
                          fontWeight: 700,
                          fontSize: 14,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: colors.black,
                          width: '34%',
                        }}
                      >
                        Feature
                      </TableCell>
                      <TableCell
                        sx={{
                          py: 2.5,
                          px: 3,
                          width: '33%',
                          fontFamily: '"Montserrat", sans-serif',
                          fontWeight: 700,
                          fontSize: 14,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: colors.black,
                        }}
                      >
                        CommercialUK
                      </TableCell>
                      <TableCell
                        sx={{
                          py: 2.5,
                          px: 3,
                          width: '33%',
                          fontFamily: '"Montserrat", sans-serif',
                          fontWeight: 700,
                          fontSize: 14,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: colors.black,
                        }}
                      >
                        NovaLoca
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {novaLocaRows.map((row, i) => (
                      <TableRow
                        key={i}
                        sx={{
                          borderBottom: `1px solid ${colors.border}`,
                          '&:last-child': { borderBottom: 'none' },
                        }}
                      >
                        <TableCell sx={{ py: 2.25, px: 3, fontWeight: 500, color: colors.black, fontSize: 16 }}>
                          {row.feature}
                        </TableCell>
                        <TableCell sx={{ py: 2.25, px: 3, fontWeight: 600, color: colors.black, fontSize: 16 }}>
                          <CellPill type={row.cuPill}>{row.cuLabel}</CellPill>
                        </TableCell>
                        <TableCell sx={{ py: 2.25, px: 3, color: colors.black, fontSize: 16 }}>
                          <CellPill type={row.otherPill}>{row.otherLabel}</CellPill>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </SectionBlock>
            </section>

            <section aria-labelledby="what-novaloca">
            <SectionBlock>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ width: 28, height: 3, background: colors.yellow, borderRadius: '2px', flexShrink: 0 }} />
                <Typography id="what-novaloca" sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: colors.gray500 }}>
                  What NovaLoca Is
                </Typography>
              </Box>
              <Box
                sx={{
                  borderRadius: '10px',
                  border: `1px solid ${colors.border}`,
                  background: colors.gray100,
                  p: 4,
                  margin: 2,
                }}
              >
                <Typography sx={{ fontSize: 16, color: colors.gray700, lineHeight: 1.7, mb: 2 }}>
                  NovaLoca is one of the UK&apos;s longest-standing commercial property listing services, advertising thousands of properties across offices, industrial units, retail, and other commercial types. It&apos;s designed for agents, landlords, developers and occupiers, and has been operating since 2007 with a large database and substantial search traffic.
                </Typography>
                <Typography sx={{ fontSize: 16, color: colors.gray700, lineHeight: 1.7 }}>
                  They offer flexible listing options — individual listings or subscription packages — with a comprehensive suite of tools including images, maps, attachments, email alerts, reporting dashboards and more.
                </Typography>
              </Box>
            </SectionBlock>
            </section>

            <section aria-labelledby="key-differences">
            <SectionBlock>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ width: 28, height: 3, background: colors.yellow, borderRadius: '2px', flexShrink: 0 }} />
                <Typography sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: colors.gray500 }}>
                  Key Differences
                </Typography>
              </Box>
              <Typography
                id="key-differences"
                component="h2"
                sx={{
                  fontFamily: '"Montserrat", sans-serif',
                  fontWeight: 800,
                  fontSize: { xs: '1.6rem', md: '2.6rem' },
                  letterSpacing: '-0.025em',
                  lineHeight: 1.1,
                  color: colors.black,
                  mb: 5,
                }}
              >
                Pricing, Exposure & Control
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, margin: 2 }}>
                <Box sx={{ borderRadius: '10px', border: `1px solid ${colors.border}`, p: 3, background: colors.white }}>
                  <Typography sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700, fontSize: 15, color: colors.yellowDark, mb: 1.5 }}>Pricing & Value</Typography>
                  <Typography sx={{ fontSize: 16, color: colors.gray700, lineHeight: 1.7 }}>
                    CommercialUK delivers a lower-cost, landlord-friendly listing at £25 PCM, ideal for independent owners who want full control and visibility without agents. NovaLoca typically works with agents and has higher listing costs, often structured in fixed 6- or 12-month packages rather than low monthly rates.
                  </Typography>
                </Box>
                <Box sx={{ borderRadius: '10px', border: `1px solid ${colors.border}`, p: 3, background: colors.white }}>
                  <Typography sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700, fontSize: 15, color: colors.yellowDark, mb: 1.5 }}>Exposure & Reach</Typography>
                  <Typography sx={{ fontSize: 16, color: colors.gray700, lineHeight: 1.7, mb: 1 }}>
                    NovaLoca has a large established database with many commercial listings and long-term industry presence — making it a stronger portal for broad market visibility.
                  </Typography>
                  <Typography sx={{ fontSize: 16, color: colors.gray700, lineHeight: 1.7 }}>
                    CommercialUK focuses on relevant UK leads for landlords and sellers without the overhead of traditional agency listings.
                  </Typography>
                </Box>
                <Box sx={{ borderRadius: '10px', border: `1px solid ${colors.border}`, p: 3, background: colors.white }}>
                  <Typography sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700, fontSize: 15, color: colors.yellowDark, mb: 1.5 }}>Listing Control</Typography>
                  <Typography sx={{ fontSize: 16, color: colors.gray700, lineHeight: 1.7 }}>
                    With CommercialUK, landlords retain direct control over their listing, enquiries and pricing. On NovaLoca, listings are often managed through agents, so control can be shared or held by the agent.
                  </Typography>
                </Box>
              </Box>
            </SectionBlock>
            </section>

            <section aria-labelledby="key-points">
            <SectionBlock>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ width: 28, height: 3, background: colors.yellow, borderRadius: '2px', flexShrink: 0 }} />
                <Typography sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: colors.gray500 }}>
                  Summary
                </Typography>
              </Box>
              <Typography
                id="key-points"
                component="h2"
                sx={{
                  fontFamily: '"Montserrat", sans-serif',
                  fontWeight: 800,
                  fontSize: { xs: '1.6rem', md: '2.6rem' },
                  letterSpacing: '-0.025em',
                  lineHeight: 1.1,
                  color: colors.black,
                  mb: 5,
                }}
              >
                Choose the Right Platform
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mt: 1 }}>
                <Box
                  sx={{
                    borderRadius: '10px',
                    border: `1px solid ${colors.yellow}`,
                    background: colors.yellowPale,
                    borderTop: `4px solid ${colors.yellow}`,
                    p: 4.5,
                    margin: 2,
                    transition: 'box-shadow 0.2s, transform 0.2s',
                    '&:hover': { boxShadow: '0 8px 32px rgba(0,0,0,0.08)', transform: 'translateY(-3px)' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, fontFamily: '"Montserrat", sans-serif', fontWeight: 800, fontSize: 15, letterSpacing: '0.06em', textTransform: 'uppercase', color: colors.black }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: colors.yellow, flexShrink: 0 }} />
                    Choose CommercialUK if you want
                  </Box>
                  <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {[
                      'Low monthly listing cost with no long contract',
                      'Full control as a landlord or seller',
                      'Free commercial valuations included',
                      'Direct enquiries sent straight to you',
                    ].map((text, i) => (
                      <Box
                        component="li"
                        key={i}
                        sx={{
                          fontSize: 16,
                          color: colors.gray700,
                          lineHeight: 1.65,
                          pl: 2.25,
                          position: 'relative',
                          '&::before': { content: '"→"', position: 'absolute', left: 0, color: colors.yellowDark, fontWeight: 700, fontSize: 14 },
                        }}
                      >
                        {text}
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box
                  sx={{
                    borderRadius: '10px',
                    border: `1px solid ${colors.border}`,
                    background: colors.gray100,
                    borderTop: `4px solid ${colors.gray300}`,
                    p: 4.5,
                    margin: 2,
                    transition: 'box-shadow 0.2s, transform 0.2s',
                    '&:hover': { boxShadow: '0 8px 32px rgba(0,0,0,0.08)', transform: 'translateY(-3px)' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, fontFamily: '"Montserrat", sans-serif', fontWeight: 800, fontSize: 15, letterSpacing: '0.06em', textTransform: 'uppercase', color: colors.black }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: colors.gray300, flexShrink: 0 }} />
                    Choose NovaLoca if you want
                  </Box>
                  <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {[
                      'A longer-established commercial portal widely used by agents and occupiers',
                      'More advanced search and marketing tools',
                      'Exposure through a large agent network across the UK',
                    ].map((text, i) => (
                      <Box
                        component="li"
                        key={i}
                        sx={{
                          fontSize: 16,
                          color: colors.gray700,
                          lineHeight: 1.65,
                          pl: 2.25,
                          position: 'relative',
                          '&::before': { content: '"→"', position: 'absolute', left: 0, color: colors.gray500, fontWeight: 700, fontSize: 14 },
                        }}
                      >
                        {text}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </SectionBlock>
            </section>

            <section aria-labelledby="cta-heading">
            <Box
              sx={{
                background: colors.black,
                borderRadius: '12px',
                p: { xs: 4, md: 9 },
                mt: 10,
                margin: 2,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'stretch', md: 'center' },
                justifyContent: 'space-between',
                gap: 5,
                position: 'relative',
                overflow: 'hidden',
                '&::before': { content: '""', position: 'absolute', top: 0, left: 0, width: 6, height: '100%', background: colors.yellow },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                  pointerEvents: 'none',
                },
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Typography sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: colors.yellow, mb: 1.75 }}>
                  Get started today
                </Typography>
                <Typography
                  id="cta-heading"
                  component="h2"
                  sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 800, fontSize: { xs: '1.5rem', md: '2.25rem' }, letterSpacing: '-0.025em', lineHeight: 1.1, color: colors.white }}
                >
                  List your property
                  <br />
                  the smarter way.
                </Typography>
              </Box>
              <Box sx={{ position: 'relative', zIndex: 2, flexShrink: 0 }}>
                <NextLink href="/advertise" passHref legacyBehavior>
                  <Box
                    component="a"
                    sx={{
                      display: 'inline-block',
                      background: colors.yellow,
                      color: colors.black,
                      textDecoration: 'none',
                      px: 5,
                      py: 2,
                      borderRadius: '6px',
                      fontFamily: '"Montserrat", sans-serif',
                      fontSize: 15,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      transition: 'background 0.18s, transform 0.15s, box-shadow 0.18s',
                      boxShadow: '0 4px 20px rgba(242,197,20,0.3)',
                      whiteSpace: 'nowrap',
                      '&:hover': { background: '#ffd53a', transform: 'translateY(-2px)', boxShadow: '0 8px 30px rgba(242,197,20,0.4)' },
                    }}
                  >
                    Create Your Listing
                  </Box>
                </NextLink>
              </Box>
            </Box>
            </section>
          </Container>
        </PageBody>
      </main>
    </Page>
  );
}

// Static Generation (SSG): pre-rendered at build time for SEO and fast load
export async function getStaticProps() {
  return { props: {} };
}

CommercialUKVsNovaLocaPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
