import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Stack,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import StoreIcon from '@mui/icons-material/Store';
import FactoryIcon from '@mui/icons-material/Factory';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import WorkIcon from '@mui/icons-material/Work';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LandscapeIcon from '@mui/icons-material/Landscape';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import DomainIcon from '@mui/icons-material/Domain';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// ----------------------------------------------------------------------

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '70vh',
  backgroundImage: 'url("https://www.keytel.in/property-blog/wp-content/uploads/2022/06/commercial.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4, 2),
  marginTop: 0,
  zIndex: 1, // Ensure it's below the navbar
  [theme.breakpoints.down('sm')]: {
    minHeight: '100vh',
    padding: theme.spacing(2, 0.5),
    backgroundPosition: 'center top',
  },
  [theme.breakpoints.up('sm')]: {
    minHeight: '85vh',
    padding: theme.spacing(4, 2),
  },
  [theme.breakpoints.up('md')]: {
    minHeight: '70vh',
    padding: theme.spacing(5, 2),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
}));

const SearchContainer = styled(Paper)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  padding: theme.spacing(3, 4),
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(20px)', 
  borderRadius: theme.spacing(4),
  maxWidth: 900,
  width: '100%',
  margin: '0 auto',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 25px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2.5, 1.5),
    borderRadius: theme.spacing(3),
    maxWidth: '100%',
    margin: theme.spacing(0, 1),
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2), 0 5px 15px rgba(0, 0, 0, 0.15)',
  },
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(2.5, 3),
    borderRadius: theme.spacing(3),
    maxWidth: 700,
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(3, 4),
    borderRadius: theme.spacing(4),
    maxWidth: 900,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: theme.spacing(4),
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.02) 100%)',
    pointerEvents: 'none',
    [theme.breakpoints.down('sm')]: {
      borderRadius: theme.spacing(2),
    },
    [theme.breakpoints.up('sm')]: {
      borderRadius: theme.spacing(3),
    },
    [theme.breakpoints.up('md')]: {
      borderRadius: theme.spacing(4),
    },
  },
}));

const PropertyTypeCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: 'transparent',
  boxShadow: 'none',
  border: '2px solid transparent',
  borderRadius: theme.spacing(2),
  minHeight: 110,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    transform: 'translateY(-3px)',
    border: '2px solid #000',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
  },
  '&:active': {
    transform: 'translateY(-1px) scale(0.98)',
  },
  '&.selected': {
    border: '2px solid #000',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  },
  [theme.breakpoints.down('sm')]: {
    minHeight: 110,
    borderRadius: theme.spacing(1.5),
    '&:hover': {
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
  },
}));

const propertyTypes = [
  { icon: DomainIcon, label: 'Offices', color: '#666' },
  { icon: StoreIcon, label: 'Retail Units', color: '#666' },
  { icon: WarehouseIcon, label: 'Industrial & Warehouses', color: '#666' },
  { icon: LandscapeIcon, label: 'Land & Development', color: '#666' },
  { icon: WorkIcon, label: 'Co-Working Spaces', color: '#666' },
  { icon: RestaurantIcon, label: 'Restaurants & Leisure', color: '#666' },
  { icon: LocalHospitalIcon, label: 'Medical & Care', color: '#666' },
  { icon: FactoryIcon, label: 'Light Industrial Units', color: '#666' },
];

