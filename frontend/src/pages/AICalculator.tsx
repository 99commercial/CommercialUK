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

const SubscriptionCard = styled(Card)(({ theme }) => ({
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

const CreditsCard = styled(Card)(({ theme }) => ({
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

const PlansButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5, 4),
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'none',
  backgroundColor: '#f2c514',
  color: '#000000',
  '&:hover': {
    backgroundColor: '#f4d03f',
  },
}));

// ----------------------------------------------------------------------

AICalculator.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

// ----------------------------------------------------------------------

type AgentSubscriptionOverlay = 'subscription_redirect' | 'subscription_required' | null;

export default function AICalculator() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [agentSubscriptionOverlay, setAgentSubscriptionOverlay] = useState<AgentSubscriptionOverlay>(null);
  const [showUserCreditsDialog, setShowUserCreditsDialog] = useState(false);

  useEffect(() => {
    const checkAuthentication = () => {
      if (typeof window !== 'undefined') {
        const userString = localStorage.getItem('user');
        if (!userString) {
          setIsAuthenticated(false);
          setAgentSubscriptionOverlay(null);
          setShowUserCreditsDialog(false);
          return;
        }
        try {
          const userData = JSON.parse(userString);
          setIsAuthenticated(userData != null);

          if (!userData) {
            setShowUserCreditsDialog(false);
            setAgentSubscriptionOverlay(null);
            return;
          }

          // Only for agents: check subscription
          if (userData?.role === 'agent') {
            const subscription = userData?.subscription ?? null;

            if (subscription === null) {
              setAgentSubscriptionOverlay('subscription_redirect');
              return;
            }

            const endDate = subscription.endDate ? new Date(subscription.endDate) : null;
            if (!endDate || isNaN(endDate.getTime())) {
              setAgentSubscriptionOverlay('subscription_required');
              return;
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);

            if (endDate.getTime() <= today.getTime()) {
              setAgentSubscriptionOverlay('subscription_required');
              return;
            }
            if (subscription.isExpired === true) {
              setAgentSubscriptionOverlay('subscription_required');
              return;
            }

            setAgentSubscriptionOverlay(null);
            setShowUserCreditsDialog(false);
          } else if (userData?.role === 'user') {
            // Only for users: check report_count
            const reportCount = userData?.report_count ?? 0;
            if (reportCount <= 0) {
              setShowUserCreditsDialog(true);
            } else {
              setShowUserCreditsDialog(false);
            }
            setAgentSubscriptionOverlay(null);
          } else {
            setAgentSubscriptionOverlay(null);
            setShowUserCreditsDialog(false);
          }
        } catch (error) {
          setIsAuthenticated(false);
          setAgentSubscriptionOverlay(null);
          setShowUserCreditsDialog(false);
        }
      }
    };

    checkAuthentication();

    window.addEventListener('storage', checkAuthentication);
    const interval = setInterval(checkAuthentication, 1000);

    return () => {
      window.removeEventListener('storage', checkAuthentication);
      clearInterval(interval);
    };
  }, []);

  // Redirect agent to plans page when subscription is null
  useEffect(() => {
    if (typeof window === 'undefined') return;
  }, [agentSubscriptionOverlay, router]);

  const handleLoginRedirect = () => {
    router.push('/auth/login');
  };

  const handlePlansRedirect = () => {
    router.push('/agent/payment/plans-page');
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

        {(agentSubscriptionOverlay === 'subscription_redirect' || agentSubscriptionOverlay === 'subscription_required') && (
          <BlurOverlay>
            <SubscriptionCard>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Subscription Required
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                Please subscribe to a plan to access the AI Calculator
              </Typography>
              <PlansButton
                variant="contained"
                fullWidth
                onClick={handlePlansRedirect}
              >
                Go to Plans
              </PlansButton>
            </SubscriptionCard>
          </BlurOverlay>
        )}

        {showUserCreditsDialog && (
          <BlurOverlay>
            <CreditsCard>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Insufficient Credits
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                No enough credits for evaluation report generation
              </Typography>
            </CreditsCard>
          </BlurOverlay>
        )}
      </Container>
    </Page>
  );
}

