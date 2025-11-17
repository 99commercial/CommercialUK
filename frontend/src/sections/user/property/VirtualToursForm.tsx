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
  IconButton,
  Switch,
  FormControlLabel,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add, Delete, VideoLibrary, Link, Image, Save } from '@mui/icons-material';
import { useFormContext } from 'react-hook-form';
import axiosInstance from '../../../utils/axios';
import { enqueueSnackbar } from 'notistack';

const linkTypes = [
  'Virtual Tour',
  'Video Tour',
  '3D Flythrough',
  '360° Photos',
  'Drone Footage',
  'Walkthrough Video',
  'Interactive Map',
  'Floor Plan Interactive',
  'Other',
];

interface VirtualTour {
    tour_name?: string;
    tour_url?: string;
    link_type?: string;
    description?: string;
    thumbnail_url?: string;
    is_active?: boolean;
}

interface VirtualToursFormData {
  virtual_tours: VirtualTour[];
}

interface VirtualToursFormProps {
  onStepSubmitted?: (step: number) => void;
  propertyData?: any;
  hasExistingData?: boolean;
  fetchPropertyData?: () => void;
}

const VirtualToursForm: React.FC<VirtualToursFormProps> = ({ onStepSubmitted, propertyData, hasExistingData, fetchPropertyData }) => {
  const {
    formState: { errors },
  } = useFormContext<VirtualToursFormData>();

  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [originalData, setOriginalData] = useState<VirtualToursFormData | null>(null);
  const lastPropertyIdRef = React.useRef<string | null>(null);
  const hasInitializedRef = React.useRef<boolean>(false);
  const [formData, setFormData] = useState<VirtualToursFormData>({
    virtual_tours: []
  });

  // Initialize form data from propertyData.virtual_tours_id.virtual_tours
  useEffect(() => {
    const currentPropertyId = propertyData?._id || null;
    
    // virtual_tours_id is an object with _id and virtual_tours array inside
    if (propertyData?.virtual_tours_id?._id) {
      // Get the virtual_tours array from inside the virtual_tours_id object
      const virtualToursArray = Array.isArray(propertyData.virtual_tours_id.virtual_tours) 
        ? propertyData.virtual_tours_id.virtual_tours 
        : [];
      
      // Only update if:
      // 1. We haven't initialized yet OR the property ID has changed to a different property
      const shouldInitialize = !hasInitializedRef.current || 
        (currentPropertyId !== null && lastPropertyIdRef.current !== currentPropertyId);
      
      if (shouldInitialize) {
        // Extract virtual_tours array from virtual_tours_id.virtual_tours
        const virtualTours = virtualToursArray.map((tour: any) => ({
          tour_name: tour.tour_name || '',
          tour_url: tour.tour_url || '',
          link_type: tour.link_type || '',
          description: tour.description || '',
          thumbnail_url: tour.thumbnail_url || '',
          is_active: tour.is_active !== false,
        }));
        
        const initializedData: VirtualToursFormData = {
          virtual_tours: virtualTours
        };
        
        setFormData(initializedData);
        setOriginalData({ ...initializedData });
        lastPropertyIdRef.current = currentPropertyId;
        hasInitializedRef.current = true;
      }
    } else if (hasInitializedRef.current && currentPropertyId !== lastPropertyIdRef.current) {
      // If property changed and new property has no virtual_tours_id, reset
      setFormData({ virtual_tours: [] });
      setOriginalData({ virtual_tours: [] });
      lastPropertyIdRef.current = currentPropertyId;
    }
  }, [propertyData?.virtual_tours_id?._id, propertyData?.virtual_tours_id?.virtual_tours, propertyData?._id]);

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

  // Normalize virtual tour for comparison (remove _id and other metadata)
  const normalizeVirtualTour = (tour: VirtualTour): VirtualTour => {
    return {
      tour_name: normalizeValue(tour.tour_name),
      tour_url: normalizeValue(tour.tour_url),
      link_type: normalizeValue(tour.link_type),
      description: normalizeValue(tour.description),
      thumbnail_url: normalizeValue(tour.thumbnail_url),
      is_active: normalizeValue(tour.is_active),
    };
  };

  // Check if form data has changed from original
  const hasChanges = useMemo(() => {
    if (!hasExistingData || !propertyData?.virtual_tours_id?._id || !originalData) {
      return false;
    }

    // Get the virtual_tours array from inside the virtual_tours_id object
    const originalToursArray = Array.isArray(propertyData.virtual_tours_id.virtual_tours) 
      ? propertyData.virtual_tours_id.virtual_tours 
      : [];
    const currentTours = formData.virtual_tours;

    // If lengths are different, there are changes
    if (currentTours.length !== originalToursArray.length) {
      return true;
    }

    // Compare each tour
    for (let i = 0; i < currentTours.length; i++) {
      const currentTour = normalizeVirtualTour(currentTours[i]);
      const originalTour = normalizeVirtualTour(originalToursArray[i]);
      
      // Compare all fields
      if (
        currentTour.tour_name !== originalTour.tour_name ||
        currentTour.tour_url !== originalTour.tour_url ||
        currentTour.link_type !== originalTour.link_type ||
        currentTour.description !== originalTour.description ||
        currentTour.thumbnail_url !== originalTour.thumbnail_url ||
        currentTour.is_active !== originalTour.is_active
      ) {
        return true;
      }
    }

    return false;
  }, [
    formData.virtual_tours,
    propertyData?.virtual_tours_id?.virtual_tours,
    hasExistingData,
    originalData
  ]);

  // Check if virtual tours data exists (virtual_tours_id object with _id)
  const hasVirtualToursData = useMemo(() => {
    return !!(propertyData?.virtual_tours_id?._id);
  }, [propertyData?.virtual_tours_id?._id]);

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

  const addVirtualTour = () => {
    setFormData(prev => ({
      ...prev,
      virtual_tours: [
        ...prev.virtual_tours,
        {
      tour_name: '',
      tour_url: '',
      link_type: '',
      description: '',
      thumbnail_url: '',
      is_active: true,
        }
      ]
    }));
  };

  const removeVirtualTour = (index: number) => {
    setFormData(prev => ({
      ...prev,
      virtual_tours: prev.virtual_tours.filter((_, i) => i !== index)
    }));
  };

  const updateVirtualTour = (index: number, field: keyof VirtualTour, value: any) => {
    setFormData(prev => ({
      ...prev,
      virtual_tours: prev.virtual_tours.map((tour, i) => 
        i === index ? { ...tour, [field]: value } : tour
      )
    }));
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
      let response = await axiosInstance.put(`/api/user/properties/${propertyId}/virtual-tours`, formData);

      localStorage.setItem('propertyId', response.data.data._id);
      
      enqueueSnackbar(response.data.message, { variant: 'success' });
      
      setSaveSuccess(true);
      setIsSubmitted(true);
      
      // Update original data after successful save
      setOriginalData({ ...formData });
      
      setTimeout(() => setSaveSuccess(false), 3000); // Hide success message after 3 seconds

      fetchPropertyData?.();
      
      // Notify parent component that step 4 has been successfully submitted
      if (onStepSubmitted) {
        onStepSubmitted(4);
      }
    } catch (error: any) {
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
        
        const errorMessage = 'Please fix the validation errors below.';
        setSaveError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: 'error' });
      } else {
        const errorMessage = 'Failed to save virtual tours. Please try again.';
        setSaveError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: 'error' });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateVirtualTour = async () => {
    // Get virtual_tours_id._id (the object's _id)
    const virtualToursId = propertyData?.virtual_tours_id?._id;
    
    if (!virtualToursId) {
      setSaveError('Virtual tours ID not found. Please save virtual tours first.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    setFieldErrors({});

    try {
      // Ensure all required fields are present and non-empty as backend validation requires
      const virtualToursToSend = formData.virtual_tours.map(tour => {
        // Ensure all required string fields are trimmed and non-empty
        const tour_name = (tour.tour_name || '').trim();
        const tour_url = (tour.tour_url || '').trim();
        const link_type = (tour.link_type || '').trim();
        const description = (tour.description || '').trim();
        const thumbnail_url = (tour.thumbnail_url || '').trim();

        return {
          tour_name,
          tour_url,
          link_type,
          description,
          thumbnail_url,
          is_active: tour.is_active !== undefined ? Boolean(tour.is_active) : true,
        };
      });

      // Use PATCH endpoint for updating virtual tours
      // Send only virtual_tours array, exactly like UpdateVirtualToursForm.tsx
      const response = await axiosInstance.patch(
        `/api/user/property-virtual-tours/${virtualToursId}`, {
          _id: virtualToursId,  
          property_id: propertyData?._id,
          virtual_tours: virtualToursToSend
        }
      );
      
      if (response.data.success) {
        enqueueSnackbar(response.data.message || 'Virtual tours updated successfully!', { variant: 'success' });
        
        // Update original data after successful update
        setOriginalData({ ...formData });
        
        setSaveSuccess(true);
        setIsSubmitted(false); // Allow multiple updates
        
        // Refresh property data if callback is provided
          fetchPropertyData();
        
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        throw new Error(response.data.message || 'Failed to update virtual tours');
      }
      
    } catch (error: any) {
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
        
        const errorMessage = 'Please fix the validation errors below.';
        setSaveError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: 'error' });
      } else {
        const errorMessage = 'Failed to update virtual tours. Please try again.';
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
        Virtual Tours
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Add virtual tours, videos, and interactive content for your property.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Add Tour Button */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Virtual Tours & Videos
            </Typography>
            <Button
              startIcon={<Add />}
              onClick={addVirtualTour}
              variant="contained"
              size="small"
            >
              Add Virtual Tour
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Add virtual tours, video walkthroughs, and interactive content to showcase your property.
          </Typography>
        </Box>

        {/* Virtual Tours List */}
        {formData.virtual_tours.map((tour, index) => (
          <Box key={index}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1">
                    Virtual Tour {index + 1}
                  </Typography>
                  <IconButton
                    onClick={() => removeVirtualTour(index)}
                    color="error"
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Tour Name and Link Type */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                      <TextField
                        label="Tour Name"
                        fullWidth
                        value={tour.tour_name || ''}
                        error={!!getFieldError(`virtual_tours.${index}.tour_name`)}
                        helperText={getFieldError(`virtual_tours.${index}.tour_name`)}
                        placeholder="e.g., Main Office Virtual Tour"
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><VideoLibrary /></InputAdornment>,
                        }}
                        onChange={(e) => {
                          updateVirtualTour(index, 'tour_name', e.target.value);
                          clearFieldError(`virtual_tours.${index}.tour_name`);
                        }}
                      />
                    </Box>

                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                      <FormControl fullWidth error={!!getFieldError(`virtual_tours.${index}.link_type`)}>
                        <InputLabel>Link Type</InputLabel>
                        <Select
                          value={tour.link_type || ''}
                          onChange={(e) => {
                            updateVirtualTour(index, 'link_type', e.target.value);
                            clearFieldError(`virtual_tours.${index}.link_type`);
                          }}
                          label="Link Type"
                        >
                          {linkTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                              {type}
                            </MenuItem>
                          ))}
                        </Select>
                        {getFieldError(`virtual_tours.${index}.link_type`) && (
                          <FormHelperText>{getFieldError(`virtual_tours.${index}.link_type`)}</FormHelperText>
                        )}
                      </FormControl>
                    </Box>
                  </Box>

                  {/* Tour URL */}
                  <Box>
                    <TextField
                      label="Tour URL"
                      fullWidth
                      value={tour.tour_url || ''}
                      error={!!getFieldError(`virtual_tours.${index}.tour_url`)}
                      helperText={getFieldError(`virtual_tours.${index}.tour_url`)}
                      placeholder="https://example.com/virtual-tour"
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Link /></InputAdornment>,
                      }}
                      onChange={(e) => {
                        updateVirtualTour(index, 'tour_url', e.target.value);
                        clearFieldError(`virtual_tours.${index}.tour_url`);
                      }}
                    />
                  </Box>

                  {/* Description */}
                  <Box>
                    <TextField
                      label="Description"
                      fullWidth
                      multiline
                      rows={2}
                      value={tour.description || ''}
                      error={!!getFieldError(`virtual_tours.${index}.description`)}
                      helperText={getFieldError(`virtual_tours.${index}.description`)}
                      placeholder="Describe this virtual tour or video..."
                      onChange={(e) => {
                        updateVirtualTour(index, 'description', e.target.value);
                        clearFieldError(`virtual_tours.${index}.description`);
                      }}
                    />
                  </Box>

                  {/* Thumbnail URL */}
                  <Box>
                    <TextField
                      label="Thumbnail URL"
                      fullWidth
                      value={tour.thumbnail_url || ''}
                      error={!!getFieldError(`virtual_tours.${index}.thumbnail_url`)}
                      helperText={getFieldError(`virtual_tours.${index}.thumbnail_url`)}
                      placeholder="https://example.com/thumbnail.jpg"
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Image /></InputAdornment>,
                      }}
                      onChange={(e) => {
                        updateVirtualTour(index, 'thumbnail_url', e.target.value);
                        clearFieldError(`virtual_tours.${index}.thumbnail_url`);
                      }}
                    />
                  </Box>

                  {/* Active Switch */}
                  <Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={tour.is_active !== false}
                          onChange={(e) => {
                            updateVirtualTour(index, 'is_active', e.target.checked);
                          }}
                        />
                      }
                      label="Active"
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}

        {/* Empty State */}
        {formData.virtual_tours.length === 0 && (
          <Box>
            <Card variant="outlined" sx={{ textAlign: 'center', py: 4 }}>
              <CardContent>
                <VideoLibrary sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No Virtual Tours Added
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Add virtual tours, videos, and interactive content to showcase your property.
                </Typography>
                <Button
                  startIcon={<Add />}
                  onClick={addVirtualTour}
                  variant="contained"
                >
                  Add First Virtual Tour
                </Button>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Help Text */}
        <Box>
          <Card variant="outlined" sx={{ backgroundColor: '#f8f9fa' }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                💡 Tips for Virtual Tours:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Use high-quality virtual tour platforms like Matterport, 3DVista, or Kuula<br/>
                • Include both interior and exterior views when possible<br/>
                • Add descriptive names and detailed descriptions<br/>
                • Set featured tours to highlight the most important content<br/>
                • Use thumbnail images to make tours more appealing
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Save Button and Status Messages */}
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Success Alert */}
        {saveSuccess && (
          <Alert severity="success" onClose={() => setSaveSuccess(false)}>
            Virtual tours saved successfully!
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
          {hasExistingData && hasVirtualToursData ? (
            // Update Button - shown when virtual tours data exists
            <Button
              variant="contained"
              startIcon={isSaving ? <CircularProgress size={20} /> : <Save />}
              onClick={handleUpdateVirtualTour}
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
              {isSaving ? 'Updating...' : !hasChanges ? 'No Changes Made' : 'Update Virtual Tours'}
            </Button>
          ) : (
            // Save Button - shown when creating new virtual tours
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
              {isSaving ? 'Saving...' : isSubmitted ? 'Virtual Tours Saved' : 'Save Virtual Tours'}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default VirtualToursForm;
