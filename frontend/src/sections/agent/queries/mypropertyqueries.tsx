import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Chip,
  TablePagination,
} from '@mui/material';
import axiosInstance from '../../../utils/axios';

// Interface for the query data structure
export interface QueryData {
  _id: string;
  title: string;
  first_name: string;
  last_name: string;
  company: string;
  email: string;
  phone: string;
  property_id: {
    _id: string;
    general_details?: {
      building_name: string;
      address: string;
      town_city: string;
      property_type: string;
    };
  };
  agent_id: string;
  user_id: {
    _id: string;
    email: string;
    phone: string;
    first_name?: string;
    last_name?: string;
  };
  no_of_people: number;
  start_date: string;
  length_of_term: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  deleted_at: string | null;
}

// Props interface for the component
interface MyPropertyQueriesProps {
  onQueryClick?: (query: QueryData) => void;
}

const MyPropertyQueries: React.FC<MyPropertyQueriesProps> = ({ 
  onQueryClick 
}) => {
  const [queries, setQueries] = useState<QueryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuery, setSelectedQuery] = useState<QueryData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_documents: 0,
    has_next_page: false,
    has_prev_page: false,
    limit: 10,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  let user = JSON.parse(localStorage.getItem('user') || '{}');
  let agentId = user.id;

  // Fetch queries from API
  const fetchPropertyQueries = async (pageNumber: number = 1, limit: number = 10) => {
    if (!agentId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axiosInstance.get(`/api/agent/agents/${agentId}/queries?page=${pageNumber}&limit=${limit}`);
      
      if (response.data.success) {
        setQueries(response.data.data?.queries || []);
        setPagination(response.data.data?.pagination || pagination);
      } else {
        setError(response.data.message || 'Failed to fetch property queries');
      }
    } catch (err: any) {
      console.error('Error fetching property queries:', err);
      setError(err?.response?.data?.message || 'Failed to fetch property queries');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch queries when agent ID is available
  useEffect(() => {
    if (agentId) {
      fetchPropertyQueries();
    }
  }, [agentId]);

  // If loading, show loading state
  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '300px',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress size={40} />
        <Typography 
          variant="body1"
          sx={{ 
            color: '#1976d2',
            fontWeight: 500,
            fontSize: '16px',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
          }}
        >
          Loading property queries...
        </Typography>
      </Box>
    );
  }

  // If error, show error state with table structure
  if (error) {
    return (
      <Box>
        {/* Error Message Banner */}
        <Box 
          sx={{ 
            backgroundColor: '#ffebee',
            border: '1px solid #f44336',
            borderRadius: '8px',
            padding: '16px',
            margin: '16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#d32f2f',
              fontWeight: 600,
              fontSize: '18px',
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
            }}
          >
            ⚠️ Error Loading Property Queries
          </Typography>
          <Typography 
            variant="body1"
            sx={{ 
              color: '#b71c1c',
              fontWeight: 500,
              fontSize: '14px',
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
            }}
          >
            {error}
          </Typography>
        </Box>

        {/* Empty Table with Error State */}
        <TableContainer component={Paper} sx={{ mt: 1 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Property ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Agent ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5}>
                  <Box 
                    sx={{ 
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '40px 20px',
                      textAlign: 'center'
                    }}
                  >
                    <Typography 
                      variant="body1"
                      sx={{ 
                        color: '#666666',
                        fontWeight: 400,
                        fontSize: '14px',
                        fontStyle: 'italic'
                      }}
                    >
                      Unable to load property queries due to an error
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            </ TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  // If no queries, show empty state centered
  if (!queries || queries.length === 0) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            color: '#666666',
            fontWeight: 500,
            fontSize: '20px',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
          }}
        >
          No property queries received yet
        </Typography>
        <Typography 
          variant="body1"
          sx={{ 
            color: '#999999',
            fontWeight: 400,
            fontSize: '14px',
            fontStyle: 'italic',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
          }}
        >
          When users enquire about your properties, they will appear here
        </Typography>
      </Box>
    );
  }

  const handleRowClick = (query: QueryData) => {
    setSelectedQuery(query);
    setModalOpen(true);
    if (onQueryClick) {
      onQueryClick(query);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedQuery(null);
  };

  // TablePagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    fetchPropertyQueries(newPage + 1, rowsPerPage); // Convert to 1-based indexing
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    fetchPropertyQueries(1, newRowsPerPage);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Property Queries Received
      </Typography>
      
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Property ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Agent ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queries.map((query) => (
              <TableRow 
                key={query._id} 
                hover
                onClick={() => handleRowClick(query)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>
                  {query.first_name} {query.last_name}
                </TableCell>
                <TableCell>
                  {query.phone}
                </TableCell>
                <TableCell>
                  {query.company}
                </TableCell>
                <TableCell>
                  {query.property_id?._id || 'N/A'}
                </TableCell>
                <TableCell>
                  {query.agent_id}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* TablePagination */}
      <TablePagination
        component="div"
        count={pagination.total_documents}
        page={pagination.current_page - 1}
        onPageChange={(event, newPage) => fetchPropertyQueries(newPage + 1)}
        rowsPerPage={pagination.limit}
        onRowsPerPageChange={(event) => fetchPropertyQueries(1, parseInt(event.target.value))}
        rowsPerPageOptions={[5, 10, 25, 50]}
        sx={{
          backgroundColor: '#f5f5f5',
        }}
      />

      {/* Query Details Modal */}
      <Dialog 
        open={modalOpen} 
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Query Details - Property ID: {selectedQuery?.property_id?._id}
        </DialogTitle>
        <DialogContent>
          {selectedQuery && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Personal Information */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Personal Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ minWidth: '200px', flex: '1 1 200px' }}>
                      <Typography variant="body2" color="text.secondary">
                        Title:
                      </Typography>
                      <Typography variant="body1">
                        {selectedQuery.title}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: '200px', flex: '1 1 200px' }}>
                      <Typography variant="body2" color="text.secondary">
                        Company:
                      </Typography>
                      <Typography variant="body1">
                        {selectedQuery.company}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: '200px', flex: '1 1 200px' }}>
                      <Typography variant="body2" color="text.secondary">
                        First Name:
                      </Typography>
                      <Typography variant="body1">
                        {selectedQuery.first_name}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: '200px', flex: '1 1 200px' }}>
                      <Typography variant="body2" color="text.secondary">
                        Last Name:
                      </Typography>
                      <Typography variant="body1">
                        {selectedQuery.last_name}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: '200px', flex: '1 1 200px' }}>
                      <Typography variant="body2" color="text.secondary">
                        Email:
                      </Typography>
                      <Typography variant="body1">
                        {selectedQuery.email}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: '200px', flex: '1 1 200px' }}>
                      <Typography variant="body2" color="text.secondary">
                        Phone:
                      </Typography>
                      <Typography variant="body1">
                        {selectedQuery.phone}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Query Details */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Query Details
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ minWidth: '200px', flex: '1 1 200px' }}>
                      <Typography variant="body2" color="text.secondary">
                        No of People:
                      </Typography>
                      <Typography variant="body1">
                        {selectedQuery.no_of_people}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: '200px', flex: '1 1 200px' }}>
                      <Typography variant="body2" color="text.secondary">
                        Length of Term:
                      </Typography>
                      <Typography variant="body1">
                        {selectedQuery.length_of_term}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: '200px', flex: '1 1 200px' }}>
                      <Typography variant="body2" color="text.secondary">
                        Start Date:
                      </Typography>
                      <Typography variant="body1">
                        {new Date(selectedQuery.start_date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: '100%', flex: '1 1 100%' }}>
                      <Typography variant="body2" color="text.secondary">
                        Message:
                      </Typography>
                      <Typography variant="body1">
                        {selectedQuery.message}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Property Information */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Property Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ minWidth: '100%', flex: '1 1 100%' }}>
                      <Typography variant="body2" color="text.secondary">
                        Property ID:
                      </Typography>
                      <Typography variant="body1">
                        {selectedQuery.property_id?._id}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: '100%', flex: '1 1 100%' }}>
                      <Typography variant="body2" color="text.secondary">
                        Building Name:
                      </Typography>
                      <Typography variant="body1">
                        {selectedQuery.property_id?.general_details?.building_name || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: '100%', flex: '1 1 100%' }}>
                      <Typography variant="body2" color="text.secondary">
                        Address:
                      </Typography>
                      <Typography variant="body1">
                        {selectedQuery.property_id?.general_details?.address || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: '200px', flex: '1 1 200px' }}>
                      <Typography variant="body2" color="text.secondary">
                        City:
                      </Typography>
                      <Typography variant="body1">
                        {selectedQuery.property_id?.general_details?.town_city || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: '200px', flex: '1 1 200px' }}>
                      <Typography variant="body2" color="text.secondary">
                        Property Type:
                      </Typography>
                      <Typography variant="body1">
                        {selectedQuery.property_id?.general_details?.property_type || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* User Information */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    User Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ minWidth: '100%', flex: '1 1 100%' }}>
                      <Typography variant="body2" color="text.secondary">
                        User ID:
                      </Typography>
                      <Typography variant="body1">
                        {selectedQuery.user_id._id}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: '200px', flex: '1 1 200px' }}>
                      <Typography variant="body2" color="text.secondary">
                        Email:
                      </Typography>
                      <Typography variant="body1">
                        {selectedQuery.user_id.email}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: '200px', flex: '1 1 200px' }}>
                      <Typography variant="body2" color="text.secondary">
                        Phone:
                      </Typography>
                      <Typography variant="body1">
                        {selectedQuery.user_id.phone}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* System Information */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    System Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ minWidth: '100%', flex: '1 1 100%' }}>
                      <Typography variant="body2" color="text.secondary">
                        Query ID:
                      </Typography>
                      <Typography variant="body1">
                        {selectedQuery._id}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: '200px', flex: '1 1 200px' }}>
                      <Typography variant="body2" color="text.secondary">
                        Agent ID:
                      </Typography>
                      <Typography variant="body1">
                        {selectedQuery.agent_id}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: '200px', flex: '1 1 200px' }}>
                      <Typography variant="body2" color="text.secondary">
                        Created At:
                      </Typography>
                      <Typography variant="body1">
                        {new Date(selectedQuery.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: '200px', flex: '1 1 200px' }}>
                      <Typography variant="body2" color="text.secondary">
                        Updated At:
                      </Typography>
                      <Typography variant="body1">
                        {new Date(selectedQuery.updatedAt).toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: '200px', flex: '1 1 200px' }}>
                      <Typography variant="body2" color="text.secondary">
                        Status:
                      </Typography>
                      <Chip 
                        label={selectedQuery.deleted_at ? 'Deleted' : 'Active'} 
                        color={selectedQuery.deleted_at ? 'error' : 'success'}
                        size="small"
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyPropertyQueries;