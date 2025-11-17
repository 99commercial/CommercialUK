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
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
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
  FileUpload,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Import form components
import GeneralDetailsForm from '../../../sections/user/property/GeneralDetailsForm';
import BusinessDetailsForm from '../../../sections/user/property/BusinessDetailsForm';
import PropertyDetailsForm from '../../../sections/user/property/PropertyDetailsForm';
import LocationDetailsForm from '../../../sections/user/property/LocationDetailsForm';
import VirtualToursForm from '../../../sections/user/property/VirtualToursForm';
import PropertyFeaturesForm from '../../../sections/user/property/PropertyFeaturesForm';
import PropertyImagesForm from '../../../sections/user/property/PropertyImagesForm';
import PropertyDocumentsForm from '../../../sections/user/property/PropertyDocumentsForm';
import HeaderCard from '../../../components/HeaderCard';
import { enqueueSnackbar } from 'notistack';
import axiosInstance from '@/utils/axios';

// Tab configuration
const tabs = [
  {
    id: 'general',
    label: 'General Details',
    icon: <Home />,
    description: 'Basic property information',
    color: '#f2c514',
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
  const [isLoadingProperty, setIsLoadingProperty] = useState(false);
  const [propertyData, setPropertyData] = useState<any>(null);
  
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

  const [importLink, setImportLink] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importedData, setImportedData] = useState<any>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);

  // Fetch property data from localStorage on mount

    const fetchPropertyData = async () => {
      try {
        // Get newPropertyId from localStorage
        const storedPropertyId = typeof window !== 'undefined' 
          ? localStorage.getItem('newpropertyId') 
          : null;

        if (storedPropertyId) {
          setIsLoadingProperty(true);
          setPropertyId(storedPropertyId);

          // Fetch property data from API
          const response = await axiosInstance.get(`/api/user/properties/${storedPropertyId}`);
          const data = response.data.data;
          setPropertyData(data);

          // Determine which steps have data and mark them as completed
          const stepsWithData = new Set<number>();
          
          // Step 0: General Details
          if (data.general_details) {
            stepsWithData.add(0);
            setStepData(prev => ({ ...prev, 0: data.general_details }));
          }

          // Step 1: Business Details
          if (data.business_rates_id || data.descriptions_id || (data.sale_types_id?.sale_types && Array.isArray(data.sale_types_id.sale_types) && data.sale_types_id.sale_types.length > 0)) {
            stepsWithData.add(1);
            setStepData(prev => ({
              ...prev,
              1: {
                business_rates: data.business_rates_id,
                descriptions: data.descriptions_id,
                sale_types: (data.sale_types_id?.sale_types && Array.isArray(data.sale_types_id.sale_types))
                  ? data.sale_types_id.sale_types.map((st: any) => ({
                      sale_type: st.sale_type || '',
                      price_currency: st.price_currency || 'GBP',
                      price_value: st.price_value || '',
                      price_unit: st.price_unit || '',
                    }))
                  : [],
              }
            }));
          }

          // Step 2: Property Details
          if (data.epc || data.council_tax || data.rateable_value || data.planning) {
            stepsWithData.add(2);
            setStepData(prev => ({
              ...prev,
              2: {
                epc: data.epc,
                council_tax: data.council_tax,
                rateable_value: data.rateable_value,
                planning: data.planning,
              }
            }));
          }

          // Step 3: Location
          if (data.location_id) {
            stepsWithData.add(3);
            setStepData(prev => ({
              ...prev,
              3: {
                coordinates: data.location_id.coordinates,
                address_details: data.location_id,
              }
            }));
            // Set form values for location
            if (data.location_id.coordinates) {
              methods.setValue('coordinates', data.location_id.coordinates);
            }
            if (data.location_id) {
              methods.setValue('address_details', data.location_id);
            }
          }

          // Step 4: Virtual Tours
          // virtual_tours_id is an object with _id and virtual_tours array inside
          if (data.virtual_tours_id?._id) {
            // Get the virtual_tours array from inside the virtual_tours_id object
            const virtualToursArray = Array.isArray(data.virtual_tours_id.virtual_tours) 
              ? data.virtual_tours_id.virtual_tours 
              : [];
            
            // Mark as completed if virtual_tours_id object exists (even if virtual_tours array is empty)
            stepsWithData.add(4);
            setStepData(prev => ({
              ...prev,
              4: { virtual_tours: virtualToursArray }
            }));
            methods.setValue('virtual_tours', virtualToursArray);
          }

          // Step 5: Features
          if (data.features_id) {
            stepsWithData.add(5);
            setStepData(prev => ({
              ...prev,
              5: {
                features: data.features_id,
                additional_features: data.features_id.additional_features || [],
                feature_notes: data.features_id.feature_notes || '',
              }
            }));
            methods.setValue('features', data.features_id);
            methods.setValue('additional_features', data.features_id.additional_features || []);
            methods.setValue('feature_notes', data.features_id.feature_notes || '');
          }

          // Step 6: Images
          if (data.images_id && data.images_id.images && data.images_id.images.length > 0) {
            stepsWithData.add(6);
            setStepData(prev => ({
              ...prev,
              6: { property_images: data.images_id.images }
            }));
            methods.setValue('property_images', data.images_id.images);
          }

          // Step 7: Documents
          if (data.documents_id && data.documents_id.documents && data.documents_id.documents.length > 0) {
            stepsWithData.add(7);
            setStepData(prev => ({
              ...prev,
              7: { property_documents: data.documents_id.documents }
            }));
            methods.setValue('property_documents', data.documents_id.documents);
          }

          // Mark all steps with data as completed and submitted
          setCompletedSteps(stepsWithData);
          setSubmittedSteps(stepsWithData);

          // Set active step to the first incomplete step, or the last completed step if all are complete
          const allSteps = Array.from({ length: tabs.length }, (_, i) => i);
          const firstIncompleteStep = allSteps.find(step => !stepsWithData.has(step));
          if (firstIncompleteStep !== undefined) {
            setActiveStep(firstIncompleteStep);
          } else {
            // All steps are complete, go to the last step
            setActiveStep(tabs.length - 1);
          }
        }
      } catch (error: any) {
        console.error('Error fetching property data:', error);
        enqueueSnackbar('Failed to load property data', { variant: 'error' });
      } finally {
        setIsLoadingProperty(false);
      }
    };

  useEffect(() => {
    fetchPropertyData();
  }, []);

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
    // Allow navigation to:
    // 1. Any completed step (to go back)
    // 2. The current step (already there)
    // 3. Any step up to and including the next step after the last completed step (to move forward)
    const lastCompletedStep = Math.max(...Array.from(completedSteps), -1);
    const maxAllowedStep = lastCompletedStep + 1;
    
    // Allow navigation if:
    // - Step is completed (can go back)
    // - Step is the current active step (can stay/refresh)
    // - Step is within allowed range (can move forward up to next step)
    if (completedSteps.has(step) || step === activeStep || step <= maxAllowedStep) {
      setActiveStep(step);
    }
  };

  // Handle step submission (called by child components)
  const handleStepSubmission = (step: number) => {
    setSubmittedSteps(prev => new Set(Array.from(prev).concat(step)));
    setCompletedSteps(prev => new Set(Array.from(prev).concat(step)));
  };

  // Handle data changes from child components with useCallback to prevent infinite loops
  const handleStepDataChange = React.useCallback((step: number, data: any) => {
    setStepData(prev => ({
      ...prev,
      [step]: data
    }));
  }, []);

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
      router.push('/user/property/my-properties');
      
      // Optional: redirect to property list
      // router.push('/agent/properties');
    } catch (error) {
      console.error('Error submitting property:', error);
      setSubmitError('Failed to create property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to check if data exists for a step
  const hasDataForStep = (step: number): boolean => {
    if (!propertyData) return false;
    
    switch (step) {
      case 0:
        return !!propertyData.general_details;
      case 1:
        return !!(propertyData.business_rates_id || propertyData.descriptions_id || (propertyData.sale_types_id && propertyData.sale_types_id.length > 0));
      case 2:
        return !!(propertyData.epc || propertyData.council_tax || propertyData.rateable_value || propertyData.planning);
      case 3:
        return !!propertyData.location_id;
      case 4:
        // virtual_tours_id is an object with _id and virtual_tours array inside
        return !!(propertyData.virtual_tours_id?._id);
      case 5:
        return !!propertyData.features_id;
      case 6:
        return !!(propertyData.images_id && propertyData.images_id.images && propertyData.images_id.images.length > 0);
      case 7:
        return !!(propertyData.documents_id && propertyData.documents_id.documents && propertyData.documents_id.documents.length > 0);
      default:
        return false;
    }
  };

  // Render form for current step
  const renderStepContent = () => {
    const hasExistingData = hasDataForStep(activeStep);
    
    switch (activeStep) {
      case 0:
        return (
          <GeneralDetailsForm 
            onStepSubmitted={handleStepSubmission}
            initialData={stepData[0]}
            onDataChange={(data) => handleStepDataChange(0, data)}
            propertyData={propertyData}
            hasExistingData={hasExistingData}
            fetchPropertyData={fetchPropertyData}
          />
        );
      case 1:
        return (
          <BusinessDetailsForm 
            onStepSubmitted={handleStepSubmission}
            initialData={stepData[1]}
            onDataChange={(data) => handleStepDataChange(1, data)}
            propertyData={propertyData}
            hasExistingData={hasExistingData}
            fetchPropertyData={fetchPropertyData}
          />
        );
      case 2:
        return (
          <PropertyDetailsForm 
            onStepSubmitted={handleStepSubmission}
            initialData={stepData[2]}
            onDataChange={(data) => handleStepDataChange(2, data)}
            propertyData={propertyData}
            hasExistingData={hasExistingData}
            fetchPropertyData={fetchPropertyData}
          />
        );
      case 3:
        return (
          <LocationDetailsForm
            onStepSubmitted={handleStepSubmission}
            propertyData={propertyData}
            hasExistingData={hasExistingData}
            fetchPropertyData={fetchPropertyData}
          />
        );
      case 4:
        return (
          <VirtualToursForm
            onStepSubmitted={handleStepSubmission}
            propertyData={propertyData}
            hasExistingData={hasExistingData}
            fetchPropertyData={fetchPropertyData}
          />
        );
      case 5:
        return (
          <PropertyFeaturesForm
            onStepSubmitted={handleStepSubmission}
            propertyData={propertyData}
            hasExistingData={hasExistingData}
            fetchPropertyData={fetchPropertyData}
          />
        );
      case 6:
        return (
          <PropertyImagesForm 
            onStepSubmitted={handleStepSubmission}
            propertyData={propertyData}
            fetchPropertyData={fetchPropertyData}
            hasExistingData={hasExistingData}
          />
        );
      case 7:
        return (
          <PropertyDocumentsForm 
            onStepSubmitted={handleStepSubmission}
          />
        );
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
              {tabs.map((tab, index) => {
                const isCompleted = completedSteps.has(index);
                const lastCompletedStep = Math.max(...Array.from(completedSteps), -1);
                const maxAllowedStep = lastCompletedStep + 1;
                // Allow clicking on: completed steps, current step, or any step up to next step after last completed
                const isClickable = isCompleted || index === activeStep || index <= maxAllowedStep;
                
                return (
                  <Step key={tab.id} completed={isCompleted}>
                    <StepLabel
                      onClick={() => handleStepClick(index)}
                      sx={{
                        cursor: isClickable ? 'pointer' : 'not-allowed',
                        minWidth: 120,
                        opacity: isClickable ? 1 : 0.6,
                        '& .MuiStepLabel-label': {
                          fontSize: '0.875rem',
                        },
                        '&:hover': {
                          opacity: isClickable ? 1 : 0.6,
                          '& .MuiStepLabel-label': {
                            color: isClickable ? 'primary.main' : 'text.secondary',
                          },
                        },
                      }}
                      StepIconComponent={({ active, completed }) => (
                        <Box
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isClickable) {
                              handleStepClick(index);
                            }
                          }}
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: completed ? tab.color : active ? tab.color : '#e5e7eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            cursor: isClickable ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s ease-in-out',
                            opacity: isClickable ? 1 : 0.6,
                            '&:hover': {
                              transform: isClickable ? 'scale(1.1)' : 'scale(1)',
                              boxShadow: isClickable ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                              opacity: isClickable ? 1 : 0.6,
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
                );
              })}
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

      {/* Loading State */}
      {isLoadingProperty && (
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Loading property data...
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Form Content */}
      {!isLoadingProperty && (
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
      )}

      {/* Progress Summary */}
      {!isLoadingProperty && (
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
      )}
    </Box>
  );
};

export default CreatePropertyPage;
