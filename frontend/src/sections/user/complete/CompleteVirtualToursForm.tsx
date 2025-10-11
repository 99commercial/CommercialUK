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
import { Add, Delete, VideoLibrary, Link, Image, Schedule, Save } from '@mui/icons-material';
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
    duration?: number;
    is_featured?: boolean;
    display_order?: number;
    is_active?: boolean;
}

interface VirtualToursFormData {
  virtual_tours: VirtualTour[];
}

interface VirtualToursFormProps {
  propertyId: string;
  onStepSubmitted?: (step: number) => void;
  initialData?: any;
  onDataChange?: (data: any) => void;
}

const CompeleteVirtualToursForm: React.FC<VirtualToursFormProps> = ({ propertyId, onStepSubmitted, initialData, onDataChange }) => {
  const {
    formState: { errors },
  } = useFormContext<VirtualToursFormData>();

  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<VirtualToursFormData>({
    virtual_tours: []
  });

  // Load initial data
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        virtual_tours: initialData.virtual_tours || prev.virtual_tours,
      }));
    }
  }, [initialData]);

  // Notify parent of data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

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
      duration: 0,
      is_featured: false,
          display_order: prev.virtual_tours.length,
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
      
      console.log(response.data.data._id);

      localStorage.setItem('propertyId', response.data.data._id);
      
      enqueueSnackbar(response.data.message, { variant: 'success' });
      
      setSaveSuccess(true);
        setIsSubmitted(true);
      setTimeout(() => setSaveSuccess(false), 3000); // Hide success message after 3 seconds
        
      // Notify parent component that step 4 has been successfully submitted
        if (onStepSubmitted) {
          onStepSubmitted(4);
        }
    } catch (error: any) {
      console.error('Error saving virtual tours:', error);
      
      // Handle field-specific validation errors
      if (error.errors && Array.isArray(error.errors)) {
        const fieldErrorMap: Record<string, string> = {};
        
        console.log('Processing validation errors:', error.errors);
        
        error.errors.forEach((err: any) => {
          console.log('Processing error:', err);
          if (err.path) {
            // Convert backend path format to frontend format
            // Backend: "virtual_tours[0].tour_name" -> Frontend: "virtual_tours.0.tour_name"
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
        const errorMessage = error.message || 'Failed to save virtual tours. Please try again.';
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

                  {/* Thumbnail URL and Duration */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
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

                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                      <TextField
                        label="Duration (seconds)"
                        type="number"
                        fullWidth
                        value={tour.duration || ''}
                        error={!!getFieldError(`virtual_tours.${index}.duration`)}
                        helperText={getFieldError(`virtual_tours.${index}.duration`)}
                        placeholder="0"
                        inputProps={{ min: 0 }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><Schedule /></InputAdornment>,
                        }}
                        onChange={(e) => {
                          updateVirtualTour(index, 'duration', parseInt(e.target.value) || 0);
                          clearFieldError(`virtual_tours.${index}.duration`);
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Display Order and Switches */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                      <TextField
                        label="Display Order"
                        type="number"
                        fullWidth
                        value={tour.display_order || ''}
                        error={!!getFieldError(`virtual_tours.${index}.display_order`)}
                        helperText={getFieldError(`virtual_tours.${index}.display_order`)}
                        placeholder="0"
                        inputProps={{ min: 0 }}
                        onChange={(e) => {
                          updateVirtualTour(index, 'display_order', parseInt(e.target.value) || 0);
                          clearFieldError(`virtual_tours.${index}.display_order`);
                        }}
                      />
                    </Box>

                    <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={tour.is_featured || false}
                              onChange={(e) => {
                                updateVirtualTour(index, 'is_featured', e.target.checked);
                              }}
                            />
                          }
                          label="Featured Tour"
                        />
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
            {isSaving ? 'Saving...' : isSubmitted ? 'Virtual Tours Saved' : 'Save Virtual Tours'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CompeleteVirtualToursForm;
