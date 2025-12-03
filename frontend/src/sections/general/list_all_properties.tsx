import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Pagination,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PropertyCardComponent, { Property } from '../../components/PropertyCard';

// ----------------------------------------------------------------------

const ResultsHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  marginTop: 0,
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
  // Desktop (lg and up): 1 column, full width cards
  gridTemplateColumns: '1fr',
  gap: theme.spacing(3),
  [theme.breakpoints.down('lg')]: {
    // Laptop (md to lg): 1 column, full width cards
    gridTemplateColumns: '1fr',
    gap: theme.spacing(2.5),
  },
  [theme.breakpoints.down('md')]: {
    // Tablet (sm to md): 1 column, full width cards
    gridTemplateColumns: '1fr',
    gap: theme.spacing(2),
  },
  [theme.breakpoints.down('sm')]: {
    // Mobile (xs): 1 column, full width cards
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
      {/* Results Header */}
      <ResultsHeader sx={{ 
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#ffffff',
        paddingTop: 2,
        paddingBottom: 2,
        marginTop: 2, 
        marginBottom: 3,
        // boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}>
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#000' }}>
            {totalCount} Properties Found
          </Typography>
        </Box>
      </ResultsHeader>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress sx={{ color: '#000000' }} />
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
        <Box sx={{ width: '100%', mt: 4 }}>
          <Paper
            elevation={8}
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 100,
              p: 4,
              borderRadius: 3,
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.08)',
            }}
          >
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#000000',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  minWidth: 40,
                  height: 40,
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    color: '#000000',
                    border: '1px solid #d0d0d0',
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#ff9800',
                    color: '#ffffff',
                    border: '1px solid #ff9800',
                    '&:hover': {
                      backgroundColor: '#f57c00',
                      color: '#ffffff',
                    },
                  },
                },
              }}
            />
          </Paper>
        </Box>
      )}
    </>
  );
};

export default ListAllProperties;

