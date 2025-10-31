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
import { useFormContext } from 'react-hook-form';
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

interface LocationDetailsFormData {
  coordinates: {
    latitude?: number;
    longitude?: number;
  };
  address_details: {
    formatted_address?: string;
    street_number?: string;
    route?: string;
    locality?: string;
    administrative_area_level_1?: string;
    administrative_area_level_2?: string;
    country?: string;
    postal_code?: string;
  };
  map_settings: {
    disable_map_display?: boolean;
    map_zoom_level?: number;
    map_type?: string;
  };
  geocoding_info: {
    place_id?: string;
    geocoding_service?: string;
    geocoding_accuracy?: string;
    geocoded_at?: string;
  };
  location_verified?: boolean;
  verification_notes?: string;
}

interface LocationDetailsFormProps {
  onStepSubmitted?: (step: number) => void;
}

const LocationDetailsForm: React.FC<LocationDetailsFormProps> = ({ onStepSubmitted }) => {
  const {
    formState: { errors },
    setValue,
  } = useFormContext<LocationDetailsFormData>();

  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<LocationDetailsFormData>({
    coordinates: {
      latitude: undefined,
      longitude: undefined,
    },
    address_details: {
      formatted_address: '',
      street_number: '',
      route: '',
      locality: '',
      administrative_area_level_1: '',
      administrative_area_level_2: '',
      country: '',
      postal_code: '',
    },
    map_settings: {
      disable_map_display: false,
      map_zoom_level: undefined,
      map_type: '',
    },
    geocoding_info: {
      place_id: '',
      geocoding_service: '',
      geocoding_accuracy: '',
      geocoded_at: '',
    },
    location_verified: false,
    verification_notes: '',
  });
  
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

  // Get property ID from localStorage (stored from previous response)
  const getPropertyId = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('propertyId');
    }
    return null;
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

