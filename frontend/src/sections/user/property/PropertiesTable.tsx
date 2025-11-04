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
  Paper,
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
  styled,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Warning as IncompleteIcon,
} from '@mui/icons-material';
import axiosInstance from '../../../utils/axios';
import { enqueueSnackbar } from 'notistack';
import router from 'next/router';
import Loader from '@/components/Loader';

// Default image URL
const DEFAULT_PROPERTY_IMAGE = 'https://static.vecteezy.com/system/resources/previews/010/674/501/non_2x/house-cartoon-icon-illustration-building-landmark-icon-concept-isolated-premium-flat-cartoon-style-vector.jpg';

// Styled components for animations and improved styling
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  height: '110px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '& td': {
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
  },
  animation: 'fadeIn 0.5s ease-in',
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: 'translateY(10px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2.5, 3),
  fontSize: '0.9375rem',
  fontWeight: 400,
  fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
  letterSpacing: '0.01em',
  lineHeight: 1.6,
  '&.MuiTableCell-head': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    fontWeight: 600,
    fontSize: '0.8125rem',
    color: theme.palette.text.primary,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    lineHeight: 1.5,
  },
}));

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  width: '100%',
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.6),
  '& .MuiTablePagination-toolbar': {
    padding: theme.spacing(2.5, 4),
    minHeight: '72px',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(1.5),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2, 2),
      justifyContent: 'flex-end',
      gap: theme.spacing(1),
    },
  },
  '& .MuiTablePagination-spacer': {
    display: 'none',
  },
  '& .MuiTablePagination-selectLabel': {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.palette.text.primary,
    letterSpacing: '0.01em',
    lineHeight: 1.5,
    marginRight: theme.spacing(0.5),
    marginBottom: 0,
  },
  '& .MuiTablePagination-displayedRows': {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.palette.text.primary,
    letterSpacing: '0.01em',
    lineHeight: 1.5,
    marginLeft: theme.spacing(2),
    marginRight: 0,
    marginBottom: 0,
  },
  '& .MuiTablePagination-select': {
    fontSize: '0.875rem',
    fontWeight: 500,
    letterSpacing: '0.01em',
    borderRadius: '8px',
    padding: theme.spacing(0.75, 1.5),
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
  },
  '& .MuiTablePagination-actions': {
    marginLeft: theme.spacing(1),
    display: 'flex',
    gap: theme.spacing(0.5),
    [theme.breakpoints.down('sm')]: {
      marginLeft: theme.spacing(0.5),
    },
  },
  '& .MuiIconButton-root': {
    padding: theme.spacing(1.25),
    margin: 0,
    transition: 'all 0.2s ease',
    borderRadius: '8px',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
      transform: 'scale(1.1)',
    },
    '&.Mui-disabled': {
      opacity: 0.4,
    },
  },
  '& .MuiInputBase-root': {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
  },
}));

