import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Stack,
  Card,
  CardContent,
  Paper,
  Pagination,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import RefreshIcon from '@mui/icons-material/Refresh';
import { FavouritePropertyCard } from '../../../components';
import Loader from '@/components/Loader';
import axiosInstance from '../../../utils/axios';

// ----------------------------------------------------------------------

const StyledContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#f8fafc',
  minHeight: '100vh',
}));

const EmptyStateCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(8),
  textAlign: 'center',
  background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
  borderRadius: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '2px dashed rgba(220, 38, 38, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: 'rgba(220, 38, 38, 0.4)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '400px',
  backgroundColor: '#ffffff',
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3, 4),
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  borderRadius: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  border: '1px solid rgba(220, 38, 38, 0.1)',
}));

const PropertiesContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
    gap: theme.spacing(2),
  },
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
  },
}));

// ----------------------------------------------------------------------

interface Property {
  _id: string;
  general_details: {
    building_name: string;
    address: string;
  };
  descriptions_id?: {
    general: string;
  };
  images_id?: {
    images: Array<{
      _id: string;
      caption: string;
      url: string;
      order: number;
    }>;
  };
}

interface MyFavoritePropertiesProps {
  onViewProperty?: (propertyId: string) => void;
  onRemoveFavorite?: (propertyId: string) => void;
}

const MyFavoriteProperties: React.FC<MyFavoritePropertiesProps> = ({
  onViewProperty,
  onRemoveFavorite,
}) => {
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalPages: 0,
    totalDocs: 0,
  });

  const fetchFavoriteProperties = async (page = 1, limit = 20) => {
    try {
      setError(null);
      const response = await axiosInstance.get('/api/user/favorites/details', {
        params: { page, limit }
      });

      console.log(response.data);
      
      if (response.data && response.data.success) {
        const { docs, totalPages, totalDocs } = response.data.data;
        setFavoriteProperties(docs || []);
        setPagination({
          page,
          limit,
          totalPages,
          totalDocs,
        });
      } else {
        setError('Failed to fetch favorite properties');
      }
    } catch (err: any) {
      console.error('Error fetching favorite properties:', err);
      setError(
        err?.response?.data?.message || 
        err?.message || 
        'Failed to fetch favorite properties'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFavoriteProperties(pagination.page, pagination.limit);
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.totalPages) {
      fetchFavoriteProperties(pagination.page + 1, pagination.limit);
    }
  };

  const handleRemoveFavorite = async (propertyId: string) => {
    try {
      await axiosInstance.delete(`/api/user/favorites/${propertyId}`);
      
      // Remove from local state
      setFavoriteProperties(prev => 
        prev.filter(property => property._id !== propertyId)
      );
      
      // Call parent callback if provided
      onRemoveFavorite?.(propertyId);
    } catch (err: any) {
      console.error('Error removing favorite:', err);
      setError(
        err?.response?.data?.message || 
        err?.message || 
        'Failed to remove favorite'
      );
    }
  };

  const handleViewProperty = (propertyId: string) => {
    onViewProperty?.(propertyId);
  };

  useEffect(() => {
    fetchFavoriteProperties();
  }, []);

  const renderEmptyState = () => (
    <EmptyStateCard>
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 2, 
          fontWeight: 700, 
          color: '#1e293b',
          fontFamily: '"Montserrat", sans-serif',
          fontSize: '1.75rem',
          letterSpacing: '-0.015em',
        }}
      >
        No Favorite Properties Yet
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          mb: 4, 
          color: '#64748b',
          fontFamily: '"Lato", sans-serif',
          fontSize: '1.1rem',
          lineHeight: 1.6,
          fontWeight: 400,
          letterSpacing: '0.01em',
        }}
      >
        Start exploring properties and add them to your favorites to see them here.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => window.location.href = '/general/all-properties'}
        sx={{
          backgroundColor: '#dc2626',
          fontFamily: '"Montserrat", sans-serif',
          fontWeight: 600,
          fontSize: '1rem',
          padding: '12px 32px',
          borderRadius: '12px',
          textTransform: 'none',
          letterSpacing: '0.02em',
          boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)',
          '&:hover': {
            backgroundColor: '#b91c1c',
            boxShadow: '0 6px 20px rgba(220, 38, 38, 0.5)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        Browse Properties
      </Button>
    </EmptyStateCard>
  );

  const renderLoadingState = () => (
    <Paper 
      sx={{ 
        p: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px'
      }}
    >
      <Loader
        fullscreen={false}
        size="medium"
      />
    </Paper>
  );

  const renderErrorState = () => (
    <Card sx={{ 
      p: 3, 
      background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      border: '1px solid rgba(220, 38, 38, 0.1)',
    }}>
      <Alert 
        severity="error" 
        action={
          <Button 
            color="inherit" 
            size="small" 
            onClick={handleRefresh}
            disabled={refreshing}
            sx={{
              fontFamily: '"Montserrat", sans-serif',
              fontWeight: 600,
              textTransform: 'none',
              letterSpacing: '0.02em',
            }}
          >
            Retry
          </Button>
        }
        sx={{
          fontFamily: '"Lato", sans-serif',
          '& .MuiAlert-message': {
            fontFamily: '"Lato", sans-serif',
            fontWeight: 400,
            letterSpacing: '0.01em',
          },
        }}
      >
        {error}
      </Alert>
    </Card>
  );

  const renderProperties = () => (
    <>
      <PropertiesContainer>
        {favoriteProperties.map((property) => (
          <FavouritePropertyCard
            key={property._id}
            property={property}
            onRemoveFavorite={handleRemoveFavorite}
          />
        ))}
      </PropertiesContainer>
      
      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 5,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: 3,
          p: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          border: '1px solid rgba(220, 38, 38, 0.1)',
        }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={(event, page) => fetchFavoriteProperties(page, pagination.limit)}
            color="primary"
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#64748b',
                fontFamily: '"Lato", sans-serif',
                fontWeight: 400,
                fontSize: '1rem',
                letterSpacing: '0.01em',
                '&.Mui-selected': {
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#b91c1c',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease',
                },
                '&:hover': {
                  backgroundColor: 'rgba(220, 38, 38, 0.08)',
                },
              },
            }}
          />
        </Box>
      )}
    </>
  );

  return (
    <StyledContainer>
      <HeaderSection>
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#1e293b',
              fontFamily: '"Montserrat", sans-serif',
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              letterSpacing: '-0.015em',
              mb: 0.5,
            }}
          >
            My Favorite Properties
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#64748b', 
              mt: 0.5,
              fontFamily: '"Lato", sans-serif',
              fontSize: '1rem',
              fontWeight: 400,
              letterSpacing: '0.01em',
            }}
          >
            {pagination.totalDocs} {pagination.totalDocs === 1 ? 'property' : 'properties'} saved
          </Typography>
        </Box>
      </HeaderSection>

      {loading ? (
        renderLoadingState()
      ) : error ? (
        renderErrorState()
      ) : pagination.totalDocs === 0 ? (
        renderEmptyState()
      ) : (
        renderProperties()
      )}
    </StyledContainer>
  );
};

export default MyFavoriteProperties;
