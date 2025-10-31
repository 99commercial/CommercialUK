import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Property } from '../../components/PropertyCard';
import { useRouter } from 'next/router';
import axiosInstance from '../../utils/axios';
import { enqueueSnackbar } from 'notistack';
import ListAllProperties from '../../sections/general/list_all_properties';
import InteractiveMap from '../../sections/general/InteractiveMap';

// ----------------------------------------------------------------------

const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 0),
  background: `
    linear-gradient(45deg, #cc0000 0%, #ff0000 25%, #cc0000 50%, #ff0000 75%, #cc0000 100%),
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
  `,
  backgroundSize: '400% 400%, 300px 300px, 300px 300px, 200px 200px',
  color: '#ffffff',
  position: 'relative',
  display: 'flex',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 8px,
        rgba(255, 255, 255, 0.08) 8px,
        rgba(255, 255, 255, 0.08) 16px
      )
    `,
    pointerEvents: 'none',
  },
}));

const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  width: '100%',
  margin: '0', 
  position: 'relative',
  zIndex: 2,
}));




// ----------------------------------------------------------------------


const AllPropertiesPage: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State management
  const [properties, setProperties] = useState<Property[]>([]);
  const [displayProperties, setDisplayProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [favoriteProperties, setFavoriteProperties] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isAreaFiltered, setIsAreaFiltered] = useState(false);

  // Check user authentication
  const checkUserAuth = () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
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
        // Now response.data.data is directly an array of property IDs
        setFavoriteProperties(response.data.data);
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
        enqueueSnackbar('Removed from favorites', { variant: 'success' });
      }
    } catch (error: any) {
      console.error('Error removing from favorites:', error);
      const errorMessage = error.response?.data?.message || 'Failed to remove from favorites';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  // fetchProperty function that fetches ALL properties
  const fetchProperty = async () => {
    setLoading(true);
    setError(null);

    try {
      // Make API call to fetch all properties (public endpoint)
      const response = await axiosInstance.get('/api/agent/properties/all', {
        params: {
          page: currentPage,
          limit: 12,
        },
      });

      if (response.data.success) {
        const fetchedProperties = response.data.data.properties || [];
        setProperties(fetchedProperties);
        setDisplayProperties(fetchedProperties);
        setTotalPages(response.data.data.pagination.total_pages || 1);
        setTotalCount(response.data.data.pagination.total_documents || 0);
      } else {
        throw new Error(response.data.message || 'Failed to load properties');
      }
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load properties';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    fetchProperty();
  };

  // Handle favorite toggle
  const handleFavorite = async (propertyId: string) => {
    const currentUser = checkUserAuth();
    
    if (!currentUser) {
      enqueueSnackbar('Please login to add properties to your favorites', { variant: 'warning' });
      router.push('/auth/login');
      return;
    }

    const isCurrentlyFavorite = favoriteProperties.includes(propertyId);
    
    if (isCurrentlyFavorite) {
      removeFromFavorites(propertyId);
    } else {
      addToFavorites(propertyId);
    }
  };

  // Handle view details
  const handleViewDetails = (propertyId: string) => {
    router.push(`/property/${propertyId}`);
  };

  // Handle area search (filtered properties from map)
  const handleAreaSearch = (filteredProperties: Property[]) => {
    setDisplayProperties(filteredProperties);
    setIsAreaFiltered(filteredProperties.length !== properties.length);
    // Reset pagination when filtering
    setCurrentPage(1);
  };

  // Load properties and check user auth on component mount
  useEffect(() => {
    fetchProperty();
    const currentUser = checkUserAuth();
    if (currentUser) {
      fetchFavorites();
    }
  }, []);

  return (
    <PageContainer>
      <MainContent>
          <>
            <Box
              sx={{
                display: 'flex',
                gap: 3,
                flexDirection: 'column',
                minHeight: 'calc(100vh - 300px)',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  position: 'sticky',
                  top: 0,
                  zIndex: 10,
                }}
              >
                <InteractiveMap

                  properties={properties}
                  onPropertyClick={handleViewDetails}
                  onAreaSearch={handleAreaSearch}
                />
              </Box>

              <Box
                sx={{
                  width: '100%',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                <Container maxWidth="xl">
                  <ListAllProperties
                    properties={displayProperties}
                    loading={loading}
                    error={error}
                    totalCount={isAreaFiltered ? displayProperties.length : totalCount}
                    currentPage={currentPage}
                    totalPages={isAreaFiltered ? 1 : totalPages}
                    favoriteProperties={favoriteProperties}
                    handlePageChange={handlePageChange}
                    handleFavorite={handleFavorite}
                    handleViewDetails={handleViewDetails}
                  />
                </Container>
              </Box>
            </Box>
          </>
      </MainContent>
    </PageContainer>
  );
};

export default AllPropertiesPage;