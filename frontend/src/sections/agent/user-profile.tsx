import React from 'react';
import {
  Box,
  Card,
  Typography,
  Avatar,
  Divider,
  Chip,
  Grid,
  useTheme,
} from '@mui/material';
import { 
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  Badge as BadgeIcon,
  Home as HomeIcon,
  Fingerprint as FingerprintIcon,
  CalendarToday as CalendarIcon,
  Update as UpdateIcon,
  Login as LoginIcon,
  Info as InfoIcon,
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
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  border: 'none',
  background: '#ffffff',
  overflow: 'visible',
  marginBottom: theme.spacing(3),
  position: 'relative',
}));

const ProfileBanner = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(5),
  background: `
    linear-gradient(135deg, #f2c514 0%, #d4a912 50%, #c9a010 100%),
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(0, 0, 0, 0.03) 10px,
      rgba(0, 0, 0, 0.03) 20px
    )
  `,
  backgroundSize: '100% 100%, 100% 100%, 100% 100%, 40px 40px',
  color: 'white',
  borderRadius: '16px 16px 0 0',
  position: 'relative',
  marginBottom: 0,
  boxShadow: '0 8px 32px rgba(220, 38, 38, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  overflow: 'visible',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, transparent 0%, rgba(0, 0, 0, 0.1) 100%)',
    pointerEvents: 'none',
    borderRadius: '16px 16px 0 0',
    overflow: 'hidden',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
  },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  background: '#ffffff',
  borderRadius: '0 0 16px 16px',
  padding: theme.spacing(4, 3),
  marginTop: 0,
  paddingTop: theme.spacing(4),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(5, 4),
    paddingTop: theme.spacing(5),
  },
}));


const InfoField = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  borderRadius: 12,
  background: '#f9fafb',
  border: '1px solid #e5e7eb',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: '#f3f4f6',
    borderColor: '#f2c514',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.1)',
  },
}));

const FieldLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: theme.spacing(1),
  fontFamily: '"Inter", sans-serif',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const FieldValue = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 500,
  color: '#1f2937',
  fontFamily: '"Inter", sans-serif',
  lineHeight: 1.6,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: '#f2c514',
  marginBottom: theme.spacing(3),
  fontFamily: '"Poppins", sans-serif',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  position: 'relative',
  '&::after': {
    content: '""',
    flex: 1,
    height: '2px',
    background: 'linear-gradient(90deg, #f2c514, transparent)',
    marginLeft: theme.spacing(2),
  },
}));


interface UserProfileProps {
  userData: any;
}

