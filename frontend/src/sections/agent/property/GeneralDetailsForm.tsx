import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  Divider,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Save } from '@mui/icons-material';
import axiosInstance from '../../../utils/axios';
import { enqueueSnackbar } from 'notistack';

const propertyTypes = [
  'Office',
  'Retail',
  'Industrial',
  'Warehouse',
  'Land',
  'Leisure',
  'Healthcare',
  'Education',
  'Hotel',
  'Restaurant',
  'Student Accommodation',
  'Car Park',
  'Data Centre',
  'Other',
];

const saleStatuses = [
  'Available',
  'Under Offer',
  'Sold',
  'Let',
  'Withdrawn',
];

interface GeneralDetailsFormData {
  building_name: string;
  property_type: string;
  property_sub_type: string;
  sale_status: string;
  address: string;
  town_city: string;
  postcode: string;
  country_region: string;
  size_minimum: number;
  size_maximum: number;
  max_eaves_height: number;
  approximate_year_of_construction: number;
  expansion_capacity_percent: number;
  invoice_details: string;
  property_notes: string;
}

interface GeneralDetailsFormProps {
  onStepSubmitted?: (step: number) => void;
  initialData?: GeneralDetailsFormData;
  onDataChange?: (data: GeneralDetailsFormData) => void;
}

