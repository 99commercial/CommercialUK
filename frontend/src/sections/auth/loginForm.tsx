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
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import axiosInstance from '@/utils/axios';
import { enqueueSnackbar } from 'notistack'; 

interface LoginFormProps {
  onLogin?: (email: string, password: string) => Promise<void>;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      // Fetch user's IP address
      let ipAddress = '';
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        ipAddress = ipData.ip;
      } catch (ipError) {
        console.error('Failed to fetch IP address:', ipError);
        // Continue with login even if IP fetch fails
      }

      // Add IP address to formData
      const submitData = {
        ...formData,
        ipAddress
      };

      let res = await axiosInstance.post('/api/auth/login', submitData);
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('accessToken', res.data.accessData);
      localStorage.setItem('refreshToken', res.data.refreshData);

      // Redirect to appropriate dashboard
      router.push(`/${res.data.user.role}`);

    } catch (err: any) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, {
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

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
            mt: { xs: '8%', sm: '10%', md: '12%', lg: '15%' },
            flex: '0 0 auto'
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: '#f2c514',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <LoginIcon sx={{ color: 'white', fontSize: 30 }} />
          </Box>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ color: 'white', fontWeight: 600 }}
          >
            Welcome Back
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Sign in to your account to continue
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
                  <Email sx={{ color: '#f2c514' }} />
                </InputAdornment>
              ),
            }}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '& fieldset': {
                  borderColor: 'rgba(220, 38, 38, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: '#f2c514',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#f2c514',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '& .MuiInputBase-input': {
                color: 'white',
              },
            }}
          />

          <TextField
            fullWidth
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            value={formData.password}
            onChange={handleChange}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#f2c514' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '& fieldset': {
                  borderColor: 'rgba(220, 38, 38, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: '#f2c514',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#f2c514',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '& .MuiInputBase-input': {
                color: 'white',
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
            sx={{
              py: 1.5,
              mb: 2,
              backgroundColor: '#f2c514',
              color: 'white',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: '0 4px 14px 0 rgba(220, 38, 38, 0.4)',
              '&:hover': {
                backgroundColor: '#c9a010',
                boxShadow: '0 6px 20px 0 rgba(220, 38, 38, 0.6)',
                transform: 'translateY(-1px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>

          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Link
              href="/auth/forget-password"
              variant="body2"
              sx={{
                color: '#f2c514',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                  color: '#c9a010',
                },
              }}
            >
              Forgot your password?
            </Link>
          </Box>

          <Divider sx={{ my: 2, '&::before, &::after': { borderColor: 'rgba(220, 38, 38, 0.3)' } }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              OR
            </Typography>
          </Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Don't have an account?{' '}
              <Link
                href="/auth/register"
                sx={{
                  color: '#f2c514',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline',
                    color: '#c9a010',
                  },
                }}
              >
                Sign up here
              </Link>
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
