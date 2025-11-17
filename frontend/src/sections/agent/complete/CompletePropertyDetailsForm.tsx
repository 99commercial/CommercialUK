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
];

const planningStatuses = [
  'Full Planning',
  'Outline Planning',
  'No Planning Required',
  'Unknown',
];

interface PropertyDetailsFormProps {
  propertyId: string;
  onStepSubmitted?: (step: number) => void;
  initialData?: any;
  onDataChange?: (data: any) => void;
}

const PropertyDetailsForm: React.FC<PropertyDetailsFormProps> = ({ propertyId, onStepSubmitted, initialData, onDataChange }) => {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const watchedValues = watch();

  // Handle initial data
  useEffect(() => {
    if (initialData) {
      // Set form values using setValue from react-hook-form
      Object.keys(initialData).forEach(key => {
        if (initialData[key] !== undefined) {
          setValue(key, initialData[key]);
        }
      });
    }
  }, [initialData, setValue]);

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
    return fieldErrors[fieldPath] || '';
  };

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

      let response = await axiosInstance.put(`/api/agent/properties/${propertyId}/property-details`, formData);
      
      enqueueSnackbar(response.data.message, { variant: 'success' });
      
      setSaveSuccess(true);
        setIsSubmitted(true);
      setTimeout(() => setSaveSuccess(false), 3000); // Hide success message after 3 seconds
        
      // Notify parent component that step 2 has been successfully submitted
        if (onStepSubmitted) {
          onStepSubmitted(2);
        }
    } catch (error: any) {
      console.error('Error saving property details:', error);
      
      // Handle field-specific validation errors
      if (error.errors && Array.isArray(error.errors)) {
        const fieldErrorMap: Record<string, string> = {};
        
        error.errors.forEach((err: any) => {
          if (err.path) {
            // Convert backend path format to frontend format
            // Backend: "epc.rating" -> Frontend: "epc.rating"
            // Backend: "council_tax[0].band" -> Frontend: "council_tax.0.band"
            let fieldPath = err.path.replace(/\[(\d+)\]/g, '.$1');
            fieldErrorMap[fieldPath] = err.msg;
          }
        });
        setFieldErrors(fieldErrorMap);
        
        // Show general error message
        const errorMessage = error.message || 'Please fix the validation errors below.';
        setSaveError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: 'error' });
      } else {
        // Handle general errors
        const errorMessage = error.message || 'Failed to save property details. Please try again.';
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
                </Box>

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

        {/* Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
        </Box>
      </Box>
    </Box>
  );
};

export default PropertyDetailsForm;