const GeneralDetailsForm: React.FC<GeneralDetailsFormProps> = ({ onStepSubmitted, initialData, onDataChange }) => {

  const [formData, setFormData] = useState<GeneralDetailsFormData>(initialData || {
    building_name: '',
    property_type: '',
    property_sub_type: '',
    sale_status: '',
    address: '',
    town_city: '',
    postcode: '',
    country_region: 'United Kingdom',
    size_minimum: 0,
    size_maximum: 0,
    max_eaves_height: 0,
    approximate_year_of_construction: 0,
    expansion_capacity_percent: 0,
    invoice_details: '',
    property_notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Update form data when initialData changes
  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Notify parent of data changes with debouncing to prevent infinite loops
  React.useEffect(() => {
    if (onDataChange) {
      const timeoutId = setTimeout(() => {
        onDataChange(formData);
      }, 100); // Small delay to debounce
      
      return () => clearTimeout(timeoutId);
    }
  }, [formData, onDataChange]);

  // Debug: Log field errors when they change
  React.useEffect(() => {
    console.log('Field errors state updated:', fieldErrors);
  }, [fieldErrors]);


  const handleInputChange = (field: keyof GeneralDetailsFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field error when user starts typing 
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent page reload
    setIsSubmitting(true);
    setSubmitError(null);
    setFieldErrors({});

    try {
      // Prepare the data for API submission
      const submitData = {
        general_details: formData,
      };

      // Make API call to create property with general details
      const response = await axiosInstance.post('/api/agent/properties', submitData);
      enqueueSnackbar(response.data.message, { variant: 'success' });
      
      // Set submitted state
      setIsSubmitted(true);
      
      // Notify parent component that step 0 has been successfully submitted
      if (onStepSubmitted) {
        onStepSubmitted(0);
      }

      localStorage.setItem('propertyId', response.data.data._id);

    } catch (error: any) {
      // Handle field-specific validation errors
      if (error.errors && Array.isArray(error.errors)) {
        const fieldErrorMap: Record<string, string> = {};
        
        console.log('Processing validation errors:', error.errors);
        
        error.errors.forEach((err: any) => {
          console.log('Processing error:', err);
          if (err.path) {
            // Extract field name from path (e.g., "general_details.postcode" -> "postcode")
            const fieldName = err.path.split('.').pop();
            console.log('Field name extracted:', fieldName, 'from path:', err.path);
            if (fieldName) {
              fieldErrorMap[fieldName] = err.msg;
            }
          }
        });
        
        console.log('Field error map created:', fieldErrorMap);
        setFieldErrors(fieldErrorMap);
        
        // Show general error message
        const errorMessage = error.message || 'Please fix the validation errors below.';
        setSubmitError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: 'error' });
      } else {
        // Handle general errors
        const errorMessage = error.message || 'Failed to save general details. Please try again.';
        setSubmitError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: 'error' });
      }
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleFormSubmit}>
      <Typography variant="h6" gutterBottom>
        Basic Property Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide the essential details about your property listing.
      </Typography>

      {/* Error Alert */}
      {submitError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSubmitError(null)}>
          {submitError}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Building Name */}
          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <TextField
              value={formData.building_name}
              onChange={(e) => handleInputChange('building_name', e.target.value)}
              label="Building Name"
              fullWidth
              placeholder="Enter building name"
              required
              error={!!fieldErrors.building_name}
              helperText={fieldErrors.building_name}
            />
          </Box>

          {/* Property Type */}
          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <FormControl fullWidth required error={!!fieldErrors.property_type}>
              <InputLabel>Property Type</InputLabel>
              <Select
                value={formData.property_type}
                onChange={(e) => handleInputChange('property_type', e.target.value)}
                label="Property Type"
              >
                {propertyTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {fieldErrors.property_type && (
                <FormHelperText>{fieldErrors.property_type}</FormHelperText>
              )}
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Property Sub Type */}
          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <TextField
              value={formData.property_sub_type}
              onChange={(e) => handleInputChange('property_sub_type', e.target.value)}
              label="Property Sub-Type"
              fullWidth
              placeholder="e.g., Grade A Office, High Street Retail"
              required
              error={!!fieldErrors.property_sub_type}
              helperText={fieldErrors.property_sub_type}
            />
          </Box>

          {/* Sale Status */}
          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <FormControl fullWidth required error={!!fieldErrors.sale_status}>
              <InputLabel>Sale Status</InputLabel>
              <Select
                value={formData.sale_status}
                onChange={(e) => handleInputChange('sale_status', e.target.value)}
                label="Sale Status"
              >
                {saleStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
              {fieldErrors.sale_status && (
                <FormHelperText>{fieldErrors.sale_status}</FormHelperText>
              )}
            </FormControl>
          </Box>
        </Box>

        <Box>
          <Divider sx={{ my: 2 }} />
        </Box>

        {/* Address Section */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Address Information
          </Typography>
        </Box>

        {/* Address */}
        <Box>
          <TextField
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            label="Full Address"
            fullWidth
            multiline
            rows={2}
            placeholder="Enter the complete address"
            required
            error={!!fieldErrors.address}
            helperText={fieldErrors.address}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Town/City */}
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <TextField
              value={formData.town_city}
              onChange={(e) => handleInputChange('town_city', e.target.value)}
              label="Town/City"
              fullWidth
              placeholder="Enter town or city"
              required
              error={!!fieldErrors.town_city}
              helperText={fieldErrors.town_city}
            />
          </Box>

          {/* Postcode */}
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <TextField
              value={formData.postcode}
              onChange={(e) => handleInputChange('postcode', e.target.value)}
              label="Postcode"
              fullWidth
              placeholder="e.g., SW1A 1AA"
              required
              error={!!fieldErrors.postcode}
              helperText={fieldErrors.postcode}
            />
          </Box>

          {/* Country/Region */}
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <TextField
              value={formData.country_region}
              onChange={(e) => handleInputChange('country_region', e.target.value)}
              label="Country/Region"
              fullWidth
              placeholder="e.g., England, Scotland"
              required
              error={!!fieldErrors.country_region}
              helperText={fieldErrors.country_region}
            />
          </Box>
        </Box>

        <Box>
          <Divider sx={{ my: 2 }} />
        </Box>

        {/* Property Specifications */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Property Specifications
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Size Range */}
          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <TextField
              value={formData.size_minimum}
              onChange={(e) => handleInputChange('size_minimum', Number(e.target.value))}
              label="Minimum Size (sq ft)"
              type="number"
              fullWidth
              placeholder="0"
              required
              inputProps={{ min: 0 }}
              error={!!fieldErrors.size_minimum}
              helperText={fieldErrors.size_minimum}
            />
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <TextField
              value={formData.size_maximum}
              onChange={(e) => handleInputChange('size_maximum', Number(e.target.value))}
              label="Maximum Size (sq ft)"
              type="number"
              fullWidth
              placeholder="0"
              required
              inputProps={{ min: 0 }}
              error={!!fieldErrors.size_maximum}
              helperText={fieldErrors.size_maximum}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Max Eaves Height */}
          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <TextField
              value={formData.max_eaves_height}
              onChange={(e) => handleInputChange('max_eaves_height', Number(e.target.value))}
              label="Max Eaves Height (m)"
              type="number"
              fullWidth
              placeholder="0"
              required
              inputProps={{ step: 0.1, min: 0, max: 1000 }}
              error={!!fieldErrors.max_eaves_height}
              helperText={fieldErrors.max_eaves_height}
            />
          </Box>

          {/* Year of Construction */}
          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <TextField
              value={formData.approximate_year_of_construction}
              onChange={(e) => handleInputChange('approximate_year_of_construction', Number(e.target.value))}
              label="Year of Construction"
              type="number"
              fullWidth
              placeholder="e.g., 2020"
              required
              inputProps={{ min: 1800, max: new Date().getFullYear() + 5 }}
              error={!!fieldErrors.approximate_year_of_construction}
              helperText={fieldErrors.approximate_year_of_construction}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Expansion Capacity */}
          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <TextField
              value={formData.expansion_capacity_percent}
              onChange={(e) => handleInputChange('expansion_capacity_percent', Number(e.target.value))}
              label="Expansion Capacity (%)"
              type="number"
              fullWidth
              placeholder="0"
              required
              inputProps={{ min: 0, max: 100 }}
              error={!!fieldErrors.expansion_capacity_percent}
              helperText={fieldErrors.expansion_capacity_percent}
            />
          </Box>
        </Box>

        <Box>
          <Divider sx={{ my: 2 }} />
        </Box>

        {/* Additional Information */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Additional Information
          </Typography>
        </Box>

        {/* Invoice Details */}
        <Box>
          <TextField
            value={formData.invoice_details}
            onChange={(e) => handleInputChange('invoice_details', e.target.value)}
            label="Invoice Details"
            fullWidth
            multiline
            rows={3}
            placeholder="Enter invoice and billing information"
            required
            error={!!fieldErrors.invoice_details}
            helperText={fieldErrors.invoice_details}
          />
        </Box>

        {/* Property Notes */}
        <Box>
          <TextField
            value={formData.property_notes}
            onChange={(e) => handleInputChange('property_notes', e.target.value)}
            label="Property Notes"
            fullWidth
            multiline
            rows={4}
            placeholder="Enter detailed property notes and additional information"
            required
            error={!!fieldErrors.property_notes}
            helperText={fieldErrors.property_notes}
          />
        </Box>

        {/* Submit Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
            disabled={isSubmitting || isSubmitted}
            sx={{
              minWidth: 200,
              backgroundColor: '#dc2626',
              '&:hover': {
                backgroundColor: '#b91c1c',
              },
            }}
          >
            {isSubmitting ? 'Saving...' : isSubmitted ? 'General Details Saved' : 'Save General Details'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default GeneralDetailsForm;
