import { useState, useEffect } from 'react';
import { Box, Card, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { useRouter } from 'next/router';
import MainLayout from '../layouts/Main/MainLayout';
import Page from '../components/Page';
import CalculatorForm from '../sections/AI/CalculatorForm';

// ----------------------------------------------------------------------

const Container = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#ffffff',
  position: 'relative',
  overflow: 'hidden',
}));

const LogoBackdrop = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 0,
  opacity: 0.15,
  pointerEvents: 'none',
  width: '600px',
  height: 'auto',
  maxWidth: '80vw',
  [theme.breakpoints.down('md')]: {
    width: '400px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '300px',
  },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  flex: 1,
  overflow: 'hidden',
}));

const BlurOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
}));

const LoginCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: '600px',
  width: '90%',
  textAlign: 'center',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#ffffff',
  zIndex: 1001,
  transform: 'translateY(-70%)',
}));

const LoginButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5, 4),
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'none',
  backgroundColor: '#000000',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#1a1a1a',
  },
}));

// ----------------------------------------------------------------------

AICalculator.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

// ----------------------------------------------------------------------

export default function AICalculator() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthentication = () => {
      if (typeof window !== 'undefined') {
        const userString = localStorage.getItem('user');
        if (userString) {
          try {
            const userData = JSON.parse(userString);
            setIsAuthenticated(userData !== null && userData !== undefined);
          } catch (error) {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      }
    };

    checkAuthentication();

    // Listen for storage changes (e.g., when user logs in/out in another tab)
    window.addEventListener('storage', checkAuthentication);
    
    // Also check periodically in case localStorage is updated in the same tab
    const interval = setInterval(checkAuthentication, 1000);

    return () => {
      window.removeEventListener('storage', checkAuthentication);
      clearInterval(interval);
    };
  }, []);

  const handleLoginRedirect = () => {
    router.push('/auth/login');
  };

  // Show nothing while checking authentication
  if (isAuthenticated === null) {
    return (
      <Page title="AI Calculator">
        <Container>
          <ContentWrapper>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
              <Typography>Loading...</Typography>
            </Box>
          </ContentWrapper>
        </Container>
      </Page>
    );
  }

  return (
    <Page title="AI Calculator">
      <Container>
        <LogoBackdrop>
          <Image
            src="/images/CommercialUK2.png"
            alt="CommercialUK Logo"
            width={600}
            height={200}
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
            }}
            priority
          />
        </LogoBackdrop>
        
        <ContentWrapper>
          <CalculatorForm />
        </ContentWrapper>

        {!isAuthenticated && (
          <BlurOverlay>
            <LoginCard>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Login Required
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                Please login first to access the AI Calculator
              </Typography>
              <LoginButton
                variant="contained"
                fullWidth
                onClick={handleLoginRedirect}
              >
                Go to Login
              </LoginButton>
            </LoginCard>
          </BlurOverlay>
        )}
      </Container>
    </Page>
  );
}

