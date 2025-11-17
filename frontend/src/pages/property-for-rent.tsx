import React, { useState } from 'react';
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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import MainLayout from '../layouts/Main/MainLayout';

// ----------------------------------------------------------------------

const PropertyForRent: NextPage = () => {
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
      title="Rent Out Your Commercial Property Fast in the UK | CommercialUK"
      meta={
        <>
          <meta
            name="description"
            content="Find tenants faster for your commercial property with CommercialUK. Simple listings, wide reach, and quick results across the UK."
          />
          <meta name="keywords" content="commercial property to rent, shops to let, office to rent UK, warehouse to rent, commercial unit for rent" />
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
              label="Commercial Property Rental" 
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
              Find the Best Commercial Properties to Rent in UK
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
                    Discover the Best Commercial Property Opportunities for Rent in the UK
                  </Typography>
                </Stack>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'text.secondary' }}>
                  Looking for commercial property to rent in the UK? CommercialUK makes it effortless to find the perfect space for your business, whether you're a startup, SME, or established brand. Our platform lists a variety of commercial units to rent near me, shops to let, office to rent UK, warehouse to rent UK, industrial unit to rent UK, and retail shop to rent UK options.
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'text.secondary' }}>
                  From premium retail locations in London, Manchester, and Birmingham to flexible office space hotspots in Leeds, Bristol, and Nottingham, we match you with properties that fit your budget, size, and location. Businesses looking for commercial unit for rent or warehouse rental in the UK will find extensive choices, while startups and freelancers can explore creative co-working space to let options in thriving business communities.
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'text.secondary' }}>
                  With great transport links, affordable rents beyond city centre hotspots, and access to skilled talent, the UK offers diverse opportunities for every industry. At CommercialUK, we bring all these listings together on one reliable rental site, where you can compare, shortlist, and secure your next business premises.
                </Typography>
                <Box sx={{ mt: 2, p: 3, borderRadius: 2, bgcolor: 'rgba(242, 197, 20,0.05)' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#f2c514', mb: 1 }}>
                    CommercialUK – Your one-stop commercial estate agent UK
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'text.secondary' }}>
                    CommercialUK is a trusted commercial estate agent UK platform designed to find and compare shops to let, office space for rent UK, warehouse for rent UK, and commercial space to let UK quick and easy — all in one place.
                  </Typography>
                </Box>
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
                    FAQs Regarding Commercial Property to Rent in the UK
                  </Typography>
                </Stack>

                {/* FAQ Accordions */}
                <Stack spacing={2}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 600 }}>
                        1. What kind of commercial property to rent in the UK is available on CommercialUK?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        You can browse plenty of options ranging from shops to let, office to rent UK, warehouse to rent UK, and co working space to let perfect for businesses of any size or sector. Whether you need a commercial unit for rent, retail shop to rent UK, or industrial unit to rent UK, we've got you covered.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 600 }}>
                        2. How do I search for shops to let on CommercialUK?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        Simply use our advanced search filters to locate shops to let near me or anywhere in the UK by location, size, and budget. You can also view in-depth property descriptions, images, and agent contacts to find the ideal commercial property to rent in the UK.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 600 }}>
                        3. Are there flexible office spaces for rent in the UK?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        Yes. CommercialUK features a wide range of office to rent UK listings, from small serviced offices to large corporate headquarters. You can choose short-term, long-term, or flexible contracts depending on your business requirements.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 600 }}>
                        4. Can I rent a warehouse in the UK for storage or distribution?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        Absolutely. We list everything from compact storage units to large warehouse for rent in the UK and industrial unit to let UK options ideal for logistics, manufacturing, and distribution.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 600 }}>
                        5. Do you feature co working space to let for startups and freelancers?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        Yes. CommercialUK provides updated listings for co working space to let, ideal for startups, freelancers, and expanding teams seeking modern, collaborative work environments.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 600 }}>
                        6. How do I advertise my commercial property for rent in the UK on CommercialUK?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        Property agents and owners can easily list their commercial building to rent a UK or commercial unit by adding details, images, and prices. This ensures your listing reaches a wide audience of potential tenants across the UK.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 600 }}>
                        7. Are rents negotiable or fixed?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        Rental conditions vary based on landlords and leases. Most commercial property to rent UK listings display guide prices, but negotiation is often possible, especially for long-term agreements or multiple-unit rentals.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 600 }}>
                        8. Why use CommercialUK to find commercial property to rent in the UK?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        CommercialUK is a trusted commercial estate agent UK platform designed to find and compare shops to let, office space for rent UK, warehouse for rent UK, and commercial space to let UK quick and easy — all in one place.
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
(PropertyForRent as any).getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default PropertyForRent;

