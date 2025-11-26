import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Alert,
  CircularProgress,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axiosInstance from '../../utils/axios';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
  border: '1px solid rgba(220, 38, 38, 0.08)',
  background: '#ffffff',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06)',
  },
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: 0,
  padding: theme.spacing(2.5, 3),
  background: 'linear-gradient(135deg, #f2c514 0%, #d4a912 100%)',
  borderRadius: '16px 16px 0 0',
  color: 'white',
  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: '1.125rem',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    // 3D Effect - Multiple layered shadows for depth
    boxShadow: `
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.9),
      inset 0 -1px 0 0 rgba(0, 0, 0, 0.05)
    `,
    border: '1px solid rgba(0, 0, 0, 0.08)',
    position: 'relative',
    '& fieldset': {
      border: 'none',
    },
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `
        0 8px 12px -2px rgba(0, 0, 0, 0.15),
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 0 rgba(255, 255, 255, 0.95),
        inset 0 -2px 0 0 rgba(220, 38, 38, 0.2),
        0 0 0 1px rgba(220, 38, 38, 0.15)
      `,
    },
    '&.Mui-focused': {
      transform: 'translateY(-1px)',
      boxShadow: `
        0 10px 20px -4px rgba(220, 38, 38, 0.25),
        0 6px 12px -2px rgba(220, 38, 38, 0.15),
        inset 0 2px 0 0 rgba(255, 255, 255, 0.95),
        inset 0 -2px 0 0 rgba(220, 38, 38, 0.3),
        0 0 0 3px rgba(220, 38, 38, 0.1)
      `,
      borderColor: 'rgba(220, 38, 38, 0.4)',
    },
    '&.Mui-error': {
      boxShadow: `
        0 4px 6px -1px rgba(220, 38, 38, 0.2),
        0 2px 4px -1px rgba(220, 38, 38, 0.1),
        inset 0 1px 0 0 rgba(255, 255, 255, 0.9),
        inset 0 -1px 0 0 rgba(220, 38, 38, 0.2)
      `,
      borderColor: 'rgba(220, 38, 38, 0.3)',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: theme.spacing(1.75, 1.75),
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 400,
    color: '#1f2937',
    fontSize: '1.125rem',
    lineHeight: 1.6,
    position: 'relative',
    zIndex: 1,
    '&::placeholder': {
      color: '#9ca3af',
      opacity: 1,
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: '1.125rem',
    },
  },
  '& .MuiInputLabel-root': {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 500,
    fontSize: '1rem',
    color: '#6b7280',
    transform: 'translate(18px, 20px) scale(1)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '&.Mui-focused': {
      color: '#f2c514',
      fontWeight: 600,
      fontSize: '1rem',
    },
    '&.MuiInputLabel-shrink': {
      transform: 'translate(18px, -9px) scale(0.85)',
      fontWeight: 600,
    },
  },
  '& .MuiFormHelperText-root': {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: '0.9375rem',
    marginTop: theme.spacing(1),
  },
  '& .MuiInputAdornment-root': {
    position: 'relative',
    zIndex: 1,
    '& .MuiSvgIcon-root': {
      fontSize: '1.5rem',
      transition: 'color 0.2s ease',
    },
    '&.MuiInputAdornment-positionStart': {
      marginRight: theme.spacing(1.5),
    },
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 14,
  textTransform: 'none',
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  fontWeight: 600,
  fontSize: '1.125rem',
  padding: theme.spacing(2, 5),
  minWidth: 160,
  letterSpacing: '0.02em',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 6px 16px rgba(220, 38, 38, 0.25), 0 2px 4px rgba(220, 38, 38, 0.1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 24px rgba(220, 38, 38, 0.35), 0 4px 8px rgba(220, 38, 38, 0.15)',
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
  },
}));

const PasswordStrengthIndicator = styled(Box)(({ strength }: { strength: number }) => ({
  width: '100%',
  height: 6,
  backgroundColor: '#e5e7eb',
  borderRadius: 3,
  overflow: 'hidden',
  marginTop: 8,
  boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  '&::after': {
    content: '""',
    display: 'block',
    width: `${strength}%`,
    height: '100%',
    backgroundColor: strength < 30 ? '#f2c514' : strength < 70 ? '#f59e0b' : '#10b981',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: `
      0 2px 4px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.3)
    `,
    borderRadius: 3,
  },
}));