export default function HomeHero() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(5); // Restaurants & Leisure selected by default

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleCategorySelect = (index: number) => {
    setSelectedCategory(index);
  };

  return (
    <HeroSection>
      <Container
        maxWidth="lg" 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100%',
          gap: { xs: 3, sm: 4, md: 5 },
          px: { xs: 0.5, sm: 2 },
          py: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ 
          textAlign: 'center', 
          width: '100%', 
          mb: { xs: 3, sm: 4, md: 5 },
          mt: { xs: 2, sm: 3, md: 4 }
        }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              color: '#ffffff',
              fontWeight: 900,
              fontSize: { xs: '2.8rem', sm: '3.2rem', md: '4.2rem', lg: '4.8rem' },
              lineHeight: { xs: 1.1, sm: 1.05, md: 1.05, lg: 1.0 },
              letterSpacing: { xs: '-0.01em', sm: '-0.02em', md: '-0.03em' },
              textAlign: 'center',
              zIndex: 3,
              maxWidth: '100%',
              mx: 'auto',
              px: { xs: 0.5, sm: 1, md: 2 },
              filter: 'brightness(1.3) contrast(1.2) drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
              WebkitTextStroke: '0.5px rgba(255,255,255,0.3)',
              textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.3)',
            }}
          >
            The World's #1 Commercial Real Estate Marketplace
          </Typography>
        </Box>

        <SearchContainer elevation={8}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            variant="standard"
            sx={{
              mb: { xs: 2.5, sm: 3 },
              '& .MuiTab-root': {
                fontWeight: 600,
                textTransform: 'none',
                fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                color: '#666',
                minHeight: { xs: 48, sm: 52 },
                py: { xs: 1.5, sm: 1.5 },
                px: { xs: 2, sm: 2.5, md: 3 },
                borderRadius: 2,
                transition: 'all 0.3s ease',
                minWidth: { xs: 'auto', sm: 'auto' },
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  color: '#333',
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'scale(0.98)',
                },
              },
              '& .Mui-selected': {
                color: '#000',
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                fontWeight: 700,
                borderRadius: 2,
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#000',
                height: 3,
                borderRadius: '2px 2px 0 0',
              },
            }}
          >
            <Tab label="For Lease" />
            <Tab label="For Sale" />
          </Tabs>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: { xs: 3, sm: 3 }, 
            overflowX: 'auto', 
            pb: 1,
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE and Edge
            '&::-webkit-scrollbar': {
              display: 'none', // Chrome, Safari, Opera
            },
            // Add subtle gradient indicators for scroll
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 20,
              background: 'linear-gradient(to right, rgba(255,255,255,0.8), transparent)',
              pointerEvents: 'none',
              zIndex: 1,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 20,
              background: 'linear-gradient(to left, rgba(255,255,255,0.8), transparent)',
              pointerEvents: 'none',
              zIndex: 1,
            },
          }}>
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 2, sm: 2.5 }, 
              minWidth: 'fit-content',
              px: { xs: 1.5, sm: 0 },
              flexWrap: 'nowrap',
              justifyContent: 'center',
            }}>
              {propertyTypes.map((property, index) => (
                <PropertyTypeCard
                  key={index}
                  className={selectedCategory === index ? 'selected' : ''}
                  onClick={() => handleCategorySelect(index)}
                  sx={{ 
                    minWidth: { xs: 90, sm: 100, md: 110 },
                    flexShrink: 0
                  }}
                >
                  <CardContent sx={{ 
                    textAlign: 'center', 
                    p: { xs: 2, sm: 2.5 }, 
                    '&:last-child': { pb: { xs: 2, sm: 2.5 } } 
                  }}>
                    <Box
                      sx={{
                        width: { xs: 52, sm: 56, md: 60 },
                        height: { xs: 52, sm: 56, md: 60 },
                        borderRadius: '50%',
                        backgroundColor: selectedCategory === index ? '#000' : '#f8f9fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 12px',
                        border: selectedCategory === index ? '3px solid #000' : '2px solid #e0e0e0',
                        transition: 'all 0.3s ease',
                        boxShadow: selectedCategory === index ? '0 4px 12px rgba(0,0,0,0.2)' : '0 2px 6px rgba(0,0,0,0.1)',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    >
                      <property.icon
                        sx={{
                          fontSize: { xs: 24, sm: 26, md: 28 },
                          color: selectedCategory === index ? '#fff' : '#666',
                        }}
                      />
                    </Box>
                    <Typography 
                      variant="body2" 
                      fontWeight={selectedCategory === index ? 700 : 600}
                      sx={{ 
                        color: selectedCategory === index ? '#000' : '#666',
                        fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                        transition: 'all 0.3s ease',
                        lineHeight: 1.3,
                        textAlign: 'center',
                      }}
                    >
                      {property.label}
                    </Typography>
                  </CardContent>
                </PropertyTypeCard>
              ))}
            </Box>
          </Box>

          <Box sx={{ position: 'relative' }}>
            <TextField
              fullWidth
              placeholder="Enter a location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              InputProps={{
                sx: {
                  '& .MuiOutlinedInput-root': {
                    borderRadius: { xs: 3, sm: 3 },
                    backgroundColor: '#f8f9fa',
                    fontSize: { xs: '1rem', sm: '1rem' },
                    height: { xs: 56, sm: 60 },
                    border: '2px solid #e0e0e0',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    '&:hover': {
                      border: '2px solid #000',
                      backgroundColor: '#fff',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    },
                    '&.Mui-focused': {
                      border: '2px solid #000',
                      backgroundColor: '#fff',
                      boxShadow: '0 0 0 4px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0,0,0,0.15)',
                    },
                    '& fieldset': {
                      border: 'none',
                    },
                    '&:hover fieldset': {
                      border: 'none',
                    },
                    '&.Mui-focused fieldset': {
                      border: 'none',
                    },
                  },
                  '& .MuiInputBase-input': {
                    padding: { xs: '16px 20px', sm: '18px 22px' },
                    color: '#333',
                    fontWeight: 500,
                    '&::placeholder': {
                      color: '#999',
                      opacity: 1,
                      fontWeight: 400,
                    },
                  },
                },
              }}
            />
            <IconButton
              size="large"
              sx={{
                position: 'absolute',
                right: { xs: 6, sm: 8 },
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: '#000',
                color: 'white',
                borderRadius: { xs: 2, sm: 2.5 },
                width: { xs: 44, sm: 48 },
                height: { xs: 44, sm: 48 },
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                '&:hover': {
                  backgroundColor: '#333',
                  transform: 'translateY(-50%) scale(1.05)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                },
                '&:active': {
                  transform: 'translateY(-50%) scale(0.95)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                },
              }}
            >
              <SearchIcon sx={{ fontSize: { xs: 22, sm: 24 } }} />
            </IconButton>
          </Box>
        </SearchContainer>
      </Container>
    </HeroSection>
  );
}
