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
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  PersonAdd,
  Email,
  Lock,
  Person,
  Business,
  Phone,
  AssignmentInd,
} from '@mui/icons-material';
import axiosInstance from '@/utils/axios';
import { enqueueSnackbar } from 'notistack';
import { useRouter } from 'next/router'

const RegisterForm = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  let router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear field-specific error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
    // Clear general error
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    try {
      let res = await axiosInstance.post('/api/auth/register', formData, {
        timeout: 120000 // 2 minutes timeout specifically for registration requests
      });
      // Handle successful registration
      enqueueSnackbar(res.data.message, { variant: 'success' });

      router.push('/auth/login')
      
    } catch (err: any) {
      // Handle timeout errors specifically
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('Request timed out. The server is taking longer than expected. Please try again.');
      } else if (err.response?.status === 408) {
        setError('Request timeout. Please check your connection and try again.');
      } else if (err.errors && Array.isArray(err.errors)) {
        // Handle validation errors from express-validator
        const newFieldErrors: Record<string, string> = {};
        err.errors.forEach((error: any) => {
          if (error.path) {
            newFieldErrors[error.path] = error.msg;
          }
        });
        setFieldErrors(newFieldErrors);
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          width: '100%',
          flex: '0 0 auto',
          textAlign: 'center',
          mb: 3,
          mt: { xs: '4%', sm: '5%', md: '6%', lg: '8%' },
        }}
      >
        <Box
          sx={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            mb: 1.5,
            boxShadow: '0 6px 20px rgba(220, 38, 38, 0.4)',
          }}
        >
          <PersonAdd sx={{ color: 'white', fontSize: 24 }} />
        </Box>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            color: 'white',
            fontWeight: 700,
            mb: 0.5,
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.5), 0 0 20px rgba(220, 38, 38, 0.3)',
            filter: 'drop-shadow(0 0 10px rgba(220, 38, 38, 0.2))',
            fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.8rem' },
          }}
        >
          Create Account
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: { xs: '0.8rem', sm: '0.9rem' },
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          }}
        >
          Join 99Commercial and start your real estate journey
        </Typography>
      </Box>

      {/* Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(220, 38, 38, 0.1)', color: 'white' }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            name="firstName"
            label="First Name"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            required
            error={!!fieldErrors.firstName}
            helperText={fieldErrors.firstName}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: '#dc2626' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderRadius: 2,
                '& fieldset': {
                  borderColor: fieldErrors.firstName ? '#dc2626' : 'rgba(220, 38, 38, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: fieldErrors.firstName ? '#dc2626' : 'rgba(220, 38, 38, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: fieldErrors.firstName ? '#dc2626' : '#dc2626',
                },
              },
              '& .MuiInputLabel-root': {
                color: fieldErrors.firstName ? '#dc2626' : 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': {
                  color: '#dc2626',
                },
              },
              '& .MuiInputBase-input': {
                color: 'white',
              },
              '& .MuiFormHelperText-root': {
                color: '#dc2626',
                fontSize: '0.75rem',
                marginTop: '4px',
              },
            }}
          />
          <TextField
            fullWidth
            name="lastName"
            label="Last Name"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            required
            error={!!fieldErrors.lastName}
            helperText={fieldErrors.lastName}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: '#dc2626' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderRadius: 2,
                '& fieldset': {
                  borderColor: fieldErrors.lastName ? '#dc2626' : 'rgba(220, 38, 38, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: fieldErrors.lastName ? '#dc2626' : 'rgba(220, 38, 38, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: fieldErrors.lastName ? '#dc2626' : '#dc2626',
                },
              },
              '& .MuiInputLabel-root': {
                color: fieldErrors.lastName ? '#dc2626' : 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': {
                  color: '#dc2626',
                },
              },
              '& .MuiInputBase-input': {
                color: 'white',
              },
              '& .MuiFormHelperText-root': {
                color: '#dc2626',
                fontSize: '0.75rem',
                marginTop: '4px',
              },
            }}
          />
        </Box>

        <TextField
          fullWidth
          name="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          error={!!fieldErrors.email}
          helperText={fieldErrors.email}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email sx={{ color: '#dc2626' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(31, 41, 55, 0.8)',
              borderRadius: 2,
              '& fieldset': {
                borderColor: fieldErrors.email ? '#dc2626' : 'rgba(220, 38, 38, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: fieldErrors.email ? '#dc2626' : 'rgba(220, 38, 38, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: fieldErrors.email ? '#dc2626' : theme.palette.primary.main,
              },
            },
            '& .MuiInputLabel-root': {
              color: fieldErrors.email ? '#dc2626' : 'rgba(255, 255, 255, 0.7)',
              '&.Mui-focused': {
                color: fieldErrors.email ? '#dc2626' : theme.palette.primary.main,
              },
            },
            '& .MuiInputBase-input': {
              color: 'white',
            },
            '& .MuiFormHelperText-root': {
              color: '#dc2626',
              fontSize: '0.75rem',
              marginTop: '4px',
            },
          }}
        />

        <TextField
          fullWidth
          name="phone"
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          required
          error={!!fieldErrors.phone}
          helperText={fieldErrors.phone}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone sx={{ color: '#dc2626' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(31, 41, 55, 0.8)',
              borderRadius: 2,
              '& fieldset': {
                borderColor: fieldErrors.phone ? '#dc2626' : 'rgba(220, 38, 38, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: fieldErrors.phone ? '#dc2626' : 'rgba(220, 38, 38, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: fieldErrors.phone ? '#dc2626' : theme.palette.primary.main,
              },
            },
            '& .MuiInputLabel-root': {
              color: fieldErrors.phone ? '#dc2626' : 'rgba(255, 255, 255, 0.7)',
              '&.Mui-focused': {
                color: fieldErrors.phone ? '#dc2626' : theme.palette.primary.main,
              },
            },
            '& .MuiInputBase-input': {
              color: 'white',
            },
            '& .MuiFormHelperText-root': {
              color: '#dc2626',
              fontSize: '0.75rem',
              marginTop: '4px',
            },
          }}
        />

        <TextField
          fullWidth
          name="company"
          label="Company (Optional)"
          type="text"
          value={formData.company}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Business sx={{ color: '#dc2626' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(31, 41, 55, 0.8)',
              borderRadius: 2,
              '& fieldset': {
                borderColor: 'rgba(220, 38, 38, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(220, 38, 38, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-focused': {
                color: theme.palette.primary.main,
              },
            },
            '& .MuiInputBase-input': {
              color: 'white',
            },
          }}
        />

        <FormControl
          fullWidth
          error={!!fieldErrors.role}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(31, 41, 55, 0.8)',
              borderRadius: 2,
              '& fieldset': {
                borderColor: fieldErrors.role ? '#dc2626' : 'rgba(220, 38, 38, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: fieldErrors.role ? '#dc2626' : 'rgba(220, 38, 38, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: fieldErrors.role ? '#dc2626' : theme.palette.primary.main,
              },
            },
            '& .MuiInputLabel-root': {
              color: fieldErrors.role ? '#dc2626' : 'rgba(255, 255, 255, 0.7)',
              '&.Mui-focused': {
                color: fieldErrors.role ? '#dc2626' : theme.palette.primary.main,
              },
            },
            '& .MuiSelect-select': {
              color: 'white',
              display: 'flex',
              alignItems: 'center',
            },
            '& .MuiFormHelperText-root': {
              color: '#dc2626',
              fontSize: '0.75rem',
              marginTop: '4px',
            },
          }}
        >
          <InputLabel>Role</InputLabel>
          <Select
            name="role"
            value={formData.role}
            onChange={handleChange}
            label="Role"
            startAdornment={
              <InputAdornment position="start">
                <AssignmentInd sx={{ color: '#dc2626', mr: 1 }} />
              </InputAdornment>
            }
          >
            <MenuItem value="user">Tenant</MenuItem>
            <MenuItem value="agent">Agent</MenuItem>
          </Select>
          {fieldErrors.role && (
            <Typography variant="caption" sx={{ color: '#dc2626', fontSize: '0.75rem', mt: '4px' }}>
              {fieldErrors.role}
            </Typography>
          )}
        </FormControl>

        <TextField
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          required
          error={!!fieldErrors.password}
          helperText={fieldErrors.password}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock sx={{ color: '#dc2626' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(31, 41, 55, 0.8)',
              borderRadius: 2,
              '& fieldset': {
                borderColor: fieldErrors.password ? '#dc2626' : 'rgba(220, 38, 38, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: fieldErrors.password ? '#dc2626' : 'rgba(220, 38, 38, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: fieldErrors.password ? '#dc2626' : theme.palette.primary.main,
              },
            },
            '& .MuiInputLabel-root': {
              color: fieldErrors.password ? '#dc2626' : 'rgba(255, 255, 255, 0.7)',
              '&.Mui-focused': {
                color: fieldErrors.password ? '#dc2626' : theme.palette.primary.main,
              },
            },
            '& .MuiInputBase-input': {
              color: 'white',
            },
            '& .MuiFormHelperText-root': {
              color: '#dc2626',
              fontSize: '0.75rem',
              marginTop: '4px',
            },
          }}
        />

        <TextField
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          error={!!fieldErrors.confirmPassword}
          helperText={fieldErrors.confirmPassword}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock sx={{ color: '#dc2626' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(31, 41, 55, 0.8)',
              borderRadius: 2,
              '& fieldset': {
                borderColor: fieldErrors.confirmPassword ? '#dc2626' : 'rgba(220, 38, 38, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: fieldErrors.confirmPassword ? '#dc2626' : 'rgba(220, 38, 38, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: fieldErrors.confirmPassword ? '#dc2626' : theme.palette.primary.main,
              },
            },
            '& .MuiInputLabel-root': {
              color: fieldErrors.confirmPassword ? '#dc2626' : 'rgba(255, 255, 255, 0.7)',
              '&.Mui-focused': {
                color: fieldErrors.confirmPassword ? '#dc2626' : theme.palette.primary.main,
              },
            },
            '& .MuiInputBase-input': {
              color: 'white',
            },
            '& .MuiFormHelperText-root': {
              color: '#dc2626',
              fontSize: '0.75rem',
              marginTop: '4px',
            },
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{
            py: 1.5,
            mb: 2,
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 2,
            background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
            boxShadow: '0 8px 24px rgba(220, 38, 38, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)',
              boxShadow: '0 12px 32px rgba(220, 38, 38, 0.6)',
              transform: 'translateY(-2px)',
            },
            '&:disabled': {
              background: 'rgba(220, 38, 38, 0.3)',
              color: 'rgba(255, 255, 255, 0.5)',
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            'CREATE ACCOUNT'
          )}
        </Button>

        <Divider sx={{ my: 2, borderColor: 'rgba(220, 38, 38, 0.3)' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', px: 2 }}>
            OR
          </Typography>
        </Divider>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
            Already have an account?
          </Typography>
          <Link
            href="/auth/login"
            sx={{
              color: '#dc2626',
              textDecoration: 'none',
              fontWeight: 600,
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Sign in here
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterForm;