const PasswordRequirements = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(3.5),
  backgroundColor: '#f8fafc',
  borderRadius: 14,
  border: '1px solid rgba(0, 0, 0, 0.08)',
  // 3D Effect
  boxShadow: `
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.9),
    inset 0 -1px 0 0 rgba(0, 0, 0, 0.05)
  `,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    boxShadow: `
      0 6px 12px -2px rgba(0, 0, 0, 0.15),
      0 3px 6px -1px rgba(0, 0, 0, 0.1),
      inset 0 2px 0 0 rgba(255, 255, 255, 0.95),
      inset 0 -2px 0 0 rgba(0, 0, 0, 0.08)
    `,
  },
}));

interface PasswordUpdateProps {
  onPasswordUpdate: (passwords: { oldPassword: string; newPassword: string }) => void;
}

interface PasswordFormState {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const PasswordUpdate: React.FC<PasswordUpdateProps> = ({
  onPasswordUpdate,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [formData, setFormData] = useState<PasswordFormState>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear field error when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof typeof newErrors];
        return newErrors;
      });
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    if (/[a-z]/.test(password)) strength += 10;
    if (/[A-Z]/.test(password)) strength += 10;
    if (/[0-9]/.test(password)) strength += 10;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    if (password.length >= 16) strength += 10;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const getPasswordStrengthText = (strength: number): string => {
    if (strength < 30) return 'Weak';
    if (strength < 70) return 'Medium';
    return 'Strong';
  };

  const getPasswordStrengthColor = (strength: number): string => {
    if (strength < 30) return '#f2c514';
    if (strength < 70) return '#f59e0b';
    return '#10b981';
  };

  const validatePassword = (password: string): string[] => {
    const requirements = [];
    if (password.length < 8) requirements.push('At least 8 characters');
    if (!/[a-z]/.test(password)) requirements.push('One lowercase letter');
    if (!/[A-Z]/.test(password)) requirements.push('One uppercase letter');
    if (!/[0-9]/.test(password)) requirements.push('One number');
    if (!/[^A-Za-z0-9]/.test(password)) requirements.push('One special character');
    return requirements;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFieldErrors({});

    const { oldPassword, newPassword, confirmPassword } = formData;

    // Client-side validation
    const errors: { [key: string]: string } = {};

    if (!oldPassword.trim()) {
      errors.oldPassword = 'Old password is required';
    }

    if (!newPassword.trim()) {
      errors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      errors.newPassword = 'New password must be at least 8 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(newPassword)) {
      errors.newPassword = 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }

    if (!confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (oldPassword === newPassword) {
      errors.newPassword = 'New password must be different from your current password';
    }

    // If there are client-side validation errors, show them and stop
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setLoading(true);
      const requestData = {
        oldPassword,
        newPassword,
        confirmPassword,
      };

      const { data } = await axiosInstance.post('/api/auth/update-password', requestData);

      setSuccess(data?.message || 'Password updated successfully');
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      // Handle backend validation errors
      if (err?.errors && Array.isArray(err.errors)) {
        const backendErrors: { [key: string]: string } = {};
        err.errors.forEach((error: any) => {
          if (error.path && error.msg) {
            backendErrors[error.path] = error.msg;
          }
        });
        setFieldErrors(backendErrors);
      } else {
        const serverMessage =
          err?.message ||
          err?.error ||
          'Failed to update password';
        setError(serverMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = calculatePasswordStrength(formData.newPassword);
  const passwordRequirements = validatePassword(formData.newPassword);

  return (
    <StyledCard>
      <SectionHeader>
        <SecurityIcon sx={{ fontSize: '1.75rem', color: 'black' }} />
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            fontSize: '1.5rem',
            color: 'black',
            letterSpacing: '-0.01em',
          }}
        >
          Update Password
        </Typography>
      </SectionHeader>

      <CardContent sx={{ p: { xs: 3, md: 4.5 }, pt: { xs: 3.5, md: 4.5 } }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              fontSize: '1rem',
              boxShadow: '0 2px 8px rgba(220, 38, 38, 0.1)',
              '& .MuiAlert-message': {
                fontSize: '1rem',
              },
            }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              fontSize: '1rem',
              boxShadow: '0 2px 8px rgba(34, 197, 94, 0.1)',
              '& .MuiAlert-message': {
                fontSize: '1rem',
              },
            }}
          >
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {/* Current Password */}
          <StyledTextField
            fullWidth
            name="oldPassword"
            label="Old Password"
            type={showPasswords.current ? 'text' : 'password'}
            value={formData.oldPassword}
            onChange={handleChange}
            required
            margin="normal"
            error={!!fieldErrors.oldPassword}
            helperText={fieldErrors.oldPassword}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: '#f2c514', fontSize: '1.5rem' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => togglePasswordVisibility('current')}
                    edge="end"
                    sx={{
                      '& .MuiSvgIcon-root': {
                        fontSize: '1.5rem',
                      },
                    }}
                  >
                    {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* New Password */}
          <StyledTextField
            fullWidth
            name="newPassword"
            label="New Password"
            type={showPasswords.new ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={handleChange}
            required
            margin="normal"
            error={!!fieldErrors.newPassword}
            helperText={fieldErrors.newPassword}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: '#f2c514', fontSize: '1.5rem' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => togglePasswordVisibility('new')}
                    edge="end"
                    sx={{
                      '& .MuiSvgIcon-root': {
                        fontSize: '1.5rem',
                      },
                    }}
                  >
                    {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Password Strength Indicator */}
          {formData.newPassword && (
            <Box sx={{ mt: 2, mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#6b7280',
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    fontSize: '1rem',
                    fontWeight: 500,
                  }}
                >
                  Password Strength
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: getPasswordStrengthColor(passwordStrength),
                    fontWeight: 600,
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    fontSize: '1rem',
                  }}
                >
                  {getPasswordStrengthText(passwordStrength)}
                </Typography>
              </Box>
              <PasswordStrengthIndicator strength={passwordStrength} />
            </Box>
          )}

          {/* Confirm New Password */}
          <StyledTextField
            fullWidth
            name="confirmPassword"
            label="Confirm New Password"
            type={showPasswords.confirm ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            margin="normal"
            error={!!fieldErrors.confirmPassword}
            helperText={fieldErrors.confirmPassword}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: '#f2c514', fontSize: '1.5rem' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => togglePasswordVisibility('confirm')}
                    edge="end"
                    sx={{
                      '& .MuiSvgIcon-root': {
                        fontSize: '1.5rem',
                      },
                    }}
                  >
                    {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Password Requirements */}
          <PasswordRequirements>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#f2c514', 
                fontWeight: 600, 
                mb: 2,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '1.375rem',
              }}
            >
              Password Requirements
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2.5, color: '#6b7280' }}>
              <Typography 
                component="li" 
                variant="body2" 
                sx={{ 
                  mb: 1.5,
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: '1rem',
                }}
              >
                At least 8 characters long
              </Typography>
              <Typography 
                component="li" 
                variant="body2" 
                sx={{ 
                  mb: 1.5,
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: '1rem',
                }}
              >
                Contains uppercase and lowercase letters
              </Typography>
              <Typography 
                component="li" 
                variant="body2" 
                sx={{ 
                  mb: 1.5,
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: '1rem',
                }}
              >
                Contains at least one number
              </Typography>
              <Typography 
                component="li" 
                variant="body2" 
                sx={{ 
                  mb: 1.5,
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: '1rem',
                }}
              >
                Contains at least one special character
              </Typography>
              <Typography 
                component="li" 
                variant="body2"
                sx={{
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: '1rem',
                }}
              >
                Different from your current password
              </Typography>
            </Box>
          </PasswordRequirements>

          {/* Action Buttons */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'flex-end', 
            mt: 5,
            pt: 3,
            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <ActionButton
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={22} color="inherit" /> : <CheckCircleIcon sx={{ fontSize: '1.5rem' }} />}
              sx={{
                backgroundColor: '#f2c514',
                color: 'black',
                '&:hover': {
                  backgroundColor: '#d4a912',
                },
                '&:disabled': {
                  backgroundColor: '#f9d85a',
                  boxShadow: 'none',
                  transform: 'none',
                },
              }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </ActionButton>
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default PasswordUpdate;
