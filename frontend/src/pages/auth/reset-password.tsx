import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Stack,
} from '@mui/material';
import { styled, ThemeProvider } from '@mui/material/styles';
import theme from '../../theme/theme';
import ResetPasswordForm from '../../sections/auth/resetPasswordForm';

// Styled components for enhanced visual appeal
const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: `
    linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)),
    url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80')
  `,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23dc2626" fill-opacity="0.15"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    animation: 'float 20s ease-in-out infinite',
  },
  '@keyframes float': {
    '0%, 100%': {
      transform: 'translateY(0px)',
    },
    '50%': {
      transform: 'translateY(-20px)',
    },
  },
}));

const FloatingElement = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: 'linear-gradient(45deg, #dc2626, #991b1b)',
  opacity: 0.1,
  animation: 'float 6s ease-in-out infinite',
  '&:nth-of-type(1)': {
    width: 100,
    height: 100,
    top: '10%',
    left: '10%',
    animationDelay: '0s',
  },
  '&:nth-of-type(2)': {
    width: 150,
    height: 150,
    top: '20%',
    right: '15%',
    animationDelay: '2s',
  },
  '&:nth-of-type(3)': {
    width: 80,
    height: 80,
    bottom: '20%',
    left: '20%',
    animationDelay: '4s',
  },
  '&:nth-of-type(4)': {
    width: 120,
    height: 120,
    bottom: '10%',
    right: '10%',
    animationDelay: '1s',
  },
}));

const ContentCard = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(145deg, #1f2937 0%, #111827 100%)',
  borderRadius: 24,
  padding: theme.spacing(4),
  boxShadow: `
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(220, 38, 38, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1)
  `,
  border: '1px solid rgba(220, 38, 38, 0.3)',
  backdropFilter: 'blur(10px)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    background: 'linear-gradient(145deg, rgba(220, 38, 38, 0.1), rgba(220, 38, 38, 0.05))',
    pointerEvents: 'none',
  },
}));

const OuterCard = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(145deg, #374151 0%, #1f2937 100%)',
  borderRadius: 32,
  padding: theme.spacing(2),
  boxShadow: `
    0 35px 60px -12px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(220, 38, 38, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1)
  `,
  border: '1px solid rgba(220, 38, 38, 0.4)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 32,
    background: 'linear-gradient(145deg, rgba(220, 38, 38, 0.15), rgba(220, 38, 38, 0.05))',
    pointerEvents: 'none',
  },
}));

export default function ResetPasswordPage() {
  const theme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <HeroSection>
          {/* Floating decorative elements */}
          <FloatingElement />
          <FloatingElement />
          <FloatingElement />
          <FloatingElement />

          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: { xs: 2, sm: 0 } }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',   
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                px: { xs: 1, sm: 2 },
                maxHeight: { xs: 'calc(100vh - 32px)', sm: '100vh' },
                overflow: 'auto',
              }}
            >
              <Slide direction="left" in timeout={1200}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    width: '100%',
                    maxWidth: { xs: '100%', sm: '500px', md: '600px' },
                    filter: 'drop-shadow(0 0 30px rgba(220, 38, 38, 0.2))',
                    maxHeight: { xs: 'calc(100vh - 64px)', sm: 'none' },
                  }}
                >
                  <OuterCard
                    sx={{
                      width: '100%',
                      padding: { xs: 0.5, sm: 1.5, md: 2 },
                      maxHeight: { xs: 'calc(100vh - 80px)', sm: 'none' },
                      overflow: 'auto',
                    }}
                  >
                    <ContentCard 
                      elevation={0}
                      sx={{
                        padding: { xs: 1.5, sm: 3, md: 4 },
                        maxHeight: { xs: 'calc(100vh - 120px)', sm: 'none' },
                        overflow: 'auto',
                      }}
                    >
                      <ResetPasswordForm />
                    </ContentCard>
                  </OuterCard>
                </Box>
              </Slide>

            </Box>
          </Container>
        </HeroSection>
    </ThemeProvider>
  );
}
