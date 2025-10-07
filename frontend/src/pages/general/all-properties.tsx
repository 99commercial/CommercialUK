import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Pagination,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PropertyCardComponent, { Property } from '../../components/PropertyCard';
import { useRouter } from 'next/router';
import axiosInstance from '../../utils/axios';
import { enqueueSnackbar } from 'notistack';

// ----------------------------------------------------------------------

const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 0),
  background: `
    linear-gradient(45deg, #cc0000 0%, #ff0000 25%, #cc0000 50%, #ff0000 75%, #cc0000 100%),
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
  `,
  backgroundSize: '400% 400%, 300px 300px, 300px 300px, 200px 200px',
  minHeight: '100vh',
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
  maxWidth: '70%',
  margin: '0 auto',
  position: 'relative',
  zIndex: 2,
  [theme.breakpoints.down('lg')]: {
    maxWidth: '100%',
    padding: theme.spacing(0, 2),
  },
}));

const ResultsHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  flexWrap: 'wrap',
  gap: theme.spacing(2),
}));

const EmptyState = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(8, 2),
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  borderRadius: theme.spacing(1.5),
  border: '1px solid rgba(255, 255, 255, 0.2)',
  color: '#ffffff',
  backdropFilter: 'blur(15px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
}));

const PropertiesGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
  gap: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: theme.spacing(2),
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
    gap: theme.spacing(2),
  },
}));



// ----------------------------------------------------------------------


const AllPropertiesPage: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State management
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [favoriteProperties, setFavoriteProperties] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);

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
        setProperties(response.data.data.properties || []);
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
        <Container maxWidth="xl">
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 700, 
            mb: 1,
            mt: 4,
            textAlign: 'center',
            color: '#ffffff'
          }}
        >
          All Properties
        </Typography>
        
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 4, 
            textAlign: 'center',
            color: '#cccccc'
          }}
        >
          Discover commercial properties across the UK
        </Typography>


        {/* Results Header */}
        <ResultsHeader>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>
              {totalCount} Properties Found
            </Typography>
          </Box>
        </ResultsHeader>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#ffffff' }} />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Properties Grid */}
        {!loading && !error && properties.length > 0 && (
          <>
            <PropertiesGrid>
              {properties.map((property) => (
                <PropertyCardComponent
                  key={property._id}
                  property={property}
                  onFavorite={handleFavorite}
                  onViewDetails={handleViewDetails}
                  isFavorite={favoriteProperties.includes(property._id)}
                />
              ))}
            </PropertiesGrid>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && properties.length === 0 && (
          <EmptyState>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              No Properties Found
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#cccccc' }}>
              No properties are currently available.
            </Typography>
          </EmptyState>
        )}
      </Container>
      </MainContent>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                },
                '&.Mui-selected': {
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  '&:hover': {
                    backgroundColor: '#cccccc',
                  },
                },
              },
            }}
          />
        </Box>
      )}
    </PageContainer>
  );
};

export default AllPropertiesPage;