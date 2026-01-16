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
  Chip,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import { Add, Delete, Build, Save } from '@mui/icons-material';
import axiosInstance from '../../../../utils/axios';
import { enqueueSnackbar } from 'notistack';

const featureCategories = [
  'Accessibility',
  'Amenities',
  'Building Features',
  'Environmental',
  'Parking',
  'Security',
  'Technology',
  'Utilities',
  'Other',
];

interface PropertyFeature {
  feature_name?: string;
  feature_value?: string;
  description?: string;
}

interface UpdatePropertyFeaturesFormData {
  _id?: string;
  property_id?: string;
  features: {
    air_conditioning?: string;
    clean_room?: string;
    craneage?: string;
    laboratory?: string;
    loading_bay?: string;
    secure_yard?: string;
    yard?: string;
  };
  additional_features: PropertyFeature[];
  feature_notes?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface UpdatePropertyFeaturesFormProps {
  onStepSubmitted?: (step: number) => void;
  initialData?: UpdatePropertyFeaturesFormData;
  onDataChange?: (data: UpdatePropertyFeaturesFormData) => void;
  propertyId?: string;
  fetchProperty?: () => void;
  fetchPropertyData?: () => void;
}

const UpdatePropertyFeaturesForm: React.FC<UpdatePropertyFeaturesFormProps> = ({ 
  onStepSubmitted, 
  initialData, 
  onDataChange,
  propertyId,
  fetchProperty,
  fetchPropertyData
}) => {
  const [formData, setFormData] = useState<UpdatePropertyFeaturesFormData>({
    features: {
      air_conditioning: initialData?.features?.air_conditioning || '',
      clean_room: initialData?.features?.clean_room || '',
      craneage: initialData?.features?.craneage || '',
      laboratory: initialData?.features?.laboratory || '',
      loading_bay: initialData?.features?.loading_bay || '',
      secure_yard: initialData?.features?.secure_yard || '',
      yard: initialData?.features?.yard || '',
    },
    additional_features: initialData?.additional_features || [],
    feature_notes: initialData?.feature_notes || '',
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
        features: {
          air_conditioning: initialData.features?.air_conditioning || 'Unknown',
          clean_room: initialData.features?.clean_room || 'Unknown',
          craneage: initialData.features?.craneage || 'Unknown',
          laboratory: initialData.features?.laboratory || 'Unknown',
          loading_bay: initialData.features?.loading_bay || 'Unknown',
          secure_yard: initialData.features?.secure_yard || 'Unknown',
          yard: initialData.features?.yard || 'Unknown',
        },
        additional_features: initialData.additional_features || [],
        feature_notes: initialData.feature_notes || '',
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
        features: {
          air_conditioning: initialData.features?.air_conditioning || 'Unknown',
          clean_room: initialData.features?.clean_room || 'Unknown',
          craneage: initialData.features?.craneage || 'Unknown',
          laboratory: initialData.features?.laboratory || 'Unknown',
          loading_bay: initialData.features?.loading_bay || 'Unknown',
          secure_yard: initialData.features?.secure_yard || 'Unknown',
          yard: initialData.features?.yard || 'Unknown',
        },
        additional_features: initialData.additional_features || [],
        feature_notes: initialData.feature_notes || '',
      };

      const hasDataChanged = JSON.stringify(formData) !== JSON.stringify(initialFormData);
      setHasChanges(hasDataChanged);
    }
  }, [formData, initialData]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    formData.additional_features.forEach((feature, index) => {
      if (!feature.feature_name?.trim()) {
        errors[`feature_${index}_name`] = 'Feature name is required';
      }
      if (!feature.feature_value) {
        errors[`feature_${index}_value`] = 'Feature value is required';
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFeatureChange = (field: keyof UpdatePropertyFeaturesFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAdditionalFeatureChange = (index: number, field: keyof PropertyFeature, value: any) => {
    setFormData(prev => ({
      ...prev,
      additional_features: prev.additional_features.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      )
    }));
  };

  const addAdditionalFeature = () => {
    const newFeature: PropertyFeature = {
      feature_name: '',
      feature_value: '',
      description: '',
    };
    setFormData(prev => ({
      ...prev,
      additional_features: [...(prev.additional_features || []), newFeature]
    }));
  };

  const removeAdditionalFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additional_features: prev.additional_features.filter((_, i) => i !== index)
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
      const response = await axiosInstance.patch(`/api/agent/property-features/${initialData?._id}`, formData);
      
      if (response.data.success) {
        setIsSubmitted(true);
        setHasChanges(false); // Reset changes flag after successful update
        enqueueSnackbar('Property features updated successfully!', { variant: 'success' });
        
        if (onStepSubmitted) {
          onStepSubmitted(5);
        }
        fetchPropertyData?.();
      } else {
        throw new Error(response.data.message || 'Failed to update property features');
      }
    } catch (error: any) {
      console.error('Error updating property features:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update property features';
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

        {/* Basic Features Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Build color="primary" />
              Basic Property Features
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Common features that are typically available for this property type.
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {Object.entries(formData.features).map(([key, value]) => (
                <Box key={key} sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={value || 'Unknown'}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            features: {
                              ...prev.features,
                              [key]: e.target.value
                            }
                          }));
                        }}
                        displayEmpty
                      >
                        <MenuItem value="Unknown">Unknown</MenuItem>
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </FormControl>
                  </Card>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Additional Features Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Additional Features
              </Typography>
              <Button
                startIcon={<Add />}
                onClick={addAdditionalFeature}
                variant="outlined"
                size="small"
              >
                Add Feature
              </Button>
            </Box>

            {(formData.additional_features || []).map((feature, index) => (
              <Card key={index} sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Feature #{index + 1}
                  </Typography>
                  <IconButton
                    onClick={() => removeAdditionalFeature(index)}
                    color="error"
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                      label="Feature Name"
                      value={feature.feature_name || ''}
                      onChange={(e) => handleAdditionalFeatureChange(index, 'feature_name', e.target.value)}
                      error={!!fieldErrors[`feature_${index}_name`]}
                      helperText={fieldErrors[`feature_${index}_name`]}
                      sx={{ flex: 1, minWidth: 200 }}
                      required
                    />

                    <FormControl sx={{ flex: 1, minWidth: 150 }} required>
                      <InputLabel>Value</InputLabel>
                      <Select
                        value={feature.feature_value || 'Unknown'}
                        onChange={(e) => handleAdditionalFeatureChange(index, 'feature_value', e.target.value)}
                        label="Value"
                        error={!!fieldErrors[`feature_${index}_value`]}
                      >
                        <MenuItem value="Unknown">Unknown</MenuItem>
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                      {fieldErrors[`feature_${index}_value`] && (
                        <FormHelperText>{fieldErrors[`feature_${index}_value`]}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>

                  <TextField
                    label="Description"
                    value={feature.description || ''}
                    onChange={(e) => handleAdditionalFeatureChange(index, 'description', e.target.value)}
                    multiline
                    rows={2}
                    fullWidth
                    placeholder="Additional details about this feature"
                  />
                </Box>
              </Card>
            ))}

            {(formData.additional_features || []).length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No additional features added yet. Click "Add Feature" to get started.
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Feature Notes Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Feature Notes
            </Typography>
            <TextField
              label="Additional Notes"
              value={formData.feature_notes || ''}
              onChange={(e) => handleFeatureChange('feature_notes', e.target.value)}
              multiline
              rows={4}
              fullWidth
              placeholder="Any additional notes about property features, special considerations, or important details"
            />
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
              backgroundColor: hasChanges ? '#0891b2' : '#9ca3af',
              '&:hover': {
                backgroundColor: hasChanges ? '#0e7490' : '#9ca3af',
              },
            }}
          >
            {isSubmitting ? 'Updating...' : hasChanges ? 'Update Features' : 'No Changes to Save'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default UpdatePropertyFeaturesForm;
