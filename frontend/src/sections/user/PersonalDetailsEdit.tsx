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

      const response = await axiosInstance.put('/api/user/users/profile', payload);

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
        <EditIcon />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Edit Personal Details
        </Typography>
      </SectionHeader>

      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            <Typography component="pre" sx={{ whiteSpace: 'pre-line', margin: 0, fontFamily: 'inherit' }}>
              {error}
            </Typography>
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid size={12}>
              <Typography variant="h6" sx={{ 
                color: '#dc2626', 
                fontWeight: 600, 
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <PersonIcon />
                Basic Information
                <Typography component="span" sx={{ 
                  color: '#dc2626', 
                  fontSize: '0.875rem', 
                  fontWeight: 400,
                  ml: 1
                }}>
                  (Required)
                </Typography>
              </Typography>
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
                      <PersonIcon sx={{ color: '#dc2626' }} />
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
                      <PersonIcon sx={{ color: '#dc2626' }} />
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
                      <PhoneIcon sx={{ color: '#dc2626' }} />
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
                      <CakeIcon sx={{ color: '#dc2626' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ 
                color: '#6b7280', 
                fontWeight: 600, 
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <LocationIcon />
                Additional Information
                <Typography component="span" sx={{ 
                  color: '#6b7280', 
                  fontSize: '0.875rem', 
                  fontWeight: 400,
                  ml: 1
                }}>
                  (Optional)
                </Typography>
              </Typography>
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
                      <LocationIcon sx={{ color: '#dc2626' }} />
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
            mt: 4,
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <ActionButton
              type="submit"
              variant="contained"
              disabled={loading || !isDirty}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
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
              {loading ? 'Saving...' : 'Save Changes'}
            </ActionButton>
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default PersonalDetailsEdit;
