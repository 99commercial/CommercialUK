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
  Divider,
  IconButton,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import axiosInstance from '../../../utils/axios';
import Loader from '@/components/Loader';

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
      background: '#f2c514',
      borderRadius: '4px',
      '&:hover': {
        background: '#d4a912',
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
    boxShadow: 'inset 4px 0 0 #f2c514',
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

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(3),
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
    margin: theme.spacing(2),
    maxHeight: 'calc(100% - 32px)',
    [theme.breakpoints.down('sm')]: {
      borderRadius: 0,
      margin: 0,
      maxHeight: '100%',
      height: '100%',
      maxWidth: '100%',
      width: '100%',
    },
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f2c514 0%, #d4a912 100%)',
  color: '#ffffff',
  fontFamily: '"Montserrat", sans-serif',
  fontWeight: 700,
  fontSize: '1.5rem',
  letterSpacing: '-0.01em',
  padding: theme.spacing(3, 4),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: 'none',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2, 2.5),
    fontSize: '1.25rem',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#f8fafc',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    maxHeight: 'calc(100vh - 140px)',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#f2c514',
      borderRadius: '3px',
      '&:hover': {
        background: '#d4a912',
      },
    },
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(226, 232, 240, 0.8)',
  backgroundColor: '#ffffff',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    borderColor: 'rgba(220, 38, 38, 0.3)',
  },
}));

const StyledCardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2.5),
  paddingBottom: theme.spacing(2),
  borderBottom: '2px solid rgba(220, 38, 38, 0.2)',
}));

const InfoField = styled(Box)(({ theme }) => ({
  minWidth: '200px',
  flex: '1 1 200px',
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1.5),
  backgroundColor: '#f8fafc',
  border: '1px solid rgba(226, 232, 240, 0.8)',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#ffffff',
    borderColor: 'rgba(220, 38, 38, 0.2)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: '100%',
    flex: '1 1 100%',
    padding: theme.spacing(1.25),
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  fontFamily: '"Montserrat", sans-serif',
  fontWeight: 600,
  fontSize: '0.85rem',
  height: '28px',
}));

const EmptyStateCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(8),
  textAlign: 'center',
  background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
  borderRadius: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '2px dashed rgba(220, 38, 38, 0.2)',
}));

