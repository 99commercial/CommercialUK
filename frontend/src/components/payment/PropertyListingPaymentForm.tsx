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
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import axiosInstance from '../../utils/axios';
import { STRIPE_PUBLISHABLE_KEY } from '../../config';
import { useSnackbar } from 'notistack';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const PRICE_PER_MONTH = 9.99;
const MONTHS_OPTIONS = [1, 2, 3, 4, 5, 6, 9, 12];

interface PropertyListingPaymentFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  propertyId?: string | null;
}

interface DiscountData {
  code: string;
  discount_percentage: number;
  expiry_date: string | null;
  usage_count: number;
  max_usage: number | null;
  is_active: boolean;
}

interface PropertyListingPaymentFormContentProps extends PropertyListingPaymentFormProps {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  months: number;
  discountData?: DiscountData | null;
  propertyId?: string | null;
}

const PropertyListingPaymentFormContent: React.FC<PropertyListingPaymentFormContentProps> = ({
  open,
  onClose,
  onSuccess,
  clientSecret,
  paymentIntentId,
  amount,
  months,
  discountData,
  propertyId,
}) => {
  const stripe = useStripe();
  const elements = useElements();
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
      const { error: submitError } = await elements.submit();

      if (submitError) {
        setError(submitError.message || 'Payment form validation failed');
        enqueueSnackbar(submitError.message || 'Payment form validation failed', {
          variant: 'error',
        });
        setLoading(false);
        return;
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${typeof window !== 'undefined' ? window.location.origin : ''}/user/property/create-property?payment_success=true`,
        },
        redirect: 'if_required',
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        enqueueSnackbar(stripeError.message || 'Payment failed', { variant: 'error' });
        setLoading(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        try {

          // Get propertyId from prop or localStorage
          const finalPropertyId = propertyId || (typeof window !== 'undefined' ? localStorage.getItem('newpropertyId') : null);
          
          let response = await axiosInstance.post('/api/payment/confirm-intent-one-time', {
            paymentIntentId,
            months,
            propertyId: finalPropertyId,
          });

          if (response.data.success) {
            try {
              const userString = localStorage.getItem('user');
              if (userString) {
                const user = JSON.parse(userString);

                if (user && response.data.data.paymentIntent.report_count !== undefined) {
                  user.report_count = response.data.data.paymentIntent.report_count;
                  localStorage.setItem('user', JSON.stringify(user));
                }
              }
            } catch (error) {
              console.error('Failed to update user report_count in localStorage:', error);
            }

            enqueueSnackbar('Payment successful! Your property once verified will be listed.', { variant: 'success' });
            onSuccess?.();
            onClose();
            return;
          } else {
            setError(response.data.message || 'Failed to confirm listing');
            enqueueSnackbar(response.data.message || 'Failed to confirm listing', { variant: 'error' });
          }


        } catch (apiError: any) {
          const msg = apiError?.response?.data?.message || apiError?.message || 'Failed to confirm listing';
          setError(msg);
          enqueueSnackbar(msg, { variant: 'error' });
          setLoading(false);
          return;
        }
      }

      if (paymentIntent && paymentIntent.status === 'requires_action') {
        enqueueSnackbar('Redirecting to complete payment...', { variant: 'info' });
        return;
      }

      setError('Payment could not be completed. Please try again.');
      enqueueSnackbar('Payment could not be completed. Please try again.', { variant: 'error' });
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
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Pay to List Your Property
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          Total: £{amount.toFixed(2)} ({months} {months === 1 ? 'month' : 'months'})
          {discountData && (
            <Typography component="span" variant="body2" sx={{ color: 'success.main', ml: 1 }}>
              ({discountData.discount_percentage}% off)
            </Typography>
          )}
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
          {/* <Button onClick={handleClose} disabled={loading} color="inherit">
            Cancel
          </Button> */}
          <Button
            type="submit"
            variant="contained"
            disabled={!stripe || !elements || loading || !clientSecret || !paymentIntentId}
            sx={{
              background: 'linear-gradient(135deg, #f2c514 0%, #f4d03f 100%)',
              color: '#000',
              fontWeight: 600,
              '&:hover': { background: 'linear-gradient(135deg, #f4d03f 0%, #f2c514 100%)' },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#000' }} /> : `Pay £${amount.toFixed(2)}`}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const PropertyListingPaymentForm: React.FC<PropertyListingPaymentFormProps> = (props) => {
  const [months, setMonths] = useState<number>(1);
  const [stage, setStage] = useState<'months' | 'payment'>('months');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState<string>('');
  const [discountData, setDiscountData] = useState<DiscountData | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [validatingDiscount, setValidatingDiscount] = useState(false);

  const baseAmount = months * PRICE_PER_MONTH;
  
  // Calculate discounted amount
  const calculateDiscountedAmount = useCallback(() => {
    if (discountData && discountData.discount_percentage > 0) {
      const discountAmount = (baseAmount * discountData.discount_percentage) / 100;
      return baseAmount - discountAmount;
    }
    return baseAmount;
  }, [baseAmount, discountData]);

  const amount = calculateDiscountedAmount();

  const applyDiscountCode = useCallback(async (code: string) => {
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
        setDiscountData(response.data.data);
        setDiscountError(null);
      } else {
        // Discount code is invalid, expired, or max limit reached
        setDiscountData(null);
        setDiscountError(response.data.message || 'Invalid discount code');
      }
    } catch (err: any) {
      setDiscountData(null);
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to validate discount code';
      setDiscountError(errorMessage);
    } finally {
      setValidatingDiscount(false);
    }
  }, []);

  const handleDiscountCodeChange = (value: string) => {
    setDiscountCode(value);
    if (value.trim() === '') {
      setDiscountData(null);
      setDiscountError(null);
    }
  };

  const handleApplyDiscount = () => {
    if (discountCode.trim()) {
      applyDiscountCode(discountCode);
    }
  };

  const createPaymentIntent = useCallback(async () => {
    if (months < 1 || months > 12) return;
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.post('/api/payment/create-intent', {
        amount,
        metadata: { type: 'property_listing', months: String(months) },
      });

      if (response.data.success && response.data.data.clientSecret) {
        setClientSecret(response.data.data.clientSecret);
        if (response.data.data.paymentIntentId) {
          setPaymentIntentId(response.data.data.paymentIntentId);
        }
        setStage('payment');
      } else {
        throw new Error('Failed to create payment intent');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to initialize payment';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [amount, months]);

  useEffect(() => {
    if (!props.open) {
      setStage('months');
      setClientSecret(null);
      setPaymentIntentId(null);
      setError(null);
      setMonths(1);
      setDiscountCode('');
      setDiscountData(null);
      setDiscountError(null);
    }
  }, [props.open]);

  const handleClose = () => {
    setStage('months');
    setClientSecret(null);
    setPaymentIntentId(null);
    setError(null);
    setDiscountCode('');
    setDiscountData(null);
    setDiscountError(null);
    props.onClose();
  };

  if (stage === 'months') {
    return (
      <Dialog
        open={props.open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            List Your Property
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            Choose how long to list your property
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            select
            fullWidth
            label="Listing duration (months)"
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            sx={{ mb: 2 }}
          >
            {MONTHS_OPTIONS.map((m) => (
              <MenuItem key={m} value={m}>
                {m} {m === 1 ? 'month' : 'months'}
              </MenuItem>
            ))}
          </TextField>
          
          <Box sx={{ mb: 2 }}>
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
              sx={{ mb: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {validatingDiscount ? (
                      <CircularProgress size={20} />
                    ) : discountData ? (
                      <CheckCircleIcon color="success" />
                    ) : discountError ? (
                      <CancelIcon color="error" />
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
            {discountError && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {discountError}
              </Alert>
            )}
            {discountData && (
              <Alert severity="success" sx={{ mt: 1 }}>
                {discountData.discount_percentage}% discount applied!
              </Alert>
            )}
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" color="text.secondary">
              £{PRICE_PER_MONTH.toFixed(2)} per month
            </Typography>
            {discountData && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Subtotal: £{baseAmount.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="success.main">
                  Discount ({discountData.discount_percentage}%): -£{(baseAmount - amount).toFixed(2)}
                </Typography>
              </Box>
            )}
            <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
              Total: £{amount.toFixed(2)}
            </Typography>
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 3 }}>
          {/* <Button onClick={handleClose} color="inherit">
            Cancel
          </Button> */}
          <Button
            variant="contained"
            onClick={createPaymentIntent}
            disabled={loading || months < 1}
            sx={{
              background: 'linear-gradient(135deg, #f2c514 0%, #f4d03f 100%)',
              color: '#000',
              fontWeight: 600,
              '&:hover': { background: 'linear-gradient(135deg, #f4d03f 0%, #f2c514 100%)' },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#000' }} /> : 'Proceed to Payment'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  if (!clientSecret || !paymentIntentId) {
    return (
      <Dialog open={props.open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent sx={{ py: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            Initializing payment...
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: { theme: 'stripe' },
  };

  // Get propertyId from prop or localStorage
  const finalPropertyId = props.propertyId || (typeof window !== 'undefined' ? localStorage.getItem('newpropertyId') : null);

  return (
    <Elements stripe={stripePromise} options={options}>
      <PropertyListingPaymentFormContent
        open={props.open}
        onClose={handleClose}
        onSuccess={props.onSuccess}
        clientSecret={clientSecret}
        paymentIntentId={paymentIntentId}
        amount={amount}
        months={months}
        discountData={discountData}
        propertyId={finalPropertyId}
      />
    </Elements>
  );
};

export default PropertyListingPaymentForm;
