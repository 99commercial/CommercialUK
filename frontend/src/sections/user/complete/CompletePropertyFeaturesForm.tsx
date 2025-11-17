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
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add, Delete, Build, CheckCircle, Cancel, Help, Save } from '@mui/icons-material';
import { useFormContext } from 'react-hook-form';
import axiosInstance from '../../../utils/axios';
import { enqueueSnackbar } from 'notistack';

const featureOptions = ['Yes', 'No', 'Unknown'];

const mainFeatures = [
  { key: 'air_conditioning', label: 'Air Conditioning', description: 'HVAC system available' },
  { key: 'clean_room', label: 'Clean Room', description: 'Clean room facilities' },
  { key: 'craneage', label: 'Craneage', description: 'Crane or lifting equipment' },
  { key: 'laboratory', label: 'Laboratory', description: 'Laboratory facilities' },
  { key: 'loading_bay', label: 'Loading Bay', description: 'Dedicated loading area' },
  { key: 'secure_yard', label: 'Secure Yard', description: 'Secure outdoor area' },
  { key: 'yard', label: 'Yard', description: 'Outdoor yard space' },
];

interface AdditionalFeature {
  feature_name?: string;
  feature_value?: string;
  description?: string;
}

interface PropertyFeaturesFormData {
  features: {
    [key: string]: string;
  };
  additional_features: AdditionalFeature[];
  feature_notes?: string;
}

interface PropertyFeaturesFormProps {
  propertyId: string;
  onStepSubmitted?: (step: number) => void;
}

