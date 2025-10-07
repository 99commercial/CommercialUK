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
import LoginForm from '../../sections/auth/loginForm';

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

const FeatureCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: 16,
  background: 'linear-gradient(145deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
  border: '1px solid rgba(220, 38, 38, 0.3)',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(10px)',
  position: 'relative',
  minHeight: '160px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  [theme.breakpoints.up('sm')]: {
    minHeight: '180px',
    padding: theme.spacing(3),
  },
  [theme.breakpoints.up('md')]: {
    minHeight: '200px',
    padding: theme.spacing(3.5),
  },
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 30px -8px rgba(220, 38, 38, 0.4)',
    borderColor: 'rgba(220, 38, 38, 0.5)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    background: 'linear-gradient(145deg, rgba(220, 38, 38, 0.1), rgba(220, 38, 38, 0.05))',
    pointerEvents: 'none',
  },
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  width: 50,
  height: 50,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: 12,
  color: 'white',
  fontSize: 20,
  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.up('sm')]: {
    width: 55,
    height: 55,
    marginBottom: 14,
    fontSize: 22,
  },
  [theme.breakpoints.up('md')]: {
    width: 60,
    height: 60,
    marginBottom: 16,
    fontSize: 24,
  },
}));

const InfiniteScrollContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflow: 'hidden',
  width: '100%',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.8) 100%)',
    zIndex: 2,
    pointerEvents: 'none',
  },
}));

const ScrollingContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  animation: 'scroll 20s linear infinite',
  gap: theme.spacing(1.5),
  '@keyframes scroll': {
    '0%': {
      transform: 'translateX(0)',
    },
    '100%': {
      transform: 'translateX(-50%)',
    },
  },
  '&:hover': {
    animationPlayState: 'paused',
  },
}));

