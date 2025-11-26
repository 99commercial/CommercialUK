import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  InputAdornment,
  Alert,
  CircularProgress,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Cake as CakeIcon,
  Edit as EditIcon,
  Save as SaveIcon,
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
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 14,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)',
      pointerEvents: 'none',
      zIndex: 0,
    },
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
    '&.MuiInputBase-multiline': {
      padding: theme.spacing(1.75),
      '& textarea': {
        padding: theme.spacing(1.75, 1.75),
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: '1.125rem',
        lineHeight: 1.6,
        color: '#1f2937',
        resize: 'vertical',
        position: 'relative',
        zIndex: 1,
        '&::placeholder': {
          color: '#9ca3af',
          opacity: 1,
          fontSize: '1.125rem',
        },
      },
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
  '& .MuiInputAdornment-root': {
    position: 'relative',
    zIndex: 1,
    '& .MuiSvgIcon-root': {
      fontSize: '1.5rem',
      transition: 'all 0.2s ease',
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

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  fontWeight: 600,
  fontSize: '1.375rem',
  letterSpacing: '-0.01em',
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  fontWeight: 400,
  fontSize: '1rem',
  opacity: 0.8,
}));

interface PersonalDetailsEditProps {
  userData: any;
  onSave: (updatedData: any) => void;
  onCancel: () => void;
}

const PersonalDetailsEdit: React.FC<PersonalDetailsEditProps> = ({
  userData,
  onSave,
  onCancel,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    phone: userData?.phone || '',
    age: userData?.age || '',
    personal_address: userData?.personal_address || '',
    about: userData?.about || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isDirty = useMemo(() => {
    const keys = ['firstName','lastName','phone','age','personal_address','about'] as const;
    return keys.some((k) => {
      const currentVal = (formData as any)[k];
      const originalVal = (userData || {})[k];
      return String(currentVal ?? '').trim() !== String(originalVal ?? '').trim();
    });
  }, [formData, userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Frontend validation for required fields
    const missingFields: string[] = [];
    if (!formData.firstName.trim()) missingFields.push('First Name');
    if (!formData.lastName.trim()) missingFields.push('Last Name');
    if (!String(formData.phone).trim()) missingFields.push('Phone Number');
    if (formData.age === '' || formData.age === null) missingFields.push('Age');

    if (missingFields.length > 0) {
      setLoading(false);
      setError(`Please fill required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      const payload: Record<string, any> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        age: formData.age,
        personal_address: formData.personal_address,
        about: formData.about,
      };

      const response = await axiosInstance.put('/api/agent/users/profile', payload);

      const updated = (response as any)?.data?.data || payload;
      setSuccess('Profile updated successfully.');
      onSave(updated);
    } catch (err: any) {
      const message = typeof err === 'string'
        ? err
        : err?.message || err?.error || 'Failed to update profile';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledCard>
      <SectionHeader>
        <EditIcon sx={{ fontSize: '1.75rem', color: 'black' }} />
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            fontSize: '1.5rem',
            letterSpacing: '-0.01em',
            color: 'black',
          }}
        >
          Edit Personal Details
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
            <Typography 
              component="pre" 
              sx={{ 
                whiteSpace: 'pre-line', 
                margin: 0, 
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '1rem',
                fontWeight: 400,
              }}
            >
              {error}
            </Typography>
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
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid size={12}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                mb: 0.5,
              }}>
                <PersonIcon sx={{ color: '#f2c514', fontSize: '1.75rem' }} />
                <SectionTitle sx={{ color: '#1f2937' }}>
                  Basic Information
                </SectionTitle>
              </Box>
              <SectionSubtitle sx={{ color: '#6b7280', ml: 4.5, mb: 2.5 }}>
                Fields marked with an asterisk (*) are required
              </SectionSubtitle>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <StyledTextField
                fullWidth
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: '#f2c514' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <StyledTextField
                fullWidth
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: '#f2c514' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <StyledTextField
                fullWidth
                name="phone"
                label="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+1 (555) 123-4567"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: '#f2c514' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <StyledTextField
                fullWidth
                name="age"
                label="Age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                required
                inputProps={{ min: 1, max: 120 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CakeIcon sx={{ color: '#f2c514' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={12}>
              <Divider 
                sx={{ 
                  my: 3.5,
                  borderColor: 'rgba(0, 0, 0, 0.08)',
                  borderWidth: '1px',
                }} 
              />
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                mb: 0.5,
              }}>
                <LocationIcon sx={{ color: '#6b7280', fontSize: '1.75rem' }} />
                <SectionTitle sx={{ color: '#6b7280' }}>
                  Additional Information
                </SectionTitle>
              </Box>
              <SectionSubtitle sx={{ color: '#9ca3af', ml: 4.5, mb: 2.5 }}>
                Optional details to help us know you better
              </SectionSubtitle>
            </Grid>

            <Grid size={12}>
              <StyledTextField
                fullWidth
                name="personal_address"
                label="Personal Address"
                value={formData.personal_address}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder="Enter your complete address"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                      <LocationIcon sx={{ color: '#f2c514' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={12}>
              <StyledTextField
                fullWidth
                name="about"
                label="About Me"
                value={formData.about}
                onChange={handleChange}
                multiline
                rows={4}
                placeholder="Tell us about yourself, your interests, and background..."
              />
            </Grid>
          </Grid>

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
              disabled={loading || !isDirty}
              startIcon={loading ? <CircularProgress size={22} color="inherit" /> : <SaveIcon sx={{ fontSize: '1.5rem' }} />}
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
              {loading ? 'Saving...' : 'Save Changes'}
            </ActionButton>
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default PersonalDetailsEdit;
