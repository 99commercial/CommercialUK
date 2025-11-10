import React from 'react';
import { NextPage } from 'next';
import { Page } from '@/components';
import { Box, Button, Typography, Container, Stack, Chip } from '@mui/material';

const ContactUs: NextPage = () => {
  return (
    <Page
      title="Get in Touch with the experts | CommercialUK"
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
      <Box
          sx={{
            position: 'relative',
            py: { xs: 10, md: 16 },
            color: 'common.white',
            background:
              'linear-gradient(135deg, rgba(220,53,69,0.85) 0%, rgba(220,53,69,0.75) 100%), url(https://static.vecteezy.com/system/resources/previews/042/237/066/non_2x/flat-illustration-group-business-team-meeting-and-creative-agency-workspace-vector.jpg) center/cover no-repeat',
            borderRadius: 2,
            mb: 6
          }}
        >
          <Container maxWidth="lg">
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  lineHeight: 1.2,
                  color: 'common.white',
                  textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                GET IN TOUCH
              </Typography>
            </Stack>
          </Container>
      </Box>

      <Box sx={{ px: { xs: 2, md: 4 }, fontFamily: `'Inter', 'Montserrat', sans-serif`  }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          <Box>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                minHeight: { xs: 300, md: 420 },
                display: 'flex',
                alignItems: 'flex-end',
                p: { xs: 4, md: 5 },
                color: 'common.white',
                backgroundImage:
                  'linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)), url("https://www.salesforce.com/blog/wp-content/uploads/sites/2/2025/04/Market-Penetration-SMB.jpg?w=843")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <Box>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontFamily: `'Montserrat', 'Inter', sans-serif`, fontWeight: 800 }}>
                  Advertise with Us
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: 900, mb: 2, fontFamily: `'Inter', 'Montserrat', sans-serif`, fontWeight: 600 }}>
                  Talk to our CommercialUK property marketing experts and find out about bespoke advertising
                  solutions that enable you to connect with buyers, tenants, and investors in the UK.
                </Typography>
                <Button variant="contained" color="error">
                  Connect with us
                </Button>
              </Box>
            </Box>
          </Box>

          <Box>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                minHeight: { xs: 300, md: 420 },
                display: 'flex',
                alignItems: 'flex-end',
                p: { xs: 4, md: 5 },
                color: 'common.white',
                backgroundImage:
                  'linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)), url("https://www.salesforce.com/content/dam/web/en_us/www/images/hub/how-to-close-the-sale/list-of-most-important-customer-service-skills-header.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <Box>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontFamily: `'Montserrat', 'Inter', sans-serif`, fontWeight: 800 }}>
                  Get Support
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: 900, mb: 2, fontFamily: `'Inter', 'Montserrat', sans-serif`, fontWeight: 600 }}>
                  We’re here to help you every step of the way. Our dedicated support team can assist with
                  listings, payments, account access, and more — so you can focus on what matters most.
                </Typography>
                <Button variant="contained" color="error">
                  Get Help
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Page>
  );
};

export default ContactUs;
