import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  onStepSubmitted?: (step: number) => void;
  propertyData: any;
  hasExistingData: boolean;
  fetchPropertyData: () => void;
}

const PropertyFeaturesForm: React.FC<PropertyFeaturesFormProps> = ({ onStepSubmitted, propertyData, hasExistingData, fetchPropertyData }) => {
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
  const [originalData, setOriginalData] = useState<PropertyFeaturesFormData | null>(null);
  const lastPropertyIdRef = useRef<string | null>(null);
  const hasInitializedRef = useRef<boolean>(false);

  // Initialize form data from propertyData.features_id
  useEffect(() => {
    const currentPropertyId = propertyData?._id || null;
    
    if (propertyData?.features_id?._id) {
      const shouldInitialize = !hasInitializedRef.current || 
        (currentPropertyId !== null && lastPropertyIdRef.current !== currentPropertyId);
      
      if (shouldInitialize) {
        const featuresData = propertyData.features_id;
        
        // Initialize main features
        const features: { [key: string]: string } = {};
        if (featuresData.features) {
          mainFeatures.forEach(feature => {
            features[feature.key] = featuresData.features[feature.key] || '';
          });
        }
        
        // Initialize additional features (remove _id and other metadata)
        const additional_features = (featuresData.additional_features || []).map((af: any) => ({
          feature_name: af.feature_name || '',
          feature_value: af.feature_value || 'Unknown',
          description: af.description || '',
        }));
        
        const initializedData: PropertyFeaturesFormData = {
          features,
          additional_features,
          feature_notes: featuresData.feature_notes || '',
        };
        
        setFormData(initializedData);
        setOriginalData({ ...initializedData });
        lastPropertyIdRef.current = currentPropertyId;
        hasInitializedRef.current = true;
      }
    } else if (hasInitializedRef.current && currentPropertyId !== lastPropertyIdRef.current) {
      // If property changed and new property has no features_id, reset
      setFormData({ features: {}, additional_features: [], feature_notes: '' });
      setOriginalData({ features: {}, additional_features: [], feature_notes: '' });
      lastPropertyIdRef.current = currentPropertyId;
    }
  }, [propertyData?.features_id?._id, propertyData?._id]);

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
      return value.trim();
    }
    return value;
  };

  // Check if form data has changed from original
  const hasChanges = useMemo(() => {
    if (!hasExistingData || !propertyData?.features_id?._id || !originalData) {
      return false;
    }

    // Compare features object
    const currentFeatures = formData.features || {};
    const originalFeatures = originalData.features || {};
    
    for (const featureKey of mainFeatures.map(f => f.key)) {
      const currentValue = normalizeValue(currentFeatures[featureKey]);
      const originalValue = normalizeValue(originalFeatures[featureKey]);
      if (currentValue !== originalValue) {
        return true;
      }
    }

    // Compare additional_features
    const currentAdditional = formData.additional_features || [];
    const originalAdditional = originalData.additional_features || [];
    
    if (currentAdditional.length !== originalAdditional.length) {
      return true;
    }

    for (let i = 0; i < currentAdditional.length; i++) {
      const current = currentAdditional[i];
      const original = originalAdditional[i];
      
      if (
        normalizeValue(current.feature_name) !== normalizeValue(original.feature_name) ||
        normalizeValue(current.feature_value) !== normalizeValue(original.feature_value) ||
        normalizeValue(current.description) !== normalizeValue(original.description)
      ) {
        return true;
      }
    }

    // Compare feature_notes
    if (normalizeValue(formData.feature_notes) !== normalizeValue(originalData.feature_notes)) {
      return true;
    }

    return false;
  }, [
    formData.features,
    formData.additional_features,
    formData.feature_notes,
    propertyData?.features_id?._id,
    hasExistingData,
    originalData
  ]);

  // Check if features data exists
  const hasFeaturesData = useMemo(() => {
    return !!(propertyData?.features_id?._id);
  }, [propertyData?.features_id?._id]);

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
      let response = await axiosInstance.put(`/api/user/properties/${propertyId}/features`, formData);
      
      localStorage.setItem('propertyId', response.data.data._id);
      
      enqueueSnackbar(response.data.message, { variant: 'success' });
      
      setSaveSuccess(true);
      setIsSubmitted(true);
      
      // Update original data after successful save
      setOriginalData({ ...formData });
      
      setTimeout(() => setSaveSuccess(false), 3000); // Hide success message after 3 seconds

      fetchPropertyData?.();
      
      // Notify parent component that step 5 has been successfully submitted
      if (onStepSubmitted) {
        onStepSubmitted(5);
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
        const errorMessage = 'Failed to save property features. Please try again.';
        setSaveError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: 'error' });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateFeatures = async () => {
    const featuresId = propertyData?.features_id?._id;
    
    if (!featuresId) {
      setSaveError('Features ID not found. Please save features first.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    setFieldErrors({});

    try {
      const response = await axiosInstance.patch(
        `/api/user/property-features/${featuresId}`,
        formData
      );
      
      if (response.data.success) {
        enqueueSnackbar(response.data.message || 'Property features updated successfully!', { variant: 'success' });
        
        // Update original data after successful update
        setOriginalData({ ...formData });
        
        setSaveSuccess(true);
        setIsSubmitted(false); // Allow multiple updates
        
        // Refresh property data if callback is provided

          fetchPropertyData();
        
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        throw new Error(response.data.message || 'Failed to update property features');
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
        const errorMessage = 'Failed to update property features. Please try again.';
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

        {/* Save/Update Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {hasExistingData && hasFeaturesData ? (
            <Button
              variant="contained"
              startIcon={isSaving ? <CircularProgress size={20} /> : <Save />}
              onClick={handleUpdateFeatures}
              disabled={isSaving || !hasChanges}
              sx={{ 
                minWidth: 200,
                backgroundColor: hasChanges ? '#ea580c' : '#9ca3af',
                '&:hover': {
                  backgroundColor: hasChanges ? '#c2410c' : '#9ca3af',
                },
              }}
            >
              {isSaving ? 'Updating...' : hasChanges ? 'Update Property Features' : 'No Changes Made'}
            </Button>
          ) : (
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
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PropertyFeaturesForm;
