import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Divider,
  Tooltip,
  useMediaQuery,
  useTheme,
  
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Article as ArticleIcon,
  AccountBalance as AccountBalanceIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  Edit as EditIcon,
  QueryBuilder as QueryBuilderIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
  Favorite as StarIcon,
  CreditCard as CreditCardIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import Link from 'next/link';

const drawerWidth = 280;
const collapsedDrawerWidth = 80;
const mobileDrawerWidth = 280;

interface StyledDrawerProps {
  open: boolean;
  isMobile: boolean;
  isTablet: boolean;
}

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'isMobile' && prop !== 'isTablet',
})<StyledDrawerProps>(({ theme, open, isMobile, isTablet }) => ({
  width: isMobile ? 0 : (open ? drawerWidth : 0), // No width when collapsed on desktop
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: isMobile ? mobileDrawerWidth : (open ? drawerWidth : collapsedDrawerWidth),
    boxSizing: 'border-box',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e5e7eb',
    // Mobile specific styles
    ...(isMobile && {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      zIndex: theme.zIndex.drawer,
      transform: open ? 'translateX(0)' : 'translateX(-100%)',
      transition: theme.transitions.create('transform', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
    // Desktop specific styles - overlay when collapsed
    ...(!isMobile && !isTablet && {
      position: open ? 'relative' : 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      zIndex: open ? 'auto' : theme.zIndex.drawer,
      transform: open ? 'translateX(0)' : 'translateX(-100%)',
      transition: theme.transitions.create('transform', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
    // Tablet specific styles
    ...(isTablet && {
      width: open ? drawerWidth : 0,
    }),
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  minHeight: 64,
  cursor: 'pointer',
  borderRadius: theme.spacing(1),
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    transform: 'scale(1.02)',
  },
}));

const LogoIcon = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
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
}));

const LogoText = styled(Typography)(({ theme }) => ({
  color: '#000000', 
  fontWeight: 800,
  fontSize: '1.2rem',
  letterSpacing: '0.5px',
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    color: '#d32f2f',
  },
}));

const UserProfileCard = styled(Box)(({ theme }) => ({
  margin: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: '#f9fafb',
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  minHeight: 80,
  [theme.breakpoints.down('md')]: {
    margin: theme.spacing(1.5),
    padding: theme.spacing(1.5),
    minHeight: 70,
  },
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    backgroundColor: '#10b981',
    borderRadius: '50%',
    border: '2px solid white',
  },
}));

const UserInfo = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: 0,
}));

const UserName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  color: '#374151',
  marginBottom: theme.spacing(0.5),
}));

const UserBadge = styled(Chip)(({ theme }) => ({
  backgroundColor: '#dcfce7',
  color: '#166534',
  fontSize: '0.75rem',
  height: 20,
  fontWeight: 500,
}));

const ListingCountContainer = styled(Box)(({ theme }) => ({
  margin: `${theme.spacing(0)} ${theme.spacing(2)} ${theme.spacing(2)} ${theme.spacing(2)}`,
  padding: `${theme.spacing(1.25)} ${theme.spacing(1.75)}`,
  backgroundColor: '#f0f9ff',
  borderRadius: 12,
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(0.5),
  transition: 'all 0.2s ease-in-out',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  [theme.breakpoints.down('md')]: {
    margin: `${theme.spacing(0)} ${theme.spacing(1.5)} ${theme.spacing(1.5)} ${theme.spacing(1.5)}`,
    padding: `${theme.spacing(1)} ${theme.spacing(1.5)}`,
  },
  '&:hover': {
    backgroundColor: '#e0f2fe',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
  },
}));

const ListingCountNumber = styled('span')(({ theme }) => ({
  fontSize: '1rem',
  color: '#0369a1',
  fontWeight: 700,
  fontFamily: theme.typography.fontFamily,
  letterSpacing: '0.01em',
  lineHeight: 1.2,
  [theme.breakpoints.down('md')]: {
    fontSize: '0.9375rem',
  },
}));

