import React from 'react';
import { NextPage } from 'next';
import { Page } from '@/components';
import { Box, Button, Chip, Container, Link as MUILink, Paper, Stack, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PublicIcon from '@mui/icons-material/Public';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SpeedIcon from '@mui/icons-material/Speed';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import ApartmentIcon from '@mui/icons-material/Apartment';
import VerifiedIcon from '@mui/icons-material/Verified';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
 

const AboutUs: NextPage = () => {
  return (
    <Page
      title="About CommercialUK"
      meta={
        <meta
          name="description"
          content="CommercialUK offers quick, efficient, and cost-effective property listing services. From management aids to coverage across the whole of the UK, we help clients throughout the UK."
        />
      }
      sx={{ color: 'error.main' }}
    >
      {/* Hero */}
      <Box
        sx={{
          position: 'relative',
          color: 'error.main',
          py: { xs: 8, md: 14 },
          background:
            'linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(https://www.shutterstock.com/image-photo/why-choose-us-businessman-holding-600nw-1431803342.jpg) center/cover no-repeat',
        }}
      >
        <Container maxWidth="lg" sx={{ maxWidth: '100%' }}>
          <Stack spacing={2} alignItems="flex-start">
            <Typography variant="h2" component="h1" sx={{ fontWeight: 800, lineHeight: 1.1, color: 'common.white' }}>
              About CommercialUK
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: 900, opacity: 0.9, color: 'common.white' }}>
              Quick, efficient, and cost‑effective property listing services covering the whole of the UK.
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* About narrative */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, maxWidth: '100%' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={6} alignItems="center">
          <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            <Stack spacing={2}>
              <Typography variant="overline" color="error" sx={{ fontWeight: 700 }}>
                About
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
                Your partner in UK commercial property search
              </Typography>
              <Typography variant="body1" color="text.secondary">
                CommercialUK is your go‑to partner in commercial property search within the UK. As seasoned
                experts in linking property owners, landlords, developers, and agents, we are committed to
                making commercial property transactions easy, transparent, and efficient.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Our intuitive listing platform and customized PropTech solutions are designed to suit the needs
                of owners, investors, and commercial agents.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Today, CommercialUK features increasing numbers of listings from top commercial property
                agents across the country, allowing buyers, tenants, and investors to quickly find the right
                properties.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Founded with one aim: make buying, selling, and letting UK commercial property as simple as
                possible. Whatever your regional or national search, our site saves time and delivers results.
              </Typography>
            </Stack>
          </Box>
          <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            <Box
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: (t) => t.shadows[8],
                minHeight: 320,
                background:
                  'url(/window.svg), url(/globe.svg), linear-gradient(135deg, rgba(25,118,210,0.08), rgba(16,185,129,0.08))',
                backgroundRepeat: 'no-repeat, no-repeat, no-repeat',
                backgroundPosition: 'left 20% top 20%, right 10% bottom 10%, center',
              }}
            />
          </Box>
        </Stack>
      </Container>

      {/* Why CommercialUK */}
      <Container maxWidth="lg" sx={{ maxWidth: '100%' }}>
      <Box  sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' , maxWidth: '100%' }}>
        <Container maxWidth="lg">
          <Stack spacing={2} sx={{ mb: 4 }}>
            <Typography variant="overline" color="error" sx={{ fontWeight: 700 }}>
              Why CommercialUK?
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
              Reasons clients choose us
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Flexible, affordable solutions from complete management to hands‑on assistance whenever you
              need it.
            </Typography>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr 1fr',
                md: '1fr 1fr 1fr',
              },
            }}
          >
            {[
              {
                icon: <ApartmentIcon color="error" />,
                title: 'Thousands of UK properties',
                desc: 'For sale and to let across the UK',
              },
              {
                icon: <VerifiedIcon color="error" />,
                title: 'Trusted by top professionals',
                desc: 'Recommended by landlords, developers, and agents',
              },
              {
                icon: <PriceCheckIcon color="error" />,
                title: 'Competitive subscriptions',
                desc: 'Best value for money across packages',
              },
              {
                icon: <SupportAgentIcon color="error" />,
                title: 'Customer‑centric support',
                desc: 'Responsive and personalized assistance',
              },
              {
                icon: <TrendingUpIcon color="error" />,
                title: 'Exceptional visibility',
                desc: 'Powered by SEO and digital marketing',
              },
              {
                icon: <SpeedIcon color="error" />,
                title: 'Rapid, easy uploads',
                desc: 'Spick‑and‑span management solutions',
              },
            ].map((item, idx) => (
              <Paper key={idx} variant="outlined" sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box sx={{ p: 1.25, borderRadius: 1.5, bgcolor: 'action.hover' }}>{item.icon}</Box>
                  <Stack spacing={0.5}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.desc}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>
      </Container>

      {/* Footer note */}
      <Container maxWidth="md" sx={{ py: 6, maxWidth: '100%' }}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
          <PublicIcon color="error" />
          <Typography variant="body2" color="text.secondary" align="center">
            For media inquiries or partnerships, email{' '}
            <MUILink href="mailto:sales@commercialuk.com"  color="error.main">info@commercialuk.com</MUILink>.
          </Typography>
        </Stack>
      </Container>
    </Page>
  );
};

export default AboutUs;
