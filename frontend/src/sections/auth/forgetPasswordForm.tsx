import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Divider,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Email,
  ArrowBack,
  Send,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import axiosInstance from '@/utils/axios';
import { enqueueSnackbar } from 'notistack';

interface ForgetPasswordFormProps {
  onSendResetEmail?: (email: string) => Promise<void>;
}

export default function ForgetPasswordForm({ onSendResetEmail }: ForgetPasswordFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {

      let res = await axiosInstance.post("/api/auth/forgot-password", formData, {
        timeout: 120000 // 2 minutes timeout specifically for password reset requests
      })

      if(res.data.status){
        enqueueSnackbar(res.data.message || "Password reset email sent successfully !" , {variant :'success'})
        setSuccess(true)
        // Give a brief moment to show success before navigating
        setTimeout(() => router.push('/auth/login'), 1500)
      } else {
        enqueueSnackbar(res.data.message || "Error is sharing reset email !" , {variant :'error'})
      }

    } catch (err: any) {
      let errorMessage = "Failed to send reset email. Please try again.";
      
      // Handle timeout errors specifically
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        errorMessage = "Request timed out. The server is taking longer than expected. Please try again.";
      } else if (err.response?.status === 408) {
        errorMessage = "Request timeout. Please check your connection and try again.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      enqueueSnackbar(errorMessage, {variant :'error'})
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card
        sx={{
          maxWidth: 1000,
          width: '100%',
          mx: 'auto',
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
          borderRadius: 0,
          position: 'relative',
        }}
      >
        <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box 
            sx={{ 
              textAlign: 'center', 
              mb: 3,
              width: '100%',
              flex: '0 0 auto'
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <Send sx={{ color: 'white', fontSize: 30 }} />
            </Box>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ color: 'white', fontWeight: 600 }}
            >
              Check Your Email
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}
            >
              We've sent a password reset link to <strong>{formData.email}</strong>
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Please check your email and click the link to reset your password. 
              If you don't see the email, check your spam folder.
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => router.push('/auth/login')}
              sx={{
                color: '#dc2626',
                borderColor: '#dc2626',
                '&:hover': {
                  borderColor: '#991b1b',
                  backgroundColor: 'rgba(220, 38, 38, 0.1)',
                },
              }}
            >
              Back to Login
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        maxWidth: 1000,
        width: '100%',
        mx: 'auto',
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        borderRadius: 0,
        position: 'relative',
      }}
    >
      <CardContent sx={{height: '100%', display: 'flex', flexDirection: 'column', p: { xs: 1, sm: 2, md: 3 } }}>
        <Box 
          sx={{ 
            textAlign: 'center', 
            width: '100%',
            flex: '0 0 auto',
            mb: { xs: 1, sm: 2, md: 3 }
          }}
        >
          <Box
            sx={{
              width: { xs: 50, sm: 60 },
              height: { xs: 50, sm: 60 },
              borderRadius: '50%',
              backgroundColor: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: { xs: 1, sm: 2 },
            }}
          >
            <Email sx={{ color: 'white', fontSize: { xs: 24, sm: 30 } }} />
          </Box>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              color: 'white', 
              fontWeight: 600,
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
            }}
          >
            Forgot Password?
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            Enter your email address and we'll send you a link to reset your password
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <TextField
            fullWidth
            name="email"
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: '#dc2626', fontSize: { xs: 18, sm: 24 } }} />
                </InputAdornment>
              ),
            }}
            sx={{ 
              mb: { xs: 2, sm: 3 },
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                '& fieldset': {
                  borderColor: 'rgba(220, 38, 38, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: '#dc2626',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#dc2626',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: { xs: '0.875rem', sm: '1rem' },
              },
              '& .MuiInputBase-input': {
                color: 'white',
                py: { xs: 1, sm: 1.5 },
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
            sx={{
              py: { xs: 1, sm: 1.5 },
              mb: { xs: 1, sm: 2 },
              backgroundColor: '#dc2626',
              color: 'white',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              boxShadow: '0 4px 14px 0 rgba(220, 38, 38, 0.4)',
              '&:hover': {
                backgroundColor: '#991b1b',
                boxShadow: '0 6px 20px 0 rgba(220, 38, 38, 0.6)',
                transform: 'translateY(-1px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
            }}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