const PropertyFeaturesForm: React.FC<PropertyFeaturesFormProps> = ({ propertyId, onStepSubmitted }) => {
  const {
    formState: { errors },
  } = useFormContext<PropertyFeaturesFormData>();

  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<PropertyFeaturesFormData>({
    features: {},
    additional_features: [],
    feature_notes: '',
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

  const addAdditionalFeature = () => {
    setFormData(prev => ({
      ...prev,
      additional_features: [
        ...prev.additional_features,
        {
      feature_name: '',
      feature_value: 'Unknown',
      description: '',
        }
      ]
    }));
  };

  const removeAdditionalFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additional_features: prev.additional_features.filter((_, i) => i !== index)
    }));
  };

  const updateAdditionalFeature = (index: number, field: keyof AdditionalFeature, value: any) => {
    setFormData(prev => ({
      ...prev,
      additional_features: prev.additional_features.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      )
    }));
  };

  const updateFeature = (featureKey: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [featureKey]: value
      }
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
      let response = await axiosInstance.put(`/api/user/properties/${propertyId}/features`, formData);
      
      console.log(response.data.data._id);
      
      localStorage.setItem('propertyId', response.data.data._id);
      
      enqueueSnackbar(response.data.message, { variant: 'success' });
      
      setSaveSuccess(true);
        setIsSubmitted(true);
      setTimeout(() => setSaveSuccess(false), 3000); // Hide success message after 3 seconds
        
      // Notify parent component that step 5 has been successfully submitted
        if (onStepSubmitted) {
          onStepSubmitted(5);
        }
    } catch (error: any) {
      console.error('Error saving property features:', error);
      
      // Handle field-specific validation errors
      if (error.errors && Array.isArray(error.errors)) {
        const fieldErrorMap: Record<string, string> = {};
        
        console.log('Processing validation errors:', error.errors);
        
        error.errors.forEach((err: any) => {
          console.log('Processing error:', err);
          if (err.path) {
            // Convert backend path format to frontend format
            // Backend: "features.air_conditioning" -> Frontend: "features.air_conditioning"
            // Backend: "additional_features[0].feature_name" -> Frontend: "additional_features.0.feature_name"
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
        const errorMessage = error.message || 'Failed to save property features. Please try again.';
        setSaveError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: 'error' });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const getFeatureIcon = (value: string) => {
    switch (value) {
      case 'Yes':
        return <CheckCircle color="success" />;
      case 'No':
        return <Cancel color="error" />;
      default:
        return <Help color="action" />;
    }
  };

  const getFeatureColor = (value: string) => {
    switch (value) {
      case 'Yes':
        return 'success';
      case 'No':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Property Features
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Specify the main features and amenities available at this property.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Main Features Section */}
        <Box>
          <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
                Main Features
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Select the availability of standard commercial property features.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {mainFeatures.map((feature) => (
                  <Box sx={{ flex: '1 1 300px', minWidth: '300px' }} key={feature.key}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Build sx={{ mr: 1, color: 'primary.main' }} />
                          <Box>
                            <Typography variant="subtitle1">
                              {feature.label}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {feature.description}
            </Typography>
                          </Box>
                        </Box>

                        <FormControl fullWidth error={!!getFieldError(`features.${feature.key}`)}>
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={formData.features?.[feature.key] || ''}
                            onChange={(e) => {
                              updateFeature(feature.key, e.target.value);
                              clearFieldError(`features.${feature.key}`);
                            }}
                            label="Status"
                            renderValue={(value) => (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {getFeatureIcon(value || '')}
                                <Typography sx={{ ml: 1 }}>{value || 'Select...'}</Typography>
                              </Box>
                            )}
                          >
                            {featureOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  {getFeatureIcon(option)}
                                  <Typography sx={{ ml: 1 }}>{option}</Typography>
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                          {getFieldError(`features.${feature.key}`) && (
                            <FormHelperText>{getFieldError(`features.${feature.key}`)}</FormHelperText>
                          )}
                        </FormControl>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
            </Box>
          </CardContent>
        </Card>
        </Box>

        {/* Additional Features Section */}
        <Box>
          <Card variant="outlined">
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
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Add custom features specific to this property.
              </Typography>

              {formData.additional_features.map((feature, index) => (
                <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1">
                        Additional Feature {index + 1}
                      </Typography>
                      <IconButton
                        onClick={() => removeAdditionalFeature(index)}
                        color="error"
                        size="small"
                      >
                        <Delete />
                      </IconButton>
              </Box>
              
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                    <TextField
                      label="Feature Name"
                      fullWidth
                          value={feature.feature_name || ''}
                          error={!!getFieldError(`additional_features.${index}.feature_name`)}
                          helperText={getFieldError(`additional_features.${index}.feature_name`)}
                          placeholder="e.g., Solar Panels, EV Charging"
                          onChange={(e) => {
                            updateAdditionalFeature(index, 'feature_name', e.target.value);
                            clearFieldError(`additional_features.${index}.feature_name`);
                          }}
                    />
                  </Box>

                      <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                        <FormControl fullWidth error={!!getFieldError(`additional_features.${index}.feature_value`)}>
                          <InputLabel>Status</InputLabel>
                      <Select
                            value={feature.feature_value || 'Unknown'}
                            onChange={(e) => {
                              updateAdditionalFeature(index, 'feature_value', e.target.value);
                              clearFieldError(`additional_features.${index}.feature_value`);
                            }}
                            label="Status"
                            renderValue={(value) => (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {getFeatureIcon(value)}
                                <Typography sx={{ ml: 1 }}>{value}</Typography>
                              </Box>
                            )}
                          >
                            {featureOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  {getFeatureIcon(option)}
                                  <Typography sx={{ ml: 1 }}>{option}</Typography>
                                </Box>
                              </MenuItem>
                            ))}
                      </Select>
                          {getFieldError(`additional_features.${index}.feature_value`) && (
                            <FormHelperText>{getFieldError(`additional_features.${index}.feature_value`)}</FormHelperText>
                          )}
                    </FormControl>
                  </Box>

                      <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                    <TextField
                          label="Description"
                      fullWidth
                          value={feature.description || ''}
                          error={!!getFieldError(`additional_features.${index}.description`)}
                          helperText={getFieldError(`additional_features.${index}.description`)}
                          placeholder="Describe this feature..."
                          onChange={(e) => {
                            updateAdditionalFeature(index, 'description', e.target.value);
                            clearFieldError(`additional_features.${index}.description`);
                          }}
                        />
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}

              {formData.additional_features.length === 0 && (
                <Card variant="outlined" sx={{ textAlign: 'center', py: 4 }}>
          <CardContent>
                    <Build sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
                      No Additional Features Added
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Add custom features that make this property unique.
            </Typography>
              <Button
                      startIcon={<Add />}
                onClick={addAdditionalFeature}
                      variant="contained"
              >
                      Add First Feature
              </Button>
                  </CardContent>
                </Card>
              )}
          </CardContent>
        </Card>
        </Box>

        {/* Feature Notes Section */}
        <Box>
          <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Feature Notes
            </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Add any additional notes about the property features.
              </Typography>

            <TextField
                label="Feature Notes"
              fullWidth
              multiline
              rows={4}
                value={formData.feature_notes || ''}
                error={!!getFieldError('feature_notes')}
                helperText={getFieldError('feature_notes')}
                placeholder="Enter any additional notes about the property features, special considerations, or unique selling points..."
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    feature_notes: e.target.value
                  }));
                  clearFieldError('feature_notes');
                }}
            />
          </CardContent>
        </Card>
        </Box>

        {/* Feature Summary */}
        <Box>
          <Card variant="outlined" sx={{ backgroundColor: '#f8f9fa' }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                📋 Feature Summary
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {mainFeatures.map((feature) => {
                  const value = formData.features?.[feature.key];
                  if (!value) return null;
                  return (
                    <Chip
                      key={feature.key}
                      icon={getFeatureIcon(value)}
                      label={`${feature.label}: ${value}`}
                      color={getFeatureColor(value) as any}
                      variant="outlined"
                      size="small"
                    />
                  );
                })}
                {formData.additional_features?.map((feature: any, index: number) => {
                  if (!feature.feature_name) return null;
                  return (
                    <Chip
                      key={index}
                      icon={getFeatureIcon(feature.feature_value)}
                      label={`${feature.feature_name}: ${feature.feature_value}`}
                      color={getFeatureColor(feature.feature_value) as any}
                      variant="outlined"
                      size="small"
                    />
                  );
                })}
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
            Property features saved successfully!
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
              backgroundColor: '#f2c514',
              '&:hover': {
                backgroundColor: '#d4a912',
              },
            }}
          >
            {isSaving ? 'Saving...' : isSubmitted ? 'Property Features Saved' : 'Save Property Features'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PropertyFeaturesForm;
