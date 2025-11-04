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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  FormControlLabel,
  Switch,
  FormGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
  Work as WorkIcon,
  Star as StarIcon,
  Security as SecurityIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  Group as GroupIcon,
  Shield as ShieldIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  CorporateFare as CorporateIcon,
  Badge as BadgeIcon,
  Receipt as ReceiptIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as VerifiedIcon,
  AccountBalance as AccountBalanceIcon,
  Gavel as GavelIcon,
  Payment as PaymentIcon,
  Home as HomeIcon,
  Apartment as ApartmentIcon,
  Place as PlaceIcon,
  Public as PublicIcon,
  Description as DescriptionIcon,
  Translate as TranslateIcon,
  LocalHospital as LocalHospitalIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  AttachMoney as AttachMoneyIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelCircleIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axiosInstance from '@/utils/axios';
import { enqueueSnackbar } from 'notistack';
import Loader from '@/components/Loader';

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
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(3),
  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
  borderRadius: '8px 8px 0 0',
  color: 'white',
  '& .MuiSvgIcon-root': {
    fontSize: '2rem',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
  },
  '& .MuiTypography-root': {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: '1.5rem',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: '0.95rem',
    fontWeight: 400,
    letterSpacing: '0.01em',
    '& fieldset': {
      borderColor: 'rgba(220, 38, 38, 0.3)',
      borderWidth: 1.5,
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
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: '0.875rem',
    fontWeight: 500,
    letterSpacing: '0.02em',
    '&.Mui-focused': {
      color: '#dc2626',
      fontWeight: 600,
    },
  },
  '& .MuiInputBase-input': {
    color: '#1f2937',
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 400,
  },
}));

const CardFieldContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#f9fafb',
  borderRadius: 12,
  padding: theme.spacing(2.5),
  border: '2px solid #e5e7eb',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.1)',
  },
  '&:focus-within': {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
    boxShadow: '0 4px 16px rgba(220, 38, 38, 0.15)',
  },
}));

const GradientBorderField = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: '2px',
  borderRadius: 12,
  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
  '& .field-content': {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: theme.spacing(1.5),
  },
}));

const IconFieldWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5),
  backgroundColor: '#ffffff',
  borderRadius: 10,
  border: '1.5px solid #e5e7eb',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#dc2626',
    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.1)',
  },
  '&:focus-within': {
    borderColor: '#dc2626',
    borderWidth: '2px',
    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
  },
  '& .icon-wrapper': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
    color: '#dc2626',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  minWidth: 120,
}));

const SectionAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: '12px !important',
  border: '1px solid #e5e7eb',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  overflow: 'hidden',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: theme.spacing(0, 0, 2, 0),
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  },
  '& .MuiAccordionSummary-root': {
    padding: theme.spacing(2, 3),
    minHeight: 64,
    '& .MuiAccordionSummary-content': {
      margin: 0,
      '& .MuiTypography-root': {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: '1.125rem',
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
    },
    '& .MuiSvgIcon-root': {
      fontSize: '1.5rem',
    },
  },
  '& .MuiAccordionDetails-root': {
    padding: theme.spacing(3),
    backgroundColor: '#fafafa',
  },
}));

interface BusinessDetailsEditProps {
  businessData?: any;
}

