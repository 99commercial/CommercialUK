import React from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import Page from '../components/Page';
import {
  Box,
  Typography,
  Container,
  Link,
} from '@mui/material';
import { Campaign, HelpOutline } from '@mui/icons-material';

// SEO – static metadata
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.commercialuk.co.uk';
const PAGE_PATH = '/contact-us';
const CANONICAL_URL = `${SITE_URL}${PAGE_PATH}`;

export const METADATA = {
  title: 'Contact Us — CommercialUK',
  description:
    'Get in touch with CommercialUK. Advertise your property, explore partnerships, or get support with listings, billing, and account enquiries.',
  keywords: [
    'contact CommercialUK',
    'commercial property advertising',
    'property support UK',
    'CommercialUK contact',
  ],
  openGraph: {
    type: 'website',
    url: CANONICAL_URL,
    title: 'Contact Us — CommercialUK',
    description: 'Get in touch with CommercialUK for property advertising or support.',
    siteName: 'CommercialUK',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us — CommercialUK',
    description: 'Get in touch with CommercialUK for property advertising or support.',
  },
  robots: 'index, follow',
  canonical: CANONICAL_URL,
};

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: METADATA.title,
  description: METADATA.description,
  url: CANONICAL_URL,
  mainEntity: {
    '@type': 'Organization',
    name: 'CommercialUK',
    url: SITE_URL,
  },
};

// Design tokens (from HTML)
const colors = {
  gold: '#F5C200',
  goldDark: '#D4A800',
  goldLight: '#FDD835',
  ink: '#111111',
  inkSoft: '#2a2a2a',
  warmWhite: '#FAFAF7',
  mid: '#888888',
  border: 'rgba(0,0,0,0.08)',
};

