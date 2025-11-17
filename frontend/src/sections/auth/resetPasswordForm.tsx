import React, { useEffect, useState } from 'react';
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
  Lock,
  CheckCircle,
  ArrowBack,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import axiosInstance from '../../utils/axios';
import { useSnackbar } from 'notistack';

interface ResetPasswordFormProps {
  onResetPassword?: (password: string, confirmPassword: string) => Promise<void>;
}

export default function ResetPasswordForm({ onResetPassword }: ResetPasswordFormProps) {
  const router = useRouter();
  const { token } = router.query as { token?: string };
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // If no token present in URL, show an error
    if (router.isReady && !token) {
      setError('Invalid or missing reset token. Please use the link from your email.');
    }
  }, [router.isReady, token]);

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
    setFieldErrors({});

    if (!token) {
      setError('Missing reset token. Please use the link from your email.');
      setLoading(false);
      return;
    }

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      if (onResetPassword) {
        await onResetPassword(formData.password, formData.confirmPassword);
      } else {
        // Call backend API to reset password with token
        let res = await axiosInstance.post('/api/auth/reset-password', {
          token,
          newPassword: formData.password,
          confirmPassword: formData.confirmPassword,
        });
        setSuccess(true);
        enqueueSnackbar( res.data.message || 'Password reset successfully. You can now sign in.', { variant: 'success' });
        router.push('/auth/login')
      }
    } catch (err) {
      const anyErr = err as any;
      const data = anyErr?.errors ? anyErr : anyErr?.data || anyErr; // axios interceptor passes error.response.data
      const errorsArray = data?.errors as Array<{ path?: string; msg?: string }> | undefined;

      if (Array.isArray(errorsArray) && errorsArray.length > 0) {
        const newFieldErrors: { password?: string; confirmPassword?: string } = {};
        for (const e of errorsArray) {
          if (e.path === 'newPassword') newFieldErrors.password = e.msg || 'Invalid password';
          if (e.path === 'confirmPassword') newFieldErrors.confirmPassword = e.msg || 'Passwords do not match';
        }
        setFieldErrors(newFieldErrors);
        // also set a generic top-level error with the first error message
        setError(errorsArray[0]?.msg || 'Please correct the highlighted fields.');
      } else {
        const apiMessage = data?.message || data?.error || anyErr?.message || 'Failed to reset password. Please try again.';
        setError(apiMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
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
                backgroundColor: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: { xs: 1, sm: 2 },
              }}
            >
              <CheckCircle sx={{ color: 'white', fontSize: { xs: 24, sm: 30 } }} />
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
              Password Reset Successfully!
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                mb: 2,
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              Your password has been successfully updated. You can now sign in with your new password.
            </Typography>
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
              backgroundColor: '#f2c514',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: { xs: 1, sm: 2 },
            }}
          >
            <Lock sx={{ color: 'white', fontSize: { xs: 24, sm: 30 } }} />
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
            Reset Password
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            Enter your new password below
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
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="New Password"
            value={formData.password}
            onChange={handleChange}
            required
            margin="normal"
            error={Boolean(fieldErrors.password)}
            helperText={fieldErrors.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#f2c514', fontSize: { xs: 18, sm: 24 } }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    size="small"
                  >
                    {showPassword ? <VisibilityOff sx={{ fontSize: { xs: 18, sm: 24 } }} /> : <Visibility sx={{ fontSize: { xs: 18, sm: 24 } }} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ 
              mb: { xs: 1.5, sm: 2 },
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                fontSize: { xs: '0.875rem', sm: '1rem' },
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
                fontSize: { xs: '0.875rem', sm: '1rem' },
              },
              '& .MuiInputBase-input': {
                color: 'white',
                py: { xs: 1, sm: 1.5 },
              },
            }}
          />

          <TextField
            fullWidth
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirm New Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            margin="normal"
            error={Boolean(fieldErrors.confirmPassword)}
            helperText={fieldErrors.confirmPassword}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#f2c514', fontSize: { xs: 18, sm: 24 } }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleToggleConfirmPasswordVisibility}
                    edge="end"
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    size="small"
                  >
                    {showConfirmPassword ? <VisibilityOff sx={{ fontSize: { xs: 18, sm: 24 } }} /> : <Visibility sx={{ fontSize: { xs: 18, sm: 24 } }} />}
                  </IconButton>
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
                  borderColor: '#f2c514',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#f2c514',
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
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
            sx={{
              py: { xs: 1, sm: 1.5 },
              mb: { xs: 1, sm: 2 },
              backgroundColor: '#f2c514',
              color: 'white',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
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
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
