import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowForward,
  CheckCircle,
  Save,
  Home,
  Business,
  Description,
  LocationOn,
  VideoLibrary,
  Build,
  PhotoLibrary,
  Description as DocumentIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Import form components
import GeneralDetailsForm from '../../../sections/agent/property/GeneralDetailsForm';
import BusinessDetailsForm from '../../../sections/agent/property/BusinessDetailsForm';
import PropertyDetailsForm from '../../../sections/agent/property/PropertyDetailsForm';
import LocationDetailsForm from '../../../sections/agent/property/LocationDetailsForm';
import VirtualToursForm from '../../../sections/agent/property/VirtualToursForm';
import PropertyFeaturesForm from '../../../sections/agent/property/PropertyFeaturesForm';
import PropertyImagesForm from '../../../sections/agent/property/PropertyImagesForm';
import PropertyDocumentsForm from '../../../sections/agent/property/PropertyDocumentsForm';
import HeaderCard from '../../../components/HeaderCard';
import { enqueueSnackbar } from 'notistack';

// Tab configuration
const tabs = [
  {
    id: 'general',
    label: 'General Details',
    icon: <Home />,
    description: 'Basic property information',
    color: '#dc2626',
  },
  {
    id: 'business',
    label: 'Business Details',
    icon: <Business />,
    description: 'Rates, descriptions & sale types',
    color: '#059669',
  },
  {
    id: 'property',
    label: 'Property Details',
    icon: <Description />,
    description: 'EPC, council tax & planning',
    color: '#2563eb',
  },
  {
    id: 'location',
    label: 'Location',
    icon: <LocationOn />,
    description: 'Address & coordinates',
    color: '#7c3aed',
  },
  {
    id: 'virtual',
    label: 'Virtual Tours',
    icon: <VideoLibrary />,
    description: 'Tour links & videos',
    color: '#ea580c',
  },
  {
    id: 'features',
    label: 'Features',
    icon: <Build />,
    description: 'Property features & amenities',
    color: '#0891b2',
  },
  {
    id: 'images',
    label: 'Images',
    icon: <PhotoLibrary />,
    description: 'Property photos & floor plans',
    color: '#be185d',
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: <DocumentIcon />,
    description: 'Legal documents & certificates',
    color: '#65a30d',
  },
];

interface CreatePropertyFormData {
  general_details?: any;
  business_rates?: any;
  descriptions?: any;
  sale_types?: any[];
  epc?: any;
  council_tax?: any;
  rateable_value?: number;
  planning?: any;
  coordinates?: any;
  address_details?: any;
  virtual_tours?: any[];
  features?: any;
  additional_features?: any[];
  feature_notes?: string;
  property_images?: any[];
  property_documents?: any[];
}

