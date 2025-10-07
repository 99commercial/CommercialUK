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
  Card,
  CardContent,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { LocationOn, MyLocation, Map, Save } from '@mui/icons-material';
import axiosInstance from '../../../utils/axios';
import { enqueueSnackbar } from 'notistack';

const mapTypes = [
  'roadmap',
  'satellite',
  'hybrid',
  'terrain',
];

const geocodingServices = [
  'Google',
  'OpenStreetMap',
  'Bing',
  'Manual',
];

const geocodingAccuracies = [
  'ROOFTOP',
  'RANGE_INTERPOLATED',
  'GEOMETRIC_CENTER',
  'APPROXIMATE',
];

interface UpdateLocationDetailsFormData {
  coordinates: {
    latitude?: number;
    longitude?: number;
    accuracy?: number;
    geocoding_service?: string;
    geocoding_accuracy?: string;
    last_updated?: string;
  };
  address_details: {
    street_address?: string;
    city?: string;
    state_province?: string;
    postal_code?: string;
    country?: string;
    formatted_address?: string;
    place_id?: string;
    map_type?: string;
    zoom_level?: number;
    is_verified?: boolean;
  };
}

interface UpdateLocationDetailsFormProps {
  onStepSubmitted?: (step: number) => void;
  initialData?: UpdateLocationDetailsFormData;
  onDataChange?: (data: UpdateLocationDetailsFormData) => void;
  propertyId?: string;
}