const MyPropertyQueries: React.FC<MyPropertyQueriesProps> = ({ 
  onQueryClick 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
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
              color: '#f2c514',
              fontWeight: 700,
              fontSize: '1.25rem',
              fontFamily: '"Montserrat", sans-serif',
              mb: 1,
            }}
          >
            ⚠️ Error Loading Property Queries
          </Typography>
          <Typography 
            variant="body1"
            sx={{ 
              color: '#c9a010',
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
                <StyledTableHeadCell>Property ID</StyledTableHeadCell>
                <StyledTableHeadCell>Agent ID</StyledTableHeadCell>
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
                      padding: { xs: '40px 15px', sm: '60px 20px' },
                      textAlign: 'center'
                    }}
                  >
                    <Typography 
                      variant="body1"
                      sx={{ 
                        color: '#64748b',
                        fontWeight: 400,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        fontFamily: '"Lato", sans-serif',
                      }}
                    >
                      Unable to load property queries due to an error
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
  if (!queries || queries.length === 0) {
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
              Property Queries Received
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
            No property queries received yet
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
            When users enquire about your properties, they will appear here
          </Typography>
        </EmptyStateCard>
      </StyledContainer>
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
            Property Queries Received
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
            {pagination.total_documents} {pagination.total_documents === 1 ? 'query' : 'queries'} received
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
              <StyledTableHeadCell>Property ID</StyledTableHeadCell>
              <StyledTableHeadCell>Agent ID</StyledTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queries.map((query, index) => (
              <StyledTableRow 
                key={query._id} 
                onClick={() => handleRowClick(query)}
              >
                <StyledTableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, color: '#f2c514', opacity: 0.7, flexShrink: 0 }} />
                    <Typography sx={{ 
                      fontFamily: '"Lato", sans-serif', 
                      fontWeight: 500,
                      fontSize: { xs: '0.75rem', sm: '0.95rem' },
                      whiteSpace: 'nowrap',
                    }}>
                      {query.first_name} {query.last_name}
                    </Typography>
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon sx={{ fontSize: { xs: '0.9rem', sm: '1.1rem' }, color: '#64748b', opacity: 0.6, flexShrink: 0 }} />
                    <Typography sx={{ 
                      fontFamily: '"Lato", sans-serif',
                      fontSize: { xs: '0.75rem', sm: '0.95rem' },
                      whiteSpace: 'nowrap',
                      wordBreak: { xs: 'break-all', sm: 'normal' },
                    }}>
                      {query.phone}
                    </Typography>
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon sx={{ fontSize: { xs: '0.9rem', sm: '1.1rem' }, color: '#64748b', opacity: 0.6, flexShrink: 0 }} />
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
                  <Chip 
                    label={query.property_id?._id?.substring(0, 8) + '...' || 'N/A'} 
                    size="small" 
                    sx={{ 
                      fontFamily: '"Montserrat", sans-serif',
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      fontWeight: 600,
                      backgroundColor: 'rgba(220, 38, 38, 0.1)',
                      color: '#f2c514',
                      whiteSpace: 'nowrap',
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <Chip 
                    label={query.agent_id?.substring(0, 8) + '...' || 'N/A'} 
                    size="small" 
                    sx={{ 
                      fontFamily: '"Montserrat", sans-serif',
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      fontWeight: 600,
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      color: '#3b82f6',
                      whiteSpace: 'nowrap',
                    }}
                  />
                </StyledTableCell>
              </StyledTableRow>
            ))}
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
            onPageChange={(event, newPage) => fetchPropertyQueries(newPage + 1)}
            rowsPerPage={pagination.limit}
            onRowsPerPageChange={(event) => fetchPropertyQueries(1, parseInt(event.target.value))}
            rowsPerPageOptions={[5, 10, 25, 50]}
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

      {/* Query Details Modal */}
      <StyledDialog 
        open={modalOpen} 
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <StyledDialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, flex: 1 }}>
            <HomeIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' }, flexShrink: 0 }} />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontFamily: '"Montserrat", sans-serif', 
                  fontWeight: 700, 
                  mb: { xs: 0.25, sm: 0.5 },
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                }}
              >
                Query Details
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontFamily: '"Lato", sans-serif', 
                  opacity: 0.9, 
                  fontSize: { xs: '0.75rem', sm: '0.85rem' },
                  wordBreak: 'break-word',
                }}
              >
                Property ID: {selectedQuery?.property_id?._id?.substring(0, isMobile ? 12 : 16)}...
              </Typography>
            </Box>
          </Box>
          <IconButton 
            onClick={handleCloseModal}
            sx={{ 
              color: '#ffffff',
              flexShrink: 0,
              padding: { xs: '4px', sm: '8px' },
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
            }}
          >
            <CloseIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
          </IconButton>
        </StyledDialogTitle>
        <StyledDialogContent>
          {selectedQuery && (
            <StyledCard>
              <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, sm: 4 } }}>
                {/* Personal Information */}
                <Box>
                      <StyledCardHeader>
                        <PersonIcon sx={{ color: '#f2c514', fontSize: { xs: '1.25rem', sm: '1.5rem' }, flexShrink: 0 }} />
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontFamily: '"Montserrat", sans-serif',
                            fontWeight: 700,
                            color: '#1e293b',
                            fontSize: { xs: '1.1rem', sm: '1.25rem' },
                          }}
                        >
                          Personal Information
                        </Typography>
                      </StyledCardHeader>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      <InfoField>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#64748b',
                            fontFamily: '"Lato", sans-serif',
                            fontWeight: 600,
                            fontSize: { xs: '0.75rem', sm: '0.85rem' },
                            mb: 0.5,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          Title:
                        </Typography>
                        <Typography 
                          variant="body1"
                          sx={{ 
                            fontFamily: '"Lato", sans-serif',
                            fontWeight: 500,
                            color: '#1e293b',
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                          }}
                        >
                          {selectedQuery.title}
                        </Typography>
                      </InfoField>
                      <InfoField>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#64748b',
                            fontFamily: '"Lato", sans-serif',
                            fontWeight: 600,
                            fontSize: { xs: '0.75rem', sm: '0.85rem' },
                            mb: 0.5,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          First Name:
                        </Typography>
                        <Typography 
                          variant="body1"
                          sx={{ 
                            fontFamily: '"Lato", sans-serif',
                            fontWeight: 500,
                            color: '#1e293b',
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                          }}
                        >
                          {selectedQuery.first_name}
                        </Typography>
                      </InfoField>
                      <InfoField>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#64748b',
                            fontFamily: '"Lato", sans-serif',
                            fontWeight: 600,
                            fontSize: { xs: '0.75rem', sm: '0.85rem' },
                            mb: 0.5,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          Last Name:
                        </Typography>
                        <Typography 
                          variant="body1"
                          sx={{ 
                            fontFamily: '"Lato", sans-serif',
                            fontWeight: 500,
                            color: '#1e293b',
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                          }}
                        >
                          {selectedQuery.last_name}
                        </Typography>
                      </InfoField>
                      <InfoField>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <EmailIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: '#64748b', flexShrink: 0 }} />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#64748b',
                              fontFamily: '"Lato", sans-serif',
                              fontWeight: 600,
                              fontSize: { xs: '0.75rem', sm: '0.85rem' },
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            Email:
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body1"
                          sx={{ 
                            fontFamily: '"Lato", sans-serif',
                            fontWeight: 500,
                            color: '#1e293b',
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            wordBreak: 'break-word',
                          }}
                        >
                          {selectedQuery.email}
                        </Typography>
                      </InfoField>
                      <InfoField>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <PhoneIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: '#64748b', flexShrink: 0 }} />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#64748b',
                              fontFamily: '"Lato", sans-serif',
                              fontWeight: 600,
                              fontSize: { xs: '0.75rem', sm: '0.85rem' },
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            Phone:
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body1"
                          sx={{ 
                            fontFamily: '"Lato", sans-serif',
                            fontWeight: 500,
                            color: '#1e293b',
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                          }}
                        >
                          {selectedQuery.phone}
                        </Typography>
                      </InfoField>
                    </Box>
                </Box>

                <Divider sx={{ my: { xs: 2, sm: 3 } }} />

                {/* Query Details */}
                <Box>
                  <StyledCardHeader>
                    <InfoIcon sx={{ color: '#f2c514', fontSize: { xs: '1.25rem', sm: '1.5rem' }, flexShrink: 0 }} />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontFamily: '"Montserrat", sans-serif',
                        fontWeight: 700,
                        color: '#1e293b',
                        fontSize: { xs: '1.1rem', sm: '1.25rem' },
                      }}
                    >
                      Query Details
                    </Typography>
                  </StyledCardHeader>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1.5, sm: 2 } }}>
                    <InfoField sx={{ minWidth: '100%', flex: '1 1 100%' }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#64748b',
                          fontFamily: '"Lato", sans-serif',
                          fontWeight: 600,
                          fontSize: { xs: '0.75rem', sm: '0.85rem' },
                          mb: 1,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        Message:
                      </Typography>
                      <Typography 
                        variant="body1"
                        sx={{ 
                          fontFamily: '"Lato", sans-serif',
                          fontWeight: 400,
                          color: '#334155',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          lineHeight: 1.7,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {selectedQuery.message || 'No message provided'}
                      </Typography>
                    </InfoField>
                  </Box>
                </Box>

                <Divider sx={{ my: { xs: 2, sm: 3 } }} />

                {/* Property Information */}
                <Box>
                  <StyledCardHeader>
                    <HomeIcon sx={{ color: '#f2c514', fontSize: { xs: '1.25rem', sm: '1.5rem' }, flexShrink: 0 }} />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontFamily: '"Montserrat", sans-serif',
                        fontWeight: 700,
                        color: '#1e293b',
                        fontSize: { xs: '1.1rem', sm: '1.25rem' },
                      }}
                    >
                      Property Information
                    </Typography>
                  </StyledCardHeader>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1.5, sm: 2 } }}>
                    <InfoField sx={{ minWidth: '100%', flex: '1 1 100%' }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#64748b',
                          fontFamily: '"Lato", sans-serif',
                          fontWeight: 600,
                          fontSize: { xs: '0.75rem', sm: '0.85rem' },
                          mb: 0.5,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        Property ID:
                      </Typography>
                      <Chip 
                        label={selectedQuery.property_id?._id || 'N/A'} 
                        size="small" 
                        sx={{ 
                          fontFamily: '"Montserrat", sans-serif',
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          fontWeight: 600,
                          backgroundColor: 'rgba(220, 38, 38, 0.1)',
                          color: '#f2c514',
                          height: 'auto',
                          py: 0.5,
                        }}
                      />
                    </InfoField>
                    <InfoField sx={{ minWidth: '100%', flex: '1 1 100%' }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#64748b',
                          fontFamily: '"Lato", sans-serif',
                          fontWeight: 600,
                          fontSize: { xs: '0.75rem', sm: '0.85rem' },
                          mb: 0.5,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        Building Name:
                      </Typography>
                      <Typography 
                        variant="body1"
                        sx={{ 
                          fontFamily: '"Lato", sans-serif',
                          fontWeight: 500,
                          color: '#1e293b',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                        }}
                      >
                        {selectedQuery.property_id?.general_details?.building_name || 'N/A'}
                      </Typography>
                    </InfoField>
                    <InfoField sx={{ minWidth: '100%', flex: '1 1 100%' }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#64748b',
                          fontFamily: '"Lato", sans-serif',
                          fontWeight: 600,
                          fontSize: { xs: '0.75rem', sm: '0.85rem' },
                          mb: 0.5,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        Address:
                      </Typography>
                      <Typography 
                        variant="body1"
                        sx={{ 
                          fontFamily: '"Lato", sans-serif',
                          fontWeight: 500,
                          color: '#1e293b',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          lineHeight: 1.6,
                        }}
                      >
                        {selectedQuery.property_id?.general_details?.address || 'N/A'}
                      </Typography>
                    </InfoField>
                    <InfoField>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#64748b',
                          fontFamily: '"Lato", sans-serif',
                          fontWeight: 600,
                          fontSize: { xs: '0.75rem', sm: '0.85rem' },
                          mb: 0.5,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        City:
                      </Typography>
                      <Typography 
                        variant="body1"
                        sx={{ 
                          fontFamily: '"Lato", sans-serif',
                          fontWeight: 500,
                          color: '#1e293b',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                        }}
                      >
                        {selectedQuery.property_id?.general_details?.town_city || 'N/A'}
                      </Typography>
                    </InfoField>
                    <InfoField>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#64748b',
                          fontFamily: '"Lato", sans-serif',
                          fontWeight: 600,
                          fontSize: { xs: '0.75rem', sm: '0.85rem' },
                          mb: 0.5,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        Property Type:
                      </Typography>
                      <Chip 
                        label={selectedQuery.property_id?.general_details?.property_type || 'N/A'} 
                        size="small" 
                        sx={{ 
                          fontFamily: '"Montserrat", sans-serif',
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          fontWeight: 600,
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          color: '#3b82f6',
                        }}
                      />
                    </InfoField>
                  </Box>
                </Box>

                <Divider sx={{ my: { xs: 2, sm: 3 } }} />

                {/* User Information */}

                {selectedQuery.user_id && (
                  <>
                    <Box>
                      <StyledCardHeader>
                        <PersonIcon sx={{ color: '#f2c514', fontSize: { xs: '1.25rem', sm: '1.5rem' }, flexShrink: 0 }} />
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontFamily: '"Montserrat", sans-serif',
                            fontWeight: 700,
                            color: '#1e293b',
                            fontSize: { xs: '1.1rem', sm: '1.25rem' },
                          }}
                        >
                          User Information
                        </Typography>
                      </StyledCardHeader>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1.5, sm: 2 } }}>
                        <InfoField sx={{ minWidth: '100%', flex: '1 1 100%' }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#64748b',
                              fontFamily: '"Lato", sans-serif',
                              fontWeight: 600,
                              fontSize: { xs: '0.75rem', sm: '0.85rem' },
                              mb: 0.5,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            User ID:
                          </Typography>
                          <Chip 
                            label={selectedQuery.user_id._id} 
                            size="small" 
                            sx={{ 
                              fontFamily: '"Montserrat", sans-serif',
                              fontSize: { xs: '0.7rem', sm: '0.75rem' },
                              fontWeight: 600,
                              backgroundColor: 'rgba(16, 185, 129, 0.1)',
                              color: '#10b981',
                            }}
                          />
                        </InfoField>
                        <InfoField>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <EmailIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: '#64748b', flexShrink: 0 }} />
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#64748b',
                                fontFamily: '"Lato", sans-serif',
                                fontWeight: 600,
                                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                              }}
                            >
                              Email:
                            </Typography>
                          </Box>
                          <Typography 
                            variant="body1"
                            sx={{ 
                              fontFamily: '"Lato", sans-serif',
                              fontWeight: 500,
                              color: '#1e293b',
                              fontSize: { xs: '0.9rem', sm: '1rem' },
                              wordBreak: 'break-word',
                            }}
                          >
                            {selectedQuery.user_id.email}
                          </Typography>
                        </InfoField>
                        <InfoField>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <PhoneIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: '#64748b', flexShrink: 0 }} />
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#64748b',
                                fontFamily: '"Lato", sans-serif',
                                fontWeight: 600,
                                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                              }}
                            >
                              Phone:
                            </Typography>
                          </Box>
                          <Typography 
                            variant="body1"
                            sx={{ 
                              fontFamily: '"Lato", sans-serif',
                              fontWeight: 500,
                              color: '#1e293b',
                              fontSize: { xs: '0.9rem', sm: '1rem' },
                            }}
                          >
                            {selectedQuery.user_id.phone || 'N/A'}
                          </Typography>
                        </InfoField>
                      </Box>
                    </Box>
                  </>
                )}

                <Divider sx={{ my: { xs: 2, sm: 3 } }} />

                {/* System Information */}
                <Box>
                  <StyledCardHeader>
                    <InfoIcon sx={{ color: '#f2c514', fontSize: { xs: '1.25rem', sm: '1.5rem' }, flexShrink: 0 }} />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontFamily: '"Montserrat", sans-serif',
                        fontWeight: 700,
                        color: '#1e293b',
                        fontSize: { xs: '1.1rem', sm: '1.25rem' },
                      }}
                    >
                      System Information
                    </Typography>
                  </StyledCardHeader>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1.5, sm: 2 } }}>
                    <InfoField sx={{ minWidth: '100%', flex: '1 1 100%' }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#64748b',
                          fontFamily: '"Lato", sans-serif',
                          fontWeight: 600,
                          fontSize: { xs: '0.75rem', sm: '0.85rem' },
                          mb: 0.5,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        Query ID:
                      </Typography>
                      <Chip 
                        label={selectedQuery._id} 
                        size="small" 
                        sx={{ 
                          fontFamily: '"Montserrat", sans-serif',
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          fontWeight: 600,
                          backgroundColor: 'rgba(139, 92, 246, 0.1)',
                          color: '#8b5cf6',
                        }}
                      />
                    </InfoField>
                    <InfoField>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#64748b',
                          fontFamily: '"Lato", sans-serif',
                          fontWeight: 600,
                          fontSize: { xs: '0.75rem', sm: '0.85rem' },
                          mb: 0.5,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        Agent ID:
                      </Typography>
                      <Chip 
                        label={selectedQuery.agent_id?.substring(0, 16) + '...'} 
                        size="small" 
                        sx={{ 
                          fontFamily: '"Montserrat", sans-serif',
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          fontWeight: 600,
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          color: '#3b82f6',
                        }}
                      />
                    </InfoField>
                    <InfoField>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <CalendarTodayIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: '#64748b', flexShrink: 0 }} />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#64748b',
                            fontFamily: '"Lato", sans-serif',
                            fontWeight: 600,
                            fontSize: { xs: '0.75rem', sm: '0.85rem' },
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          Created At:
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body1"
                        sx={{ 
                          fontFamily: '"Lato", sans-serif',
                          fontWeight: 500,
                          color: '#1e293b',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                        }}
                      >
                        {new Date(selectedQuery.createdAt).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </InfoField>
                    <InfoField>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <CalendarTodayIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: '#64748b', flexShrink: 0 }} />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#64748b',
                            fontFamily: '"Lato", sans-serif',
                            fontWeight: 600,
                            fontSize: { xs: '0.75rem', sm: '0.85rem' },
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          Updated At:
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body1"
                        sx={{ 
                          fontFamily: '"Lato", sans-serif',
                          fontWeight: 500,
                          color: '#1e293b',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                        }}
                      >
                        {new Date(selectedQuery.updatedAt).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </InfoField>
                    <InfoField>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#64748b',
                          fontFamily: '"Lato", sans-serif',
                          fontWeight: 600,
                          fontSize: { xs: '0.75rem', sm: '0.85rem' },
                          mb: 0.5,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        Status:
                      </Typography>
                      <StyledChip 
                        label={selectedQuery.deleted_at ? 'Deleted' : 'Active'} 
                        color={selectedQuery.deleted_at ? 'error' : 'success'}
                        size="small"
                      />
                    </InfoField>
                  </Box>
                </Box>
              </Box>
              </CardContent>
            </StyledCard>
          )}
        </StyledDialogContent>
        <DialogActions sx={{ 
          p: { xs: 2, sm: 3 }, 
          backgroundColor: '#f8fafc', 
          borderTop: '1px solid rgba(226, 232, 240, 0.8)' 
        }}>
          <Button 
            onClick={handleCloseModal} 
            variant="contained"
            fullWidth={isMobile}
            sx={{
              background: 'linear-gradient(135deg, #f2c514 0%, #d4a912 100%)',
              color: '#ffffff',
              fontFamily: '"Montserrat", sans-serif',
              fontWeight: 600,
              fontSize: { xs: '0.9rem', sm: '1rem' },
              padding: { xs: '8px 24px', sm: '10px 32px' },
              borderRadius: '12px',
              textTransform: 'none',
              letterSpacing: '0.02em',
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #d4a912 0%, #c9a010 100%)',
                boxShadow: '0 6px 20px rgba(220, 38, 38, 0.5)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Close
          </Button>
        </DialogActions>
      </StyledDialog>
    </StyledContainer>
  );
};

export default MyPropertyQueries;