const ContactUs: NextPage = () => {
  return (
    <Page title="Contact Us">
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
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,600;0,700;0,800;0,900;1,700;1,800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main>
        {/* Hero */}
        <section
          className="hero"
          aria-labelledby="contact-heading"
          style={{ marginTop: 0 }}
        >
          <Box
            sx={{
              background: colors.gold,
              minHeight: { xs: 'auto', md: 520 },
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '"CONTACT"',
                position: 'absolute',
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 900,
                fontSize: { xs: 120, sm: 160, md: 220, lg: 280 },
                letterSpacing: '-0.02em',
                color: 'rgba(0,0,0,0.04)',
                bottom: { xs: -20, md: -60 },
                left: { xs: -10, md: -20 },
                pointerEvents: 'none',
                lineHeight: 1,
                whiteSpace: 'nowrap',
              },
            }}
          >
            <Box
              sx={{
                py: { xs: 6, sm: 7, md: 8 },
                px: { xs: 2, sm: 3, md: 4, lg: 6 },
                position: 'relative',
                zIndex: 2,
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1.25,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(0,0,0,0.5)',
                  mb: 3.5,
                  '&::before': {
                    content: '""',
                    width: 32,
                    height: 1,
                    background: 'rgba(0,0,0,0.3)',
                  },
                }}
              >
                Get in Touch
              </Box>
              <Typography
                id="contact-heading"
                component="h1"
                sx={{
                  fontFamily: '"Montserrat", sans-serif',
                  fontSize: { xs: 'clamp(2.5rem, 8vw, 3.5rem)', md: 'clamp(56px, 6vw, 80px)' },
                  fontWeight: 900,
                  lineHeight: 0.95,
                  letterSpacing: '-0.02em',
                  color: colors.ink,
                  mb: 3,
                }}
              >
                Let&apos;s Build
                <br />
                <Box component="em" sx={{ fontStyle: 'italic', fontWeight: 800 }}>
                  Together
                </Box>
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 18,
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: 'rgba(0,0,0,0.65)',
                  maxWidth: 400,
                  mb: 1.5,
                }}
              >
                We&apos;d love to hear from you. Whether you&apos;re looking to advertise your property, explore partnership opportunities, or need assistance with your account — our team is here.
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 16,
                  fontWeight: 400,
                  lineHeight: 1.65,
                  color: 'rgba(0,0,0,0.55)',
                  maxWidth: 380,
                }}
              >
                Contact the relevant department below and let us make your property objectives a reality.
              </Typography>
            </Box>

            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                py: 5,
                px: { md: 4, lg: 6 },
                justifyContent: 'flex-end',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: 440,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: '12px -12px -12px 12px',
                    border: '2px solid rgba(0,0,0,0.15)',
                    borderRadius: 2,
                    zIndex: 0,
                  },
                }}
              >
                <Box
                  component="img"
                  src="https://www.shutterstock.com/image-photo/young-businesswoman-using-smart-phone-600nw-1936412359.jpg"
                  alt="Customer service representative"
                  sx={{
                    width: '100%',
                    aspectRatio: '4/3',
                    objectFit: 'cover',
                    borderRadius: 2,
                    display: 'block',
                    position: 'relative',
                    zIndex: 1,
                    filter: 'grayscale(20%)',
                  }}
                />
                {/* Dots grid */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -24,
                    right: -24,
                    width: 80,
                    height: 80,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: 0.75,
                    zIndex: 0,
                  }}
                >
                  {Array.from({ length: 25 }).map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 4,
                        height: 4,
                        background: 'rgba(0,0,0,0.2)',
                        borderRadius: '50%',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </section>

        {/* Divider */}
        <Box
          sx={{
            height: 4,
            background: `linear-gradient(to right, ${colors.gold} 0%, ${colors.goldDark} 100%)`,
          }}
        />

        {/* Cards Section */}
        <section aria-labelledby="how-we-help-heading">
          <Box
            sx={{
              background: colors.warmWhite,
              py: { xs: 6, md: 10 },
              px: { xs: 2, sm: 3, md: 5, lg: 6 },
            }}
          >
            <Container maxWidth="lg" disableGutters>
              <Typography
                id="how-we-help-heading"
                component="h2"
                sx={{
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: colors.mid,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  mb: 6,
                  '&::after': {
                    content: '""',
                    flex: 1,
                    height: 1,
                    background: colors.border,
                  },
                }}
              >
                How can we help
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  gap: '2px',
                }}
              >
                {/* Card 1 - Advertise */}
                <Box
                  component="article"
                  sx={{
                    background: '#fff',
                    p: { xs: 3, md: 5 },
                    position: 'relative',
                    transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)',
                    border: `1px solid ${colors.border}`,
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      '& .card-top-bar': { transform: 'scaleX(1)' },
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      bottom: -40,
                      right: -40,
                      width: 160,
                      height: 160,
                      border: `1px solid rgba(245,194,0,0.15)`,
                      borderRadius: '50%',
                      pointerEvents: 'none',
                    },
                  }}
                >
                  <Box
                    className="card-top-bar"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: colors.gold,
                      transform: 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1)',
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: '"Montserrat", sans-serif',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.2em',
                      color: 'rgba(0,0,0,0.15)',
                      mb: 3,
                    }}
                  >
                    01 / ADVERTISE
                  </Typography>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      background: colors.gold,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      borderRadius: 2,
                    }}
                  >
                    <Campaign sx={{ fontSize: 24, color: colors.ink }} />
                  </Box>
                  <Typography
                    component="h3"
                    sx={{
                      fontFamily: '"Montserrat", sans-serif',
                      fontSize: { xs: 26, md: 30 },
                      fontWeight: 800,
                      lineHeight: 1.1,
                      color: colors.ink,
                      mb: 2,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Advertise
                    <br />
                    With Us
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: 17,
                      fontWeight: 300,
                      lineHeight: 1.75,
                      color: '#555',
                      mb: 2,
                    }}
                  >
                    Connect with our Commercial UK property marketing team and discover bespoke advertising solutions to enhance your brand and maximise exposure.
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: 17,
                      fontWeight: 300,
                      lineHeight: 1.75,
                      color: '#555',
                      mb: 4,
                    }}
                  >
                    We offer flexible packages, premium placements, and data-driven insights to make your listings stand out in the competitive marketplace. Let&apos;s build a strategy that works for you.
                  </Typography>
                  <Link
                    href="mailto:info@commercialuk.com"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1.25,
                      py: 1.5,
                      px: 3,
                      background: colors.gold,
                      color: colors.ink,
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      borderRadius: 2,
                      transition: 'background 0.2s, gap 0.2s',
                      '&:hover': {
                        background: colors.goldDark,
                        gap: 2,
                        color: colors.ink,
                      },
                    }}
                  >
                    Connect with Us
                    <Box
                      component="span"
                      sx={{
                        display: 'inline-block',
                        width: 14,
                        height: 14,
                        borderLeft: '2px solid currentColor',
                        borderBottom: '2px solid currentColor',
                        transform: 'rotate(-45deg)',
                        ml: 0.5,
                      }}
                    />
                  </Link>
                </Box>

                {/* Card 2 - Support */}
                <Box
                  component="article"
                  sx={{
                    background: '#fff',
                    p: { xs: 3, md: 5 },
                    position: 'relative',
                    transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)',
                    border: `1px solid ${colors.border}`,
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      '& .card-top-bar': { transform: 'scaleX(1)' },
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      bottom: -40,
                      right: -40,
                      width: 160,
                      height: 160,
                      border: `1px solid rgba(245,194,0,0.15)`,
                      borderRadius: '50%',
                      pointerEvents: 'none',
                    },
                  }}
                >
                  <Box
                    className="card-top-bar"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: colors.gold,
                      transform: 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1)',
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: '"Montserrat", sans-serif',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.2em',
                      color: 'rgba(0,0,0,0.15)',
                      mb: 3,
                    }}
                  >
                    02 / SUPPORT
                  </Typography>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      background: colors.gold,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      borderRadius: 2,
                    }}
                  >
                    <HelpOutline sx={{ fontSize: 24, color: colors.ink }} />
                  </Box>
                  <Typography
                    component="h3"
                    sx={{
                      fontFamily: '"Montserrat", sans-serif',
                      fontSize: { xs: 26, md: 30 },
                      fontWeight: 800,
                      lineHeight: 1.1,
                      color: colors.ink,
                      mb: 2,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Get
                    <br />
                    Support
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: 17,
                      fontWeight: 300,
                      lineHeight: 1.75,
                      color: '#555',
                      mb: 2,
                    }}
                  >
                    We are here to make your CommercialUK experience smooth and stress-free. Our dedicated support team is ready to help with everything from managing your listings to resolving billing issues.
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: 17,
                      fontWeight: 300,
                      lineHeight: 1.75,
                      color: '#555',
                      mb: 4,
                    }}
                  >
                    Account access, technical queries, business detail updates — reach out today, and we&apos;ll get you back on track in no time.
                  </Typography>
                  <Link
                    href="mailto:info@commercialuk.com"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1.25,
                      py: 1.5,
                      px: 3,
                      background: colors.gold,
                      color: colors.ink,
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      borderRadius: 2,
                      transition: 'background 0.2s, gap 0.2s',
                      '&:hover': {
                        background: colors.goldDark,
                        gap: 2,
                        color: colors.ink,
                      },
                    }}
                  >
                    Get Help
                    <Box
                      component="span"
                      sx={{
                        display: 'inline-block',
                        width: 14,
                        height: 14,
                        borderLeft: '2px solid currentColor',
                        borderBottom: '2px solid currentColor',
                        transform: 'rotate(-45deg)',
                        ml: 0.5,
                      }}
                    />
                  </Link>
                </Box>
              </Box>
            </Container>
          </Box>
        </section>
      </main>
    </Page>
  );
};

// Static Generation (SSG)
export async function getStaticProps() {
  return { props: {} };
}

export default ContactUs;
