import React, { useMemo, useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  Chip,
} from '@mui/material';
import axiosInstance from '@/utils/axios';
import { enqueueSnackbar } from 'notistack';
 

export type BusinessFormData = {
  business_name: string;
  business_type: 'sole_trader' | 'partnership' | 'limited_company' | 'llp' | 'franchise' | string;
  company_registration_number?: string;
  vat_number?: string;
  estate_agent_license?: string;
  property_ombudsman_membership?: string;
  redress_scheme?: 'property_ombudsman' | 'property_redress_scheme' | string;
  client_money_protection?: string;
  business_address: {
    street: string;
    city: string;
    county?: string;
    postcode: string;
    country: string;
  };
  business_phone: string;
  business_email: string;
  website?: string;
  services: string[];
};

const BUSINESS_TYPES = [
  { label: 'Sole trader', value: 'sole_trader' },
  { label: 'Partnership', value: 'partnership' },
  { label: 'Limited company', value: 'limited_company' },
  { label: 'Limited liability partnership (LLP)', value: 'llp' },
  { label: 'Franchise', value: 'franchise' },
];

const REDRESS_SCHEMES = [
  { label: 'Property Ombudsman (TPO)', value: 'property_ombudsman' },
  { label: 'Property Redress Scheme (PRS)', value: 'property_redress_scheme' },
  { label: 'Other recognized scheme', value: 'other' },
];

const COUNTIES = [
  'Greater London',
  'West Midlands',
  'Greater Manchester',
  'West Yorkshire',
  'Kent',
  'Essex',
  'Surrey',
];

const COUNTRIES = ['United Kingdom'];

const SERVICE_OPTIONS = [
  { label: 'Sales', value: 'sales' },
  { label: 'Lettings', value: 'lettings' },
  { label: 'Property management', value: 'property_management' },
  { label: 'Valuation', value: 'valuation' },
  { label: 'Mortgage advice', value: 'mortgage_advice' },
  { label: 'Investment consultancy', value: 'investment_consultancy' },
];

const DEFAULT_DATA: BusinessFormData = {
  business_name: '',
  business_type: 'limited_company',
  company_registration_number: '',
  vat_number: '',
  estate_agent_license: '',
  property_ombudsman_membership: '',
  redress_scheme: 'property_ombudsman',
  client_money_protection: '',
  business_address: {
    street: '',
    city: '',
    county: '',
    postcode: '',
    country: 'United Kingdom',
  },
  business_phone: '',
  business_email: '',
  website: '',
  services: [],
};

