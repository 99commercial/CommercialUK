import { useState, useRef, useEffect } from 'react';
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
  MenuItem,
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
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// ----------------------------------------------------------------------

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '70vh',
  backgroundImage: 'url("https://cdn.melbournecitytour.com.au/wp-content/uploads/2025/09/Melbourne-Tours-from-85-Melbourne-Day-Trips-City-Tours-2.webp")',
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
  padding: theme.spacing(2.5, 4),
  borderRadius: theme.spacing(4),
  maxWidth: 1200,
  width: '100%',
  margin: '0 auto',
  boxShadow: 'none',
  border: 'none',
  backgroundColor: 'transparent',
  // For screens up to 901px - everything in line
  [`@media (max-width: 901px)`]: {
    padding: theme.spacing(2.5, 4),
    borderRadius: theme.spacing(3),
    maxWidth: 1000,
  },
  // For screens below 992px - stacked format like the image
  [`@media (max-width: 992px)`]: {
    padding: theme.spacing(2, 2),
    borderRadius: theme.spacing(3),
    maxWidth: '100%',
    margin: theme.spacing(0, 1),
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
    border: '2px solid #fff',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
  },
  '&:active': {
    transform: 'translateY(-1px) scale(0.98)',
  },
  '&.selected': {
    border: '2px solid #fff',
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
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  const [forSaleChecked, setForSaleChecked] = useState(false);
  const [toLetChecked, setToLetChecked] = useState(false);

  return (
    <HeroSection>
      <Container
        maxWidth={false}
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100%',
          gap: { xs: 3, sm: 4, md: 5 },
          px: { xs: 1, sm: 3, md: 4 },
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
              fontFamily: '"CostarBrown", Helvetica, Arial, sans-serif',
              color: '#ffffff',
              fontWeight: 200,
              fontSize: { xs: '2.4rem', sm: '2.2rem', md: '2.2rem', lg: '3.2rem' },
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
            The One of UK’s Leading Commercial Property Marketplace
          </Typography>
        </Box>

        <SearchContainer elevation={8}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 2.5 },
            alignItems: 'center',
            justifyContent: 'center', 
            flexWrap: { xs: 'nowrap', sm: 'wrap', md: 'nowrap' },
            width: '100%',
            // For screens up to 901px - everything in line
            [`@media (max-width: 901px)`]: {
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 2.5,
            },
            // For screens below 992px - stacked format like the image
            [`@media (max-width: 992px)`]: {
              flexDirection: 'column',
              gap: 2,
            },
          }}>
            {/* Location Input */}
            <TextField
              placeholder="Location (town or postcode)"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              sx={{
                width: { xs: '100%', sm: '280px', md: '350px', lg: '400px' },
                minWidth: { xs: '100%', sm: '250px', md: '300px' },
                // For screens up to 901px - maintain inline sizing
                [`@media (max-width: 901px)`]: {
                  width: '280px',
                  minWidth: '250px',
                },
                // For screens below 992px - full width like the image
                [`@media (max-width: 992px)`]: {
                  width: '100%',
                  minWidth: '100%',
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#fff',
                  height: 56,
                  border: '1px solid #e0e0e0',
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
                  padding: '16px 20px',
                  color: '#333',
                  fontSize: '1rem',
                },
              }}
            />

            {/* Property Types Single-Select */}
            <Box sx={{ 
              position: 'relative', 
              width: { xs: '100%', sm: '200px', md: '220px' },
              minWidth: { xs: '100%', sm: '180px', md: '200px' },
              // For screens up to 901px - maintain inline sizing
              [`@media (max-width: 901px)`]: {
                width: '200px',
                minWidth: '180px',
              },
              // For screens below 992px - full width like the image
              [`@media (max-width: 992px)`]: {
                width: '100%',
                minWidth: '100%',
              },
            }}>
              <TextField
                select
                value={selectedPropertyType}
                onChange={(e) => setSelectedPropertyType(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                      backgroundColor: '#fff',
                    height: 56,
                    border: '1px solid #e0e0e0',
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
                    padding: '16px 20px',
                    color: '#333',
                    fontSize: '1rem',
                  },
                  '& .MuiSelect-icon': {
                    color: '#e74c3c',
                  },
                }}
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (selected: any) => {
                    if (!selected) {
                      return 'all property types';
                    }
                    return selected;
                  },
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        maxHeight: 300,
                        '& .MuiMenuItem-root': {
                          padding: '8px 16px',
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <input
                      type="radio"
                      name="propertyType"
                      checked={selectedPropertyType === ''}
                      onChange={() => setSelectedPropertyType('')}
                      style={{
                        width: 16,
                        height: 16,
                        accentColor: '#e74c3c',
                      }}
                    />
                    <Typography sx={{ fontSize: '0.9rem', color: '#333', fontWeight: 600 }}>all property types</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="Offices">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <input
                      type="radio"
                      name="propertyType"
                      checked={selectedPropertyType === 'Offices'}
                      onChange={() => setSelectedPropertyType('Offices')}
                      style={{
                        width: 16,
                        height: 16,
                        accentColor: '#e74c3c',
                      }}
                    />
                    <Typography sx={{ fontSize: '0.9rem', color: '#333', fontWeight: 600 }}>Offices</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="Industrial">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <input
                      type="radio"
                      name="propertyType"
                      checked={selectedPropertyType === 'Industrial'}
                      onChange={() => setSelectedPropertyType('Industrial')}
                      style={{
                        width: 16,
                        height: 16,
                        accentColor: '#e74c3c',
                      }}
                    />
                    <Typography sx={{ fontSize: '0.9rem', color: '#333', fontWeight: 600 }}>Industrial</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="Land">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <input
                      type="radio"
                      name="propertyType"
                      checked={selectedPropertyType === 'Land'}
                      onChange={() => setSelectedPropertyType('Land')}
                      style={{
                        width: 16,
                        height: 16,
                        accentColor: '#e74c3c',
                      }}
                    />
                    <Typography sx={{ fontSize: '0.9rem', color: '#333', fontWeight: 600 }}>Land</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="Retail">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <input
                      type="radio"
                      name="propertyType"
                      checked={selectedPropertyType === 'Retail'}
                      onChange={() => setSelectedPropertyType('Retail')}
                      style={{
                        width: 16,
                        height: 16,
                        accentColor: '#e74c3c',
                      }}
                    />
                    <Typography sx={{ fontSize: '0.9rem', color: '#333', fontWeight: 600 }}>Retail</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="Leisure">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <input
                      type="radio"
                      name="propertyType"
                      checked={selectedPropertyType === 'Leisure'}
                      onChange={() => setSelectedPropertyType('Leisure')}
                      style={{
                        width: 16,
                        height: 16,
                        accentColor: '#e74c3c',
                      }}
                    />
                    <Typography sx={{ fontSize: '0.9rem', color: '#333', fontWeight: 600 }}>Leisure</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="Other">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <input
                      type="radio"
                      name="propertyType"
                      checked={selectedPropertyType === 'Other'}
                      onChange={() => setSelectedPropertyType('Other')}
                      style={{
                        width: 16,
                        height: 16,
                        accentColor: '#e74c3c',
                      }}
                    />
                    <Typography sx={{ fontSize: '0.9rem', color: '#333', fontWeight: 600 }}>Other</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="Investment">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <input
                      type="radio"
                      name="propertyType"
                      checked={selectedPropertyType === 'Investment'}
                      onChange={() => setSelectedPropertyType('Investment')}
                      style={{
                        width: 16,
                        height: 16,
                        accentColor: '#e74c3c',
                      }}
                    />
                    <Typography sx={{ fontSize: '0.9rem', color: '#333', fontWeight: 600 }}>Investment</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="Business for sale">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <input
                      type="radio"
                      name="propertyType"
                      checked={selectedPropertyType === 'Business for sale'}
                      onChange={() => setSelectedPropertyType('Business for sale')}
                      style={{
                        width: 16,
                        height: 16,
                        accentColor: '#e74c3c',
                      }}
                    />
                    <Typography sx={{ fontSize: '0.9rem', color: '#333', fontWeight: 600 }}>Business for sale</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="Motor Trade">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <input
                      type="radio"
                      name="propertyType"
                      checked={selectedPropertyType === 'Motor Trade'}
                      onChange={() => setSelectedPropertyType('Motor Trade')}
                      style={{
                        width: 16,
                        height: 16,
                        accentColor: '#e74c3c',
                      }}
                    />
                    <Typography sx={{ fontSize: '0.9rem', color: '#333', fontWeight: 600 }}>Motor Trade</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="Healthcare">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <input
                      type="radio"
                      name="propertyType"
                      checked={selectedPropertyType === 'Healthcare'}
                      onChange={() => setSelectedPropertyType('Healthcare')}
                      style={{
                        width: 16,
                        height: 16,
                        accentColor: '#e74c3c',
                      }}
                    />
                    <Typography sx={{ fontSize: '0.9rem', color: '#333', fontWeight: 600 }}>Healthcare</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="Mixed Use">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <input
                      type="radio"
                      name="propertyType"
                      checked={selectedPropertyType === 'Mixed Use'}
                      onChange={() => setSelectedPropertyType('Mixed Use')}
                      style={{
                        width: 16,
                        height: 16,
                        accentColor: '#e74c3c',
                      }}
                    />
                    <Typography sx={{ fontSize: '0.9rem', color: '#333', fontWeight: 600 }}>Mixed Use</Typography>
                  </Box>
                </MenuItem>
              </TextField>
            </Box>

            {/* For Sale/To Let Radio Buttons */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1.5, sm: 2 },
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              width: { xs: '100%', sm: 'auto' },
              flexWrap: 'nowrap',
              // For screens up to 901px - maintain inline layout
              [`@media (max-width: 901px)`]: {
                flexDirection: 'row',
                width: 'auto',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'flex-start',
              },
              // For screens below 992px - stacked format like the image
              [`@media (max-width: 992px)`]: {
                flexDirection: 'column',
                width: '100%',
                gap: 1.5,
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
              },
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <input
                  type="checkbox"
                  checked={forSaleChecked}
                  onChange={(e) => setForSaleChecked(e.target.checked)}
                  style={{
                    width: 20,
                    height: 20,
                    accentColor: '#fff',
                  }}
                />
                <Typography sx={{ fontSize: '1rem', color: '#fff', fontWeight: 500 }}>For Sale</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <input
                  type="checkbox"
                  checked={toLetChecked}
                  onChange={(e) => setToLetChecked(e.target.checked)}
                  style={{
                    width: 20,
                    height: 20,
                    accentColor: '#fff',
                  }}
                />
                <Typography sx={{ fontSize: '1rem', color: '#fff', fontWeight: 500 }}>To Let</Typography>
              </Box>
            </Box>

            {/* Search Button */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#f2c514',
                color: 'white',
                borderRadius: 2,
                height: 56,
                px: 4,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                width: { xs: '100%', sm: 'auto' },
                minWidth: { xs: '100%', sm: '140px' },
                // For screens up to 901px - maintain inline sizing
                [`@media (max-width: 901px)`]: {
                  width: 'auto',
                  minWidth: '140px',
                },
                // For screens below 992px - full width like the image
                [`@media (max-width: 992px)`]: {
                  width: '100%',
                  minWidth: '100%',
                },
                '&:hover': {
                  backgroundColor: '#f2c514',
                },
              }}
            >
              Search
            </Button>
          </Box>
        </SearchContainer>
      </Container>
    </HeroSection>
  );
}
