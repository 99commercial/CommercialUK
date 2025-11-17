import React, { useState, useEffect, useMemo } from 'react';
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
  propertyData?: any;
  hasExistingData?: boolean;
  fetchPropertyData?: () => void;
}

const LocationDetailsForm: React.FC<LocationDetailsFormProps> = ({ onStepSubmitted, propertyData, hasExistingData, fetchPropertyData }) => {
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
  const [originalData, setOriginalData] = useState<LocationDetailsFormData | null>(null);
  const lastPropertyIdRef = React.useRef<string | null>(null);
  const hasInitializedRef = React.useRef<boolean>(false);
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

  // Initialize form data from propertyData.location_id
  useEffect(() => {
    const currentPropertyId = propertyData?._id || null;
    
    if (propertyData?.location_id) {
      const locationData = propertyData.location_id;
      
      // Only update if:
      // 1. We haven't initialized yet OR the property ID has changed to a different property
      const shouldInitialize = !hasInitializedRef.current || 
        (currentPropertyId !== null && lastPropertyIdRef.current !== currentPropertyId);
      
      if (shouldInitialize) {
        const initializedData: LocationDetailsFormData = {
          coordinates: locationData.coordinates || {
            latitude: undefined,
            longitude: undefined,
          },
          address_details: locationData.address_details || {
            formatted_address: '',
            street_number: '',
            route: '',
            locality: '',
            administrative_area_level_1: '',
            administrative_area_level_2: '',
            country: '',
            postal_code: '',
          },
          map_settings: locationData.map_settings || {
            disable_map_display: false,
            map_zoom_level: undefined,
            map_type: '',
          },
          geocoding_info: locationData.geocoding_info || {
            place_id: '',
            geocoding_service: '',
            geocoding_accuracy: '',
            geocoded_at: '',
          },
          location_verified: locationData.location_verified || false,
          verification_notes: locationData.verification_notes || '',
        };
        
        setFormData(initializedData);
        setOriginalData({ ...initializedData });
        lastPropertyIdRef.current = currentPropertyId;
        hasInitializedRef.current = true;
      }
    }
  }, [propertyData?.location_id, propertyData?._id]);
  
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
    if (typeof value === 'boolean') {
      return value;
    }
    return value;
  };

  // Check if form data has changed from original
  const hasChanges = useMemo(() => {
    if (!hasExistingData || !propertyData?.location_id || !originalData) {
      return false;
    }

    const locationData = propertyData.location_id;

    // Compare coordinates
    const currentLat = normalizeValue(formData.coordinates?.latitude);
    const originalLat = normalizeValue(locationData.coordinates?.latitude);
    const currentLng = normalizeValue(formData.coordinates?.longitude);
    const originalLng = normalizeValue(locationData.coordinates?.longitude);
    const coordinatesChanged = currentLat !== originalLat || currentLng !== originalLng;

    // Compare address_details
    const addressFields = [
      'formatted_address',
      'street_number',
      'route',
      'locality',
      'administrative_area_level_1',
      'administrative_area_level_2',
      'country',
      'postal_code',
    ];
    const addressChanged = addressFields.some(field => {
      const current = normalizeValue(formData.address_details?.[field as keyof typeof formData.address_details]);
      const original = normalizeValue(locationData.address_details?.[field as keyof typeof locationData.address_details]);
      return current !== original;
    });

    // Compare map_settings
    const mapSettingsChanged = 
      normalizeValue(formData.map_settings?.disable_map_display) !== normalizeValue(locationData.map_settings?.disable_map_display) ||
      normalizeValue(formData.map_settings?.map_zoom_level) !== normalizeValue(locationData.map_settings?.map_zoom_level) ||
      normalizeValue(formData.map_settings?.map_type) !== normalizeValue(locationData.map_settings?.map_type);

    // Compare geocoding_info
    const geocodingFields = ['place_id', 'geocoding_service', 'geocoding_accuracy', 'geocoded_at'];
    const geocodingChanged = geocodingFields.some(field => {
      const current = normalizeValue(formData.geocoding_info?.[field as keyof typeof formData.geocoding_info]);
      const original = normalizeValue(locationData.geocoding_info?.[field as keyof typeof locationData.geocoding_info]);
      return current !== original;
    });

    // Compare location_verified and verification_notes
    const verificationChanged = 
      normalizeValue(formData.location_verified) !== normalizeValue(locationData.location_verified) ||
      normalizeValue(formData.verification_notes) !== normalizeValue(locationData.verification_notes);

    return coordinatesChanged || addressChanged || mapSettingsChanged || geocodingChanged || verificationChanged;
  }, [
    formData,
    propertyData?.location_id,
    hasExistingData,
    originalData
  ]);

  // Check if location data exists
  const hasLocationData = useMemo(() => {
    return !!(propertyData?.location_id?._id);
  }, [propertyData?.location_id?._id]);

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

  // Helper function to clean data before sending
  const cleanLocationData = (data: LocationDetailsFormData) => {
    const cleanedData = JSON.parse(JSON.stringify(data)); // Deep clone
    
    // Clean map_settings
    if (cleanedData.map_settings) {
      // Remove empty strings from map_settings.map_type
      if (cleanedData.map_settings.map_type === '' || cleanedData.map_settings.map_type === undefined) {
        delete cleanedData.map_settings.map_type;
      }
      
      // If map is disabled, don't send map_zoom_level and map_type
      if (cleanedData.map_settings.disable_map_display) {
        delete cleanedData.map_settings.map_zoom_level;
        delete cleanedData.map_settings.map_type;
      }
    }
    
    // Clean geocoding_info enum fields
    if (cleanedData.geocoding_info) {
      if (cleanedData.geocoding_info.geocoding_service === '' || cleanedData.geocoding_info.geocoding_service === undefined) {
        delete cleanedData.geocoding_info.geocoding_service;
      }
      
      if (cleanedData.geocoding_info.geocoding_accuracy === '' || cleanedData.geocoding_info.geocoding_accuracy === undefined) {
        delete cleanedData.geocoding_info.geocoding_accuracy;
      }
      
      // Remove empty strings from optional fields
      if (cleanedData.geocoding_info.place_id === '') {
        delete cleanedData.geocoding_info.place_id;
      }
      
      if (cleanedData.geocoding_info.geocoded_at === '') {
        delete cleanedData.geocoding_info.geocoded_at;
      }
    }
    
    // Remove verification_notes if empty
    if (cleanedData.verification_notes === '') {
      delete cleanedData.verification_notes;
    }
    
    return cleanedData;
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
        const cleanedData = cleanLocationData(formData);
        
        let response = await axiosInstance.put(`/api/user/properties/${propertyId}/location`, cleanedData);
        
        console.log(response.data.data._id);
        
        enqueueSnackbar(response.data.message, { variant: 'success' });
        
        setSaveSuccess(true);
        setIsSubmitted(true);
        
        // Update original data after successful save
        setOriginalData({ ...formData });
        
        setTimeout(() => setSaveSuccess(false), 3000); // Hide success message after 3 seconds
        
        // Notify parent component that step 3 has been successfully submitted

        fetchPropertyData?.();
        if (onStepSubmitted) {
          onStepSubmitted(3);
        }
      } catch (error: any) {
        console.error('Error saving location details:', error);
        
        // Handle field-specific validation errors
        if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
          const fieldErrorMap: Record<string, string> = {};
          
          error.errors.forEach((err: any) => {
            if (err.path) {
              let fieldPath = err.path.replace(/\[(\d+)\]/g, '.$1');
              fieldErrorMap[fieldPath] = err.msg;
            }
          });
          
          setFieldErrors(fieldErrorMap);
          
          const errorMessage =  'Please fix the validation errors below.';
          setSaveError(errorMessage);
          enqueueSnackbar(errorMessage, { variant: 'error' });
        } else {
          const errorMessage = error.response?.data?.message || error.message || 'Failed to save location details. Please try again.';
          setSaveError(errorMessage);
          enqueueSnackbar(errorMessage, { variant: 'error' });
        }
      } finally {
        setIsSaving(false);
      }
  };

  const handleUpdateLocation = async () => {
    const locationId = propertyData?.location_id?._id;
    
    if (!locationId) {
      setSaveError('Location ID not found. Please save location details first.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    setFieldErrors({});

    try {
      const cleanedData = cleanLocationData(formData);
      
      // Use PATCH endpoint for updating location
      const response = await axiosInstance.patch(
        `/api/user/property-location/${locationId}`,
        cleanedData
      );
      
      enqueueSnackbar(response.data.message || 'Location details updated successfully!', { variant: 'success' });
      
      // Update original data after successful update
      setOriginalData({ ...formData });
      
      setSaveSuccess(true);
      setIsSubmitted(false); // Allow multiple updates
      
      // Refresh property data if callback is provided
      if (fetchPropertyData) {
        fetchPropertyData();
      }
      
      setTimeout(() => setSaveSuccess(false), 3000);

      fetchPropertyData();
      
    } catch (error: any) {
      console.error('Error updating location details:', error);
      
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
        const errorMessage = error.response?.data?.message || error.message || 'Failed to update location details. Please try again.';
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
                    required
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
                    required
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
                    required
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
                      required
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
                      required
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
                      required
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
                      required
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
                      required
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
                      required
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
                </Box>

                {!formData.map_settings?.disable_map_display && (
                  <>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                        <TextField
                          label="Map Zoom Level"
                          type="number"
                          fullWidth
                          value={formData.map_settings?.map_zoom_level || ''}
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
                          }}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                        <FormControl fullWidth>
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
                            }}
                            label="Map Type"
                          >
                            {mapTypes.map((type) => (
                              <MenuItem key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                  </>
                )}
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
                      placeholder="Enter place ID from geocoding service"
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          geocoding_info: {
                            ...prev.geocoding_info,
                            place_id: e.target.value
                          }
                        }));
                      }}
                    />
                  </Box>

                  <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                    <FormControl fullWidth>
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
                        }}
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
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                    <FormControl fullWidth>
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
                        }}
                        label="Geocoding Accuracy"
                      >
                        {geocodingAccuracies.map((accuracy) => (
                          <MenuItem key={accuracy} value={accuracy}>
                            {accuracy.replace('_', ' ')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                    <TextField
                      label="Geocoded At"
                      type="datetime-local"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={formData.geocoding_info?.geocoded_at || ''}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          geocoding_info: {
                            ...prev.geocoding_info,
                            geocoded_at: e.target.value
                          }
                        }));
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

                {formData.location_verified && (
                  <Box>
                    <TextField
                      label="Verification Notes"
                      fullWidth
                      multiline
                      rows={2}
                      value={formData.verification_notes || ''}
                      placeholder="Enter any notes about location verification"
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          verification_notes: e.target.value
                        }));
                      }}
                    />
                  </Box>
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
            Location details saved successfully!
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
          {hasExistingData && hasLocationData ? (
            // Update Button - shown when location data exists
            <Button
              variant="contained"
              startIcon={isSaving ? <CircularProgress size={20} /> : <Save />}
              onClick={handleUpdateLocation}
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
              {isSaving ? 'Updating...' : !hasChanges ? 'No Changes Made' : 'Update Location Details'}
            </Button>
          ) : (
            // Save Button - shown when creating new location details
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
              {isSaving ? 'Saving...' : isSubmitted ? 'Location Details Saved' : 'Save Location Details'}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LocationDetailsForm;
