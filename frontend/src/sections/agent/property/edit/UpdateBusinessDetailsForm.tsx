import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  Divider,
  Button,
  IconButton,
  Card,
  CardContent,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add, Delete, Save } from '@mui/icons-material';
import axiosInstance from '../../../../utils/axios';
import { enqueueSnackbar } from 'notistack';

const saleTypes = [
  'Freehold',
  'Leasehold',
  'To Let',
  'For Sale',
  'Under Offer',
  'Sold',
  'Let',
];

const priceUnits = [
  'per sq ft',
  'per annum',
  'per month',
  'per unit',
  'total',
];

interface UpdateBusinessDetailsFormData {
  business_rates: {
    rateable_value_gbp?: number | string;
    rates_payable_gbp?: number | string;
  };
  descriptions: {
    general?: string;
    location?: string;
    accommodation?: string;
    terms?: string;
    specifications?: string;
  };
  sale_types: Array<{
    sale_type?: string;
    price_currency?: string;
    price_value?: number | string;
    price_unit?: string;
  }>;
}

interface UpdateBusinessDetailsFormProps {
  onStepSubmitted?: (step: number) => void;
  initialData?: any;
  onDataChange?: (data: any) => void;
  propertyId?: string;
  fetchProperty?: () => void;
}

const UpdateBusinessDetailsForm: React.FC<UpdateBusinessDetailsFormProps> = ({ 
  onStepSubmitted, 
  initialData, 
  onDataChange,
  propertyId,
  fetchProperty
}) => {
  // Independent state management
  const [formData, setFormData] = useState<UpdateBusinessDetailsFormData>({
    business_rates: {
      rateable_value_gbp: initialData?.business_rates_id?.rateable_value_gbp || '',
      rates_payable_gbp: initialData?.business_rates_id?.rates_payable_gbp || '',
    },
    descriptions: {
      general: initialData?.descriptions_id?.general || '',
      location: initialData?.descriptions_id?.location || '',
      accommodation: initialData?.descriptions_id?.accommodation || '',
      terms: initialData?.descriptions_id?.terms || '',
      specifications: initialData?.descriptions_id?.specifications || '',
    },
    sale_types: initialData?.sale_types_id?.sale_types ? [...initialData.sale_types_id.sale_types] : [],
  });

  // Error and loading states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Handle initial data
  useEffect(() => {
    if (initialData) {
      // Ensure proper data structure
      const processedData = {
        business_rates: initialData.business_rates_id || {
          rateable_value_gbp: '',
          rates_payable_gbp: '',
        },
        descriptions: initialData.descriptions_id || {
          general: '',
          location: '',
          accommodation: '',
          terms: '',
          specifications: '',
        },
        sale_types: Array.isArray(initialData.sale_types_id?.sale_types) ? initialData.sale_types_id.sale_types : [],
      };
      setFormData(processedData);
      setIsSubmitted(true); // Mark as submitted since we're editing existing data
    }
  }, [initialData]);

  // Stable callback for data changes
  const handleDataChange = useCallback((data: any) => {
    if (onDataChange) {
      onDataChange(data);
    }
  }, [onDataChange]);

  // Notify parent of data changes
  useEffect(() => {
    handleDataChange(formData);
  }, [formData, handleDataChange]);

  // Check for changes compared to initial data
  useEffect(() => {
    if (initialData) {
      const initialFormData = {
        business_rates: initialData.business_rates_id || {
          rateable_value_gbp: '',
          rates_payable_gbp: '',
        },
        descriptions: initialData.descriptions_id || {
          general: '',
          location: '',
          accommodation: '',
          terms: '',
          specifications: '',
        },
        sale_types: Array.isArray(initialData.sale_types_id?.sale_types) ? initialData.sale_types_id.sale_types : [],
      };

      const hasDataChanged = JSON.stringify(formData) !== JSON.stringify(initialFormData);
      setHasChanges(hasDataChanged);
    }
  }, [formData, initialData]);

  // Check which specific sections have changes
  const getChangedSections = () => {
    if (!initialData) return { businessRates: false, descriptions: false, saleTypes: false };

    const initialBusinessRates = initialData.business_rates_id || {
      rateable_value_gbp: '',
      rates_payable_gbp: '',
    };
    const initialDescriptions = initialData.descriptions_id || {
      general: '',
      location: '',
      accommodation: '',
      terms: '',
      specifications: '',
    };
    const initialSaleTypes = Array.isArray(initialData.sale_types_id?.sale_types) ? initialData.sale_types_id.sale_types : [];

    return {
      businessRates: JSON.stringify(formData.business_rates) !== JSON.stringify(initialBusinessRates),
      descriptions: JSON.stringify(formData.descriptions) !== JSON.stringify(initialDescriptions),
      saleTypes: JSON.stringify(formData.sale_types) !== JSON.stringify(initialSaleTypes),
    };
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate required fields - rateable_value_gbp
    if (!formData.business_rates.rateable_value_gbp || 
        formData.business_rates.rateable_value_gbp === '' ||
        formData.business_rates.rateable_value_gbp === 0) {
      newErrors.rateable_value_gbp = 'Rateable value is required';
    } else if (isNaN(Number(formData.business_rates.rateable_value_gbp)) || Number(formData.business_rates.rateable_value_gbp) < 0) {
      newErrors.rateable_value_gbp = 'Rateable value must be a valid positive number';
    }

    // Validate required fields - rates_payable_gbp
    if (!formData.business_rates.rates_payable_gbp || 
        formData.business_rates.rates_payable_gbp === '' ||
        formData.business_rates.rates_payable_gbp === 0) {
      newErrors.rates_payable_gbp = 'Rates payable is required';
    } else if (isNaN(Number(formData.business_rates.rates_payable_gbp)) || Number(formData.business_rates.rates_payable_gbp) < 0) {
      newErrors.rates_payable_gbp = 'Rates payable must be a valid positive number';
    }

    // Validate required fields - descriptions
    if (!formData.descriptions.general || formData.descriptions.general.trim() === '') {
      newErrors.general = 'General description is required';
    }

    if (!formData.descriptions.location || formData.descriptions.location.trim() === '') {
      newErrors.location = 'Location description is required';
    }

    if (!formData.descriptions.accommodation || formData.descriptions.accommodation.trim() === '') {
      newErrors.accommodation = 'Accommodation description is required';
    }

    if (!formData.descriptions.terms || formData.descriptions.terms.trim() === '') {
      newErrors.terms = 'Terms description is required';
    }

    if (!formData.descriptions.specifications || formData.descriptions.specifications.trim() === '') {
      newErrors.specifications = 'Specifications description is required';
    }

    // Validate sale types
    (formData.sale_types || []).forEach((saleType, index) => {
      if (saleType.price_value && 
          (isNaN(Number(saleType.price_value)) || Number(saleType.price_value) < 0)) {
        newErrors[`sale_type_${index}_price`] = 'Price must be a valid positive number';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBusinessRatesChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      business_rates: {
        ...prev.business_rates,
        [field]: value
      }
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleDescriptionsChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      descriptions: {
        ...prev.descriptions,
        [field]: value
      }
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSaleTypeChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      sale_types: prev.sale_types.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
    // Clear errors for this sale type field when user starts typing
    const errorKeys = [
      `sale_type_${index}_${field}`,
      `sale_type_${index}_price`, // For price_value field
      `sale_type_${index}_price_value` // Alternative naming
    ];
    setErrors(prev => {
      const newErrors = { ...prev };
      errorKeys.forEach(key => {
        if (newErrors[key]) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const addSaleType = () => {
    setFormData(prev => ({
      ...prev,
      sale_types: [...(prev.sale_types || []), {
        sale_type: '',
        price_currency: 'GBP',
        price_value: '',
        price_unit: 'per sq ft'
      }]
    }));
  };

  const removeSaleType = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sale_types: (prev.sale_types || []).filter((_, i) => i !== index)
    }));
  };

  // Parse backend errors and map them to form fields
  const parseBackendErrors = (error: any, section: 'business_rates' | 'descriptions' | 'sale_types'): Record<string, string> => {
    const fieldErrors: Record<string, string> = {};
    
    if (!error?.response?.data) {
      return fieldErrors;
    }

    const errorData = error.response.data;
    
    // Handle different error response formats
    // Format 1: { errors: { field: "message" } }
    if (errorData.errors && typeof errorData.errors === 'object') {
      Object.keys(errorData.errors).forEach((field) => {
        const errorMessage = Array.isArray(errorData.errors[field]) 
          ? errorData.errors[field][0] 
          : errorData.errors[field];
        
        if (section === 'business_rates') {
          // Map business rates fields
          if (field === 'rateable_value_gbp' || field === 'rates_payable_gbp') {
            fieldErrors[field] = errorMessage;
          }
        } else if (section === 'descriptions') {
          // Map description fields
          if (['general', 'location', 'accommodation', 'terms', 'specifications'].includes(field)) {
            fieldErrors[field] = errorMessage;
          }
        } else if (section === 'sale_types') {
          // Handle sale_types array errors
          // Format: { errors: { "sale_types.0.price_value": "message" } }
          const match = field.match(/sale_types\.(\d+)\.(\w+)/);
          if (match) {
            const index = parseInt(match[1]);
            const fieldName = match[2];
            if (fieldName === 'price_value') {
              // Support both naming conventions
              fieldErrors[`sale_type_${index}_price`] = errorMessage;
              fieldErrors[`sale_type_${index}_price_value`] = errorMessage;
            } else {
              fieldErrors[`sale_type_${index}_${fieldName}`] = errorMessage;
            }
          } else if (field === 'sale_types') {
            // Handle general sale_types error
            fieldErrors['sale_types'] = errorMessage;
          }
        }
      });
    }
    
    // Format 2: Direct field errors in response
    if (section === 'business_rates') {
      if (errorData.rateable_value_gbp) {
        fieldErrors.rateable_value_gbp = Array.isArray(errorData.rateable_value_gbp) 
          ? errorData.rateable_value_gbp[0] 
          : errorData.rateable_value_gbp;
      }
      if (errorData.rates_payable_gbp) {
        fieldErrors.rates_payable_gbp = Array.isArray(errorData.rates_payable_gbp) 
          ? errorData.rates_payable_gbp[0] 
          : errorData.rates_payable_gbp;
      }
    } else if (section === 'descriptions') {
      ['general', 'location', 'accommodation', 'terms', 'specifications'].forEach((field) => {
        if (errorData[field]) {
          fieldErrors[field] = Array.isArray(errorData[field]) 
            ? errorData[field][0] 
            : errorData[field];
        }
      });
    }
    
    return fieldErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!propertyId) {
      setSubmitError('Property ID is required for updating');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setErrors({}); // Clear previous errors

    try {
      const changedSections = getChangedSections();
      const requests: Array<{ promise: Promise<any>; section: 'business_rates' | 'descriptions' | 'sale_types' }> = [];

      // Update business rates only if it has changes and ID exists
      if (changedSections.businessRates && initialData?.business_rates_id?._id) {
        requests.push({
          promise: axiosInstance.patch(`/api/agent/business-rates/${initialData.business_rates_id._id}`, formData.business_rates),
          section: 'business_rates'
        });
      }

      // Update descriptions only if it has changes and ID exists
      if (changedSections.descriptions && initialData?.descriptions_id?._id) {
        requests.push({
          promise: axiosInstance.patch(`/api/agent/descriptions/${initialData.descriptions_id._id}`, formData.descriptions),
          section: 'descriptions'
        });
      }

      // Update sale types only if it has changes and ID exists
      if (changedSections.saleTypes && initialData?.sale_types_id?._id) {
        requests.push({
          promise: axiosInstance.patch(`/api/agent/sale-types/${initialData.sale_types_id._id}`, { sale_types: formData.sale_types }),
          section: 'sale_types'
        });
      }

      // If no changes, show message and return
      if (requests.length === 0) {
        enqueueSnackbar('No changes detected to update', { variant: 'info' });
        setIsSubmitting(false);
        return;
      }

      // Execute all requests and handle errors individually
      const results = await Promise.allSettled(requests.map(req => req.promise));
      
      const allErrors: Record<string, string> = {};
      let hasErrors = false;
      let generalError: string | null = null;

      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          hasErrors = true;
          const section = requests[index].section;
          const parsedErrors = parseBackendErrors(result.reason, section);
          Object.assign(allErrors, parsedErrors);
          
          // If no field-specific errors were found, use general error message
          if (Object.keys(parsedErrors).length === 0) {
            const errorMessage = result.reason?.response?.data?.message 
              || result.reason?.message 
              || `Failed to update ${section.replace('_', ' ')}`;
            generalError = generalError || errorMessage;
          }
        }
      });

      if (hasErrors) {
        // Set field-specific errors
        if (Object.keys(allErrors).length > 0) {
          setErrors(allErrors);
        }
        
        // Set general error if no field-specific errors
        if (generalError && Object.keys(allErrors).length === 0) {
          setSubmitError(generalError);
        }
        
        enqueueSnackbar(
          Object.keys(allErrors).length > 0 
            ? 'Please check the form for errors' 
            : generalError || 'Failed to update business details',
          { variant: 'error' }
        );
        return;
      }

      // All updates successful
      setIsSubmitted(true);
      setSubmitSuccess(true);
      setHasChanges(false); // Reset changes flag after successful update
      setErrors({}); // Clear any errors
      
      enqueueSnackbar(`Business Details updated successfully!`, { variant: 'success' });

      if (fetchProperty) {
        fetchProperty();
      }
      
      if (onStepSubmitted) {
        onStepSubmitted(1);
      }
    } catch (error: any) {
      console.error('Error updating business details:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update business details';
      setSubmitError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSubmitError(null)}>
            {submitError}
          </Alert>
        )}

        {/* Business Rates Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Business Rates
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Rateable Value (GBP)"
                required
                value={formData.business_rates.rateable_value_gbp || ''}
                onChange={(e) => handleBusinessRatesChange('rateable_value_gbp', e.target.value)}
                error={!!errors.rateable_value_gbp}
                helperText={errors.rateable_value_gbp}
                InputProps={{
                  startAdornment: <InputAdornment position="start">£</InputAdornment>,
                }}
                sx={{ minWidth: 200 }}
              />
              <TextField
                label="Rates Payable (GBP)"
                required
                value={formData.business_rates.rates_payable_gbp || ''}
                onChange={(e) => handleBusinessRatesChange('rates_payable_gbp', e.target.value)}
                error={!!errors.rates_payable_gbp}
                helperText={errors.rates_payable_gbp}
                InputProps={{
                  startAdornment: <InputAdornment position="start">£</InputAdornment>,
                }}
                sx={{ minWidth: 200 }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Descriptions Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Property Descriptions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="General Description"
                required
                value={formData.descriptions.general || ''}
                onChange={(e) => handleDescriptionsChange('general', e.target.value)}
                error={!!errors.general}
                helperText={errors.general}
                multiline
                rows={3}
                placeholder="General description of the property"
              />
              <TextField
                label="Location Description"
                required
                value={formData.descriptions.location || ''}
                onChange={(e) => handleDescriptionsChange('location', e.target.value)}
                error={!!errors.location}
                helperText={errors.location}
                multiline
                rows={3}
                placeholder="Description of the location and surroundings"
              />
              <TextField
                label="Accommodation Description"
                required
                value={formData.descriptions.accommodation || ''}
                onChange={(e) => handleDescriptionsChange('accommodation', e.target.value)}
                error={!!errors.accommodation}
                helperText={errors.accommodation}
                multiline
                rows={3}
                placeholder="Description of accommodation and facilities"
              />
              <TextField
                label="Terms Description"
                required
                value={formData.descriptions.terms || ''}
                onChange={(e) => handleDescriptionsChange('terms', e.target.value)}
                error={!!errors.terms}
                helperText={errors.terms}
                multiline
                rows={3}
                placeholder="Terms and conditions"
              />
              <TextField
                label="Specifications Description"
                required
                value={formData.descriptions.specifications || ''}
                onChange={(e) => handleDescriptionsChange('specifications', e.target.value)}
                error={!!errors.specifications}
                helperText={errors.specifications}
                multiline
                rows={3}
                placeholder="Technical specifications and details"
              />
            </Box>
          </CardContent>
        </Card>

        {/* Sale Types Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Sale Types & Pricing
              </Typography>
              <Button
                startIcon={<Add />}
                onClick={addSaleType}
                variant="outlined"
                size="small"
              >
                Add Sale Type
              </Button>
            </Box>

            {(formData.sale_types || []).map((saleType, index) => (
              <Card key={index} sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa' }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: '100%' }}>
                  <FormControl sx={{ flex: 1, minWidth: 120 }} error={!!errors[`sale_type_${index}_sale_type`]}>
                    <InputLabel>Sale Type</InputLabel>
                    <Select
                      value={saleType.sale_type || ''}
                      onChange={(e) => handleSaleTypeChange(index, 'sale_type', e.target.value)}
                      label="Sale Type"
                    >
                      {saleTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors[`sale_type_${index}_sale_type`] && (
                      <FormHelperText>{errors[`sale_type_${index}_sale_type`]}</FormHelperText>
                    )}
                  </FormControl>

                  <FormControl sx={{ flex: 0.8, minWidth: 100 }} error={!!errors[`sale_type_${index}_price_currency`]}>
                    <InputLabel>Currency</InputLabel>
                    <Select
                      value={saleType.price_currency || 'GBP'}
                      onChange={(e) => handleSaleTypeChange(index, 'price_currency', e.target.value)}
                      label="Currency"
                    >
                      <MenuItem value="GBP">GBP</MenuItem>
                      <MenuItem value="USD">USD</MenuItem>
                      <MenuItem value="EUR">EUR</MenuItem>
                    </Select>
                    {errors[`sale_type_${index}_price_currency`] && (
                      <FormHelperText>{errors[`sale_type_${index}_price_currency`]}</FormHelperText>
                    )}
                  </FormControl>

                  <TextField
                    label="Price"
                    value={saleType.price_value || ''}
                    onChange={(e) => handleSaleTypeChange(index, 'price_value', e.target.value)}
                    error={!!errors[`sale_type_${index}_price`] || !!errors[`sale_type_${index}_price_value`]}
                    helperText={errors[`sale_type_${index}_price`] || errors[`sale_type_${index}_price_value`]}
                    sx={{ flex: 1, minWidth: 120 }}
                  />

                  <FormControl sx={{ flex: 1, minWidth: 120 }} error={!!errors[`sale_type_${index}_price_unit`]}>
                    <InputLabel>Unit</InputLabel>
                    <Select
                      value={saleType.price_unit || 'per sq ft'}
                      onChange={(e) => handleSaleTypeChange(index, 'price_unit', e.target.value)}
                      label="Unit"
                    >
                      {priceUnits.map((unit) => (
                        <MenuItem key={unit} value={unit}>
                          {unit}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors[`sale_type_${index}_price_unit`] && (
                      <FormHelperText>{errors[`sale_type_${index}_price_unit`]}</FormHelperText>
                    )}
                  </FormControl>

                  <IconButton
                    onClick={() => removeSaleType(index)}
                    color="error"
                    size="small"
                    sx={{ flexShrink: 0 }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Card>
            ))}

            {(formData.sale_types || []).length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                No sale types added yet. Click "Add Sale Type" to get started.
              </Typography>
            )}
          </CardContent>
        </Card>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
            disabled={isSubmitting || !hasChanges}
            sx={{
              minWidth: 200,
              backgroundColor: hasChanges ? '#059669' : '#9ca3af',
              '&:hover': {
                backgroundColor: hasChanges ? '#047857' : '#9ca3af',
              },
            }}
          >
            {isSubmitting ? 'Updating...' : hasChanges ? 'Update Business Details' : 'No Changes to Save'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default UpdateBusinessDetailsForm;
