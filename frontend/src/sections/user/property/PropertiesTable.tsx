import React, { useState, useEffect, useMemo } from 'react';
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
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CompleteIcon,
} from '@mui/icons-material';
import axiosInstance from '../../../utils/axios';
import { enqueueSnackbar } from 'notistack';
import router from 'next/router';

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
  descriptions_id?: {
    short_description: string;
    long_description: string;
  };
  sale_types_id?: {
    sale_price_min: number;
    sale_price_max: number;
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

const PropertiesTable: React.FC = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<'createdAt' | 'building_name'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Fetch properties from API
  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) {
        throw new Error('User not authenticated');
      }

      const response = await axiosInstance.get(`/api/user/agents/${user.id}/properties`, {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          sort_by: sortBy,
          sort_order: sortOrder,
        }
      });

      if (response.data.success) {
        setProperties(response.data.data.properties || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch properties');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch properties');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [page, rowsPerPage, sortBy, sortOrder]);

  const filteredProperties = useMemo(() => {
    return properties.filter(property =>
      property.general_details.building_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.general_details.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.general_details.town_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.general_details.postcode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [properties, searchTerm]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (field: 'createdAt' | 'building_name') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: 'createdAt' | 'building_name') => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />;
  };

  const getPropertyImage = (property: Property) => {
    if (property.images_id?.images && property.images_id.images.length > 0) {
      const primaryImage = property.images_id.images.find(img => img.is_primary);
      return primaryImage?.url || property.images_id.images[0].url;
    }
    return '/placeholder-property.jpg';
  };

  const handleDeleteClick = (property: Property) => {
    setSelectedProperty(property);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedProperty) {
      try {
        let res = await axiosInstance.delete(`/api/user/properties/${selectedProperty._id}`);
        await fetchProperties(); // Refresh the list

        enqueueSnackbar(res.data.message, {
          variant: 'success'
        });

        setDeleteDialogOpen(false);
        setSelectedProperty(null);
      } catch (err: any) {
        setError(err.message || 'Failed to delete property');
        enqueueSnackbar(err.message || 'Failed to delete property', {
          variant: 'error'
        });
      }
    } 
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedProperty(null);
  };

  const handleEditOrComplete = (property: Property) => {
    if (property.property_status === 'Active') {
      router.push(`/user/property/edit/${property._id}`);
    } else {
      router.push(`/user/property/complete/${property._id}`);
    }
  };

  return (
    <Box>
      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: '100%', maxWidth: 400 }}
          />
        </Box>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Properties Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {isLargeScreen && <TableCell>Image</TableCell>}
                <TableCell 
                  onClick={() => handleSort('building_name')}
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    Property Name
                    {getSortIcon('building_name')}
                  </Box>
                </TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Status</TableCell>
                <TableCell 
                  onClick={() => handleSort('createdAt')}
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    Created Date
                    {getSortIcon('createdAt')}
                  </Box>
                </TableCell>
                <TableCell align="center">Actions</TableCell>
                <TableCell align="center">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={isLargeScreen ? 9 : 8} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Loading properties...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredProperties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isLargeScreen ? 9 : 8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No properties found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProperties.map((property) => (
                  <TableRow key={property._id} hover>
                    {isLargeScreen && (
                      <TableCell>
                        <Box
                          component="img"
                          src={getPropertyImage(property)}
                          alt={property.general_details.building_name}
                          sx={{
                            width: 60,
                            height: 60,
                            objectFit: 'cover',
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                          }}
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {property.general_details.building_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {property.general_details.property_sub_type}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {property.general_details.property_type}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {property.general_details.town_city}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {property.general_details.postcode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {property.general_details.size_minimum === property.general_details.size_maximum
                          ? `${property.general_details.size_minimum.toLocaleString()} sq ft`
                          : `${property.general_details.size_minimum.toLocaleString()} - ${property.general_details.size_maximum.toLocaleString()} sq ft`
                        }
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {property.general_details.sale_status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(property.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant={property.property_status === 'Active' ? 'outlined' : 'contained'}
                        color={property.property_status === 'Active' ? 'error' : 'success'}
                        startIcon={property.property_status === 'Active' ? <EditIcon /> : <CompleteIcon />}
                        onClick={() => handleEditOrComplete(property)}
                        size="small"
                      >
                        {property.property_status === 'Active' ? 'Edit' : 'Complete'}
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleDeleteClick(property)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={properties.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Property</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedProperty?.general_details.building_name}"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PropertiesTable;