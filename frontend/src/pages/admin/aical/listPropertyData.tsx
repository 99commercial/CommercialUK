import React, { useState, useEffect } from 'react';
import { Box, Alert, CircularProgress, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Page from '../../../components/Page';
import HeaderCard from '../../../components/HeaderCard';
import DataTable from '../../../sections/admin/aical/dataTable';
import axiosInstance from '@/utils/axios';
import { useRouter } from 'next/router';

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

interface ApiResponse {
  success: boolean;
  data: CommercialProperty[];
    pagination: PaginationData;
}

const ListPropertyDataPage: React.FC = () => {
  const router = useRouter();
  const [properties, setProperties] = useState<CommercialProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    total_pages: 0,
    total_documents: 0,
    limit: 10,
  });

  const fetchProperties = async (currentPage: number, currentLimit: number, search: string = '') => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get<ApiResponse>('/api/aical/commercial-properties', {
        params: {
          page: currentPage,
          limit: currentLimit,
          search: search || undefined,
        },
      });

      console.log(response.data, "response.data shardul chaudhary");

      if (response.data.success) {
        setProperties(response.data.data || []);
        setPagination(response.data.pagination || {
          current_page: currentPage,
          total_pages: 0,
          total_documents: 0,
          limit: currentLimit,
        });
      } else {
        throw new Error('Failed to fetch properties');
      }
    } catch (err: any) {
      console.error('Error fetching properties:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to fetch properties';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    // Get page and limit from query params if available
    const queryPage = router.query.page ? parseInt(router.query.page as string) : 1;
    const queryLimit = router.query.limit ? parseInt(router.query.limit as string) : 10;
    const querySearch = router.query.search as string || '';
    
    setPage(queryPage);
    setLimit(queryLimit);
    setSearchQuery(querySearch);
    setDebouncedSearchQuery(querySearch);
    fetchProperties(queryPage, queryLimit, querySearch);
  }, [router.query.page, router.query.limit, router.query.search]);

  // Fetch properties when debounced search query changes
  useEffect(() => {
    if (debouncedSearchQuery !== undefined) {
      setPage(1);
      router.push({
        pathname: router.pathname,
        query: { ...router.query, page: 1, search: debouncedSearchQuery || undefined },
      }, undefined, { shallow: true });
      fetchProperties(1, limit, debouncedSearchQuery);
    }
  }, [debouncedSearchQuery]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: newPage },
    }, undefined, { shallow: true });
    fetchProperties(newPage, limit, debouncedSearchQuery);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: 1, limit: newLimit },
    }, undefined, { shallow: true });
    fetchProperties(1, newLimit, debouncedSearchQuery);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await axiosInstance.delete(`/api/aical/commercial-properties/${id}`);
      
      // Refresh the current page data
      await fetchProperties(page, limit, debouncedSearchQuery);
    } catch (err: any) {
      console.error('Error deleting property:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to delete property';
      setError(errorMessage);
      throw err; // Re-throw to let DataTable handle the error state
    }
  };

  const handleEdit = (property: CommercialProperty) => {
    // Edit functionality is handled in DataTable component
    // This function is kept for compatibility but not used
  };

  const handleUpdateSuccess = () => {
    // Refresh the current page data after successful update
    fetchProperties(page, limit, debouncedSearchQuery);
  };

  const breadcrumbs = ['Admin', 'AICal', 'Property Data'];

  return (
    <Page title="Property Data">
      <HeaderCard
        title="Commercial Property Data ( AI Training Data )"
        breadcrumbs={breadcrumbs}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by property type, postcode, or comments..."
          value={searchQuery}
          onChange={handleSearchChange}
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

      {loading && properties.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataTable
          properties={properties}
          pagination={pagination}
          loading={loading}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </Page>
  );
};

export default ListPropertyDataPage;
