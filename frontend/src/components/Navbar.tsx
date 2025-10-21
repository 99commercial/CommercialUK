import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Collapse,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LanguageIcon from '@mui/icons-material/Language';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/router'

// ----------------------------------------------------------------------

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#ffffff',
  color: '#000000',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  position: 'sticky',
  top: 0,
  zIndex: 1300, // High z-index to ensure it's above other content
  width: '100%',
  transition: 'all 0.3s ease-in-out',
  '&.MuiAppBar-root': {
    backgroundColor: '#ffffff',
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  flexGrow: 1,
  justifyContent: 'flex-start',
  cursor: 'pointer',
  padding: theme.spacing(1, 1.5),
  borderRadius: theme.spacing(1),
  transition: 'all 0.2s ease',
  marginTop: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    transform: 'scale(1.02)',
  },
  [theme.breakpoints.down('sm')]: {
    flexGrow: 0,
    marginRight: theme.spacing(1),
    minHeight: 48,
    padding: theme.spacing(1),
    gap: theme.spacing(1),
  },
}));

const LogoIcon = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  backgroundColor: '#d32f2f',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  boxShadow: '0 2px 8px rgba(211, 47, 47, 0.3)',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: '0 4px 12px rgba(211, 47, 47, 0.4)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(45deg, #d32f2f 0%, #ff5722 100%)',
    borderRadius: '50%',
    transform: 'rotate(45deg)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '60%',
    height: '60%',
    backgroundColor: '#fff',
    borderRadius: '50%',
    zIndex: 1,
  },
  [theme.breakpoints.down('sm')]: {
    width: 36,
    height: 36,
  },
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  flexShrink: 0,
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(0.5),
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#d32f2f',
  color: '#fff',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 2),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  minWidth: 'auto',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5, 1),
    fontSize: '0.75rem',
  },
  '&:hover': {
    backgroundColor: '#b71c1c',
  },
}));

const AllPropertiesLink = styled('a')(({ theme }) => ({
  color: '#666666',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  padding: theme.spacing(1),
  cursor: 'pointer',
  borderRadius: theme.spacing(0.5),
  marginRight: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.75rem',
    marginRight: theme.spacing(0.5),
  },
  '&:hover': {
    color: '#d32f2f',
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
  },
}));

const AdvertiseButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: '#666666',
  border: '1px solid #666666',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 2),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  minWidth: 'auto',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5, 1),
    fontSize: '0.75rem',
  },
  '&:hover': {
    backgroundColor: 'rgba(102, 102, 102, 0.1)',
    borderColor: '#666666',
  },
}));

const MobileDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
    backgroundColor: '#ffffff',
    paddingTop: theme.spacing(2),
  },
}));

const MobileMenuButton = styled(IconButton)(({ theme }) => ({
  color: '#000000',
  padding: theme.spacing(1.5),
  minHeight: 44, // Minimum touch target size
  minWidth: 44,
  borderRadius: theme.spacing(1),
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

const MobileActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  flexShrink: 0,
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const MobileDrawerItem = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(2, 2),
  borderRadius: theme.spacing(1),
  margin: theme.spacing(0.5, 1),
  minHeight: 48, // Minimum touch target size
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
    transform: 'translateX(4px)',
  },
  '&:active': {
    backgroundColor: 'rgba(211, 47, 47, 0.2)',
  },
}));

const MobileDrawerText = styled(ListItemText)(({ theme }) => ({
  '& .MuiListItemText-primary': {
    fontWeight: 600,
    fontSize: '1.1rem',
    color: '#333333',
    lineHeight: 1.4,
  },
}));


// ----------------------------------------------------------------------

interface NavbarProps {
  onLogin?: () => void;
  onAdvertise?: () => void;
  onLanguageChange?: () => void;
}

export default function Navbar({ onAdvertise, onLanguageChange }: NavbarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const router = useRouter();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  const handleLogin = () => {
    router.push('/auth/login');
    setMobileOpen(false);
  };

  const handleAllProperties = () => {
    router.push('/general/all-properties');
    setMobileOpen(false);
  };

  const handleAbout = () => {
    router.push('/about-us');
    setMobileOpen(false);
  };

  const handleAdvertise = () => {
    if (onAdvertise) {
      onAdvertise();
    } else {
      console.log('Advertise clicked');
    }
    setMobileOpen(false);
  };

  const handleLanguageChange = () => {
    if (onLanguageChange) {
      onLanguageChange();
    } else {
      console.log('Language change clicked');
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLanguageToggle = () => {
    setLanguageOpen(!languageOpen);
  };


  const drawer = (
    <Box sx={{ width: '100%', height: '100%' , marginTop: 5 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2,
        borderBottom: '1px solid #e0e0e0'
      }}>
        <IconButton 
          onClick={handleDrawerToggle} 
          sx={{ 
            color: '#000000',
            padding: 1.5,
            minHeight: 44,
            minWidth: 44,
            borderRadius: 1,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Navigation Items */}
      <List sx={{ pt: 2 }}>
        <ListItem disablePadding>
          <MobileDrawerItem onClick={handleAllProperties}>
            <MobileDrawerText primary="All Properties" />
          </MobileDrawerItem>
        </ListItem>
        
        <ListItem disablePadding>
          <MobileDrawerItem onClick={handleLogin}>
            <MobileDrawerText primary="Login" />
          </MobileDrawerItem>
        </ListItem>
        
        <ListItem disablePadding>
          <MobileDrawerItem onClick={handleAdvertise}>
            <MobileDrawerText primary="Advertise" />
          </MobileDrawerItem>
        </ListItem>

        <Divider sx={{ my: 1 }} />

        <ListItem disablePadding>
          <MobileDrawerItem onClick={handleLanguageToggle}>
            <MobileDrawerText primary="Language" />
            {languageOpen ? <ExpandLess /> : <ExpandMore />}
          </MobileDrawerItem>
        </ListItem>
        
        <Collapse in={languageOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem disablePadding>
              <MobileDrawerItem onClick={handleLanguageChange} sx={{ pl: 4 }}>
                <MobileDrawerText primary="English" />
              </MobileDrawerItem>
            </ListItem>
            <ListItem disablePadding>
              <MobileDrawerItem onClick={handleLanguageChange} sx={{ pl: 4 }}>
                <MobileDrawerText primary="Español" />
              </MobileDrawerItem>
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Box>
  );

  return (
    <>
      <StyledAppBar 
        position="sticky"
        sx={{
          backgroundColor: '#ffffff',
          '&.MuiAppBar-root': {
            backgroundColor: '#ffffff',
          },
        }}
      >
        <Toolbar sx={{ 
          minHeight: { xs: 72, sm: 80, md: 88 },
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 1, sm: 1.5 },
          justifyContent: 'space-between',
          gap: { xs: 1, sm: 2 },
          alignItems: 'center'
        }}>
          {/* Logo */}
          <LogoContainer onClick={()=>router.push('/')}>
            <LogoIcon />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                color: '#000000', 
                fontWeight: 800,
                fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                letterSpacing: '0.5px',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#d32f2f',
                }
              }}
            >
              CommercialUK™
            </Typography>
          </LogoContainer>

          {/* Mobile Menu Button */}
          <MobileMenuButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </MobileMenuButton>

          {/* Desktop Action Buttons */}
          <MobileActionButtons>
            <IconButton
              color="inherit"
              onClick={handleLanguageChange}
              sx={{ color: '#666666' }}
            >
              <LanguageIcon />
            </IconButton>
            <AllPropertiesLink onClick={handleAllProperties}>
              All Properties
            </AllPropertiesLink>
            <AllPropertiesLink onClick={handleAbout}>
              About Us
            </AllPropertiesLink>
            <LoginButton onClick={handleLogin}>
              Login
            </LoginButton>
            <AdvertiseButton onClick={handleAdvertise}>
              Advertise
            </AdvertiseButton>
          </MobileActionButtons>
        </Toolbar>
      </StyledAppBar>

      {/* Mobile Drawer */}
      <MobileDrawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {drawer}
      </MobileDrawer>
    </>
  );
}
