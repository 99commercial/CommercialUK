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
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axiosInstance from '@/utils/axios';
import { enqueueSnackbar } from 'notistack';

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

const SectionAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: theme.spacing(0, 0, 2, 0),
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
      const res = await axiosInstance.put(`/api/agent/business-details/${businessData._id}`, formData);
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
        <BusinessIcon />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Business Details
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
          {/* Basic Business Information */}
          <SectionAccordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessIcon sx={{ color: '#dc2626' }} />
                <Typography variant="h6" sx={{ color: '#dc2626', fontWeight: 600 }}>
                  Basic Business Information
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid size={12}>
                  <StyledTextField
                    fullWidth
                    name="business_name"
                    label="Business Name"
                    value={formData.business_name}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon sx={{ color: '#dc2626' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth required>
                    <InputLabel>Business Type</InputLabel>
                    <Select
                      name="business_type"
                      value={formData.business_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, business_type: e.target.value }))}
                      label="Business Type"
                    >
                      {businessTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <StyledTextField
                    fullWidth
                    name="company_registration_number"
                    label="Company Registration Number"
                    value={formData.company_registration_number}
                    onChange={handleChange}
                    disabled={!['limited_company', 'llp'].includes(formData.business_type)}
                    helperText={!['limited_company', 'llp'].includes(formData.business_type) ? 'Required for Limited Company and LLP' : ''}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <StyledTextField
                    fullWidth
                    name="vat_number"
                    label="VAT Number"
                    value={formData.vat_number}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <StyledTextField
                    fullWidth
                    name="years_in_business"
                    label="Years in Business"
                    type="number"
                    value={formData.years_in_business}
                    onChange={handleChange}
                    inputProps={{ min: 0 }}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </SectionAccordion>

          {/* UK Real Estate Specific Fields */}
          <SectionAccordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SecurityIcon sx={{ color: '#dc2626' }} />
                <Typography variant="h6" sx={{ color: '#dc2626', fontWeight: 600 }}>
                  UK Real Estate Compliance
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <StyledTextField
                    fullWidth
                    name="estate_agent_license"
                    label="Estate Agent License"
                    value={formData.estate_agent_license}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <StyledTextField
                    fullWidth
                    name="property_ombudsman_membership"
                    label="Property Ombudsman Membership"
                    value={formData.property_ombudsman_membership}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Redress Scheme</InputLabel>
                    <Select
                      name="redress_scheme"
                      value={formData.redress_scheme}
                      onChange={(e) => setFormData(prev => ({ ...prev, redress_scheme: e.target.value }))}
                      label="Redress Scheme"
                    >
                      {redressSchemes.map((scheme) => (
                        <MenuItem key={scheme.value} value={scheme.value}>
                          {scheme.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <StyledTextField
                    fullWidth
                    name="client_money_protection"
                    label="Client Money Protection"
                    value={formData.client_money_protection}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </SectionAccordion>

          {/* Business Address */}
          <SectionAccordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon sx={{ color: '#dc2626' }} />
                <Typography variant="h6" sx={{ color: '#dc2626', fontWeight: 600 }}>
                  Business Address
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid size={12}>
                  <StyledTextField
                    fullWidth
                    name="business_address.street"
                    label="Street Address"
                    value={formData.business_address.street}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <StyledTextField
                    fullWidth
                    name="business_address.city"
                    label="City"
                    value={formData.business_address.city}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <StyledTextField
                    fullWidth
                    name="business_address.county"
                    label="County"
                    value={formData.business_address.county}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <StyledTextField
                    fullWidth
                    name="business_address.postcode"
                    label="Postcode"
                    value={formData.business_address.postcode}
                    onChange={handleChange}
                    required
                    placeholder="e.g., SW1A 1AA"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <StyledTextField
                    fullWidth
                    name="business_address.country"
                    label="Country"
                    value={formData.business_address.country}
                    onChange={handleChange}
                    disabled
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </SectionAccordion>

          {/* Contact Information */}
          <SectionAccordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ color: '#dc2626' }} />
                <Typography variant="h6" sx={{ color: '#dc2626', fontWeight: 600 }}>
                  Contact Information
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <StyledTextField
                    fullWidth
                    name="business_phone"
                    label="Business Phone"
                    value={formData.business_phone}
                    onChange={handleChange}
                    required
                    placeholder="+44 20 7946 0958"
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
                    name="business_email"
                    label="Business Email"
                    type="email"
                    value={formData.business_email}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: '#dc2626' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid size={12}>
                  <StyledTextField
                    fullWidth
                    name="website"
                    label="Website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://www.yourwebsite.com"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WebsiteIcon sx={{ color: '#dc2626' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </SectionAccordion>

          {/* Services and Specializations */}
          <SectionAccordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WorkIcon sx={{ color: '#dc2626' }} />
                <Typography variant="h6" sx={{ color: '#dc2626', fontWeight: 600 }}>
                  Services & Specializations
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid size={12}>
                  <FormControl fullWidth>
                    <InputLabel>Services Offered</InputLabel>
                    <Select
                      multiple
                      value={formData.services}
                      onChange={(e) => handleArrayChange('services', e.target.value as string[])}
                      input={<OutlinedInput label="Services Offered" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => (
                            <Chip key={value} label={services.find(s => s.value === value)?.label || value} />
                          ))}
                        </Box>
                      )}
                    >
                      {services.map((service) => (
                        <MenuItem key={service.value} value={service.value}>
                          {service.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={12}>
                  <FormControl fullWidth>
                    <InputLabel>Specializations</InputLabel>
                    <Select
                      multiple
                      value={formData.specializations}
                      onChange={(e) => handleArrayChange('specializations', e.target.value as string[])}
                      input={<OutlinedInput label="Specializations" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => (
                            <Chip key={value} label={specializations.find(s => s.value === value)?.label || value} />
                          ))}
                        </Box>
                      )}
                    >
                      {specializations.map((specialization) => (
                        <MenuItem key={specialization.value} value={specialization.value}>
                          {specialization.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={12}>
                  <StyledTextField
                    fullWidth
                    name="coverage_areas"
                    label="Coverage Areas (comma-separated)"
                    value={formData.coverage_areas.join(', ')}
                    onChange={(e) => handleArrayChange('coverage_areas', e.target.value.split(',').map(area => area.trim()).filter(area => area))}
                    placeholder="e.g., London, Manchester, Birmingham"
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </SectionAccordion>

          {/* Business Hours */}
          <SectionAccordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScheduleIcon sx={{ color: '#dc2626' }} />
                <Typography variant="h6" sx={{ color: '#dc2626', fontWeight: 600 }}>
                  Business Hours
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                {days.map((day) => (
                  <Grid size={{ xs: 12, md: 6 }} key={day}>
                    <Card sx={{ p: 2, border: '1px solid #e5e7eb' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, textTransform: 'capitalize' }}>
                        {day}
                      </Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.business_hours[day as keyof typeof formData.business_hours].closed}
                            onChange={(e) => handleBusinessHoursChange(day, 'closed', e.target.checked)}
                          />
                        }
                        label="Closed"
                      />
                      {!formData.business_hours[day as keyof typeof formData.business_hours].closed && (
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <StyledTextField
                            label="Open"
                            type="time"
                            value={formData.business_hours[day as keyof typeof formData.business_hours].open}
                            onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            size="small"
                          />
                          <StyledTextField
                            label="Close"
                            type="time"
                            value={formData.business_hours[day as keyof typeof formData.business_hours].close}
                            onChange={(e) => handleBusinessHoursChange(day, 'close', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            size="small"
                          />
                        </Box>
                      )}
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </SectionAccordion>

          {/* Professional Information */}
          <SectionAccordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SchoolIcon sx={{ color: '#dc2626' }} />
                <Typography variant="h6" sx={{ color: '#dc2626', fontWeight: 600 }}>
                  Professional Information
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid size={12}>
                  <StyledTextField
                    fullWidth
                    name="business_description"
                    label="Business Description"
                    value={formData.business_description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    placeholder="Describe your business, services, and what makes you unique..."
                  />
                </Grid>

                <Grid size={12}>
                  <StyledTextField
                    fullWidth
                    name="languages_spoken"
                    label="Languages Spoken (comma-separated)"
                    value={formData.languages_spoken.join(', ')}
                    onChange={(e) => handleArrayChange('languages_spoken', e.target.value.split(',').map(lang => lang.trim()).filter(lang => lang))}
                    placeholder="e.g., English, Spanish, French"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </SectionAccordion>

          {/* Insurance Details */}
          <SectionAccordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShieldIcon sx={{ color: '#dc2626' }} />
                <Typography variant="h6" sx={{ color: '#dc2626', fontWeight: 600 }}>
                  Insurance Details
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <StyledTextField
                    fullWidth
                    name="professional_indemnity_insurance.provider"
                    label="Insurance Provider"
                    value={formData.professional_indemnity_insurance.provider}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <StyledTextField
                    fullWidth
                    name="professional_indemnity_insurance.policy_number"
                    label="Policy Number"
                    value={formData.professional_indemnity_insurance.policy_number}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <StyledTextField
                    fullWidth
                    name="professional_indemnity_insurance.expiry_date"
                    label="Expiry Date"
                    type="date"
                    value={formData.professional_indemnity_insurance.expiry_date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <StyledTextField
                    fullWidth
                    name="professional_indemnity_insurance.coverage_amount"
                    label="Coverage Amount (£)"
                    type="number"
                    value={formData.professional_indemnity_insurance.coverage_amount}
                    onChange={handleChange}
                    inputProps={{ min: 0 }}
                  />
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
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <ActionButton
              type="submit"
              variant="contained"
              disabled={loading || !hasChanges}
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
              {loading ? 'Saving...' : 'Save Business Details'}
            </ActionButton>
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default BusinessDetailsEdit;
