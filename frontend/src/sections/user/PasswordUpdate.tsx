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
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  border: 'none',
  background: '#ffffff',
  overflow: 'hidden',
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
  borderRadius: '8px 8px 0 0',
  color: 'white',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    '& fieldset': {
      borderColor: 'rgba(220, 38, 38, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: '#dc2626',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#dc2626',
      borderWidth: 2,
    },
  },
  '& .MuiInputLabel-root': {
    color: '#6b7280',
    '&.Mui-focused': {
      color: '#dc2626',
    },
  },
  '& .MuiInputBase-input': {
    color: '#1f2937',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  minWidth: 120,
}));

const PasswordStrengthIndicator = styled(Box)(({ strength }: { strength: number }) => ({
  width: '100%',
  height: 4,
  backgroundColor: '#e5e7eb',
  borderRadius: 2,
  overflow: 'hidden',
  marginTop: 8,
  '&::after': {
    content: '""',
    display: 'block',
    width: `${strength}%`,
    height: '100%',
    backgroundColor: strength < 30 ? '#ef4444' : strength < 70 ? '#f59e0b' : '#10b981',
    transition: 'all 0.3s ease',
  },
}));

const PasswordRequirements = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: '#f8fafc',
  borderRadius: 8,
  border: '1px solid #e5e7eb',
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
    if (strength < 30) return '#ef4444';
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
        <SecurityIcon />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Update Password
        </Typography>
      </SectionHeader>

      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
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
                  <LockIcon sx={{ color: '#dc2626' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => togglePasswordVisibility('current')}
                    edge="end"
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
                  <LockIcon sx={{ color: '#dc2626' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => togglePasswordVisibility('new')}
                    edge="end"
                  >
                    {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Password Strength Indicator */}
          {formData.newPassword && (
            <Box sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  Password Strength
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: getPasswordStrengthColor(passwordStrength),
                    fontWeight: 600,
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
                  <LockIcon sx={{ color: '#dc2626' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => togglePasswordVisibility('confirm')}
                    edge="end"
                  >
                    {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Password Requirements */}
          <PasswordRequirements>
            <Typography variant="h6" sx={{ color: '#dc2626', fontWeight: 600, mb: 2 }}>
              Password Requirements
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2, color: '#6b7280' }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                At least 8 characters long
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Contains uppercase and lowercase letters
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Contains at least one number
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Contains at least one special character
              </Typography>
              <Typography component="li" variant="body2">
                Different from your current password
              </Typography>
            </Box>
          </PasswordRequirements>

          {/* Action Buttons */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'flex-end', 
            mt: 4,
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <ActionButton
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
              sx={{
                backgroundColor: '#dc2626',
                '&:hover': {
                  backgroundColor: '#b91c1c',
                },
                '&:disabled': {
                  backgroundColor: '#fca5a5',
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
