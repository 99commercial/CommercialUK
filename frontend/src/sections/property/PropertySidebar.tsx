import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Modal,
  IconButton,
  Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import axiosInstance from '@/utils/axios';
import { enqueueSnackbar } from 'notistack';
import { Property } from '../../components/PropertyCard';

// ----------------------------------------------------------------------

const SidebarContent = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  width: '100%',
  position: 'sticky',
  top: theme.spacing(3),
  alignSelf: 'flex-start',
  maxHeight: 'calc(100vh - 24px)',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#f2c514',
    borderRadius: '4px',
    '&:hover': {
      background: '#d4a911',
    },
  },
}));

const QueryFormCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2.5),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  border: `2px solid #f2c514`,
  background: '#ffffff',
  transition: 'all 0.3s ease',
  position: 'relative',
  maxWidth: '600px',
  width: '100%',
  maxHeight: '90vh',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#f2c514',
    borderRadius: '4px',
    '&:hover': {
      background: '#d4a911',
    },
  },
}));


const PropertyCard = styled(Card)(({ theme }) => ({
  marginTop: 5,
  borderRadius: theme.spacing(2.5),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  border: '1px solid #e0e0e0',
  background: '#ffffff',
}));

// ----------------------------------------------------------------------

interface QueryForm {
  title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
}

interface PropertySidebarProps {
  property?: Property;
}

