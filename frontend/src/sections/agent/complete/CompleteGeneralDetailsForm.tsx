import React, { useState, useEffect } from 'react';
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

interface CompleteGeneralDetailsFormData {
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

interface CompleteGeneralDetailsFormProps {
  propertyId: string;
  onStepSubmitted?: (step: number) => void;
  initialData?: any;
  onDataChange?: (data: any) => void;
}

const CompleteGeneralDetailsForm: React.FC<CompleteGeneralDetailsFormProps> = ({ 
  propertyId, 
  onStepSubmitted, 
  initialData, 
  onDataChange 
}) => {
  const [formData, setFormData] = useState<CompleteGeneralDetailsFormData>({
    building_name: '',
    property_type: '',
    property_sub_type: '',
    sale_status: 'Available',
    address: '',
    town_city: '',
    postcode: '',
    country_region: 'United Kingdom',
    size_minimum: 0,
    size_maximum: 0,
    max_eaves_height: 0,
    approximate_year_of_construction: new Date().getFullYear(),
    expansion_capacity_percent: 0,
    invoice_details: '',
    property_notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Load initial data
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  // Notify parent of data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  const handleInputChange = (field: keyof CompleteGeneralDetailsFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.building_name.trim()) {
      errors.building_name = 'Building name is required';
    }
    if (!formData.property_type) {
      errors.property_type = 'Property type is required';
    }
    if (!formData.property_sub_type.trim()) {
      errors.property_sub_type = 'Property sub type is required';
    }
    if (!formData.sale_status) {
      errors.sale_status = 'Sale status is required';
    }
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }
    if (!formData.town_city.trim()) {
      errors.town_city = 'Town/City is required';
    }
    if (!formData.postcode.trim()) {
      errors.postcode = 'Postcode is required';
    }
    if (!formData.country_region.trim()) {
      errors.country_region = 'Country/Region is required';
    }
    if (formData.size_minimum <= 0) {
      errors.size_minimum = 'Minimum size must be greater than 0';
    }
    if (formData.size_maximum <= 0) {
      errors.size_maximum = 'Maximum size must be greater than 0';
    }
    if (formData.size_maximum < formData.size_minimum) {
      errors.size_maximum = 'Maximum size must be greater than or equal to minimum size';
    }
    if (formData.max_eaves_height < 0) {
      errors.max_eaves_height = 'Max eaves height cannot be negative';
    }
    if (formData.approximate_year_of_construction < 1800 || formData.approximate_year_of_construction > new Date().getFullYear() + 5) {
      errors.approximate_year_of_construction = 'Year of construction must be between 1800 and ' + (new Date().getFullYear() + 5);
    }
    if (formData.expansion_capacity_percent < 0 || formData.expansion_capacity_percent > 100) {
      errors.expansion_capacity_percent = 'Expansion capacity must be between 0 and 100';
    }
    if (!formData.invoice_details.trim()) {
      errors.invoice_details = 'Invoice details are required';
    }
    if (!formData.property_notes.trim()) {
      errors.property_notes = 'Property notes are required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await axiosInstance.patch(`/properties/${propertyId}/general-details`, formData);
      
      if (response.data.success) {
        setIsSubmitted(true);
        enqueueSnackbar('General details updated successfully!', { variant: 'success' });
        
        if (onStepSubmitted) {
          onStepSubmitted(0);
        }
      } else {
        setSubmitError(response.data.message || 'Failed to update general details');
      }
    } catch (error: any) {
      console.error('Error updating general details:', error);
      setSubmitError(error.response?.data?.message || 'Failed to update general details');
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
              label="Property Sub Type"
              fullWidth
              placeholder="Enter property sub type"
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

        <Divider />

        <Typography variant="h6" gutterBottom>
          Location Details
        </Typography>

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Address */}
          <Box sx={{ flex: '1 1 100%' }}>
            <TextField
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              label="Address"
              fullWidth
              placeholder="Enter full address"
              required
              error={!!fieldErrors.address}
              helperText={fieldErrors.address}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Town/City */}
          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
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
              placeholder="Enter postcode"
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
              placeholder="Enter country or region"
              required
              error={!!fieldErrors.country_region}
              helperText={fieldErrors.country_region}
            />
          </Box>
        </Box>

        <Divider />

        <Typography variant="h6" gutterBottom>
          Property Specifications
        </Typography>

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Size Minimum */}
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <TextField
              type="number"
              value={formData.size_minimum}
              onChange={(e) => handleInputChange('size_minimum', parseFloat(e.target.value) || 0)}
              label="Minimum Size (sq ft)"
              fullWidth
              required
              error={!!fieldErrors.size_minimum}
              helperText={fieldErrors.size_minimum}
            />
          </Box>

          {/* Size Maximum */}
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <TextField
              type="number"
              value={formData.size_maximum}
              onChange={(e) => handleInputChange('size_maximum', parseFloat(e.target.value) || 0)}
              label="Maximum Size (sq ft)"
              fullWidth
              required
              error={!!fieldErrors.size_maximum}
              helperText={fieldErrors.size_maximum}
            />
          </Box>

          {/* Max Eaves Height */}
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <TextField
              type="number"
              value={formData.max_eaves_height}
              onChange={(e) => handleInputChange('max_eaves_height', parseFloat(e.target.value) || 0)}
              label="Max Eaves Height (ft)"
              fullWidth
              required
              error={!!fieldErrors.max_eaves_height}
              helperText={fieldErrors.max_eaves_height}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Year of Construction */}
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <TextField
              type="number"
              value={formData.approximate_year_of_construction}
              onChange={(e) => handleInputChange('approximate_year_of_construction', parseInt(e.target.value) || new Date().getFullYear())}
              label="Year of Construction"
              fullWidth
              required
              error={!!fieldErrors.approximate_year_of_construction}
              helperText={fieldErrors.approximate_year_of_construction}
            />
          </Box>

          {/* Expansion Capacity */}
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <TextField
              type="number"
              value={formData.expansion_capacity_percent}
              onChange={(e) => handleInputChange('expansion_capacity_percent', parseFloat(e.target.value) || 0)}
              label="Expansion Capacity (%)"
              fullWidth
              required
              error={!!fieldErrors.expansion_capacity_percent}
              helperText={fieldErrors.expansion_capacity_percent}
            />
          </Box>
        </Box>

        <Divider />

        <Typography variant="h6" gutterBottom>
          Additional Information
        </Typography>

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Invoice Details */}
          <Box sx={{ flex: '1 1 100%' }}>
            <TextField
              value={formData.invoice_details}
              onChange={(e) => handleInputChange('invoice_details', e.target.value)}
              label="Invoice Details"
              fullWidth
              multiline
              rows={3}
              placeholder="Enter invoice details"
              required
              error={!!fieldErrors.invoice_details}
              helperText={fieldErrors.invoice_details}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Property Notes */}
          <Box sx={{ flex: '1 1 100%' }}>
            <TextField
              value={formData.property_notes}
              onChange={(e) => handleInputChange('property_notes', e.target.value)}
              label="Property Notes"
              fullWidth
              multiline
              rows={4}
              placeholder="Enter property notes"
              required
              error={!!fieldErrors.property_notes}
              helperText={fieldErrors.property_notes}
            />
          </Box>
        </Box>

        {/* Submit Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
            disabled={isSubmitting || isSubmitted}
            sx={{ minWidth: 150 }}
          >
            {isSubmitting ? 'Saving...' : isSubmitted ? 'Saved' : 'Save Details'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CompleteGeneralDetailsForm;
