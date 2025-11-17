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
// Removed Grid in favor of responsive CSS grid via Box
import { LocationOn, MyLocation, Map, Save } from '@mui/icons-material';
import axiosInstance from '../../../../utils/axios';
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
  _id?: string;
  coordinates: {
    latitude?: number;
    longitude?: number;
  };
  address_details: {
    street_number?: string;
    route?: string;
    locality?: string;
    administrative_area_level_1?: string;
    administrative_area_level_2?: string;
    postal_code?: string;
    country?: string;
    formatted_address?: string;
  };
  geocoding_info: {
    place_id?: string;
    geocoding_service?: string;
    geocoding_accuracy?: string;
  };
  location_verified?: boolean;
  map_settings: {
    disable_map_display?: boolean;
    map_zoom_level?: number;
    map_type?: string;
  };
  verification_notes?: string;
}

interface UpdateLocationDetailsFormProps {
  onStepSubmitted?: (step: number) => void;
  initialData?: UpdateLocationDetailsFormData;
  onDataChange?: (data: UpdateLocationDetailsFormData) => void;
  propertyId?: string;
  fetchProperty?: () => void;
}

const UpdateLocationDetailsForm: React.FC<UpdateLocationDetailsFormProps> = ({ 
  onStepSubmitted, 
  initialData, 
  onDataChange,
  propertyId,
  fetchProperty
}) => {
  const [formData, setFormData] = useState<UpdateLocationDetailsFormData>({
    coordinates: {
      latitude: initialData?.coordinates?.latitude || 0,
      longitude: initialData?.coordinates?.longitude || 0,
    },
    address_details: {
      street_number: initialData?.address_details?.street_number || '',
      route: initialData?.address_details?.route || '',
      locality: initialData?.address_details?.locality || '',
      administrative_area_level_1: initialData?.address_details?.administrative_area_level_1 || '',
      administrative_area_level_2: initialData?.address_details?.administrative_area_level_2 || '',
      postal_code: initialData?.address_details?.postal_code || '',
      country: initialData?.address_details?.country || 'India',
      formatted_address: initialData?.address_details?.formatted_address || '',
    },
    geocoding_info: {
      place_id: initialData?.geocoding_info?.place_id || '',
      geocoding_service: initialData?.geocoding_info?.geocoding_service || 'Google',
      geocoding_accuracy: initialData?.geocoding_info?.geocoding_accuracy || 'ROOFTOP',
    },
    location_verified: initialData?.location_verified || true,
    map_settings: {
      disable_map_display: initialData?.map_settings?.disable_map_display || false,
      map_zoom_level: initialData?.map_settings?.map_zoom_level || 1,
      map_type: initialData?.map_settings?.map_type || 'roadmap',
    },
    verification_notes: initialData?.verification_notes || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Update form data when initialData changes
  React.useEffect(() => {
    if (initialData) {
      setFormData({
        coordinates: {
          latitude: initialData?.coordinates?.latitude || 0,
          longitude: initialData?.coordinates?.longitude || 0,
        },
        address_details: {
          street_number: initialData?.address_details?.street_number || '',
          route: initialData?.address_details?.route || '',
          locality: initialData?.address_details?.locality || '',
          administrative_area_level_1: initialData?.address_details?.administrative_area_level_1 || '',
          administrative_area_level_2: initialData?.address_details?.administrative_area_level_2 || '',
          postal_code: initialData?.address_details?.postal_code || '',
          country: initialData?.address_details?.country || 'India',
          formatted_address: initialData?.address_details?.formatted_address || '',
        },
        geocoding_info: {
          place_id: initialData?.geocoding_info?.place_id || '',
          geocoding_service: initialData?.geocoding_info?.geocoding_service || 'Google',
          geocoding_accuracy: initialData?.geocoding_info?.geocoding_accuracy || 'ROOFTOP',
        },
        location_verified: initialData?.location_verified || true,
        map_settings: {
          disable_map_display: initialData?.map_settings?.disable_map_display || false,
          map_zoom_level: initialData?.map_settings?.map_zoom_level || 1,
          map_type: initialData?.map_settings?.map_type || 'roadmap',
        },
        verification_notes: initialData?.verification_notes || '',
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
        coordinates: {
          latitude: initialData?.coordinates?.latitude || 0,
          longitude: initialData?.coordinates?.longitude || 0,
        },
        address_details: {
          street_number: initialData?.address_details?.street_number || '',
          route: initialData?.address_details?.route || '',
          locality: initialData?.address_details?.locality || '',
          administrative_area_level_1: initialData?.address_details?.administrative_area_level_1 || '',
          administrative_area_level_2: initialData?.address_details?.administrative_area_level_2 || '',
          postal_code: initialData?.address_details?.postal_code || '',
          country: initialData?.address_details?.country || 'India',
          formatted_address: initialData?.address_details?.formatted_address || '',
        },
        geocoding_info: {
          place_id: initialData?.geocoding_info?.place_id || '',
          geocoding_service: initialData?.geocoding_info?.geocoding_service || 'Google',
          geocoding_accuracy: initialData?.geocoding_info?.geocoding_accuracy || 'ROOFTOP',
        },
        location_verified: initialData?.location_verified || true,
        map_settings: {
          disable_map_display: initialData?.map_settings?.disable_map_display || false,
          map_zoom_level: initialData?.map_settings?.map_zoom_level || 1,
          map_type: initialData?.map_settings?.map_type || 'roadmap',
        },
        verification_notes: initialData?.verification_notes || '',
      };

      const hasDataChanged = JSON.stringify(formData) !== JSON.stringify(initialFormData);
      setHasChanges(hasDataChanged);
    }
  }, [formData, initialData]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate required fields - latitude
    if (!formData.coordinates.latitude || formData.coordinates.latitude === 0) {
      errors.latitude = 'Latitude is required';
    } else if (formData.coordinates.latitude < -90 || formData.coordinates.latitude > 90) {
      errors.latitude = 'Latitude must be between -90 and 90';
    }

    // Validate required fields - longitude
    if (!formData.coordinates.longitude || formData.coordinates.longitude === 0) {
      errors.longitude = 'Longitude is required';
    } else if (formData.coordinates.longitude < -180 || formData.coordinates.longitude > 180) {
      errors.longitude = 'Longitude must be between -180 and 180';
    }

    // Validate required fields - postal_code
    if (!formData.address_details.postal_code || formData.address_details.postal_code.trim() === '') {
      errors.postal_code = 'Postal code is required';
    }

    // Validate required fields - formatted_address
    if (!formData.address_details.formatted_address || formData.address_details.formatted_address.trim() === '') {
      errors.formatted_address = 'Formatted address is required';
    }

    // Validate required fields - country
    if (!formData.address_details.country || formData.address_details.country.trim() === '') {
      errors.country = 'Country is required';
    }

    // Validate required fields - route
    if (!formData.address_details.route || formData.address_details.route.trim() === '') {
      errors.route = 'Route is required';
    }

    // Validate required fields - locality
    if (!formData.address_details.locality || formData.address_details.locality.trim() === '') {
      errors.locality = 'Locality is required';
    }

    // Validate required fields - administrative_area_level_1
    if (!formData.address_details.administrative_area_level_1 || formData.address_details.administrative_area_level_1.trim() === '') {
      errors.administrative_area_level_1 = 'Administrative area level 1 is required';
    }

    // Validate required fields - administrative_area_level_2
    if (!formData.address_details.administrative_area_level_2 || formData.address_details.administrative_area_level_2.trim() === '') {
      errors.administrative_area_level_2 = 'Administrative area level 2 is required';
    }

    // Validate required fields - street_number
    if (!formData.address_details.street_number || formData.address_details.street_number.trim() === '') {
      errors.street_number = 'Street number is required';
    }

    // Validate zoom level (only if map display is not disabled)
    if (!formData.map_settings.disable_map_display && 
        formData.map_settings.map_zoom_level !== null && formData.map_settings.map_zoom_level !== undefined && 
        (formData.map_settings.map_zoom_level < 0 || formData.map_settings.map_zoom_level > 20)) {
      errors.zoom_level = 'Zoom level must be between 0 and 20';
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
    // Clear error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAddressChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      address_details: {
        ...prev.address_details,
        [field]: value
      }
    }));
    // Clear error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleGeocodingInfoChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      geocoding_info: {
        ...prev.geocoding_info,
        [field]: value
      }
    }));
  };

  const handleMapSettingsChange = (field: string, value: any) => {
    setFormData(prev => {
      const newMapSettings = {
        ...prev.map_settings,
        [field]: value
      };
      
      // If disable_map_display is enabled, clear map_type and map_zoom_level
      if (field === 'disable_map_display' && value === true) {
        newMapSettings.map_type = '';
        newMapSettings.map_zoom_level = 1;
      }
      
      return {
        ...prev,
        map_settings: newMapSettings
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
      const response = await axiosInstance.patch(`/api/agent/property-location/${initialData?._id}`, formData);
      
      if (response.data.success) {
        setIsSubmitted(true);
        setHasChanges(false); // Reset changes flag after successful update
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

  // Real geocoding function using postcode
const handleGeocode = async () => {
  const postcode = formData.address_details?.postal_code?.trim();
  if (!postcode) {
    setFieldErrors({
      postal_code: 'Please enter a valid postal code before geocoding.',
    });
    enqueueSnackbar("Please enter a valid postal code before geocoding.", { variant: 'error' });
    return;
  }

  setIsGeocoding(true);
  try {
    // Call OpenStreetMap's Nominatim API
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(
        postcode
      )}&format=json&addressdetails=1&limit=1`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      const location = data[0];

      setFormData((prev) => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          latitude: parseFloat(location.lat),
          longitude: parseFloat(location.lon),
        },
      }));
    } else {
      enqueueSnackbar("No results found for the given postal code.", { variant: 'error' });
    }
  } catch (error) {
    console.error("Geocoding failed:", error);
    enqueueSnackbar("Failed to fetch location data. Please try again.", { variant: 'error' });
  } finally {
    setIsGeocoding(false);
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
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <MyLocation color="primary" />
              Coordinates
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Button
                startIcon={<LocationOn />}
                onClick={handleGeocode}
                variant="outlined"
                size="small"
                disabled={isGeocoding}
              >
                {isGeocoding ? 'Geocoding...' : 'Geocode Address'}
              </Button>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2, width: '100%' }}>
              <Box>
                <TextField
                  label="Postal Code"
                  fullWidth
                  required
                  value={formData.address_details.postal_code || ''}
                  onChange={(e) => handleAddressChange('postal_code', e.target.value)}
                  error={!!fieldErrors.postal_code || !!fieldErrors['address_details.postal_code']}
                  helperText={fieldErrors.postal_code || fieldErrors['address_details.postal_code']}
                />
              </Box>

              <Box>
                <TextField
                  label="Latitude"
                  type="number"
                  fullWidth
                  required
                  value={formData.coordinates.latitude || ''}
                  onChange={(e) => handleCoordinatesChange('latitude', parseFloat(e.target.value) || 0)}
                  error={!!fieldErrors.latitude}
                  helperText={fieldErrors.latitude}
                  inputProps={{ min: -90, max: 90, step: 'any' }}
                />
              </Box>

              <Box>
                <TextField
                  label="Longitude"
                  type="number"
                  fullWidth
                  required
                  value={formData.coordinates.longitude || ''}
                  onChange={(e) => handleCoordinatesChange('longitude', parseFloat(e.target.value) || 0)}
                  error={!!fieldErrors.longitude}
                  helperText={fieldErrors.longitude}
                  inputProps={{ min: -180, max: 180, step: 'any' }}
                />
              </Box>

              <Box>
                <FormControl fullWidth>
                  <InputLabel>Geocoding Service</InputLabel>
                  <Select
                    value={formData.geocoding_info.geocoding_service || 'Google'}
                    onChange={(e) => handleGeocodingInfoChange('geocoding_service', e.target.value)}
                    label="Geocoding Service"
                  >
                    {geocodingServices.map((service) => (
                      <MenuItem key={service} value={service}>
                        {service}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <FormControl fullWidth>
                  <InputLabel>Geocoding Accuracy</InputLabel>
                  <Select
                    value={formData.geocoding_info.geocoding_accuracy || 'ROOFTOP'}
                    onChange={(e) => handleGeocodingInfoChange('geocoding_accuracy', e.target.value)}
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
            </Box>
          </CardContent>
        </Card>

        {/* Address Details Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocationOn color="primary" />
              Address Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: '3fr 5fr 4fr' }, gap: 2 }}>
                  <TextField
                    label="Street Number"
                    required
                    value={formData.address_details.street_number || ''}
                    onChange={(e) => handleAddressChange('street_number', e.target.value)}
                    error={!!fieldErrors.street_number}
                    helperText={fieldErrors.street_number}
                    fullWidth
                  />
                  <TextField
                    label="Route"
                    required
                    value={formData.address_details.route || ''}
                    onChange={(e) => handleAddressChange('route', e.target.value)}
                    error={!!fieldErrors.route}
                    helperText={fieldErrors.route}
                    fullWidth
                  />
                  <TextField
                    label="Locality"
                    required
                    value={formData.address_details.locality || ''}
                    onChange={(e) => handleAddressChange('locality', e.target.value)}
                    error={!!fieldErrors.locality}
                    helperText={fieldErrors.locality}
                    fullWidth
                  />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                  <TextField
                    label="Administrative Area Level 1"
                    required
                    value={formData.address_details.administrative_area_level_1 || ''}
                    onChange={(e) => handleAddressChange('administrative_area_level_1', e.target.value)}
                    error={!!fieldErrors.administrative_area_level_1}
                    helperText={fieldErrors.administrative_area_level_1}
                    fullWidth
                  />
                  <TextField
                    label="Administrative Area Level 2"
                    required
                    value={formData.address_details.administrative_area_level_2 || ''}
                    onChange={(e) => handleAddressChange('administrative_area_level_2', e.target.value)}
                    error={!!fieldErrors.administrative_area_level_2}
                    helperText={fieldErrors.administrative_area_level_2}
                    fullWidth
                  />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr' }, gap: 2 }}>
                  <TextField
                    label="Country"
                    required
                    value={formData.address_details.country || ''}
                    onChange={(e) => handleAddressChange('country', e.target.value)}
                    error={!!fieldErrors.country}
                    helperText={fieldErrors.country}
                    fullWidth
                  />
              </Box>

              <TextField
                label="Formatted Address"
                required
                value={formData.address_details.formatted_address || ''}
                onChange={(e) => handleAddressChange('formatted_address', e.target.value)}
                error={!!fieldErrors.formatted_address}
                helperText={fieldErrors.formatted_address}
                fullWidth
                multiline
                rows={2}
                placeholder="Complete formatted address as returned by geocoding service"
              />

              <TextField
                label="Place ID"
                value={formData.geocoding_info.place_id || ''}
                onChange={(e) => handleGeocodingInfoChange('place_id', e.target.value)}
                fullWidth
                placeholder="Unique identifier from geocoding service"
              />
            </Box>
          </CardContent>
        </Card>

        {/* Map Settings Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Map color="primary" />
              Map Settings
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: formData.map_settings.disable_map_display ? '1fr' : 'repeat(2, 1fr)', md: formData.map_settings.disable_map_display ? '1fr' : 'repeat(3, 1fr)' }, gap: 2, width: '100%', alignItems: 'center' }}>
              {/* Only show Map Type and Zoom Level if map display is not disabled */}
              {!formData.map_settings.disable_map_display && (
                <>
                  <Box>
                    <FormControl fullWidth>
                      <InputLabel>Map Type</InputLabel>
                      <Select
                        value={formData.map_settings.map_type || 'roadmap'}
                        onChange={(e) => handleMapSettingsChange('map_type', e.target.value)}
                        label="Map Type"
                      >
                        {mapTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box>
                    <TextField
                      label="Zoom Level"
                      type="number"
                      fullWidth
                      value={formData.map_settings.map_zoom_level || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          handleMapSettingsChange('map_zoom_level', '');
                        } else {
                          const numValue = parseInt(value);
                          if (!isNaN(numValue) && numValue >= 0 && numValue <= 20) {
                            handleMapSettingsChange('map_zoom_level', numValue);
                          }
                        }
                      }}
                      error={!!fieldErrors.zoom_level}
                      helperText={fieldErrors.zoom_level}
                      inputProps={{ min: 0, max: 20 }}
                    />
                  </Box>
                </>
              )}

              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.map_settings.disable_map_display || false}
                      onChange={(e) => handleMapSettingsChange('disable_map_display', e.target.checked)}
                    />
                  }
                  label="Disable Map Display"
                />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Verification Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Verification
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.location_verified || false}
                    onChange={(e) => {
                      const isVerified = e.target.checked;
                      setFormData(prev => ({
                        ...prev,
                        location_verified: isVerified,
                        // Clear verification_notes if location is not verified
                        verification_notes: isVerified ? prev.verification_notes : ''
                      }));
                    }}
                  />
                }
                label="Location Verified"
              />
              
              {/* Only show Verification Notes if location is verified */}
              {formData.location_verified && (
                <TextField
                  label="Verification Notes"
                  value={formData.verification_notes || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, verification_notes: e.target.value }))}
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Additional notes about location verification"
                />
              )}
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: { xs: 'stretch', sm: 'flex-end' } }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
            disabled={isSubmitting || !hasChanges}
            fullWidth
            sx={{
              minWidth: 200,
              backgroundColor: hasChanges ? '#7c3aed' : '#9ca3af',
              '&:hover': {
                backgroundColor: hasChanges ? '#6d28d9' : '#9ca3af',
              },
            }}
          >
            {isSubmitting ? 'Updating...' : hasChanges ? 'Update Location Details' : 'No Changes to Save'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default UpdateLocationDetailsForm;
