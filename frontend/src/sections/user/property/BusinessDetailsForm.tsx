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
import axiosInstance from '../../../utils/axios';
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

interface BusinessDetailsFormData {
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

interface BusinessDetailsFormProps {
  onStepSubmitted?: (step: number) => void;
  initialData?: any;
  onDataChange?: (data: any) => void;
}

const BusinessDetailsForm: React.FC<BusinessDetailsFormProps> = ({ onStepSubmitted, initialData, onDataChange }) => {
  // Independent state management
  const [formData, setFormData] = useState<BusinessDetailsFormData>({
    business_rates: {
      rateable_value_gbp: '',
      rates_payable_gbp: '',
    },
    descriptions: {
      general: '',
      location: '',
      accommodation: '',
      terms: '',
      specifications: '',
    },
    sale_types: [],
  });

  // Error and loading states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Handle initial data
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Stable callback for data changes
  const handleDataChange = useCallback((data: any) => {
    if (onDataChange) {
      onDataChange(data);
    }
  }, [onDataChange]);

  // Handle data changes with debouncing to prevent infinite loops
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleDataChange(formData);
    }, 100); // Small delay to debounce

    return () => clearTimeout(timeoutId);
  }, [formData, handleDataChange]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => {
      const newData = { ...prev };
      
      // Handle nested field updates using dot notation
      if (field.includes('.')) {
        const parts = field.split('.');
        let current: any = newData;
        
        // Navigate to the parent object
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = {};
          }
          current = current[parts[i]];
        }
        
        // Set the final value
        current[parts[parts.length - 1]] = value;
      } else {
        // Handle top-level field updates
        (newData as any)[field] = value;
      }
      
      return newData;
    });
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle number input change (only allows numbers)
  const handleNumberInputChange = (field: string, value: string) => {
    // Only allow numbers, decimal point, and empty string
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = numericValue.split('.');
    const finalValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : numericValue;
    
    handleInputChange(field, finalValue === '' ? '' : finalValue);
  };

  // Handle sale type input changes
  const handleSaleTypeChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      sale_types: prev.sale_types.map((saleType, i) => 
        i === index ? { ...saleType, [field]: value } : saleType
      )
    }));
    
    // Clear field error when user starts typing
    const errorKey = `sale_types.${index}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // Handle sale type number input change (only allows numbers)
  const handleSaleTypeNumberChange = (index: number, field: string, value: string) => {
    // Only allow numbers, decimal point, and empty string
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = numericValue.split('.');
    const finalValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : numericValue;
    
    handleSaleTypeChange(index, field, finalValue === '' ? '' : finalValue);
  };

  // Get field error (backend validation errors)
  const getFieldError = (path: string): string => {
    // Check for exact match first
    if (errors[path]) {
      return errors[path];
    }
    
    // Check for array notation match (e.g., sale_types.0.sale_type)
    const arrayNotation = path.replace(/\.(\d+)\./, '[$1].');
    if (errors[arrayNotation]) {
      return errors[arrayNotation];
    }
    
    return '';
  };

  // Add sale type
  const addSaleType = () => {
    setFormData(prev => ({
      ...prev,
      sale_types: [
        ...prev.sale_types,
        {
          sale_type: '',
          price_currency: 'GBP',
          price_value: '',
          price_unit: '',
        },
      ],
    }));
  };

  // Remove sale type
  const removeSaleType = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sale_types: prev.sale_types.filter((_, i) => i !== index),
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Clear previous errors
    setSubmitError(null);
    setErrors({});

    setIsSubmitting(true);

    try {
      const propertyId = localStorage.getItem('propertyId');
      if (!propertyId) {
        throw new Error('Property ID not found. Please create a property first.');
      }

      const response = await axiosInstance.put(
        `/api/user/properties/${propertyId}/business-details`,
        formData
      );

      console.log(response.data.data._id);

      localStorage.setItem('propertyId', response.data.data._id);

      if (response.status === 200) {
        setSubmitSuccess(true);
        setIsSubmitted(true);
        enqueueSnackbar(response.data.message, { variant: 'success' });
        
        // Notify parent component that step 1 has been successfully submitted
        if (onStepSubmitted) {
          onStepSubmitted(1);
        }
      }

    
    } catch (error: any) {
      console.error('Error saving business details:', error);
      
      if (error.errors && Array.isArray(error.errors)) {
        // Handle multiple field errors
        const fieldErrors: Record<string, string> = {};
        console.log('Processing errors:', error.errors);
        error.errors.forEach((err: any) => {
          if (err.path && err.msg) {
            // Convert array notation to dot notation for consistency
            const normalizedPath = err.path.replace(/\[(\d+)\]/g, '.$1');
            console.log(`Error path: ${err.path} -> normalized: ${normalizedPath}, msg: ${err.msg}`);
            fieldErrors[normalizedPath] = err.msg;
          }
        });
        console.log('Final field errors:', fieldErrors);
        setErrors(fieldErrors);
        
        // Clear any previous general error
        setSubmitError(null);
      } else {
        // Handle general error
        const errorMessage = error.response?.data?.message || error.message || 'Failed to save business details';
        setSubmitError(errorMessage);

        enqueueSnackbar(errorMessage, { variant: 'error' });
        
        // Clear field errors for general errors
        setErrors({});
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Business Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide business rates, property descriptions, and sale type information.
      </Typography>

      {/* Error Alert */}
      {submitError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSubmitError(null)}>
          {submitError}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Business Rates Section */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Business Rates
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <TextField
              value={formData.business_rates?.rateable_value_gbp || ''}
              onChange={(e) => handleNumberInputChange('business_rates.rateable_value_gbp', e.target.value)}
              label="Rateable Value (GBP) *"
              type="text"
              fullWidth
              placeholder="0"
              required
              error={!!getFieldError('business_rates.rateable_value_gbp')}
              helperText={getFieldError('business_rates.rateable_value_gbp')}
              InputProps={{
                startAdornment: <InputAdornment position="start">£</InputAdornment>,
              }}
            />
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <TextField
              value={formData.business_rates?.rates_payable_gbp || ''}
              onChange={(e) => handleNumberInputChange('business_rates.rates_payable_gbp', e.target.value)}
              label="Rates Payable (GBP) *"
              type="text"
              fullWidth
              placeholder="0"
              required
              error={!!getFieldError('business_rates.rates_payable_gbp')}
              helperText={getFieldError('business_rates.rates_payable_gbp')}
              InputProps={{
                startAdornment: <InputAdornment position="start">£</InputAdornment>,
              }}
            />
          </Box>
        </Box>

        <Box>
          <Divider sx={{ my: 2 }} />
        </Box>

        {/* Descriptions Section */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Property Descriptions
          </Typography>
        </Box>

        <Box>
          <TextField
            value={formData.descriptions?.general || ''}
            onChange={(e) => handleInputChange('descriptions.general', e.target.value)}
            label="General Description *"
            fullWidth
            multiline
            rows={4}
            required
            placeholder="Provide a comprehensive general description of the property..."
            error={!!getFieldError('descriptions.general')}
            helperText={getFieldError('descriptions.general') || `${formData.descriptions?.general?.length || 0}/2000 characters (min: 50)`}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <TextField
              value={formData.descriptions?.location || ''}
              onChange={(e) => handleInputChange('descriptions.location', e.target.value)}
              label="Location Description *"
              fullWidth
              multiline
              rows={3}
              required
              placeholder="Describe the location and surrounding area..."
              error={!!getFieldError('descriptions.location')}
              helperText={getFieldError('descriptions.location') || `${formData.descriptions?.location?.length || 0}/1000 characters (min: 20)`}
            />
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <TextField
              value={formData.descriptions?.accommodation || ''}
              onChange={(e) => handleInputChange('descriptions.accommodation', e.target.value)}
              label="Accommodation Description *"
              fullWidth
              multiline
              rows={3}
              required
              placeholder="Describe the accommodation and layout..."
              error={!!getFieldError('descriptions.accommodation')}
              helperText={getFieldError('descriptions.accommodation') || `${formData.descriptions?.accommodation?.length || 0}/1000 characters (min: 20)`}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <TextField
              value={formData.descriptions?.terms || ''}
              onChange={(e) => handleInputChange('descriptions.terms', e.target.value)}
              label="Terms Description *"
              fullWidth
              multiline
              required
              rows={3}
              placeholder="Describe the terms and conditions..."
              error={!!getFieldError('descriptions.terms')}
              helperText={getFieldError('descriptions.terms') || `${formData.descriptions?.terms?.length || 0}/1000 characters (min: 20)`}
            />
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <TextField
              value={formData.descriptions?.specifications || ''}
              onChange={(e) => handleInputChange('descriptions.specifications', e.target.value)}
              label="Specifications Description *"
              fullWidth
              multiline
              rows={3}
              required
              placeholder="Describe the technical specifications..."
              error={!!getFieldError('descriptions.specifications')}
              helperText={getFieldError('descriptions.specifications') || `${formData.descriptions?.specifications?.length || 0}/1000 characters (min: 20)`}
            />
          </Box>
        </Box>

        <Box>
          <Divider sx={{ my: 2 }} />
        </Box>

        {/* Sale Types Section */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Sale Types
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
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Add different sale types and pricing options for this property.
          </Typography>
        </Box>

        {formData.sale_types.map((saleType, index) => (
          <Box key={index}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1">
                    Sale Type {index + 1}
                  </Typography>
                  <IconButton
                    onClick={() => removeSaleType(index)}
                    color="error"
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                    <FormControl fullWidth error={!!getFieldError(`sale_types.${index}.sale_type`)}>
                      <InputLabel>Sale Type *</InputLabel>
                      <Select
                        value={saleType.sale_type || ''}
                        onChange={(e) => handleSaleTypeChange(index, 'sale_type', e.target.value)}
                        label="Sale Type *"
                      >
                        {saleTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                      {getFieldError(`sale_types.${index}.sale_type`) && (
                        <FormHelperText>{getFieldError(`sale_types.${index}.sale_type`)}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>

                  <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                    <TextField
                      value={saleType.price_value || ''}
                      onChange={(e) => handleSaleTypeNumberChange(index, 'price_value', e.target.value)}
                      label="Price Value *"
                      type="text"
                      fullWidth
                      error={!!getFieldError(`sale_types.${index}.price_value`)}
                      helperText={getFieldError(`sale_types.${index}.price_value`)}
                      placeholder="0"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">£</InputAdornment>,
                      }}
                    />
                  </Box>

                  <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                    <FormControl fullWidth error={!!getFieldError(`sale_types.${index}.price_unit`)}>
                      <InputLabel>Price Unit *</InputLabel>
                      <Select
                        value={saleType.price_unit || ''}
                        onChange={(e) => handleSaleTypeChange(index, 'price_unit', e.target.value)}
                        label="Price Unit *"
                      >
                        {priceUnits.map((unit) => (
                          <MenuItem key={unit} value={unit}>
                            {unit}
                          </MenuItem>
                        ))}
                      </Select>
                      {getFieldError(`sale_types.${index}.price_unit`) && (
                        <FormHelperText>{getFieldError(`sale_types.${index}.price_unit`)}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>

                  <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                    <FormControl fullWidth>
                      <InputLabel>Currency</InputLabel>
                      <Select
                        value={saleType.price_currency || 'GBP'}
                        onChange={(e) => handleSaleTypeChange(index, 'price_currency', e.target.value)}
                        label="Currency"
                      >
                        <MenuItem value="GBP">GBP (£)</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}

        {formData.sale_types.length === 0 && (
          <Box>
            <Card variant="outlined" sx={{ textAlign: 'center', py: 4 }}>
              <CardContent>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  No sale types added yet
                </Typography>
                <Button
                  startIcon={<Add />}
                  onClick={addSaleType}
                  variant="contained"
                >
                  Add First Sale Type
                </Button>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Sale Types Error */}
        {errors['sale_types'] && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errors['sale_types']}
          </Alert>
        )}
      </Box>

      {/* Submit Button and Status Messages */}
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Success Alert */}
        {submitSuccess && (
          <Alert severity="success" onClose={() => setSubmitSuccess(false)}>
            Business details saved successfully!
          </Alert>
        )}

        {/* Submit Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
            onClick={handleSubmit}
            disabled={isSubmitting || isSubmitted}
            sx={{
              minWidth: 200,
              backgroundColor: '#dc2626',
              '&:hover': {
                backgroundColor: '#b91c1c',
              },
            }}
          >
            {isSubmitting ? 'Saving...' : isSubmitted ? 'Business Details Saved' : 'Save Business Details'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default BusinessDetailsForm;
