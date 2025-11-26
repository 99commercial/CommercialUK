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
import axiosInstance from '../../../../utils/axios';
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

interface UpdatePropertyDetailsFormData {
  epc: {
    rating?: string;
    score?: number;
    certificate_number?: string;
    expiry_date?: string;
  };
  council_tax: {
    band?: string;
    authority?: string;
  };
  rateable_value?: number;
  planning: {
    status?: string;
    application_number?: string;
    decision_date?: string;
  };
}

interface UpdatePropertyDetailsFormProps {
  onStepSubmitted?: (step: number) => void;
  initialData?: UpdatePropertyDetailsFormData;
  onDataChange?: (data: UpdatePropertyDetailsFormData) => void;
  propertyId?: string;
  fetchProperty?: () => void;
}

const UpdatePropertyDetailsForm: React.FC<UpdatePropertyDetailsFormProps> = ({ 
  onStepSubmitted, 
  initialData, 
  onDataChange,
  propertyId,
  fetchProperty
}) => {
  // Helper function to format date to yyyy-mm-dd
  const formatDateForInput = (dateString: string | undefined): string => {
    if (!dateString) return '';
    
    // If already in yyyy-mm-dd format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // Try to parse the date and format it
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      return '';
    }
  };

  const [formData, setFormData] = useState<UpdatePropertyDetailsFormData>({
    epc: {
      rating: initialData?.epc?.rating || '',
      score: initialData?.epc?.score || 0,
      certificate_number: initialData?.epc?.certificate_number || '',
      expiry_date: formatDateForInput(initialData?.epc?.expiry_date),
    },
    council_tax: {
      band: initialData?.council_tax?.band || '',
      authority: initialData?.council_tax?.authority || '',
    },
    rateable_value: initialData?.rateable_value || 0,
    planning: {
      status: initialData?.planning?.status || '',
      application_number: initialData?.planning?.application_number || '',
      decision_date: formatDateForInput(initialData?.planning?.decision_date),
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Update form data when initialData changes
  React.useEffect(() => {
    if (initialData) {
      setFormData({
        epc: {
          rating: initialData?.epc?.rating || '',
          score: initialData?.epc?.score || 0,
          certificate_number: initialData?.epc?.certificate_number || '',
          expiry_date: formatDateForInput(initialData?.epc?.expiry_date),
        },
        council_tax: {
          band: initialData?.council_tax?.band || '',
          authority: initialData?.council_tax?.authority || '',
        },
        rateable_value: initialData?.rateable_value || 0,
        planning: {
          status: initialData?.planning?.status || '',
          application_number: initialData?.planning?.application_number || '',
          decision_date: formatDateForInput(initialData?.planning?.decision_date),
        },
      });
      setIsSubmitted(true); // Mark as submitted since we're editing existing data
    }
  }, [initialData]);

  // Notify parent component of data changes
  React.useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  // Check for changes compared to initial data
  React.useEffect(() => {
    if (initialData) {
      const initialFormData = {
        epc: {
          rating: initialData?.epc?.rating || '',
          score: initialData?.epc?.score || 0,
          certificate_number: initialData?.epc?.certificate_number || '',
          expiry_date: formatDateForInput(initialData?.epc?.expiry_date),
        },
        council_tax: {
          band: initialData?.council_tax?.band || '',
          authority: initialData?.council_tax?.authority || '',
        },
        rateable_value: initialData?.rateable_value || 0,
        planning: {
          status: initialData?.planning?.status || '',
          application_number: initialData?.planning?.application_number || '',
          decision_date: formatDateForInput(initialData?.planning?.decision_date),
        },
      };

      const hasDataChanged = JSON.stringify(formData) !== JSON.stringify(initialFormData);
      setHasChanges(hasDataChanged);
    }
  }, [formData, initialData]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Check if EPC fields should be validated (not Exempt or Not Required)
    const shouldValidateEPC = formData.epc.rating && 
      formData.epc.rating !== 'Exempt' && 
      formData.epc.rating !== 'Not Required';

    // Validate EPC score (only if rating is not Exempt or Not Required)
    if (shouldValidateEPC && formData.epc.score && (formData.epc.score < 0 || formData.epc.score > 100)) {
      errors.epc_score = 'EPC score must be between 0 and 100';
    }

    // Validate rateable value - required field
    if (!formData.rateable_value || formData.rateable_value === 0) {
      errors.rateable_value = 'Rateable value is required';
    } else if (formData.rateable_value < 0) {
      errors.rateable_value = 'Rateable value must be greater than 0';
    }

    // Validate expiry date (only if rating is not Exempt or Not Required)
    if (shouldValidateEPC && formData.epc.expiry_date) {
      const expiryDate = new Date(formData.epc.expiry_date);
      const today = new Date();
      if (expiryDate < today) {
        errors.epc_expiry = 'EPC expiry date should be in the future';
      }
    }

    // Check if planning fields should be validated (not Unknown)
    const shouldValidatePlanning = formData.planning.status && formData.planning.status !== 'Unknown';

    // Validate decision date (only if status is not Unknown)
    if (shouldValidatePlanning && formData.planning.decision_date) {
      const decisionDate = new Date(formData.planning.decision_date);
      const today = new Date();
      if (decisionDate > today) {
        errors.planning_decision = 'Decision date should be in the past';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEPCChange = (field: string, value: any) => {
    setFormData(prev => {
      const newEpc = {
        ...prev.epc,
        [field]: value
      };
      
      // If rating is "Exempt" or "Not Required", clear related fields
      if (field === 'rating' && (value === 'Exempt' || value === 'Not Required')) {
        newEpc.score = 0;
        newEpc.certificate_number = '';
        newEpc.expiry_date = '';
      }
      
      return {
        ...prev,
        epc: newEpc
      };
    });
  };

  const handleCouncilTaxChange = (field: string, value: any) => {
    setFormData(prev => {
      const newCouncilTax = {
        ...prev.council_tax,
        [field]: value
      };
      
      // If band is "Exempt" or "Not Applicable", clear authority field
      if (field === 'band' && (value === 'Exempt' || value === 'Not Applicable')) {
        newCouncilTax.authority = '';
      }
      
      return {
        ...prev,
        council_tax: newCouncilTax
      };
    });
  };

  const handlePlanningChange = (field: string, value: any) => {
    setFormData(prev => {
      const newPlanning = {
        ...prev.planning,
        [field]: value
      };
      
      // If status is "Unknown", clear related fields
      if (field === 'status' && value === 'Unknown') {
        newPlanning.application_number = '';
        newPlanning.decision_date = '';
      }
      
      return {
        ...prev,
        planning: newPlanning
      };
    });
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

    try {
      const response = await axiosInstance.patch(`/api/user/properties/${propertyId}/general-details`, formData);
      
      if (response.data.success) {
        setIsSubmitted(true);
        setHasChanges(false); // Reset changes flag after successful update
        enqueueSnackbar('Property details updated successfully!', { variant: 'success' });
        
        if (onStepSubmitted) {
          onStepSubmitted(2);
        }
      } else {
        throw new Error(response.data.message || 'Failed to update property details');
      }
    } catch (error: any) {
      console.error('Error updating property details:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update property details';
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

        {/* EPC Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Energy Performance Certificate (EPC)
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, width: '100%', flexWrap: 'wrap' }}>
              <FormControl sx={{ flex: 1, minWidth: 120 }}>
                <InputLabel>EPC Rating</InputLabel>
                <Select
                  value={formData.epc.rating || ''}
                  onChange={(e) => handleEPCChange('rating', e.target.value)}
                  label="EPC Rating"
                >
                  {epcRatings.map((rating) => (
                    <MenuItem key={rating} value={rating}>
                      {rating}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Only show EPC fields if rating is not "Exempt" or "Not Required" */}
              {formData.epc.rating && 
               formData.epc.rating !== 'Exempt' && 
               formData.epc.rating !== 'Not Required' && (
                <>
                  <TextField
                    label="EPC Score"
                    type="number"
                    value={formData.epc.score || ''}
                    onChange={(e) => handleEPCChange('score', parseInt(e.target.value) || 0)}
                    error={!!fieldErrors.epc_score}
                    helperText={fieldErrors.epc_score}
                    inputProps={{ min: 0, max: 100 }}
                    sx={{ flex: 1, minWidth: 120 }}
                  />

                  <TextField
                    label="Certificate Number"
                    value={formData.epc.certificate_number || ''}
                    onChange={(e) => handleEPCChange('certificate_number', e.target.value)}
                    sx={{ flex: 2, minWidth: 200 }}
                  />

                  <TextField
                    label="Expiry Date"
                    type="date"
                    value={formData.epc.expiry_date || ''}
                    onChange={(e) => handleEPCChange('expiry_date', e.target.value)}
                    error={!!fieldErrors.epc_expiry}
                    helperText={fieldErrors.epc_expiry}
                    InputLabelProps={{ shrink: true }}
                    sx={{ flex: 1, minWidth: 150 }}
                  />
                </>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Council Tax Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Council Tax
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
              <FormControl sx={{ flex: 1, minWidth: 120 }}>
                <InputLabel>Council Tax Band</InputLabel>
                <Select
                  value={formData.council_tax.band || ''}
                  onChange={(e) => handleCouncilTaxChange('band', e.target.value)}
                  label="Council Tax Band"
                >
                  {councilTaxBands.map((band) => (
                    <MenuItem key={band} value={band}>
                      {band}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Only show Council Authority if band is not "Exempt" or "Not Applicable" */}
              {formData.council_tax.band && 
               formData.council_tax.band !== 'Exempt' && 
               formData.council_tax.band !== 'Not Applicable' && (
                <TextField
                  label="Council Authority"
                  value={formData.council_tax.authority || ''}
                  onChange={(e) => handleCouncilTaxChange('authority', e.target.value)}
                  sx={{ flex: 2, minWidth: 200 }}
                />
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Rateable Value Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Rateable Value
            </Typography>
            <TextField
              label="Rateable Value (GBP)"
              type="number"
              required
              value={formData.rateable_value || ''}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, rateable_value: parseFloat(e.target.value) || 0 }));
                // Clear error when user starts typing
                if (fieldErrors.rateable_value) {
                  setFieldErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.rateable_value;
                    return newErrors;
                  });
                }
              }}
              error={!!fieldErrors.rateable_value}
              helperText={fieldErrors.rateable_value}
              InputProps={{
                startAdornment: <InputAdornment position="start">£</InputAdornment>,
              }}
              inputProps={{ min: 0 }}
              sx={{ width: '100%', maxWidth: 300 }}
            />
          </CardContent>
        </Card>

        {/* Planning Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Planning Information
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, width: '100%', flexWrap: 'wrap' }}>
              <FormControl sx={{ flex: 1, minWidth: 150 }}>
                <InputLabel>Planning Status</InputLabel>
                <Select
                  value={formData.planning.status || ''}
                  onChange={(e) => handlePlanningChange('status', e.target.value)}
                  label="Planning Status"
                >
                  {planningStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Only show Planning fields if status is not "Unknown" */}
              {formData.planning.status && formData.planning.status !== 'Unknown' && (
                <>
                  <TextField
                    label="Application Number"
                    value={formData.planning.application_number || ''}
                    onChange={(e) => handlePlanningChange('application_number', e.target.value)}
                    sx={{ flex: 2, minWidth: 200 }}
                  />

                  <TextField
                    label="Decision Date"
                    type="date"
                    value={formData.planning.decision_date || ''}
                    onChange={(e) => handlePlanningChange('decision_date', e.target.value)}
                    error={!!fieldErrors.planning_decision}
                    helperText={fieldErrors.planning_decision}
                    InputLabelProps={{ shrink: true }}
                    sx={{ flex: 1, minWidth: 150 }}
                  />
                </>
              )}
            </Box>
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
              backgroundColor: hasChanges ? '#2563eb' : '#9ca3af',
              '&:hover': {
                backgroundColor: hasChanges ? '#1d4ed8' : '#9ca3af',
              },
            }}
          >
            {isSubmitting ? 'Updating...' : hasChanges ? 'Update Property Details' : 'No Changes to Save'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default UpdatePropertyDetailsForm;
