import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  TablePagination,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  Button,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  LocationOn as LocationIcon,
  Home as HomeIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axiosInstance from '../../../utils/axios';
import Link from 'next/link';

// Types
export interface Property {
  _id: string;
  general_details: {
    building_name: string;
    address: string;
    town_city: string;
    postcode: string;
    sale_status: 'Available' | 'Under Offer' | 'Sold' | 'Let' | 'Withdrawn';
    property_type: string;
    property_sub_type: string;
    size_minimum: number;
    size_maximum: number;
    approximate_year_of_construction: number;
  };
  business_rates_id?: {
    rent_per_sqft_min: number;
    rent_per_sqft_max: number;
    rent_per_annum_min: number;
    rent_per_annum_max: number;
  };
  sale_types_id?: {
    _id?: string;
    sale_types?: Array<{
      _id: string;
      sale_type: string;
      price_currency: string;
      price_value: number;
      price_unit: string;
    }>;
    sale_price_min?: number;
    sale_price_max?: number;
  };
  images_id?: {
    images: Array<{
      url: string;
      alt_text: string;
      is_primary: boolean;
    }>;
  };
  is_active: boolean;
  is_featured: boolean;
  is_verified: boolean;
  property_status: 'Active' | 'Inactive' | 'Sold' | 'Let' | 'Withdrawn';
  createdAt: string;
  updatedAt: string;
}

interface UserPropertiesTableProps {
  userId: string;
}

const UserPropertiesTable: React.FC<UserPropertiesTableProps> = ({ userId }) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; propertyId: string | null }>({
    open: false,
    propertyId: null,
  });
  const [deleting, setDeleting] = useState(false);

  // Fetch properties from API with pagination
  const fetchProperties = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: page + 1, // Backend expects 1-based page numbering
        limit: rowsPerPage,
        ...(searchTerm && { search: searchTerm }), // Include search if present
      };
      
      const response = await axiosInstance.get(`/api/admin/users/${userId}/properties`, { params });
      
      // Handle the response structure: data.properties and data.pagination
      const responseData = response.data?.data || response.data;
      const propertiesList = Array.isArray(responseData?.properties) ? responseData.properties : 
                             Array.isArray(responseData) ? responseData : [];
      
      setProperties(propertiesList);
      
      // Get total count from pagination object or use properties length
      if (responseData?.pagination) {
        setTotalCount(responseData.pagination.totalProperties || propertiesList.length);
      } else {
        setTotalCount(propertiesList.length);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch properties');
      setProperties([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [userId, page, rowsPerPage, searchTerm]);

  // Handle delete property
  const handleDeleteProperty = async () => {
    if (!deleteDialog.propertyId) return;

    try {
      setDeleting(true);
      await axiosInstance.delete(`/api/admin/properties/${deleteDialog.propertyId}`);
      
      // Close dialog and refresh properties
      setDeleteDialog({ open: false, propertyId: null });
      await fetchProperties();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to delete property');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
      case 'Active':
        return '#10b981';
      case 'Under Offer':
        return '#f59e0b';
      case 'Sold':
      case 'Let':
        return '#6b7280';
      case 'Withdrawn':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getPrimaryImage = (property: Property) => {
    const images = property.images_id?.images || [];
    const primaryImage = images.find(img => img.is_primary);
    return primaryImage?.url || images[0]?.url || '/placeholder-property.jpg';
  };

  return (
    <Card sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Properties ({totalCount})
        </Typography>
      </Box>

      {/* Search Bar */}
      <TextField
        fullWidth
        placeholder="Search properties..."
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Empty State */}
      {!loading && !error && properties.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <HomeIcon sx={{ fontSize: 60, color: '#d1d5db', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            {searchTerm ? 'No properties found' : 'No properties listed yet'}
          </Typography>
        </Box>
      )}

      {/* Properties Table */}
      {!loading && !error && properties.length > 0 && (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                  {isLargeScreen && <TableCell>Image</TableCell>}
                  <TableCell sx={{ fontWeight: 600 }}>Property Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Size</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property._id} hover>
                    {isLargeScreen && (
                      <TableCell>
                        <Avatar
                          src={getPrimaryImage(property)}
                          variant="rounded"
                          sx={{ width: 60, height: 60 }}
                        >
                          <HomeIcon />
                        </Avatar>
                      </TableCell>
                    )}
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {property.general_details?.building_name || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {property.general_details?.town_city || 'N/A'}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {property.general_details?.postcode || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {property.general_details?.property_type || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={property.general_details?.sale_status || property.property_status || 'N/A'}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(property.general_details?.sale_status || property.property_status),
                          color: 'white',
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {property.general_details?.size_minimum != null && property.general_details?.size_maximum != null
                          ? `${property.general_details.size_minimum} - ${property.general_details.size_maximum} sq ft`
                          : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Link href={`/property/${property._id}`} passHref>
                        <Button
                          size="small"
                          startIcon={<ViewIcon />}
                          sx={{
                            textTransform: 'none',
                            color: '#dc2626',
                            '&:hover': {
                              backgroundColor: 'rgba(220, 38, 38, 0.1)',
                            },
                          }}
                        >
                          View
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteDialog({ open: true, propertyId: property._id })}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(220, 38, 38, 0.1)',
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, propertyId: null })}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Property
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this property? This action will soft delete the property and cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, propertyId: null })}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteProperty}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default UserPropertiesTable;
