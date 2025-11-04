import React, { useEffect, useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  Breadcrumbs,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { 
  Person as PersonIcon, 
  PhotoCamera as PhotoCameraIcon, 
  Security as SecurityIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Page } from '../../../components';
import HeaderCard from '../../../components/HeaderCard';
import PersonalDetailsEdit from '../../../sections/agent/PersonalDetailsEdit';
import PhotoUpdate from '../../../sections/agent/PhotoUpdate';
import PasswordUpdate from '../../../sections/agent/PasswordUpdate';
import axiosInstance from '@/utils/axios';
import Loader from '@/components/Loader';

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'none',
  },
  '& .MuiTabs-flexContainer': {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '8px',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '12px 8px',
    },
  },
  '& .MuiTab-root': {
    minHeight: '48px',
    padding: '12px 16px',
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '0.95rem',
    color: '#6b7280',
    borderRadius: '8px',
    margin: '0 8px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(185, 28, 28, 0.05) 100%)',
      opacity: 0,
      transition: 'opacity 0.3s ease',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '0px',
      height: '0px',
      background: 'radial-gradient(circle, rgba(220, 38, 38, 0.2) 0%, transparent 70%)',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
      transition: 'all 0.6s ease',
    },
    '&:hover': {
      color: '#dc2626',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(248, 250, 252, 0.6) 100%)',
      transform: 'translateX(3px) scale(1.01)',
      boxShadow: '0 6px 20px rgba(220, 38, 38, 0.15), 0 0 0 1px rgba(220, 38, 38, 0.05)',
      '&::before': {
        opacity: 0.7,
      },
      [theme.breakpoints.down('md')]: {
        transform: 'translateY(-1px) scale(1.01)',
        boxShadow: '0 4px 15px rgba(220, 38, 38, 0.15), 0 0 0 1px rgba(220, 38, 38, 0.05)',
      },
    },
    '&.Mui-selected': {
      color: '#dc2626',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
      borderLeft: '5px solid #dc2626',
      boxShadow: '0 8px 25px rgba(220, 38, 38, 0.2), 0 0 0 1px rgba(220, 38, 38, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
      transform: 'translateX(6px) scale(1.02)',
      '&::before': {
        opacity: 1,
      },
      '&::after': {
        width: '200px',
        height: '200px',
        animation: 'ripple 0.6s ease-out',
      },
      [theme.breakpoints.down('md')]: {
        borderLeft: 'none',
        borderBottom: '3px solid #dc2626',
        transform: 'translateY(-2px) scale(1.02)',
        boxShadow: '0 6px 20px rgba(220, 38, 38, 0.2), 0 0 0 1px rgba(220, 38, 38, 0.1)',
      },
    },
  },
  '@keyframes ripple': {
    '0%': { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
    '100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: 0 },
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  '&.Mui-selected': {
    color: '#dc2626',
  },
}));