const UpdateLocationDetailsForm: React.FC<UpdateLocationDetailsFormProps> = ({ 
  onStepSubmitted, 
  initialData, 
  onDataChange,
  propertyId 
}) => {
  const [formData, setFormData] = useState<UpdateLocationDetailsFormData>(initialData || {
    coordinates: {
      latitude: 0,
      longitude: 0,
      accuracy: 0,
      geocoding_service: 'Google',
      geocoding_accuracy: 'ROOFTOP',
      last_updated: '',
    },
    address_details: {
      street_address: '',
      city: '',
      state_province: '',
      postal_code: '',
      country: 'United Kingdom',
      formatted_address: '',
      place_id: '',
      map_type: 'roadmap',
      zoom_level: 15,
      is_verified: false,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Update form data when initialData changes
  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setIsSubmitted(true); // Mark as submitted since we're editing existing data
    }
  }, [initialData]);

  // Notify parent component of data changes
  React.useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate coordinates
    if (formData.coordinates.latitude && 
        (formData.coordinates.latitude < -90 || formData.coordinates.latitude > 90)) {
      errors.latitude = 'Latitude must be between -90 and 90';
    }

    if (formData.coordinates.longitude && 
        (formData.coordinates.longitude < -180 || formData.coordinates.longitude > 180)) {
      errors.longitude = 'Longitude must be between -180 and 180';
    }

    // Validate zoom level
    if (formData.address_details.zoom_level && 
        (formData.address_details.zoom_level < 1 || formData.address_details.zoom_level > 20)) {
      errors.zoom_level = 'Zoom level must be between 1 and 20';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCoordinatesChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [field]: value
      }
    }));
  };

  const handleAddressChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      address_details: {
        ...prev.address_details,
        [field]: value
      }
    }));
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
      const response = await axiosInstance.patch(`/agent/properties/${propertyId}/location`, formData);
      
      if (response.data.success) {
        setIsSubmitted(true);
        enqueueSnackbar('Location details updated successfully!', { variant: 'success' });
        
        if (onStepSubmitted) {
          onStepSubmitted(3);
        }
      } else {
        throw new Error(response.data.message || 'Failed to update location details');
      }
    } catch (error: any) {
      console.error('Error updating location details:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update location details';
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

        {/* Coordinates Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MyLocation color="primary" />
              Coordinates
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Latitude"
                type="number"
                value={formData.coordinates.latitude || ''}
                onChange={(e) => handleCoordinatesChange('latitude', parseFloat(e.target.value) || 0)}
                error={!!fieldErrors.latitude}
                helperText={fieldErrors.latitude}
                inputProps={{ min: -90, max: 90, step: 0.000001 }}
                sx={{ minWidth: 150 }}
              />

              <TextField
                label="Longitude"
                type="number"
                value={formData.coordinates.longitude || ''}
                onChange={(e) => handleCoordinatesChange('longitude', parseFloat(e.target.value) || 0)}
                error={!!fieldErrors.longitude}
                helperText={fieldErrors.longitude}
                inputProps={{ min: -180, max: 180, step: 0.000001 }}
                sx={{ minWidth: 150 }}
              />

              <TextField
                label="Accuracy (meters)"
                type="number"
                value={formData.coordinates.accuracy || ''}
                onChange={(e) => handleCoordinatesChange('accuracy', parseFloat(e.target.value) || 0)}
                inputProps={{ min: 0 }}
                sx={{ minWidth: 150 }}
              />

              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Geocoding Service</InputLabel>
                <Select
                  value={formData.coordinates.geocoding_service || 'Google'}
                  onChange={(e) => handleCoordinatesChange('geocoding_service', e.target.value)}
                  label="Geocoding Service"
                >
                  {geocodingServices.map((service) => (
                    <MenuItem key={service} value={service}>
                      {service}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 180 }}>
                <InputLabel>Geocoding Accuracy</InputLabel>
                <Select
                  value={formData.coordinates.geocoding_accuracy || 'ROOFTOP'}
                  onChange={(e) => handleCoordinatesChange('geocoding_accuracy', e.target.value)}
                  label="Geocoding Accuracy"
                >
                  {geocodingAccuracies.map((accuracy) => (
                    <MenuItem key={accuracy} value={accuracy}>
                      {accuracy}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        {/* Address Details Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn color="primary" />
              Address Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Street Address"
                value={formData.address_details.street_address || ''}
                onChange={(e) => handleAddressChange('street_address', e.target.value)}
                fullWidth
                multiline
                rows={2}
              />

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  label="City"
                  value={formData.address_details.city || ''}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  sx={{ minWidth: 200 }}
                />

                <TextField
                  label="State/Province"
                  value={formData.address_details.state_province || ''}
                  onChange={(e) => handleAddressChange('state_province', e.target.value)}
                  sx={{ minWidth: 200 }}
                />

                <TextField
                  label="Postal Code"
                  value={formData.address_details.postal_code || ''}
                  onChange={(e) => handleAddressChange('postal_code', e.target.value)}
                  sx={{ minWidth: 150 }}
                />

                <TextField
                  label="Country"
                  value={formData.address_details.country || ''}
                  onChange={(e) => handleAddressChange('country', e.target.value)}
                  sx={{ minWidth: 200 }}
                />
              </Box>

              <TextField
                label="Formatted Address"
                value={formData.address_details.formatted_address || ''}
                onChange={(e) => handleAddressChange('formatted_address', e.target.value)}
                fullWidth
                multiline
                rows={2}
                placeholder="Complete formatted address as returned by geocoding service"
              />

              <TextField
                label="Place ID"
                value={formData.address_details.place_id || ''}
                onChange={(e) => handleAddressChange('place_id', e.target.value)}
                fullWidth
                placeholder="Unique identifier from geocoding service"
              />
            </Box>
          </CardContent>
        </Card>

        {/* Map Settings Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Map color="primary" />
              Map Settings
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Map Type</InputLabel>
                <Select
                  value={formData.address_details.map_type || 'roadmap'}
                  onChange={(e) => handleAddressChange('map_type', e.target.value)}
                  label="Map Type"
                >
                  {mapTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Zoom Level"
                type="number"
                value={formData.address_details.zoom_level || ''}
                onChange={(e) => handleAddressChange('zoom_level', parseInt(e.target.value) || 15)}
                error={!!fieldErrors.zoom_level}
                helperText={fieldErrors.zoom_level}
                inputProps={{ min: 1, max: 20 }}
                sx={{ minWidth: 120 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.address_details.is_verified || false}
                    onChange={(e) => handleAddressChange('is_verified', e.target.checked)}
                  />
                }
                label="Address Verified"
              />
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
            disabled={isSubmitting || isSubmitted}
            sx={{
              minWidth: 200,
              backgroundColor: '#7c3aed',
              '&:hover': {
                backgroundColor: '#6d28d9',
              },
            }}
          >
            {isSubmitting ? 'Updating...' : isSubmitted ? 'Location Details Updated' : 'Update Location Details'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default UpdateLocationDetailsForm;