const ListingCountText = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: '#0369a1',
  fontWeight: 500,
  letterSpacing: '0.01em',
  lineHeight: 1.2,
  [theme.breakpoints.down('md')]: {
    fontSize: '0.8125rem',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '0.75rem',
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
  marginTop: theme.spacing(2),
}));

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  margin: theme.spacing(0.5, 1),
  borderRadius: 8,
  background: active
    ? 'linear-gradient(90deg, #dcfce7 0%, rgba(220, 252, 231, 0) 100%)'
    : 'transparent',
  minHeight: 48, // Increased for better touch targets
  transition: 'all 0.2s ease-in-out',
  transform: 'translateX(0)',
  '&:hover': {
    background: active
      ? 'linear-gradient(90deg, #dcfce7 0%, rgba(220, 252, 231, 0) 100%)'
      : '#f3f4f6',
    transform: 'translateX(2px)',
  },
  '&:active': {
    transform: 'translateX(0) scale(0.98)',
  },
  '& .MuiListItemIcon-root': {
    color: active ? '#10b981' : '#6b7280',
    minWidth: 40,
    transition: 'color 0.2s ease-in-out',
  },
  '& .MuiListItemText-primary': {
    color: active ? '#10b981' : '#374151',
    fontWeight: active ? 600 : 400,
    fontSize: '0.875rem',
    transition: 'all 0.2s ease-in-out',
  },
  [theme.breakpoints.down('md')]: {
    minHeight: 52, // Larger touch targets on mobile
    margin: theme.spacing(0.25, 0.5),
  },
}));

const CollapsedIconButton = styled(IconButton)(({ theme }) => ({
  margin: theme.spacing(0.5, 1),
  borderRadius: 8,
  padding: theme.spacing(1),
  minHeight: 48,
  transition: 'all 0.2s ease-in-out',
  transform: 'translateX(0)',
  '&:hover': {
    backgroundColor: '#f3f4f6',
    transform: 'translateX(2px)',
  },
  '&:active': {
    transform: 'translateX(0) scale(0.95)',
  },
  [theme.breakpoints.down('md')]: {
    minHeight: 52,
    margin: theme.spacing(0.25, 0.5),
  },
}));

const CollapsedLinkWrapper = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none',
  width: '100%',
  padding: '4px 8px',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  transform: 'scale(1)',
  position: 'relative',
  zIndex: 9999,
  '&:hover': {
    transform: 'scale(1.1)',
    zIndex: 10000,
  },
}));

const DecorativeElement = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: 100,
  background: 'linear-gradient(45deg, #f3f4f6 0%, transparent 100%)',
  opacity: 0.3,
  pointerEvents: 'none',
  zIndex: 0,
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 40,
    height: 40,
    border: '2px dashed #d1d5db',
    borderRadius: '50%',
    transform: 'rotate(45deg)',
  },
}));