const UserProfile: React.FC<UserProfileProps> = ({ userData }) => {
  const [isClient, setIsClient] = React.useState(false);
  const theme = useTheme();

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  

  return (
    <Box sx={{ fontFamily: '"Inter", sans-serif' }}>
      <StyledCard>
        {/* Profile Banner */}
        <ProfileBanner>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 3, md: 4 },
            width: '100%',
            position: 'relative',
            zIndex: 1,
          }}>
            <Avatar
              src={userData?.profile_picture}
              sx={{
                width: { xs: 120, md: 160 },
                height: { xs: 120, md: 160 },
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                border: '4px solid rgba(0, 0, 0, 0.5)',
                boxShadow: '0 8px 24px rgba(91, 91, 91, 0.2)',
              }}
            >
              <PersonIcon sx={{ fontSize: { xs: 60, md: 80 }, color: 'black' }} />
            </Avatar>
            
            <Box sx={{ 
              flex: 1,
              position: 'relative',
              zIndex: 1,
            }}>
              {(userData?.firstName || userData?.lastName) && (
                <Typography 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 0.5,
                      color: 'black',
                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                    fontFamily: '"Poppins", sans-serif',
                    lineHeight: 1.2,
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {userData?.firstName} {userData?.lastName}
                </Typography>
              )}
              <Typography 
                sx={{ 
                      color: 'black', 
                  mb: 1,
                  fontWeight: 400,
                  fontSize: { xs: '0.95rem', md: '1.1rem' },
                  fontFamily: '"Inter", sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  textShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
                }}
              >
                <InfoIcon sx={{ fontSize: 18 }} />
                Personal Information
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              position: 'relative',
              zIndex: 1,
            }}>
              <CheckCircleIcon 
                sx={{ 
                  color: '#10b981', 
                  fontSize: 24,
                  filter: 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.4))',
                }} 
              />
              <Typography 
                variant="body2" 
                sx={{ 
                      color: 'black', 
                  fontWeight: 600,
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.95rem',
                  textShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
                }}
              >
                Active
              </Typography>
            </Box>
          </Box>
        </ProfileBanner>

        {/* Content Area with 3D Effect */}
        <ContentWrapper>
          {/* About Section */}
          {userData?.about && (
            <Box sx={{ 
              mb: 5,
              p: 3,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #fef3f2 0%, #fee2e2 100%)',
              border: '1px solid #fecaca',
              borderLeft: '4px solid #f2c514',
            }}>
              <Typography 
                sx={{ 
                  color: '#7f1d1d', 
                  fontStyle: 'italic',
                  fontSize: '1rem',
                  lineHeight: 1.8,
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 400,
                }}
              >
                "{userData.about}"
              </Typography>
            </Box>
          )}

          {/* Personal Details Section */}
          <SectionTitle>
            <PersonIcon sx={{ fontSize: 28 }} />
            Personal Details
          </SectionTitle>

          <Grid container spacing={3}>
            {userData?.firstName && userData?.lastName && (
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoField>
                  <FieldLabel>
                    <PersonIcon sx={{ fontSize: 16 }} />
                    Full Name
                  </FieldLabel>
                  <FieldValue sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                    {userData.firstName} {userData.lastName}
                  </FieldValue>
                </InfoField>
              </Grid>
            )}
            {userData?.email && (
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoField>
                  <FieldLabel>
                    <EmailIcon sx={{ fontSize: 16 }} />
                    Email Address
                  </FieldLabel>
                  <FieldValue sx={{ wordBreak: 'break-word' }}>
                    {userData.email}
                  </FieldValue>
                </InfoField>
              </Grid>
            )}
            {userData?.phone && (
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoField>
                  <FieldLabel>
                    <PhoneIcon sx={{ fontSize: 16 }} />
                    Phone Number
                  </FieldLabel>
                  <FieldValue>{userData.phone}</FieldValue>
                </InfoField>
              </Grid>
            )}
            {userData?.age && (
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoField>
                  <FieldLabel>
                    <CakeIcon sx={{ fontSize: 16 }} />
                    Age
                  </FieldLabel>
                  <FieldValue>{userData.age} years old</FieldValue>
                </InfoField>
              </Grid>
            )}
            {userData?.role && (
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoField>
                  <FieldLabel>
                    <BadgeIcon sx={{ fontSize: 16 }} />
                    Role
                  </FieldLabel>
                  <FieldValue sx={{ textTransform: 'capitalize', fontWeight: 600 }}>
                    {userData.role}
                  </FieldValue>
                </InfoField>
              </Grid>
            )}
            {userData?.is_active !== undefined && (
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoField>
                  <FieldLabel>
                    <CheckCircleIcon sx={{ fontSize: 16 }} />
                    Account Status
                  </FieldLabel>
                  <Box>
                    <Chip
                      icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                      label={userData.is_active ? 'Active' : 'Inactive'}
                      sx={{
                        backgroundColor: userData.is_active ? '#10b981' : '#f2c514',
                        color: 'white',
                        fontWeight: 600,
                        borderRadius: 2,
                        height: 32,
                        fontSize: '0.875rem',
                        fontFamily: '"Inter", sans-serif',
                        boxShadow: userData.is_active 
                          ? '0 4px 12px rgba(16, 185, 129, 0.3)' 
                          : '0 4px 12px rgba(239, 68, 68, 0.3)',
                      }}
                    />
                  </Box>
                </InfoField>
              </Grid>
            )}
            {userData?.personal_address && (
              <Grid size={12}>
                <InfoField>
                  <FieldLabel>
                    <HomeIcon sx={{ fontSize: 16 }} />
                    Address
                  </FieldLabel>
                  <FieldValue>{userData.personal_address}</FieldValue>
                </InfoField>
              </Grid>
            )}
          </Grid>

          <Divider 
            sx={{ 
              my: 5, 
              borderColor: '#e5e7eb',
              borderWidth: 1,
              '&::before, &::after': {
                borderColor: '#f2c514',
                opacity: 0.3,
              },
            }} 
          />

          {/* Account Information Section */}
          <SectionTitle>
            <FingerprintIcon sx={{ fontSize: 28 }} />
            Account Information
          </SectionTitle>

          <Grid container spacing={3}>
            {userData?._id && (
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoField>
                  <FieldLabel>
                    <FingerprintIcon sx={{ fontSize: 16 }} />
                    User ID
                  </FieldLabel>
                  <FieldValue 
                    sx={{ 
                      fontFamily: '"Inter", monospace', 
                      fontSize: '0.875rem',
                      wordBreak: 'break-all',
                      color: '#6b7280',
                    }}
                  >
                    {userData._id}
                  </FieldValue>
                </InfoField>
              </Grid>
            )}
            {userData?.createdAt && (
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoField>
                  <FieldLabel>
                    <CalendarIcon sx={{ fontSize: 16 }} />
                    Member Since
                  </FieldLabel>
                  <FieldValue>
                    {isClient ? formatDate(userData.createdAt) : 'Loading...'}
                  </FieldValue>
                </InfoField>
              </Grid>
            )}
            {userData?.updatedAt && (
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoField>
                  <FieldLabel>
                    <UpdateIcon sx={{ fontSize: 16 }} />
                    Last Updated
                  </FieldLabel>
                  <FieldValue>
                    {isClient ? formatDate(userData.updatedAt) : 'Loading...'}
                  </FieldValue>
                </InfoField>
              </Grid>
            )}
            {userData?.loginAttempts !== undefined && (
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoField>
                  <FieldLabel>
                    <LoginIcon sx={{ fontSize: 16 }} />
                    Login Attempts
                  </FieldLabel>
                  <FieldValue sx={{ fontWeight: 600 }}>
                    {userData.loginAttempts}
                  </FieldValue>
                </InfoField>
              </Grid>
            )}
          </Grid>
        </ContentWrapper>
      </StyledCard>
    </Box>
  );
};

export default UserProfile;
