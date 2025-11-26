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
  Card,
  CardContent,
  InputAdornment,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Save } from '@mui/icons-material';
import { useFormContext, FieldErrors } from 'react-hook-form';
import axiosInstance from '../../../utils/axios';
import { enqueueSnackbar } from 'notistack';

const epcRatings = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'Exempt',
  'Not Required',
  'Unknown',
];

const councilTaxBands = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'Exempt',
  'Not Applicable',
  'Unknown',
];

const planningStatuses = [
  'Full Planning',
  'Outline Planning',
  'No Planning Required',
  'Unknown',
];

interface PropertyDetailsFormProps {
  onStepSubmitted?: (step: number) => void;
  initialData?: any;
  onDataChange?: (data: any) => void;
  propertyData?: any;
  hasExistingData?: boolean;
  fetchPropertyData?: () => void;
}

const PropertyDetailsForm: React.FC<PropertyDetailsFormProps> = ({ 
  onStepSubmitted, 
  initialData, 
  onDataChange, 
  propertyData,
  hasExistingData = false,
  fetchPropertyData
}) => {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [originalData, setOriginalData] = useState<any>(null);
  const lastPropertyIdRef = React.useRef<string | null>(null);
  const hasInitializedRef = React.useRef<boolean>(false);

  // Debug: Track fieldErrors changes
  useEffect(() => {
    console.log('fieldErrors state changed:', fieldErrors);
    console.log('fieldErrors keys:', Object.keys(fieldErrors));
    Object.keys(fieldErrors).forEach(key => {
      console.log(`  ${key}: "${fieldErrors[key]}"`);
    });
  }, [fieldErrors]);

  // Watch specific nested fields to ensure changes are detected
  const epcRating = watch('epc.rating');
  const epcScore = watch('epc.score');
  const epcCertificateNumber = watch('epc.certificate_number');
  const epcExpiryDate = watch('epc.expiry_date');
  const councilTaxBand = watch('council_tax.band');
  const councilTaxAuthority = watch('council_tax.authority');
  const rateableValue = watch('rateable_value');
  const planningStatus = watch('planning.status');
  const planningApplicationNumber = watch('planning.application_number');
  const planningDecisionDate = watch('planning.decision_date');
  
  const watchedValues = watch();

  // Initialize form data from propertyData or initialData
  useEffect(() => {
    const currentPropertyId = propertyData?._id || null;
    
    // Priority: propertyData > initialData
    const dataToUse = initialData || (propertyData ? {
      epc: propertyData.epc || {},
      council_tax: propertyData.council_tax || {},
      rateable_value: propertyData.rateable_value || 0,
      planning: propertyData.planning || {},
    } : null);
    
    // Only update if:
    // 1. We have data to use AND
    // 2. (We haven't initialized yet OR the property ID has changed to a different property)
    const shouldInitialize = dataToUse && (
      !hasInitializedRef.current || 
      (currentPropertyId !== null && lastPropertyIdRef.current !== currentPropertyId)
    );
    
    if (shouldInitialize) {
      // Set form values using setValue from react-hook-form
      Object.keys(dataToUse).forEach(key => {
        if (dataToUse[key] !== undefined) {
          setValue(key, dataToUse[key]);
        }
      });
      
      // Store original data for comparison
      setOriginalData({ ...dataToUse });
      lastPropertyIdRef.current = currentPropertyId;
      hasInitializedRef.current = true;
    }
  }, [initialData, propertyData?._id, setValue]);

  // Stable callback for data changes
  const handleDataChange = useCallback((data: any) => {
    if (onDataChange) {
      onDataChange(data);
    }
  }, [onDataChange]);

  // Handle data changes with debouncing to prevent infinite loops
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleDataChange(watchedValues);
    }, 100); // Small delay to debounce

    return () => clearTimeout(timeoutId);
  }, [watchedValues, handleDataChange]);
  
  // Type-safe error access - checks both react-hook-form errors and backend field errors
  const getFieldError = (fieldPath: string) => {
    // First check react-hook-form errors
    const fieldError = fieldPath.split('.').reduce((obj, key) => obj?.[key], errors as any);
    if (fieldError?.message) {
      return fieldError.message;
    }
    
    // Then check backend field errors
    const backendError = fieldErrors[fieldPath];
    return backendError || '';
  };

  // Get property ID from localStorage or propertyData
  const getPropertyId = () => {
    if (propertyData?._id) {
      return propertyData._id;
    }
    if (typeof window !== 'undefined') {
      return localStorage.getItem('newpropertyId') || localStorage.getItem('propertyId');
    }
    return null;
  };

  // Helper function to normalize values for comparison
  const normalizeValue = (value: any): any => {
    if (value === null || value === undefined || value === '') {
      return '';
    }
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed === '') return '';
      const num = Number(trimmed);
      if (!isNaN(num) && trimmed !== '') {
        return num;
      }
      return trimmed;
    }
    if (typeof value === 'number') {
      return value;
    }
    return value;
  };

  // Check if form data has changed from original
  const hasChanges = React.useMemo(() => {
    if (!hasExistingData || !propertyData || !originalData) {
      return false;
    }

    // Compare EPC fields individually
    const currentEpc = {
      rating: epcRating || '',
      score: epcScore || 0,
      certificate_number: epcCertificateNumber || '',
      expiry_date: epcExpiryDate || '',
    };
    const originalEpc = {
      rating: propertyData.epc?.rating || '',
      score: propertyData.epc?.score || 0,
      certificate_number: propertyData.epc?.certificate_number || '',
      expiry_date: propertyData.epc?.expiry_date || '',
    };
    const epcChanged = 
      normalizeValue(currentEpc.rating) !== normalizeValue(originalEpc.rating) ||
      normalizeValue(currentEpc.score) !== normalizeValue(originalEpc.score) ||
      normalizeValue(currentEpc.certificate_number) !== normalizeValue(originalEpc.certificate_number) ||
      normalizeValue(currentEpc.expiry_date) !== normalizeValue(originalEpc.expiry_date);

    // Compare Council Tax fields individually
    const currentCouncilTax = {
      band: councilTaxBand || '',
      authority: councilTaxAuthority || '',
    };
    const originalCouncilTax = {
      band: propertyData.council_tax?.band || '',
      authority: propertyData.council_tax?.authority || '',
    };
    const councilTaxChanged = 
      normalizeValue(currentCouncilTax.band) !== normalizeValue(originalCouncilTax.band) ||
      normalizeValue(currentCouncilTax.authority) !== normalizeValue(originalCouncilTax.authority);

    // Compare rateable value
    const currentRateableValue = normalizeValue(rateableValue);
    const originalRateableValue = normalizeValue(propertyData.rateable_value);
    const rateableValueChanged = currentRateableValue !== originalRateableValue;

    // Compare Planning fields individually
    const currentPlanning = {
      status: planningStatus || '',
      application_number: planningApplicationNumber || '',
      decision_date: planningDecisionDate || '',
    };
    const originalPlanning = {
      status: propertyData.planning?.status || '',
      application_number: propertyData.planning?.application_number || '',
      decision_date: propertyData.planning?.decision_date || '',
    };
    const planningChanged = 
      normalizeValue(currentPlanning.status) !== normalizeValue(originalPlanning.status) ||
      normalizeValue(currentPlanning.application_number) !== normalizeValue(originalPlanning.application_number) ||
      normalizeValue(currentPlanning.decision_date) !== normalizeValue(originalPlanning.decision_date);

    return epcChanged || councilTaxChanged || rateableValueChanged || planningChanged;
  }, [
    epcRating,
    epcScore,
    epcCertificateNumber,
    epcExpiryDate,
    councilTaxBand,
    councilTaxAuthority,
    rateableValue,
    planningStatus,
    planningApplicationNumber,
    planningDecisionDate,
    propertyData?.epc?.rating,
    propertyData?.epc?.score,
    propertyData?.epc?.certificate_number,
    propertyData?.epc?.expiry_date,
    propertyData?.council_tax?.band,
    propertyData?.council_tax?.authority,
    propertyData?.rateable_value,
    propertyData?.planning?.status,
    propertyData?.planning?.application_number,
    propertyData?.planning?.decision_date,
    hasExistingData,
    originalData
  ]);

  // Check if all required fields exist in propertyData
  const hasAllPropertyDetails = React.useMemo(() => {
    if (!propertyData) return false;
    return !!(propertyData.epc && propertyData.council_tax && propertyData.rateable_value !== undefined && propertyData.planning);
  }, [propertyData]);

  // Clear field error when user starts typing
  const clearFieldError = (fieldPath: string) => {
    if (fieldErrors[fieldPath]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldPath];
        return newErrors;
      });
    }
  };

  const handleSave = async () => {
    const propertyId = getPropertyId();
    
    if (!propertyId) {
      setSaveError('Property ID not found. Please complete the previous steps first.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    setFieldErrors({});

    try {
      const formData = {
        epc: watchedValues.epc,
        council_tax: watchedValues.council_tax,
        rateable_value: watchedValues.rateable_value,
        planning: watchedValues.planning,
      };

      let response = await axiosInstance.put(`/api/user/properties/${propertyId}/property-details`, formData);

      console.log(response.data , 'shardul is smart');
      
      enqueueSnackbar(response.data.message, { variant: 'success' });
      
      setSaveSuccess(true);
      setIsSubmitted(true);
      
      // Update original data after successful save
      setOriginalData({
        epc: watchedValues.epc,
        council_tax: watchedValues.council_tax,
        rateable_value: watchedValues.rateable_value,
        planning: watchedValues.planning,
      });
      
      setTimeout(() => setSaveSuccess(false), 3000); // Hide success message after 3 seconds


      fetchPropertyData?.();
      
      // Notify parent component that step 2 has been successfully submitted
      if (onStepSubmitted) {
        onStepSubmitted(2);
      }
    } catch (error: any) {
      console.error('Error saving property details:', error);
      
      // Handle field-specific validation errors
      const errorData = error.errors;
      
      if (errorData && Array.isArray(errorData) && errorData.length > 0) {
        const fieldErrorMap: Record<string, string> = {};
        errorData.forEach((err: any, index: number) => {

          if (err.path && err.msg) {
            let fieldPath = String(err.path).replace(/\[(\d+)\]/g, '.$1');
            fieldErrorMap[fieldPath] = err.msg;
          }
        });
        
        // Set field errors - this will trigger re-render
        setFieldErrors(fieldErrorMap);
        
        // Show general error message
        const errorMessage = 'Please fix the validation errors below.';
        setSaveError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: 'error' });
      } else {
        console.log('No errors array or empty array');
        // Handle general errors
        const errorMessage = errorData?.message || error.message || 'Failed to save property details. Please try again.';
        setSaveError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: 'error' });
        setFieldErrors({});
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormUpdate = async () => {
    const propertyId = getPropertyId();
    
    if (!propertyId) {
      setSaveError('Property ID not found. Please complete the previous steps first.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    setFieldErrors({});

    try {
      const formData = {
        epc: watchedValues.epc,
        council_tax: watchedValues.council_tax,
        rateable_value: watchedValues.rateable_value,
        planning: watchedValues.planning,
      };

      // Use PATCH endpoint for updating property details
      const response = await axiosInstance.patch(
        `/api/user/properties/${propertyId}/general-details`,
        formData
      );
      
      enqueueSnackbar(response.data.message || 'Property details updated successfully!', { variant: 'success' });
      
      // Update original data after successful update
      setOriginalData({
        epc: watchedValues.epc,
        council_tax: watchedValues.council_tax,
        rateable_value: watchedValues.rateable_value,
        planning: watchedValues.planning,
      });
      
      setSaveSuccess(true);
      setIsSubmitted(false); // Allow multiple updates
      
      // Refresh property data if callback is provided
      if (fetchPropertyData) {
        fetchPropertyData();
      }
      
      setTimeout(() => setSaveSuccess(false), 3000);
      
    } catch (error: any) {
      console.error('Error updating property details:', error);
      
      // Handle field-specific validation errors
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const fieldErrorMap: Record<string, string> = {};
        
        error.response.data.errors.forEach((err: any) => {
          if (err.path) {
            let fieldPath = err.path.replace(/\[(\d+)\]/g, '.$1');
            fieldErrorMap[fieldPath] = err.msg;
          }
        });
        
        setFieldErrors(fieldErrorMap);
        
        const errorMessage = error.response?.data?.message || error.message || 'Please fix the validation errors below.';
        setSaveError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: 'error' });
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to update property details. Please try again.';
        setSaveError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: 'error' });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Property Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide EPC, council tax, rateable value, and planning information.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* EPC Section */}
        <Box>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Energy Performance Certificate (EPC)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Energy efficiency rating and certificate details.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                    <FormControl fullWidth error={!!getFieldError('epc.rating')}>
                      <InputLabel>EPC Rating</InputLabel>
                      <Select
                        {...register('epc.rating')}
                        value={watchedValues.epc?.rating || ''}
                        onChange={(e) => {
                          setValue('epc.rating', e.target.value);
                          clearFieldError('epc.rating');
                        }}
                        label="EPC Rating"
                      >
                        {epcRatings.map((rating) => (
                          <MenuItem key={rating} value={rating}>
                            {rating}
                          </MenuItem>
                        ))}
                      </Select>
                      {getFieldError('epc.rating') && (
                        <FormHelperText>{getFieldError('epc.rating')}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>

                  {watchedValues.epc?.rating && 
                   watchedValues.epc?.rating !== 'Exempt' && 
                   watchedValues.epc?.rating !== 'Not Required' &&
                   watchedValues.epc?.rating !== 'Unknown' && (
                    <>
                      <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                        <TextField
                          {...register('epc.score', { valueAsNumber: true })}
                          label="EPC Score"
                          type="number"
                          fullWidth
                          error={!!getFieldError('epc.score')}
                          helperText={getFieldError('epc.score')}
                          placeholder="0-100"
                          inputProps={{ min: 0, max: 100 }}
                          onChange={(e) => {
                            register('epc.score', { valueAsNumber: true }).onChange(e);
                            clearFieldError('epc.score');
                          }}
                        />
                      </Box>

                      <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                        <TextField
                          {...register('epc.certificate_number')}
                          label="Certificate Number"
                          fullWidth
                          error={!!getFieldError('epc.certificate_number')}
                          helperText={getFieldError('epc.certificate_number')}
                          placeholder="Enter certificate number"
                          onChange={(e) => {
                            register('epc.certificate_number').onChange(e);
                            clearFieldError('epc.certificate_number');
                          }}
                        />
                      </Box>
                    </>
                  )}
                </Box>

                {watchedValues.epc?.rating && 
                 watchedValues.epc?.rating !== 'Exempt' && 
                 watchedValues.epc?.rating !== 'Not Required' &&
                 watchedValues.epc?.rating !== 'Unknown' && (
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                      <TextField
                        {...register('epc.expiry_date')}
                        label="Expiry Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        error={!!getFieldError('epc.expiry_date')}
                        helperText={getFieldError('epc.expiry_date')}
                        onChange={(e) => {
                          register('epc.expiry_date').onChange(e);
                          clearFieldError('epc.expiry_date');
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Council Tax Section */}
        <Box>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Council Tax
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Council tax band and authority information.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <FormControl fullWidth error={!!getFieldError('council_tax.band')}>
                    <InputLabel>Council Tax Band</InputLabel>
                    <Select
                      {...register('council_tax.band')}
                      value={watchedValues.council_tax?.band || ''}
                      onChange={(e) => {
                        setValue('council_tax.band', e.target.value);
                        clearFieldError('council_tax.band');
                      }}
                      label="Council Tax Band"
                    >
                      {councilTaxBands.map((band) => (
                        <MenuItem key={band} value={band}>
                          {band}
                        </MenuItem>
                      ))}
                    </Select>
                    {getFieldError('council_tax.band') && (
                      <FormHelperText>{getFieldError('council_tax.band')}</FormHelperText>
                    )}
                  </FormControl>
                </Box>

                {watchedValues.council_tax?.band && 
                 watchedValues.council_tax?.band !== 'Exempt' && 
                 watchedValues.council_tax?.band !== 'Not Applicable' &&
                 watchedValues.council_tax?.band !== 'Unknown' && (
                  <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                    <TextField
                      {...register('council_tax.authority')}
                      label="Council Authority"
                      fullWidth
                      error={!!getFieldError('council_tax.authority')}
                      helperText={getFieldError('council_tax.authority')}
                      placeholder="Enter council authority name"
                      onChange={(e) => {
                        register('council_tax.authority').onChange(e);
                        clearFieldError('council_tax.authority');
                      }}
                    />
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Rateable Value Section */}
        <Box>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Rateable Value
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Business rates and rateable value information.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    {...register('rateable_value', { valueAsNumber: true })}
                    label="Rateable Value (GBP)"
                    type="number"
                    fullWidth
                    error={!!getFieldError('rateable_value')}
                    helperText={getFieldError('rateable_value')}
                    placeholder="0"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">£</InputAdornment>,
                    }}
                    onChange={(e) => {
                      register('rateable_value', { valueAsNumber: true }).onChange(e);
                      clearFieldError('rateable_value');
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Planning Section */}
        <Box>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Planning Information
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Planning permission status and application details.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                  <FormControl fullWidth error={!!getFieldError('planning.status')}>
                    <InputLabel>Planning Status</InputLabel>
                    <Select
                      {...register('planning.status')}
                      value={watchedValues.planning?.status || ''}
                      onChange={(e) => {
                        setValue('planning.status', e.target.value);
                        clearFieldError('planning.status');
                      }}
                      label="Planning Status"
                    >
                      {planningStatuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                    {getFieldError('planning.status') && (
                      <FormHelperText>{getFieldError('planning.status')}</FormHelperText>
                    )}
                  </FormControl>
                </Box>

                {watchedValues.planning?.status && 
                 watchedValues.planning?.status !== 'Unknown' &&
                 watchedValues.planning?.status !== 'No Planning Required' && (
                  <>
                    <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                      <TextField
                        {...register('planning.application_number')}
                        label="Application Number"
                        fullWidth
                        error={!!getFieldError('planning.application_number')}
                        helperText={getFieldError('planning.application_number')}
                        placeholder="Enter planning application number"
                        onChange={(e) => {
                          register('planning.application_number').onChange(e);
                          clearFieldError('planning.application_number');
                        }}
                      />
                    </Box>

                    <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                      <TextField
                        {...register('planning.decision_date')}
                        label="Decision Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        error={!!getFieldError('planning.decision_date')}
                        helperText={getFieldError('planning.decision_date')}
                        onChange={(e) => {
                          register('planning.decision_date').onChange(e);
                          clearFieldError('planning.decision_date');
                        }}
                      />
                    </Box>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Save Button and Status Messages */}
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Success Alert */}
        {saveSuccess && (
          <Alert severity="success" onClose={() => setSaveSuccess(false)}>
            Property details saved successfully!
          </Alert>
        )}

        {/* Error Alert */}
        {saveError && (
          <Alert severity="error" onClose={() => setSaveError(null)}>
            {saveError}
          </Alert>
        )}

        {/* Save/Update Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {hasExistingData && hasAllPropertyDetails ? (
            // Update Button - shown when propertyData exists and all details are present
            <Button
              variant="contained"
              startIcon={isSaving ? <CircularProgress size={20} /> : <Save />}
              onClick={handleFormUpdate}
              disabled={isSaving || !hasChanges}
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
              {isSaving ? 'Updating...' : !hasChanges ? 'No Changes Made' : 'Update Property Details'}
            </Button>
          ) : (
            // Save Button - shown when creating new property details
            <Button
              variant="contained"
              startIcon={isSaving ? <CircularProgress size={20} /> : <Save />}
              onClick={handleSave}
              disabled={isSaving || isSubmitted}
              sx={{ 
                minWidth: 200,
                backgroundColor: '#f2c514',
                '&:hover': {
                  backgroundColor: '#d4a912',
                },
              }}
            >
              {isSaving ? 'Saving...' : isSubmitted ? 'Property Details Saved' : 'Save Property Details'}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PropertyDetailsForm;
