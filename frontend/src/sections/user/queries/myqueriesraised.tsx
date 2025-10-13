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
} from '@mui/material';
import axiosInstance from '../../../utils/axios';

// Interface for the query data structure
export interface PropertyDetails {
  _id: string;
  general_details: {
    building_name: string;
    address: string;
    town_city: string;
    property_type: string;
  };
}

export interface AgentDetails {
  _id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone: string;
  company_name?: string;
}

export interface MyQueryData {
  _id: string;
  title: string;
  first_name: string;
  last_name: string;
  company: string;
  email: string;
  phone: string;
  property_id: PropertyDetails;
  agent_id: AgentDetails;
  user_id: string;
  no_of_people: number;
  start_date: string;
  length_of_term: string;
  message: string;
  deleted_at: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Props interface for the component
interface MyQueriesRaisedProps {
  onQueryClick?: (query: MyQueryData) => void;
}

const MyQueriesRaised: React.FC<MyQueriesRaisedProps> = ({ 
  onQueryClick 
}) => {
  
  const [queries, setQueries] = useState<MyQueryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // Fetch queries from API
  const fetchMyQueries = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axiosInstance.get('/api/user/queries/my-queries');
      
      if (response.data.success) {
        const queriesData = response.data.data.queries || [];
        setQueries(queriesData);
      } else {
        setError(response.data.message || 'Failed to fetch queries');
      }
    } catch (err: any) {
      console.error('Error fetching queries:', err);
      setError(err?.response?.data?.message || 'Failed to fetch queries');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch queries on component mount
  useEffect(() => {
    fetchMyQueries();
  }, []);

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
          Loading your queries...
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
            ⚠️ Error Loading Queries
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
                <TableCell sx={{ fontWeight: 600 }}>Property</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Agent</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>People</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Start Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Message</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={8}>
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
                      Unable to load queries due to an error
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }


  // If no queries, show empty state centered
  if (!isLoading && !error && (!queries || queries.length === 0)) {
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
          No queries you have raised till now
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
          Start exploring properties to make inquiries
        </Typography>
      </Box>
    );
  }

  const handleRowClick = (query: MyQueryData) => {
    if (onQueryClick) {
      onQueryClick(query);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Agent Queries
      </Typography>
      
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Property</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Agent</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>People</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Start Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queries.length > 0 ? queries.map((query) => (
              <TableRow 
                key={query._id} 
                hover
                onClick={() => handleRowClick(query)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>
                  {query.title} {query.first_name} {query.last_name}
                </TableCell>
                <TableCell>
                  {query.phone}
                </TableCell>
                <TableCell>
                  {query.company}
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {query.property_id && typeof query.property_id === 'object' && query.property_id !== null 
                        ? query.property_id.general_details?.building_name || 'N/A'
                        : 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {query.property_id && typeof query.property_id === 'object' && query.property_id !== null 
                        ? `${query.property_id.general_details?.property_type || ''} - ${query.property_id.general_details?.town_city || ''}`.replace(/^ - | - $|^$/, '')
                        : ''}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {query.agent_id && typeof query.agent_id === 'object' && query.agent_id !== null 
                        ? `${query.agent_id.first_name || ''} ${query.agent_id.last_name || ''}`.trim() || query.agent_id.email || 'N/A'
                        : 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {query.agent_id && typeof query.agent_id === 'object' && query.agent_id !== null 
                        ? query.agent_id.phone || ''
                        : ''}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {query.no_of_people}
                </TableCell>
                <TableCell>
                  {new Date(query.start_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      maxWidth: '200px', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                    title={query.message}
                  >
                    {query.message || 'No message'}
                  </Typography>
                </TableCell>
              </TableRow>
            )) : (
              <>
                <TableRow>
                  <TableCell colSpan={8}>
                    <Box sx={{ textAlign: 'center', padding: '20px' }}>
                      <Typography variant="body1" color="text.secondary">
                        No queries found
                      </Typography>
                    </Box>
                  </TableCell>
                  </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MyQueriesRaised;
