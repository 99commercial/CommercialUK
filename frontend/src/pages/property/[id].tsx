import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Box,
  Container,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Typography,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import SearchIcon from '@mui/icons-material/Search';
import { enqueueSnackbar } from 'notistack';
import { Property } from '../../components/PropertyCard';
import {
  PropertyHeader,
  PropertyImageCarousel,
  PropertyDetails,
  PropertySidebar,
} from '../../sections/property';
import axiosInstance from '../../utils/axios';

// ----------------------------------------------------------------------

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
  padding: theme.spacing(2, 0),
  width: '100%',
}));

const ContentSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  width: '100%',
  padding: theme.spacing(0, 3),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    padding: theme.spacing(0, 2),
  },
}));


// ----------------------------------------------------------------------

// // Mock property data - in real app, this would come from API
// const mockProperty: Property = {
//   _id: '1',
//   general_details: {
//     building_name: 'Modern Office Complex',
//     address: '123 Business Street',
//     town_city: 'London',
//     postcode: 'SW1A 1AA',
//     country_region: 'United Kingdom',
//     sale_status: 'Available',
//     property_type: 'Office',
//     property_sub_type: 'Grade A Office',
//     size_minimum: 5000,
//     size_maximum: 5000,
//     approximate_year_of_construction: 2020,
//     expansion_capacity_percent: 20,
//     invoice_details: 'Standard office space with modern amenities',
//     max_eaves_height: 10,
//     property_notes: 'Prime location with excellent transport links',
//   },
//   business_rates_id: {
//     _id: 'mock_business_rates_id',
//     property_id: '1',
//     rateable_value_gbp: 500,
//     rates_payable_gbp: 700,
//     createdAt: '2024-01-15T10:00:00Z',
//     updatedAt: '2024-01-15T10:00:00Z',
//     deleted_at: null,
//     __v: 0,
//   },
//   descriptions_id: {
//     _id: 'mock_descriptions_id',
//     property_id: '1',
//     accommodation: 'Prime location office space with modern amenities and excellent transport links.',
//     general: 'This modern office complex offers premium Grade A office space in the heart of London. Features include state-of-the-art facilities, 24/7 security, and excellent transport connectivity.',
//     location: 'Located in the heart of London with excellent transport links and nearby amenities.',
//     specifications: 'The building boasts modern design with floor-to-ceiling windows, high-speed elevators, and flexible floor plans.',
//     terms: 'Flexible lease terms available with various options to suit different business needs.',
//     createdAt: '2024-01-15T10:00:00Z',
//     updatedAt: '2024-01-15T10:00:00Z',
//     deleted_at: null,
//     __v: 0,
//   },
//   sale_types_id: {
//     _id: 'mock_sale_types_id',
//     property_id: '1',
//     sale_types: [
//       {
//         _id: 'mock_sale_type_1',
//         sale_type: 'Leasehold',
//         price_currency: 'GBP',
//         price_value: 600,
//         price_unit: 'per sq ft',
//       },
//     ],
//     createdAt: '2024-01-15T10:00:00Z',
//     updatedAt: '2024-01-15T10:00:00Z',
//     deleted_at: null,
//     __v: 0,
//   },
//   images_id: {
//     _id: 'mock_images_id',
//     property_id: '1',
//     images: [
//       {
//         _id: 'mock_image_1',
//         caption: 'Modern office building exterior',
//         file_name: 'office_exterior.jpg',
//         file_size: 59213,
//         image_type: 'Photo',
//         is_thumbnail: true,
//         mime_type: 'image/jpeg',
//         order: 0,
//         upload_status: 'Completed',
//         url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
//       },
//       {
//         _id: 'mock_image_2',
//         caption: 'Office lobby',
//         file_name: 'office_lobby.jpg',
//         file_size: 117672,
//         image_type: 'Photo',
//         is_thumbnail: false,
//         mime_type: 'image/jpeg',
//         order: 1,
//         upload_status: 'Completed',
//         url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
//       },
//       {
//         _id: 'mock_image_3',
//         caption: 'Office interior',
//         file_name: 'office_interior.jpg',
//         file_size: 85632,
//         image_type: 'Photo',
//         is_thumbnail: false,
//         mime_type: 'image/jpeg',
//         order: 2,
//         upload_status: 'Completed',
//         url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800',
//       },
//       {
//         _id: 'mock_image_4',
//         caption: 'Conference room',
//         file_name: 'conference_room.jpg',
//         file_size: 72345,
//         image_type: 'Photo',
//         is_thumbnail: false,
//         mime_type: 'image/jpeg',
//         order: 3,
//         upload_status: 'Completed',
//         url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
//       },
//     ],
//     createdAt: '2024-01-15T10:00:00Z',
//     updatedAt: '2024-01-15T10:00:00Z',
//     deleted_at: null,
//     __v: 0,
//   },
//   is_active: true,
//   is_featured: true,
//   is_verified: true,
//   property_status: 'Active',
//   createdAt: '2024-01-15T10:00:00Z',
//   updatedAt: '2024-01-15T10:00:00Z',
//   __v: 0,
// };

