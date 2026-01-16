import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Typography,
  CircularProgress,
  Button,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
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
import HeaderCard from '../../../../components/HeaderCard';
import { enqueueSnackbar } from 'notistack';
import axiosInstance from '@/utils/axios';

// Import form components
import UpdateGeneralDetailsForm from '../../../../sections/agent/property/edit/UpdateGeneralDetailsForm';
import UpdateBusinessDetailsForm from '../../../../sections/agent/property/edit/UpdateBusinessDetailsForm';
import UpdatePropertyDetailsForm from '../../../../sections/agent/property/edit/UpdatePropertyDetailsForm';
import UpdateLocationDetailsForm from '../../../../sections/agent/property/edit/UpdateLocationDetailsForm';
import UpdateVirtualToursForm from '../../../../sections/agent/property/edit/UpdateVirtualToursForm';
import UpdatePropertyFeaturesForm from '../../../../sections/agent/property/edit/UpdatePropertyFeaturesForm';
import UpdatePropertyImagesForm from '../../../../sections/agent/property/edit/UpdatePropertyImagesForm';
import UpdatePropertyDocumentsForm from '../../../../sections/agent/property/edit/UpdatePropertyDocumentsForm';

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


const EditPropertyPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  console.log(id);

  const [isLoading, setIsLoading] = useState(true);
  const [propertyData, setPropertyData] = useState<any>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState<any>({});

  // Fetch property data on component mount
  useEffect(() => {
    if (id) {
      fetchPropertyData();
    }
  }, [id]);

  // Fetch property data from API
  const fetchPropertyData = async () => {
    try {
      setIsLoading(true);
      // Mock API call - replace with actual API endpoint
      const response = await axiosInstance.get(`/api/agent/properties/${id}`);
      setPropertyData(response.data.data);

    } catch (error) {
      console.error('Error fetching property data:', error);
      enqueueSnackbar('Failed to load property data', { variant: 'error' });
      router.push('/agent/property/properties');
    } finally {
      setIsLoading(false);
    }
  };


  // Handle step click for navigation
  const handleStepClick = (step: number) => {
    setActiveStep(step);
  };

  // Handle form data changes
  const handleFormDataChange = useCallback((stepIndex: number, data: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [stepIndex]: data
    }));
  }, []);

  // Create stable callbacks for each step
  const dataChangeCallback0 = useCallback((data: any) => handleFormDataChange(0, data), [handleFormDataChange]);
  const dataChangeCallback1 = useCallback((data: any) => handleFormDataChange(1, data), [handleFormDataChange]);
  const dataChangeCallback2 = useCallback((data: any) => handleFormDataChange(2, data), [handleFormDataChange]);
  const dataChangeCallback3 = useCallback((data: any) => handleFormDataChange(3, data), [handleFormDataChange]);
  const dataChangeCallback4 = useCallback((data: any) => handleFormDataChange(4, data), [handleFormDataChange]);
  const dataChangeCallback5 = useCallback((data: any) => handleFormDataChange(5, data), [handleFormDataChange]);
  const dataChangeCallback6 = useCallback((data: any) => handleFormDataChange(6, data), [handleFormDataChange]);
  const dataChangeCallback7 = useCallback((data: any) => handleFormDataChange(7, data), [handleFormDataChange]);
  const dataChangeCallback8 = useCallback((data: any) => handleFormDataChange(8, data), [handleFormDataChange]);

  // Mark step as completed
  const handleStepCompleted = (stepIndex: number) => {
    setCompletedSteps((prev: Set<number>) => new Set([...Array.from(prev), stepIndex]));
  };

  // Render the appropriate form based on active step
  const renderActiveForm = () => {

    switch (activeStep) {
      case 0:
        return <UpdateGeneralDetailsForm       
        propertyId={id as string}
        initialData={propertyData?.general_details}
        onDataChange={dataChangeCallback0}
        onStepSubmitted={() => handleStepCompleted(activeStep)} 
        fetchPropertyData={fetchPropertyData}
        />;
      case 1:
        return <UpdateBusinessDetailsForm       
        propertyId={id as string}
        initialData={propertyData}
        onDataChange={dataChangeCallback1}
        onStepSubmitted={() => handleStepCompleted(activeStep)} 
        fetchPropertyData={fetchPropertyData}
        />;
      case 2:
        return <UpdatePropertyDetailsForm       
        propertyId={id as string}
        initialData={propertyData}
        onDataChange={dataChangeCallback2}
        onStepSubmitted={() => handleStepCompleted(activeStep)} 
        fetchPropertyData={fetchPropertyData}
      />;
      case 3:
        return <UpdateLocationDetailsForm 
        propertyId={id as string}
        initialData={propertyData?.location_id}
        onDataChange={dataChangeCallback3}
        onStepSubmitted={() => handleStepCompleted(activeStep)} 
        fetchPropertyData={fetchPropertyData}
        />;
      case 4:
        return <UpdateVirtualToursForm 
        propertyId={id as string}
        initialData={propertyData?.virtual_tours_id}
        onDataChange={dataChangeCallback4}
        onStepSubmitted={() => handleStepCompleted(activeStep)} 
        fetchPropertyData={fetchPropertyData}
        />;
      case 5:
        return <UpdatePropertyFeaturesForm 
          propertyId={id as string}
        initialData={propertyData?.features_id}
        onDataChange={dataChangeCallback5}
        onStepSubmitted={() => handleStepCompleted(activeStep)} 
        fetchPropertyData={fetchPropertyData}
        />;
      case 6:
        return <UpdatePropertyImagesForm      
        propertyId={id as string}
        initialData={propertyData?.images_id}
        onDataChange={dataChangeCallback6}
        onStepSubmitted={() => handleStepCompleted(activeStep)} 
        fetchPropertyData={fetchPropertyData}
        />;
      case 7:
        return <UpdatePropertyDocumentsForm 
        propertyId={id as string}
        initialData={propertyData?.documents_id}
        onDataChange={dataChangeCallback7}
        onStepSubmitted={() => handleStepCompleted(activeStep)} 
        fetchPropertyData={fetchPropertyData}
        />;
      default:
        return <UpdateGeneralDetailsForm 
        propertyId={id as string}
        initialData={propertyData}
        onDataChange={dataChangeCallback8}
        onStepSubmitted={() => handleStepCompleted(activeStep)} 
        fetchPropertyData={fetchPropertyData}
        />;
    }
  };



  // Show loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading property data...
        </Typography>
      </Box>
    );
  }

  // Show error if property not found
  if (!propertyData) {
    return (
      <Box>
        <HeaderCard 
          title="Property Not Found" 
          subtitle="The property you're looking for doesn't exist or you don't have permission to edit it"
          breadcrumbs={['Home', 'Property', 'Edit Property']} 
        />
        <Card sx={{ mt: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Property Not Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              The property you're trying to edit doesn't exist or you don't have permission to access it.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <HeaderCard 
        title="Edit Property" 
        subtitle={`Update your property details and information - Step ${activeStep + 1} of ${tabs.length}`}
        breadcrumbs={['Home', 'Property', 'Edit Property']} 
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
              alternativeLabel
              sx={{
                minWidth: 'max-content',
                px: 2,
                py: 3,
              }}
            >
              {tabs.map((tab, index) => (
                <Step key={tab.id}>
                  <Box
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        '& .step-label': {
                          color: 'primary.main !important',
                          fontWeight: '600 !important',
                        },
                        '& .step-description': {
                          color: 'primary.main !important',
                        },
                        '& .step-icon': {
                          backgroundColor: `${tab.color} !important`,
                          transform: 'scale(1.1)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        },
                      },
                    }}
                    onClick={() => handleStepClick(index)}
                  >
                    <StepLabel
                      sx={{
                        cursor: 'pointer',
                        minWidth: 120,
                        opacity: 1,
                        transition: 'all 0.2s ease-in-out',
                        '& .MuiStepLabel-label': {
                          fontSize: '0.875rem',
                          color: activeStep === index ? 'primary.main' : 'text.primary',
                          fontWeight: activeStep === index ? 600 : 400,
                          transition: 'all 0.2s ease-in-out',
                        },
                      }}
                    StepIconComponent={() => {
                      const isActive = activeStep === index;
                      const isCompleted = completedSteps.has(index);
                      
                      return (
                        <Box
                          className="step-icon"
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                            backgroundColor: isActive ? tab.color : '#e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                            position: 'relative',
                        }}
                      >
                        {tab.icon}
                      </Box>
                      );
                    }}
                  >
                    <Box>
                      <Typography 
                        className="step-label"
                        variant="body2" 
                        fontWeight={activeStep === index ? 600 : 400}
                        sx={{
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        {tab.label}
                      </Typography>
                      <Typography 
                        className="step-description"
                        variant="caption" 
                        color={activeStep === index ? 'primary.main' : 'text.secondary'}
                        sx={{
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        {tab.description}
                      </Typography>
                    </Box>
                  </StepLabel>
                  </Box>
                </Step>
              ))}
            </Stepper>
          </Box>
        </CardContent>
      </Card>


      {/* Active Form */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
              {tabs[activeStep]?.label}
                    </Typography>
            <Typography variant="body2" color="text.secondary">
              {tabs[activeStep]?.description}
                    </Typography>
          </Box>
          {renderActiveForm()}
        </CardContent>
      </Card>

      {/* Navigation Buttons
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button 
            variant="outlined" 
          onClick={() => router.push('/agent/property/my-properties')}
          >
            Back to Properties
          </Button>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {activeStep > 0 && (
            <Button 
              variant="outlined" 
              onClick={() => setActiveStep(activeStep - 1)}
            >
              Previous
            </Button>
          )}
          {activeStep < tabs.length - 1 && (
            <Button 
              variant="contained" 
              onClick={() => setActiveStep(activeStep + 1)}
            >
              Next
            </Button>
          )}
        </Box>
      </Box> */}

    </Box>
  );
};

export default EditPropertyPage;
