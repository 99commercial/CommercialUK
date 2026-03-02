import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { useRouter } from 'next/router';
import axiosInstance from '../../utils/axios';
import { STRIPE_PUBLISHABLE_KEY } from '../../config';
import { useSnackbar } from 'notistack';

// Initialize Stripe
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

interface PaymentFormProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  onSuccess?: () => void;
}

interface PaymentFormContentProps extends PaymentFormProps {
  clientSecret: string;
  paymentIntentId: string;
}

const PaymentFormContent: React.FC<PaymentFormContentProps> = ({
  open,
  onClose,
  amount,
  onSuccess,
  clientSecret,
  paymentIntentId,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret || !paymentIntentId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Submit the payment element to validate the form
      const { error: submitError } = await elements.submit();

      if (submitError) {
        setError(submitError.message || 'Payment form validation failed');
        enqueueSnackbar(submitError.message || 'Payment form validation failed', {
          variant: 'error',
        });
        setLoading(false);
        return;
      }

      // First, confirm with Stripe to attach the payment method and handle redirects
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}${window.location.pathname}?payment_success=true`,
        },
        redirect: 'if_required', // Only redirect if required (for Amazon Pay, Revolut Pay, etc.)
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        enqueueSnackbar(stripeError.message || 'Payment failed', { variant: 'error' });
        setLoading(false);
        return;
      }

      // Helper function to update subscription in localStorage
      const updateUserSubscription = (backendPaymentIntent: any) => {
        try {
          const userString = localStorage.getItem('user');
          if (userString) {
            const user = JSON.parse(userString);
            user.subscription = {
              startDate: backendPaymentIntent.startDate,
              endDate: backendPaymentIntent.endDate,
              reportCount: backendPaymentIntent.reportCount ?? 0,
              isExpired: backendPaymentIntent.isExpired ?? false,
              status: backendPaymentIntent.status || 'active',
              listingCount: backendPaymentIntent.listingCount ?? 100,
            };
            localStorage.setItem('user', JSON.stringify(user));
          }
        } catch (error) {
          console.error('Failed to update subscription in localStorage:', error);
        }
      };

      // If payment succeeded immediately, show success
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Also call backend API to sync the status and get subscription data
        try {
          if (paymentIntent.payment_method) {
            const backendResponse = await axiosInstance.post('/api/payment/confirm-intent', {
              paymentIntentId,
              paymentMethodId: paymentIntent.payment_method as string,
            });
            
            if (backendResponse.data.success && backendResponse.data.data.paymentIntent) {
              updateUserSubscription(backendResponse.data.data.paymentIntent);
            }
          }
        } catch (apiError) {
          // Log but don't fail - payment already succeeded
          console.error('Error syncing with backend:', apiError);
        }

        enqueueSnackbar('Payment successful! Your subscription is now active.', {
          variant: 'success',
        });
        if (onSuccess) {
          onSuccess();
        }
        onClose();
        router.push('/agent');
        return;
      }

      // If payment requires action (redirect), it will be handled by Stripe
      if (paymentIntent && paymentIntent.status === 'requires_action') {
        enqueueSnackbar('Redirecting to complete payment...', {
          variant: 'info',
        });
        return;
      }

      // For other statuses, get the payment method and call backend API
      if (paymentIntent && paymentIntent.payment_method) {
        const response = await axiosInstance.post('/api/payment/confirm-intent', {
          paymentIntentId,
          paymentMethodId: paymentIntent.payment_method as string,
        });

        if (response.data.success) {
          const { paymentIntent: backendPaymentIntent } = response.data.data;

          if (backendPaymentIntent.status === 'succeeded') {
            updateUserSubscription(backendPaymentIntent);

            enqueueSnackbar('Payment successful! Your subscription is now active.', {
              variant: 'success',
            });
            if (onSuccess) {
              onSuccess();
            }
            onClose();
            router.push('/agent');
            return;
            
          } else if (backendPaymentIntent.status === 'processing') {
            enqueueSnackbar('Payment is being processed. Please wait...', {
              variant: 'info',
            });
            // Store payment method ID for use in setTimeout
            const storedPaymentMethodId = paymentIntent.payment_method as string;
            // Poll for status update
            setTimeout(async () => {
              try {
                const statusResponse = await axiosInstance.get(
                  `/api/payment/intent/${paymentIntentId}`
                );
                if (
                  statusResponse.data.success &&
                  statusResponse.data.data.paymentIntent.status === 'succeeded'
                ) {
                  // Get full payment intent with subscription data
                  const confirmResponse = await axiosInstance.post('/api/payment/confirm-intent', {
                    paymentIntentId,
                    paymentMethodId: storedPaymentMethodId,
                  });
                  
                  if (confirmResponse.data.success && confirmResponse.data.data.paymentIntent) {
                    updateUserSubscription(confirmResponse.data.data.paymentIntent);
                  }

                  enqueueSnackbar('Payment successful! Your subscription is now active.', {
                    variant: 'success',
                  });
                  if (onSuccess) {
                    onSuccess();
                  }
                  onClose();
                  router.push('/agent');
                }
              } catch (err) {
                console.error('Error checking payment status:', err);
              }
            }, 2000);
          } else {
            setError(`Payment status: ${backendPaymentIntent.status}`);
            enqueueSnackbar(`Payment status: ${backendPaymentIntent.status}`, {
              variant: 'warning',
            });
          }
        } else {
          throw new Error(response.data.message || 'Failed to confirm payment');
        }
      } else {
        setError('Payment method not found');
        enqueueSnackbar('Payment method not found', { variant: 'error' });
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'An unexpected error occurred';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Complete Your Payment
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          Total Amount: £{amount.toFixed(2)}
        </Typography>
      </DialogTitle>

      <Divider />

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ minHeight: 200 }}>
            <PaymentElement
              options={{
                layout: 'tabs',
                paymentMethodOrder: ['card'],
              }}
            />
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 3 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={!stripe || !elements || loading || !clientSecret || !paymentIntentId}
            sx={{
              background: 'linear-gradient(135deg, #f2c514 0%, #f4d03f 100%)',
              color: '#000',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #f4d03f 0%, #f2c514 100%)',
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: '#000' }} />
            ) : (
              `Pay £${amount.toFixed(2)}`
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const createPaymentIntent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.post('/api/payment/create-intent', {
        amount: props.amount,
        metadata: {
          subscriptionType: 'monthly',
          planName: 'Monthly Subscription Plan',
        },
      });

      if (response.data.success && response.data.data.clientSecret) {
        setClientSecret(response.data.data.clientSecret);
        // Store paymentIntentId for confirmation
        if (response.data.data.paymentIntentId) {
          setPaymentIntentId(response.data.data.paymentIntentId);
        }
      } else {
        throw new Error('Failed to create payment intent');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to initialize payment';
      setError(errorMessage);
      console.error('Failed to create payment intent:', err);
      // Ensure loading is set to false so error UI can be shown
      setLoading(false);
    }
  }, [props.amount]);

  // Create payment intent when dialog opens
  useEffect(() => {
    if (props.open && props.amount > 0 && !clientSecret && !loading) {
      createPaymentIntent();
    }
  }, [props.open, props.amount, clientSecret, loading, createPaymentIntent]);

  // Reset clientSecret and paymentIntentId when dialog closes
  useEffect(() => {
    if (!props.open) {
      setClientSecret(null);
      setPaymentIntentId(null);
      setError(null);
    }
  }, [props.open]);

  if (!clientSecret || !paymentIntentId) {
    return (
      <Dialog open={props.open} onClose={props.onClose} maxWidth="sm" fullWidth>
        <DialogContent sx={{ py: 4, textAlign: 'center' }}>
          {error ? (
            <>
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
              <Button onClick={createPaymentIntent} variant="contained">
                Retry
              </Button>
            </>
          ) : (
            <>
              <CircularProgress />
              <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                Initializing payment...
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
    // PaymentElement will automatically show all payment methods enabled in Stripe dashboard
    // when using automatic_payment_methods on the payment intent
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentFormContent
        {...props}
        clientSecret={clientSecret}
        paymentIntentId={paymentIntentId}
      />
    </Elements>
  );
};

export default PaymentForm;
