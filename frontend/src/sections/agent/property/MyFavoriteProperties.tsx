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
  Pagination,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import RefreshIcon from '@mui/icons-material/Refresh';
import { FavouritePropertyCard } from '../../../components';
import axiosInstance from '../../../utils/axios';

// ----------------------------------------------------------------------

const StyledContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#f8fafc',
  minHeight: '100vh',
}));

const EmptyStateCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(6),
  textAlign: 'center',
  backgroundColor: '#ffffff',
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: '2px dashed #e2e8f0',
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
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: '#ffffff',
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
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
      const response = await axiosInstance.get('/api/agent/favorites/details', {
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
      await axiosInstance.delete(`/api/agent/favorites/${propertyId}`);
      
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
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#64748b' }}>
        No Favorite Properties Yet
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: '#64748b' }}>
        Start exploring properties and add them to your favorites to see them here.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => window.location.href = '/general/all-properties'}
        sx={{
          backgroundColor: '#dc2626',
          '&:hover': {
            backgroundColor: '#b91c1c',
          },
        }}
      >
        Browse Properties
      </Button>
    </EmptyStateCard>
  );

  const renderLoadingState = () => (
    <LoadingContainer>
      <Stack alignItems="center" spacing={2}>
        <CircularProgress size={60} sx={{ color: '#dc2626' }} />
        <Typography variant="h6" color="text.secondary">
          Loading your favorite properties...
        </Typography>
      </Stack>
    </LoadingContainer>
  );

  const renderErrorState = () => (
    <Card sx={{ p: 3, backgroundColor: '#ffffff', borderRadius: 2 }}>
      <Alert 
        severity="error" 
        action={
          <Button 
            color="inherit" 
            size="small" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            Retry
          </Button>
        }
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
          mt: 4,
          backgroundColor: '#ffffff',
          borderRadius: 2,
          p: 2,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
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
                '&.Mui-selected': {
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#b91c1c',
                  },
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
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
            My Favorite Properties
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mt: 0.5 }}>
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
