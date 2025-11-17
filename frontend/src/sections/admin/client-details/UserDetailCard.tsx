import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  Chip,
  Paper,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { 
  Person as PersonIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Utility function to format dates consistently
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  border: 'none',
  background: '#ffffff',
  overflow: 'hidden',
}));

const ProfileBanner = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(4),
  background: '#f2c514',
  color: 'white',
  borderRadius: '12px 12px 0 0',
  position: 'relative',
}));

const InfoField = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const FieldLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 500,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: theme.spacing(0.5),
}));

const FieldValue = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 600,
  color: '#1f2937',
}));

interface UserDetailCardProps {
  userData: any;
}

const UserDetailCard: React.FC<UserDetailCardProps> = ({ userData }) => {
  const [isClient, setIsClient] = React.useState(false);
  const theme = useTheme();

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'suspended':
        return '#f2c514';
      case 'inactive':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  return (
    <Box>
      <StyledCard>
        {/* Profile Banner */}
        <ProfileBanner>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 3 } }}>
            <Avatar
              src={userData?.profile_picture}
              sx={{
                width: { xs: 60, md: 80 },
                height: { xs: 60, md: 80 },
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <PersonIcon sx={{ fontSize: { xs: 30, md: 40 }, color: 'white' }} />
            </Avatar>
            <Box>
              {(userData?.firstName || userData?.lastName) && (
                <Typography variant="h4" sx={{ 
                  fontWeight: 700, 
                  mb: 0.5,
                  color: 'white',
                }}>
                  {userData?.firstName} {userData?.lastName}
                </Typography>
              )}
              <Typography variant="body1" sx={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                mb: 2,
                fontWeight: 400,
              }}>
                Personal Information
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: userData?.is_active ? '#10b981' : '#f2c514',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>✓</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
              {userData?.is_active ? 'Active' : 'Inactive'}
            </Typography>
          </Box>
        </ProfileBanner>

        {/* Content Area */}
        <Box sx={{ p: { xs: 3, md: 4 } }}>
          {/* About Section */}
          {userData?.about && (
            <>
              <Typography variant="body1" sx={{ 
                color: '#6b7280', 
                mb: 4,
                fontStyle: 'italic',
              }}>
                {userData.about}
              </Typography>
            </>
          )}

          {/* Personal Details Section */}
          <Typography variant="h6" sx={{ 
            fontWeight: 700, 
            color: '#f2c514',
            mb: 3,
          }}>
            Personal Details
          </Typography>

          <Grid container spacing={3}>
            {userData?.firstName && userData?.lastName && (
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoField>
                  <FieldLabel>Full Name</FieldLabel>
                  <FieldValue>{userData.firstName} {userData.lastName}</FieldValue>
                </InfoField>
              </Grid>
            )}
            {userData?.email && (
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoField>
                  <FieldLabel>Email Address</FieldLabel>
                  <FieldValue>{userData.email}</FieldValue>
                </InfoField>
              </Grid>
            )}
            {userData?.phone && (
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoField>
                  <FieldLabel>Phone Number</FieldLabel>
                  <FieldValue>{userData.phone}</FieldValue>
                </InfoField>
              </Grid>
            )}
            {userData?.age && (
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoField>
                  <FieldLabel>Age</FieldLabel>
                  <FieldValue>{userData.age} years</FieldValue>
                </InfoField>
              </Grid>
            )}
            {userData?.role && (
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoField>
                  <FieldLabel>Role</FieldLabel>
                  <FieldValue sx={{ textTransform: 'capitalize' }}>{userData.role}</FieldValue>
                </InfoField>
              </Grid>
            )}
            {userData?.user_status !== undefined && (
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoField>
                  <FieldLabel>Status</FieldLabel>
                  <Chip
                    label={userData.user_status || 'N/A'}
                    sx={{
                      backgroundColor: getStatusColor(userData.user_status || 'inactive'),
                      color: 'white',
                      fontWeight: 500,
                      borderRadius: 2,
                      height: 24,
                      fontSize: '0.75rem',
                      textTransform: 'capitalize',
                    }}
                  />
                </InfoField>
              </Grid>
            )}
            {userData?.personal_address && (
              <Grid size={12}>
                <InfoField>
                  <FieldLabel>Address</FieldLabel>
                  <FieldValue>{userData.personal_address}</FieldValue>
                </InfoField>
              </Grid>
            )}
          </Grid>

          <Divider sx={{ my: 4, borderColor: '#e5e7eb' }} />

          {/* Account Information Section */}
          <Typography variant="h6" sx={{ 
            fontWeight: 700, 
            color: '#f2c514',
            mb: 3,
          }}>
            Account Information
          </Typography>

          <Grid container spacing={3}>
            {userData?._id && (
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoField>
                  <FieldLabel>User ID</FieldLabel>
                  <FieldValue sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                    {userData._id}
                  </FieldValue>
                </InfoField>
              </Grid>
            )}
            {userData?.createdAt && (
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoField>
                  <FieldLabel>Member Since</FieldLabel>
                  <FieldValue>
                    {isClient ? formatDate(userData.createdAt) : 'Loading...'}
                  </FieldValue>
                </InfoField>
              </Grid>
            )}
            {userData?.updatedAt && (
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoField>
                  <FieldLabel>Last Updated</FieldLabel>
                  <FieldValue>
                    {isClient ? formatDate(userData.updatedAt) : 'Loading...'}
                  </FieldValue>
                </InfoField>
              </Grid>
            )}
            {userData?.loginAttempts !== undefined && (
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoField>
                  <FieldLabel>Login Attempts</FieldLabel>
                  <FieldValue>{userData.loginAttempts}</FieldValue>
                </InfoField>
              </Grid>
            )}
          </Grid>
        </Box>
      </StyledCard>
    </Box>
  );
};

export default UserDetailCard;
