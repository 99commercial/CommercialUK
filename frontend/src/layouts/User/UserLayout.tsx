import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, useMediaQuery, useTheme, Button, CircularProgress } from '@mui/material';
import { Menu as MenuIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import SideBar from './SideBar';
import axiosInstance from '../../utils/axios';

const collapsedDrawerWidth = 80;

interface AgentLayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<AgentLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const router = useRouter();
  
  // Initialize sidebar state - start closed on mobile, open on desktop
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Set initial state based on screen size
  useEffect(() => {
    if (!isMobile && !isTablet) {
      setSidebarOpen(true);
    }
  }, [isMobile, isTablet]);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple logout attempts
    
    setIsLoggingOut(true);

      // Clear all authentication data from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('newpropertyId');
      
      // Force a small delay to ensure localStorage is cleared
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Redirect to login page with replace to prevent back navigation
      router.replace('/auth/login');
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh',
      ...(isMobile && {
        // On mobile, don't use flex layout when sidebar is closed
        display: sidebarOpen ? 'flex' : 'block',
      })
    }}>
      {/* Sidebar */}
      <SideBar 
        open={sidebarOpen} 
        onToggle={handleSidebarToggle} 
        onClose={handleSidebarClose}
      />
      
      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f9fafb',
          width: isMobile ? '100%' : 'auto',
          minWidth: 0, // Prevent overflow
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(isMobile && {
            marginLeft: 0,
            width: '100%',
          }),
          ...(isTablet && {
            marginLeft: 0,
          }),
          ...(!isMobile && !isTablet && {
            marginLeft: 0, // Remove margin for full-width content
          }),
        }}
      >
        {/* Top App Bar */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
            color: '#374151',
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleSidebarToggle}
              sx={{ 
                mr: 2,
                // Ensure button is visible and clickable on mobile
                zIndex: 1,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              User Dashboard
            </Typography>
            <Button
              variant="outlined"
              startIcon={isLoggingOut ? <CircularProgress size={16} color="inherit" /> : <LogoutIcon />}
              onClick={handleLogout}
              disabled={isLoggingOut}
              sx={{
                color: '#f2c514',
                borderColor: '#f2c514',
                minWidth: '100px',
                '&:hover': {
                  backgroundColor: '#fef2f2',
                  borderColor: '#f2c514',
                },
                '&:disabled': {
                  color: '#9ca3af',
                  borderColor: '#d1d5db',
                  backgroundColor: '#f9fafb',
                },
              }}
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Button>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            overflow: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default UserLayout;
