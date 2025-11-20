import React from 'react';
import { NextPage } from 'next';
import { Page } from '@/components';
import { Box, Button, Typography, Stack, Card, CardContent, Container } from '@mui/material';
import { Campaign, SupportAgent, Phone, ArrowForward } from '@mui/icons-material';

const ContactUs: NextPage = () => {
  return (
    <Page
      title="Get in Touch with the experts | commercialuk"
      meta={
        <>
          <meta
            name="description"
            content="Connect with CommercialUK for bespoke property advertising solutions or expert account support across listings, billing, and enquiries."
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Montserrat:wght@600;700;800;900&display=swap"
            rel="stylesheet"
          />
        </>
      }
    >
      {/* Hero Section - Yellow Background */}
      <Box
        sx={{
          position: 'relative',
          background: '#f2c514',
          py: { xs: 6, md: 10 },
          padding:"5%",
          overflow: 'hidden'
        }}
      >
        {/* <Container maxWidth="lg"> */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' },
              gap: { xs: 4, md: 6 },
              alignItems: 'center'
            }}
          >
            {/* Left Side - Text Content */}
            <Box>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                  color: '#000000',
                  fontFamily: `'Montserrat', 'Inter', sans-serif`,
                  lineHeight: 1.2,
                  mb: 3
                }}
              >
                GET IN TOUCH
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 400,
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  color: '#000000',
                  fontFamily: `'Inter', 'Montserrat', sans-serif`,
                  lineHeight: 1.6,
                  opacity: 0.9
                }}
              >
                We'd love to hear from you. Whether you're looking to advertise your property, explore partnership opportunities, or need assistance with your CommercialUK account, our team is here for you.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 400,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  color: '#000000',
                  fontFamily: `'Inter', 'Montserrat', sans-serif`,
                  lineHeight: 1.6,
                  mt: 3,
                  opacity: 0.85
                }}
              >
                Contact the relevant department below and let us make your property objectives a reality.
              </Typography>
            </Box>

            {/* Right Side - Image with C-type curve */}
            <Box
              sx={{
                display: { xs: 'none', md: 'block' },
                position: 'relative',
                height: '100%',
                minHeight: '500px',
                width: '100%',
                overflow: 'visible',
                alignSelf: 'stretch'
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  // clipPath: 'circle(94.4% at 99% 47%)',
                  borderRadius: '0 0 0 30px'
                }}
              >
                <Box
                  component="img"
                  src="https://www.shutterstock.com/image-photo/young-businesswoman-using-smart-phone-600nw-1936412359.jpg"
                  alt="Customer service representative"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    borderRadius: '20px'
                  }}
                />
              </Box>
            </Box>
          </Box>
        {/* </Container> */}
      </Box>

      {/* Main Content - Two Columns */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 4, md: 6 },
            position: 'relative',
            marginTop:"-113px"
          }}
        >
          {/* Advertise with us Card */}
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: '1px solid rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                transform: 'translateY(-4px)'
              },
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ mb: 3 }}>
                <Campaign
                  sx={{
                    fontSize: 48,
                    color: '#666666',
                    mb: 2
                  }}
                />
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#333333',
                    fontFamily: `'Montserrat', 'Inter', sans-serif`,
                    mb: 2
                  }}
                >
                  Advertise with us
                </Typography>
              </Box>

              <Stack spacing={2} sx={{ flexGrow: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: `'Inter', 'Montserrat', sans-serif`,
                    fontWeight: 400,
                    lineHeight: 1.7,
                    color: '#666666',
                    fontSize: '1rem'
                  }}
                >
                  Connect with our Commercial UK property marketing team and discover bespoke advertising solutions to enhance your brand and maximize exposure.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: `'Inter', 'Montserrat', sans-serif`,
                    fontWeight: 400,
                    lineHeight: 1.7,
                    color: '#666666',
                    fontSize: '1rem'
                  }}
                >
                  We offer flexible packages, premium placements, and data-driven insights to make your listings stand out in the competitive marketplace.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: `'Inter', 'Montserrat', sans-serif`,
                    fontWeight: 400,
                    lineHeight: 1.7,
                    color: '#666666',
                    fontSize: '1rem'
                  }}
                >
                  Let's build a marketing strategy that works for you.
                </Typography>
              </Stack>

              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    backgroundColor: '#f2c514',
                    color: '#000000',
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontFamily: `'Inter', 'Montserrat', sans-serif`,
                    textTransform: 'none',
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: '#c9a010'
                    }
                  }}
                >
                  Connect with Us
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Get Support Card */}
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: '1px solid rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                transform: 'translateY(-4px)'
              },
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ mb: 3 }}>
                <SupportAgent
                  sx={{
                    fontSize: 48,
                    color: '#666666',
                    mb: 2
                  }}
                />
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#333333',
                    fontFamily: `'Montserrat', 'Inter', sans-serif`,
                    mb: 2
                  }}
                >
                  Get Support
                </Typography>
              </Box>

              <Stack spacing={2} sx={{ flexGrow: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: `'Inter', 'Montserrat', sans-serif`,
                    fontWeight: 400,
                    lineHeight: 1.7,
                    color: '#666666',
                    fontSize: '1rem'
                  }}
                >
                  We are here to make your CommercialUK experience smooth and stress-free.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: `'Inter', 'Montserrat', sans-serif`,
                    fontWeight: 400,
                    lineHeight: 1.7,
                    color: '#666666',
                    fontSize: '1rem'
                  }}
                >
                  Our dedicated support team is ready to help with everything from managing your listings, updating your business details, to resolving any billing issues, account access, and technical queries.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: `'Inter', 'Montserrat', sans-serif`,
                    fontWeight: 400,
                    lineHeight: 1.7,
                    color: '#666666',
                    fontSize: '1rem'
                  }}
                >
                  Reach out today, and let us get you back on track in no time.
                </Typography>
              </Stack>

              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    backgroundColor: '#f2c514',
                    color: '#000000',
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontFamily: `'Inter', 'Montserrat', sans-serif`,
                    textTransform: 'none',
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: '#c9a010'
                    }
                  }}
                >
                  Get Help
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Page>
  );
};

export default ContactUs;