// Real geocoding function using postcode
const handleGeocode = async () => {
  const postcode = formData.address_details?.postal_code?.trim();
  if (!postcode) {
    setFieldErrors({
      'address_details.postal_code': 'Please enter a valid postal code before geocoding.',
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
      alert("No results found for the given postal code.");
    }
  } catch (error) {
    console.error("Geocoding failed:", error);
    alert("Failed to fetch location data. Please try again.");
  } finally {
    setIsGeocoding(false);
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
      let response = await axiosInstance.put(`/api/user/properties/${propertyId}/location`, formData);
      
      console.log(response.data.data._id);
      
      enqueueSnackbar(response.data.message, { variant: 'success' });
      
      setSaveSuccess(true);
      setIsSubmitted(true);
      setTimeout(() => setSaveSuccess(false), 3000); // Hide success message after 3 seconds
      
      // Notify parent component that step 3 has been successfully submitted
      if (onStepSubmitted) {
        onStepSubmitted(3);
      }
    } catch (error: any) {
      console.error('Error saving location details:', error);
      
      // Handle field-specific validation errors
      if (error.errors && Array.isArray(error.errors)) {
        const fieldErrorMap: Record<string, string> = {};
        
        console.log('Processing validation errors:', error.errors);
        
        error.errors.forEach((err: any) => {
          console.log('Processing error:', err);
          if (err.path) {
            // Convert backend path format to frontend format
            // Backend: "coordinates.latitude" -> Frontend: "coordinates.latitude"
            // Backend: "address_details[0].street_number" -> Frontend: "address_details.0.street_number"
            let fieldPath = err.path.replace(/\[(\d+)\]/g, '.$1');
            
            console.log('Field path mapped:', fieldPath, 'from path:', err.path);
            fieldErrorMap[fieldPath] = err.msg;
          }
        });
        
        console.log('Field error map created:', fieldErrorMap);
        setFieldErrors(fieldErrorMap);
        
        // Show general error message
        const errorMessage = error.message || 'Please fix the validation errors below.';
        setSaveError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: 'error' });
      } else {
        // Handle general errors
        const errorMessage = error.message || 'Failed to save location details. Please try again.';
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
        Location Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide precise location coordinates and detailed address information.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Coordinates Section */}
        <Box>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Coordinates
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
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
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Enter precise latitude and longitude coordinates for the property.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                      label="Postal Code"
                      fullWidth
                      value={formData.address_details?.postal_code || ''}
                      error={!!getFieldError('address_details.postal_code')}
                      helperText={getFieldError('address_details.postal_code')}
                      placeholder="e.g., SW1A 1AA"
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          address_details: {
                            ...prev.address_details,
                            postal_code: e.target.value
                          }
                        }));
                        clearFieldError('address_details.postal_code');
                      }}
                  />
                </Box>

                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    label="Latitude"
                    type="number"
                    fullWidth
                    value={formData.coordinates?.latitude || ''}
                    error={!!getFieldError('coordinates.latitude')}
                    helperText={getFieldError('coordinates.latitude')}
                    placeholder="e.g., 51.5074"
                    inputProps={{ step: 0.000001, min: -90, max: 90 }}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        coordinates: {
                          ...prev.coordinates,
                          latitude: parseFloat(e.target.value) || undefined
                        }
                      }));
                      clearFieldError('coordinates.latitude');
                    }}
                  />
                </Box>

                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    label="Longitude"
                    type="number"
                    fullWidth
                    value={formData.coordinates?.longitude || ''}
                    error={!!getFieldError('coordinates.longitude')}
                    helperText={getFieldError('coordinates.longitude')}
                    placeholder="e.g., -0.1278"
                    inputProps={{ step: 0.000001, min: -180, max: 180 }}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        coordinates: {
                          ...prev.coordinates,
                          longitude: parseFloat(e.target.value) || undefined
                        }
                      }));
                      clearFieldError('coordinates.longitude');
                    }}
                  />
                </Box>          
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Address Details Section */}
        <Box>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Address Details
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Detailed address information for the property.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <TextField
                    label="Formatted Address"
                    fullWidth
                    multiline
                    rows={2}
                    value={formData.address_details?.formatted_address || ''}
                    error={!!getFieldError('address_details.formatted_address')}
                    helperText={getFieldError('address_details.formatted_address')}
                    placeholder="Enter the complete formatted address"
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        address_details: {
                          ...prev.address_details,
                          formatted_address: e.target.value
                        }
                      }));
                      clearFieldError('address_details.formatted_address');
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                    <TextField
                      label="Street Number"
                      fullWidth
                      value={formData.address_details?.street_number || ''}
                      error={!!getFieldError('address_details.street_number')}
                      helperText={getFieldError('address_details.street_number')}
                      placeholder="e.g., 123"
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          address_details: {
                            ...prev.address_details,
                            street_number: e.target.value
                          }
                        }));
                        clearFieldError('address_details.street_number');
                      }}
                    />
                  </Box>

                  <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                    <TextField
                      label="Route/Street Name"
                      fullWidth
                      value={formData.address_details?.route || ''}
                      error={!!getFieldError('address_details.route')}
                      helperText={getFieldError('address_details.route')}
                      placeholder="e.g., Oxford Street"
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          address_details: {
                            ...prev.address_details,
                            route: e.target.value
                          }
                        }));
                        clearFieldError('address_details.route');
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                    <TextField
                      label="Locality"
                      fullWidth
                      value={formData.address_details?.locality || ''}
                      error={!!getFieldError('address_details.locality')}
                      helperText={getFieldError('address_details.locality')}
                      placeholder="e.g., Westminster"
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          address_details: {
                            ...prev.address_details,
                            locality: e.target.value
                          }
                        }));
                        clearFieldError('address_details.locality');
                      }}
                    />
                  </Box>

                  <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                    <TextField
                      label="Administrative Area Level 1"
                      fullWidth
                      value={formData.address_details?.administrative_area_level_1 || ''}
                      error={!!getFieldError('address_details.administrative_area_level_1')}
                      helperText={getFieldError('address_details.administrative_area_level_1')}
                      placeholder="e.g., England"
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          address_details: {
                            ...prev.address_details,
                            administrative_area_level_1: e.target.value
                          }
                        }));
                        clearFieldError('address_details.administrative_area_level_1');
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                    <TextField
                      label="Administrative Area Level 2"
                      fullWidth
                      value={formData.address_details?.administrative_area_level_2 || ''}
                      error={!!getFieldError('address_details.administrative_area_level_2')}
                      helperText={getFieldError('address_details.administrative_area_level_2')}
                      placeholder="e.g., Greater London"
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          address_details: {
                            ...prev.address_details,
                            administrative_area_level_2: e.target.value
                          }
                        }));
                        clearFieldError('address_details.administrative_area_level_2');
                      }}
                    />
                  </Box>

                  <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                    <TextField
                      label="Country"
                      fullWidth
                      value={formData.address_details?.country || ''}
                      error={!!getFieldError('address_details.country')}
                      helperText={getFieldError('address_details.country')}
                      placeholder="e.g., United Kingdom"
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          address_details: {
                            ...prev.address_details,
                            country: e.target.value
                          }
                        }));
                        clearFieldError('address_details.country');
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Map Settings Section */}
        <Box>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Map Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configure how the property location is displayed on maps.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.map_settings?.disable_map_display || false}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              map_settings: {
                                ...prev.map_settings,
                                disable_map_display: e.target.checked
                              }
                            }));
                          }}
                        />
                      }
                      label="Disable Map Display"
                    />
                  </Box>

                  <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                    <TextField
                      label="Map Zoom Level"
                      type="number"
                      fullWidth
                      value={formData.map_settings?.map_zoom_level || ''}
                      error={!!getFieldError('map_settings.map_zoom_level')}
                      helperText={getFieldError('map_settings.map_zoom_level')}
                      placeholder="1-20"
                      inputProps={{ min: 1, max: 20 }}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          map_settings: {
                            ...prev.map_settings,
                            map_zoom_level: parseInt(e.target.value) || undefined
                          }
                        }));
                        clearFieldError('map_settings.map_zoom_level');
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                    <FormControl fullWidth error={!!getFieldError('map_settings.map_type')}>
                      <InputLabel>Map Type</InputLabel>
                      <Select
                        value={formData.map_settings?.map_type || ''}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            map_settings: {
                              ...prev.map_settings,
                              map_type: e.target.value
                            }
                          }));
                          clearFieldError('map_settings.map_type');
                        }}
                        label="Map Type"
                      >
                        {mapTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                      {getFieldError('map_settings.map_type') && (
                        <FormHelperText>{getFieldError('map_settings.map_type')}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Geocoding Information Section */}
        <Box>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Geocoding Information
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Information about how the location was geocoded.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                    <TextField
                      label="Place ID"
                      fullWidth
                      value={formData.geocoding_info?.place_id || ''}
                      error={!!getFieldError('geocoding_info.place_id')}
                      helperText={getFieldError('geocoding_info.place_id')}
                      placeholder="Enter place ID from geocoding service"
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          geocoding_info: {
                            ...prev.geocoding_info,
                            place_id: e.target.value
                          }
                        }));
                        clearFieldError('geocoding_info.place_id');
                      }}
                    />
                  </Box>

                  <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                    <FormControl fullWidth error={!!getFieldError('geocoding_info.geocoding_service')}>
                      <InputLabel>Geocoding Service</InputLabel>
                      <Select
                        value={formData.geocoding_info?.geocoding_service || ''}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            geocoding_info: {
                              ...prev.geocoding_info,
                              geocoding_service: e.target.value
                            }
                          }));
                          clearFieldError('geocoding_info.geocoding_service');
                        }}
                        label="Geocoding Service"
                      >
                        {geocodingServices.map((service) => (
                          <MenuItem key={service} value={service}>
                            {service}
                          </MenuItem>
                        ))}
                      </Select>
                      {getFieldError('geocoding_info.geocoding_service') && (
                        <FormHelperText>{getFieldError('geocoding_info.geocoding_service')}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                    <FormControl fullWidth error={!!getFieldError('geocoding_info.geocoding_accuracy')}>
                      <InputLabel>Geocoding Accuracy</InputLabel>
                      <Select
                        value={formData.geocoding_info?.geocoding_accuracy || ''}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            geocoding_info: {
                              ...prev.geocoding_info,
                              geocoding_accuracy: e.target.value
                            }
                          }));
                          clearFieldError('geocoding_info.geocoding_accuracy');
                        }}
                        label="Geocoding Accuracy"
                      >
                        {geocodingAccuracies.map((accuracy) => (
                          <MenuItem key={accuracy} value={accuracy}>
                            {accuracy.replace('_', ' ')}
                          </MenuItem>
                        ))}
                      </Select>
                      {getFieldError('geocoding_info.geocoding_accuracy') && (
                        <FormHelperText>{getFieldError('geocoding_info.geocoding_accuracy')}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>

                  <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                    <TextField
                      label="Geocoded At"
                      type="datetime-local"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={formData.geocoding_info?.geocoded_at || ''}
                      error={!!getFieldError('geocoding_info.geocoded_at')}
                      helperText={getFieldError('geocoding_info.geocoded_at')}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          geocoding_info: {
                            ...prev.geocoding_info,
                            geocoded_at: e.target.value
                          }
                        }));
                        clearFieldError('geocoding_info.geocoded_at');
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.location_verified || false}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              location_verified: e.target.checked
                            }));
                          }}
                        />
                      }
                      label="Location Verified"
                    />
                  </Box>
                </Box>

                <Box>
                  <TextField
                    label="Verification Notes"
                    fullWidth
                    multiline
                    rows={2}
                    value={formData.verification_notes || ''}
                    error={!!getFieldError('verification_notes')}
                    helperText={getFieldError('verification_notes')}
                    placeholder="Enter any notes about location verification"
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        verification_notes: e.target.value
                      }));
                      clearFieldError('verification_notes');
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
            Location details saved successfully!
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
              backgroundColor: '#dc2626',
              '&:hover': {
                backgroundColor: '#b91c1c',
              },
            }}
          >
            {isSaving ? 'Saving...' : isSubmitted ? 'Location Details Saved' : 'Save Location Details'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LocationDetailsForm;
