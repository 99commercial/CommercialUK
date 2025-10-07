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
import { Person as PersonIcon, Business as BusinessIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Page } from '../../../components';
import UserProfile from '../../../sections/agent/user-profile';
import UserBusinessProfile from '../../../sections/agent/user-business-profile';
import HeaderCard from '../../../components/HeaderCard';
import axiosInstance from '../../../utils/axios';

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
    textTransform: 'none',
    fontWeight: 700,
    fontSize: '0.95rem',
    minHeight: 56,
    minWidth: 'auto',
    padding: '16px 24px',
    marginBottom: '12px',
    borderRadius: '0 16px 16px 0',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    [theme.breakpoints.down('md')]: {
      marginBottom: 0,
      marginRight: '8px',
      borderRadius: '12px 12px 0 0',
      minHeight: 48,
      padding: '12px 16px',
      fontSize: '0.85rem',
      flex: 1,
      maxWidth: '200px',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(185, 28, 28, 0.08) 50%, rgba(220, 38, 38, 0.05) 100%)',
      opacity: 0,
      transition: 'opacity 0.4s ease',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: 0,
      height: 0,
      background: 'radial-gradient(circle, rgba(220, 38, 38, 0.3) 0%, transparent 70%)',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
      transition: 'all 0.6s ease',
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
  },
  '@keyframes pulse': {
    '0%, 100%': { boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4), 0 0 20px rgba(220, 38, 38, 0.2)' },
    '50%': { boxShadow: '0 6px 16px rgba(220, 38, 38, 0.6), 0 0 30px rgba(220, 38, 38, 0.3)' },
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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <TabPanel>{children}</TabPanel>}
    </div>
  );
}

const MyProfile: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Page title="My Profile - Commercial Real Estate">
      <Box>
        {/* Header */}
          {/* Header with Gradient Background */}
          <HeaderCard 
            title="Profile"
            breadcrumbs={['Dashboard', 'User', userData ? `${userData.firstName} ${userData.lastName}` : 'Loading...']}
            userData={userData}
          />

        {/* Tabs */}
        <Paper sx={{ 
          borderRadius: 4, 
          overflow: 'hidden', 
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(220, 38, 38, 0.08)',
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(220, 38, 38, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(220, 38, 38, 0.05) 0%, transparent 50%)',
            pointerEvents: 'none',
          }
        }}>
          <Box sx={{ 
            display: 'flex', 
            minHeight: '800px',
            flexDirection: { xs: 'column', md: 'row' }
          }}>
            {/* Tabs Container - Responsive */}
            <Box sx={{ 
              width: { xs: '100%', md: '240px' },
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 50%, rgba(241, 245, 249, 0.9) 100%)',
              borderRight: { xs: 'none', md: '1px solid rgba(220, 38, 38, 0.08)' },
              borderBottom: { xs: '1px solid rgba(220, 38, 38, 0.08)', md: 'none' },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              pt: 4,
              pb: 4,
              position: 'relative',
              backdropFilter: 'blur(20px)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.02) 0%, transparent 50%, rgba(220, 38, 38, 0.01) 100%)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '20%',
                right: 0,
                width: '2px',
                height: '60%',
                background: 'linear-gradient(180deg, transparent 0%, rgba(220, 38, 38, 0.3) 20%, rgba(220, 38, 38, 0.6) 50%, rgba(220, 38, 38, 0.3) 80%, transparent 100%)',
                borderRadius: '1px',
                display: { xs: 'none', md: 'block' },
              }
            }}>
              <StyledTabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="profile tabs"
                orientation={isMobile ? "horizontal" : "vertical"}
                variant={isMobile ? "fullWidth" : "standard"}
                sx={{ width: '100%' }}
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
                  icon={<BusinessIcon sx={{ 
                    fontSize: { xs: '1.2rem', md: '1.6rem' },
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
                    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }} />}
                  label="Business Profile"
                  id="profile-tab-1"
                  aria-controls="profile-tabpanel-1"
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
                      transform: 'scale(1.15) rotate(-5deg)',
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
            </Box>

            {/* Content Area */}
            <Box sx={{ 
              flex: 1, 
              p: { xs: 3, md: 5 },
              background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 50%, #f8fafc 100%)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: 'linear-gradient(90deg, #dc2626 0%, #b91c1c 30%, #dc2626 70%, #b91c1c 100%)',
                opacity: 0.15,
                borderRadius: '0 0 3px 3px',
                display: { xs: 'none', md: 'block' },
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '10%',
                right: '5%',
                width: '100px',
                height: '100px',
                background: 'radial-gradient(circle, rgba(220, 38, 38, 0.05) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'float 10s ease-in-out infinite',
                display: { xs: 'none', md: 'block' },
              }
            }}>
              {/* Loading / Error States */}
              {loading && (
                <Typography variant="body1">Loading profile...</Typography>
              )}
              {error && !loading && (
                <Typography color="error" variant="body1">{error}</Typography>
              )}

              {/* User Profile Tab */}
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
                    <UserProfile userData={userData} />
                  )}
                </Box>
              </CustomTabPanel>

              {/* Business Profile Tab */}
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
                  {!loading && !error && (
                    userData?.business_details ? (
                      <UserBusinessProfile businessData={userData.business_details} />
                    ) : (
                      <Box sx={{
                        minHeight: '60vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, color: '#dc2626', textAlign: 'center' }}
                        >
                          You have not added your business details.
                        </Typography>
                      </Box>
                    )
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

export default MyProfile;

