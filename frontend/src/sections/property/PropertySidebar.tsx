import React, { useState } from 'react';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
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
}));

const QueryFormCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e0e0e0',
}));

const PropertyCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e0e0e0',
}));

// ----------------------------------------------------------------------

interface QueryForm {
  title: string;
  first_name: string;
  last_name: string;
  company: string;
  email: string;
  phone: string;
  no_of_people: number;
  start_date: string;
  length_of_term: string;
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
    company: '',
    email: '',
    phone: '',
    no_of_people: 1,
    start_date: '',
    length_of_term: '',
    message: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'error' | 'warning' | 'info',
  });

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

    if (!userData) {
      throw new Error('User data is required');
    }

    let currentUser;
    try {
      currentUser = JSON.parse(userData);
    } catch (error) {
      throw new Error('Invalid user data');
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const payload = {
      ...formData,
      property_id: property._id,
      user_id: currentUser.id,
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
      company: '',
      email: '',
      phone: '',
      no_of_people: 1,
      start_date: '',
      length_of_term: '',
      message: '',
    });

    return response.data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await submitPropertyQuery(queryForm);
      enqueueSnackbar(result.message || 'Enquiry submitted successfully!', { variant: 'success' });
    } catch (error: any) {
      console.error('Error submitting enquiry:', error);
      enqueueSnackbar(error?.message || 'Failed to submit enquiry. Please try again.', { variant: 'error' });
    }
  };

  return (
    <SidebarContent>
      {/* Query Form */}
      <QueryFormCard>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Make an Enquiry
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <FormControl fullWidth required>
                <InputLabel>Title</InputLabel>
                <Select
                  value={queryForm.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  label="Title"
                >
                  <MenuItem value="MR">Mr</MenuItem>
                  <MenuItem value="MRS">Mrs</MenuItem>
                  <MenuItem value="MS">Ms</MenuItem>
                  <MenuItem value="MISS">Miss</MenuItem>
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
                />
                
                <TextField
                  fullWidth
                  label="Last Name"
                  value={queryForm.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  required
                  inputProps={{ maxLength: 50 }}
                />
              </Box>
              
              <TextField
                fullWidth
                label="Company"
                value={queryForm.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                required
                inputProps={{ maxLength: 100 }}
              />
              
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={queryForm.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                inputProps={{ maxLength: 100 }}
              />
              
              <TextField
                fullWidth
                label="Phone Number"
                value={queryForm.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
                inputProps={{ maxLength: 20 }}
              />
              
              <TextField
                fullWidth
                label="Number of People"
                type="number"
                value={queryForm.no_of_people}
                onChange={(e) => handleInputChange('no_of_people', e.target.value)}
                required
                inputProps={{ min: 1, max: 1000 }}
              />
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={queryForm.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                />
                
                <TextField
                  fullWidth
                  label="Length of Term"
                  value={queryForm.length_of_term}
                  onChange={(e) => handleInputChange('length_of_term', e.target.value)}
                  required
                  inputProps={{ maxLength: 50 }}
                  placeholder="e.g., 6 months, 1 year"
                />
              </Box>
              
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
              />
              
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? 'Submitting...' : 'Send Enquiry'}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </QueryFormCard>

      {/* Agent Contact Information */}
      {property?.listed_by && (
        <PropertyCard>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Agent Contact
            </Typography>
            
            <Stack spacing={2}>
              {property.listed_by?.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <EmailIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {property.listed_by.email}
                    </Typography>
                  </Box>
                </Box>
              )}
              
              {property.listed_by?.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PhoneIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body1">
                      {property.listed_by.phone}
                    </Typography>
                  </Box>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationOnIcon color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body1">
                    {property.general_details?.town_city}, {property.general_details?.postcode}
                  </Typography>
                </Box>
              </Box>
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
    );
  };

  export default PropertySidebar;