const TabPanel = styled(Box)(({ theme }) => ({
  padding: 0,
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`account-tabpanel-${index}`}
      aria-labelledby={`account-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const MyAccount: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePersonalDetailsSave = (updated: any) => {
    setUserData((prev: any) => ({ ...(prev || {}), ...(updated || {}) }));
  };

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get('/api/agent/users/profile');
        if (!isMounted) return;
        setUserData(response.data?.data || response.data);
      } catch (err: any) {
        if (!isMounted) return;
        setError(err?.message || 'Failed to load profile');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Page title="My Account">
      <Box>
          {/* Header with Gradient Background */}
          <HeaderCard 
            title="Account"
            breadcrumbs={['Dashboard', 'User', userData ? `${userData.firstName} ${userData.lastName}` : 'Loading...']}
            tabs={[
              { label: 'Personal Details', value: 0, icon: <PersonIcon /> },
              { label: 'Profile Photo', value: 1, icon: <PhotoCameraIcon /> },
              { label: 'Password & Security', value: 2, icon: <SecurityIcon /> },
            ]}
            defaultTab={0}
            onTabChange={(value: number) => handleTabChange(null, value)}
          />

          {/* Main Content */}
          <Paper sx={{ 
            borderRadius: 3, 
            overflow: 'hidden',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              minHeight: '600px'
            }}>
              {/* Sidebar Tabs */}
              {/* <Box sx={{ 
                width: { xs: '100%', md: '280px' },
                backgroundColor: '#f8fafc',
                borderRight: { md: '1px solid #e5e7eb' },
                borderBottom: { xs: '1px solid #e5e7eb', md: 'none' }
              }}>
                <StyledTabs
                  orientation={isMobile ? 'horizontal' : 'vertical'}
                  value={tabValue}
                  onChange={handleTabChange}
                  variant={isMobile ? 'fullWidth' : 'standard'}
                  sx={{
                    '& .MuiTabs-scroller': {
                      '& .MuiTabs-flexContainer': {
                        flexDirection: isMobile ? 'row' : 'column',
                      }
                    }
                  }}
                >
                <StyledTab
                  icon={<PersonIcon sx={{ 
                    fontSize: { xs: '1.2rem', md: '1.6rem' },
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
                    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }} />}
                  label="User Profile"
                  id="profile-tab-0"
                  aria-controls="profile-tabpanel-0"
                  sx={{ 
                    flexDirection: { xs: 'row', md: 'column' },
                    gap: { xs: 1, md: 1.5 },
                    '& .MuiTab-iconWrapper': {
                      marginBottom: { xs: 0, md: 0.5 },
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '40px',
                        height: '40px',
                        background: 'radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 70%)',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      }
                    },
                    '&:hover .MuiTab-iconWrapper': {
                      transform: 'scale(1.15) rotate(5deg)',
                      '&::before': {
                        opacity: 1,
                      }
                    },
                    '&.Mui-selected .MuiTab-iconWrapper': {
                      transform: 'scale(1.2) rotate(0deg)',
                      filter: 'drop-shadow(0 6px 12px rgba(220, 38, 38, 0.4))',
                      '&::before': {
                        opacity: 1,
                        width: '50px',
                        height: '50px',
                      }
                    }
                  }}
                />

                <StyledTab
                  icon={<PhotoCameraIcon sx={{ 
                    fontSize: { xs: '1.2rem', md: '1.6rem' },
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
                    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }} />}
                  label="User Profile"
                  id="profile-tab-0"
                  aria-controls="profile-tabpanel-0"
                  sx={{ 
                    flexDirection: { xs: 'row', md: 'column' },
                    gap: { xs: 1, md: 1.5 },
                    '& .MuiTab-iconWrapper': {
                      marginBottom: { xs: 0, md: 0.5 },
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '40px',
                        height: '40px',
                        background: 'radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 70%)',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      }
                    },
                    '&:hover .MuiTab-iconWrapper': {
                      transform: 'scale(1.15) rotate(5deg)',
                      '&::before': {
                        opacity: 1,
                      }
                    },
                    '&.Mui-selected .MuiTab-iconWrapper': {
                      transform: 'scale(1.2) rotate(0deg)',
                      filter: 'drop-shadow(0 6px 12px rgba(220, 38, 38, 0.4))',
                      '&::before': {
                        opacity: 1,
                        width: '50px',
                        height: '50px',
                      }
                    }
                  }}
                />

                <StyledTab
                  icon={<SecurityIcon sx={{ 
                    fontSize: { xs: '1.2rem', md: '1.6rem' },
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
                    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }} />}
                  label="User Profile"
                  id="profile-tab-0"
                  aria-controls="profile-tabpanel-0"
                  sx={{ 
                    flexDirection: { xs: 'row', md: 'column' },
                    gap: { xs: 1, md: 1.5 },
                    '& .MuiTab-iconWrapper': {
                      marginBottom: { xs: 0, md: 0.5 },
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '40px',
                        height: '40px',
                        background: 'radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 70%)',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      }
                    },
                    '&:hover .MuiTab-iconWrapper': {
                      transform: 'scale(1.15) rotate(5deg)',
                      '&::before': {
                        opacity: 1,
                      }
                    },
                    '&.Mui-selected .MuiTab-iconWrapper': {
                      transform: 'scale(1.2) rotate(0deg)',
                      filter: 'drop-shadow(0 6px 12px rgba(220, 38, 38, 0.4))',
                      '&::before': {
                        opacity: 1,
                        width: '50px',
                        height: '50px',
                      }
                    }
                  }}
                />
                </StyledTabs>
              </Box> */}

              {/* Tab Content */}
              <Box sx={{ 
                flex: 1, 
                backgroundColor: '#ffffff',
                minHeight: '600px'
              }}>
                {/* Loading / Error States */}
                {loading && (
                  <Loader
                    fullscreen={true}
                    size="medium"
                  />
                )}
                {error && !loading && (
                  <Typography color="error" variant="body1" sx={{ p: 3 }}>{error}</Typography>
                )}
                {/* Personal Details Tab */}
                <CustomTabPanel value={tabValue} index={0}>
                  <Box sx={{
                    animation: 'fadeInUp 0.6s ease-out',
                    '@keyframes fadeInUp': {
                      '0%': {
                        opacity: 0,
                        transform: 'translateY(20px)',
                      },
                      '100%': {
                        opacity: 1,
                        transform: 'translateY(0)',
                      },
                    },
                  }}>
                    {!loading && !error && userData && (
                      <PersonalDetailsEdit 
                        userData={userData}
                        onSave={handlePersonalDetailsSave}
                        onCancel={() => setTabValue(0)}
                      />
                    )}
                  </Box>
                </CustomTabPanel>

                {/* Profile Photo Tab */}
                <CustomTabPanel value={tabValue} index={1}>
                  <Box sx={{
                    animation: 'fadeInUp 0.6s ease-out',
                    '@keyframes fadeInUp': {
                      '0%': {
                        opacity: 0,
                        transform: 'translateY(20px)',
                      },
                      '100%': {
                        opacity: 1,
                        transform: 'translateY(0)',
                      },
                    },
                  }}>
                    {!loading && !error && userData && (
                      <PhotoUpdate 
                        currentPhoto={userData.profile_picture}
                      />
                    )}
                  </Box>
                </CustomTabPanel>

                {/* Password & Security Tab */}
                <CustomTabPanel value={tabValue} index={2}>
                  <Box sx={{
                    animation: 'fadeInUp 0.6s ease-out',
                    '@keyframes fadeInUp': {
                      '0%': {
                        opacity: 0,
                        transform: 'translateY(20px)',
                      },
                      '100%': {
                        opacity: 1,
                        transform: 'translateY(0)',
                      },
                    },
                  }}>
                    {!loading && !error && (
                      <PasswordUpdate 
                        onPasswordUpdate={() => {}}
                      />
                    )}
                  </Box>
                </CustomTabPanel>
              </Box>
            </Box>
          </Paper>
      </Box>
    </Page>
  );
};

export default MyAccount;
