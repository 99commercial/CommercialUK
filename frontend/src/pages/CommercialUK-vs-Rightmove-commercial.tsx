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
const PAGE_PATH = '/CommercialUK-vs-Rightmove-commercial';
const CANONICAL_URL = `${SITE_URL}${PAGE_PATH}`;

export const METADATA = {
  title: 'CommercialUK vs Rightmove Commercial | Compare UK Portals',
  description:
    'Compare CommercialUK with Rightmove Commercial. UK-focused platform, £25 PCM, free valuations, zero commission, full listing control for landlords and sellers.',
  keywords: [
    'commercial property portal UK',
    'CommercialUK vs Rightmove',
    'Rightmove commercial',
    'UK commercial property listing',
    'commercial property comparison',
    'office space UK',
    'commercial real estate portal',
  ],
  openGraph: {
    type: 'website',
    url: CANONICAL_URL,
    title: 'CommercialUK vs Rightmove Commercial | Compare UK Portals',
    description:
      'Compare CommercialUK with Rightmove Commercial. £25 PCM, free valuations, zero commission, full listing control for landlords and sellers.',
    siteName: 'CommercialUK',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CommercialUK vs Rightmove Commercial | Compare UK Portals',
    description:
      'Compare CommercialUK with Rightmove Commercial. £25 PCM, free valuations, zero commission, full listing control.',
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

type PillType = 'yes' | 'no' | 'warn' | null;

const rightmoveRows: Array<{
  feature: string;
  cuLabel: string;
  cuPill: PillType;
  otherLabel: string;
  otherPill: PillType;
}> = [
  {
    feature: 'Monthly Listing Fee',
    cuLabel: '£25 PCM (discounted)',
    cuPill: null,
    otherLabel:
      'Significantly higher and varies — often several hundred pounds per month depending on package and exposure level',
    otherPill: 'no',
  },
  {
    feature: 'Commission',
    cuLabel: 'Zero commission',
    cuPill: 'yes',
    otherLabel: 'Zero (portal only)',
    otherPill: 'yes',
  },
  {
    feature: 'Free Valuations',
    cuLabel: 'Unlimited commercial property valuations',
    cuPill: 'yes',
    otherLabel: 'Not included',
    otherPill: 'no',
  },
  {
    feature: 'Listing Control',
    cuLabel: 'Full direct control',
    cuPill: 'yes',
    otherLabel: 'Must list via agent or intermediary',
    otherPill: 'no',
  },
  {
    feature: 'Direct Enquiries to You',
    cuLabel: 'Yes',
    cuPill: 'yes',
    otherLabel: 'Yes',
    otherPill: 'yes',
  },
  {
    feature: 'UK Market Focus',
    cuLabel: 'Dedicated UK commercial property',
    cuPill: 'yes',
    otherLabel: 'Largest UK audience but traditional model',
    otherPill: 'warn',
  },
  {
    feature: 'GDPR & Compliance',
    cuLabel: 'Fully UK GDPR compliant',
    cuPill: 'yes',
    otherLabel: 'GDPR compliant',
    otherPill: 'yes',
  },
  {
    feature: 'Exposure & Reach',
    cuLabel: 'Targeted audience',
    cuPill: null,
    otherLabel: 'Very high UK traffic and visibility',
    otherPill: null,
  },
  {
    feature: 'Ideal For',
    cuLabel: 'Agents, individual landlords & sellers',
    cuPill: null,
    otherLabel: 'Agents / larger portfolios / high-reach listings',
    otherPill: null,
  },
];

export default function CommercialUKVsRightmovePage() {
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
              <Box component="span" sx={{ color: colors.yellow }}>
                CommercialUK
              </Box>{' '}
              vs Rightmove Commercial
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
              Compare UK commercial property platforms. See how CommercialUK offers affordable listing, full control, and
              free valuations versus Rightmove Commercial&apos;s higher-priced, agent-led model.
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
                {' '}with Rightmove Commercial on pricing, features, UK market focus, and compliance so you can decide which platform fits your commercial listings best.
              </Typography>
            </section>

            <section aria-labelledby="comparison-rightmove">
              <SectionBlock>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Box sx={{ width: 28, height: 3, background: colors.yellow, borderRadius: '2px', flexShrink: 0 }} />
                  <Typography
                    sx={{
                      fontFamily: '"Montserrat", sans-serif',
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: colors.gray500,
                    }}
                  >
                    Comparison 01
                  </Typography>
                </Box>
                <Typography
                  id="comparison-rightmove"
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
                  CommercialUK vs <Box component="span" sx={{ color: colors.yellowDark }}>Rightmove Commercial</Box>
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
                  <Table
                    sx={{ tableLayout: 'fixed', width: '100%' }}
                    aria-label="CommercialUK vs Rightmove Commercial comparison"
                  >
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
                          Rightmove Commercial
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rightmoveRows.map((row, i) => (
                        <TableRow
                          key={i}
                          sx={{
                            borderBottom: `1px solid ${colors.border}`,
                            '&:last-child': { borderBottom: 'none' },
                          }}
                        >
                          <TableCell
                            sx={{
                              py: 2.25,
                              px: 3,
                              fontWeight: 500,
                              color: colors.black,
                              fontSize: 16,
                            }}
                          >
                            {row.feature}
                          </TableCell>
                          <TableCell
                            sx={{
                              py: 2.25,
                              px: 3,
                              fontWeight: 600,
                              color: colors.black,
                              fontSize: 16,
                            }}
                          >
                            <CellPill type={row.cuPill}>{row.cuLabel}</CellPill>
                          </TableCell>
                          <TableCell
                            sx={{
                              py: 2.25,
                              px: 3,
                              color: colors.black,
                              fontSize: 16,
                            }}
                          >
                            <CellPill type={row.otherPill}>{row.otherLabel}</CellPill>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </SectionBlock>
            </section>

            <section aria-labelledby="key-points">
              <SectionBlock>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Box sx={{ width: 28, height: 3, background: colors.yellow, borderRadius: '2px', flexShrink: 0 }} />
                  <Typography
                    sx={{
                      fontFamily: '"Montserrat", sans-serif',
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: colors.gray500,
                    }}
                  >
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
                  Key Points
                </Typography>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: 3,
                    mt: 1,
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: '10px',
                      border: `1px solid ${colors.yellow}`,
                      background: colors.yellowPale,
                      borderTop: `4px solid ${colors.yellow}`,
                      p: 4.5,
                      margin: 2,
                      transition: 'box-shadow 0.2s, transform 0.2s',
                      '&:hover': {
                        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                        transform: 'translateY(-3px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 3,
                        fontFamily: '"Montserrat", sans-serif',
                        fontWeight: 800,
                        fontSize: 15,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: colors.black,
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: colors.yellow,
                          flexShrink: 0,
                        }}
                      />
                      CommercialUK
                    </Box>
                    <Box
                      component="ul"
                      sx={{
                        listStyle: 'none',
                        m: 0,
                        p: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                      }}
                    >
                      {[
                        'Premium UK-focused platform tailored for individual landlords and sellers.',
                        'Affordable monthly pricing with no hidden fees.',
                        'No agents required — direct listing with complete control.',
                        '3 free commercial valuations included for individual landlord or seller.',
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
                            '&::before': {
                              content: '"→"',
                              position: 'absolute',
                              left: 0,
                              color: colors.yellowDark,
                              fontWeight: 700,
                              fontSize: 14,
                            },
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
                      '&:hover': {
                        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                        transform: 'translateY(-3px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 3,
                        fontFamily: '"Montserrat", sans-serif',
                        fontWeight: 800,
                        fontSize: 15,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: colors.black,
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: colors.gray300,
                          flexShrink: 0,
                        }}
                      />
                      Rightmove Commercial
                    </Box>
                    <Box
                      component="ul"
                      sx={{
                        listStyle: 'none',
                        m: 0,
                        p: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                      }}
                    >
                      {[
                        'One of the most widely visited commercial property portals in the UK with strong market reach.',
                        'Typically requires an estate agent or intermediary to list.',
                        'Costs are substantially higher and package-based.',
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
                            '&::before': {
                              content: '"→"',
                              position: 'absolute',
                              left: 0,
                              color: colors.gray500,
                              fontWeight: 700,
                              fontSize: 14,
                            },
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
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 6,
                    height: '100%',
                    background: colors.yellow,
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `
                linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
              `,
                    backgroundSize: '40px 40px',
                    pointerEvents: 'none',
                  },
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <Typography
                    sx={{
                      fontFamily: '"Montserrat", sans-serif',
                      fontWeight: 700,
                      fontSize: 12,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: colors.yellow,
                      mb: 1.75,
                    }}
                  >
                    Get started today
                  </Typography>
                  <Typography
                    id="cta-heading"
                    component="h2"
                    sx={{
                      fontFamily: '"Montserrat", sans-serif',
                      fontWeight: 800,
                      fontSize: { xs: '1.5rem', md: '2.25rem' },
                      letterSpacing: '-0.025em',
                      lineHeight: 1.1,
                      color: colors.white,
                    }}
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
                        '&:hover': {
                          background: '#ffd53a',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 30px rgba(242,197,20,0.4)',
                        },
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

CommercialUKVsRightmovePage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

