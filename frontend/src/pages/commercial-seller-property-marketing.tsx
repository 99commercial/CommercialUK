import React from 'react';
import { NextPage } from 'next';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  CheckCircle,
  Business,
  TrendingUp,
  Visibility,
  Email,
  Settings,
  ExpandMore,
  Star,
  Gavel,
  Store,
  Factory,
  Apartment,
  Security,
  Group,
  HelpOutline,
  Schedule,
  Assessment,
  VerifiedUser,
  Payment,
} from '@mui/icons-material';
import MainLayout from '../layouts/Main/MainLayout';
import Page from '../components/Page';

// ----------------------------------------------------------------------

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f2c514 0%, #e6b813 100%)',
  padding: theme.spacing(8, 0),
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(6, 0),
  },
}));

const ContentSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6, 0),
  backgroundColor: '#ffffff',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4, 0),
  },
}));

const PricingCard = styled(Card)(({ theme }) => ({
  width: '100%',
  aspectRatio: '1 / 1',
  background: 'linear-gradient(135deg, #f2c514 0%, #e6b813 100%)',
  color: '#000000',
  padding: theme.spacing(4),
  textAlign: 'center',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
  position: 'relative',
  overflow: 'visible',
  border: '1px solid #000000',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
  },
}));

const DiscountBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -20,
  right: 20,
  background: '#000000',
  color: '#ffffff',
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(2),
  fontWeight: 700,
  fontSize: '0.875rem',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  [theme.breakpoints.down('sm')]: {
    top: -15,
    right: 15,
    padding: theme.spacing(0.75, 1.5),
    fontSize: '0.75rem',
  },
}));

const PriceText = styled(Typography)(({ theme }) => ({
  fontSize: '3.5rem',
  fontWeight: 700,
  fontFamily: '"Inter", sans-serif',
  margin: theme.spacing(2, 0),
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.5rem',
  },
}));

const OriginalPrice = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  textDecoration: 'line-through',
  opacity: 0.7,
  color: '#000000',
  fontFamily: '"Inter", sans-serif',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.25rem',
  },
}));

const DiscountPrice = styled(Typography)(({ theme }) => ({
  fontSize: '3rem',
  fontWeight: 700,
  color: '#000000',
  fontFamily: '"Inter", sans-serif',
  margin: theme.spacing(1, 0),
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.25rem',
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  border: '1px solid #000000',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-4px)',
  },
}));

// Gradient cards with overlay – grey border, padding
const GradientCard = styled(Card)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(4, 4),
  borderRadius: 0,
  color: '#ffffff',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s ease',
  overflow: 'visible',
  position: 'relative',
  border: '1px solid #000000',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3, 3),
  },
}));

// Corner plus (+) markers – dark, outside border, technical/measurement look
const CornerPlus = styled(Box)({
  position: 'absolute',
  width: 12,
  height: 12,
  backgroundImage: 'linear-gradient(#374151, #374151), linear-gradient(#374151, #374151)',
  backgroundSize: '2px 100%, 100% 2px',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  pointerEvents: 'none',
});

const CardCornerMarkers = styled(Box)({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  '& > *:nth-of-type(1)': { left: 0, top: 0, transform: 'translate(-50%, -50%)' },
  '& > *:nth-of-type(2)': { right: 0, top: 0, transform: 'translate(50%, -50%)' },
  '& > *:nth-of-type(3)': { left: 0, bottom: 0, transform: 'translate(-50%, 50%)' },
  '& > *:nth-of-type(4)': { right: 0, bottom: 0, transform: 'translate(50%, 50%)' },
});