export default function LoginPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: '🏢',
      title: 'Property Management',
      description: 'Comprehensive property portfolio management tools',
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Real-time insights and performance metrics',
    },
    {
      icon: '🔒',
      title: 'Secure Platform',
      description: 'Enterprise-grade security for your data',
    },
    {
      icon: '🤝',
      title: 'Client Relations',
      description: 'Streamlined communication and collaboration',
    },
    {
      icon: '📈',
      title: 'Growth Tools',
      description: 'Advanced tools to scale your business',
    },
    {
      icon: '💼',
      title: 'Investment Tools',
      description: 'Smart investment analysis and recommendations',
    },
    {
      icon: '📱',
      title: 'Mobile App',
      description: 'Access your portfolio anywhere, anytime',
    },
    {
      icon: '🌐',
      title: 'Global Reach',
      description: 'Connect with international property markets',
    },
  ];

  // Create duplicated features for infinite scroll
  const duplicatedFeatures = [...features, ...features];

  return (
    <ThemeProvider theme={theme}>
      <HeroSection>
        {/* Floating decorative elements */}
        <FloatingElement />
        <FloatingElement />
        <FloatingElement />
        <FloatingElement />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',   
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'stretch', md: 'center' },
                minHeight: '100vh',
                py: { xs: 10, sm: 13, md: 16 },
                px: { xs: 1, sm: 2 },
                gap: { xs: 8, sm: 9, md: 10 },
              }}
            >
              {/* Left side - Branding and Features */}
              <Box sx={{ flex: 1, width: { xs: '100%', md: '50%' } }}>
                <Fade in timeout={1000}>
                  <Box>
                    <Typography
                      variant="h2"
                      component="h1"
                      sx={{
                        color: 'white',
                        fontWeight: 700,
                        mb: { xs: 1.5, sm: 2 },
                        textShadow: '0 4px 8px rgba(0, 0, 0, 0.5), 0 0 20px rgba(220, 38, 38, 0.3)',
                        filter: 'drop-shadow(0 0 10px rgba(220, 38, 38, 0.2))',
                        fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                        textAlign: { xs: 'center', md: 'left' },
                      }}
                    >
                      99Commercial
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.95)',
                        mb: { xs: 2, sm: 3, md: 4 },
                        fontWeight: 300,
                        lineHeight: 1.6,
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                        fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.5rem' },
                        textAlign: { xs: 'center', md: 'left' },
                      }}
                    >
                      Your trusted partner in commercial real estate. 
                      Connect, manage, and grow your property portfolio with our 
                      comprehensive platform.
                    </Typography>

                    <Box
                      sx={{
                        display: { xs: 'none', lg: 'block' },
                        mt: 10,
                        mb: 4,
                      }}
                    >
                      <InfiniteScrollContainer>
                        <ScrollingContent>
                          {duplicatedFeatures.map((feature, index) => (
                            <Box key={`${feature.title}-${index}`} sx={{ minWidth: '280px', flexShrink: 0 }}>
                              <FeatureCard>
                                <FeatureIcon>
                                  <Typography variant="body1">{feature.icon}</Typography>
                                </FeatureIcon>
                                <Typography 
                                  variant="body2" 
                                  gutterBottom 
                                  sx={{ 
                                    color: 'white', 
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    position: 'relative',
                                    zIndex: 1,
                                    mb: 1,
                                    lineHeight: 1.3,
                                  }}
                                >
                                  {feature.title}
                                </Typography>
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontSize: '0.8rem',
                                    position: 'relative',
                                    zIndex: 1,
                                    lineHeight: 1.2,
                                  }}
                                >
                                  {feature.description}
                                </Typography>
                              </FeatureCard>
                            </Box>
                          ))}
                        </ScrollingContent>
                      </InfiniteScrollContainer>
                    </Box>
                  </Box>
                </Fade>
              </Box>

              {/* Right side - Login Form */}
              <Box sx={{ 
                flex: 1, 
                width: { xs: '100%', md: '100%' },
                display: 'flex',
                justifyContent: 'center',
                alignItems: { xs: 'stretch', md: 'center' },
              }}>
                <Slide direction="left" in timeout={1200}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'center',
                      width: '100%',
                      maxWidth: { xs: '100%', sm: '100%', md: '100%' },
                      filter: 'drop-shadow(0 0 30px rgba(220, 38, 38, 0.2))',
                    }}
                  >
                    <OuterCard
                      sx={{
                        width: '100%',
                        padding: { xs: 1, sm: 1.5, md: 2 },
                        mt: { xs: 2, sm: 3, md: 4 },
                      }}
                    >
                      <ContentCard 
                        elevation={0}
                        sx={{
                          padding: { xs: 2, sm: 3, md: 4 },
                        }}
                      >
                        <LoginForm />
                      </ContentCard>
                    </OuterCard>
                  </Box>
                </Slide>
              </Box>

          </Box>
        </Container>

        {/* Mobile Features Section */}
        {isMobile && (
          <Box sx={{ py: { xs: 3, sm: 4 }, bgcolor: '#000000' }}>
            <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
              <Typography
                variant="h4"
                component="h2"
                textAlign="center"
                gutterBottom
                sx={{ 
                  color: 'white', 
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                }}
              >
                Why Choose 99Commercial?
              </Typography>
              <InfiniteScrollContainer>
                <ScrollingContent
                  sx={{
                    animation: 'scroll 15s linear infinite',
                    gap: { xs: 1, sm: 1.5 },
                  }}
                >
                  {duplicatedFeatures.map((feature, index) => (
                    <Box key={`mobile-${feature.title}-${index}`} sx={{ minWidth: { xs: '200px', sm: '220px' }, flexShrink: 0 }}>
                      <FeatureCard>
                        <FeatureIcon>
                          <Typography variant="body1">{feature.icon}</Typography>
                        </FeatureIcon>
                        <Typography 
                          variant="body2" 
                          gutterBottom 
                          sx={{ 
                            color: 'white', 
                            fontWeight: 600,
                            fontSize: { xs: '0.85rem', sm: '0.9rem' },
                            position: 'relative',
                            zIndex: 1,
                            mb: { xs: 0.5, sm: 0.75 },
                            lineHeight: 1.3,
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            position: 'relative',
                            zIndex: 1,
                            lineHeight: 1.2,
                            display: { xs: 'none', sm: 'block' },
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </FeatureCard>
                    </Box>
                  ))}
                </ScrollingContent>
              </InfiniteScrollContainer>
            </Container>
          </Box>
        )}
      </HeroSection>
    </ThemeProvider>
  );
}