interface SideBarProps {
  open: boolean;
  onToggle: () => void;
  onClose?: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ open, onToggle, onClose }) => {
  const [activeItem, setActiveItem] = useState<string | null>('dashboard');
  // No per-item navigation loader; use Link + prefetch for speed
  const [lastClickedId, setLastClickedId] = useState<string | null>(null);
  const [allActive, setAllActive] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const router = useRouter();
  
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const subscription = user?.subscription || null;
  const isExpired = subscription?.isExpired ?? false;
  const reportCount = subscription?.reportCount ?? 0;
  const listingCount = subscription?.listingCount ?? 0;

  // Calculate disabled states based on subscription
  // Plans: disabled if subscription exists AND isExpired is false AND reportCount > 0
  const isPlansDisabled = subscription !== null && !isExpired && reportCount > 0;
  const plansTooltipMessage = isPlansDisabled ? 'Currently a plan is active' : '';

  // Create New: disabled if subscription is null OR isExpired is true
  const isCreateNewDisabled = subscription === null || isExpired;
  const createNewTooltipMessage = isCreateNewDisabled ? 'Please subscribe to a plan' : '';

  const menuItems = [
    {
      section: 'GENERAL',
      items: [
        { id: 'dashboard' , path: '/agent', label: 'Dashboard', icon: DashboardIcon, isDisabled: false, tooltipMessage: '' },
      ],
    },
    {
      section: 'User',
      items: [
        { id: 'My Profile', path: '/agent/account/my-profile', label: 'My Profile', icon: PersonIcon, isDisabled: false, tooltipMessage: '' },
        { id: 'Edit Profile', path: '/agent/account/my-account', label: 'Edit Profile', icon: EditIcon, isDisabled: false, tooltipMessage: '' },
        { id: 'Edit Business Details', path: '/agent/account/my-business-account', label: 'Edit Business Details', icon: BusinessIcon, isDisabled: false, tooltipMessage: '' },
      ],
    },
    {
      section: 'Properties',
      items: [
        { id: 'Create New', path: '/agent/property/create-property', label: 'Create New', icon: AddIcon, isDisabled: isCreateNewDisabled, tooltipMessage: createNewTooltipMessage },
        { id: 'My Properties' , path: '/agent/property/my-properties', label: 'My Properties', icon: HomeIcon, isDisabled: false, tooltipMessage: '' },
        { id: 'My Favourite Properties' , path: '/agent/property/my-favourite-list', label: 'My Favourite Properties', icon: StarIcon, isDisabled: false, tooltipMessage: '' },
      ],
    },
    {
      section: 'Queries',
      items: [
        { id: 'queries', path: '/agent/queries/my-property-queries', label: 'All Queries', icon: QueryBuilderIcon, isDisabled: false, tooltipMessage: '' },
        { id: 'My Queries' , path: '/agent/queries/my-queries-raised', label: 'My Queries', icon: QuestionAnswerIcon, isDisabled: false, tooltipMessage: '' },
      ],
    },
    {
      section: 'Plans',
      items: [
        { id: 'plans', path: '/agent/payment/plans-page', label: 'My Plans', icon: CreditCardIcon, isDisabled: isPlansDisabled, tooltipMessage: plansTooltipMessage },
      ],
    },
  ];

  // Sync active item with current route
  useEffect(() => {
    const normalize = (p: string) => (p || '').split('#')[0].split('?')[0].replace(/\/$/, '');

    const pathCandidates = [normalize(router.pathname), normalize(router.asPath)];

    let bestMatchId: string | null = null;
    let bestMatchLength = -1;

    for (const candidate of pathCandidates) {
      if (!candidate) continue;
      for (const section of menuItems) {
        for (const item of section.items) {
          const itemPath = normalize(item.path);
          if (
            candidate === itemPath ||
            candidate.startsWith(itemPath + '/') ||
            candidate.startsWith(itemPath)
          ) {
            const length = itemPath.length;
            if (length > bestMatchLength) {
              bestMatchId = item.id;
              bestMatchLength = length;
            }
          }
        }
      }
      if (bestMatchId) break; // prefer pathname match
    }

    if (bestMatchId) {
      setActiveItem(bestMatchId);
      setAllActive(false);
      return;
    }

    if (lastClickedId) {
      setActiveItem(lastClickedId);
      setAllActive(false);
      return;
    }

    const normalizedAgent = normalize('/agent');
    const currentNormalized = normalize(router.pathname || router.asPath || '');
    if (currentNormalized === normalizedAgent) {
      setActiveItem('dashboard');
      setAllActive(false);
      return;
    }

    // Nothing selected: show all as active
    setActiveItem(null);
    setAllActive(true);
  }, [router.pathname, router.asPath, lastClickedId]);

  // Prefetch all sidebar routes for snappier navigation
  useEffect(() => {
    menuItems.forEach(section => {
      section.items.forEach(item => {
        if (item?.path) {
          router.prefetch(item.path).catch(() => {});
        }
      });
    });
  }, []);

  const handleAfterNavigate = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };
  const handleSetActive = (id: string) => {
    setActiveItem(id);
    setLastClickedId(id);
    setAllActive(false);
  };

  const renderMenuItem = (item: any, index: number) => {
    const IconComponent = item.icon;
    const isActive = allActive || activeItem === item.id;
    const isDisabled = item.isDisabled || false;
    const tooltipMessage = item.tooltipMessage || '';

    if (!open) {
      const collapsedButton = (
        <CollapsedIconButton
          disabled={isDisabled}
          sx={{
            background: isActive && !isDisabled
              ? 'linear-gradient(90deg, #dcfce7 0%, rgba(220, 252, 231, 0) 100%)'
              : 'transparent',
            color: isDisabled ? '#9ca3af' : (isActive ? '#10b981' : '#6b7280'),
            transition: 'all 0.2s ease-in-out',
            width: '100%',
            pointerEvents: 'none',
            opacity: isDisabled ? 0.5 : 1,
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            '&:hover': {
              backgroundColor: isDisabled ? 'transparent' : '#f3f4f6',
              transform: isDisabled ? 'none' : 'translateX(2px)',
            },
          }}
        >
          <IconComponent />
        </CollapsedIconButton>
      );

      if (isDisabled) {
        return (
          <Tooltip key={item.id} title={tooltipMessage || item.label} placement="right" arrow>
            <Box sx={{ display: 'flex', width: '100%' }}>
              {collapsedButton}
            </Box>
          </Tooltip>
        );
      }

      return (
        <CollapsedLinkWrapper
          key={item.id}
          href={item.path}
          prefetch
          onClick={(e) => {
            handleSetActive(item.id);
            handleAfterNavigate();
          }}
        >
          {collapsedButton}
        </CollapsedLinkWrapper>
      );
    }

    const buttonContent = (
      <StyledListItemButton
        active={isActive && !isDisabled}
        disabled={isDisabled}
        sx={{
          transition: 'all 0.2s ease-in-out',
          width: '100%',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          position: 'relative',
          zIndex: 1,
          opacity: isDisabled ? 0.5 : 1,
          '&:hover': {
            background: isDisabled 
              ? 'transparent'
              : (isActive
                ? 'linear-gradient(90deg, #dcfce7 0%, rgba(220, 252, 231, 0) 100%)'
                : '#f3f4f6'),
            transform: isDisabled ? 'none' : 'translateX(2px)',
          },
          '& .MuiListItemIcon-root': {
            color: isDisabled ? '#9ca3af' : (isActive ? '#10b981' : '#6b7280'),
          },
          '& .MuiListItemText-primary': {
            color: isDisabled ? '#9ca3af' : (isActive ? '#10b981' : '#374151'),
          },
        }}
        onClick={(e) => {
          if (isDisabled) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          e.stopPropagation();
          handleSetActive(item.id);
          router.push(item.path);
          handleAfterNavigate();
        }}
      >
        <ListItemIcon>
          <IconComponent />
        </ListItemIcon>
        <ListItemText 
          primary={item.label}
          sx={{
            '& .MuiListItemText-primary': {
              transition: 'all 0.2s ease-in-out',
            },
          }}
        />
      </StyledListItemButton>
    );

    return (
      <ListItem key={item.id} disablePadding>
        {isDisabled && tooltipMessage ? (
          <Tooltip title={tooltipMessage} placement="right" arrow>
            <Box sx={{ width: '100%' }}>
              {buttonContent}
            </Box>
          </Tooltip>
        ) : (
          buttonContent
        )}
      </ListItem>
    );
  };

  // Mobile drawer - temporary overlay
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: mobileDrawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {/* Header with Logo and Toggle */}
        <LogoContainer onClick={() => {
          router.push('/');
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <img
              src="/images/CUKLogo.png"
              alt="CommercialUK"
              style={{ width: 220, objectFit: 'contain' }}
            />
          </Box>
          <IconButton
            onClick={(e) => {
              e.stopPropagation(); // Prevent logo click when clicking close button
              onClose();
            }}
            sx={{
              color: '#6b7280',
              '&:hover': {
                backgroundColor: '#f3f4f6',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </LogoContainer>

        {/* User Profile Section */}
        <UserProfileCard>
          <UserAvatar src={user?.photo || user?.profile_picture} alt="User" />
          <UserInfo>
            <UserName>{user?.firstName || user?.first_name || 'User'} {user?.lastName || user?.last_name || ''}</UserName>
            <UserBadge label={user?.role || 'N/A'} size="small" />
          </UserInfo>
        </UserProfileCard>
        
        {/* Listing Count Section */}
        <ListingCountContainer>
          <ListingCountText>
            Remaining {listingCount === 1 ? 'Property' : 'Properties'} :
          </ListingCountText>
          <ListingCountNumber>{listingCount}</ListingCountNumber>
        </ListingCountContainer>

        {/* Navigation Menu */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {menuItems.map((section) => (
            
            <Box key={section.section}>
              <SectionTitle>{section.section}</SectionTitle>
              <List disablePadding>
                {section.items.map((item, index) => renderMenuItem(item, index))}
              </List>
            </Box>
          ))}
        </Box>
      </Drawer>
    );
  }

  return (
    <>
      {/* Floating toggle button for collapsed desktop sidebar */}
      {!isMobile && !isTablet && !open && (
        <IconButton
          onClick={onToggle}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              backgroundColor: '#f9fafb',
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      
      <StyledDrawer
          variant="permanent"
          open={open}
          onClose={onClose}
          isMobile={isMobile}
          isTablet={isTablet}
          sx={{
            '& .MuiDrawer-paper': {
              position: 'relative',
              height: '100vh',
            },
          }}
        >
        {/* Header with Logo and Toggle */}
        <LogoContainer onClick={() => {
          console.log('Logo clicked, navigating to home');
          router.push('/');
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {open && (
              <img
              src="/images/CUKLogo.png"
              alt="CommercialUK"
              style={{ width: 220, objectFit: 'contain' }}
            />
            )}
          </Box>
          {isMobile && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation(); // Prevent logo click when clicking close button
                onClose();
              }}
              sx={{
                color: '#6b7280',
                '&:hover': {
                  backgroundColor: '#f3f4f6',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </LogoContainer>

        {/* User Profile Section */}
        {open && (
          <>
            <UserProfileCard>
              <UserAvatar src={user?.photo || user?.profile_picture} alt="User" />
              <UserInfo>
                <UserName>{user?.firstName || user?.first_name || 'User'} {user?.lastName || user?.last_name || ''}</UserName>
                <UserBadge label={user?.role || 'N/A'} size="small" />
              </UserInfo>
            </UserProfileCard>
            
            {/* Listing Count Section */}
            <ListingCountContainer>
            <ListingCountText>
                Remaining {listingCount === 1 ? 'Property' : 'Properties'} :
              </ListingCountText>
              <ListingCountNumber>{listingCount}</ListingCountNumber>
             
            </ListingCountContainer>
          </>
        )}

        {/* Navigation Menu */}
        <Box sx={{ flex: 1, overflow: 'auto', position: 'relative', zIndex: 1 }}>
          {menuItems.map((section) => (
            <Box key={section.section}>
              {open && <SectionTitle>{section.section}</SectionTitle>}
              <List disablePadding>
                {section.items.map((item, index) => renderMenuItem(item, index))}
              </List>
            </Box>
          ))}
        </Box>

        {/* Decorative Element */}
        {open && <DecorativeElement />}
      </StyledDrawer>
    </>
  );
};

export default SideBar;
