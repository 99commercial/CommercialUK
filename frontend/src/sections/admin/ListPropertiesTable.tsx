import React, { useState, useMemo } from 'react';
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
  IconButton,
  Button,
  Avatar,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress,
  DialogContentText,
} from '@mui/material';
import {
  Search as SearchIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Star as FeaturedIcon,
  VerifiedUser as VerifiedIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import axiosInstance from '../../utils/axios';

// Types
export interface Property {
  _id: string;
  general_details: {
    building_name: string;
    address: string;
    town_city: string;
    postcode: string;
    country_region?: string;
    sale_status: 'Available' | 'Under Offer' | 'Sold' | 'Let' | 'Withdrawn';
    property_type: string;
    property_sub_type: string;
    size_minimum: number;
    size_maximum: number;
    approximate_year_of_construction: number;
    max_eaves_height?: number;
    expansion_capacity_percent?: number;
    invoice_details?: string;
    property_notes?: string;
  };
  listed_by?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  business_rates_id?: {
    rent_per_sqft_min: number;
    rent_per_sqft_max: number;
    rent_per_annum_min: number;
    rent_per_annum_max: number;
  };
  sale_types_id?: {
    sale_types: Array<{
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

interface ListPropertiesTableProps {
  properties: Property[];
}

const ListPropertiesTable: React.FC<ListPropertiesTableProps> = ({ properties }) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<'building_name' | 'createdAt' | 'sale_status'>('building_name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);

  const filteredProperties = useMemo(() => {
    return properties.filter(property =>
      property.general_details.building_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.general_details.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.general_details.town_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.general_details.postcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.general_details.property_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [properties, searchTerm]);

  const sortedProperties = useMemo(() => {
    return [...filteredProperties].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'building_name':
          aValue = a.general_details.building_name;
          bValue = b.general_details.building_name;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'sale_status':
          aValue = a.general_details.sale_status;
          bValue = b.general_details.sale_status;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredProperties, sortBy, sortOrder]);

  const paginatedProperties = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedProperties.slice(start, start + rowsPerPage);
  }, [sortedProperties, page, rowsPerPage]);

  const handleSort = (field: 'building_name' | 'createdAt' | 'sale_status') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: 'building_name' | 'createdAt' | 'sale_status') => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />;
  };

  const getPropertyImage = (property: Property) => {
    if (property.images_id?.images && property.images_id.images.length > 0) {
      const primaryImage = property.images_id.images.find(img => img.is_primary);
      return primaryImage?.url || property.images_id.images[0].url;
    }
    return 'https://img.freepik.com/free-photo/cartoon-model-residential-home-property_23-2151024253.jpg?semt=ais_hybrid&w=740&q=80';
  };

  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property);
    setViewDialogOpen(true);
  };

  const handleViewPropertyDetails = (property: Property) => {
    router.push(`/property/${property._id}`);
  };

  const handleCloseDialog = () => {
    setViewDialogOpen(false);
    setSelectedProperty(null);
  };

  const handleDeleteProperty = async () => {
    if (!propertyToDelete) return;
    setDeleteLoading(true);
    try {
      await axiosInstance.delete(`/api/admin/properties/${propertyToDelete}`);
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
      window.location.reload();
    } catch (err: any) {
      console.error('Failed to delete property:', err);
      alert(err?.response?.data?.message || err?.message || 'Failed to delete property');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <Card sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            All Properties ({filteredProperties.length})
          </Typography>
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
            sx={{ width: 300 }}
          />
        </Box>

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
                <TableCell>Listed By</TableCell>
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
              {paginatedProperties.map((property) => (
                <TableRow key={property._id} hover>
                  {isLargeScreen && (
                    <TableCell>
                      <Box
                        component="img"
                        src={getPropertyImage(property)}
                        alt={property.general_details.building_name}
                        sx={{
                          width: 80,
                          height: 80,
                          objectFit: 'cover',
                          borderRadius: 1,
                        }}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <Box>
                      <Typography 
                        variant="body2" 
                        sx={{ fontWeight: 500, cursor: 'pointer' }}
                        onClick={() => handleViewPropertyDetails(property)}
                      >
                        {property.general_details.building_name}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                        {property.is_active && (
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 0.2,
                              px: 0.8,
                              py: 0.2,
                              borderRadius: 1,
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              boxShadow: '0 1px 3px rgba(16,185,129,0.3)',
                            }}
                          >
                            <ActiveIcon sx={{ fontSize: '0.5rem', color: 'white' }} />
                            <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.5rem' }}>
                              Active
                            </Typography>
                          </Box>
                        )}
                        {property.is_featured && (
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 0.2,
                              px: 0.8,
                              py: 0.2,
                              borderRadius: 1,
                              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            }}
                          >
                            <FeaturedIcon sx={{ fontSize: '0.5rem', color: 'white' }} />
                            <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.5rem' }}>
                              Featured
                            </Typography>
                          </Box>
                        )}
                        {property.is_verified && (
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 0.2,
                              px: 0.8,
                              py: 0.2,
                              borderRadius: 1,
                              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            }}
                          >
                            <VerifiedIcon sx={{ fontSize: '0.5rem', color: 'white' }} />
                            <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.5rem' }}>
                              Verified
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {property.general_details.property_type}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {property.general_details.property_sub_type}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {property.general_details.town_city}, {property.general_details.postcode}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {property.general_details.size_minimum}-{property.general_details.size_maximum} sq ft
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={property.general_details.sale_status}
                      size="small"
                      color={
                        property.general_details.sale_status === 'Available' ? 'success' :
                        property.general_details.sale_status === 'Under Offer' ? 'warning' :
                        property.general_details.sale_status === 'Sold' ? 'error' : 'default'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {property.listed_by ? (
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {property.listed_by.firstName} {property.listed_by.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {property.listed_by.email}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">N/A</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleViewProperty(property)}
                      color="primary"
                    >
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setPropertyToDelete(property._id);
                        setDeleteDialogOpen(true);
                      }}
                      color="error"
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

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredProperties.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Card>

      {/* Property Details Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={useMediaQuery(theme.breakpoints.down('sm'))}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #ffe6e6 100%)',
            borderRadius: { xs: 0, sm: 3 },
            m: { xs: 0, sm: 2 },
            maxHeight: { xs: '100vh', sm: '90vh' },
            overflow: 'hidden',
          }
        }}
      >
        <DialogTitle
          sx={{
            background: 'red',
            color: 'white',
            fontSize: { xs: '1.2rem', sm: '1.5rem' },
            fontWeight: 700,
            py: 3,
          }}
        >
          Property Details
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 4 }, background: 'transparent', overflow: 'auto' }}>
          {selectedProperty && (
            <Box sx={{ width: '100%', overflow: 'hidden' }}>
              <Box 
                display="flex" 
                gap={3} 
                mb={4}
                flexDirection={{ xs: 'column', sm: 'row' }}
              >
                <Box
                  component="img"
                  src={getPropertyImage(selectedProperty)}
                  alt={selectedProperty.general_details.building_name}
                  sx={{
                    width: { xs: '100%', sm: 250 },
                    height: { xs: 200, sm: 180 },
                    objectFit: 'cover',
                    borderRadius: 3,
                    marginTop:5,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  }}
                />
                <Box flex={1} sx={{ minWidth: 0, overflow: 'hidden', marginTop:5 }}>
                  <Typography 
                    variant="h4" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 700,
                      fontSize: { xs: '1.5rem', sm: '2rem' },
                      color: '#1f2937',
                      mb: 2,
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {selectedProperty.general_details.building_name}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color="text.secondary" 
                    gutterBottom
                    sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, mb: 1, wordBreak: 'break-word', overflowWrap: 'break-word' }}
                  >
                    {selectedProperty.general_details.address}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color="text.secondary" 
                    gutterBottom
                    sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, mb: 2, wordBreak: 'break-word', overflowWrap: 'break-word' }}
                  >
                    {selectedProperty.general_details.town_city}, {selectedProperty.general_details.postcode}
                  </Typography>
                  <Box display="flex" gap={1} mt={2} flexWrap="wrap">
                    <Chip
                      label={selectedProperty.general_details.sale_status}
                      size="medium"
                      color={selectedProperty.general_details.sale_status === 'Available' ? 'success' : 'warning'}
                      sx={{ fontSize: '0.9rem', fontWeight: 600 }}
                    />
                    {selectedProperty.is_active && <Chip label="Active" color="primary" size="medium" sx={{ fontSize: '0.9rem', fontWeight: 600 }} />}
                    {selectedProperty.is_featured && <Chip label="Featured" color="secondary" size="medium" sx={{ fontSize: '0.9rem', fontWeight: 600 }} />}
                    {selectedProperty.is_verified && <Chip label="Verified" color="success" size="medium" sx={{ fontSize: '0.9rem', fontWeight: 600 }} />}
                  </Box>
                </Box>
              </Box>

              <Box 
                sx={{ 
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 2,
                  p: { xs: 2, sm: 3 },
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                }}
              >
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)' }} gap={3}>
                  <Box sx={{ overflow: 'hidden', wordBreak: 'break-word' }}>
                    <Typography 
                      variant="h6" 
                      color="#dc2626" 
                      sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '0.95rem', sm: '1.1rem' } }}
                    >
                      Property Type
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 500, fontSize: { xs: '0.9rem', sm: '1rem' }, overflowWrap: 'break-word' }}>
                      {selectedProperty.general_details.property_type}
                    </Typography>
                  </Box>
                  <Box sx={{ overflow: 'hidden', wordBreak: 'break-word' }}>
                    <Typography 
                      variant="h6" 
                      color="#dc2626" 
                      sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '0.95rem', sm: '1.1rem' } }}
                    >
                      Sub Type
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 500, fontSize: { xs: '0.9rem', sm: '1rem' }, overflowWrap: 'break-word' }}>
                      {selectedProperty.general_details.property_sub_type}
                    </Typography>
                  </Box>
                  <Box sx={{ overflow: 'hidden', wordBreak: 'break-word' }}>
                    <Typography 
                      variant="h6" 
                      color="#dc2626" 
                      sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '0.95rem', sm: '1.1rem' } }}
                    >
                      Size
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 500, fontSize: { xs: '0.9rem', sm: '1rem' }, overflowWrap: 'break-word' }}>
                      {selectedProperty.general_details.size_minimum}-{selectedProperty.general_details.size_maximum} sq ft
                    </Typography>
                  </Box>
                  <Box sx={{ overflow: 'hidden', wordBreak: 'break-word' }}>
                    <Typography 
                      variant="h6" 
                      color="#dc2626" 
                      sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '0.95rem', sm: '1.1rem' } }}
                    >
                      Year Built
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 500, fontSize: { xs: '0.9rem', sm: '1rem' }, overflowWrap: 'break-word' }}>
                      {selectedProperty.general_details.approximate_year_of_construction}
                    </Typography>
                  </Box>
                  <Box sx={{ overflow: 'hidden', wordBreak: 'break-word' }}>
                    <Typography 
                      variant="h6" 
                      color="#dc2626" 
                      sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '0.95rem', sm: '1.1rem' } }}
                    >
                      Sale Status
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 500, fontSize: { xs: '0.9rem', sm: '1rem' }, overflowWrap: 'break-word' }}>
                      {selectedProperty.general_details.sale_status}
                    </Typography>
                  </Box>
                  <Box sx={{ overflow: 'hidden', wordBreak: 'break-word' }}>
                    <Typography 
                      variant="h6" 
                      color="#dc2626" 
                      sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '0.95rem', sm: '1.1rem' } }}
                    >
                      Country/Region
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 500, fontSize: { xs: '0.9rem', sm: '1rem' }, overflowWrap: 'break-word' }}>
                      {selectedProperty.general_details.country_region || 'N/A'}
                    </Typography>
                  </Box>
                  <Box sx={{ overflow: 'hidden', wordBreak: 'break-word' }}>
                    <Typography 
                      variant="h6" 
                      color="#dc2626" 
                      sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '0.95rem', sm: '1.1rem' } }}
                    >
                      Max Eaves Height
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 500, fontSize: { xs: '0.9rem', sm: '1rem' }, overflowWrap: 'break-word' }}>
                      {selectedProperty.general_details.max_eaves_height || 'N/A'}
                    </Typography>
                  </Box>
                  <Box sx={{ overflow: 'hidden', wordBreak: 'break-word' }}>
                    <Typography 
                      variant="h6" 
                      color="#dc2626" 
                      sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '0.95rem', sm: '1.1rem' } }}
                    >
                      Expansion Capacity
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 500, fontSize: { xs: '0.9rem', sm: '1rem' }, overflowWrap: 'break-word' }}>
                      {selectedProperty.general_details.expansion_capacity_percent || 0}%
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {selectedProperty.general_details.invoice_details && (
                <Box 
                  mt={3} 
                  p={{ xs: 2, sm: 3 }} 
                  sx={{ 
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                  }}
                >
                  <Typography 
                    variant="h6" 
                    color="#dc2626" 
                    gutterBottom 
                    sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '0.95rem', sm: '1.1rem' } }}
                  >
                    Invoice Details
                  </Typography>
                  <Box sx={{ p: 2, overflow: 'hidden' }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontSize: { xs: '0.9rem', sm: '1rem' }, 
                        lineHeight: 1.8,
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        whiteSpace: 'normal',
                      }}
                    >
                      {selectedProperty.general_details.invoice_details}
                    </Typography>
                  </Box>
                </Box>
              )}

              {selectedProperty.general_details.property_notes && (
                <Box 
                  mt={3} 
                  p={{ xs: 2, sm: 3 }} 
                  sx={{ 
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                  }}
                >
                  <Typography 
                    variant="h6" 
                    color="#dc2626" 
                    gutterBottom 
                    sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '0.95rem', sm: '1.1rem' } }}
                  >
                    Property Notes
                  </Typography>
                  <Box sx={{ p: 2, overflow: 'hidden' }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontSize: { xs: '0.9rem', sm: '1rem' }, 
                        lineHeight: 1.8,
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        whiteSpace: 'normal',
                      }}
                    >
                      {selectedProperty.general_details.property_notes}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions 
          sx={{ 
            background: 'rgba(255, 255, 255, 0.9)',
            p: { xs: 2, sm: 3 },
            borderTop: '1px solid rgba(0,0,0,0.1)',
          }}
        >
          <Button 
            onClick={handleCloseDialog}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #ff9999 0%, #ffaaaa 100%)',
              color: 'white',
              fontWeight: 600,
              fontSize: { xs: '0.9rem', sm: '1rem' },
              px: { xs: 3, sm: 4 },
              py: { xs: 1.2, sm: 1.5 },
              width: { xs: '100%', sm: 'auto' },
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(255,153,153,0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #ff8888 0%, #ff9999 100%)',
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Property</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this property? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteProperty}
            color="error"
            variant="contained"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ListPropertiesTable;

