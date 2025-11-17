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
  propertyData?: any;
  hasExistingData?: boolean;
  fetchPropertyData?: () => void;
}

const BusinessDetailsForm: React.FC<BusinessDetailsFormProps> = ({ onStepSubmitted, initialData, onDataChange, propertyData, hasExistingData = false, fetchPropertyData }) => {
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
  
  // Store original data for comparison
  const [originalData, setOriginalData] = useState<BusinessDetailsFormData | null>(null);
  const lastPropertyIdRef = React.useRef<string | null>(null);
  const hasInitializedRef = React.useRef<boolean>(false);

  // Initialize form data only when property changes or on first mount
  useEffect(() => {
    const currentPropertyId = propertyData?._id || null;
    
    // Priority: propertyData business details > initialData
    const dataToUse = initialData || (propertyData ? {
      business_rates: propertyData.business_rates_id || {},
      descriptions: propertyData.descriptions_id || {},
      sale_types: (propertyData.sale_types_id?.sale_types && Array.isArray(propertyData.sale_types_id.sale_types)) 
        ? propertyData.sale_types_id.sale_types.map((st: any) => ({
            sale_type: st.sale_type || '',
            price_currency: st.price_currency || 'GBP',
            price_value: st.price_value || '',
            price_unit: st.price_unit || '',
          }))
        : [],
    } : null);
    
    // Ensure sale_types is always an array
    if (dataToUse && !Array.isArray(dataToUse.sale_types)) {
      dataToUse.sale_types = [];
    }
    
    // Only update if:
    // 1. We have data to use AND
    // 2. (We haven't initialized yet OR the property ID has changed to a different property)
    const shouldInitialize = dataToUse && (
      !hasInitializedRef.current || 
      (currentPropertyId !== null && lastPropertyIdRef.current !== currentPropertyId)
    );
    
    if (shouldInitialize) {
      setFormData(dataToUse);
      // Store original data for comparison
      setOriginalData({ ...dataToUse });
      lastPropertyIdRef.current = currentPropertyId;
      hasInitializedRef.current = true;
    }
  }, [initialData, propertyData?._id]);

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
      // Handle nested field updates using dot notation
      if (field.includes('.')) {
        const parts = field.split('.');
        const newData = { ...prev };
        
        // Create a deep copy of nested objects to ensure React detects the change
        let current: any = newData;
        
        // Navigate to the parent object, creating new objects along the way
        for (let i = 0; i < parts.length - 1; i++) {
          const key = parts[i];
          // Create a new copy of the nested object
          current[key] = current[key] ? { ...current[key] } : {};
          current = current[key];
        }
        
        // Set the final value
        current[parts[parts.length - 1]] = value;
        
        return newData;
      } else {
        // Handle top-level field updates
        return {
          ...prev,
          [field]: value
        };
      }
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
      sale_types: (Array.isArray(prev.sale_types) ? prev.sale_types : []).map((saleType, i) => 
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
    const saleTypes = Array.isArray(formData.sale_types) ? formData.sale_types : [];
    if (saleTypes.length >= 1) {
      enqueueSnackbar('Only one sale type is allowed.', { variant: 'error' });
      return;
    }
    setFormData(prev => ({
      ...prev,
      sale_types: [
        ...(Array.isArray(prev.sale_types) ? prev.sale_types : []),
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
      sale_types: (Array.isArray(prev.sale_types) ? prev.sale_types : []).filter((_, i) => i !== index),
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Clear previous errors
    setSubmitError(null);
    setErrors({});

    // Validate all required fields
    const validationErrors: Record<string, string> = {};

    // Validate business rates
    if (!formData.business_rates?.rateable_value_gbp || formData.business_rates.rateable_value_gbp === '' || (typeof formData.business_rates.rateable_value_gbp === 'string' && formData.business_rates.rateable_value_gbp.trim() === '')) {
      validationErrors['business_rates.rateable_value_gbp'] = 'Rateable value is required';
    }

    if (!formData.business_rates?.rates_payable_gbp || formData.business_rates.rates_payable_gbp === '' || (typeof formData.business_rates.rates_payable_gbp === 'string' && formData.business_rates.rates_payable_gbp.trim() === '')) {
      validationErrors['business_rates.rates_payable_gbp'] = 'Rates payable is required';
    }

    // Validate descriptions
    if (!formData.descriptions?.general || formData.descriptions.general.trim() === '') {
      validationErrors['descriptions.general'] = 'General description is required';
    }

    if (!formData.descriptions?.location || formData.descriptions.location.trim() === '') {
      validationErrors['descriptions.location'] = 'Location description is required';
    }

    if (!formData.descriptions?.accommodation || formData.descriptions.accommodation.trim() === '') {
      validationErrors['descriptions.accommodation'] = 'Accommodation description is required';
    }

    if (!formData.descriptions?.terms || formData.descriptions.terms.trim() === '') {
      validationErrors['descriptions.terms'] = 'Terms description is required';
    }

    if (!formData.descriptions?.specifications || formData.descriptions.specifications.trim() === '') {
      validationErrors['descriptions.specifications'] = 'Specifications description is required';
    }

    // If there are validation errors, set them and return
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Validate that exactly one sale type is added
    const saleTypes = Array.isArray(formData.sale_types) ? formData.sale_types : [];
    if (!saleTypes || saleTypes.length === 0) {
      enqueueSnackbar('Please add exactly one sale type before submitting.', { variant: 'error' });
      return;
    }
    
    if (saleTypes.length > 1) {
      enqueueSnackbar('Only one sale type is allowed. Please remove extra sale types.', { variant: 'error' });
      return;
    }

    setIsSubmitting(true);

    try {
      const propertyId = localStorage.getItem('newpropertyId');
      if (!propertyId) {
        throw new Error('Property ID not found. Please create a property first.');
      }

      const response = await axiosInstance.put(
        `/api/agent/properties/${propertyId}/business-details`,
        formData
      );

      console.log(response.data.data._id);

      localStorage.setItem('propertyId', response.data.data._id);

      if (response.status === 200) {
        // Update original data to current form data after successful create
        setOriginalData({ ...formData });
        
        setSubmitSuccess(true);
        setIsSubmitted(true);
        fetchPropertyData?.();
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

  // Update business rates
  const updateBusinessRates = async () => {
    const businessRatesId = propertyData?.business_rates_id?._id;
    
    if (!businessRatesId) {
      throw new Error('Business rates ID not found.');
    }

    const response = await axiosInstance.patch(
      `/api/agent/business-rates/${businessRatesId}`,
      formData.business_rates
    );

    fetchPropertyData?.();

    return response.data.message || 'Business rates updated successfully!';
  };

  // Update descriptions
  const updateDescriptions = async () => {
    const descriptionsId = propertyData?.descriptions_id?._id;
    
    if (!descriptionsId) {
      throw new Error('Descriptions ID not found.');
    }

    const response = await axiosInstance.patch(
      `/api/agent/descriptions/${descriptionsId}`,
      formData.descriptions
    );

    fetchPropertyData?.();

    return response.data.message || 'Descriptions updated successfully!';
  };

  // Update sale types
  const updateSaleTypes = async () => {
    // Validate that exactly one sale type is added
    const saleTypes = Array.isArray(formData.sale_types) ? formData.sale_types : [];
    if (!saleTypes || saleTypes.length === 0) {
      throw new Error('Please add exactly one sale type before submitting.');
    }
    
    if (saleTypes.length > 1) {
      throw new Error('Only one sale type is allowed. Please remove extra sale types.');
    }

    const saleTypesId = propertyData?.sale_types_id?._id;
    
    if (!saleTypesId) {
      throw new Error('Sale types ID not found.');
    }

    const response = await axiosInstance.patch(
      `/api/agent/sale-types/${saleTypesId}`,
      { sale_types: saleTypes }

    );

    fetchPropertyData?.();

    return response.data.message || 'Sale types updated successfully!';
  };

  // Handle form update - calls appropriate update functions based on what changed
  const handleFormUpdate = async () => {
    // Clear previous errors
    setSubmitError(null);
    setErrors({});

    setIsSubmitting(true);

    try {
      const updatePromises: Promise<string>[] = [];
      const updateMessages: string[] = [];

      // Update business rates if changed
      if (hasBusinessRatesChanges) {
        updatePromises.push(updateBusinessRates());
        updateMessages.push('business rates');
      }

      // Update descriptions if changed
      if (hasDescriptionsChanges) {
        updatePromises.push(updateDescriptions());
        updateMessages.push('descriptions');
      }

      // Update sale types if changed
      if (hasSaleTypesChanges) {
        updatePromises.push(updateSaleTypes());
        updateMessages.push('sale types');
      }

      // Execute all updates in parallel
      const messages = await Promise.all(updatePromises);

      // Show success message
      const successMessage = `${updateMessages.join(', ')} updated successfully!`;
      enqueueSnackbar(successMessage, { variant: 'success' });
      
      // Update original data to current form data after successful update
      setOriginalData({ ...formData });
      
      setSubmitSuccess(true);
      setIsSubmitted(false);
      
      // Notify parent component that step 1 has been successfully submitted
      if (onStepSubmitted) {
        onStepSubmitted(1);
      }

    } catch (error: any) {
      console.error('Error updating business details:', error);
      
      // Handle validation errors
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const fieldErrors: Record<string, string> = {};
        error.response.data.errors.forEach((err: any) => {
          if (err.path && err.msg) {
            const normalizedPath = err.path.replace(/\[(\d+)\]/g, '.$1');
            fieldErrors[normalizedPath] = err.msg;
          }
        });
        setErrors(fieldErrors);
        setSubmitError(null);
      } else {
        // Handle general error
        const errorMessage = error.response?.data?.message || error.message || 'Failed to update business details. Please try again.';
        setSubmitError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: 'error' });
        setErrors({});
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to normalize values for comparison
  const normalizeValue = (value: any): any => {
    // Handle null, undefined, and empty strings - treat them all as empty
    if (value === null || value === undefined || value === '') {
      return '';
    }
    // Convert numeric strings to numbers for comparison (but keep as string if it's not a valid number)
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed === '') return '';
      const num = Number(trimmed);
      if (!isNaN(num) && trimmed !== '') {
        return num;
      }
      return trimmed;
    }
    // Convert numbers to numbers (in case propertyData has numbers)
    if (typeof value === 'number') {
      return value;
    }
    return value;
  };

  // Helper function to normalize object for comparison
  const normalizeObject = (obj: any): any => {
    if (!obj || typeof obj !== 'object') return {};
    const normalized: any = {};
    Object.keys(obj).forEach(key => {
      normalized[key] = normalizeValue(obj[key]);
    });
    return normalized;
  };

  // Helper function to normalize sale types array for comparison
  const normalizeSaleTypesArray = (saleTypes: any[]): any[] => {
    if (!Array.isArray(saleTypes)) return [];
    return saleTypes
      .map(st => ({
        sale_type: normalizeValue(st.sale_type),
        price_currency: normalizeValue(st.price_currency) || 'GBP',
        price_value: normalizeValue(st.price_value),
        price_unit: normalizeValue(st.price_unit),
      }))
      .filter(st => st.sale_type !== undefined) // Remove empty entries
      .sort((a, b) => {
        // Sort by sale_type for consistent comparison
        const aType = String(a.sale_type || '');
        const bType = String(b.sale_type || '');
        return aType.localeCompare(bType);
      });
  };

  // Helper to extract only form fields from propertyData (exclude metadata)
  const extractBusinessRatesFields = (data: any) => {
    if (!data) return {};
    return {
      rateable_value_gbp: data.rateable_value_gbp,
      rates_payable_gbp: data.rates_payable_gbp,
    };
  };

  const extractDescriptionsFields = (data: any) => {
    if (!data) return {};
    return {
      general: data.general,
      location: data.location,
      accommodation: data.accommodation,
      terms: data.terms,
      specifications: data.specifications,
    };
  };

  // Check which specific sections have changed
  const hasBusinessRatesChanges = React.useMemo(() => {
    if (!hasExistingData || !propertyData?.business_rates_id) {
      return false;
    }
    const currentData = formData.business_rates || {};
    const originalData = extractBusinessRatesFields(propertyData.business_rates_id);
    
    // Compare each field individually
    const currentRateable = normalizeValue(currentData.rateable_value_gbp);
    const originalRateable = normalizeValue(originalData.rateable_value_gbp);
    const currentRatesPayable = normalizeValue(currentData.rates_payable_gbp);
    const originalRatesPayable = normalizeValue(originalData.rates_payable_gbp);
    
    const rateableChanged = currentRateable !== originalRateable;
    const ratesPayableChanged = currentRatesPayable !== originalRatesPayable;
    
    return rateableChanged || ratesPayableChanged;
  }, [
    formData.business_rates?.rateable_value_gbp,
    formData.business_rates?.rates_payable_gbp,
    propertyData?.business_rates_id?.rateable_value_gbp,
    propertyData?.business_rates_id?.rates_payable_gbp,
    hasExistingData
  ]);

  const hasDescriptionsChanges = React.useMemo(() => {
    if (!hasExistingData || !propertyData?.descriptions_id) {
      return false;
    }
    const currentData = formData.descriptions || {};
    const originalData = extractDescriptionsFields(propertyData.descriptions_id);
    
    // Compare each field individually
    const generalChanged = normalizeValue(currentData.general) !== normalizeValue(originalData.general);
    const locationChanged = normalizeValue(currentData.location) !== normalizeValue(originalData.location);
    const accommodationChanged = normalizeValue(currentData.accommodation) !== normalizeValue(originalData.accommodation);
    const termsChanged = normalizeValue(currentData.terms) !== normalizeValue(originalData.terms);
    const specificationsChanged = normalizeValue(currentData.specifications) !== normalizeValue(originalData.specifications);
    
    return generalChanged || locationChanged || accommodationChanged || termsChanged || specificationsChanged;
  }, [
    formData.descriptions?.general,
    formData.descriptions?.location,
    formData.descriptions?.accommodation,
    formData.descriptions?.terms,
    formData.descriptions?.specifications,
    propertyData?.descriptions_id?.general,
    propertyData?.descriptions_id?.location,
    propertyData?.descriptions_id?.accommodation,
    propertyData?.descriptions_id?.terms,
    propertyData?.descriptions_id?.specifications,
    hasExistingData
  ]);

  const hasSaleTypesChanges = React.useMemo(() => {
    if (!hasExistingData || !propertyData?.sale_types_id?.sale_types) {
      return false;
    }
    const current = normalizeSaleTypesArray(Array.isArray(formData.sale_types) ? formData.sale_types : []);
    const original = normalizeSaleTypesArray(Array.isArray(propertyData.sale_types_id.sale_types) ? propertyData.sale_types_id.sale_types : []);
    const changed = JSON.stringify(current) !== JSON.stringify(original);
    return changed;
  }, [formData.sale_types, propertyData?.sale_types_id?.sale_types, hasExistingData]);

  // Check if any field has changed
  const hasChanges = React.useMemo(() => {
    return hasBusinessRatesChanges || hasDescriptionsChanges || hasSaleTypesChanges;
  }, [hasBusinessRatesChanges, hasDescriptionsChanges, hasSaleTypesChanges]);

  // Reset success message when form data changes after a successful update
  useEffect(() => {
    if (submitSuccess && hasChanges) {
      setSubmitSuccess(false);
    }
  }, [formData, submitSuccess, hasChanges]);

  // Determine which handler to use based on whether we're updating or creating
  const handleSubmitWrapper = () => {
    // Check if we have any existing data (business_rates, descriptions, or sale_types)
    const hasBusinessRates = propertyData?.business_rates_id?._id;
    const hasDescriptions = propertyData?.descriptions_id?._id;
    const hasSaleTypes = propertyData?.sale_types_id && Array.isArray(propertyData.sale_types_id) && propertyData.sale_types_id.length > 0;
    
    if (hasExistingData && (hasBusinessRates || hasDescriptions || hasSaleTypes)) {
      handleFormUpdate();
    } else {
      handleSubmit();
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
              disabled={(Array.isArray(formData.sale_types) ? formData.sale_types : []).length >= 1}
            >
              Add Sale Type
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Add one sale type and pricing option for this property.
          </Typography>
        </Box>

        {(Array.isArray(formData.sale_types) ? formData.sale_types : []).map((saleType, index) => (
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

        {(Array.isArray(formData.sale_types) ? formData.sale_types : []).length === 0 && (
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

        {/* Submit Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {hasExistingData && propertyData ? (
            // Update Button - shown when propertyData exists
            <Button
              variant="contained"
              startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
              onClick={handleFormUpdate}
              disabled={isSubmitting || !hasChanges}
              sx={{
                minWidth: 200,
                backgroundColor: '#f2c514',
                '&:hover': {
                  backgroundColor: '#d4a912',
                },
                '&:disabled': {
                  backgroundColor: '#e0e0e0',
                  color: '#9e9e9e',
                },
              }}
            >
              {isSubmitting 
                ? 'Updating...' 
                : (hasChanges ? 'Update Business Details' : 'No Changes Made')
              }
            </Button>
          ) : (
            // Save Button - shown when no propertyData exists
            <Button
              variant="contained"
              startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
              onClick={handleSubmit}
              disabled={isSubmitting || isSubmitted}
              sx={{
                minWidth: 200,
                backgroundColor: '#f2c514',
                '&:hover': {
                  backgroundColor: '#d4a912',
                },
                '&:disabled': {
                  backgroundColor: '#e0e0e0',
                  color: '#9e9e9e',
                },
              }}
            >
              {isSubmitting 
                ? 'Saving...' 
                : isSubmitted 
                  ? 'Business Details Saved'
                  : 'Save Business Details'
              }
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default BusinessDetailsForm;
