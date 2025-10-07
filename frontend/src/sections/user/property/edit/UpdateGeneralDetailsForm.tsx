import React, { useState } from 'react';
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
  Paper,
  Stack,
} from '@mui/material';
import styled from 'styled-components';
import { Save } from '@mui/icons-material';
import axiosInstance from '../../../../utils/axios';
import { enqueueSnackbar } from 'notistack';

// Styled Components for Cards
const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

const StyledCard = styled(Paper)`
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
`;

const CardTitle = styled(Typography)`
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
  font-size: 16px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const FormField = styled.div`
  flex: 1;
  min-width: 0;
`;

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

interface UpdateGeneralDetailsFormData {
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

interface UpdateGeneralDetailsFormProps {
  onStepSubmitted?: (step: number) => void;
  initialData?: UpdateGeneralDetailsFormData;
  onDataChange?: (data: UpdateGeneralDetailsFormData) => void;
  propertyId?: string;
  fetchProperty?: () => void;
}

const UpdateGeneralDetailsForm: React.FC<UpdateGeneralDetailsFormProps> = ({ 
  onStepSubmitted, 
  initialData, 
  onDataChange,
  propertyId,
  fetchProperty
}) => {

  const [formData, setFormData] = useState<UpdateGeneralDetailsFormData>(() => ({
      building_name: initialData?.building_name || '',
      property_type: initialData?.property_type || '',
      property_sub_type: initialData?.property_sub_type || '',
      sale_status: initialData?.sale_status || '',
      address: initialData?.address || '',
      town_city: initialData?.town_city || '',
      postcode: initialData?.postcode || '',
      country_region: initialData?.country_region || 'United Kingdom',
      size_minimum: initialData?.size_minimum || 0,
      size_maximum: initialData?.size_maximum || 0,
      max_eaves_height: initialData?.max_eaves_height || 0,
      approximate_year_of_construction: initialData?.approximate_year_of_construction || 0,
      expansion_capacity_percent: initialData?.expansion_capacity_percent || 0,
      invoice_details: initialData?.invoice_details || '',
      property_notes: initialData?.property_notes || '',
    })
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Update form data when initialData changes
  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setIsSubmitted(true); // Mark as submitted since we're editing existing data
      setHasChanges(false); // Reset changes when initial data is loaded
    }
  }, [initialData]);

  // Check for changes when form data changes
  React.useEffect(() => {
    if (initialData) {
      const hasFormChanged = Object.keys(formData).some(key => {
        const formValue = formData[key as keyof UpdateGeneralDetailsFormData];
        const initialValue = initialData[key as keyof UpdateGeneralDetailsFormData];
        return formValue !== initialValue;
      });
      setHasChanges(hasFormChanged);
    } else {
      // If no initial data, check if form has any meaningful data
      const hasFormData = Object.values(formData).some(value => {
        if (typeof value === 'string') {
          return value.trim() !== '';
        }
        if (typeof value === 'number') {
          return value > 0;
        }
        return false;
      });
      setHasChanges(hasFormData);
    }
  }, [formData, initialData]);

  // Notify parent component of data changes
  React.useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.building_name.trim()) {
      errors.building_name = 'Building name is required';
    }

    if (!formData.property_type) {
      errors.property_type = 'Property type is required';
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

    if (formData.size_minimum < 0) {
      errors.size_minimum = 'Size minimum must be 0 or greater';
    }

    if (formData.size_maximum < 0) {
      errors.size_maximum = 'Size maximum must be 0 or greater';
    }

    if (formData.size_minimum > formData.size_maximum && formData.size_maximum > 0) {
      errors.size_maximum = 'Size maximum must be greater than or equal to size minimum';
    }

    if (formData.max_eaves_height < 0) {
      errors.max_eaves_height = 'Max eaves height must be 0 or greater';
    }

    if (formData.approximate_year_of_construction < 1800 || formData.approximate_year_of_construction > new Date().getFullYear()) {
      errors.approximate_year_of_construction = 'Year of construction must be between 1800 and current year';
    }

    if (formData.expansion_capacity_percent < 0 || formData.expansion_capacity_percent > 100) {
      errors.expansion_capacity_percent = 'Expansion capacity must be between 0 and 100 percent';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof UpdateGeneralDetailsFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
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
        setHasChanges(false); // Reset changes after successful submission
        enqueueSnackbar(response.data.message || 'General details updated successfully!', { variant: 'success' });
        
        if (onStepSubmitted) {
          onStepSubmitted(0);
        }
      } else {
        throw new Error(response.data.message || 'Failed to update general details');
      }
    } catch (error: any) {
      console.error('Error updating general details:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update general details';
      setSubmitError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <form onSubmit={handleSubmit}>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSubmitError(null)}>
            {submitError}
          </Alert>
        )}

        <CardContainer>
          {/* Card 1: Basic Property Information */}
          <StyledCard>
            <CardTitle variant="h6">Basic Property Information</CardTitle>
            <FormRow>
              <FormField>
                <TextField
                  fullWidth
                  label="Building Name"
                  value={formData.building_name}
                  onChange={(e) => handleInputChange('building_name', e.target.value)}
                  error={!!fieldErrors.building_name}
                  helperText={fieldErrors.building_name}
                  required
                />
              </FormField>
              <FormField>
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
              </FormField>
            </FormRow>
            <FormRow>
              <FormField>
                <TextField
                  fullWidth
                  label="Property Sub Type"
                  value={formData.property_sub_type}
                  onChange={(e) => handleInputChange('property_sub_type', e.target.value)}
                  placeholder="e.g., Grade A Office, Prime Retail"
                />
              </FormField>
              <FormField>
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
              </FormField>
            </FormRow>
          </StyledCard>

          {/* Card 2: Location Details */}
          <StyledCard>
            <CardTitle variant="h6">Location Details</CardTitle>
            <FormRow>
              <FormField style={{ flex: '2' }}>
                <TextField
                  fullWidth
                  label="Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  error={!!fieldErrors.address}
                  helperText={fieldErrors.address}
                  required
                  multiline
                  rows={2}
                />
              </FormField>
            </FormRow>
            <FormRow>
              <FormField>
                <TextField
                  fullWidth
                  label="Town/City"
                  value={formData.town_city}
                  onChange={(e) => handleInputChange('town_city', e.target.value)}
                  error={!!fieldErrors.town_city}
                  helperText={fieldErrors.town_city}
                  required
                />
              </FormField>
              <FormField>
                <TextField
                  fullWidth
                  label="Postcode"
                  value={formData.postcode}
                  onChange={(e) => handleInputChange('postcode', e.target.value)}
                  error={!!fieldErrors.postcode}
                  helperText={fieldErrors.postcode}
                  required
                />
              </FormField>
            </FormRow>
            <FormRow>
              <FormField>
                <TextField
                  fullWidth
                  label="Country/Region"
                  value={formData.country_region}
                  disabled
                />
              </FormField>
            </FormRow>
          </StyledCard>

          {/* Card 3: Property Specifications */}
          <StyledCard>
            <CardTitle variant="h6">Property Specifications</CardTitle>
            <FormRow>
              <FormField>
                <TextField
                  fullWidth
                  label="Size Minimum (sq ft)"
                  type="number"
                  value={formData.size_minimum}
                  onChange={(e) => handleInputChange('size_minimum', parseFloat(e.target.value) || 0)}
                  error={!!fieldErrors.size_minimum}
                  helperText={fieldErrors.size_minimum}
                  inputProps={{ min: 0 }}
                />
              </FormField>
              <FormField>
                <TextField
                  fullWidth
                  label="Size Maximum (sq ft)"
                  type="number"
                  value={formData.size_maximum}
                  onChange={(e) => handleInputChange('size_maximum', parseFloat(e.target.value) || 0)}
                  error={!!fieldErrors.size_maximum}
                  helperText={fieldErrors.size_maximum}
                  inputProps={{ min: 0 }}
                />
              </FormField>
            </FormRow>
            <FormRow>
              <FormField>
                <TextField
                  fullWidth
                  label="Max Eaves Height (m)"
                  type="number"
                  value={formData.max_eaves_height}
                  onChange={(e) => handleInputChange('max_eaves_height', parseFloat(e.target.value) || 0)}
                  error={!!fieldErrors.max_eaves_height}
                  helperText={fieldErrors.max_eaves_height}
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </FormField>
              <FormField>
                <TextField
                  fullWidth
                  label="Approximate Year of Construction"
                  type="number"
                  value={formData.approximate_year_of_construction}
                  onChange={(e) => handleInputChange('approximate_year_of_construction', parseInt(e.target.value) || 0)}
                  error={!!fieldErrors.approximate_year_of_construction}
                  helperText={fieldErrors.approximate_year_of_construction}
                  inputProps={{ min: 1800, max: new Date().getFullYear() }}
                />
              </FormField>
            </FormRow>
            <FormRow>
              <FormField>
                <TextField
                  fullWidth
                  label="Expansion Capacity (%)"
                  type="number"
                  value={formData.expansion_capacity_percent}
                  onChange={(e) => handleInputChange('expansion_capacity_percent', parseFloat(e.target.value) || 0)}
                  error={!!fieldErrors.expansion_capacity_percent}
                  helperText={fieldErrors.expansion_capacity_percent}
                  inputProps={{ min: 0, max: 100, step: 0.1 }}
                />
              </FormField>
            </FormRow>
            <FormRow>
              <FormField>
                <TextField
                  fullWidth
                  label="Invoice Details"
                  value={formData.invoice_details}
                  onChange={(e) => handleInputChange('invoice_details', e.target.value)}
                  multiline
                  rows={3}
                  placeholder="Any specific invoice or billing details"
                />
              </FormField>
              <FormField>
                <TextField
                  fullWidth
                  label="Property Notes"
                  value={formData.property_notes}
                  onChange={(e) => handleInputChange('property_notes', e.target.value)}
                  multiline
                  rows={3}
                  placeholder="Additional notes about the property"
                />
              </FormField>
            </FormRow>
          </StyledCard>
        </CardContainer>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
            disabled={isSubmitting || !hasChanges}
            sx={{
              minWidth: 200,
              backgroundColor: hasChanges ? '#dc2626' : '#9ca3af',
              '&:hover': {
                backgroundColor: hasChanges ? '#b91c1c' : '#9ca3af',
              },
            }}
          >
            {isSubmitting ? 'Updating...' : hasChanges ? 'Update General Details' : 'No Changes Made'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default UpdateGeneralDetailsForm;
