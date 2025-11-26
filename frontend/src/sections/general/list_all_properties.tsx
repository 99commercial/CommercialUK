import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Pagination,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PropertyCardComponent, { Property } from '../../components/PropertyCard';

// ----------------------------------------------------------------------

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

interface ListAllPropertiesProps {
  properties: Property[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  favoriteProperties: string[];
  handlePageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  handleFavorite: (propertyId: string) => void;
  handleViewDetails: (propertyId: string) => void;
}

const ListAllProperties: React.FC<ListAllPropertiesProps> = ({
  properties,
  loading,
  error,
  totalCount,
  currentPage,
  totalPages,
  favoriteProperties,
  handlePageChange,
  handleFavorite,
  handleViewDetails,
}) => {
  return (
    <>

              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 1,
                  mt: 4,
                  textAlign: 'center',
                  color: '#000'
                }}
              >
                All Properties
              </Typography>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 4, 
                  textAlign: 'center',
                  color: '#000'
                }}
              >
                Discover commercial properties across the UK
              </Typography>


      {/* Results Header */}
      <ResultsHeader>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#000' }}>
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
    </>
  );
};

export default ListAllProperties;

