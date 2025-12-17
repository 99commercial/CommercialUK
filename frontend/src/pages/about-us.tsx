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
import SearchIcon from '@mui/icons-material/Search';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
 

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
      sx={{ color: '#f2c514' }}
    >
      {/* Hero */}
      <Box
        sx={{
          position: 'relative',
          color: '#f2c514',
          py: { xs: 8, md: 14 },
          background:
            'linear-gradient(135deg, rgba(242, 197, 20,0.85) 0%, rgba(242, 197, 20,0.75) 100%), url(https://img.freepik.com/premium-photo/cartoon-people-working-computer-with-blue-background_1068983-28531.jpg?semt=ais_hybrid&w=740&q=80) center/cover no-repeat',
        }}
      >
        <Container maxWidth="lg" sx={{ maxWidth: '100%' }}>
          <Stack spacing={2} alignItems="center" textAlign="center">
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800, lineHeight: 1.1, color: 'black' }}>
              About CommercialUK
            </Typography>
            <Typography variant="h5" sx={{ maxWidth: 900, opacity: 0.9, color: 'black' }}>
              Your Gateway to Smarter UK Commercial Property
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Intro */}
      {/* <Container maxWidth="lg" sx={{ py: { xs: 10, md: 14 }, maxWidth: '100%' }}> */}
        <Stack alignItems="center" textAlign="center">
          <Box
          sx={{
            maxWidth: 1500,
            px: { xs: 0.5, md: 1.5 },
          }}
          >
            <Typography
              variant="h5"
              component="p"
              sx={{
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                lineHeight: { xs: 1.6, md: 1.7 },
                fontWeight: 400,
                color: 'text.primary',
                letterSpacing: '0.01em',
                '&::before': {
                  content: '""',
                  display: 'block',
                  width: 60,
                  height: 4,
                  background: 'linear-gradient(90deg, #f2c514 0%, rgba(242, 197, 20, 0.3) 100%)',
                  margin: '0 auto 2rem',
                  borderRadius: 2,
                },
              }}
            >
              CommercialUK is where you go when you want UK commercial property to be{' '}
              <Box component="span" sx={{ fontWeight: 600, color: '#f2c514' }}>
                less of a headache
              </Box>
              . We&apos;ve built a platform that makes buying, selling, or letting commercial real estate{' '}
              <Box component="span" sx={{ fontWeight: 600, color: '#f2c514' }}>
                way easier
              </Box>
              . Owners, landlords, developers, investors, agents,{' '}
              <Box component="span" sx={{ fontWeight: 600, color: '#f2c514' }}>
                everyone&apos;s welcome
              </Box>
              . We blend fresh tech with real industry know-how for a user experience that{' '}
              <Box component="span" sx={{ fontWeight: 600, color: '#f2c514' }}>
                actually works
              </Box>
              .
            </Typography>
          </Box>
        </Stack>
      {/* </Container> */}

      {/* What's our goal? */}
      <Container sx={{ py: { xs: 6, md: 10 }, maxWidth: '100%' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={6} alignItems="center">
          <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            <Stack spacing={2}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#f2c514' }}>
                What's our goal?
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
                We want to make finding UK commercial property faster, clearer, and just plain better for everyone.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                With advanced tools and up-to-date content, CommercialUK helps you discover and manage all kinds of spaces, offices, retail units, warehouses, industrial sites, land, leisure properties, investment deals, you name it.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Expanding your portfolio? Selling something? Hunting for that perfect spot? We pull together the tools, insights, and visibility you need to get the job done.
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
                  'url(https://numalis.com/wp-content/uploads/2024/10/Property-Search-RealEstate.jpg)',
                backgroundRepeat: 'no-repeat, no-repeat, no-repeat',
                backgroundSize: 'cover',
              }}
            />
          </Box>
        </Stack>
      </Container>

      {/* What We Do */}
      <Container sx={{ py: { xs: 6, md: 10 }, maxWidth: '100%' }}>
        <Box sx={{ bgcolor: 'background.default'}}>
          {/* <Container maxWidth="lg"> */}
            <Stack spacing={2} sx={{ mb: 6 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#f2c514' }}>
                What We Do
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
                A Complete Ecosystem for UK Commercial Real Estate
              </Typography>
              <Typography variant="body1" color="text.secondary">
                CommercialUK covers every step of the commercial property journey with a platform built for real results.
              </Typography>
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: '1fr 1fr',
                  md: '1fr 1fr',
                },
              }}
            >
              {[
                {
                  icon: <SearchIcon sx={{ color: '#000' }} />,
                  title: 'Smart Property Search',
                  desc: 'Find exactly what you want using intelligent filters, location insights, and live commercial property data from across the UK.',
                },
                {
                  icon: <CloudUploadIcon sx={{ color: '#000' }} />,
                  title: 'Advanced Listing Tech',
                  desc: 'Upload, manage, and promote properties with our modern PropTech interface — easy, fast, and effective.',
                },
                {
                  icon: <DashboardIcon sx={{ color: '#000' }} />,
                  title: 'Seamless Tools for Agents & Owners',
                  desc: 'From lead tracking to performance analytics, we help agents and landlords stay ahead of the game.',
                },
                {
                  icon: <LocationOnIcon sx={{ color: '#000' }} />,
                  title: 'Nationwide Reach',
                  desc: 'Connect with motivated buyers, tenants, and investors from every corner of the UK.',
                },
              ].map((item, idx) => (
                <Paper key={idx} variant="outlined" sx={{ p: 3, height: '100%', borderRadius: 2, borderLeft: '4px solid #f2c514' }}>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box sx={{ p: 1.25, borderRadius: 1.5, bgcolor: 'rgb(242, 198, 20)' }}>{item.icon}</Box>
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
          {/* </Container> */}
        </Box>
      </Container>

      {/* Why Choose CommercialUK */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 }, maxWidth: '100%' }}>
        <Stack spacing={2} sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#f2c514' }}>
            Why Choose CommercialUK?
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Where Technology Meets Trusted Property Expertise
          </Typography>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: '1fr 1fr',
            },
          }}
        >
          {[
            {
              icon: <ApartmentIcon sx={{ color: '#000' }} />,
              title: 'Unmatched Commercial Listings',
              desc: 'Thousands of properties from trusted agents and landlords, updated daily and shown with total accuracy.',
            },
            {
              icon: <BusinessIcon sx={{ color: '#000' }} />,
              title: 'Built for Professionals',
              desc: 'Designed for agents, surveyors, developers, and asset managers — with tools that save time and boost productivity.',
            },
            {
              icon: <TrendingUpIcon sx={{ color: '#000' }} />,
              title: 'High-Impact Visibility',
              desc: 'Your listings get strong SEO, smart digital campaigns, and a platform that brings in serious enquiries.',
            },
            {
              icon: <PriceCheckIcon sx={{ color: '#000' }} />,
              title: 'Flexible, Value-Focused Packages',
              desc: 'Pick a plan that fits — whether you\'re an independent agent or a large enterprise.',
            },
            {
              icon: <SpeedIcon sx={{ color: '#000' }} />,
              title: 'Fast, Hassle-Free Uploads',
              desc: 'Optimized workflows mean you can upload properties, make bulk edits, and manage everything with ease.',
            },
            {
              icon: <SupportAgentIcon sx={{ color: '#000' }} />,
              title: 'Dedicated UK Support',
              desc: 'Personalized onboarding and ongoing help, so you can sell your commercial properties with confidence.',
            },
          ].map((item, idx) => (
            <Paper key={idx} variant="outlined" sx={{ p: 3, height: '100%', borderRadius: 2, borderLeft: '4px solid #f2c514' }}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box sx={{ p: 1.25, borderRadius: 1.5, bgcolor: 'rgb(242, 198, 20)' }}>{item.icon}</Box>
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

      {/* Our Commitment */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 }, maxWidth: '100%' }}>
        <Box sx={{ bgcolor: 'background.default', borderRadius: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#f2c514' }}>
              Our Commitment
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'text.secondary' }}>
              We&apos;re here to make UK commercial property simple, accessible, and results-driven. CommercialUK is all about taking the friction out of the commercial property process. Our intuitive platform, smart tools, and ever-expanding content help professionals get better results faster and more efficiently.
            </Typography>
          </Stack>
        </Box>
      </Container>

      {/* Footer note */}
      <Container maxWidth="md" sx={{ py: 6, maxWidth: '100%' }}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
          <PublicIcon sx={{ color: '#f2c514' }} />
          <Typography variant="body2" color="text.secondary" align="center">
            For media inquiries or partnerships, email{' '}
            <MUILink href="mailto:sales@commercialuk.com" sx={{ color: '#f2c514', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>info@commercialuk.com</MUILink>.
          </Typography>
        </Stack>
      </Container>
    </Page>
  );
};

export default AboutUs;
