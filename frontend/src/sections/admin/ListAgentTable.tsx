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
  Chip,
  Avatar,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Divider,
  CircularProgress,
  DialogContentText,
} from '@mui/material';
import {
  Search as SearchIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Block as BlockIcon,
  CheckCircle as ApproveIcon,
  Visibility as ViewIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CheckCircle as GoodIcon,
  Schedule as PendingIcon,
  Cancel as SuspendedIcon,
  PersonOff as   InactiveIcon,
  VerifiedUser as ActiveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  Storage as MetadataIcon,
} from '@mui/icons-material';
import { Router, useRouter } from 'next/router';
import axiosInstance from '../../utils/axios';

// Types
export interface Agent {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  user_status: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  business_details?: {
    _id: string;
    business_name: string;
    business_type: string;
  };
  profile_picture?: string;
  about?: string;
  age?: number;
  personal_address?: string;
  my_favourites?: string[];
  deleted_at?: string | null;
  status_updated_at?: string | null;
  ip_address?: string;
}

interface IPMetadata {
  ip?: string;
  version?: string;
  city?: string;
  region?: string;
  region_code?: string;
  country?: string;
  country_name?: string;
  country_code?: string;
  country_code_iso3?: string;
  country_calling_code?: string;
  country_capital?: string;
  country_tld?: string;
  continent_code?: string;
  in_eu?: boolean;
  postal?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  utc_offset?: string;
  country_population?: number;
  country_area?: number;
  currency?: string;
  currency_name?: string;
  languages?: string;
  asn?: string;
  org?: string;
  network?: string;
}

interface ListAgentTableProps {
  agents: Agent[];
}

