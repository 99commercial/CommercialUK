import React from 'react';
import { NextPage } from 'next';
import { Page } from '@/components';
import {
  Box,
  Button,
  Chip,
  Container,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
} from '@mui/material';
import {
  PriceCheck,
  Campaign,
  Email,
  Assessment,
  Insights,
  Upload,
  SupportAgent,
  Map,
  InsertDriveFile,
  MailOutline,
  CheckCircle,
  PhoneInTalk,
  Image,
  Link,
  HomeWork,
  Store,
  Business,
  Description,
  Analytics,
  Visibility,
  TrendingUp,
  PhotoCamera,
  Videocam,
  FlightTakeoff,
  LocalOffer,
  Feedback,
  BrandingWatermark,
  AccountBox,
  LocationOn,
  Groups,
  MilitaryTech,
  Star,
} from '@mui/icons-material';

const Advertise: NextPage = () => {
  return (
    <Page
      title="Advertise with CommercialUK"
      meta={
        <meta
          name="description"
          content="Market your commercial property with CommercialUK. Listing options, banner advertising, and enhancement packages."
        />
      }
    >
      {/* Hero Section - Soft Red and White Gradient with Background Image */}
      <Box
        sx={{
          position: 'relative',
          py: { xs: 10, md: 16 },
          color: 'common.white',
          background: 'linear-gradient(135deg, rgba(220,53,69,0.85) 0%, rgba(220,53,69,0.75) 100%), url(https://media.licdn.com/dms/image/sync/v2/D4E27AQGnKZLLS4OYxg/articleshare-shrink_800/B4EZnEl2MkKgAI-/0/1759939880096?e=2147483647&v=beta&t=5but-3c7uH5LbN4Z5RImrVDypZ-uglfZojfT8XpVHAU) center/cover no-repeat',
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Chip 
              label="Commercial Property Marketing" 
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
              Market a Property with CommercialUK
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                maxWidth: 900, 
                color: 'rgba(255,255,255,0.95)',
                fontWeight: 400,
                lineHeight: 1.6
              }}
            >
              Marketing commercial property in the UK can feel competitive, but CommercialUK makes it effortless. Booking your listing on our platform isn't just about visibility, it's about engaging serious purchasers, tenants, investors, landlords, and developers nationwide.
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Main Content with Soft Red and White Gradient Background */}
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
                borderLeft: (t) => `6px solid ${t.palette.error.light}`,
                boxShadow: '0 4px 20px rgba(220,53,69,0.08)'
              }}
            >
              <Stack spacing={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Business sx={{ fontSize: 40, color: 'error.main' }} />
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 900,
                      color: 'text.primary',
                      fontSize: { xs: '1.75rem', md: '2.25rem' }
                    }}
                  >
                    About CommercialUK
                  </Typography>
                </Stack>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'text.secondary' }}>
                  Marketing commercial property in the UK can feel competitive, but CommercialUK makes it effortless. Booking your listing on our platform isn't just about visibility, it's about engaging serious purchasers, tenants, investors, landlords, and developers nationwide. Our platform is tailored for advertisers looking to effectively list, lease, or sell commercial property.
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'text.secondary' }}>
                  Whether you're an agent handling commercial property sale, warehouse units, office space, retail premises, or industrial buildings in the UK, CommercialUK gives you a friction-free, data-driven marketing system designed for targeted exposure.
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mt: 2 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <CheckCircle sx={{ color: 'error.main', fontSize: 30 }} />
                    <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1.05rem' }}>
                      Flexible invoicing for single listings
                </Typography>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <CheckCircle sx={{ color: 'error.main', fontSize: 30 }} />
                    <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1.05rem' }}>
                      Subscription for full portfolio
                    </Typography>
                  </Stack>
                </Box>
                <Box sx={{ mt: 3, p: 3, borderRadius: 2, bgcolor: 'rgba(220,53,69,0.05)' }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
                    <strong>Get a quote today:</strong> email brochures to <strong>info@commercialuk.com</strong>, or log into your dashboard to add listings instantly.
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
                    Certain regions also benefit from council-backed free basic listings, boosting exposure for shops for sale, shops for rent, warehouse for sale, and warehouse for rent in the UK.
                </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* What's Included Section */}
            <Paper 
              variant="outlined" 
              sx={{ 
                p: { xs: 4, md: 6 }, 
                borderRadius: 4,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,250,250,0.98) 100%)',
                borderLeft: (t) => `6px solid ${t.palette.error.light}`,
                boxShadow: '0 4px 20px rgba(220,53,69,0.08)'
              }}
            >
              <Stack spacing={4}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <CheckCircle sx={{ fontSize: 40, color: 'error.main' }} />
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 900,
                      color: 'text.primary',
                      fontSize: { xs: '1.75rem', md: '2.25rem' }
                    }}
                  >
                  What's Included
                </Typography>
                </Stack>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
                  <Card sx={{ width: '100%', border: '1px solid rgba(220,53,69,0.1)' }}>
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Description sx={{ color: 'error.main', fontSize: 32 }} />
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Detailed Listings
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          Unrestricted text, PDF attachments, maps, and high-quality images for all types of commercial property for lease and commercial property listing service in the UK.
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                  
                  <Card sx={{ width: '100%', border: '1px solid rgba(220,53,69,0.1)' }}>
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Visibility sx={{ color: 'error.main', fontSize: 32 }} />
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Mobile Responsive Platform
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          Easy browsing for buyers, tenants, investors on any device.
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                  
                  <Card sx={{ width: '100%', border: '1px solid rgba(220,53,69,0.1)' }}>
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <PhoneInTalk sx={{ color: 'error.main', fontSize: 32 }} />
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Never Miss an Enquiry
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          Monitored phone lines and email forwarding to ensure you capture every lead.
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                  
                  <Card sx={{ width: '100%', border: '1px solid rgba(220,53,69,0.1)' }}>
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Insights sx={{ color: 'error.main', fontSize: 32 }} />
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Intelligent Marketing
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          New & updated listings emailed directly to active occupiers searching business property to rent near me or commercial property investment UK opportunities.
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                  
                  <Card sx={{ width: '100%', border: '1px solid rgba(220,53,69,0.1)' }}>
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Analytics sx={{ color: 'error.main', fontSize: 32 }} />
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Performance Monitoring
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          Track enquiries, page views & brochure downloads to optimize your listings.
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                  
                  <Card sx={{ width: '100%', border: '1px solid rgba(220,53,69,0.1)' }}>
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Upload sx={{ color: 'error.main', fontSize: 32 }} />
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Data Feed Support
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          Ideal for commercial real estate agencies in the UK portfolios with bulk listings.
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                  
                  <Card sx={{ width: '100%', border: '1px solid rgba(220,53,69,0.1)' }}>
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <SupportAgent sx={{ color: 'error.main', fontSize: 32 }} />
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Committed Support
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          Our experts ensure listings remain accurate and optimised for maximum visibility.
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                  
                  <Card sx={{ width: '100%', border: '1px solid rgba(220,53,69,0.1)' }}>
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Assessment sx={{ color: 'error.main', fontSize: 32 }} />
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Advanced Reporting
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          Export data to Excel, PDF, or Word for presentations and analysis.
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Campaign sx={{ color: 'error.main', fontSize: 32 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Company Promotion
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      Showcase agents in peak marketplace positions for enhanced brand visibility.
                    </Typography>
                  </Stack>
                  
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <TrendingUp sx={{ color: 'error.main', fontSize: 32 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Extra Marketing
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      Newsletters, social advertising, regional highlighting to reach more prospects.
                    </Typography>
                  </Stack>
                  
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <HomeWork sx={{ color: 'error.main', fontSize: 32 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Commercial Only Focus
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      Offices, retail space, industrial, warehouses, restaurants, coworking, and small commercial properties for sale.
                    </Typography>
                  </Stack>
                  
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <LocationOn sx={{ color: 'error.main', fontSize: 32 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Enhanced Location Mapping
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      Detailed location insights and mapping for better property discovery.
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Paper>

            {/* Banner Advertising Section */}
            <Paper 
              variant="outlined" 
              sx={{ 
                p: { xs: 4, md: 6 }, 
                borderRadius: 4,
                background: 'linear-gradient(135deg, rgba(220,53,69,0.05) 0%, rgba(255,250,250,0.98) 100%)',
                borderLeft: (t) => `6px solid ${t.palette.error.main}`,
                boxShadow: '0 4px 20px rgba(220,53,69,0.1)'
              }}
            >
              <Stack spacing={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Campaign sx={{ fontSize: 50, color: 'error.main' }} />
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 900,
                      color: 'text.primary',
                      fontSize: { xs: '1.75rem', md: '2.25rem' }
                    }}
                  >
                    Banner Advertising
                  </Typography>
                </Stack>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'text.secondary' }}>
                  Boost visibility for warehouse rental UK, shops to let UK, office premises, or commercial real estate marketing specialists UK portfolios with highly targeted banner placements. Your ad appears on high-traffic commercial pages viewed by thousands of active buyers and tenants.
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mt: 2 }}>
                  <Card sx={{ width: '100%', bgcolor: 'rgba(255,255,255,0.8)', border: '2px solid rgba(220,53,69,0.2)' }}>
                    <CardContent>
                      <Map sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        Targeting Options
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        By area and by property type (office premises for rent UK, industrial units, retail shops).
                      </Typography>
                    </CardContent>
                  </Card>
                  
                  <Card sx={{ width: '100%', bgcolor: 'rgba(255,255,255,0.8)', border: '2px solid rgba(220,53,69,0.2)' }}>
                    <CardContent>
                      <PriceCheck sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        Pricing
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        £35 per 1,000 impressions (min. £350). Bulk discounts available.
                      </Typography>
                    </CardContent>
                  </Card>
                  
                  <Card sx={{ width: '100%', bgcolor: 'rgba(255,255,255,0.8)', border: '2px solid rgba(220,53,69,0.2)' }}>
                    <CardContent>
                      <Image sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        Format
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        728 x 90 banners for maximum visibility. A must-have strategy for commercial property marketing.
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Stack>
            </Paper>

            {/* Why CommercialUK Section */}
            <Paper 
              variant="outlined" 
              sx={{ 
                p: { xs: 4, md: 6 }, 
                borderRadius: 4,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,250,250,0.98) 100%)',
                borderLeft: (t) => `6px solid ${t.palette.error.light}`,
                boxShadow: '0 4px 20px rgba(220,53,69,0.08)'
              }}
            >
              <Stack spacing={4}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Star sx={{ fontSize: 50, color: 'error.main' }} />
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 900,
                      color: 'text.primary',
                      fontSize: { xs: '1.75rem', md: '2.25rem' }
                    }}
                  >
                    Why CommercialUK?
                  </Typography>
                </Stack>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <CheckCircle sx={{ color: 'error.main', fontSize: 28, mt: 0.5 }} />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                        Reliable and Trusted Platform
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Dedicated to selling, renting, and leasing commercial property.
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <CheckCircle sx={{ color: 'error.main', fontSize: 28, mt: 0.5 }} />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                        Professional Network
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Used by professional commercial property agents nationwide.
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <HomeWork sx={{ color: 'error.main', fontSize: 28, mt: 0.5 }} />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                        Wide Coverage Including:
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CheckCircle sx={{ fontSize: 16, color: 'error.main' }} />
                          <Typography variant="body2">Office buildings</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CheckCircle sx={{ fontSize: 16, color: 'error.main' }} />
                          <Typography variant="body2">Retail units</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CheckCircle sx={{ fontSize: 16, color: 'error.main' }} />
                          <Typography variant="body2">Industrial units</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CheckCircle sx={{ fontSize: 16, color: 'error.main' }} />
                          <Typography variant="body2">Warehouse units</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CheckCircle sx={{ fontSize: 16, color: 'error.main' }} />
                          <Typography variant="body2">Restaurants</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CheckCircle sx={{ fontSize: 16, color: 'error.main' }} />
                          <Typography variant="body2">Coworking space</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                          <CheckCircle sx={{ fontSize: 16, color: 'error.main' }} />
                          <Typography variant="body2">Shops</Typography>
                        </Stack>
                      </Box>
                    </Box>
                  </Stack>
                  
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <TrendingUp sx={{ color: 'error.main', fontSize: 28, mt: 0.5 }} />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                        Expert Marketing Solutions
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Our platform is especially beneficial for those learning to market a commercial property for sale in the UK, offering:
                  </Typography>
                      <Stack spacing={0.5}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <TrendingUp sx={{ fontSize: 18, color: 'error.main' }} />
                          <Typography variant="body2">Expert advice</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <TrendingUp sx={{ fontSize: 18, color: 'error.main' }} />
                          <Typography variant="body2">Intelligent reach</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                          <TrendingUp sx={{ fontSize: 18, color: 'error.main' }} />
                          <Typography variant="body2">Professional optimisation</Typography>
                        </Stack>
                      </Stack>
                    </Box>
                </Stack>
                </Box>
              </Stack>
            </Paper>

            {/* Listing Enhancement Packages Section */}
            <Paper 
              variant="outlined" 
              sx={{ 
                p: { xs: 4, md: 6 }, 
                borderRadius: 4,
                background: 'linear-gradient(135deg, rgba(220,53,69,0.05) 0%, rgba(255,250,250,0.98) 100%)',
                borderLeft: (t) => `6px solid ${t.palette.error.main}`,
                boxShadow: '0 4px 20px rgba(220,53,69,0.1)'
              }}
            >
              <Stack spacing={4}>
                <Stack spacing={2} alignItems="center" textAlign="center">
                  <MilitaryTech sx={{ fontSize: 60, color: 'error.main' }} />
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 900,
                      color: 'text.primary',
                      fontSize: { xs: '1.75rem', md: '2.25rem' }
                    }}
                  >
                    Listing Enhancement Packages
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    HELP YOUR NEXT TENANT OR BUYER DISCOVER YOUR COMMERCIAL LISTING
                  </Typography>
                  <Typography variant="body1" sx={{ maxWidth: 700, color: 'text.secondary' }}>
                    At CommercialUK, we offer a range of powerful marketing solutions designed to give your property maximum visibility connecting you with the right tenant, buyer, or investor faster.
                  </Typography>
                </Stack>

                {/* Enhancement Packages Comparison Table */}
                <Box sx={{ overflow: 'auto' }}>
                  <TableContainer sx={{ borderRadius: 3, border: '2px solid rgba(220,53,69,0.2)', width: '100%' }}>
                    <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'rgba(220,53,69,0.1)' }}>
                          <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem', width: '35%' }}>LISTING FEATURES</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 900, fontSize: '1.2rem', color: 'error.main', width: '16.25%' }}>DIAMOND</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 700, fontSize: '1.1rem', width: '16.25%' }}>PLATINUM</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 700, fontSize: '1.1rem', width: '16.25%' }}>GOLD</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 700, fontSize: '1.1rem', width: '16.25%' }}>SILVER</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Search results placement</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 700, color: 'error.main' }}>1st</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 700 }}>2nd</TableCell>
                          <TableCell align="center">3rd</TableCell>
                          <TableCell align="center">4th</TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: 'rgba(220,53,69,0.05)' }}>
                          <TableCell sx={{ fontWeight: 600 }}>Property retargeting ads</TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: 'error.main' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: 'error.main' }} /></TableCell>
                          <TableCell align="center">-</TableCell>
                          <TableCell align="center">-</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Smart prospect match ads</TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: 'error.main' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: 'error.main' }} /></TableCell>
                          <TableCell align="center">-</TableCell>
                          <TableCell align="center">-</TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: 'rgba(220,53,69,0.05)' }}>
                          <TableCell sx={{ fontWeight: 600 }}>Contact upload audience ads</TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: 'error.main' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: 'error.main' }} /></TableCell>
                          <TableCell align="center">-</TableCell>
                          <TableCell align="center">-</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Premium branding on listing page</TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: 'error.main' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: 'error.main' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: 'error.main' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: 'error.main' }} /></TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: 'rgba(220,53,69,0.05)' }}>
                          <TableCell sx={{ fontWeight: 600 }}>Agent/Agency logo on search results</TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: 'error.main' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: 'error.main' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: 'error.main' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: 'error.main' }} /></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Call tracking</TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: 'error.main' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: 'error.main' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: 'error.main' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: 'error.main' }} /></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                {/* Media & Visual Marketing Table */}
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: 'error.main' }}>
                    Media & Visual Marketing
                  </Typography>
                  <TableContainer sx={{ borderRadius: 3, border: '2px solid rgba(220,53,69,0.2)', width: '100%' }}>
                    <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'rgba(220,53,69,0.1)' }}>
                          <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem', width: '35%' }}>FEATURE</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 900, fontSize: '1.2rem', color: 'error.main', width: '16.25%' }}>DIAMOND</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 700, fontSize: '1.1rem', width: '16.25%' }}>PLATINUM</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 700, fontSize: '1.1rem', width: '16.25%' }}>GOLD</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 700, fontSize: '1.1rem', width: '16.25%' }}>SILVER</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Professional photography</TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: 'error.main' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: 'error.main' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: 'error.main' }} /></TableCell>
                          <TableCell align="center">-</TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: 'rgba(220,53,69,0.05)' }}>
                          <TableCell sx={{ fontWeight: 600 }}>Matterport 3D tour</TableCell>
                          <TableCell align="center">✅ (up to 4)</TableCell>
                          <TableCell align="center">✅ (up to 2)</TableCell>
                          <TableCell align="center">✅ (up to 1)</TableCell>
                          <TableCell align="center">-</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>HD video tours</TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: 'error.main' }} /></TableCell>
                          <TableCell align="center">-</TableCell>
                          <TableCell align="center">-</TableCell>
                          <TableCell align="center">-</TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: 'rgba(220,53,69,0.05)' }}>
                          <TableCell sx={{ fontWeight: 600 }}>Aerial drone photography</TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: 'error.main' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: 'error.main' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: 'error.main' }} /></TableCell>
                          <TableCell align="center">-</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                {/* CTA Section */}
                <Box sx={{ mt: 4, p: 4, borderRadius: 3, bgcolor: 'rgba(220,53,69,0.08)', textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'error.main', mb: 2 }}>
                    GET SEEN WHERE SERIOUS COMMERCIAL PROPERTY SEARCHES HAPPEN
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 3, color: 'text.secondary' }}>
                    Every day, CommercialUK attracts thousands of active decision-makers looking for their next office, shop, industrial unit, development opportunity and more. With continuous visibility and intelligent targeting, your listing stays in front of the right audience, helping reduce time on market and increasing your chances of closing.
                </Typography>
                  <Button 
                    variant="contained" 
                    size="large"
                    sx={{ 
                      px: 4, 
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, rgba(220,53,69,1) 0%, rgba(244,67,54,1) 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, rgba(244,67,54,1) 0%, rgba(220,53,69,1) 100%)',
                      }
                    }}
                    startIcon={<Upload />}
                  >
                    Promote Your Property Now
                  </Button>
                </Box>
              </Stack>
            </Paper>

            {/* Final CTA */}
            <Paper
              variant="outlined"
              sx={{ 
                p: { xs: 5, md: 8 }, 
                borderRadius: 4, 
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(220,53,69,0.9) 0%, rgba(244,67,54,0.95) 100%)',
                color: 'common.white',
                borderLeft: '6px solid rgba(255,255,255,0.5)',
                boxShadow: '0 8px 30px rgba(220,53,69,0.3)'
              }}
            >
              <Stack spacing={3} alignItems="center">
                <Typography variant="h3" sx={{ fontWeight: 900, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
                  Promote Your Property on CommercialUK
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 400, maxWidth: 700, opacity: 0.95 }}>
                  Boost your property's visibility and reach motivated buyers, tenants, and investors across the UK. With targeted marketing and intelligent placement, we help you generate quality enquiries and secure deals faster.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mt: 2 }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    sx={{ 
                      px: 4, 
                      py: 1.5,
                      bgcolor: 'common.white',
                      color: 'error.main',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.9)',
                      }
                    }}
                    startIcon={<Upload />}
                  >
                    Get Started Today
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    sx={{ 
                      px: 4, 
                      py: 1.5,
                      borderColor: 'common.white',
                      color: 'common.white',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      '&:hover': {
                        borderColor: 'rgba(255,255,255,0.8)',
                        bgcolor: 'rgba(255,255,255,0.1)',
                      }
                    }}
                    startIcon={<MailOutline />}
                    href="mailto:info@commercialuk.com"
                  >
                    Contact Sales
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Stack>
          </Container>
      </Box>
    </Page>
  );
};

export default Advertise;


