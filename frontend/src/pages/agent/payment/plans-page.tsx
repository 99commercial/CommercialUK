import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  PostAdd as PostAddIcon,
  Assessment as AssessmentIcon,
  Business as BusinessIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Page } from '../../../components';
import PaymentForm from '../../../components/payment/PaymentForm';
import axiosInstance from '../../../utils/axios';

interface DiscountData {
  code: string;
  discount_percentage: number;
  expiry_date: string | null;
  usage_count: number;
  max_usage: number | null;
  is_active: boolean;
}

// ----------------------------------------------------------------------

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  background: 'linear-gradient(135deg, rgba(242, 197, 20, 0.95) 0%, rgba(242, 197, 20, 0.85) 100%), url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200) center/cover no-repeat',
  padding: theme.spacing(8, 0),
  color: '#000',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
}));

const PlanCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.spacing(3),
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(242, 197, 20, 0.1)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 30px 80px rgba(242, 197, 20, 0.25), 0 0 0 1px rgba(242, 197, 20, 0.2)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: 'linear-gradient(90deg, #f2c514 0%, #f4d03f 50%, #f2c514 100%)',
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  background: 'linear-gradient(135deg, rgba(242, 197, 20, 0.1) 0%, rgba(242, 197, 20, 0.05) 100%)',
  border: '1px solid rgba(242, 197, 20, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(242, 197, 20, 0.15)',
    borderColor: 'rgba(242, 197, 20, 0.4)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.spacing(2),
  textTransform: 'none',
  fontSize: '1.1rem',
  fontWeight: 600,
  background: 'linear-gradient(135deg, #f2c514 0%, #f4d03f 100%)',
  color: '#000',
  boxShadow: '0 8px 16px rgba(242, 197, 20, 0.3)',
  '&:hover': {
    background: 'linear-gradient(135deg, #f4d03f 0%, #f2c514 100%)',
    boxShadow: '0 12px 24px rgba(242, 197, 20, 0.4)',
    transform: 'translateY(-2px)',
  },
}));

const HighlightBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(242, 197, 20, 0.15) 0%, rgba(242, 197, 20, 0.05) 100%)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  border: '2px dashed rgba(242, 197, 20, 0.4)',
  margin: theme.spacing(2, 0),
}));

const LimitedOfferBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  background: 'linear-gradient(135deg, #ff4444 0%, #ff6666 100%)',
  color: '#fff',
  padding: theme.spacing(1.5, 2.5),
  borderRadius: theme.spacing(1.5),
  boxShadow: '0 4px 12px rgba(255, 68, 68, 0.4)',
  zIndex: 10,
  transform: 'rotate(5deg)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    background: 'linear-gradient(135deg, #ff6666 0%, #ff4444 100%)',
    borderRadius: theme.spacing(1.5),
    zIndex: -1,
    opacity: 0.3,
  },
}));

// ----------------------------------------------------------------------

