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
  IconButton,
  Switch,
  FormControlLabel,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add, Delete, VideoLibrary, Link, Image, Schedule, Save } from '@mui/icons-material';
import axiosInstance from '../../../../utils/axios';
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

interface VirtualToursData {
  _id?: string;
  property_id?: string;
  virtual_tours?: VirtualTour[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface UpdateVirtualToursFormProps {
  onStepSubmitted?: (step: number) => void;
  initialData?: VirtualToursData;
  onDataChange?: (data: VirtualToursData) => void;
  propertyId?: string;
  fetchProperty?: () => void;
  fetchPropertyData?: () => Promise<any> | any;
}

const UpdateVirtualToursForm: React.FC<UpdateVirtualToursFormProps> = ({ 
  onStepSubmitted, 
  initialData, 
  onDataChange,
  propertyId,
  fetchProperty,
  fetchPropertyData
}) => {
  const [formData, setFormData] = useState<VirtualToursData>({
    _id: initialData?._id || '',
    property_id: initialData?.property_id || '',
    virtual_tours: initialData?.virtual_tours || [],
    createdAt: initialData?.createdAt || '',
    updatedAt: initialData?.updatedAt || '',
    __v: initialData?.__v || 0,
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
        _id: initialData._id || '',
        property_id: initialData.property_id || '',
        virtual_tours: initialData.virtual_tours || [],
        createdAt: initialData.createdAt || '',
        updatedAt: initialData.updatedAt || '',
        __v: initialData.__v || 0,
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
        _id: initialData._id || '',
        property_id: initialData.property_id || '',
        virtual_tours: initialData.virtual_tours || [],
        createdAt: initialData.createdAt || '',
        updatedAt: initialData.updatedAt || '',
        __v: initialData.__v || 0,
      };

      const hasDataChanged = JSON.stringify(formData) !== JSON.stringify(initialFormData);
      setHasChanges(hasDataChanged);
    }
  }, [formData, initialData]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    formData.virtual_tours?.forEach((tour, index) => {
      if (!tour.tour_name?.trim()) {
        errors[`tour_${index}_name`] = 'Tour name is required';
      }
      if (!tour.tour_url?.trim()) {
        errors[`tour_${index}_url`] = 'Tour URL is required';
      } else if (!isValidUrl(tour.tour_url)) {
        errors[`tour_${index}_url`] = 'Please enter a valid URL';
      }
      if (!tour.link_type) {
        errors[`tour_${index}_type`] = 'Link type is required';
      }
      if (!tour.duration && tour.duration !== 0) {
        errors[`tour_${index}_duration`] = 'Duration is required';
      } else if (tour.duration !== undefined && tour.duration < 0) {
        errors[`tour_${index}_duration`] = 'Duration must be 0 or greater';
      }
      if (!tour.description?.trim()) {
        errors[`tour_${index}_description`] = 'Description is required';
      }
      if (!tour.thumbnail_url?.trim()) {
        errors[`tour_${index}_thumbnail`] = 'Thumbnail URL is required';
      } else if (tour.thumbnail_url && !isValidUrl(tour.thumbnail_url)) {
        errors[`tour_${index}_thumbnail`] = 'Please enter a valid URL';
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleTourChange = (index: number, field: keyof VirtualTour, value: any) => {
    setFormData(prev => ({
      ...prev,
      virtual_tours: (prev.virtual_tours || []).map((tour, i) => 
        i === index ? { ...tour, [field]: value } : tour
      )
    }));
  };

  const addTour = () => {
    const newTour: VirtualTour = {
      tour_name: '',
      tour_url: '',
      link_type: '',
      description: '',
      thumbnail_url: '',
      duration: 0,
      is_featured: false,
      display_order: formData.virtual_tours?.length || 0,
      is_active: true,
    };
    setFormData(prev => ({
      ...prev,
      virtual_tours: [...(prev.virtual_tours || []), newTour]
    }));
  };

  const removeTour = (index: number) => {
    setFormData(prev => ({
      ...prev,
      virtual_tours: (prev.virtual_tours || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      enqueueSnackbar('Please fix the highlighted errors before submitting.', { variant: 'error' });
      return;
    }

    if (!propertyId) {
      setSubmitError('Property ID is required for updating');
      return;
    }

    if (!initialData?._id) {
      enqueueSnackbar('Virtual tours ID is missing. Cannot update.', { variant: 'error' });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await axiosInstance.patch(
        `/api/user/property-virtual-tours/${initialData._id}`,
        { virtual_tours: formData.virtual_tours }
      );
      
      if (response.data.success) {
        setIsSubmitted(true);
        setHasChanges(false);
        setFieldErrors({});
        enqueueSnackbar('Virtual tours updated successfully!', { variant: 'success' });
        
        if (onStepSubmitted) {
          onStepSubmitted(4);
        }

        if (fetchPropertyData) {
          try {
            const refreshedData = await fetchPropertyData();
            if (refreshedData?.virtual_tours_id) {
              const vt = refreshedData.virtual_tours_id;
              setFormData({
                _id: vt._id || '',
                property_id: vt.property_id || '',
                virtual_tours: vt.virtual_tours || [],
                createdAt: vt.createdAt || '',
                updatedAt: vt.updatedAt || '',
                __v: vt.__v || 0,
              });
            }
          } catch (_) {
            // Fetch failed silently
          }
        }
      } else {
        throw new Error(response.data.message || 'Failed to update virtual tours');
      }
    } catch (error: any) {
      console.error('Error updating virtual tours:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update virtual tours';
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

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <VideoLibrary color="primary" />
                Virtual Tours & Media
              </Typography>
              <Button
                startIcon={<Add />}
                onClick={addTour}
                variant="outlined"
                size="small"
              >
                Add Virtual Tour
              </Button>
            </Box>

            {(formData.virtual_tours || []).map((tour, index) => (
              <Card key={index} sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Tour #{index + 1}
                  </Typography>
                  <IconButton
                    onClick={() => removeTour(index)}
                    color="error"
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                      label="Tour Name"
                      value={tour.tour_name || ''}
                      onChange={(e) => handleTourChange(index, 'tour_name', e.target.value)}
                      error={!!fieldErrors[`tour_${index}_name`]}
                      helperText={fieldErrors[`tour_${index}_name`]}
                      sx={{ minWidth: 200 }}
                      required
                    />

                    <FormControl sx={{ minWidth: 150 }} required>
                      <InputLabel>Link Type</InputLabel>
                      <Select
                        value={tour.link_type || ''}
                        onChange={(e) => handleTourChange(index, 'link_type', e.target.value)}
                        label="Link Type"
                        error={!!fieldErrors[`tour_${index}_type`]}
                      >
                        {linkTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                      {fieldErrors[`tour_${index}_type`] && (
                        <FormHelperText>{fieldErrors[`tour_${index}_type`]}</FormHelperText>
                      )}
                    </FormControl>

                    <TextField
                      label="Duration (seconds)"
                      type="number"
                      required
                      value={tour.duration || ''}
                      onChange={(e) => handleTourChange(index, 'duration', parseInt(e.target.value) || 0)}
                      error={!!fieldErrors[`tour_${index}_duration`]}
                      helperText={fieldErrors[`tour_${index}_duration`]}
                      inputProps={{ min: 0 }}
                      sx={{ minWidth: 150 }}
                    />
                  </Box>

                  <TextField
                    label="Tour URL"
                    value={tour.tour_url || ''}
                    onChange={(e) => handleTourChange(index, 'tour_url', e.target.value)}
                    error={!!fieldErrors[`tour_${index}_url`]}
                    helperText={fieldErrors[`tour_${index}_url`]}
                    fullWidth
                    placeholder="https://example.com/virtual-tour"
                    required
                  />

                  <TextField
                    label="Description"
                    required
                    value={tour.description || ''}
                    onChange={(e) => handleTourChange(index, 'description', e.target.value)}
                    error={!!fieldErrors[`tour_${index}_description`]}
                    helperText={fieldErrors[`tour_${index}_description`]}
                    multiline
                    rows={2}
                    fullWidth
                    placeholder="Brief description of the virtual tour"
                  />

                  <TextField
                    label="Thumbnail URL"
                    required
                    value={tour.thumbnail_url || ''}
                    onChange={(e) => handleTourChange(index, 'thumbnail_url', e.target.value)}
                    error={!!fieldErrors[`tour_${index}_thumbnail`]}
                    helperText={fieldErrors[`tour_${index}_thumbnail`]}
                    fullWidth
                    placeholder="https://example.com/thumbnail.jpg"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={tour.is_active !== false}
                        onChange={(e) => handleTourChange(index, 'is_active', e.target.checked)}
                      />
                    }
                    label="Active"
                  />
                </Box>
              </Card>
            ))}

            {(formData.virtual_tours || []).length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No virtual tours added yet. Click "Add Virtual Tour" to get started.
              </Typography>
            )}
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
              backgroundColor: hasChanges ? '#ea580c' : '#9ca3af',
              '&:hover': {
                backgroundColor: hasChanges ? '#c2410c' : '#9ca3af',
              },
            }}
          >
            {isSubmitting ? 'Updating...' : hasChanges ? 'Update Virtual Tours' : 'No Changes to Save'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default UpdateVirtualToursForm;