const ListAgentTable: React.FC<ListAgentTableProps> = ({ agents }) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<'firstName' | 'createdAt' | 'user_status'>('firstName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<string | null>(null);
  const [metadataDialogOpen, setMetadataDialogOpen] = useState(false);
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [agentMetadata, setAgentMetadata] = useState<IPMetadata | null>(null);
  const [selectedAgentForMetadata, setSelectedAgentForMetadata] = useState<Agent | null>(null);
  const router = useRouter();

  const filteredAgents = useMemo(() => {
    return agents.filter(agent =>
      agent.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (agent.business_details?.business_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (agent.personal_address || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [agents, searchTerm]);

  const sortedAgents = useMemo(() => {
    return [...filteredAgents].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'firstName':
          aValue = a.firstName;
          bValue = b.firstName;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'user_status':
          aValue = a.user_status;
          bValue = b.user_status;
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
  }, [filteredAgents, sortBy, sortOrder]);

  const paginatedAgents = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedAgents.slice(start, start + rowsPerPage);
  }, [sortedAgents, page, rowsPerPage]);

  const handleSort = (field: 'firstName' | 'createdAt' | 'user_status') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: 'firstName' | 'createdAt' | 'user_status') => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'success';
      case 'pending':
        return 'warning';
      case 'suspended':
        return 'error';
      case 'inactive':
        return 'default';
      default:
        return 'default';
    }
  };

  const handleViewAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setViewDialogOpen(true);
  };

  const handleViewAgentDetails = (agent: Agent) => {
    router.push(`/admin/client-detail/${agent._id}`);
  };

  const handleCloseDialog = () => {
    setViewDialogOpen(false);
    setSelectedAgent(null);
    setShowStatusUpdate(false);
    setNewStatus('');
    setStatusReason('');
  };

  const handleUpdateStatus = async () => {
    if (!selectedAgent) return;
    setStatusLoading(true);
    try {
      await axiosInstance.patch(`/api/admin/users/${selectedAgent._id}/behavior-status`, {
        user_status: newStatus,
        status_reason: statusReason,
      });
      // Refresh or update agent data here if needed
      handleCloseDialog();
      window.location.reload();
    } catch (err: any) {
      console.error('Failed to update status:', err);
      alert(err?.response?.data?.message || 'Failed to update status');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!agentToDelete) return;
    setDeleteLoading(true);
    try {
      await axiosInstance.delete(`/api/admin/users/${agentToDelete}`);
      setDeleteDialogOpen(false);
      setAgentToDelete(null);
      window.location.reload();
    } catch (err: any) {
      console.error('Failed to delete user:', err);
      alert(err?.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleViewMetadata = async (agent: Agent) => {
    setSelectedAgentForMetadata(agent);
    setMetadataLoading(true);
    setMetadataDialogOpen(true);
    
    try {
      const apiUrl = `https://ipapi.co/${agent.ip_address}/json/`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log(data);
      setAgentMetadata(data);
    } catch (err) {
      console.error('Failed to fetch IP metadata:', err);
      setAgentMetadata(null);
    } finally {
      setMetadataLoading(false);
    }
  };

  const handleCloseMetadataDialog = () => {
    setMetadataDialogOpen(false);
    setAgentMetadata(null);
    setSelectedAgentForMetadata(null);
  };

  return (
    <>
      <Card sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            All Agents ({filteredAgents.length})
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {isLargeScreen && <TableCell>Profile</TableCell>}
                <TableCell 
                  onClick={() => handleSort('firstName')}
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    Agent Name
                    {getSortIcon('firstName')}
                  </Box>
                </TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Business</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Role</TableCell>
                <TableCell 
                  onClick={() => handleSort('user_status')}
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    Status
                    {getSortIcon('user_status')}
                  </Box>
                </TableCell>
                <TableCell 
                  onClick={() => handleSort('createdAt')}
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    Join Date
                    {getSortIcon('createdAt')}
                  </Box>
                </TableCell>
                <TableCell align="center">Actions</TableCell>
                <TableCell align="center">Metadata</TableCell>
                <TableCell align="center">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedAgents.map((agent) => (
                <TableRow key={agent._id} hover>
                  {isLargeScreen && (
                    <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            src={agent.profile_picture}
                            alt={`${agent.firstName} ${agent.lastName}`}
                            sx={{ width: 40, height: 40 }}
                          />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {agent.firstName} {agent.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Age: {agent.age || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                    </TableCell>
                  )}
                  <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, cursor: 'pointer' }} onClick={() => handleViewAgentDetails(agent)}>
                          {agent.firstName} {agent.lastName}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          {agent.is_active && (
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
                                border: '1px solid rgba(255,255,255,0.2)'
                              }}
                            >
                              <ActiveIcon sx={{ fontSize: '0.5rem', color: 'white' }} />
                              <Typography
                                sx={{
                                  color: 'white',
                                  fontWeight: 600,
                                  fontSize: '0.5rem',
                                  textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                }}
                              >
                                Active
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="body2">{agent.email}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2">{agent.phone}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {agent.business_details?.business_name || 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {agent.business_details?.business_type || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {agent.personal_address || 'N/A'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {agent.role}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.3,
                        px: 1,
                        py: 0.3,
                        borderRadius: 1.5,
                        background: agent.user_status === 'good' 
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                          : agent.user_status === 'pending'
                          ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                          : agent.user_status === 'suspended'
                          ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                          : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}
                    >
                      {agent.user_status === 'good' && <GoodIcon sx={{ fontSize: '0.6rem', color: 'white' }} />}
                      {agent.user_status === 'pending' && <PendingIcon sx={{ fontSize: '0.6rem', color: 'white' }} />}
                      {agent.user_status === 'suspended' && <SuspendedIcon sx={{ fontSize: '0.6rem', color: 'white' }} />}
                      {agent.user_status === 'inactive' && <InactiveIcon sx={{ fontSize: '0.6rem', color: 'white' }} />}
                      <Typography
                        sx={{
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.6rem',
                          textTransform: 'capitalize',
                          textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                        }}
                      >
                        {agent.user_status}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(agent.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" gap={1} justifyContent="center">
                      <IconButton
                        size="small"
                        onClick={() => handleViewAgent(agent)}
                        color="primary"
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>

                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleViewMetadata(agent)}
                      color="info"
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        },
                      }}
                    >
                      <MetadataIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setAgentToDelete(agent._id);
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
          count={filteredAgents.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Card>

      {/* Agent Details Dialog */}
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
            boxShadow: { xs: 'none', sm: '0 20px 40px rgba(0,0,0,0.1)' },
            border: { xs: 'none', sm: '1px solid rgba(255,255,255,0.2)' },
            m: { xs: 0, sm: 2 },
            height: { xs: '100vh', sm: 'auto' },
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: { xs: 2, sm: 3 },
          mb: 0,
          borderRadius: { xs: 0, sm: '12px 12px 0 0' },
          fontSize: { xs: '1.2rem', sm: '1.5rem' },
          fontWeight: 700,
          fontFamily: '"Inter", "Roboto", sans-serif',
          letterSpacing: { xs: '0.3px', sm: '0.5px' },
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          <Box>Agent Details</Box>
          {!showStatusUpdate && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              onClick={() => {
                setShowStatusUpdate(true);
                setNewStatus(selectedAgent?.user_status || '');
              }}
              sx={{
                borderColor: 'white',
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Update Status
            </Button>
          )}
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 4 }, background: 'transparent' }}>
          {selectedAgent && (
            <Box>
              {/* Header Section */}
              <Box 
                display="flex" 
                alignItems="center" 
                gap={{ xs: 2, sm: 4 }} 
                mb={{ xs: 2, sm: 4 }}
                flexDirection={{ xs: 'column', sm: 'row' }}
                sx={{
                  p: { xs: 2, sm: 3 },
                  background: 'rgba(255,255,255,0.8)',
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              >
                <Avatar
                  src={selectedAgent.profile_picture}
                  alt={`${selectedAgent.firstName} ${selectedAgent.lastName}`}
                  sx={{ 
                    width: { xs: 80, sm: 100 }, 
                    height: { xs: 80, sm: 100 },
                    border: '4px solid white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                />
                <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700,
                      fontSize: { xs: '1.5rem', sm: '2rem' },
                      color: '#1f2937',
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      letterSpacing: { xs: '-0.2px', sm: '-0.5px' },
                      mb: 1
                    }}
                  >
                    {selectedAgent.firstName} {selectedAgent.lastName}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#6b7280',
                      fontWeight: 500,
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      mb: 2,
                      fontFamily: '"Inter", "Roboto", sans-serif'
                    }}
                  >
                    {selectedAgent.business_details?.business_name || 'N/A'}
                  </Typography>
                  <Box display="flex" gap={2} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                    <Box
                      sx={{
                        px: { xs: 1.2, sm: 1.5 },
                        py: { xs: 0.4, sm: 0.6 },
                        borderRadius: 2,
                        background: selectedAgent.user_status === 'good' 
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                          : selectedAgent.user_status === 'pending'
                          ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                          : selectedAgent.user_status === 'suspended'
                          ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                          : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.3,
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                          pointerEvents: 'none'
                        }
                      }}
                    >
                      {selectedAgent.user_status === 'good' && <GoodIcon sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' }, color: 'white' }} />}
                      {selectedAgent.user_status === 'pending' && <PendingIcon sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' }, color: 'white' }} />}
                      {selectedAgent.user_status === 'suspended' && <SuspendedIcon sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' }, color: 'white' }} />}
                      {selectedAgent.user_status === 'inactive' && <InactiveIcon sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' }, color: 'white' }} />}
                      <Typography
                        sx={{
                          color: 'white',
                          fontWeight: 600,
                          fontSize: { xs: '0.65rem', sm: '0.75rem' },
                          textTransform: 'uppercase',
                          letterSpacing: '0.3px',
                          position: 'relative',
                          zIndex: 1,
                          textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                        }}
                      >
                        {selectedAgent.user_status}
                      </Typography>
                    </Box>
                    {selectedAgent.is_active && (
                      <Box
                        sx={{
                          px: { xs: 1.2, sm: 1.5 },
                          py: { xs: 0.4, sm: 0.6 },
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          position: 'relative',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.3,
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                            pointerEvents: 'none'
                          }
                        }}
                      >
                        <ActiveIcon sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' }, color: 'white' }} />
                        <Typography
                          sx={{
                            color: 'white',
                            fontWeight: 600,
                            fontSize: { xs: '0.65rem', sm: '0.75rem' },
                            textTransform: 'uppercase',
                            letterSpacing: '0.3px',
                            position: 'relative',
                            zIndex: 1,
                            textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                          }}
                        >
                          Active
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>

              {/* Status Update Section */}
              { showStatusUpdate &&
                <Box
                  sx={{
                    p: { xs: 2, sm: 3 },
                    background: 'rgba(255,255,255,0.9)',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    marginBottom: 3,
                    mt: 3,
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#dc2626',
                      fontWeight: 700,
                      fontSize: { xs: '1rem', sm: '1.2rem' },
                      mb: { xs: 2, sm: 3 },
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      borderBottom: '2px solid #fecaca',
                      pb: 1,
                    }}
                  >
                    Update User Status
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      select
                      label="Status"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      fullWidth
                      variant="outlined"
                    >
                      <MenuItem value="excellent">Excellent</MenuItem>
                      <MenuItem value="good">Good</MenuItem>
                      <MenuItem value="average">Average</MenuItem>
                      <MenuItem value="poor">Poor</MenuItem>
                      <MenuItem value="bad">Bad</MenuItem>
                      <MenuItem value="banned">Banned</MenuItem>
                    </TextField>
                    <TextField
                      label="Reason"
                      value={statusReason}
                      onChange={(e) => setStatusReason(e.target.value)}
                      multiline
                      rows={3}
                      fullWidth
                      variant="outlined"
                      helperText="Provide a reason for the status change"
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => setShowStatusUpdate(false)}
                        disabled={statusLoading}
                        sx={{ flex: 1 }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleUpdateStatus}
                        disabled={statusLoading || !newStatus}
                        sx={{
                          flex: 1,
                          background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)',
                          },
                        }}
                        startIcon={statusLoading ? <CircularProgress size={20} /> : null}
                      >
                        {statusLoading ? 'Updating...' : 'Update'}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              }

              {/* Information Grid */}
              <Box 
                display="grid" 
                gridTemplateColumns={{ xs: '1fr', sm: 'repeat(auto-fit, minmax(280px, 1fr))' }} 
                gap={{ xs: 2, sm: 4 }}
              >
                {/* Contact Information */}
                <Box sx={{
                  p: { xs: 2, sm: 3 },
                  background: 'rgba(255,255,255,0.7)',
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#dc2626',
                      fontWeight: 700,
                      fontSize: { xs: '1rem', sm: '1.2rem' },
                      mb: { xs: 2, sm: 3 },
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      borderBottom: '2px solid #fecaca',
                      pb: 1
                    }}
                  >
                    Contact Information
                  </Typography>
                  <Box sx={{ '& > *': { mb: { xs: 2, sm: 2.5 } } }}>
                    <Box>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 600,
                          color: '#374151',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          mb: 0.5,
                          fontFamily: '"Inter", "Roboto", sans-serif'
                        }}
                      >
                        Email:
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#6b7280',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          fontFamily: '"Inter", "Roboto", sans-serif',
                          wordBreak: 'break-word'
                        }}
                      >
                        {selectedAgent.email}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 600,
                          color: '#374151',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          mb: 0.5,
                          fontFamily: '"Inter", "Roboto", sans-serif'
                        }}
                      >
                        Phone:
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#6b7280',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          fontFamily: '"Inter", "Roboto", sans-serif'
                        }}
                      >
                        {selectedAgent.phone}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 600,
                          color: '#374151',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          mb: 0.5,
                          fontFamily: '"Inter", "Roboto", sans-serif'
                        }}
                      >
                        Address:
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#6b7280',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          fontFamily: '"Inter", "Roboto", sans-serif',
                          wordBreak: 'break-word'
                        }}
                      >
                        {selectedAgent.personal_address || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Business Information */}
                <Box sx={{
                  p: { xs: 2, sm: 3 },
                  background: 'rgba(255,255,255,0.7)',
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#dc2626',
                      fontWeight: 700,
                      fontSize: { xs: '1rem', sm: '1.2rem' },
                      mb: { xs: 2, sm: 3 },
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      borderBottom: '2px solid #fecaca',
                      pb: 1
                    }}
                  >
                    Business Information
                  </Typography>
                  <Box sx={{ '& > *': { mb: { xs: 2, sm: 2.5 } } }}>
                    <Box>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 600,
                          color: '#374151',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          mb: 0.5,
                          fontFamily: '"Inter", "Roboto", sans-serif'
                        }}
                      >
                        Business Name:
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#6b7280',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          fontFamily: '"Inter", "Roboto", sans-serif',
                          wordBreak: 'break-word'
                        }}
                      >
                        {selectedAgent.business_details?.business_name || 'N/A'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 600,
                          color: '#374151',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          mb: 0.5,
                          fontFamily: '"Inter", "Roboto", sans-serif'
                        }}
                      >
                        Business Type:
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#6b7280',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          fontFamily: '"Inter", "Roboto", sans-serif',
                          wordBreak: 'break-word'
                        }}
                      >
                        {selectedAgent.business_details?.business_type || 'N/A'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 600,
                          color: '#374151',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          mb: 0.5,
                          fontFamily: '"Inter", "Roboto", sans-serif'
                        }}
                      >
                        About:
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#6b7280',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          fontFamily: '"Inter", "Roboto", sans-serif',
                          wordBreak: 'break-word'
                        }}
                      >
                        {selectedAgent.about || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Account Information */}
                <Box sx={{
                  p: { xs: 2, sm: 3 },
                  background: 'rgba(255,255,255,0.7)',
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#dc2626',
                      fontWeight: 700,
                      fontSize: { xs: '1rem', sm: '1.2rem' },
                      mb: { xs: 2, sm: 3 },
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      borderBottom: '2px solid #fecaca',
                      pb: 1
                    }}
                  >
                    Account Information
                  </Typography>
                  <Box sx={{ '& > *': { mb: { xs: 2, sm: 2.5 } } }}>
                    <Box>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 600,
                          color: '#374151',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          mb: 0.5,
                          fontFamily: '"Inter", "Roboto", sans-serif'
                        }}
                      >
                        Role:
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#6b7280',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          fontFamily: '"Inter", "Roboto", sans-serif'
                        }}
                      >
                        {selectedAgent.role}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 600,
                          color: '#374151',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          mb: 0.5,
                          fontFamily: '"Inter", "Roboto", sans-serif'
                        }}
                      >
                        Age:
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#6b7280',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          fontFamily: '"Inter", "Roboto", sans-serif'
                        }}
                      >
                        {selectedAgent.age || 'N/A'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 600,
                          color: '#374151',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          mb: 0.5,
                          fontFamily: '"Inter", "Roboto", sans-serif'
                        }}
                      >
                        Join Date:
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#6b7280',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          fontFamily: '"Inter", "Roboto", sans-serif'
                        }}
                      >
                        {new Date(selectedAgent.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 600,
                          color: '#374151',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          mb: 0.5,
                          fontFamily: '"Inter", "Roboto", sans-serif'
                        }}
                      >
                        Last Updated:
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#6b7280',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          fontFamily: '"Inter", "Roboto", sans-serif'
                        }}
                      >
                        {new Date(selectedAgent.updatedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 2, sm: 3 }, 
          background: 'rgba(255,255,255,0.8)',
          borderRadius: { xs: 0, sm: '0 0 12px 12px' }
        }}>
          <Button 
            onClick={handleCloseDialog}
            variant="contained"
            fullWidth={useMediaQuery(theme.breakpoints.down('sm'))}
            sx={{
              background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
              color: 'white',
              fontWeight: 600,
              fontSize: { xs: '0.9rem', sm: '1rem' },
              px: { xs: 3, sm: 4 },
              py: { xs: 1.2, sm: 1.5 },
              borderRadius: 2,
              textTransform: 'none',
              fontFamily: '"Inter", "Roboto", sans-serif',
              boxShadow: '0 4px 12px rgba(220,38,38,0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)',
                boxShadow: '0 6px 16px rgba(220,38,38,0.4)',
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
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action will soft delete the user and cannot be undone.
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
            onClick={handleDeleteUser}
            color="error"
            variant="contained"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Metadata Dialog */}
      <Dialog
        open={metadataDialogOpen}
        onClose={handleCloseMetadataDialog}
        maxWidth="md"
        fullWidth
        fullScreen={useMediaQuery(theme.breakpoints.down('sm'))}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e0f2fe 100%)',
            borderRadius: { xs: 0, sm: 3 },
            boxShadow: { xs: 'none', sm: '0 20px 40px rgba(0,0,0,0.1)' },
            border: { xs: 'none', sm: '1px solid rgba(255,255,255,0.2)' },
            m: { xs: 0, sm: 2 },
            height: { xs: '100vh', sm: 'auto' },
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: { xs: 2, sm: 3 },
          mb: 0,
          borderRadius: { xs: 0, sm: '12px 12px 0 0' },
          fontSize: { xs: '1.2rem', sm: '1.5rem' },
          fontWeight: 700,
          fontFamily: '"Inter", "Roboto", sans-serif',
          letterSpacing: { xs: '0.3px', sm: '0.5px' },
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          <Box display="flex" alignItems="center" gap={2}>
            <MetadataIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />
            Agent Metadata
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 4 }, background: 'transparent' }}>
          {metadataLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : agentMetadata && selectedAgentForMetadata ? (
            <Box>
              {/* Header Section */}
              <Box 
                display="flex" 
                alignItems="center" 
                gap={{ xs: 2, sm: 4 }} 
                mb={{ xs: 2, sm: 4 }}
                flexDirection={{ xs: 'column', sm: 'row' }}
                sx={{
                  p: { xs: 2, sm: 3 },
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              >
                <Avatar
                  src={selectedAgentForMetadata.profile_picture}
                  alt={`${selectedAgentForMetadata.firstName} ${selectedAgentForMetadata.lastName}`}
                  sx={{ 
                    width: { xs: 80, sm: 100 }, 
                    height: { xs: 80, sm: 100 },
                    border: '4px solid white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                />
                <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700,
                      fontSize: { xs: '1.5rem', sm: '2rem' },
                      color: '#1f2937',
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      letterSpacing: { xs: '-0.2px', sm: '-0.5px' },
                      mb: 1
                    }}
                  >
                    {selectedAgentForMetadata.firstName} {selectedAgentForMetadata.lastName}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#6b拼接80',
                      fontWeight: 500,
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      mb: 2,
                      fontFamily: '"Inter", "Roboto", sans-serif'
                    }}
                  >
                    {selectedAgentForMetadata.business_details?.business_name || 'N/A'}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#2563eb',
                      fontWeight: 600,
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      fontFamily: 'monospace'
                    }}
                  >
                    IP: {agentMetadata.ip || 'N/A'}
                  </Typography>
                </Box>
              </Box>

              {/* Metadata Information */}
              <Box 
                display="grid" 
                gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} 
                gap={{ xs: 2, sm: 3 }}
              >
                {/* Network & ISP Information */}
                <Box sx={{
                  p: { xs: 2, sm: 3 },
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#2563eb',
                      fontWeight: 700,
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      mb: { xs: 2, sm: 2.5 },
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      borderBottom: '2px solid #bfdbfe',
                      pb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <InfoIcon sx={{ fontSize: '1rem' }} />
                    Network & ISP
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#9ca3af' }}>IP Address</Typography>
                      <Typography variant="body2" sx={{ color: '#1f2937', fontFamily: 'monospace' }}>{agentMetadata.ip || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#9ca3af' }}>IP Version</Typography>
                      <Typography variant="body2" sx={{ color: '#1f2937', fontFamily: 'monospace' }}>{agentMetadata.version || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#9ca3af' }}>ASN</Typography>
                      <Typography variant="body2" sx={{ color: '#1f2937', fontFamily: 'monospace' }}>{agentMetadata.asn || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#9ca3af' }}>Organization</Typography>
                      <Typography variant="body2" sx={{ color: '#1f2937' }}>{agentMetadata.org || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#9ca3af' }}>Network</Typography>
                      <Typography variant="body2" sx={{ color: '#1f2937', fontFamily: 'monospace' }}>{agentMetadata.network || 'N/A'}</Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Location Information */}
                <Box sx={{
                  p: { xs: 2, sm: 3 },
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#2563eb',
                      fontWeight: 700,
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      mb: { xs: 2, sm: 2.5 },
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      borderBottom: '2px solid #bfdbfe',
                      pb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <LocationIcon sx={{ fontSize: '1rem' }} />
                    Location
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#9ca3af' }}>City</Typography>
                      <Typography variant="body2" sx={{ color: '#1f2937' }}>{agentMetadata.city || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#9ca3af' }}>Region</Typography>
                      <Typography variant="body2" sx={{ color: '#1f2937' }}>{agentMetadata.region || 'N/A'} ({agentMetadata.region_code || 'N/A'})</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#9ca3af' }}>Postal Code</Typography>
                      <Typography variant="body2" sx={{ color: '#1f2937', fontFamily: 'monospace' }}>{agentMetadata.postal || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#9ca3af' }}>Coordinates</Typography>
                      <Typography variant="body2" sx={{ color: '#1f2937', fontFamily: 'monospace' }}>
                        {agentMetadata.latitude && agentMetadata.longitude ? `${agentMetadata.latitude}, ${agentMetadata.longitude}` : 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Country Information */}
                <Box sx={{
                  p: { xs: 2, sm: 3 },
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#2563eb',
                      fontWeight: 700,
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      mb: { xs: 2, sm: 2.5 },
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      borderBottom: '2px solid #bfdbfe',
                      pb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <MetadataIcon sx={{ fontSize: '1rem' }} />
                    Country Details
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#9ca3af' }}>Country</Typography>
                      <Typography variant="body2" sx={{ color: '#1f2937' }}>{agentMetadata.country_name || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#9ca3af' }}>Country Code</Typography>
                      <Typography variant="body2" sx={{ color: '#1f2937', fontFamily: 'monospace' }}>{agentMetadata.country || 'N/A'} / {agentMetadata.country_code_iso3 || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#9ca3af' }}>Calling Code</Typography>
                      <Typography variant="body2" sx={{ color: '#1f2937' }}>{agentMetadata.country_calling_code || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#9ca3af' }}>Capital</Typography>
                      <Typography variant="body2" sx={{ color: '#1f2937' }}>{agentMetadata.country_capital || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#9ca3af' }}>Top Level Domain</Typography>
                      <Typography variant="body2" sx={{ color: '#1f2937' }}>{agentMetadata.country_tld || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#9ca3af' }}>Continent</Typography>
                      <Typography variant="body2" sx={{ color: '#1f2937' }}>{agentMetadata.continent_code || 'N/A'}</Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Time & Currency Information */}
                <Box sx={{
                  p: { xs: 2, sm: 3 },
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#2563eb',
                      fontWeight: 700,
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      mb: { xs: 2, sm: 2.5 },
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      borderBottom: '2px solid #bfdbfe',
                      pb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <PhoneIcon sx={{ fontSize: '1rem' }} />
                    Time & Currency
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#9ca3af' }}>Currency</Typography>
                      <Typography variant="body2" sx={{ color: '#1f2937' }}>{agentMetadata.currency_name || 'N/A'} ({agentMetadata.currency || 'N/A'})</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#9ca3af' }}>Timezone</Typography>
                      <Typography variant="body2" sx={{ color: '#1f2937', fontFamily: 'monospace' }}>{agentMetadata.timezone || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#9ca3af' }}>UTC Offset</Typography>
                      <Typography variant="body2" sx={{ color: '#1f2937', fontFamily: 'monospace' }}>{agentMetadata.utc_offset || 'N/A'}</Typography>
                    </Box>
                    {agentMetadata.country_population && (
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#9ca3af' }}>Country Population</Typography>
                        <Typography variant="body2" sx={{ color: '#1f2937' }}>
                          {agentMetadata.country_population.toLocaleString()}
                        </Typography>
                      </Box>
                    )}
                    {agentMetadata.country_area && (
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#9ca3af' }}>Country Area</Typography>
                        <Typography variant="body2" sx={{ color: '#1f2937' }}>
                          {agentMetadata.country_area.toLocaleString()} km²
                        </Typography>
                      </Box>
                    )}
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#9ca3af' }}>In EU</Typography>
                      <Typography variant="body2" sx={{ color: '#1f2937' }}>{agentMetadata.in_eu ? 'Yes' : 'No'}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : selectedAgentForMetadata && !metadataLoading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="error">Failed to fetch metadata</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
Unable to retrieve IP address information
              </Typography>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 2, sm: 3 }, 
          background: 'rgba(255,255,255,0.8)',
          borderRadius: { xs: 0, sm: '0 0 12px 12px' }
        }}>
          <Button 
            onClick={handleCloseMetadataDialog}
            variant="contained"
            fullWidth={useMediaQuery(theme.breakpoints.down('sm'))}
            sx={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: 'white',
              fontWeight: 600,
              fontSize: { xs: '0.9rem', sm: '1rem' },
              px: { xs: 3, sm: 4 },
              py: { xs: 1.2, sm: 1.5 },
              borderRadius: 2,
              textTransform: 'none',
              fontFamily: '"Inter", "Roboto", sans-serif',
              boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                boxShadow: '0 6px 16px rgba(37,99,235,0.4)',
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ListAgentTable;
