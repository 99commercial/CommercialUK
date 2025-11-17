import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { Page } from '@/components';
import {
  Box,
  Button,
  Chip,
  Container,
  Stack,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PropertyCardComponent, { Property } from '../components/PropertyCard';
import axiosInstance from '../utils/axios';
import { useRouter } from 'next/router';
import MainLayout from '../layouts/Main/MainLayout';
import { enqueueSnackbar } from 'notistack';

// ----------------------------------------------------------------------

const PropertyForSale: NextPage = () => {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favoriteProperties, setFavoriteProperties] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);

  // Search filters
  const [location, setLocation] = useState('');
  const [minSize, setMinSize] = useState('');
  const [maxSize, setMaxSize] = useState('');

  // UK locations for dropdown
  const ukLocations = [
    'London',
    'Manchester',
    'Birmingham',
    'Leeds',
    'Liverpool',
    'Bristol',
    'Sheffield',
    'Edinburgh',
    'Glasgow',
    'Leicester',
    'Nottingham',
    'Southampton',
    'Newcastle',
    'Cardiff',
    'Belfast',
  ];

  return (
    <Page
      title="UK Commercial Property for Sale"
      meta={
        <>
          <meta
            name="description"
            content="Explore UK commercial property for sale including offices, shops, warehouses & land. Freehold & leasehold investment opportunities nationwide."
          />
          <meta name="keywords" content="commercial property for sale, UK commercial property, office buildings for sale, shops for sale, warehouse units for sale" />
        </>
      }
    >
      {/* Hero Section with Search */}
      <Box
        sx={{
          position: 'relative',
          py: { xs: 8, md: 14 },
          background: 'linear-gradient(135deg, rgba(242, 197, 20,0.85) 0%, rgba(242, 197, 20,0.75) 100%), url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&auto=format&fit=crop) center/cover no-repeat',
          color: 'common.white',
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={4} alignItems="center" textAlign="center">
            <Chip 
              label="Commercial Property Marketplace" 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.25)', 
                color: 'common.white', 
                fontWeight: 700,
                fontSize: '0.875rem',
                py: 2.5,
                '& .MuiChip-label': {
                  px: 2
                }
              }} 
            />
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 900, 
                lineHeight: 1.2,
                color: 'common.white',
                textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              Find the Best Commercial Properties for Sale in the UK
            </Typography>

            {/* Search Bar */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                width: '100%',
                maxWidth: 900,
                bgcolor: 'rgba(255,255,255,0.95)',
                borderRadius: 3,
              }}
            >
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
                <Box sx={{ flex: { md: 1 }, width: { xs: '100%', md: '30%' } }}>
                  <TextField
                    fullWidth
                    select
                    label="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    variant="outlined"
                    SelectProps={{
                      IconComponent: LocationOnIcon,
                    }}
                  >
                    <MenuItem value="">All Locations</MenuItem>
                    {ukLocations.map((loc) => (
                      <MenuItem key={loc} value={loc}>
                        {loc}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
                <Box sx={{ flex: { md: 1 }, width: { xs: '100%', md: '22%' } }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Min. Sq. ft."
                    value={minSize}
                    onChange={(e) => setMinSize(e.target.value)}
                    variant="outlined"
                    inputProps={{ min: 0 }}
                  />
                </Box>
                <Box sx={{ flex: { md: 1 }, width: { xs: '100%', md: '22%' } }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Max. Sq. ft."
                    value={maxSize}
                    onChange={(e) => setMaxSize(e.target.value)}
                    variant="outlined"
                    inputProps={{ min: 0 }}
                  />
                </Box>
                <Box sx={{ flex: { md: 1 }, width: { xs: '100%', md: '18%' } }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<SearchIcon />}
                    sx={{
                      py: 1.75,
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, rgba(242, 197, 20,1) 0%, rgba(242, 197, 20,1) 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, rgba(242, 197, 20,1) 0%, rgba(242, 197, 20,1) 100%)',
                      }
                    }}
                  >
                    Search
                  </Button>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Container>
      </Box>

      {/* Main Content */}
      <Box 
        sx={{ 
          py: { xs: 6, md: 10 },
          background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,248,248,1) 50%, rgba(255,255,255,1) 100%)'
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={8}>
            
            {/* Introduction Section */}
            <Paper 
              variant="outlined" 
              sx={{ 
                p: { xs: 4, md: 6 }, 
                width: '100%',
                borderRadius: 4, 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,250,250,0.98) 100%)',
                borderLeft: (t) => `6px solid #f9d85a`,
                boxShadow: '0 4px 20px rgba(242, 197, 20,0.08)'
              }}
            >
              <Stack spacing={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <BusinessCenterIcon sx={{ fontSize: 40, color: '#f2c514' }} />
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 900,
                      color: 'text.primary',
                      fontSize: { xs: '1.75rem', md: '2.25rem' }
                    }}
                  >
                    Discover the Best Commercial Property Opportunities in the UK
                  </Typography>
                </Stack>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'text.secondary' }}>
                  Explore thousands of commercial properties for sale in the UK, including offices, retail units, warehouses, development land, and more. Whether you're looking to buy commercial property in the UK for investment or business use, CommercialUK connects you with verified listings and trusted commercial property agents near you.
                </Typography>
              </Stack>
            </Paper>

            

            {/* FAQs Section */}
            <Paper 
              variant="outlined" 
              sx={{ 
                p: { xs: 4, md: 6 }, 
                borderRadius: 4,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,250,250,0.98) 100%)',
                borderLeft: (t) => `6px solid #f9d85a`,
                boxShadow: '0 4px 20px rgba(242, 197, 20,0.08)'
              }}
            >
              <Stack spacing={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <TrendingUpIcon sx={{ fontSize: 40, color: '#f2c514' }} />
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 900,
                      color: 'text.primary',
                      fontSize: { xs: '1.75rem', md: '2.25rem' }
                    }}
                  >
                    FAQs About Commercial Property for Sale in the UK
                  </Typography>
                </Stack>

                {/* FAQ Accordions */}
                <Stack spacing={2}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 600 }}>
                        1. How many commercial property options are there throughout the UK?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        CommercialUK features thousands of commercial real estate UK listings, from shops for sale and offices for sale UK to industrial units, commercial buildings, and development land for sale UK. Buyers and investors can explore updated listings tailored to different budgets, business needs, and investment goals.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 600 }}>
                        2. What determines the price of commercial property in the UK?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        The value of commercial property for sale in the UK depends on factors like location, size, property type, and transport links. For example, office buildings for sale in city centres often command premium prices, while warehouse units for sale UK or industrial units for sale UK offer affordable entry points with long-term potential.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 600 }}>
                        3. What kind of commercial property can I purchase in the UK?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        At CommercialUK, you can buy a wide range of commercial properties, including:
                      </Typography>
                      <Box component="ul" sx={{ mt: 2, pl: 3 }}>
                        <li>Freehold shops for sale on high streets</li>
                        <li>New office buildings for sale UK in major business hubs</li>
                        <li>Warehouse units for sale UK for logistics and manufacturing</li>
                        <li>Commercial land for sale UK for future development</li>
                        <li>Restaurants, cafes, and leisure properties for sale</li>
                        <li>Healthcare and medical facilities</li>
                        <li>Co-working and flexible office spaces</li>
                      </Box>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 600 }}>
                        4. Why invest in the UK commercial property market?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        The UK commercial property market is one of the most stable and rewarding globally. It offers consistent rental returns, capital appreciation, and portfolio diversification. Whether it's investment property UK or commercial real estate UK, the country's infrastructure, demand, and legal stability make it a prime investment destination.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 600 }}>
                        5. Can I buy both freehold and leasehold commercial property in the UK?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        Yes. You can choose between freehold retail shops for sale in the UK for full ownership or leasehold commercial units for sale that offer flexibility and lower upfront costs.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 600 }}>
                        6. Are commercial premises in the UK suitable for first-time investors?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        Absolutely. There are many beginner-friendly options like small retail shops, office spaces, or light industrial units ideal for those entering the commercial property investment UK market.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 600 }}>
                        7. How can I fund the purchase of a UK commercial property?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        Buyers can use commercial mortgages, bridging loans, or development finance depending on whether they're buying office buildings for sale, industrial properties, or land for development.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 600 }}>
                        8. What are the best areas in the UK to invest in commercial property?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        While London remains a leading market, cities like Manchester, Birmingham, and Leeds offer excellent growth potential. Emerging areas benefiting from regeneration or new transport infrastructure are also great for finding commercial units for sale near me.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 600 }}>
                        9. What costs should I consider when purchasing commercial property?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        In addition to the purchase price, consider expenses like survey and legal fees, insurance, stamp duty, and property management. Owners of commercial buildings for sale in the UK may also have ongoing maintenance costs.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 600 }}>
                        10. Can foreign buyers purchase commercial property in the UK?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        Yes. The UK welcomes international investors. Foreign buyers often choose commercial real estate in the UK for its transparency, high demand, and long-term investment stability.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </Stack>
              </Stack>
            </Paper>
          </Stack>
        </Container>
      </Box>
    </Page>
  );
};

// Add getLayout function
(PropertyForSale as any).getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default PropertyForSale;