const PropertySidebar: React.FC<PropertySidebarProps> = ({ property }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [queryForm, setQueryForm] = useState<QueryForm>({
    title: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'error' | 'warning' | 'info',
  });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const scrollThreshold = 200; // Scroll threshold in pixels

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check authentication function
  const isAuthenticated = () => {
    const accessToken = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    return !!(accessToken && user);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false,
    }));
  };

  const handleInputChange = (field: keyof QueryForm, value: string | number) => {
    setQueryForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const submitPropertyQuery = async (formData: QueryForm) => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    
    if (!property) {
      throw new Error('Property data is required');
    }

    if (!property._id) {
      throw new Error('Property ID is required');
    }

    let currentUser = null;
    if (userData) {
      try {
        currentUser = JSON.parse(userData);
      } catch (error) {
        // User data is invalid, proceed without user
        currentUser = null;
      }
    }

    const config: { headers: Record<string, string> } = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Only add Authorization header if token exists
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    const payload = {
      ...formData,
      property_id: property._id,
      user_id: currentUser?.id || '',
      agent_id: property.listed_by?._id,
    };

    const response = await axiosInstance.post(
      `/api/agent/properties/${property._id}/queries`,
      payload,
      config
    );

    setQueryForm({
      title: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      message: '',
    });

    return response.data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await submitPropertyQuery(queryForm);
      enqueueSnackbar(result.message || 'Enquiry submitted successfully!', { variant: 'success' });
      setIsFormModalOpen(false);
    } catch (error: any) {
      console.error('Error submitting enquiry:', error);
      enqueueSnackbar(error?.message || 'Failed to submit enquiry. Please try again.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFormModal = () => {
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
  };

  // Calculate dynamic top position based on scroll
  const sidebarTop = scrollY > scrollThreshold ? '110px' : '0px';
  const cardTop = scrollY > scrollThreshold 
    ? { xs: 120, sm: 128, md: 136 } 
    : { xs: 24, sm: 24, md: 24 };

  return (
    <>
      <SidebarContent
        sx={{
          top: sidebarTop,
          transition: 'top 0.3s ease',
        }}
      >
        {/* Agent Contact Information */}
        {property?.listed_by && (
          <PropertyCard
            sx={{
              position: 'sticky',
              top: cardTop,
              zIndex: 100,
              transition: 'top 0.3s ease',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  position: 'relative',
                  mb: 3,
                  pb: 2,
                  borderBottom: '2px solid #f2c514',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.65rem',
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    letterSpacing: '-0.01em',
                    color: '#1a1a1a',
                  }}
                >
                  Agent Contact
                </Typography>
              </Box>

              {/* Profile Picture */}
              {property.listed_by?.profile_picture && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  <Avatar
                    src={property.listed_by.profile_picture}
                    alt={property.listed_by.email || 'Agent Profile Picture'}
                    sx={{
                      width: 120,
                      height: 120,
                      border: '4px solid #f2c514',
                      boxShadow: '0 4px 20px rgba(242, 197, 20, 0.3)',
                    }}
                  />
                </Box>
              )}
              
              <Stack spacing={2.5}>
                {property.listed_by?.email && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      background: '#fafafa',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: '#f5f5f5',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: '50%',
                        background: '#f2c514',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 40,
                        height: 40,
                      }}
                    >
                      <EmailIcon sx={{ color: '#1a1a1a', fontSize: 20 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666',
                          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                          fontWeight: 500,
                          mb: 0.5,
                          textTransform: 'uppercase',
                          fontSize: '0.75rem',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Email
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                          fontWeight: 500,
                          color: '#1a1a1a',
                        }}
                      >
                        {property.listed_by.email}
                      </Typography>
                    </Box>
                  </Box>
                )}
                
                {property.listed_by?.phone && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      background: '#fafafa',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: '#f5f5f5',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: '50%',
                        background: '#f2c514',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 40,
                        height: 40,
                      }}
                    >
                      <PhoneIcon sx={{ color: '#1a1a1a', fontSize: 20 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666',
                          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                          fontWeight: 500,
                          mb: 0.5,
                          textTransform: 'uppercase',
                          fontSize: '0.75rem',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Phone
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                          fontWeight: 500,
                          color: '#1a1a1a',
                        }}
                      >
                        {property.listed_by.phone}
                      </Typography>
                    </Box>
                  </Box>
                )}
                
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    background: '#fafafa',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: '#f5f5f5',
                    },
                  }}
                >
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: '50%',
                      background: '#f2c514',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 40,
                      height: 40,
                    }}
                  >
                    <LocationOnIcon sx={{ color: '#1a1a1a', fontSize: 20 }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#666',
                        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                        fontWeight: 500,
                        mb: 0.5,
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Location
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                        fontWeight: 500,
                        color: '#1a1a1a',
                      }}
                    >
                      {property.general_details?.town_city}, {property.general_details?.postcode}
                    </Typography>
                  </Box>
                </Box>

                {/* Connect Button */}
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleOpenFormModal}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    background: '#f2c514',
                    color: '#1a1a1a',
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    borderRadius: 2,
                    boxShadow: '0 4px 14px rgba(242, 197, 20, 0.4)',
                    '&:hover': {
                      background: '#d4a911',
                      boxShadow: '0 6px 20px rgba(242, 197, 20, 0.5)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Connect
                </Button>
              </Stack>
            </CardContent>
          </PropertyCard>
        )}

        {/* Snackbar for notifications */}
        <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert 
              onClose={handleCloseSnackbar} 
              severity={snackbar.severity}
              sx={{ mt: 2 }}
            >
              {snackbar.message}
            </Alert>
        </Snackbar>
      </SidebarContent>

      {/* Query Form Modal Overlay */}
      <Modal
        open={isFormModalOpen}
        onClose={handleCloseFormModal}
        aria-labelledby="enquiry-form-modal"
        aria-describedby="enquiry-form-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          },
        }}
      >
        <QueryFormCard
          onClick={(e) => e.stopPropagation()}
          sx={{
            position: 'relative',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            outline: 'none',
          }}
        >
            <CardContent sx={{ p: 3 }}>
              {/* Close Button */}
              <IconButton
                onClick={handleCloseFormModal}
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: 16,
                  color: '#666',
                  '&:hover': {
                    background: '#f5f5f5',
                    color: '#1a1a1a',
                  },
                }}
              >
                <CloseIcon />
              </IconButton>

              <Box
                sx={{
                  position: 'relative',
                  mb: 3,
                  pb: 2,
                  borderBottom: '3px solid #f2c514',
                  pr: 5,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.5rem',
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    letterSpacing: '-0.02em',
                    color: '#1a1a1a',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      bottom: -8,
                      width: '60px',
                      height: '3px',
                      background: '#f2c514',
                      borderRadius: '2px',
                    },
                  }}
                >
                  Make an Enquiry
                </Typography>
              </Box>
              
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2.5}>
                  <FormControl fullWidth required>
                    <InputLabel
                      sx={{
                        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                        fontWeight: 500,
                        '&.Mui-focused': {
                          color: '#f2c514',
                        },
                      }}
                    >
                      Title
                    </InputLabel>
                    <Select
                      value={queryForm.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      label="Title"
                      sx={{
                        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#f2c514',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#f2c514',
                        },
                      }}
                    >
                      <MenuItem value="MR" sx={{ fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>Mr</MenuItem>
                      <MenuItem value="MRS" sx={{ fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>Mrs</MenuItem>
                      <MenuItem value="MS" sx={{ fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>Ms</MenuItem>
                      <MenuItem value="MISS" sx={{ fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>Miss</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={queryForm.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      required
                      inputProps={{ maxLength: 50 }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                          '&.Mui-focused fieldset': {
                            borderColor: '#f2c514',
                          },
                          '&:hover fieldset': {
                            borderColor: '#f2c514',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#f2c514',
                        },
                      }}
                    />
                    
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={queryForm.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      required
                      inputProps={{ maxLength: 50 }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                          '&.Mui-focused fieldset': {
                            borderColor: '#f2c514',
                          },
                          '&:hover fieldset': {
                            borderColor: '#f2c514',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#f2c514',
                        },
                      }}
                    />
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={queryForm.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    inputProps={{ maxLength: 100 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                        '&.Mui-focused fieldset': {
                          borderColor: '#f2c514',
                        },
                        '&:hover fieldset': {
                          borderColor: '#f2c514',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#f2c514',
                      },
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={queryForm.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                    inputProps={{ maxLength: 20 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                        '&.Mui-focused fieldset': {
                          borderColor: '#f2c514',
                        },
                        '&:hover fieldset': {
                          borderColor: '#f2c514',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#f2c514',
                      },
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Message"
                    multiline
                    rows={4}
                    value={queryForm.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    required
                    placeholder="Tell us about your requirements..."
                    inputProps={{ maxLength: 1000 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                        '&.Mui-focused fieldset': {
                          borderColor: '#f2c514',
                        },
                        '&:hover fieldset': {
                          borderColor: '#f2c514',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#f2c514',
                      },
                    }}
                  />
                  
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading}
                    sx={{
                      mt: 2,
                      py: 1.5,
                      background: '#f2c514',
                      color: '#1a1a1a',
                      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                      fontWeight: 600,
                      fontSize: '1rem',
                      textTransform: 'none',
                      borderRadius: 2,
                      boxShadow: '0 4px 14px rgba(242, 197, 20, 0.4)',
                      '&:hover': {
                        background: '#d4a911',
                        boxShadow: '0 6px 20px rgba(242, 197, 20, 0.5)',
                        transform: 'translateY(-1px)',
                      },
                      '&:disabled': {
                        background: '#e0e0e0',
                        color: '#9e9e9e',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {loading ? 'Submitting...' : 'Send Enquiry'}
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </QueryFormCard>
      </Modal>
    </>
  );
};

  export default PropertySidebar;