const BusinessDetailsEdit: React.FC<BusinessDetailsEditProps> = ({
  businessData
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [originalData] = useState(businessData);
  const [formData, setFormData] = useState({
    // Basic Business Information
    business_name: businessData?.business_name || '',
    business_type: businessData?.business_type || '',
    company_registration_number: businessData?.company_registration_number || '',
    vat_number: businessData?.vat_number || '',
    
    // UK Real Estate Specific Fields
    estate_agent_license: businessData?.estate_agent_license || '',
    property_ombudsman_membership: businessData?.property_ombudsman_membership || '',
    redress_scheme: businessData?.redress_scheme || '',
    client_money_protection: businessData?.client_money_protection || '',
    
    // Business Address
    business_address: {
      street: businessData?.business_address?.street || '',
      city: businessData?.business_address?.city || '',
      county: businessData?.business_address?.county || '',
      postcode: businessData?.business_address?.postcode || '',
      country: businessData?.business_address?.country || 'United Kingdom',
    },
    
    // Contact Information
    business_phone: businessData?.business_phone || '',
    business_email: businessData?.business_email || '',
    website: businessData?.website || '',
    
    // Services and Specializations
    services: businessData?.services || [],
    specializations: businessData?.specializations || [],
    coverage_areas: businessData?.coverage_areas || [],
    
    // Business Hours
    business_hours: {
      monday: {
        open: businessData?.business_hours?.monday?.open || '',
        close: businessData?.business_hours?.monday?.close || '',
        closed: businessData?.business_hours?.monday?.closed || false,
      },
      tuesday: {
        open: businessData?.business_hours?.tuesday?.open || '',
        close: businessData?.business_hours?.tuesday?.close || '',
        closed: businessData?.business_hours?.tuesday?.closed || false,
      },
      wednesday: {
        open: businessData?.business_hours?.wednesday?.open || '',
        close: businessData?.business_hours?.wednesday?.close || '',
        closed: businessData?.business_hours?.wednesday?.closed || false,
      },
      thursday: {
        open: businessData?.business_hours?.thursday?.open || '',
        close: businessData?.business_hours?.thursday?.close || '',
        closed: businessData?.business_hours?.thursday?.closed || false,
      },
      friday: {
        open: businessData?.business_hours?.friday?.open || '',
        close: businessData?.business_hours?.friday?.close || '',
        closed: businessData?.business_hours?.friday?.closed || false,
      },
      saturday: {
        open: businessData?.business_hours?.saturday?.open || '',
        close: businessData?.business_hours?.saturday?.close || '',
        closed: businessData?.business_hours?.saturday?.closed || false,
      },
      sunday: {
        open: businessData?.business_hours?.sunday?.open || '',
        close: businessData?.business_hours?.sunday?.close || '',
        closed: businessData?.business_hours?.sunday?.closed || false,
      },
    },
    
    // Professional Information
    years_in_business: businessData?.years_in_business || '',
    business_description: businessData?.business_description || '',
    languages_spoken: businessData?.languages_spoken || [],
    
    // Insurance Details
    professional_indemnity_insurance: {
      provider: businessData?.professional_indemnity_insurance?.provider || '',
      policy_number: businessData?.professional_indemnity_insurance?.policy_number || '',
      expiry_date: businessData?.professional_indemnity_insurance?.expiry_date || '',
      coverage_amount: businessData?.professional_indemnity_insurance?.coverage_amount || '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleArrayChange = (field: string, value: string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBusinessHoursChange = (day: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      business_hours: {
        ...prev.business_hours,
        [day]: {
          ...prev.business_hours[day as keyof typeof prev.business_hours],
          [field]: value,
        },
      },
    }));
  };

  const hasChanges = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }, [formData, originalData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put(`/api/user/business-details/${businessData._id}`, formData);
      enqueueSnackbar(res.data.message || 'Business details updated successfully', {
        variant: 'success',
      });
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || error.message || 'Failed to update business details', {
        variant: 'error',
      });
    }
  };

  const businessTypes = [
    { value: 'sole_trader', label: 'Sole Trader' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'limited_company', label: 'Limited Company' },
    { value: 'llp', label: 'Limited Liability Partnership (LLP)' },
  ];

  const redressSchemes = [
    { value: 'property_ombudsman', label: 'Property Ombudsman' },
    { value: 'property_redress_scheme', label: 'Property Redress Scheme' },
    { value: 'ombudsman_services', label: 'Ombudsman Services' },
  ];

  const services = [
    { value: 'sales', label: 'Sales' },
    { value: 'lettings', label: 'Lettings' },
    { value: 'property_management', label: 'Property Management' },
    { value: 'valuation', label: 'Valuation' },
    { value: 'mortgage_advice', label: 'Mortgage Advice' },
    { value: 'conveyancing', label: 'Conveyancing' },
    { value: 'surveying', label: 'Surveying' },
    { value: 'auction_services', label: 'Auction Services' },
    { value: 'commercial_property', label: 'Commercial Property' },
    { value: 'new_homes', label: 'New Homes' },
    { value: 'overseas_property', label: 'Overseas Property' },
  ];

  const specializations = [
    { value: 'residential_sales', label: 'Residential Sales' },
    { value: 'residential_lettings', label: 'Residential Lettings' },
    { value: 'commercial_sales', label: 'Commercial Sales' },
    { value: 'commercial_lettings', label: 'Commercial Lettings' },
    { value: 'luxury_properties', label: 'Luxury Properties' },
    { value: 'first_time_buyers', label: 'First Time Buyers' },
    { value: 'buy_to_let', label: 'Buy to Let' },
    { value: 'new_builds', label: 'New Builds' },
    { value: 'period_properties', label: 'Period Properties' },
    { value: 'apartments', label: 'Apartments' },
    { value: 'houses', label: 'Houses' },
    { value: 'land', label: 'Land' },
    { value: 'development_sites', label: 'Development Sites' },
  ];

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <StyledCard>
      <SectionHeader>
        <BusinessIcon sx={{ fontSize: '2.5rem' }} />
        <Typography variant="h5" sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, letterSpacing: '-0.02em' }}>
          Business Details
        </Typography>
      </SectionHeader>

      <CardContent sx={{ p: { xs: 3, md: 4 }, fontFamily: '"Inter", "Roboto", sans-serif' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2, fontFamily: '"Inter", sans-serif' }}>
            <Typography component="pre" sx={{ whiteSpace: 'pre-line', margin: 0, fontFamily: 'inherit', fontSize: '0.9375rem', fontWeight: 500 }}>
              {error}
            </Typography>
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2, fontFamily: '"Inter", sans-serif', fontSize: '0.9375rem', fontWeight: 500 }}>
            {success}
          </Alert>
        )}

        {loading && (
          <Loader
            fullscreen={false}
            size="medium"
          />
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {/* Basic Business Information */}
          <SectionAccordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#dc2626' }} />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                }}>
                  <BusinessIcon sx={{ fontSize: '1.75rem' }} />
                </Box>
                <Typography variant="h6" sx={{ color: '#dc2626', fontWeight: 600, fontFamily: '"Inter", sans-serif', letterSpacing: '-0.01em' }}>
                  Basic Business Information
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid size={12}>
                  <GradientBorderField>
                    <Box className="field-content">
                      <IconFieldWrapper>
                        <Box className="icon-wrapper">
                          <BusinessIcon />
                        </Box>
                        <StyledTextField
                          fullWidth
                          name="business_name"
                          label="Business Name"
                          value={formData.business_name}
                          onChange={handleChange}
                          required
                          variant="standard"
                          InputProps={{ disableUnderline: true }}
                          sx={{ 
                            '& .MuiInputBase-input': { 
                              fontSize: '1rem',
                              fontWeight: 500,
                              padding: '4px 0'
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              transform: 'none',
                              position: 'static',
                              marginBottom: 1,
                            }
                          }}
                        />
                      </IconFieldWrapper>
                    </Box>
                  </GradientBorderField>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <CardFieldContainer>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <CorporateIcon sx={{ color: '#dc2626', fontSize: '1.25rem' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', fontFamily: '"Inter", sans-serif' }}>
                        Business Type
                      </Typography>
                      <Typography component="span" sx={{ color: '#dc2626', ml: 'auto' }}>*</Typography>
                    </Box>
                    <FormControl fullWidth required>
                      <Select
                        name="business_type"
                        value={formData.business_type}
                        onChange={(e) => setFormData(prev => ({ ...prev, business_type: e.target.value }))}
                        sx={{
                          fontFamily: '"Inter", sans-serif',
                          fontSize: '0.95rem',
                          fontWeight: 400,
                          '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                          },
                        }}
                      >
                        {businessTypes.map((type) => (
                          <MenuItem key={type.value} value={type.value} sx={{ fontFamily: '"Inter", sans-serif' }}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </CardFieldContainer>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <CardFieldContainer>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <BadgeIcon sx={{ color: '#dc2626', fontSize: '1.25rem' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', fontFamily: '"Inter", sans-serif' }}>
                        Company Registration Number
                      </Typography>
                    </Box>
                    <StyledTextField
                      fullWidth
                      name="company_registration_number"
                      label=""
                      value={formData.company_registration_number}
                      onChange={handleChange}
                      disabled={!['limited_company', 'llp'].includes(formData.business_type)}
                      helperText={!['limited_company', 'llp'].includes(formData.business_type) ? 'Required for Limited Company and LLP' : ''}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'transparent',
                          '& fieldset': { border: 'none' },
                        },
                      }}
                    />
                  </CardFieldContainer>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <IconFieldWrapper>
                    <Box className="icon-wrapper">
                      <ReceiptIcon />
                    </Box>
                    <StyledTextField
                      fullWidth
                      name="vat_number"
                      label="VAT Number"
                      value={formData.vat_number}
                      onChange={handleChange}
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                      sx={{ 
                        '& .MuiInputBase-input': { 
                          fontSize: '1rem',
                          fontWeight: 400,
                          padding: '4px 0'
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          transform: 'none',
                          position: 'static',
                          marginBottom: 1,
                        }
                      }}
                    />
                  </IconFieldWrapper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <GradientBorderField>
                    <Box className="field-content">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CalendarIcon sx={{ color: '#dc2626', fontSize: '1.5rem' }} />
                        <StyledTextField
                          fullWidth
                          name="years_in_business"
                          label="Years in Business"
                          type="number"
                          value={formData.years_in_business}
                          onChange={handleChange}
                          inputProps={{ min: 0 }}
                          variant="standard"
                          InputProps={{ disableUnderline: true }}
                          sx={{ 
                            '& .MuiInputBase-input': { 
                              fontSize: '1rem',
                              fontWeight: 500,
                              padding: '4px 0'
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              transform: 'none',
                              position: 'static',
                              marginBottom: 1,
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  </GradientBorderField>
                </Grid>
              </Grid>
            </AccordionDetails>
          </SectionAccordion>

          {/* UK Real Estate Specific Fields */}
          <SectionAccordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#dc2626' }} />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                }}>
                  <SecurityIcon sx={{ fontSize: '1.75rem' }} />
                </Box>
                <Typography variant="h6" sx={{ color: '#dc2626', fontWeight: 600, fontFamily: '"Inter", sans-serif', letterSpacing: '-0.01em' }}>
                  UK Real Estate Compliance
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <IconFieldWrapper>
                    <Box className="icon-wrapper">
                      <VerifiedIcon />
                    </Box>
                    <StyledTextField
                      fullWidth
                      name="estate_agent_license"
                      label="Estate Agent License"
                      value={formData.estate_agent_license}
                      onChange={handleChange}
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                      sx={{ 
                        '& .MuiInputBase-input': { 
                          fontSize: '1rem',
                          fontWeight: 400,
                          padding: '4px 0'
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          transform: 'none',
                          position: 'static',
                          marginBottom: 1,
                        }
                      }}
                    />
                  </IconFieldWrapper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <CardFieldContainer>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <AccountBalanceIcon sx={{ color: '#dc2626', fontSize: '1.25rem' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', fontFamily: '"Inter", sans-serif' }}>
                        Property Ombudsman Membership
                      </Typography>
                    </Box>
                    <StyledTextField
                      fullWidth
                      name="property_ombudsman_membership"
                      label=""
                      value={formData.property_ombudsman_membership}
                      onChange={handleChange}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'transparent',
                          '& fieldset': { border: 'none' },
                        },
                      }}
                    />
                  </CardFieldContainer>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <GradientBorderField>
                    <Box className="field-content">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                        <GavelIcon sx={{ color: '#dc2626', fontSize: '1.25rem' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', fontFamily: '"Inter", sans-serif' }}>
                          Redress Scheme
                        </Typography>
                      </Box>
                      <FormControl fullWidth>
                        <Select
                          name="redress_scheme"
                          value={formData.redress_scheme}
                          onChange={(e) => setFormData(prev => ({ ...prev, redress_scheme: e.target.value }))}
                          sx={{
                            fontFamily: '"Inter", sans-serif',
                            fontSize: '0.95rem',
                            fontWeight: 400,
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: 'none',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              border: 'none',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              border: 'none',
                            },
                          }}
                        >
                          {redressSchemes.map((scheme) => (
                            <MenuItem key={scheme.value} value={scheme.value} sx={{ fontFamily: '"Inter", sans-serif' }}>
                              {scheme.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </GradientBorderField>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <IconFieldWrapper>
                    <Box className="icon-wrapper">
                      <PaymentIcon />
                    </Box>
                    <StyledTextField
                      fullWidth
                      name="client_money_protection"
                      label="Client Money Protection"
                      value={formData.client_money_protection}
                      onChange={handleChange}
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                      sx={{ 
                        '& .MuiInputBase-input': { 
                          fontSize: '1rem',
                          fontWeight: 400,
                          padding: '4px 0'
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          transform: 'none',
                          position: 'static',
                          marginBottom: 1,
                        }
                      }}
                    />
                  </IconFieldWrapper>
                </Grid>
              </Grid>
            </AccordionDetails>
          </SectionAccordion>

          {/* Business Address */}
          <SectionAccordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#dc2626' }} />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                }}>
                  <LocationIcon sx={{ fontSize: '1.75rem' }} />
                </Box>
                <Typography variant="h6" sx={{ color: '#dc2626', fontWeight: 600, fontFamily: '"Inter", sans-serif', letterSpacing: '-0.01em' }}>
                  Business Address
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid size={12}>
                  <GradientBorderField>
                    <Box className="field-content">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <PlaceIcon sx={{ color: '#dc2626', fontSize: '1.5rem' }} />
                        <StyledTextField
                          fullWidth
                          name="business_address.street"
                          label="Street Address"
                          value={formData.business_address.street}
                          onChange={handleChange}
                          required
                          variant="standard"
                          InputProps={{ disableUnderline: true }}
                          sx={{ 
                            '& .MuiInputBase-input': { 
                              fontSize: '1rem',
                              fontWeight: 500,
                              padding: '4px 0'
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              transform: 'none',
                              position: 'static',
                              marginBottom: 1,
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  </GradientBorderField>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <CardFieldContainer>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <HomeIcon sx={{ color: '#dc2626', fontSize: '1.25rem' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', fontFamily: '"Inter", sans-serif' }}>
                        City
                      </Typography>
                      <Typography component="span" sx={{ color: '#dc2626', ml: 'auto' }}>*</Typography>
                    </Box>
                    <StyledTextField
                      fullWidth
                      name="business_address.city"
                      label=""
                      value={formData.business_address.city}
                      onChange={handleChange}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'transparent',
                          '& fieldset': { border: 'none' },
                        },
                      }}
                    />
                  </CardFieldContainer>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <IconFieldWrapper>
                    <Box className="icon-wrapper">
                      <ApartmentIcon />
                    </Box>
                    <StyledTextField
                      fullWidth
                      name="business_address.county"
                      label="County"
                      value={formData.business_address.county}
                      onChange={handleChange}
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                      sx={{ 
                        '& .MuiInputBase-input': { 
                          fontSize: '1rem',
                          fontWeight: 400,
                          padding: '4px 0'
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          transform: 'none',
                          position: 'static',
                          marginBottom: 1,
                        }
                      }}
                    />
                  </IconFieldWrapper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <GradientBorderField>
                    <Box className="field-content">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <LocationIcon sx={{ color: '#dc2626', fontSize: '1.5rem' }} />
                        <StyledTextField
                          fullWidth
                          name="business_address.postcode"
                          label="Postcode"
                          value={formData.business_address.postcode}
                          onChange={handleChange}
                          required
                          placeholder="e.g., SW1A 1AA"
                          variant="standard"
                          InputProps={{ disableUnderline: true }}
                          sx={{ 
                            '& .MuiInputBase-input': { 
                              fontSize: '1rem',
                              fontWeight: 500,
                              padding: '4px 0'
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              transform: 'none',
                              position: 'static',
                              marginBottom: 1,
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  </GradientBorderField>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <CardFieldContainer>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <PublicIcon sx={{ color: '#dc2626', fontSize: '1.25rem' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', fontFamily: '"Inter", sans-serif' }}>
                        Country
                      </Typography>
                    </Box>
                    <StyledTextField
                      fullWidth
                      name="business_address.country"
                      label=""
                      value={formData.business_address.country}
                      onChange={handleChange}
                      disabled
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'transparent',
                          '& fieldset': { border: 'none' },
                        },
                      }}
                    />
                  </CardFieldContainer>
                </Grid>
              </Grid>
            </AccordionDetails>
          </SectionAccordion>

          {/* Contact Information */}
          <SectionAccordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#dc2626' }} />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                }}>
                  <PhoneIcon sx={{ fontSize: '1.75rem' }} />
                </Box>
                <Typography variant="h6" sx={{ color: '#dc2626', fontWeight: 600, fontFamily: '"Inter", sans-serif', letterSpacing: '-0.01em' }}>
                  Contact Information
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <IconFieldWrapper>
                    <Box className="icon-wrapper">
                      <PhoneIcon />
                    </Box>
                    <StyledTextField
                      fullWidth
                      name="business_phone"
                      label="Business Phone"
                      value={formData.business_phone}
                      onChange={handleChange}
                      required
                      placeholder="+44 20 7946 0958"
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                      sx={{ 
                        '& .MuiInputBase-input': { 
                          fontSize: '1rem',
                          fontWeight: 500,
                          padding: '4px 0'
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          transform: 'none',
                          position: 'static',
                          marginBottom: 1,
                        }
                      }}
                    />
                  </IconFieldWrapper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <GradientBorderField>
                    <Box className="field-content">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <EmailIcon sx={{ color: '#dc2626', fontSize: '1.5rem' }} />
                        <StyledTextField
                          fullWidth
                          name="business_email"
                          label="Business Email"
                          type="email"
                          value={formData.business_email}
                          onChange={handleChange}
                          required
                          variant="standard"
                          InputProps={{ disableUnderline: true }}
                          sx={{ 
                            '& .MuiInputBase-input': { 
                              fontSize: '1rem',
                              fontWeight: 500,
                              padding: '4px 0'
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              transform: 'none',
                              position: 'static',
                              marginBottom: 1,
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  </GradientBorderField>
                </Grid>

                <Grid size={12}>
                  <CardFieldContainer>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <WebsiteIcon sx={{ color: '#dc2626', fontSize: '1.25rem' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', fontFamily: '"Inter", sans-serif' }}>
                        Website
                      </Typography>
                    </Box>
                    <StyledTextField
                      fullWidth
                      name="website"
                      label=""
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://www.yourwebsite.com"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'transparent',
                          '& fieldset': { border: 'none' },
                        },
                      }}
                    />
                  </CardFieldContainer>
                </Grid>
              </Grid>
            </AccordionDetails>
          </SectionAccordion>

          {/* Services and Specializations */}
          <SectionAccordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#dc2626' }} />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                }}>
                  <WorkIcon sx={{ fontSize: '1.75rem' }} />
                </Box>
                <Typography variant="h6" sx={{ color: '#dc2626', fontWeight: 600, fontFamily: '"Inter", sans-serif', letterSpacing: '-0.01em' }}>
                  Services & Specializations
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid size={12}>
                  <GradientBorderField>
                    <Box className="field-content">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <WorkIcon sx={{ color: '#dc2626', fontSize: '1.5rem' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', fontFamily: '"Inter", sans-serif' }}>
                          Services Offered
                        </Typography>
                      </Box>
                      <FormControl fullWidth>
                        <Select
                          multiple
                          value={formData.services}
                          onChange={(e) => handleArrayChange('services', e.target.value as string[])}
                          input={<OutlinedInput label="" />}
                          sx={{
                            fontFamily: '"Inter", sans-serif',
                            fontSize: '0.95rem',
                            fontWeight: 400,
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: 'none',
                            },
                          }}
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {(selected as string[]).map((value) => (
                                <Chip 
                                  key={value} 
                                  label={services.find(s => s.value === value)?.label || value}
                                  sx={{ 
                                    fontFamily: '"Inter", sans-serif',
                                    fontWeight: 500,
                                    backgroundColor: '#fee2e2',
                                    color: '#dc2626',
                                  }}
                                />
                              ))}
                            </Box>
                          )}
                        >
                          {services.map((service) => (
                            <MenuItem key={service.value} value={service.value} sx={{ fontFamily: '"Inter", sans-serif' }}>
                              {service.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </GradientBorderField>
                </Grid>

                <Grid size={12}>
                  <CardFieldContainer>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <StarIcon sx={{ color: '#dc2626', fontSize: '1.25rem' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', fontFamily: '"Inter", sans-serif' }}>
                        Specializations
                      </Typography>
                    </Box>
                    <FormControl fullWidth>
                      <Select
                        multiple
                        value={formData.specializations}
                        onChange={(e) => handleArrayChange('specializations', e.target.value as string[])}
                        input={<OutlinedInput label="" />}
                        sx={{
                          fontFamily: '"Inter", sans-serif',
                          fontSize: '0.95rem',
                          fontWeight: 400,
                          '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                          },
                        }}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {(selected as string[]).map((value) => (
                              <Chip 
                                key={value} 
                                label={specializations.find(s => s.value === value)?.label || value}
                                sx={{ 
                                  fontFamily: '"Inter", sans-serif',
                                  fontWeight: 500,
                                  backgroundColor: '#fee2e2',
                                  color: '#dc2626',
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      >
                        {specializations.map((specialization) => (
                          <MenuItem key={specialization.value} value={specialization.value} sx={{ fontFamily: '"Inter", sans-serif' }}>
                            {specialization.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </CardFieldContainer>
                </Grid>

                <Grid size={12}>
                  <IconFieldWrapper>
                    <Box className="icon-wrapper">
                      <LocationIcon />
                    </Box>
                    <StyledTextField
                      fullWidth
                      name="coverage_areas"
                      label="Coverage Areas (comma-separated)"
                      value={formData.coverage_areas.join(', ')}
                      onChange={(e) => handleArrayChange('coverage_areas', e.target.value.split(',').map(area => area.trim()).filter(area => area))}
                      placeholder="e.g., London, Manchester, Birmingham"
                      multiline
                      rows={2}
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                      sx={{ 
                        '& .MuiInputBase-input': { 
                          fontSize: '1rem',
                          fontWeight: 400,
                          padding: '4px 0'
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          transform: 'none',
                          position: 'static',
                          marginBottom: 1,
                        }
                      }}
                    />
                  </IconFieldWrapper>
                </Grid>
              </Grid>
            </AccordionDetails>
          </SectionAccordion>

          {/* Business Hours */}
          <SectionAccordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#dc2626' }} />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                }}>
                  <ScheduleIcon sx={{ fontSize: '1.75rem' }} />
                </Box>
                <Typography variant="h6" sx={{ color: '#dc2626', fontWeight: 600, fontFamily: '"Inter", sans-serif', letterSpacing: '-0.01em' }}>
                  Business Hours
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                {days.map((day, index) => (
                  <Grid size={{ xs: 12, md: 6 }} key={day}>
                    {index % 2 === 0 ? (
                      <GradientBorderField>
                        <Box className="field-content">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            <AccessTimeIcon sx={{ color: '#dc2626', fontSize: '1.25rem' }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, textTransform: 'capitalize', fontFamily: '"Inter", sans-serif', color: '#1f2937' }}>
                              {day}
                            </Typography>
                          </Box>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={formData.business_hours[day as keyof typeof formData.business_hours].closed}
                                onChange={(e) => handleBusinessHoursChange(day, 'closed', e.target.checked)}
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#dc2626',
                                  },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#dc2626',
                                  },
                                }}
                              />
                            }
                            label={<Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 500, fontSize: '0.875rem' }}>Closed</Typography>}
                          />
                          {!formData.business_hours[day as keyof typeof formData.business_hours].closed && (
                            <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
                              <StyledTextField
                                label="Open"
                                type="time"
                                value={formData.business_hours[day as keyof typeof formData.business_hours].open}
                                onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                                sx={{
                                  flex: 1,
                                  '& .MuiInputBase-input': {
                                    fontFamily: '"Inter", sans-serif',
                                    fontWeight: 500,
                                  },
                                }}
                              />
                              <StyledTextField
                                label="Close"
                                type="time"
                                value={formData.business_hours[day as keyof typeof formData.business_hours].close}
                                onChange={(e) => handleBusinessHoursChange(day, 'close', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                                sx={{
                                  flex: 1,
                                  '& .MuiInputBase-input': {
                                    fontFamily: '"Inter", sans-serif',
                                    fontWeight: 500,
                                  },
                                }}
                              />
                            </Box>
                          )}
                        </Box>
                      </GradientBorderField>
                    ) : (
                      <CardFieldContainer>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                          <AccessTimeIcon sx={{ color: '#dc2626', fontSize: '1.25rem' }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, textTransform: 'capitalize', fontFamily: '"Inter", sans-serif', color: '#1f2937' }}>
                            {day}
                          </Typography>
                        </Box>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.business_hours[day as keyof typeof formData.business_hours].closed}
                              onChange={(e) => handleBusinessHoursChange(day, 'closed', e.target.checked)}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: '#dc2626',
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                  backgroundColor: '#dc2626',
                                },
                              }}
                            />
                          }
                          label={<Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 500, fontSize: '0.875rem' }}>Closed</Typography>}
                        />
                        {!formData.business_hours[day as keyof typeof formData.business_hours].closed && (
                          <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
                            <StyledTextField
                              label="Open"
                              type="time"
                              value={formData.business_hours[day as keyof typeof formData.business_hours].open}
                              onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                              size="small"
                              sx={{
                                flex: 1,
                                '& .MuiOutlinedInput-root': {
                                  backgroundColor: 'transparent',
                                  '& fieldset': { border: 'none', borderBottom: '1.5px solid #e5e7eb' },
                                  '&:hover fieldset': { borderBottom: '1.5px solid #dc2626' },
                                  '&.Mui-focused fieldset': { borderBottom: '2px solid #dc2626' },
                                },
                                '& .MuiInputBase-input': {
                                  fontFamily: '"Inter", sans-serif',
                                  fontWeight: 500,
                                },
                              }}
                            />
                            <StyledTextField
                              label="Close"
                              type="time"
                              value={formData.business_hours[day as keyof typeof formData.business_hours].close}
                              onChange={(e) => handleBusinessHoursChange(day, 'close', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                              size="small"
                              sx={{
                                flex: 1,
                                '& .MuiOutlinedInput-root': {
                                  backgroundColor: 'transparent',
                                  '& fieldset': { border: 'none', borderBottom: '1.5px solid #e5e7eb' },
                                  '&:hover fieldset': { borderBottom: '1.5px solid #dc2626' },
                                  '&.Mui-focused fieldset': { borderBottom: '2px solid #dc2626' },
                                },
                                '& .MuiInputBase-input': {
                                  fontFamily: '"Inter", sans-serif',
                                  fontWeight: 500,
                                },
                              }}
                            />
                          </Box>
                        )}
                      </CardFieldContainer>
                    )}
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </SectionAccordion>

          {/* Professional Information */}
          <SectionAccordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#dc2626' }} />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                }}>
                  <SchoolIcon sx={{ fontSize: '1.75rem' }} />
                </Box>
                <Typography variant="h6" sx={{ color: '#dc2626', fontWeight: 600, fontFamily: '"Inter", sans-serif', letterSpacing: '-0.01em' }}>
                  Professional Information
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid size={12}>
                  <CardFieldContainer>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <DescriptionIcon sx={{ color: '#dc2626', fontSize: '1.25rem' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', fontFamily: '"Inter", sans-serif' }}>
                        Business Description
                      </Typography>
                    </Box>
                    <StyledTextField
                      fullWidth
                      name="business_description"
                      label=""
                      value={formData.business_description}
                      onChange={handleChange}
                      multiline
                      rows={4}
                      placeholder="Describe your business, services, and what makes you unique..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'transparent',
                          '& fieldset': { border: 'none' },
                        },
                        '& .MuiInputBase-input': {
                          fontFamily: '"Inter", sans-serif',
                          fontSize: '0.9375rem',
                          lineHeight: 1.6,
                          fontWeight: 400,
                        },
                      }}
                    />
                  </CardFieldContainer>
                </Grid>

                <Grid size={12}>
                  <IconFieldWrapper>
                    <Box className="icon-wrapper">
                      <TranslateIcon />
                    </Box>
                    <StyledTextField
                      fullWidth
                      name="languages_spoken"
                      label="Languages Spoken (comma-separated)"
                      value={formData.languages_spoken.join(', ')}
                      onChange={(e) => handleArrayChange('languages_spoken', e.target.value.split(',').map(lang => lang.trim()).filter(lang => lang))}
                      placeholder="e.g., English, Spanish, French"
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                      sx={{ 
                        '& .MuiInputBase-input': { 
                          fontSize: '1rem',
                          fontWeight: 400,
                          padding: '4px 0'
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          transform: 'none',
                          position: 'static',
                          marginBottom: 1,
                        }
                      }}
                    />
                  </IconFieldWrapper>
                </Grid>
              </Grid>
            </AccordionDetails>
          </SectionAccordion>

          {/* Insurance Details */}
          <SectionAccordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#dc2626' }} />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                }}>
                  <ShieldIcon sx={{ fontSize: '1.75rem' }} />
                </Box>
                <Typography variant="h6" sx={{ color: '#dc2626', fontWeight: 600, fontFamily: '"Inter", sans-serif', letterSpacing: '-0.01em' }}>
                  Insurance Details
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <IconFieldWrapper>
                    <Box className="icon-wrapper">
                      <LocalHospitalIcon />
                    </Box>
                    <StyledTextField
                      fullWidth
                      name="professional_indemnity_insurance.provider"
                      label="Insurance Provider"
                      value={formData.professional_indemnity_insurance.provider}
                      onChange={handleChange}
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                      sx={{ 
                        '& .MuiInputBase-input': { 
                          fontSize: '1rem',
                          fontWeight: 400,
                          padding: '4px 0'
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          transform: 'none',
                          position: 'static',
                          marginBottom: 1,
                        }
                      }}
                    />
                  </IconFieldWrapper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <CardFieldContainer>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <AssignmentIcon sx={{ color: '#dc2626', fontSize: '1.25rem' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', fontFamily: '"Inter", sans-serif' }}>
                        Policy Number
                      </Typography>
                    </Box>
                    <StyledTextField
                      fullWidth
                      name="professional_indemnity_insurance.policy_number"
                      label=""
                      value={formData.professional_indemnity_insurance.policy_number}
                      onChange={handleChange}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'transparent',
                          '& fieldset': { border: 'none' },
                        },
                      }}
                    />
                  </CardFieldContainer>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <GradientBorderField>
                    <Box className="field-content">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <EventIcon sx={{ color: '#dc2626', fontSize: '1.5rem' }} />
                        <StyledTextField
                          fullWidth
                          name="professional_indemnity_insurance.expiry_date"
                          label="Expiry Date"
                          type="date"
                          value={formData.professional_indemnity_insurance.expiry_date}
                          onChange={handleChange}
                          InputLabelProps={{ shrink: true }}
                          variant="standard"
                          InputProps={{ disableUnderline: true }}
                          sx={{ 
                            '& .MuiInputBase-input': { 
                              fontSize: '1rem',
                              fontWeight: 500,
                              padding: '4px 0'
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              transform: 'none',
                              position: 'static',
                              marginBottom: 1,
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  </GradientBorderField>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <IconFieldWrapper>
                    <Box className="icon-wrapper">
                      <AttachMoneyIcon />
                    </Box>
                    <StyledTextField
                      fullWidth
                      name="professional_indemnity_insurance.coverage_amount"
                      label="Coverage Amount (£)"
                      type="number"
                      value={formData.professional_indemnity_insurance.coverage_amount}
                      onChange={handleChange}
                      inputProps={{ min: 0 }}
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                      sx={{ 
                        '& .MuiInputBase-input': { 
                          fontSize: '1rem',
                          fontWeight: 400,
                          padding: '4px 0'
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          transform: 'none',
                          position: 'static',
                          marginBottom: 1,
                        }
                      }}
                    />
                  </IconFieldWrapper>
                </Grid>
              </Grid>
            </AccordionDetails>
          </SectionAccordion>

          {/* Action Buttons */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'flex-end', 
            mt: 4,
            flexDirection: { xs: 'column', sm: 'row' },
            paddingTop: 3,
            borderTop: '2px solid #e5e7eb',
          }}>
            <ActionButton
              type="submit"
              variant="contained"
              disabled={loading || !hasChanges}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon sx={{ fontSize: '1.25rem' }} />}
              sx={{
                backgroundColor: '#dc2626',
                fontFamily: '"Inter", sans-serif',
                fontSize: '1rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
                padding: '12px 32px',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                '&:hover': {
                  backgroundColor: '#b91c1c',
                  boxShadow: '0 6px 16px rgba(220, 38, 38, 0.4)',
                  transform: 'translateY(-1px)',
                },
                '&:disabled': {
                  backgroundColor: '#fca5a5',
                  boxShadow: 'none',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? 'Saving...' : 'Save Business Details'}
            </ActionButton>
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default BusinessDetailsEdit;
