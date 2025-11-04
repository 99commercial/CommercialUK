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
  Card,
  Chip,
  TablePagination,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MessageIcon from '@mui/icons-material/Message';
import axiosInstance from '../../../utils/axios';
import Loader from '@/components/Loader';

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

// Styled Components
const StyledContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#f8fafc',
  minHeight: '100vh',
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3, 4),
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  borderRadius: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  border: '1px solid rgba(220, 38, 38, 0.1)',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(1.5),
    padding: theme.spacing(2, 2.5),
    marginBottom: theme.spacing(2.5),
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  border: '1px solid rgba(226, 232, 240, 0.8)',
  overflowX: 'auto',
  overflowY: 'hidden',
  background: '#ffffff',
  [theme.breakpoints.down('md')]: {
    borderRadius: theme.spacing(2),
  },
  [theme.breakpoints.down('sm')]: {
    borderRadius: theme.spacing(1.5),
    overflowX: 'scroll',
    WebkitOverflowScrolling: 'touch',
    '&::-webkit-scrollbar': {
      height: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#dc2626',
      borderRadius: '4px',
      '&:hover': {
        background: '#b91c1c',
      },
    },
  },
}));

const StyledTable = styled(Table)({
  '& .MuiTableHead-root': {
    backgroundColor: '#f8fafc',
  },
});

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '0.95rem',
  fontFamily: '"Montserrat", sans-serif',
  color: '#1e293b',
  letterSpacing: '0.02em',
  padding: theme.spacing(2, 3),
  borderBottom: '2px solid rgba(220, 38, 38, 0.2)',
  backgroundColor: '#f8fafc',
  whiteSpace: 'nowrap',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1.5, 2),
    fontSize: '0.85rem',
    minWidth: '120px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 1.5),
    fontSize: '0.8rem',
    minWidth: '100px',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
  '&:hover': {
    backgroundColor: 'rgba(220, 38, 38, 0.05)',
    transform: 'translateX(4px)',
    boxShadow: 'inset 4px 0 0 #dc2626',
  },
  '&:last-child td': {
    borderBottom: 'none',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontFamily: '"Lato", sans-serif',
  fontSize: '0.95rem',
  color: '#334155',
  padding: theme.spacing(2.5, 3),
  fontWeight: 400,
  letterSpacing: '0.01em',
  borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1.5, 2),
    fontSize: '0.85rem',
    minWidth: '120px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 1.5),
    fontSize: '0.8rem',
    minWidth: '100px',
  },
}));

const EmptyStateCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(8),
  textAlign: 'center',
  background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
  borderRadius: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '2px dashed rgba(220, 38, 38, 0.2)',
}));

