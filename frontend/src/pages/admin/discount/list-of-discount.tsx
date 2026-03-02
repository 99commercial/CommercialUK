import React, { useEffect, useState, useMemo } from 'react';
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
  Chip,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  DialogContentText,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  LocalOffer as DiscountIcon,
} from '@mui/icons-material';
import Page from '../../../components/Page';
import HeaderCard from '../../../components/HeaderCard';
import axiosInstance from '../../../utils/axios';
import { enqueueSnackbar } from 'notistack';

// Types
export interface DiscountCode {
  _id: string;
  code: string;
  discount_percentage: number;
  expiry_date: string | null;
  is_active: boolean;
  usage_count: number;
  max_usage: number | null;
  created_by: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

const ListOfDiscountPage: React.FC = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<'code' | 'createdAt' | 'discount_percentage'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<DiscountCode | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    discount_percentage: '',
    expiry_date: '',
    max_usage: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalDiscountCodes: 0,
    limit: 10,
  });

  // Fetch discount codes
  const fetchDiscountCodes = async (pageNum: number = 1, limit: number = 10, search: string = '') => {
    try {
      setLoading(true);
      const params: any = {
        page: pageNum,
        limit,
        sort_by: sortBy,
        sort_order: sortOrder,
      };
      
      if (search) {
        params.search = search;
      }

      const response = await axiosInstance.get('/api/admin/discount-codes', { params });
      
      if (response.data.status && response.data.data) {
        setDiscountCodes(response.data.data.discountCodes || []);
        setPagination(response.data.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalDiscountCodes: 0,
          limit: 10,
        });
      }
    } catch (error: any) {
      console.error('Error fetching discount codes:', error);
      enqueueSnackbar(
        error?.response?.data?.message || 'Failed to fetch discount codes',
        { variant: 'error' }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscountCodes(page + 1, rowsPerPage, searchTerm);
  }, [page, rowsPerPage, sortBy, sortOrder]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDiscountCodes(1, rowsPerPage, searchTerm);
      setPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSort = (field: 'code' | 'createdAt' | 'discount_percentage') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: 'code' | 'createdAt' | 'discount_percentage') => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />;
  };

  const handleAddClick = () => {
    setFormData({
      discount_percentage: '',
      expiry_date: '',
      max_usage: '',
    });
    setAddDialogOpen(true);
  };

  const handleEditClick = (code: DiscountCode) => {
    setSelectedCode(code);
    setFormData({
      discount_percentage: code.discount_percentage.toString(),
      expiry_date: code.expiry_date ? new Date(code.expiry_date).toISOString().split('T')[0] : '',
      max_usage: code.max_usage ? code.max_usage.toString() : '',
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (code: DiscountCode) => {
    setSelectedCode(code);
    setDeleteDialogOpen(true);
  };

  const handleAddSubmit = async () => {
    if (!formData.discount_percentage) {
      enqueueSnackbar('Discount percentage is required', { variant: 'error' });
      return;
    }

    const percentage = parseFloat(formData.discount_percentage);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      enqueueSnackbar('Discount percentage must be between 0 and 100', { variant: 'error' });
      return;
    }

    setFormLoading(true);
    try {
      const payload: any = {
        discount_percentage: percentage,
      };

      if (formData.expiry_date) {
        payload.expiry_date = formData.expiry_date;
      }

      if (formData.max_usage) {
        const maxUsage = parseInt(formData.max_usage);
        if (!isNaN(maxUsage) && maxUsage > 0) {
          payload.max_usage = maxUsage;
        }
      }

      await axiosInstance.post('/api/admin/discount-codes/generate', payload);
      
      enqueueSnackbar('Discount code created successfully', { variant: 'success' });
      setAddDialogOpen(false);
      fetchDiscountCodes(page + 1, rowsPerPage, searchTerm);
    } catch (error: any) {
      console.error('Error creating discount code:', error);
      enqueueSnackbar(
        error?.response?.data?.message || 'Failed to create discount code',
        { variant: 'error' }
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedCode || !formData.discount_percentage) {
      enqueueSnackbar('Discount percentage is required', { variant: 'error' });
      return;
    }

    const percentage = parseFloat(formData.discount_percentage);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      enqueueSnackbar('Discount percentage must be between 0 and 100', { variant: 'error' });
      return;
    }

    setFormLoading(true);
    try {
      const payload: any = {
        discount_percentage: percentage,
      };

      if (formData.expiry_date) {
        payload.expiry_date = formData.expiry_date;
      } else {
        payload.expiry_date = null;
      }

      if (formData.max_usage) {
        const maxUsage = parseInt(formData.max_usage);
        if (!isNaN(maxUsage) && maxUsage > 0) {
          payload.max_usage = maxUsage;
        } else {
          payload.max_usage = null;
        }
      } else {
        payload.max_usage = null;
      }

      await axiosInstance.patch(`/api/admin/discount-codes/${selectedCode._id}`, payload);
      
      enqueueSnackbar('Discount code updated successfully', { variant: 'success' });
      setEditDialogOpen(false);
      setSelectedCode(null);
      fetchDiscountCodes(page + 1, rowsPerPage, searchTerm);
    } catch (error: any) {
      console.error('Error updating discount code:', error);
      enqueueSnackbar(
        error?.response?.data?.message || 'Failed to update discount code',
        { variant: 'error' }
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedCode) return;

    setDeleteLoading(true);
    try {
      await axiosInstance.delete(`/api/admin/discount-codes/${selectedCode._id}`);
      
      enqueueSnackbar('Discount code deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setSelectedCode(null);
      fetchDiscountCodes(page + 1, rowsPerPage, searchTerm);
    } catch (error: any) {
      console.error('Error deleting discount code:', error);
      enqueueSnackbar(
        error?.response?.data?.message || 'Failed to delete discount code',
        { variant: 'error' }
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const isExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const breadcrumbs = ['Admin', 'Discount Codes', 'List'];

  return (
    <Page title="Discount Codes">
      <HeaderCard
        title="Discount Codes Management"
        subtitle="Manage and monitor all discount codes for the platform"
        breadcrumbs={breadcrumbs}
      />

      <Card sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            All Discount Codes ({pagination.totalDiscountCodes})
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            sx={{
              background: 'linear-gradient(135deg, #f2c514 0%, #f4d03f 100%)',
              color: '#000',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #d4a912 0%, #f2c514 100%)',
              },
            }}
          >
            Add Discount Code
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 600 }}
          />
        </Box>

        {loading && discountCodes.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      onClick={() => handleSort('code')}
                      sx={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        Code
                        {getSortIcon('code')}
                      </Box>
                    </TableCell>
                    <TableCell
                      onClick={() => handleSort('discount_percentage')}
                      sx={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        Discount %
                        {getSortIcon('discount_percentage')}
                      </Box>
                    </TableCell>
                    <TableCell>Expiry Date</TableCell>
                    <TableCell>Usage</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell
                      onClick={() => handleSort('createdAt')}
                      sx={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        Created At
                        {getSortIcon('createdAt')}
                      </Box>
                    </TableCell>
                    <TableCell>Created By</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {discountCodes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          No discount codes found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    discountCodes.map((code) => (
                      <TableRow key={code._id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <DiscountIcon fontSize="small" color="primary" />
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                fontFamily: 'monospace',
                                fontSize: '1rem',
                              }}
                            >
                              {code.code}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {code.discount_percentage}%
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {code.expiry_date ? (
                            <Typography
                              variant="body2"
                              sx={{
                                color: isExpired(code.expiry_date) ? 'error.main' : 'text.primary',
                              }}
                            >
                              {new Date(code.expiry_date).toLocaleDateString()}
                              {isExpired(code.expiry_date) && (
                                <Chip
                                  label="Expired"
                                  size="small"
                                  color="error"
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No expiry
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {code.usage_count}
                            {code.max_usage ? ` / ${code.max_usage}` : ' / ∞'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={code.is_active ? 'Active' : 'Inactive'}
                            color={code.is_active ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(code.createdAt).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {code.created_by?.firstName} {code.created_by?.lastName}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" gap={1} justifyContent="center">
                            <IconButton
                              size="small"
                              onClick={() => handleEditClick(code)}
                              color="primary"
                              sx={{
                                '&:hover': {
                                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(code)}
                              color="error"
                              sx={{
                                '&:hover': {
                                  backgroundColor: 'rgba(220, 38, 38, 0.1)',
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={pagination.totalDiscountCodes}
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
      </Card>

      {/* Add Discount Code Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => !formLoading && setAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #f2c514 0%, #f4d03f 100%)',
            color: '#000',
            fontWeight: 700,
          }}
        >
          Add New Discount Code
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            fullWidth
            label="Discount Percentage"
            type="number"
            value={formData.discount_percentage}
            onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
            margin="normal"
            required
            inputProps={{ min: 0, max: 100, step: 0.01 }}
            helperText="Enter a value between 0 and 100"
          />
          <TextField
            fullWidth
            label="Expiry Date (Optional)"
            type="date"
            value={formData.expiry_date}
            onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Max Usage (Optional)"
            type="number"
            value={formData.max_usage}
            onChange={(e) => setFormData({ ...formData, max_usage: e.target.value })}
            margin="normal"
            inputProps={{ min: 1 }}
            helperText="Leave empty for unlimited usage"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setAddDialogOpen(false)}
            disabled={formLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddSubmit}
            variant="contained"
            disabled={formLoading}
            sx={{
              background: 'linear-gradient(135deg, #f2c514 0%, #f4d03f 100%)',
              color: '#000',
              '&:hover': {
                background: 'linear-gradient(135deg, #d4a912 0%, #f2c514 100%)',
              },
            }}
            startIcon={formLoading ? <CircularProgress size={20} /> : null}
          >
            {formLoading ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Discount Code Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => !formLoading && setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: 'white',
            fontWeight: 700,
          }}
        >
          Edit Discount Code: {selectedCode?.code}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            fullWidth
            label="Discount Percentage"
            type="number"
            value={formData.discount_percentage}
            onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
            margin="normal"
            required
            inputProps={{ min: 0, max: 100, step: 0.01 }}
            helperText="Enter a value between 0 and 100"
          />
          <TextField
            fullWidth
            label="Expiry Date (Optional)"
            type="date"
            value={formData.expiry_date}
            onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Max Usage (Optional)"
            type="number"
            value={formData.max_usage}
            onChange={(e) => setFormData({ ...formData, max_usage: e.target.value })}
            margin="normal"
            inputProps={{ min: 1 }}
            helperText="Leave empty for unlimited usage"
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Current Usage: {selectedCode?.usage_count || 0}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setEditDialogOpen(false);
              setSelectedCode(null);
            }}
            disabled={formLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            disabled={formLoading}
            sx={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
              },
            }}
            startIcon={formLoading ? <CircularProgress size={20} /> : null}
          >
            {formLoading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleteLoading && setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Discount Code</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete discount code <strong>{selectedCode?.code}</strong>?
            This action will soft delete the code and cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setSelectedCode(null);
            }}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteSubmit}
            color="error"
            variant="contained"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
};

export default ListOfDiscountPage;