export default function CreateBusinessForm() {
  const [form, setForm] = useState<BusinessFormData>(DEFAULT_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (field: keyof BusinessFormData, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: keyof BusinessFormData['business_address'], value: any) => {
    setForm(prev => ({ ...prev, business_address: { ...prev.business_address, [field]: value } }));
  };

  const isValidEmail = (email: string) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);
  const isValidUrl = (url: string) => /^https?:\/\//i.test(url);
  const isValidPhone = (phone: string) => /^\+?[0-9]{7,15}$/.test(phone.replace(/\s|-/g, ''));
  const isValidUkPostcode = (pc: string) =>
    /^(GIR 0AA|(?:(?:[A-Z]{1,2}[0-9][A-Z0-9]?) ?[0-9][A-Z]{2}))$/i.test(pc.trim());

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.business_name.trim()) newErrors.business_name = 'Business name is required';
    if (!form.business_email.trim()) newErrors.business_email = 'Email is required';
    else if (!isValidEmail(form.business_email)) newErrors.business_email = 'Enter a valid email';
    if (form.website && !isValidUrl(form.website)) newErrors.website = 'Enter a valid URL (https://...)';
    if (form.business_phone && !isValidPhone(form.business_phone)) newErrors.business_phone = 'Enter a valid phone (international format)';
    if (form.business_address.postcode && !isValidUkPostcode(form.business_address.postcode)) newErrors.postcode = 'Enter a valid UK postcode (e.g., NW1 6XE)';
    if (!form.services || form.services.length === 0) newErrors.services = 'Select at least one service';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showError = (key: string) => Boolean(errors[key]);
  const getHelper = (key: string) => errors[key] || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post('/api/agent/users/business-details', form);
      enqueueSnackbar(res?.data?.message || 'Business created successfully!', { variant: 'success' });
    } catch (err: any) {
      // Handle backend validation errors
      if (err.response?.data?.errors) {
        const backendErrors: Record<string, string> = {};
        Object.keys(err.response.data.errors).forEach(field => {
          backendErrors[field] = err.response.data.errors[field];
        });
        setErrors(backendErrors);
      } else {
        enqueueSnackbar(err.message, { variant: 'error' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReadyToCreate = useMemo(() => {
    const filledBasics =
      form.business_name.trim() !== '' &&
      form.business_type !== undefined && String(form.business_type).trim() !== '' &&
      form.business_email.trim() !== '' && isValidEmail(form.business_email) &&
      form.business_address.street.trim() !== '' &&
      form.business_address.city.trim() !== '' &&
      form.business_address.postcode.trim() !== '' &&
      form.business_address.country.trim() !== '' &&
      form.services.length > 0;

    const optionalFormatsOk =
      (!form.website || isValidUrl(form.website)) &&
      (!form.business_phone || isValidPhone(form.business_phone));

    return filledBasics && optionalFormatsOk;
  }, [form]);

  return (
    <Card variant="outlined">
      <CardContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <TextField
                fullWidth
                label="Business Name"
                value={form.business_name}
                onChange={e => handleChange('business_name', e.target.value)}
                error={showError('business_name')}
                helperText={getHelper('business_name')}
              />
            </Box>
            <Box>
              <TextField
                select
                fullWidth
                label="Business type"
                value={form.business_type}
                onChange={e => handleChange('business_type', e.target.value)}
              >
                {BUSINESS_TYPES.map(t => (
                  <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                ))}
              </TextField>
            </Box>

            <Box>
              <TextField
                fullWidth
                label="Company Registration Number"
                value={form.company_registration_number}
                onChange={e => handleChange('company_registration_number', e.target.value)}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="VAT Number"
                value={form.vat_number}
                onChange={e => handleChange('vat_number', e.target.value)}
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="Estate Agent License"
                value={form.estate_agent_license}
                onChange={e => handleChange('estate_agent_license', e.target.value)}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Ombudsman membership ID"
                value={form.property_ombudsman_membership}
                onChange={e => handleChange('property_ombudsman_membership', e.target.value)}
              />
            </Box>

            <Box>
              <TextField
                select
                fullWidth
                label="Redress scheme"
                value={form.redress_scheme}
                onChange={e => handleChange('redress_scheme', e.target.value)}
              >
                {REDRESS_SCHEMES.map(s => (
                  <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Client Money Protection"
                value={form.client_money_protection}
                onChange={e => handleChange('client_money_protection', e.target.value)}
              />
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 1 }}>Business Address</Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' }, gap: 2 }}>
              <Box>
              <TextField
                fullWidth
                label="Street"
                value={form.business_address.street}
                onChange={e => handleAddressChange('street', e.target.value)}
                error={showError('street')}
                helperText={getHelper('street')}
              />
              </Box>
              <Box>
              <TextField
                fullWidth
                label="City"
                value={form.business_address.city}
                onChange={e => handleAddressChange('city', e.target.value)}
                error={showError('city')}
                helperText={getHelper('city')}
              />
              </Box>
              <Box>
                <TextField
                  select
                  fullWidth
                  label="County"
                  value={form.business_address.county || ''}
                  onChange={e => handleAddressChange('county', e.target.value)}
                  SelectProps={{ native: false }}
                >
                  {COUNTIES.map(c => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box>
              <TextField
                fullWidth
                label="Postcode"
                value={form.business_address.postcode}
                onChange={e => handleAddressChange('postcode', e.target.value)}
                error={showError('postcode')}
                helperText={getHelper('postcode')}
              />
              </Box>
              <Box>
                <TextField
                  select
                  fullWidth
                  label="Country"
                  value={form.business_address.country}
                  onChange={e => handleAddressChange('country', e.target.value)}
                  error={showError('country')}
                  helperText={getHelper('country')}
                >
                  {COUNTRIES.map(c => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 2 }}>
              <Box>
              <TextField
                fullWidth
                label="Business Phone"
                value={form.business_phone}
                onChange={e => handleChange('business_phone', e.target.value)}
                error={showError('business_phone')}
                helperText={getHelper('business_phone')}
              />
              </Box>
              <Box>
              <TextField
                fullWidth
                type="email"
                label="Business Email"
                value={form.business_email}
                onChange={e => handleChange('business_email', e.target.value)}
                error={showError('business_email')}
                helperText={getHelper('business_email')}
              />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  type="url"
                  label="Website"
                  value={form.website}
                  onChange={e => handleChange('website', e.target.value)}
                  error={showError('website')}
                  helperText={getHelper('website')}
                />
              </Box>
            </Box>

            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="services-label">Services</InputLabel>
                <Select
                  labelId="services-label"
                  multiple
                  value={form.services}
                  label="Services"
                  onChange={(e) => handleChange('services', typeof e.target.value === 'string' ? e.target.value.split(',') : (e.target.value as string[]))}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={SERVICE_OPTIONS.find(o => o.value === value)?.label || value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {SERVICE_OPTIONS.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>
                      <Checkbox checked={form.services.indexOf(opt.value) > -1} />
                      <ListItemText primary={opt.label} />
                    </MenuItem>
                  ))}
                </Select>
                {hasSubmitted && errors.services && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {errors.services}
                  </Typography>
                )}
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button type="submit" variant="contained" disabled={isSubmitting || !isReadyToCreate}>
                  {isSubmitting ? 'Saving...' : 'Create Business'}
                </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}


