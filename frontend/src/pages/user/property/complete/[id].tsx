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
import CompleteGeneralDetailsForm from '../../../../sections/user/complete/CompleteGeneralDetailsForm';
import CompleteBusinessDetailsForm from '../../../../sections/user/complete/CompleteBusinessDetailsForm';
import CompletePropertyDetailsForm from '../../../../sections/user/complete/CompletePropertyDetailsForm';
import CompleteLocationDetailsForm from '../../../../sections/user/complete/CompleteLocationDetailsForm';
import CompeleteVirtualToursForm from '../../../../sections/user/complete/CompleteVirtualToursForm';
import PropertyFeaturesForm from '../../../../sections/user/complete/CompletePropertyFeaturesForm';
import CompletePropertyImagesForm from '../../../../sections/user/complete/CompletePropertyImagesForm';
import PropertyDocumentsForm from '../../../../sections/user/complete/CompletePropertyDocumentsForm';
import HeaderCard from '../../../../components/HeaderCard';
import { enqueueSnackbar } from 'notistack';
import axiosInstance from '../../../../utils/axios';

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

interface PropertyData {
  _id: string;
  general_details: any;
  business_rates_id?: any;
  descriptions_id?: any;
  sale_types_id?: any;
  epc?: any;
  council_tax?: any;
  rateable_value?: number;
  planning?: any;
  location_id?: any;
  virtual_tours_id?: any;
  features_id?: any;
  images_id?: any;
  documents_id?: any;
}

const CompletePropertyPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [submittedSteps, setSubmittedSteps] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // State to store form data for each step
  const [stepData, setStepData] = useState<Record<number, any>>({});

  const methods = useForm({
    mode: 'onSubmit',
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

  // Fetch property data on component mount
  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setLoadError(null);
        
        const response = await axiosInstance.get(`/api/user/properties/${id}`);
        
        if (response.data.success) {
          const data = response.data.data;
          setPropertyData(data);
          
          // Determine which step to start with based on empty fields
          const firstEmptyStep = findFirstEmptyStep(data);
          setActiveStep(firstEmptyStep);
          
          // Mark completed steps
          const completed = new Set<number>();
          for (let i = 0; i < firstEmptyStep; i++) {
            completed.add(i);
          }
          setCompletedSteps(completed);
          setSubmittedSteps(completed);
          
        } else {
          setLoadError('Failed to load property data');
        }
      } catch (error: any) {
        console.error('Error fetching property:', error);
        setLoadError(error.response?.data?.message || 'Failed to load property data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyData();
  }, [id]);

  // Find the first empty step based on property data
  const findFirstEmptyStep = (data: PropertyData): number => {
    // Check each step in order
    if (!data.general_details || !isGeneralDetailsComplete(data.general_details)) {
      return 0;
    }
    if (!data.business_rates_id && !data.descriptions_id && !data.sale_types_id) {
      return 1;
    }
    if (!data.epc && !data.council_tax && !data.rateable_value && !data.planning) {
      return 2;
    }
    if (!data.location_id) {
      return 3;
    }
    if (!data.virtual_tours_id) {
      return 4;
    }
    if (!data.features_id) {
      return 5;
    }
    if (!data.images_id) {
      return 6;
    }
    if (!data.documents_id) {
      return 7;
    }
    return 0; // All complete, start from beginning
  };

  // Check if general details are complete
  const isGeneralDetailsComplete = (generalDetails: any): boolean => {
    if (!generalDetails) return false;
    
    const requiredFields = [
      'building_name',
      'property_type',
      'property_sub_type',
      'sale_status',
      'address',
      'town_city',
      'postcode',
      'size_minimum',
      'size_maximum',
      'max_eaves_height',
      'approximate_year_of_construction',
      'expansion_capacity_percent',
      'invoice_details',
      'property_notes'
    ];
    
    return requiredFields.every(field => 
      generalDetails[field] !== undefined && 
      generalDetails[field] !== null && 
      generalDetails[field] !== ''
    );
  };

  // Update resolver when step changes
  React.useEffect(() => {
    methods.clearErrors();
  }, [activeStep, methods]);

  const { handleSubmit, trigger, formState: { errors, isValid }, watch, setValue } = methods;

  // Watch form data for validation
  const formData = watch();

  // Check if current step is valid and submitted
  const isCurrentStepValid = () => {
    return submittedSteps.has(activeStep);
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

  // Handle final submission
  const onSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Mark all steps as completed
      const allSteps = Array.from({ length: tabs.length }, (_, i) => i);
      setCompletedSteps(new Set(allSteps));
      
      // Show success message
      enqueueSnackbar('Property completed successfully!', { variant: 'success' });
      router.push('/user/property/my-properties');
      
    } catch (error) {
      console.error('Error completing property:', error);
      setSubmitError('Failed to complete property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render form for current step
  const renderStepContent = () => {
    if (!propertyData) return null;

    switch (activeStep) {
      case 0:
        return (
          <CompleteGeneralDetailsForm 
            propertyId={id as string}
            onStepSubmitted={handleStepSubmission}
            initialData={propertyData.general_details}
            onDataChange={(data) => handleStepDataChange(0, data)}
          />
        );
      case 1:
        return (
          <CompleteBusinessDetailsForm 
            propertyId={id as string}
            onStepSubmitted={handleStepSubmission}
            initialData={{
              business_rates: propertyData.business_rates_id,
              descriptions: propertyData.descriptions_id,
              sale_types: propertyData.sale_types_id,
            }}
            onDataChange={(data) => handleStepDataChange(1, data)}
          />
        );
      case 2:
        return (
          <CompletePropertyDetailsForm 
            propertyId={id as string}
            onStepSubmitted={handleStepSubmission}
            initialData={{
              epc: propertyData.epc,
              council_tax: propertyData.council_tax,
              rateable_value: propertyData.rateable_value,
              planning: propertyData.planning,
            }}
            onDataChange={(data) => handleStepDataChange(2, data)}
          />
        );
      case 3:
        return (
          <CompleteLocationDetailsForm
            propertyId={id as string}
            onStepSubmitted={handleStepSubmission}
            initialData={propertyData.location_id}
            onDataChange={(data) => handleStepDataChange(3, data)}
          />
        );
      case 4:
        return (
          <CompeleteVirtualToursForm
            propertyId={id as string}
            onStepSubmitted={handleStepSubmission}
            initialData={propertyData.virtual_tours_id}
            onDataChange={(data) => handleStepDataChange(4, data)}
          />
        );
      case 5:
        return (
          <PropertyFeaturesForm
            propertyId={id as string}
            onStepSubmitted={handleStepSubmission}
          />
        );
      case 6:
        return (
          <CompletePropertyImagesForm
            propertyId={id as string}
            onStepSubmitted={handleStepSubmission}
          />
        );
      case 7:
        return (
          <PropertyDocumentsForm
            propertyId={id as string}
            onStepSubmitted={handleStepSubmission}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading property data...
        </Typography>
      </Box>
    );
  }

  if (loadError) {
    return (
      <Box>
        <HeaderCard title="Complete Property" subtitle="Complete your property listing" breadcrumbs={['Home', 'Property', 'Complete Property']} />
        <Alert severity="error" sx={{ mt: 3 }}>
          {loadError}
        </Alert>
      </Box>
    );
  }

  if (!propertyData) {
    return (
      <Box>
        <HeaderCard title="Complete Property" subtitle="Complete your property listing" breadcrumbs={['Home', 'Property', 'Complete Property']} />
        <Alert severity="error" sx={{ mt: 3 }}>
          Property not found
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <HeaderCard 
        title="Complete Property" 
        subtitle="Complete your property listing to make it visible to others" 
        breadcrumbs={['Home', 'Property', 'Complete Property']} 
      />

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
                    sx={{
                      cursor: 'default',
                      minWidth: 120,
                      '& .MuiStepLabel-label': {
                        fontSize: '0.875rem',
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
                          cursor: 'default',
                          transition: 'all 0.2s ease-in-out',
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
                    {isSubmitting ? 'Completing Property...' : 'Complete Property'}
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

export default CompletePropertyPage;