const PropertyImage = styled('img')(({ theme }) => ({
  width: '90px',
  height: '90px',
  objectFit: 'cover',
  borderRadius: '12px',
  border: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
    borderColor: alpha(theme.palette.primary.main, 0.5),
  },
}));

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
      const imageUrl = primaryImage?.url || property.images_id.images[0].url;
      // Return the image URL if it's valid, otherwise use default
      return imageUrl && imageUrl !== '/placeholder-property.jpg' ? imageUrl : DEFAULT_PROPERTY_IMAGE;
    }
    return DEFAULT_PROPERTY_IMAGE;
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
      <Card sx={{ mb: 4, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}>
        <Box sx={{ p: 3 }}>
          <TextField
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary', fontSize: '1.25rem' }} />
                </InputAdornment>
              ),
            }}
            sx={{ 
              width: '100%', 
              maxWidth: 450,
              '& .MuiOutlinedInput-root': {
                fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
                fontSize: '0.9375rem',
                fontWeight: 400,
                letterSpacing: '0.01em',
                lineHeight: 1.5,
                borderRadius: '10px',
                '& input::placeholder': {
                  letterSpacing: '0.01em',
                },
              },
            }}
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
      {loading ? (
        <Paper 
          sx={{ 
            p: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            borderRadius: '12px',
            backgroundColor: '#fafbfc',
            boxShadow: `
              0 4px 6px rgba(0, 0, 0, 0.07),
              0 8px 16px rgba(0, 0, 0, 0.05),
              inset 0 1px 0 rgba(255, 255, 255, 0.9),
              inset 0 -1px 0 rgba(0, 0, 0, 0.03)
            `,
            border: '1px solid rgba(226, 232, 240, 0.7)',
          }}
        >
          <Loader
            fullscreen={false}
            size="medium"
          />
        </Paper>
      ) : (
      <Card sx={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {isLargeScreen && <StyledTableCell>Image</StyledTableCell>}
                <StyledTableCell 
                  onClick={() => handleSort('building_name')}
                  sx={{ cursor: 'pointer', userSelect: 'none', '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.12) } }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    Property Name
                    {getSortIcon('building_name')}
                  </Box>
                </StyledTableCell>
                <StyledTableCell>Type</StyledTableCell>
                <StyledTableCell>Location</StyledTableCell>
                <StyledTableCell>Size</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell 
                  onClick={() => handleSort('createdAt')}
                  sx={{ cursor: 'pointer', userSelect: 'none', '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.12) } }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    Created Date
                    {getSortIcon('createdAt')}
                  </Box>
                </StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
                <StyledTableCell align="center">Delete</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <StyledTableRow>
                  <StyledTableCell colSpan={isLargeScreen ? 9 : 8} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mt: 2,
                        fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
                        fontWeight: 400,
                        fontSize: '0.9375rem',
                        letterSpacing: '0.01em',
                        lineHeight: 1.6,
                        color: 'text.secondary',
                      }}
                    >
                      Loading properties...
                    </Typography>
                  </StyledTableCell>
                </StyledTableRow>
              ) : filteredProperties.length === 0 ? (
                <StyledTableRow>
                  <StyledTableCell colSpan={isLargeScreen ? 9 : 8} align="center" sx={{ py: 4 }}>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{
                        fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
                        fontWeight: 400,
                        fontSize: '0.9375rem',
                        letterSpacing: '0.01em',
                        lineHeight: 1.6,
                      }}
                    >
                      No properties found
                    </Typography>
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                filteredProperties.map((property, index) => (
                  <StyledTableRow 
                    key={property._id} 
                    hover
                    sx={{
                      animationDelay: `${index * 0.05}s`,
                    }}
                  >
                    {isLargeScreen && (
                      <StyledTableCell>
                        <PropertyImage
                          src={getPropertyImage(property)}
                          alt={property.general_details.building_name}
                          onError={(e: any) => {
                            e.target.src = DEFAULT_PROPERTY_IMAGE;
                          }}
                        />
                      </StyledTableCell>
                    )}
                    <StyledTableCell>
                      <Typography 
                        variant="subtitle2" 
                        sx={{
                          fontWeight: 600,
                          fontSize: '1.0625rem',
                          fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
                          color: 'text.primary',
                          mb: 1,
                          letterSpacing: '0.01em',
                          lineHeight: 1.5,
                        }}
                      >
                        {property.general_details.building_name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          fontSize: '0.875rem',
                          fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
                          fontWeight: 400,
                          letterSpacing: '0.01em',
                          lineHeight: 1.5,
                        }}
                      >
                        {property.general_details.property_sub_type}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography 
                        variant="body2"
                        sx={{
                          fontSize: '0.9375rem',
                          fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
                          fontWeight: 500,
                          color: 'text.primary',
                          letterSpacing: '0.01em',
                          lineHeight: 1.6,
                        }}
                      >
                        {property.general_details.property_type}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography 
                        variant="body2"
                        sx={{
                          fontSize: '0.9375rem',
                          fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
                          fontWeight: 500,
                          color: 'text.primary',
                          mb: 0.75,
                          letterSpacing: '0.01em',
                          lineHeight: 1.6,
                        }}
                      >
                        {property.general_details.town_city}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{
                          fontSize: '0.8125rem',
                          fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
                          fontWeight: 400,
                          letterSpacing: '0.02em',
                          lineHeight: 1.5,
                        }}
                      >
                        {property.general_details.postcode}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography 
                        variant="body2"
                        sx={{
                          fontSize: '0.9375rem',
                          fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
                          fontWeight: 500,
                          color: 'text.primary',
                          letterSpacing: '0.01em',
                          lineHeight: 1.6,
                        }}
                      >
                        {property.general_details.size_minimum === property.general_details.size_maximum
                          ? `${property.general_details.size_minimum.toLocaleString()} sq ft`
                          : `${property.general_details.size_minimum.toLocaleString()} - ${property.general_details.size_maximum.toLocaleString()} sq ft`
                        }
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography 
                        variant="body2"
                        sx={{
                          fontSize: '0.9375rem',
                          fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
                          fontWeight: 500,
                          color: 'text.primary',
                          letterSpacing: '0.01em',
                          lineHeight: 1.6,
                        }}
                      >
                        {property.general_details.sale_status}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography 
                        variant="body2"
                        sx={{
                          fontSize: '0.9375rem',
                          fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
                          fontWeight: 400,
                          color: 'text.primary',
                          letterSpacing: '0.01em',
                          lineHeight: 1.6,
                        }}
                      >
                        {new Date(property.createdAt).toLocaleDateString()}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant={property.property_status === 'Active' ? 'outlined' : 'contained'}
                        color={property.property_status === 'Active' ? 'error' : 'warning'}
                        startIcon={property.property_status === 'Active' ? <EditIcon /> : <IncompleteIcon />}
                        onClick={() => handleEditOrComplete(property)}
                        size="medium"
                        sx={{
                          fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
                          fontWeight: 500,
                          fontSize: '0.875rem',
                          letterSpacing: '0.02em',
                          textTransform: 'none',
                          borderRadius: '8px',
                          px: 2.5,
                          py: 1,
                          transition: 'all 0.2s ease',
                          ...(property.property_status !== 'Active' && {
                            backgroundColor: '#ff9800',
                            '&:hover': {
                              backgroundColor: '#f57c00',
                            },
                          }),
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          },
                        }}
                      >
                        {property.property_status === 'Active' ? 'Edit' : 'Incomplete'}
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <IconButton
                        onClick={() => handleDeleteClick(property)}
                        color="error"
                        size="medium"
                        sx={{
                          padding: theme.spacing(1.25),
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.15)',
                            backgroundColor: alpha(theme.palette.error.main, 0.1),
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <StyledTablePagination
          rowsPerPageOptions={[5, 10, 25]}
          count={properties.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            width: '100%',
          }}
        />
      </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
            fontWeight: 600,
            fontSize: '1.25rem',
            letterSpacing: '0.01em',
            lineHeight: 1.5,
            paddingBottom: theme.spacing(1.5),
          }}
        >
          Delete Property
        </DialogTitle>
        <DialogContent sx={{ paddingTop: theme.spacing(2) }}>
          <Typography
            sx={{
              fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
              fontWeight: 400,
              fontSize: '0.9375rem',
              letterSpacing: '0.01em',
              lineHeight: 1.7,
              color: 'text.primary',
            }}
          >
            Are you sure you want to delete "{selectedProperty?.general_details.building_name}"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: theme.spacing(2, 3, 3, 3), gap: theme.spacing(1) }}>
          <Button 
            onClick={handleDeleteCancel}
            sx={{
              fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
              fontWeight: 500,
              fontSize: '0.875rem',
              letterSpacing: '0.02em',
              textTransform: 'none',
              px: 2.5,
              py: 0.75,
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            sx={{
              fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
              fontWeight: 500,
              fontSize: '0.875rem',
              letterSpacing: '0.02em',
              textTransform: 'none',
              borderRadius: '8px',
              px: 2.5,
              py: 0.75,
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PropertiesTable;