const PlansPage: NextPage = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [subscriptionAmount] = useState(25); // Monthly subscription amount
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [canAccessPlansPage, setCanAccessPlansPage] = useState<boolean | null>(null);
  const [discountCode, setDiscountCode] = useState<string>('');
  const [discountData, setDiscountData] = useState<DiscountData | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [validatingDiscount, setValidatingDiscount] = useState(false);

  // Calculate discounted amount
  const finalAmount = discountData && discountData.discount_percentage > 0
    ? subscriptionAmount - (subscriptionAmount * discountData.discount_percentage / 100)
    : subscriptionAmount;

  // Subscription check: allow plans page only when user has no active plan
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const userString = localStorage.getItem('user');
      if (!userString) {
        setCanAccessPlansPage(true);
        return;
      }

      const user = JSON.parse(userString);
      const subscription = user?.subscription ?? null;

      // If subscription is null, allow (user needs to subscribe)
      if (subscription === null) {
        setCanAccessPlansPage(true);
        return;
      }

      // If isExpired is true, allow (user needs to resubscribe)
      if (subscription.isExpired === true) {
        setCanAccessPlansPage(true);
        return;
      }

      // Check endDate: if today or in the past, allow (subscription ended, need to resubscribe)
      const endDate = subscription.endDate ? new Date(subscription.endDate) : null;
      if (!endDate || isNaN(endDate.getTime())) {
        setCanAccessPlansPage(true);
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      // endDate is today or in the past → allow
      if (endDate.getTime() <= today.getTime()) {
        setCanAccessPlansPage(true);
        return;
      }

      // endDate is ahead of today → active plan → redirect to /agent
      enqueueSnackbar("Currently a plan is running so you can't access this page", { variant: 'error' });
      router.replace('/agent');
    } catch (error) {
      console.error('Error checking subscription:', error);
      setCanAccessPlansPage(true);
    }
  }, [router, enqueueSnackbar]);

  // Handle payment success redirect (for Amazon Pay, Revolut Pay, etc.)
  useEffect(() => {
    if (router.query.payment_success === 'true') {
      enqueueSnackbar('Payment successful! Your subscription is now active.', {
        variant: 'success',
      });
      // Clean up the URL
      router.replace(router.pathname, undefined, { shallow: true });
    }
  }, [router.query.payment_success, router, enqueueSnackbar]);

  // Apply discount code
  const applyDiscountCode = async (code: string) => {
    if (!code || code.trim() === '') {
      setDiscountData(null);
      setDiscountError(null);
      return;
    }

    try {
      setValidatingDiscount(true);
      setDiscountError(null);
      
      const response = await axiosInstance.post('/api/payment/apply-discount-code', {
        code: code.trim().toUpperCase(),
      });

      if (response.data.success && response.data.expiryStatus && response.data.data) {
        // Discount code is valid and not expired
        const discountPercentage = response.data.data.discount_percentage;
        const discountAmount = (subscriptionAmount * discountPercentage) / 100;
        const newPrice = subscriptionAmount - discountAmount;
        
        setDiscountData(response.data.data);
        setDiscountError(null);
        
        // Show success snackbar
        enqueueSnackbar(
          `${discountPercentage}% discount applied! You save £${discountAmount.toFixed(2)}. New price: £${newPrice.toFixed(2)}`,
          { variant: 'success', autoHideDuration: 5000 }
        );
      } else {
        // Discount code is invalid, expired, or max limit reached
        setDiscountData(null);
        const errorMsg = response.data.message || 'Invalid discount code';
        setDiscountError(errorMsg);
        enqueueSnackbar(errorMsg, { variant: 'error', autoHideDuration: 4000 });
      }
    } catch (err: any) {
      setDiscountData(null);
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to validate discount code';
      setDiscountError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error', autoHideDuration: 4000 });
    } finally {
      setValidatingDiscount(false);
    }
  };

  const handleDiscountCodeChange = (value: string) => {
    setDiscountCode(value);
    if (value.trim() === '') {
      setDiscountData(null);
      setDiscountError(null);
      if (discountData) {
        enqueueSnackbar('Discount code removed', { variant: 'info' });
      }
    }
  };

  const handleApplyDiscount = () => {
    if (discountCode.trim()) {
      applyDiscountCode(discountCode);
    }
  };



  const features = [
    {
      icon: <PostAddIcon sx={{ fontSize: 40, color: '#f2c514' }} />,
      title: 'Unlimited Comprehensive Reports',
      description: 'Generate as many comprehensive reports as you want throughout the month. No limits, no restrictions.',
    },
    {
      icon: <AssessmentIcon sx={{ fontSize: 40, color: '#f2c514' }} />,
      title: '100 commercial property listings',
      description: 'List up to 100 commercial properties throughout the month. No limits, no restrictions.',
    },
    {
      icon: <BusinessIcon sx={{ fontSize: 40, color: '#f2c514' }} />,
      title: 'Full access to all CommercialUK features and tools',
      description: 'Full access to all CommercialUK features and tools for one complete month. No limits, no restrictions.',
    },
  ];

  const planBenefits = [
    'Unlimited comprehensive reports for 30 days',
    '100 commercial property listings included',
    'Priority customer support',
    'Access to all CommercialUK features',
    'Market insights and analytics',
    'Professional property management tools',
    'Enhanced property visibility',
    'No hidden fees or charges',
  ];

  return (
    <Page title="Subscription Plans - CommercialUK">
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        {canAccessPlansPage === null && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <Stack spacing={2} alignItems="center">
              <CircularProgress />
              <Typography variant="body1" color="text.secondary">Checking subscription...</Typography>
            </Stack>
          </Box>
        )}
        {canAccessPlansPage === true && (
        <>
        {/* Hero Section */}
        <HeroSection>
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Chip
                icon={<StarIcon />}
                label="Premium Plan"
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  color: '#f2c514',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  padding: '8px 16px',
                }}
              />
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.2,
                  color: '#000',
                  maxWidth: '800px',
                }}
              >
                Unlock Unlimited Property Posting & Reports
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  maxWidth: '700px',
                  color: '#333',
                  fontWeight: 400,
                  opacity: 0.9,
                }}
              >
                Get full access to CommercialUK with unlimited property postings and 3 comprehensive reports for one month
              </Typography>
            </Stack>
          </Container>
        </HeroSection>

        {/* Main Content */}
        <Box sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, sm: 3, md: 4 } }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
              gap: 4,
            }}
          >
            {/* Plan Details Card */}
            <Box>
              <PlanCard>
                <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#1a1a1a' }}>
                        Monthly Subscription Plan
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#666', fontSize: '1.1rem' }}>
                        Perfect for property professionals and businesses looking to maximize their reach
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Key Features */}
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1a1a1a' }}>
                        What's Included
                      </Typography>
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                          gap: 3,
                        }}
                      >
                        {features.map((feature, index) => (
                          <FeatureCard key={index}>
                            <Stack spacing={2} alignItems="center" textAlign="center">
                              {feature.icon}
                              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                                {feature.title}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
                                {feature.description}
                              </Typography>
                            </Stack>
                          </FeatureCard>
                        ))}
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Benefits List */}
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1a1a1a' }}>
                        Complete Benefits Package
                      </Typography>
                      <List>
                        {planBenefits.map((benefit, index) => (
                          <ListItem key={index} sx={{ px: 0, py: 1 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <CheckCircleIcon sx={{ color: '#f2c514', fontSize: 28 }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={benefit}
                              primaryTypographyProps={{
                                sx: { fontSize: '1rem', fontWeight: 500, color: '#333' },
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>

                    <HighlightBox>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <BusinessIcon sx={{ fontSize: 32, color: '#f2c514' }} />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 0.5 }}>
                            Available at CommercialUK
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            All features and benefits are accessible through your CommercialUK account
                          </Typography>
                        </Box>
                      </Stack>
                    </HighlightBox>
                  </Stack>
                </CardContent>
              </PlanCard>
            </Box>

            {/* Pricing & CTA Card */}
            <Box>
              <PlanCard sx={{ position: 'sticky', top: 100 }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack spacing={3} alignItems="center" textAlign="center">
                    <Box>
                      {discountData ? (
                        <>
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              fontWeight: 600, 
                              color: '#999', 
                              textDecoration: 'line-through',
                              mb: 0.5 
                            }}
                          >
                            £{subscriptionAmount.toFixed(2)}
                          </Typography>
                          <Typography variant="h3" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 1 }}>
                            £{finalAmount.toFixed(2)}
                          </Typography>
                          <Chip
                            label={`${discountData.discount_percentage}% OFF`}
                            sx={{
                              backgroundColor: '#4caf50',
                              color: '#fff',
                              fontWeight: 600,
                              mb: 1,
                            }}
                          />
                        </>
                      ) : (
                        <Typography variant="h3" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 1 }}>
                          £{finalAmount.toFixed(2)}
                        </Typography>
                      )}
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
                        One Month
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#999', fontSize: '0.9rem' }}>
                        Full access for 30 days
                      </Typography>
                    </Box>

                    <Divider sx={{ width: '100%' }} />

                    {/* Discount Code Section */}
                    <Box sx={{ width: '100%' }}>
                      <TextField
                        fullWidth
                        label="Discount Code (Optional)"
                        value={discountCode}
                        onChange={(e) => handleDiscountCodeChange(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleApplyDiscount();
                          }
                        }}
                        placeholder="Enter discount code"
                        size="small"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {validatingDiscount ? (
                                <CircularProgress size={20} />
                              ) : discountData ? (
                                <CheckCircle color="success" />
                              ) : discountError ? (
                                <Cancel color="error" />
                              ) : discountCode.trim() ? (
                                <IconButton
                                  size="small"
                                  onClick={handleApplyDiscount}
                                  disabled={!discountCode.trim()}
                                >
                                  <Typography variant="caption">Apply</Typography>
                                </IconButton>
                              ) : null}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>

                    <Divider sx={{ width: '100%' }} />

                    <Box sx={{ width: '100%' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1a1a1a' }}>
                        Subscription Includes:
                      </Typography>
                      <Stack spacing={2} alignItems="flex-start">
                        <Stack direction="row" spacing={2} alignItems="center">
                          <CheckCircleIcon sx={{ color: '#f2c514', fontSize: 24 }} />
                          <Typography variant="body2" sx={{ color: '#333' }}>
                            Unlimited Comprehensive Reports
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <CheckCircleIcon sx={{ color: '#f2c514', fontSize: 24 }} />
                          <Typography variant="body2" sx={{ color: '#333' }}>
                            100 commercial property listings
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <CheckCircleIcon sx={{ color: '#f2c514', fontSize: 24 }} />
                          <Typography variant="body2" sx={{ color: '#333' }}>
                            CommercialUK Platform Access
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>

                    <Divider sx={{ width: '100%' }} />

                    <StyledButton
                      fullWidth
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => setPaymentDialogOpen(true)}
                    >
                      Get Started Now
                    </StyledButton>

                    <Typography variant="caption" sx={{ color: '#999', textAlign: 'center', lineHeight: 1.6 }}>
                      Secure payment powered by Stripe
                    </Typography>
                  </Stack>
                </CardContent>
              </PlanCard>
            </Box>
          </Box>
        </Box>

        {/* Payment Form Dialog */}
        <PaymentForm
          open={paymentDialogOpen}
          onClose={() => {
            setPaymentDialogOpen(false);
            // Reset discount when dialog closes
            setDiscountCode('');
            setDiscountData(null);
            setDiscountError(null);
          }}
          amount={finalAmount}
          onSuccess={() => {
            // Handle successful payment - you can add redirect or success message here
            console.log('Payment successful!');
            // Reset discount after successful payment
            setDiscountCode('');
            setDiscountData(null);
            setDiscountError(null);
          }}
        />
        </>
        )}
      </Box>
    </Page>
  );
};

export default PlansPage;