const MyQueriesRaised: React.FC<MyQueriesRaisedProps> = ({ 
  onQueryClick 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [queries, setQueries] = useState<MyQueryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_documents: 0,
    has_next_page: false,
    has_prev_page: false,
    limit: 10,
  });

  // Fetch queries from API
  const fetchMyQueries = async (pageNumber: number = 1, limit: number = 10) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axiosInstance.get(`/api/user/queries/my-queries?page=${pageNumber}&limit=${limit}`);
      
      if (response.data.success) {
        const queriesData = response.data.data?.queries || [];
        setQueries(queriesData);
        setPagination(response.data.data?.pagination || pagination);
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
      <StyledContainer>
        <Paper 
          sx={{ 
            p: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          }}
        >
          <Loader
            fullscreen={false}
            size="medium"
          />
        </Paper>
      </StyledContainer>
    );
  }

  // If error, show error state with table structure
  if (error) {
    return (
      <StyledContainer>
        {/* Error Message Banner */}
        <Card 
          sx={{ 
            backgroundColor: '#fff5f5',
            border: '2px solid #fecaca',
            borderRadius: 3,
            padding: 3,
            marginBottom: 3,
            boxShadow: '0 4px 20px rgba(220, 38, 38, 0.15)',
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#dc2626',
              fontWeight: 700,
              fontSize: '1.25rem',
              fontFamily: '"Montserrat", sans-serif',
              mb: 1,
            }}
          >
            ⚠️ Error Loading Queries
          </Typography>
          <Typography 
            variant="body1"
            sx={{ 
              color: '#991b1b',
              fontWeight: 400,
              fontSize: '1rem',
              fontFamily: '"Lato", sans-serif',
            }}
          >
            {error}
          </Typography>
        </Card>

        {/* Empty Table with Error State */}
        <StyledTableContainer>
          <StyledTable>
            <TableHead>
              <TableRow>
                <StyledTableHeadCell>Name</StyledTableHeadCell>
                <StyledTableHeadCell>Phone</StyledTableHeadCell>
                <StyledTableHeadCell>Company</StyledTableHeadCell>
                <StyledTableHeadCell>Property</StyledTableHeadCell>
                <StyledTableHeadCell>Agent</StyledTableHeadCell>
                <StyledTableHeadCell>People</StyledTableHeadCell>
                <StyledTableHeadCell>Start Date</StyledTableHeadCell>
                <StyledTableHeadCell>Message</StyledTableHeadCell>
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
                      padding: '60px 20px',
                      textAlign: 'center'
                    }}
                  >
                    <Typography 
                      variant="body1"
                      sx={{ 
                        color: '#64748b',
                        fontWeight: 400,
                        fontSize: '1rem',
                        fontFamily: '"Lato", sans-serif',
                      }}
                    >
                      Unable to load queries due to an error
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </StyledTable>
        </StyledTableContainer>
      </StyledContainer>
    );
  }


  // If no queries, show empty state centered
  if (!isLoading && !error && (!queries || queries.length === 0)) {
    return (
      <StyledContainer>
        <HeaderSection>
          <Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                color: '#1e293b',
                fontFamily: '"Montserrat", sans-serif',
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                letterSpacing: '-0.015em',
                mb: 0.5,
              }}
            >
              My Queries Raised
            </Typography>
          </Box>
        </HeaderSection>
        <EmptyStateCard>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#1e293b',
              fontWeight: 700,
              fontSize: '1.75rem',
              fontFamily: '"Montserrat", sans-serif',
              mb: 2,
              letterSpacing: '-0.015em',
            }}
          >
            No queries raised yet
          </Typography>
          <Typography 
            variant="body1"
            sx={{ 
              color: '#64748b',
              fontWeight: 400,
              fontSize: '1.1rem',
              fontFamily: '"Lato", sans-serif',
              lineHeight: 1.6,
              letterSpacing: '0.01em',
            }}
          >
            Start exploring properties to make inquiries
          </Typography>
        </EmptyStateCard>
      </StyledContainer>
    );
  }

  const handleRowClick = (query: MyQueryData) => {
    if (onQueryClick) {
      onQueryClick(query);
    }
  };

  return (
    <StyledContainer>
      <HeaderSection>
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#1e293b',
              fontFamily: '"Montserrat", sans-serif',
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              letterSpacing: '-0.015em',
              mb: 0.5,
            }}
          >
            My Queries Raised
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#64748b', 
              mt: 0.5,
              fontFamily: '"Lato", sans-serif',
              fontSize: '1rem',
              fontWeight: 400,
              letterSpacing: '0.01em',
            }}
          >
            {pagination.total_documents} {pagination.total_documents === 1 ? 'query' : 'queries'} raised
          </Typography>
        </Box>
      </HeaderSection>
      
      <StyledTableContainer>
        <StyledTable>
          <TableHead>
            <TableRow>
              <StyledTableHeadCell>Name</StyledTableHeadCell>
              <StyledTableHeadCell>Phone</StyledTableHeadCell>
              <StyledTableHeadCell>Company</StyledTableHeadCell>
              <StyledTableHeadCell>Property</StyledTableHeadCell>
              <StyledTableHeadCell>Agent</StyledTableHeadCell>
              <StyledTableHeadCell>People</StyledTableHeadCell>
              <StyledTableHeadCell>Start Date</StyledTableHeadCell>
              <StyledTableHeadCell>Message</StyledTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queries.length > 0 ? queries.map((query) => (
              <StyledTableRow 
                key={query._id} 
                onClick={() => handleRowClick(query)}
              >
                <StyledTableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon sx={{ fontSize: '1.2rem', color: '#dc2626', opacity: 0.7 }} />
                    <Typography sx={{ fontFamily: '"Lato", sans-serif', fontWeight: 500 }}>
                      {query.title} {query.first_name} {query.last_name}
                    </Typography>
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon sx={{ fontSize: { xs: '0.9rem', sm: '1.1rem' }, color: '#64748b', opacity: 0.6 }} />
                    <Typography sx={{ 
                      fontFamily: '"Lato", sans-serif',
                      fontSize: { xs: '0.75rem', sm: '0.95rem' },
                      wordBreak: { xs: 'break-all', sm: 'normal' },
                      whiteSpace: 'nowrap',
                    }}>
                      {query.phone}
                    </Typography>
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon sx={{ fontSize: { xs: '0.9rem', sm: '1.1rem' }, color: '#64748b', opacity: 0.6 }} />
                    <Typography sx={{ 
                      fontFamily: '"Lato", sans-serif',
                      fontSize: { xs: '0.75rem', sm: '0.95rem' },
                      whiteSpace: 'nowrap',
                    }}>
                      {query.company || 'N/A'}
                    </Typography>
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                      <HomeIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: '#dc2626', opacity: 0.7, flexShrink: 0 }} />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600,
                          fontFamily: '"Lato", sans-serif',
                          color: '#1e293b',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          lineHeight: 1.3,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {query.property_id && typeof query.property_id === 'object' && query.property_id !== null 
                          ? query.property_id.general_details?.building_name || 'N/A'
                          : 'N/A'}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#64748b',
                        fontFamily: '"Lato", sans-serif',
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {query.property_id && typeof query.property_id === 'object' && query.property_id !== null 
                        ? `${query.property_id.general_details?.property_type || ''} - ${query.property_id.general_details?.town_city || ''}`.replace(/^ - | - $|^$/, '')
                        : ''}
                    </Typography>
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600,
                        fontFamily: '"Lato", sans-serif',
                        color: '#1e293b',
                        mb: 0.5,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {query.agent_id && typeof query.agent_id === 'object' && query.agent_id !== null 
                        ? `${query.agent_id.first_name || ''} ${query.agent_id.last_name || ''}`.trim() || query.agent_id.email || 'N/A'
                        : 'N/A'}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#64748b',
                        fontFamily: '"Lato", sans-serif',
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {query.agent_id && typeof query.agent_id === 'object' && query.agent_id !== null 
                        ? query.agent_id.phone || ''
                        : ''}
                    </Typography>
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupIcon sx={{ fontSize: { xs: '0.9rem', sm: '1.1rem' }, color: '#64748b', opacity: 0.6 }} />
                    <Typography sx={{ 
                      fontFamily: '"Lato", sans-serif',
                      fontSize: { xs: '0.75rem', sm: '0.95rem' },
                      whiteSpace: 'nowrap',
                    }}>
                      {query.no_of_people}
                    </Typography>
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon sx={{ fontSize: { xs: '0.9rem', sm: '1.1rem' }, color: '#64748b', opacity: 0.6 }} />
                    <Typography sx={{ 
                      fontFamily: '"Lato", sans-serif',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      whiteSpace: 'nowrap'
                    }}>
                      {new Date(query.start_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MessageIcon sx={{ fontSize: { xs: '0.9rem', sm: '1.1rem' }, color: '#64748b', opacity: 0.6 }} />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        maxWidth: { xs: '150px', sm: '200px' }, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontFamily: '"Lato", sans-serif',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      }}
                      title={query.message}
                    >
                      {query.message || 'No message'}
                    </Typography>
                  </Box>
                </StyledTableCell>
              </StyledTableRow>
            )) : (
              <>
                <TableRow>
                  <TableCell colSpan={8}>
                    <Box sx={{ textAlign: 'center', padding: { xs: '30px 15px', sm: '40px 20px' } }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#64748b',
                          fontFamily: '"Lato", sans-serif',
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                        }}
                      >
                        No queries found
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>

      {/* TablePagination */}
      {pagination.total_pages > 0 && (
        <Box sx={{ 
          mt: { xs: 2, sm: 3 },
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: { xs: 2, sm: 3 },
          p: { xs: 1.5, sm: 2 },
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          border: '1px solid rgba(220, 38, 38, 0.1)',
          overflowX: 'auto',
        }}>
          <TablePagination
            component="div"
            count={pagination.total_documents}
            page={pagination.current_page - 1}
            onPageChange={(event, newPage) => fetchMyQueries(newPage + 1, pagination.limit)}
            rowsPerPage={pagination.limit}
            onRowsPerPageChange={(event) => fetchMyQueries(1, parseInt(event.target.value))}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage={isMobile ? 'Rows:' : 'Rows per page:'}
            sx={{
              '& .MuiTablePagination-toolbar': {
                fontFamily: '"Lato", sans-serif',
                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                gap: { xs: 1, sm: 0 },
                padding: { xs: '8px 0', sm: '0' },
              },
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontFamily: '"Lato", sans-serif',
                fontWeight: 500,
                fontSize: { xs: '0.8rem', sm: '0.95rem' },
              },
              '& .MuiTablePagination-select, & .MuiTablePagination-actions': {
                fontSize: { xs: '0.8rem', sm: '0.95rem' },
              },
            }}
          />
        </Box>
      )}
    </StyledContainer>
  );
};

export default MyQueriesRaised;