const PropertyDetailPage: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { id } = router.query;

  // State management
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showQuerySection, setShowQuerySection] = useState(true);
  const [favoriteProperties, setFavoriteProperties] = useState<string[]>([]);

  // Check user authentication
  const checkUserAuth = () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          return parsedUser;
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('user');
          return null;
        }
      }
    }
    return null;
  };

  // Fetch user's favorite properties
  const fetchFavorites = async () => {
    const currentUser = checkUserAuth();
    if (!currentUser) return;

    try {
      const endpoint = currentUser.role === 'user' 
        ? '/api/user/favorites' 
        : '/api/agent/favorites';
      
      const response = await axiosInstance.get(endpoint);
      
      if (response.data.success) {
        setFavoriteProperties(response.data.data);
        // Update isFavorite state for current property
        if (id && typeof id === 'string') {
          setIsFavorite(response.data.data.includes(id));
        }
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  // Add property to favorites
  const addToFavorites = async (propertyId: string) => {
    const currentUser = checkUserAuth();
    if (!currentUser) {
      enqueueSnackbar('Please login to add favorites', { variant: 'warning' });
      return;
    }

    try {
      const endpoint = currentUser.role === 'user' 
        ? `/api/user/favorites/${propertyId}` 
        : `/api/agent/favorites/${propertyId}`;
      
      const response = await axiosInstance.post(endpoint);
      
      if (response.data.success) {
        setFavoriteProperties(prev => [...prev, propertyId]);
        setIsFavorite(true);
        enqueueSnackbar('Added to favorites', { variant: 'success' });
      }
    } catch (error: any) {
      console.error('Error adding to favorites:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add to favorites';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  // Remove property from favorites
  const removeFromFavorites = async (propertyId: string) => {
    const currentUser = checkUserAuth();
    if (!currentUser) return;

    try {
      const endpoint = currentUser.role === 'user' 
        ? `/api/user/favorites/${propertyId}` 
        : `/api/agent/favorites/${propertyId}`;
      
      const response = await axiosInstance.delete(endpoint);
      
      if (response.data.success) {
        setFavoriteProperties(prev => prev.filter(id => id !== propertyId));
        setIsFavorite(false);
        enqueueSnackbar('Removed from favorites', { variant: 'success' });
      }
    } catch (error: any) {
      console.error('Error removing from favorites:', error);
      const errorMessage = error.response?.data?.message || 'Failed to remove from favorites';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    if (!id || typeof id !== 'string') return;
    
    const currentUser = checkUserAuth();
    if (!currentUser) {
      enqueueSnackbar('Please login to add properties to your favorites', { variant: 'warning' });
      return;
    }

    if (isFavorite) {
      removeFromFavorites(id);
    } else {
      addToFavorites(id);
    }
  };

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!id || typeof id !== 'string') {
          throw new Error('Invalid property ID');
        }

        // Fetch property data from API
        const response = await axiosInstance.get(`/api/agent/properties/${id}`);
        const propertyData = response.data.data;
        
        setProperty(propertyData);
        
        // Check if current user is the one who listed this property
        const currentUser = checkUserAuth();
        if (currentUser) {
          if (propertyData.listed_by && propertyData.listed_by._id === currentUser.id) {
            setShowQuerySection(false);
          }
          // Fetch user's favorites to check if this property is favorited
          fetchFavorites();
        }
      } catch (err: any) {
        // Check if it's a 404 or ObjectId error
        if (err.response?.status === 404 || err.message?.includes('Cast to ObjectId failed') || err.message?.includes('not found')) {
          setError('This property doesn\'t exist');
        } else {
          setError(err.message || 'Failed to fetch property details');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  // Image carousel handlers
  const nextImage = () => {
    if (property?.images_id?.images) {
      setCurrentImageIndex((prev) => 
        prev === property.images_id!.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property?.images_id?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images_id!.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        </Container>
      </PageContainer>
    );
  }

  if (error || !property) {
    return (
      <PageContainer>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '80vh',
              width: '100%',
              textAlign: 'center',
              px: 3,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '3rem' },
                color: '#000',
                mb: 2,
                lineHeight: 1.2,
              }}
            >
              This property doesn't exist
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                fontSize: { xs: '1rem', md: '1.25rem' },
                color: '#666',
                mb: 4,
                maxWidth: 500,
                lineHeight: 1.4,
              }}
            >
              It looks like the property you're looking for doesn't exist or has been removed. Maybe try searching for other properties?
            </Typography>
          </Box>
        </Container>
      </PageContainer>
    );
  }

  const images = property.images_id?.images || [];
  const firstImageUrl =
    images && images.length > 0
      ? [...images].sort((a, b) => (a.order || 0) - (b.order || 0))[0]?.url
      : '/placeholder-property.jpg';
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const pageUrl = origin ? `${origin}${typeof window !== 'undefined' ? window.location.pathname : ''}` : '';
  const ogTitle = property.general_details.building_name || 'Property on 99Commercial';
  const ogDescription =
    property.descriptions_id?.general ||
    `${property.general_details.property_sub_type} in ${property.general_details.town_city}`;

  return (
    <PageContainer>
      <Head>
        <title>{ogTitle}</title>
        <meta property="og:type" content="website" />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={firstImageUrl} />
        {pageUrl && <meta property="og:url" content={pageUrl} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image" content={firstImageUrl} />
      </Head>

      <PropertyHeader
        property={property}
        isFavorite={isFavorite}
        onFavoriteToggle={handleFavoriteToggle}
        onShare={() => console.log('Share clicked')}
      />

      {/* Image Carousel Section */}
      <PropertyImageCarousel
        images={images}
        currentImageIndex={currentImageIndex}
        onNextImage={nextImage}
        onPrevImage={prevImage}
      />

      {/* Content and Query Form Section */}
      <ContentSection>
        {/* Main Content */}
        <PropertyDetails property={property} />

        {/* Sidebar Content - Only show query section if property is not listed by current user */}
        {showQuerySection && (
          <PropertySidebar
            property={property}
          />
        )}
      </ContentSection>
    </PageContainer>
  );
};

export default PropertyDetailPage;
