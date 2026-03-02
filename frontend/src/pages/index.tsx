import Head from 'next/head';
import { keyframes } from '@emotion/react';
// @mui
import { Box, Typography } from '@mui/material';

// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
  100% { transform: translateY(0px); }
`;

// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <Page title="Coming Soon | CommercialUK">
      <Head>
        <title>Commercial UK - Coming Soon</title>
      </Head>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f3f3f3, #e8e8e8)',
          textAlign: 'center',
          color: '#222',
          position: 'relative',
          px: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: 900,
            padding: { xs: 3, sm: 5 },
          }}
        >
          {/* <Box sx={{ mb: 3.75 }}>
            <Box
              component="img"
              src="/images/CUKSquare.png"
              alt="Commercial UK Logo"
              sx={{ width: 140 }}
            />
          </Box> */}

          <Typography
            component="h1"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontSize: { xs: 30, sm: 44 },
              fontWeight: 700,
              lineHeight: 1.3,
              mb: 1.875,
              color: '#222',
            }}
          >
            The Future of{' '}
            <Box component="span" sx={{ color: '#c8a74e' }}>
              Commercial Property
            </Box>
            <br />
            Launching Shortly
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: 16, sm: 18 },
              color: '#555',
              mb: 5,
            }}
          >
            Our AI-driven commercial property marketplace is coming soon.
          </Typography>

          <Box
            component="img"
            src="/images/CUKSquare.png"
            alt="Coming Soon"
            sx={{
              mt: 2.5,
              maxWidth: { xs: 260, sm: 350 },
              width: '100%',
              animation: `${float} 3s ease-in-out infinite`,
            }}
          />
        </Box>

        <Box
          component="footer"
          sx={{
            position: 'absolute',
            bottom: 20,
            width: '100%',
            fontSize: 14,
            color: '#777',
          }}
        >
          © 2026 Commercial UK. All rights reserved.
        </Box>
      </Box>
    </Page>
  );
}
