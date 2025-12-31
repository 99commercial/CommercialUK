import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  TablePagination,
  Typography,
  Chip,
  CircularProgress,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Divider,
  Stack,
  Alert,
  TextField,
  MenuItem,
  Grid,
  InputAdornment,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import WarningIcon from '@mui/icons-material/Warning';
import SaveIcon from '@mui/icons-material/Save';
import { useTheme, useMediaQuery } from '@mui/material';
import axiosInstance from '@/utils/axios';

interface CommercialProperty {
  _id: string;
  property_type: string;
  property_link?: string;
  postcode: string;
  pricingPCM: number;
  pricingPA: number;
  sizeSQFT: {
    minimum: number;
    maximum: number;
  };
  pricePerSqftPA: number;
  pricePerSqftPCM: number;
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  current_page: number;
  total_pages: number;
  total_documents: number;
  limit: number;
}

interface DataTableProps {
  properties: CommercialProperty[];
  pagination: PaginationData;
  loading: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onDelete: (id: string) => Promise<void>;
  onEdit: (property: CommercialProperty) => void;
  onUpdateSuccess?: () => void;
}

const DataTable: React.FC<DataTableProps> = ({
  properties,
  pagination,
  loading,
  onPageChange,
  onLimitChange,
  onDelete,
  onEdit,
  onUpdateSuccess,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<CommercialProperty | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  // Edit dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [fetchingProperty, setFetchingProperty] = useState(false);
  const [updatingProperty, setUpdatingProperty] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CommercialProperty>>({
    property_type: '',
    property_link: '',
    postcode: '',
    pricingPCM: 0,
    pricingPA: 0,
    sizeSQFT: {
      minimum: 0,
      maximum: 0,
    },
    pricePerSqftPA: 0,
    pricePerSqftPCM: 0,
    comments: '',
  });

  const propertyTypes = [
    'Office',
    'Retail',
    'Industrial',
    'Warehouse',
    'Land',
    'Leisure',
    'Healthcare',
    'Education',
    'Hotel',
    'Restaurant',
    'Student Accommodation',
    'Car Park',
    'Data Centre',
    'Other',
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-GB').format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleDeleteClick = (property: CommercialProperty) => {
    setPropertyToDelete(property);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!propertyToDelete) return;

    try {
      setDeleting(true);
      await onDelete(propertyToDelete._id);
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
    } catch (error) {
      // Error handling is done in parent component
      console.error('Error deleting property:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPropertyToDelete(null);
  };

  const handleEditClick = async (property: CommercialProperty) => {
    setEditingPropertyId(property._id);
    setEditDialogOpen(true);
    setEditError(null);
    setFetchingProperty(true);

    try {
      const response = await axiosInstance.get<{ success: boolean; data: CommercialProperty }>(
        `/api/aical/commercial-properties/${property._id}`
      );

      if (response.data.success && response.data.data) {
        setFormData({
          property_type: response.data.data.property_type,
          property_link: response.data.data.property_link || '',
          postcode: response.data.data.postcode,
          pricingPCM: response.data.data.pricingPCM,
          pricingPA: response.data.data.pricingPA,
          sizeSQFT: {
            minimum: response.data.data.sizeSQFT.minimum,
            maximum: response.data.data.sizeSQFT.maximum,
          },
          pricePerSqftPA: response.data.data.pricePerSqftPA,
          pricePerSqftPCM: response.data.data.pricePerSqftPCM,
          comments: response.data.data.comments || '',
        });
      } else {
        throw new Error('Failed to fetch property data');
      }
    } catch (err: any) {
      console.error('Error fetching property:', err);
      setEditError(err?.response?.data?.message || err?.message || 'Failed to fetch property data');
    } finally {
      setFetchingProperty(false);
    }
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setEditingPropertyId(null);
    setFormData({
      property_type: '',
      property_link: '',
      postcode: '',
      pricingPCM: 0,
      pricingPA: 0,
      sizeSQFT: {
        minimum: 0,
        maximum: 0,
      },
      pricePerSqftPA: 0,
      pricePerSqftPCM: 0,
      comments: '',
    });
    setEditError(null);
  };

  const handleFormChange = (field: string, value: any) => {
    if (field === 'sizeSQFT.minimum' || field === 'sizeSQFT.maximum') {
      const [parent, child] = field.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleUpdateSubmit = async () => {
    if (!editingPropertyId) return;

    try {
      setUpdatingProperty(true);
      setEditError(null);

      const updateData = {
        property_type: formData.property_type,
        property_link: formData.property_link || undefined,
        postcode: formData.postcode,
        pricingPCM: Number(formData.pricingPCM),
        pricingPA: Number(formData.pricingPA),
        sizeSQFT: {
          minimum: Number(formData.sizeSQFT?.minimum || 0),
          maximum: Number(formData.sizeSQFT?.maximum || 0),
        },
        pricePerSqftPA: Number(formData.pricePerSqftPA),
        pricePerSqftPCM: Number(formData.pricePerSqftPCM),
        comments: formData.comments || '',
      };

      const response = await axiosInstance.put<{ success: boolean; data: CommercialProperty }>(
        `/api/aical/commercial-properties/${editingPropertyId}`,
        updateData
      );

      if (response.data.success) {
        setEditDialogOpen(false);
        setEditingPropertyId(null);
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
      } else {
        throw new Error('Failed to update property');
      }
    } catch (err: any) {
      console.error('Error updating property:', err);
      setEditError(err?.response?.data?.message || err?.message || 'Failed to update property');
    } finally {
      setUpdatingProperty(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          {loading && properties.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : properties.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No properties found
              </Typography>
            </Box>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                    <TableCell sx={{ fontWeight: 600 }}>Property Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Postcode</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Pricing PCM</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Pricing PA</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Size (SQFT)</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Price/Sqft PA</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Price/Sqft PCM</TableCell>
                    {!isMobile && <TableCell sx={{ fontWeight: 600 }}>Property Link</TableCell>}
                    {!isMobile && <TableCell sx={{ fontWeight: 600 }}>Created At</TableCell>}
                    <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow
                      key={property._id}
                      hover
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      <TableCell>
                        <Chip
                          label={property.property_type}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{property.postcode}</TableCell>
                      <TableCell>{formatCurrency(property.pricingPCM)}</TableCell>
                      <TableCell>{formatCurrency(property.pricingPA)}</TableCell>
                      <TableCell>
                        {formatNumber(property.sizeSQFT.minimum)} - {formatNumber(property.sizeSQFT.maximum)}
                      </TableCell>
                      <TableCell>{formatCurrency(property.pricePerSqftPA)}</TableCell>
                      <TableCell>{formatCurrency(property.pricePerSqftPCM)}</TableCell>
                      {!isMobile && (
                        <TableCell>
                          {property.property_link ? (
                            <Typography
                              component="a"
                              href={property.property_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                color: 'primary.main',
                                textDecoration: 'none',
                                '&:hover': {
                                  textDecoration: 'underline',
                                },
                              }}
                            >
                              View Link
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              -
                            </Typography>
                          )}
                        </TableCell>
                      )}
                      {!isMobile && (
                        <TableCell>{formatDate(property.createdAt)}</TableCell>
                      )}
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleEditClick(property)}
                            disabled={deleting || fetchingProperty}
                            aria-label="edit property"
                            sx={{
                              '&:hover': {
                                bgcolor: 'primary.lighter',
                              },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteClick(property)}
                            disabled={deleting}
                            aria-label="delete property"
                            sx={{
                              '&:hover': {
                                bgcolor: 'error.lighter',
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Delete Confirmation Dialog */}
              <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
                maxWidth="sm"
                fullWidth
                PaperProps={{
                  sx: {
                    borderRadius: 2,
                  },
                }}
              >
                <DialogTitle
                  id="delete-dialog-title"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    pb: 2,
                    pt: 3,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: 'error.lighter',
                      color: 'error.main',
                    }}
                  >
                    <WarningIcon sx={{ fontSize: 28 }} />
                  </Box>
                  <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
                    Delete Property
                  </Typography>
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ pt: 3, pb: 2 }}>
                  <Alert severity="warning" icon={false} sx={{ mb: 3, borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Are you sure you want to delete this property? This action cannot be undone.
                    </Typography>
                  </Alert>
                  {propertyToDelete && (
                    <Box
                      sx={{
                        bgcolor: 'grey.50',
                        borderRadius: 1,
                        p: 2.5,
                        border: 1,
                        borderColor: 'grey.200',
                      }}
                    >
                      <Stack spacing={2}>
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              fontWeight: 500,
                              textTransform: 'uppercase',
                              letterSpacing: 0.5,
                              fontSize: '0.7rem',
                            }}
                          >
                            Property Type
                          </Typography>
                          <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                            {propertyToDelete.property_type}
                          </Typography>
                        </Box>
                        <Divider />
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              fontWeight: 500,
                              textTransform: 'uppercase',
                              letterSpacing: 0.5,
                              fontSize: '0.7rem',
                            }}
                          >
                            Postcode
                          </Typography>
                          <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                            {propertyToDelete.postcode}
                          </Typography>
                        </Box>
                        <Divider />
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              fontWeight: 500,
                              textTransform: 'uppercase',
                              letterSpacing: 0.5,
                              fontSize: '0.7rem',
                            }}
                          >
                            Pricing PA
                          </Typography>
                          <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                            {formatCurrency(propertyToDelete.pricingPA)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  )}
                </DialogContent>
                <Divider />
                <DialogActions sx={{ px: 3, py: 2.5, gap: 1.5 }}>
                  <Button
                    onClick={handleDeleteCancel}
                    disabled={deleting}
                    variant="outlined"
                    sx={{
                      minWidth: 100,
                      textTransform: 'none',
                      borderRadius: 1,
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteConfirm}
                    color="error"
                    variant="contained"
                    disabled={deleting}
                    startIcon={
                      deleting ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <DeleteIcon />
                      )
                    }
                    sx={{
                      minWidth: 120,
                      textTransform: 'none',
                      borderRadius: 1,
                      boxShadow: 2,
                      '&:hover': {
                        boxShadow: 4,
                      },
                    }}
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </DialogActions>
              </Dialog>

              {/* Edit Property Dialog */}
              <Dialog
                open={editDialogOpen}
                onClose={handleEditCancel}
                aria-labelledby="edit-dialog-title"
                maxWidth="md"
                fullWidth
                PaperProps={{
                  sx: {
                    borderRadius: 2,
                  },
                }}
              >
                <DialogTitle
                  id="edit-dialog-title"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    pb: 2,
                    pt: 3,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: 'primary.lighter',
                      color: 'primary.main',
                    }}
                  >
                    <EditIcon sx={{ fontSize: 28 }} />
                  </Box>
                  <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
                    Edit Property
                  </Typography>
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ pt: 3, pb: 2 }}>
                  {editError && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
                      {editError}
                    </Alert>
                  )}

                  {fetchingProperty ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Box component="form" noValidate>
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                          gap: 2.5,
                        }}
                      >
                        <TextField
                          fullWidth
                          select
                          label="Property Type"
                          value={formData.property_type || ''}
                          onChange={(e) => handleFormChange('property_type', e.target.value)}
                          required
                          variant="outlined"
                          size="medium"
                        >
                          {propertyTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                              {type}
                            </MenuItem>
                          ))}
                        </TextField>

                        <TextField
                          fullWidth
                          label="Postcode"
                          value={formData.postcode || ''}
                          onChange={(e) => handleFormChange('postcode', e.target.value)}
                          required
                          variant="outlined"
                          size="medium"
                          inputProps={{ maxLength: 10 }}
                        />

                        <Box sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1' } }}>
                          <TextField
                            fullWidth
                            label="Property Link"
                            value={formData.property_link || ''}
                            onChange={(e) => handleFormChange('property_link', e.target.value)}
                            variant="outlined"
                            size="medium"
                            placeholder="https://..."
                          />
                        </Box>

                        <TextField
                          fullWidth
                          label="Pricing PCM"
                          type="number"
                          value={formData.pricingPCM || ''}
                          onChange={(e) => handleFormChange('pricingPCM', e.target.value)}
                          required
                          variant="outlined"
                          size="medium"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Typography variant="body2" color="text.secondary">
                                  £
                                </Typography>
                              </InputAdornment>
                            ),
                          }}
                          inputProps={{ min: 0, step: 0.01 }}
                        />

                        <TextField
                          fullWidth
                          label="Pricing PA"
                          type="number"
                          value={formData.pricingPA || ''}
                          onChange={(e) => handleFormChange('pricingPA', e.target.value)}
                          required
                          variant="outlined"
                          size="medium"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Typography variant="body2" color="text.secondary">
                                  £
                                </Typography>
                              </InputAdornment>
                            ),
                          }}
                          inputProps={{ min: 0, step: 0.01 }}
                        />

                        <TextField
                          fullWidth
                          label="Size SQFT (Minimum)"
                          type="number"
                          value={formData.sizeSQFT?.minimum || ''}
                          onChange={(e) => handleFormChange('sizeSQFT.minimum', e.target.value)}
                          required
                          variant="outlined"
                          size="medium"
                          inputProps={{ min: 0 }}
                        />

                        <TextField
                          fullWidth
                          label="Size SQFT (Maximum)"
                          type="number"
                          value={formData.sizeSQFT?.maximum || ''}
                          onChange={(e) => handleFormChange('sizeSQFT.maximum', e.target.value)}
                          required
                          variant="outlined"
                          size="medium"
                          inputProps={{ min: 0 }}
                        />

                        <TextField
                          fullWidth
                          label="Price Per Sqft PA"
                          type="number"
                          value={formData.pricePerSqftPA || ''}
                          onChange={(e) => handleFormChange('pricePerSqftPA', e.target.value)}
                          required
                          variant="outlined"
                          size="medium"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Typography variant="body2" color="text.secondary">
                                  £
                                </Typography>
                              </InputAdornment>
                            ),
                          }}
                          inputProps={{ min: 0, step: 0.01 }}
                        />

                        <TextField
                          fullWidth
                          label="Price Per Sqft PCM"
                          type="number"
                          value={formData.pricePerSqftPCM || ''}
                          onChange={(e) => handleFormChange('pricePerSqftPCM', e.target.value)}
                          required
                          variant="outlined"
                          size="medium"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Typography variant="body2" color="text.secondary">
                                  £
                                </Typography>
                              </InputAdornment>
                            ),
                          }}
                          inputProps={{ min: 0, step: 0.01 }}
                        />

                        <Box sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1' } }}>
                          <TextField
                            fullWidth
                            label="Comments"
                            value={formData.comments || ''}
                            onChange={(e) => handleFormChange('comments', e.target.value)}
                            variant="outlined"
                            size="medium"
                            multiline
                            rows={4}
                            inputProps={{ maxLength: 2000 }}
                            helperText={`${(formData.comments || '').length}/2000 characters`}
                          />
                        </Box>
                      </Box>
                    </Box>
                  )}
                </DialogContent>
                <Divider />
                <DialogActions sx={{ px: 3, py: 2.5, gap: 1.5 }}>
                  <Button
                    onClick={handleEditCancel}
                    disabled={updatingProperty || fetchingProperty}
                    variant="outlined"
                    sx={{
                      minWidth: 100,
                      textTransform: 'none',
                      borderRadius: 1,
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateSubmit}
                    color="primary"
                    variant="contained"
                    disabled={updatingProperty || fetchingProperty}
                    startIcon={
                      updatingProperty ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <SaveIcon />
                      )
                    }
                    sx={{
                      minWidth: 120,
                      textTransform: 'none',
                      borderRadius: 1,
                      boxShadow: 2,
                      '&:hover': {
                        boxShadow: 4,
                      },
                    }}
                  >
                    {updatingProperty ? 'Updating...' : 'Update'}
                  </Button>
                </DialogActions>
              </Dialog>

              <TablePagination
                component="div"
                count={pagination.total_documents || 0}
                page={pagination.current_page ? pagination.current_page - 1 : 0}
                onPageChange={(event, newPage) => onPageChange(newPage + 1)}
                rowsPerPage={pagination.limit || 10}
                onRowsPerPageChange={(event) => onLimitChange(parseInt(event.target.value, 10))}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage={isMobile ? 'Rows:' : 'Rows per page:'}
                labelDisplayedRows={({ from, to, count }) => 
                  `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
                }
                sx={{
                  borderTop: 1,
                  borderColor: 'divider',
                  '& .MuiTablePagination-toolbar': {
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                    gap: { xs: 1, sm: 0 },
                    px: { xs: 1, sm: 2 },
                  },
                }}
              />
            </>
          )}
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default DataTable;