const CreatePropertyPage: React.FC = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [submittedSteps, setSubmittedSteps] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  
  // State to store form data for each step
  const [stepData, setStepData] = useState<Record<number, any>>({});

  const methods = useForm({
    mode: 'onSubmit', // Changed from 'onChange' to prevent validation errors
    defaultValues: {
      general_details: {},
      business_rates: {},
      descriptions: {},
      sale_types: [],
      epc: {},
      council_tax: {},
      rateable_value: 0,
      planning: {},
      coordinates: {},
      address_details: {},
      virtual_tours: [],
      features: {},
      additional_features: [],
      feature_notes: '',
      property_images: [],
      property_documents: [],
    },
  });

  // Update resolver when step changes
  React.useEffect(() => {
    // Clear all errors when step changes
    methods.clearErrors();
  }, [activeStep, methods]);

  const { handleSubmit, trigger, formState: { errors, isValid }, watch, setValue } = methods;

  // Watch form data for validation
  const formData = watch();

  // Check if current step is valid and submitted
  const isCurrentStepValid = () => {
    return submittedSteps.has(activeStep);
  };

  // Get fields to validate for each step
  const getFieldsForStep = (step: number): string[] => {
    switch (step) {
      case 0: return ['general_details'];
      case 1: return ['business_rates', 'descriptions', 'sale_types'];
      case 2: return ['epc', 'council_tax', 'rateable_value', 'planning'];
      case 3: return ['coordinates', 'address_details'];
      case 4: return ['virtual_tours'];
      case 5: return ['features', 'additional_features', 'feature_notes'];
      case 6: return ['property_images'];
      case 7: return ['property_documents'];
      default: return [];
    }
  };

  // Handle next step
  const handleNext = async () => {
    const isStepValid = isCurrentStepValid();
    
    if (isStepValid) {
      // Mark current step as completed
      setCompletedSteps(prev => new Set(Array.from(prev).concat(activeStep)));
      
      // Move to next step
      if (activeStep < tabs.length - 1) {
        setActiveStep(activeStep + 1);
      }
    }
  };


  // Handle step click
  const handleStepClick = async (step: number) => {
    // Only allow navigation to completed steps or the next step
    if (completedSteps.has(step) || step === activeStep + 1) {
      setActiveStep(step);
    }
  };

  // Handle step submission (called by child components)
  const handleStepSubmission = (step: number) => {
    setSubmittedSteps(prev => new Set(Array.from(prev).concat(step)));
    setCompletedSteps(prev => new Set(Array.from(prev).concat(step)));
  };

  // Handle data changes from child components
  const handleStepDataChange = (step: number, data: any) => {
    setStepData(prev => ({
      ...prev,
      [step]: data
    }));
  };

  // Save step data to backend - DISABLED FOR UI PREVIEW
  const saveStepData = async (step: number) => {
    // Mock successful save for UI preview
    console.log('Mock save for step:', step, 'Data:', getStepData(step));
    
    // Simulate property ID for step 0
    if (step === 0) {
      setPropertyId('mock-property-id-' + Date.now());
    }
    
    // No actual API calls - just mock success
    return Promise.resolve();
  };

  // Get endpoint for each step
  const getEndpointForStep = (step: number): string => {
    switch (step) {
      case 1: return '/business-details';
      case 2: return '/property-details';
      case 3: return '/location';
      case 4: return '/virtual-tours';
      case 5: return '/features';
      case 6: return '/images';
      case 7: return '/documents';
      default: return '';
    }
  };

  // Get data for each step
  const getStepData = (step: number) => {
    switch (step) {
      case 0: return formData.general_details;
      case 1: return {
        business_rates: formData.business_rates,
        descriptions: formData.descriptions,
        sale_types: formData.sale_types,
      };
      case 2: return {
        epc: formData.epc,
        council_tax: formData.council_tax,
        rateable_value: formData.rateable_value,
        planning: formData.planning,
      };
      case 3: return {
        coordinates: formData.coordinates,
        address_details: formData.address_details,
      };
      case 4: return { virtual_tours: formData.virtual_tours };
      case 5: return {
        features: formData.features,
        additional_features: formData.additional_features,
        feature_notes: formData.feature_notes,
      };
      case 6: return { property_images: formData.property_images };
      case 7: return { property_documents: formData.property_documents };
      default: return {};
    }
  };

  // Handle final submission - DISABLED FOR UI PREVIEW
  const onSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Mock final submission for UI preview
      console.log('Mock final submission with data:', formData);
      
      // Save final step
      await saveStepData(activeStep);
      
      // Mark all steps as completed
      const allSteps = Array.from({ length: tabs.length }, (_, i) => i);
      setCompletedSteps(new Set(allSteps));
      
      // Show success message instead of redirecting
      enqueueSnackbar('Property created successfully!', { variant: 'success' });
      localStorage.removeItem('propertyId');
      router.push('/agent/property/properties');
      
      // Optional: redirect to property list
      // router.push('/agent/properties');
    } catch (error) {
      console.error('Error submitting property:', error);
      setSubmitError('Failed to create property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render form for current step
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <GeneralDetailsForm 
            onStepSubmitted={handleStepSubmission}
            initialData={stepData[0]}
            onDataChange={(data) => handleStepDataChange(0, data)}
          />
        );
      case 1:
        return (
          <BusinessDetailsForm 
            onStepSubmitted={handleStepSubmission}
            initialData={stepData[1]}
            onDataChange={(data) => handleStepDataChange(1, data)}
          />
        );
      case 2:
        return (
          <PropertyDetailsForm 
            onStepSubmitted={handleStepSubmission}
            initialData={stepData[2]}
            onDataChange={(data) => handleStepDataChange(2, data)}
          />
        );
      case 3:
        return (
          <LocationDetailsForm
            onStepSubmitted={handleStepSubmission}
          />
        );
      case 4:
        return (
          <VirtualToursForm
            onStepSubmitted={handleStepSubmission}
          />
        );
      case 5:
        return (
          <PropertyFeaturesForm
            onStepSubmitted={handleStepSubmission}
          />
        );
      case 6:
        return <PropertyImagesForm onStepSubmitted={handleStepSubmission} />;
      case 7:
        return <PropertyDocumentsForm onStepSubmitted={handleStepSubmission} />;
      default:
        return null;
    }
  };

  return (
    <Box>
      
      <HeaderCard title="Create Property" subtitle='(Provide full property details, else property will not be listed to others)' breadcrumbs={['Home', 'Property' ,'Create Property']} />

      {/* Progress Stepper */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 0 }}>
          <Box
            sx={{
              overflowX: 'auto',
              overflowY: 'hidden',
              '&::-webkit-scrollbar': {
                height: 6,
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f1f1',
                borderRadius: 3,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#c1c1c1',
                borderRadius: 3,
                '&:hover': {
                  backgroundColor: '#a8a8a8',
                },
              },
            }}
          >
            <Stepper 
              activeStep={activeStep} 
              alternativeLabel
              sx={{
                minWidth: 'max-content',
                px: 2,
                py: 3,
              }}
            >
              {tabs.map((tab, index) => (
                <Step key={tab.id} completed={completedSteps.has(index)}>
                  <StepLabel
                    // onClick={() => handleStepClick(index)}
                    sx={{
                      cursor: completedSteps.has(index) || index === activeStep + 1 ? 'pointer' : 'default',
                      minWidth: 120,
                      '& .MuiStepLabel-label': {
                        fontSize: '0.875rem',
                      },
                      '&:hover': {
                        '& .MuiStepLabel-label': {
                          color: completedSteps.has(index) || index === activeStep + 1 ? 'primary.main' : 'text.secondary',
                        },
                      },
                    }}
                    StepIconComponent={({ active, completed }) => (
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: completed ? tab.color : active ? tab.color : '#e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          cursor: completedSteps.has(index) || index === activeStep + 1 ? 'pointer' : 'default',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            transform: completedSteps.has(index) || index === activeStep + 1 ? 'scale(1.1)' : 'scale(1)',
                            boxShadow: completedSteps.has(index) || index === activeStep + 1 ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                          },
                        }}
                      >
                        {completed ? <CheckCircle /> : tab.icon}
                      </Box>
                    )}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight={activeStep === index ? 600 : 400}>
                        {tab.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {tab.description}
                      </Typography>
                    </Box>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {submitError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSubmitError(null)}>
          {submitError}
        </Alert>
      )}

      {/* Form Content */}
      <FormProvider {...methods}>
        <Card>
          <CardContent>
            {/* Step Header */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: tabs[activeStep].color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    mr: 2,
                  }}
                >
                  {tabs[activeStep].icon}
                </Box>
                <Box>
                  <Typography variant="h5" component="h2">
                    {tabs[activeStep].label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tabs[activeStep].description}
                  </Typography>
                </Box>
              </Box>
              <Divider />
            </Box>

            {/* Step Content */}
            {renderStepContent()}

            {/* Step Status Indicator */}
            {!isCurrentStepValid() && (
              <Box sx={{ mt: 3, p: 2, backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f39c12' }} />
                  Please complete and submit the current step before proceeding to the next step.
                </Typography>
              </Box>
            )}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {activeStep < tabs.length - 1 ? (
                  <Button
                    endIcon={<ArrowForward />}
                    onClick={handleNext}
                    variant="contained"
                    disabled={isSubmitting || !isCurrentStepValid()}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
                    onClick={onSubmit}
                    variant="contained"
                    disabled={isSubmitting || !isCurrentStepValid()}
                  >
                    {isSubmitting ? 'Creating Property...' : 'Create Property'}
                  </Button>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </FormProvider>

      {/* Progress Summary */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Progress Summary
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {tabs.map((tab, index) => (
              <Box sx={{ flex: '1 1 250px', minWidth: '250px', maxWidth: '300px' }} key={tab.id}>
                <Paper
                  sx={{
                    p: 2,
                    border: completedSteps.has(index) ? `2px solid ${tab.color}` : '1px solid #e5e7eb',
                    borderRadius: 2,
                    backgroundColor: completedSteps.has(index) ? `${tab.color}10` : 'transparent',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {completedSteps.has(index) ? (
                      <CheckCircle sx={{ color: tab.color, mr: 1 }} />
                    ) : (
                      <Box sx={{ color: tab.color, mr: 1 }}>{tab.icon}</Box>
                    )}
                    <Typography variant="body2" fontWeight={500}>
                      {tab.label}
                    </Typography>
                  </Box>
                  <Chip
                    label={completedSteps.has(index) ? 'Completed' : 'Pending'}
                    size="small"
                    color={completedSteps.has(index) ? 'success' : 'default'}
                    variant={completedSteps.has(index) ? 'filled' : 'outlined'}
                  />
                </Paper>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreatePropertyPage;