// Fine grain / noise overlay for cards (matches reference: subtle irregular texture)
const NOISE_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E`;

const CardOverlay = styled(Box)({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  borderRadius: 'inherit',
  overflow: 'hidden',
  backgroundImage: `url("${NOISE_SVG}")`,
  backgroundRepeat: 'repeat',
  opacity: 0.7,
  mixBlendMode: 'overlay',
});

const CardsGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(3),
  '& > *': {
    flex: '1 1 100%',
    minWidth: 0,
    [theme.breakpoints.up('sm')]: {
      flex: '1 1 calc(50% - 12px)',
    },
    [theme.breakpoints.up('md')]: {
      flex: '1 1 calc(33.333% - 16px)',
    },
  },
}));

const CardsGridTwoCol = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(3),
  gridTemplateColumns: '1fr',
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
}));

const IconBox = styled(Box)(({ theme }) => ({
  width: 56,
  height: 56,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #f2c514 0%, #e6b813 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#f2c514',
  color: '#000000',
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
  fontWeight: 600,
  fontFamily: '"Inter", sans-serif',
  textTransform: 'none',
  borderRadius: theme.spacing(1.5),
  boxShadow: '0 4px 14px rgba(242, 197, 20, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#e6b813',
    boxShadow: '0 6px 20px rgba(242, 197, 20, 0.4)',
    transform: 'translateY(-2px)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.25, 3),
    fontSize: '1rem',
  },
}));

const FAQAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: 8,
  border: '1px solid #e5e7eb',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  backgroundColor: '#ffffff',
  overflow: 'hidden',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    marginBottom: theme.spacing(2),
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },
}));

const FAQIconBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 44,
  height: 44,
  minWidth: 44,
  minHeight: 44,
  borderRadius: 8,
  backgroundColor: '#f2c514',
  marginRight: theme.spacing(2),
  '& .MuiSvgIcon-root': {
    fontSize: 24,
    color: '#000000',
  },
}));

// ----------------------------------------------------------------------

CommercialSellerPropertyMarketing.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

// ----------------------------------------------------------------------

export default function CommercialSellerPropertyMarketing() {
  return (
    <Page title="Commercial Property Listing - For Individual Sellers">
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Typography
            component="h1"
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 700,
              fontSize: { xs: '2.5rem', sm: '3.25rem', md: '4rem' },
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              color: '#000000',
              mb: 1.5,
            }}
          >
            Commercial Property Listing
          </Typography>
          <Typography
            component="p"
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(0, 0, 0, 0.75)',
            }}
          >
            For Individual Sellers
          </Typography>
        </Container>
      </HeroSection>

      {/* Pricing Section */}
      <ContentSection sx={{ backgroundColor: '#f9fafb' }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 3,
              mb: 4,
            }}
          >
            <Card
              sx={{
                flex: 1,
                position: 'relative',
                overflow: 'visible',
                border: '1px solid #000000',
                borderRadius: 0,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.18)',
                },
              }}
            >
              <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                  }}
                />
                <CardOverlay sx={{ opacity: 0.65 }} />
              </Box>
              <Box sx={{ position: 'relative', zIndex: 1, p: 3.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <TrendingUp sx={{ color: '#ffffff', fontSize: 26 }} />
                </Box>
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '2rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.85)',
                    mb: 1.5,
                  }}
                >
                  Control & transparency
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.9375rem',
                    fontWeight: 400,
                    color: 'rgba(255,255,255,0.95)',
                    lineHeight: 1.65,
                  }}
                >
                  Market your commercial property on CommercialUK with complete control, verified enquiries, and transparent pricing — without the high costs of traditional agents or large portals.
                </Typography>
              </Box>
            </Card>
            <Card
              sx={{
                flex: 1,
                position: 'relative',
                overflow: 'visible',
                border: '1px solid #000000',
                borderRadius: 0,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.18)',
                },
              }}
            >
              <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  }}
                />
                <CardOverlay sx={{ opacity: 0.65 }} />
              </Box>
              <Box sx={{ position: 'relative', zIndex: 1, p: 3.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Security sx={{ color: '#ffffff', fontSize: 26 }} />
                </Box>
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '2rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.85)',
                    mb: 1.5,
                  }}
                >
                  Built for you
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.9375rem',
                    fontWeight: 400,
                    color: 'rgba(255,255,255,0.95)',
                    lineHeight: 1.65,
                  }}
                >
                  Designed for private sellers who want serious buyers, secure communication, and professional presentation.
                </Typography>
              </Box>
            </Card>
          </Box>
          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 700,
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
              textAlign: 'center',
              mb: 4,
              color: '#000000',
            }}
          >
            Pricing
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: { xs: '100%', sm: '90%', md: '70%', lg: '50%' } }}>
              <PricingCard>
                <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit' }}>
                  <CardOverlay sx={{ opacity: 0.85 }} />
                </Box>
                <DiscountBadge>Limited-Time Discount</DiscountBadge>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      mb: 2,
                      color: '#000000',
                    }}
                  >
                    Standard Price:
                  </Typography>
                  <OriginalPrice>£50 per calendar month</OriginalPrice>
                  <Typography
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      mt: 3,
                      mb: 1,
                      color: '#000000',
                    }}
                  >
                    Limited-Time Discount:
                  </Typography>
                  <DiscountPrice>£25 per calendar month</DiscountPrice>
                  <Box sx={{ mt: 4, mb: 3 }}>
                    <Typography
                      sx={{
                        fontFamily: '"Inter", sans-serif',
                        fontSize: '1rem',
                        color: '#000000',
                        mb: 1,
                      }}
                    >
                      No commission. No long-term contracts. Cancel anytime.
                    </Typography>
                  </Box>
                  <StyledButton
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: '#000000',
                      color: '#ffffff',
                      mt: 2,
                      '&:hover': {
                        backgroundColor: '#1a1a1a',
                        color: '#ffffff',
                      },
                    }}
                  >
                    Get Started
                  </StyledButton>
                </Box>
                <CardCornerMarkers>
                  <CornerPlus /><CornerPlus /><CornerPlus /><CornerPlus />
                </CardCornerMarkers>
              </PricingCard>
            </Box>
          </Box>
        </Container>
      </ContentSection>

      {/* What's Included Section */}
      <ContentSection>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 700,
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
              textAlign: 'center',
              mb: 4,
              color: '#000000',
            }}
          >
            What's Included
          </Typography>
          <CardsGrid sx={{ mt: 2 }}>
            <GradientCard sx={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' }}>
              <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit' }}>
                <CardOverlay />
              </Box>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <Business sx={{ color: '#ffffff', fontSize: 26 }} />
                </Box>
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '1.125rem', color: '#ffffff', mb: 0.5 }}>
                  Professionally presented commercial property listing
                </Typography>
              </Box>
              <CardCornerMarkers>
                <CornerPlus /><CornerPlus /><CornerPlus /><CornerPlus />
              </CardCornerMarkers>
            </GradientCard>
            <GradientCard sx={{ background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)' }}>
              <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit' }}>
                <CardOverlay />
              </Box>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <Email sx={{ color: '#ffffff', fontSize: 26 }} />
                </Box>
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '1.125rem', color: '#ffffff', mb: 0.5 }}>
                  Direct enquiries delivered straight to your mailbox
                </Typography>
              </Box>
              <CardCornerMarkers>
                <CornerPlus /><CornerPlus /><CornerPlus /><CornerPlus />
              </CardCornerMarkers>
            </GradientCard>
            <GradientCard sx={{ background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)' }}>
              <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit' }}>
                <CardOverlay />
              </Box>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <Visibility sx={{ color: '#ffffff', fontSize: 26 }} />
                </Box>
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '1.125rem', color: '#ffffff', mb: 0.5 }}>
                  Instant SMS alerts for new buyer and tenant enquiries
                </Typography>
              </Box>
              <CardCornerMarkers>
                <CornerPlus /><CornerPlus /><CornerPlus /><CornerPlus />
              </CardCornerMarkers>
            </GradientCard>
            <GradientCard sx={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
              <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit' }}>
                <CardOverlay />
              </Box>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <CheckCircle sx={{ color: '#ffffff', fontSize: 26 }} />
                </Box>
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '1.125rem', color: '#ffffff', mb: 0.5 }}>
                  Verified email enquiries only from genuine buyers and tenants
                </Typography>
              </Box>
              <CardCornerMarkers>
                <CornerPlus /><CornerPlus /><CornerPlus /><CornerPlus />
              </CardCornerMarkers>
            </GradientCard>
            <GradientCard sx={{ background: 'linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)' }}>
              <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit' }}>
                <CardOverlay />
              </Box>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <Security sx={{ color: '#ffffff', fontSize: 26 }} />
                </Box>
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '1.125rem', color: '#ffffff', mb: 0.5 }}>
                  Secure chat box for safe, trackable communication
                </Typography>
              </Box>
              <CardCornerMarkers>
                <CornerPlus /><CornerPlus /><CornerPlus /><CornerPlus />
              </CardCornerMarkers>
            </GradientCard>
            <GradientCard sx={{ background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)' }}>
              <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit' }}>
                <CardOverlay />
              </Box>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <Settings sx={{ color: '#ffffff', fontSize: 26 }} />
                </Box>
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '1.125rem', color: '#ffffff', mb: 0.5 }}>
                  Full control over pricing, availability, and updates
                </Typography>
              </Box>
              <CardCornerMarkers>
                <CornerPlus /><CornerPlus /><CornerPlus /><CornerPlus />
              </CardCornerMarkers>
            </GradientCard>
          </CardsGrid>
        </Container>
      </ContentSection>

      {/* Free Valuations Section */}
      <ContentSection sx={{ backgroundColor: '#f9fafb' }}>
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 720, mx: 'auto' }}>
            <GradientCard
              sx={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                textAlign: 'center',
                p: { xs: 3, sm: 4 },
              }}
            >
              <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit' }}>
                <CardOverlay />
              </Box>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                  color: '#ffffff',
                  mb: 1.5,
                }}
              >
                Complimentary Commercial Valuations
              </Typography>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '1rem', color: 'rgba(255,255,255,0.9)', mb: 2, lineHeight: 1.6 }}>
                Included at no extra cost:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <CheckCircle sx={{ color: '#ffffff', fontSize: 28 }} />
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '1.125rem', fontWeight: 600, color: '#ffffff' }}>
                  Three (3) FREE commercial property valuations
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.9375rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
                Helping you price your property accurately and competitively in the current market.
              </Typography>
              </Box>
              <CardCornerMarkers>
                <CornerPlus /><CornerPlus /><CornerPlus /><CornerPlus />
              </CardCornerMarkers>
            </GradientCard>
          </Box>
        </Container>
      </ContentSection>

      {/* Why List with CommercialUK Section */}
      <ContentSection>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 700,
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
              textAlign: 'center',
              mb: 4,
              color: '#000000',
            }}
          >
            Why List with CommercialUK
          </Typography>
          <CardsGrid sx={{ mt: 2 }}>
            <GradientCard sx={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', textAlign: 'center' }}>
              <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit' }}>
                <CardOverlay />
              </Box>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                  <Gavel sx={{ color: '#ffffff', fontSize: 26 }} />
                </Box>
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '1rem', color: '#ffffff', lineHeight: 1.4 }}>
                  Built exclusively for UK commercial property
                </Typography>
              </Box>
              <CardCornerMarkers>
                <CornerPlus /><CornerPlus /><CornerPlus /><CornerPlus />
              </CardCornerMarkers>
            </GradientCard>
            <GradientCard sx={{ background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)', textAlign: 'center' }}>
              <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit' }}>
                <CardOverlay />
              </Box>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                  <Star sx={{ color: '#ffffff', fontSize: 26 }} />
                </Box>
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '1rem', color: '#ffffff', lineHeight: 1.4 }}>
                  Ideal for individual sellers and private owners
                </Typography>
              </Box>
              <CardCornerMarkers>
                <CornerPlus /><CornerPlus /><CornerPlus /><CornerPlus />
              </CardCornerMarkers>
            </GradientCard>
            <GradientCard sx={{ background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)', textAlign: 'center' }}>
              <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit' }}>
                <CardOverlay />
              </Box>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                  <TrendingUp sx={{ color: '#ffffff', fontSize: 26 }} />
                </Box>
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '1rem', color: '#ffffff', lineHeight: 1.4 }}>
                  Transparent monthly pricing with no hidden fees
                </Typography>
              </Box>
              <CardCornerMarkers>
                <CornerPlus /><CornerPlus /><CornerPlus /><CornerPlus />
              </CardCornerMarkers>
            </GradientCard>
            <GradientCard sx={{ background: 'linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)', textAlign: 'center' }}>
              <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit' }}>
                <CardOverlay />
              </Box>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                  <Security sx={{ color: '#ffffff', fontSize: 26 }} />
                </Box>
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '1rem', color: '#ffffff', lineHeight: 1.4 }}>
                  Secure, GDPR-compliant communication tools
                </Typography>
              </Box>
              <CardCornerMarkers>
                <CornerPlus /><CornerPlus /><CornerPlus /><CornerPlus />
              </CardCornerMarkers>
            </GradientCard>
            <GradientCard sx={{ background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)', textAlign: 'center' }}>
              <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit' }}>
                <CardOverlay />
              </Box>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                  <Visibility sx={{ color: '#ffffff', fontSize: 26 }} />
                </Box>
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '1rem', color: '#ffffff', lineHeight: 1.4 }}>
                  Faster, more direct engagement with serious prospects
                </Typography>
              </Box>
              <CardCornerMarkers>
                <CornerPlus /><CornerPlus /><CornerPlus /><CornerPlus />
              </CardCornerMarkers>
            </GradientCard>
          </CardsGrid>
        </Container>
      </ContentSection>

      {/* Property Types Section */}
      <ContentSection sx={{ backgroundColor: '#f9fafb' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
              textAlign: 'center',
              mb: 4,
              color: '#000000',
            }}
          >
            Property Types We Support
          </Typography>
          <CardsGrid sx={{ mt: 2 }}>
            <GradientCard sx={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', textAlign: 'center' }}>
              <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit' }}>
                <CardOverlay />
              </Box>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Store sx={{ fontSize: 40, color: '#ffffff', mb: 1.5, display: 'block', mx: 'auto' }} />
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>
                  Shops
                </Typography>
              </Box>
              <CardCornerMarkers>
                <CornerPlus /><CornerPlus /><CornerPlus /><CornerPlus />
              </CardCornerMarkers>
            </GradientCard>
            <GradientCard sx={{ background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)', textAlign: 'center' }}>
              <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit' }}>
                <CardOverlay />
              </Box>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Business sx={{ fontSize: 40, color: '#ffffff', mb: 1.5, display: 'block', mx: 'auto' }} />
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>
                  Offices
                </Typography>
              </Box>
              <CardCornerMarkers>
                <CornerPlus /><CornerPlus /><CornerPlus /><CornerPlus />
              </CardCornerMarkers>
            </GradientCard>
            <GradientCard sx={{ background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)', textAlign: 'center' }}>
              <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit' }}>
                <CardOverlay />
              </Box>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Factory sx={{ fontSize: 40, color: '#ffffff', mb: 1.5, display: 'block', mx: 'auto' }} />
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>
                  Warehouses
                </Typography>
              </Box>
              <CardCornerMarkers>
                <CornerPlus /><CornerPlus /><CornerPlus /><CornerPlus />
              </CardCornerMarkers>
            </GradientCard>
            <GradientCard sx={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', textAlign: 'center' }}>
              <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit' }}>
                <CardOverlay />
              </Box>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Apartment sx={{ fontSize: 40, color: '#ffffff', mb: 1.5, display: 'block', mx: 'auto' }} />
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>
                  Industrial Units
                </Typography>
              </Box>
              <CardCornerMarkers>
                <CornerPlus /><CornerPlus /><CornerPlus /><CornerPlus />
              </CardCornerMarkers>
            </GradientCard>
            <GradientCard sx={{ background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)', textAlign: 'center' }}>
              <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit' }}>
                <CardOverlay />
              </Box>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Business sx={{ fontSize: 40, color: '#ffffff', mb: 1.5, display: 'block', mx: 'auto' }} />
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>
                  Mixed-Use
                </Typography>
              </Box>
              <CardCornerMarkers>
                <CornerPlus /><CornerPlus /><CornerPlus /><CornerPlus />
              </CardCornerMarkers>
            </GradientCard>
          </CardsGrid>
        </Container>
      </ContentSection>

      {/* FAQ Section */}
      <ContentSection sx={{ backgroundColor: '#ffffff' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 700,
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
              textAlign: 'center',
              mb: 1,
              color: '#000000',
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '1rem',
              color: '#000000',
              textAlign: 'center',
              mb: 4,
              maxWidth: 560,
              mx: 'auto',
              lineHeight: 1.5,
              opacity: 0.85,
            }}
          >
            Quick answers to common questions about listing your commercial property with CommercialUK.
          </Typography>
          <Box sx={{ maxWidth: '900px', mx: 'auto', border: '1px solid #000000' }}>
            <FAQAccordion>
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: '#000000', fontSize: 28 }} />}
                sx={{
                  px: 3,
                  '& .MuiAccordionSummary-content': {
                    my: 2.5,
                    alignItems: 'center',
                    gap: 0,
                  },
                }}
              >
                <FAQIconBox>
                  <Group />
                </FAQIconBox>
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    fontSize: '1.125rem',
                    color: '#000000',
                  }}
                >
                  Who is this service suitable for?
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pt: 0, pb: 2.5 }}>
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '1rem',
                    color: '#000000',
                    lineHeight: 1.65,
                    opacity: 0.9,
                  }}
                >
                  This service is ideal for individual landlords and private sellers looking to sell
                  or let commercial property without paying high agency fees.
                </Typography>
              </AccordionDetails>
            </FAQAccordion>

            <FAQAccordion>
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: '#000000', fontSize: 28 }} />}
                sx={{
                  px: 3,
                  '& .MuiAccordionSummary-content': {
                    my: 2.5,
                    alignItems: 'center',
                    gap: 0,
                  },
                }}
              >
                <FAQIconBox>
                  <Store />
                </FAQIconBox>
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    fontSize: '1.125rem',
                    color: '#000000',
                  }}
                >
                  What types of commercial properties can I list?
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pt: 0, pb: 2.5 }}>
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '1rem',
                    color: '#000000',
                    lineHeight: 1.65,
                    opacity: 0.9,
                  }}
                >
                  You can list shops, offices, warehouses, industrial units, mixed-use buildings,
                  and other UK commercial properties.
                </Typography>
              </AccordionDetails>
            </FAQAccordion>

            <FAQAccordion>
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: '#000000', fontSize: 28 }} />}
                sx={{
                  px: 3,
                  '& .MuiAccordionSummary-content': {
                    my: 2.5,
                    alignItems: 'center',
                    gap: 0,
                  },
                }}
              >
                <FAQIconBox>
                  <Payment />
                </FAQIconBox>
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    fontSize: '1.125rem',
                    color: '#000000',
                  }}
                >
                  Are there any hidden fees or commissions?
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pt: 0, pb: 2.5 }}>
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '1rem',
                    color: '#000000',
                    lineHeight: 1.65,
                    opacity: 0.9,
                  }}
                >
                  No. The monthly fee is fixed. We do not charge commission or success fees.
                </Typography>
              </AccordionDetails>
            </FAQAccordion>

            <FAQAccordion>
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: '#000000', fontSize: 28 }} />}
                sx={{
                  px: 3,
                  '& .MuiAccordionSummary-content': {
                    my: 2.5,
                    alignItems: 'center',
                    gap: 0,
                  },
                }}
              >
                <FAQIconBox>
                  <Schedule />
                </FAQIconBox>
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    fontSize: '1.125rem',
                    color: '#000000',
                  }}
                >
                  How long is the contract?
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pt: 0, pb: 2.5 }}>
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '1rem',
                    color: '#000000',
                    lineHeight: 1.65,
                    opacity: 0.9,
                  }}
                >
                  There is no long-term contract. Listings are billed monthly and can be cancelled
                  at any time.
                </Typography>
              </AccordionDetails>
            </FAQAccordion>

            <FAQAccordion>
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: '#000000', fontSize: 28 }} />}
                sx={{
                  px: 3,
                  '& .MuiAccordionSummary-content': {
                    my: 2.5,
                    alignItems: 'center',
                    gap: 0,
                  },
                }}
              >
                <FAQIconBox>
                  <Email />
                </FAQIconBox>
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    fontSize: '1.125rem',
                    color: '#000000',
                  }}
                >
                  How do enquiries work?
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pt: 0, pb: 2.5 }}>
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '1rem',
                    color: '#000000',
                    lineHeight: 1.65,
                    opacity: 0.9,
                  }}
                >
                  All enquiries are sent directly to you, allowing you to respond quickly and
                  maintain full control over negotiations.
                </Typography>
              </AccordionDetails>
            </FAQAccordion>

            <FAQAccordion>
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: '#000000', fontSize: 28 }} />}
                sx={{
                  px: 3,
                  '& .MuiAccordionSummary-content': {
                    my: 2.5,
                    alignItems: 'center',
                    gap: 0,
                  },
                }}
              >
                <FAQIconBox>
                  <Assessment />
                </FAQIconBox>
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    fontSize: '1.125rem',
                    color: '#000000',
                  }}
                >
                  What are the free valuations?
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pt: 0, pb: 2.5 }}>
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '1rem',
                    color: '#000000',
                    lineHeight: 1.65,
                    opacity: 0.9,
                  }}
                >
                  You receive three complimentary commercial property valuations, helping you assess
                  market value and pricing strategy.
                </Typography>
              </AccordionDetails>
            </FAQAccordion>

            <FAQAccordion>
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: '#000000', fontSize: 28 }} />}
                sx={{
                  px: 3,
                  '& .MuiAccordionSummary-content': {
                    my: 2.5,
                    alignItems: 'center',
                    gap: 0,
                  },
                }}
              >
                <FAQIconBox>
                  <VerifiedUser />
                </FAQIconBox>
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    fontSize: '1.125rem',
                    color: '#000000',
                  }}
                >
                  Is CommercialUK GDPR compliant?
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pt: 0, pb: 2.5 }}>
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '1rem',
                    color: '#000000',
                    lineHeight: 1.65,
                    opacity: 0.9,
                  }}
                >
                  Yes. CommercialUK operates fully in line with UK GDPR regulations, ensuring data
                  protection and privacy.
                </Typography>
              </AccordionDetails>
            </FAQAccordion>
          </Box>
        </Container>
      </ContentSection>

      {/* CTA Section */}
      <ContentSection sx={{ backgroundColor: '#000000', color: '#ffffff' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 700,
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                mb: 3,
                color: '#ffffff',
              }}
            >
              Ready to List Your Commercial Property?
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: { xs: '1rem', sm: '1.125rem' },
                mb: 4,
                color: '#ffffff',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Join individual sellers and private owners who trust CommercialUK for their commercial
              property listings.
            </Typography>
            <StyledButton
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#f2c514',
                color: '#000000',
                '&:hover': {
                  backgroundColor: '#e6b813',
                },
              }}
            >
              Get Started Today
            </StyledButton>
          </Box>
        </Container>
      </ContentSection>
    </Page>
  );
}
