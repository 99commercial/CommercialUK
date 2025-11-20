import React from 'react';
import { NextPage } from 'next';
import { Page } from '@/components';
import Head from 'next/head';
import {
  Box,
  Button,
  Chip,
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
  const titleFontFamily = "'Work Sans', sans-serif";
  const subtitleFontFamily = "'Lato', sans-serif";
  const bodyFontFamily = "'Source Serif 4', serif";

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Work+Sans:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
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
          background: 'linear-gradient(135deg, rgba(242, 197, 20,0.85) 0%, rgba(242, 197, 20,0.75) 100%), url(https://media.licdn.com/dms/image/sync/v2/D4E27AQGnKZLLS4OYxg/articleshare-shrink_800/B4EZnEl2MkKgAI-/0/1759939880096?e=2147483647&v=beta&t=5but-3c7uH5LbN4Z5RImrVDypZ-uglfZojfT8XpVHAU) center/cover no-repeat',
        }}
      >
        <Box sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4 } }}>
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Chip 
              label="Commercial Property Marketing" 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.25)', 
                color: 'black', 
                fontWeight: 700,
                fontSize: '0.875rem',
                py: 2.5,
                fontFamily: subtitleFontFamily,
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
                color: 'black',
                textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                fontSize: { xs: '2rem', md: '3rem' },
                fontFamily: titleFontFamily
              }}
            >
              Market a Property with CommercialUK
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                maxWidth: 900, 
                color: 'rgba(0, 0, 0, 0.95)',
                fontWeight: 400,
                lineHeight: 1.6,
                fontFamily: bodyFontFamily
              }}
            >
              Marketing commercial property in the UK can feel competitive, but CommercialUK makes it effortless. Booking your listing on our platform isn't just about visibility, it's about engaging serious purchasers, tenants, investors, landlords, and developers nationwide.
            </Typography>
          </Stack>
        </Box>
      </Box>

      {/* Main Content with Soft Red and White Gradient Background */}
      <Box 
        sx={{ 
          py: { xs: 6, md: 10 },
          background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,248,248,1) 50%, rgba(255,255,255,1) 100%)'
        }}
      >
        <Box sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4 } }}>
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
                  <Business sx={{ fontSize: 40, color: '#f2c514' }} />
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 900,
                      color: 'text.primary',
                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                    fontFamily: titleFontFamily
                    }}
                  >
                    About CommercialUK
                  </Typography>
                </Stack>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'text.secondary', fontFamily: bodyFontFamily }}>
                  Marketing commercial property in the UK can feel competitive, but CommercialUK makes it effortless. Booking your listing on our platform isn't just about visibility, it's about engaging serious purchasers, tenants, investors, landlords, and developers nationwide. Our platform is tailored for advertisers looking to effectively list, lease, or sell commercial property.
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'text.secondary', fontFamily: bodyFontFamily }}>
                  Whether you're an agent handling commercial property sale, warehouse units, office space, retail premises, or industrial buildings in the UK, CommercialUK gives you a friction-free, data-driven marketing system designed for targeted exposure.
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mt: 2 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <CheckCircle sx={{ color: '#f2c514', fontSize: 30 }} />
                    <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1.05rem', fontFamily: subtitleFontFamily }}>
                      Flexible invoicing for single listings
                </Typography>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <CheckCircle sx={{ color: '#f2c514', fontSize: 30 }} />
                    <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1.05rem', fontFamily: subtitleFontFamily }}>
                      Subscription for full portfolio
                    </Typography>
                  </Stack>
                </Box>
                <Box sx={{ mt: 3, p: 3, borderRadius: 2, bgcolor: 'rgba(242, 197, 20,0.05)' }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1, fontFamily: bodyFontFamily }}>
                    <strong>Get a quote today:</strong> email brochures to <strong>info@commercialuk.com</strong>, or log into your dashboard to add listings instantly.
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2, fontFamily: bodyFontFamily }}>
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
                background: 'linear-gradient(135deg, rgba(245, 245, 245, 0.98) 0%, rgba(250, 250, 250, 0.98) 100%)',
                borderLeft: (t) => `6px solid #f2c514`,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
              }}
            >
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr', lg: '1fr', xl: '1.3fr 1.5fr' }, gap: { xs: 4, xl: 6 }, alignItems: 'stretch', minHeight: '100%' }}>
                {/* Left Side - Rating Box and Visual Element */}
                <Box 
                  sx={{ 
                    display: { xs: 'flex', md: 'none', lg: 'none', xl: 'flex' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    width: '100%',
                    alignSelf: 'stretch',
                    padding: { xs: 0, xl: 3 },
                    minHeight: { xs: '300px', xl: '100%' }
                  }}
                >
                    <Box
                      component="img"
                      src="https://platform.vox.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/22383752/GettyImages_1268536478.jpg?quality=90&strip=all&crop=16.666666666667,0,66.666666666667,100"
                      alt="Professional service representative"
                      sx={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 5,
                      }}
                    />
                </Box>

                {/* Right Side - Content */}
                <Stack spacing={5}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <CheckCircle sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, color: '#f2c514' }} />
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 900,
                        color: '#000000',
                        fontSize: { xs: '1.75rem', md: '2.25rem' },
                        fontFamily: titleFontFamily
                      }}
                    >
                      What's Included
                    </Typography>
                  </Stack>
                  
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontSize: '1.05rem', 
                      lineHeight: 1.8, 
                      color: '#000000',
                      fontFamily: bodyFontFamily
                    }}
                  >
                    Comprehensive commercial property listing service designed to maximize your property's visibility and connect you with serious buyers, tenants, and investors across the UK.
                  </Typography>

                  {/* Two Column Features Grid */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, mt: 2 }}>
                    {/* Left Column */}
                    <Stack spacing={4}>
                      <Stack direction="row" spacing={3} alignItems="flex-start">
                        <Box 
                          sx={{ 
                            minWidth: 56,
                            height: 56,
                            borderRadius: '50%',
                            bgcolor: '#f2c514',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <Description sx={{ color: 'common.white', fontSize: 28 }} />
                        </Box>
                        <Box>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 700, 
                              color: '#000000',
                              mb: 1,
                              fontSize: { xs: '1.1rem', md: '1.2rem' },
                              fontFamily: subtitleFontFamily
                            }}
                          >
                            Detailed Listings
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#000000',
                              lineHeight: 1.7,
                              fontSize: { xs: '0.95rem', md: '1.05rem' },
                              fontFamily: bodyFontFamily
                            }}
                          >
                            Unrestricted text, PDF attachments, maps, and high-quality images for all types of commercial property for lease and commercial property listing service in the UK.
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={3} alignItems="flex-start">
                        <Box 
                          sx={{ 
                            minWidth: 56,
                            height: 56,
                            borderRadius: '50%',
                            bgcolor: '#f2c514',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <PhoneInTalk sx={{ color: 'common.white', fontSize: 28 }} />
                        </Box>
                        <Box>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 700, 
                              color: '#000000',
                              mb: 1,
                              fontSize: { xs: '1.1rem', md: '1.2rem' },
                              fontFamily: subtitleFontFamily
                            }}
                          >
                            Never Miss an Enquiry
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#000000',
                              lineHeight: 1.7,
                              fontSize: { xs: '0.95rem', md: '1.05rem' },
                              fontFamily: bodyFontFamily
                            }}
                          >
                            Monitored phone lines and email forwarding to ensure you capture every opportunity.
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={3} alignItems="flex-start">
                        <Box 
                          sx={{ 
                            minWidth: 56,
                            height: 56,
                            borderRadius: '50%',
                            bgcolor: '#f2c514',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <Analytics sx={{ color: 'common.white', fontSize: 28 }} />
                        </Box>
                        <Box>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 700, 
                              color: '#000000',
                              mb: 1,
                              fontSize: { xs: '1.1rem', md: '1.2rem' },
                              fontFamily: subtitleFontFamily
                            }}
                          >
                            Performance Monitoring
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#000000',
                              lineHeight: 1.7,
                              fontSize: { xs: '0.95rem', md: '1.05rem' },
                              fontFamily: bodyFontFamily
                            }}
                          >
                            Track enquiries, page views & brochure downloads to measure your listing's success.
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={3} alignItems="flex-start">
                        <Box 
                          sx={{ 
                            minWidth: 56,
                            height: 56,
                            borderRadius: '50%',
                            bgcolor: '#f2c514',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <SupportAgent sx={{ color: 'common.white', fontSize: 28 }} />
                        </Box>
                        <Box>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 700, 
                              color: '#000000',
                              mb: 1,
                              fontSize: { xs: '1.1rem', md: '1.2rem' },
                              fontFamily: subtitleFontFamily
                            }}
                          >
                            Committed Support
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#000000',
                              lineHeight: 1.7,
                              fontSize: { xs: '0.95rem', md: '1.05rem' },
                              fontFamily: bodyFontFamily
                            }}
                          >
                            Our experts ensure listings remain accurate and optimised for maximum visibility.
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={3} alignItems="flex-start">
                        <Box 
                          sx={{ 
                            minWidth: 56,
                            height: 56,
                            borderRadius: '50%',
                            bgcolor: '#f2c514',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <BrandingWatermark sx={{ color: 'common.white', fontSize: 28 }} />
                        </Box>
                        <Box>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 700, 
                              color: '#000000',
                              mb: 1,
                              fontSize: { xs: '1.1rem', md: '1.2rem' },
                              fontFamily: subtitleFontFamily
                            }}
                          >
                            Company Promotion
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#000000',
                              lineHeight: 1.7,
                              fontSize: { xs: '0.95rem', md: '1.05rem' },
                              fontFamily: bodyFontFamily
                            }}
                          >
                            Showcase agents in peak marketplace positions to build your brand presence.
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={3} alignItems="flex-start">
                        <Box 
                          sx={{ 
                            minWidth: 56,
                            height: 56,
                            borderRadius: '50%',
                            bgcolor: '#f2c514',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <Business sx={{ color: 'common.white', fontSize: 28 }} />
                        </Box>
                        <Box>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 700, 
                              color: '#000000',
                              mb: 1,
                              fontSize: { xs: '1.1rem', md: '1.2rem' },
                              fontFamily: subtitleFontFamily
                            }}
                          >
                            Commercial Only
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#000000',
                              lineHeight: 1.7,
                              fontSize: { xs: '0.95rem', md: '1.05rem' },
                              fontFamily: bodyFontFamily
                            }}
                          >
                            Offices, retail space, industrial, warehouses, restaurants, coworking, and small commercial properties for sale.
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>

                    {/* Right Column */}
                    <Stack spacing={4}>
                      <Stack direction="row" spacing={3} alignItems="flex-start">
                        <Box 
                          sx={{ 
                            minWidth: 56,
                            height: 56,
                            borderRadius: '50%',
                            bgcolor: '#f2c514',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <HomeWork sx={{ color: 'common.white', fontSize: 28 }} />
                        </Box>
                        <Box>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 700, 
                              color: '#000000',
                              mb: 1,
                              fontSize: { xs: '1.1rem', md: '1.2rem' },
                              fontFamily: subtitleFontFamily
                            }}
                          >
                            Mobile Responsive Platform
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#000000',
                              lineHeight: 1.7,
                              fontSize: { xs: '0.95rem', md: '1.05rem' },
                              fontFamily: bodyFontFamily
                            }}
                          >
                            Easy browsing for buyers, tenants, investors on any device.
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={3} alignItems="flex-start">
                        <Box 
                          sx={{ 
                            minWidth: 56,
                            height: 56,
                            borderRadius: '50%',
                            bgcolor: '#f2c514',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <Email sx={{ color: 'common.white', fontSize: 28 }} />
                        </Box>
                        <Box>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 700, 
                              color: '#000000',
                              mb: 1,
                              fontSize: { xs: '1.1rem', md: '1.2rem' },
                              fontFamily: subtitleFontFamily
                            }}
                          >
                            Intelligent Marketing
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#000000',
                              lineHeight: 1.7,
                              fontSize: { xs: '0.95rem', md: '1.05rem' },
                              fontFamily: bodyFontFamily
                            }}
                          >
                            New & updated listings emailed directly to active occupiers searching business property to rent near me or commercial property investment UK opportunities.
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={3} alignItems="flex-start">
                        <Box 
                          sx={{ 
                            minWidth: 56,
                            height: 56,
                            borderRadius: '50%',
                            bgcolor: '#f2c514',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <Link sx={{ color: 'common.white', fontSize: 28 }} />
                        </Box>
                        <Box>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 700, 
                              color: '#000000',
                              mb: 1,
                              fontSize: { xs: '1.1rem', md: '1.2rem' },
                              fontFamily: subtitleFontFamily
                            }}
                          >
                            Data Feed Support
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#000000',
                              lineHeight: 1.7,
                              fontSize: { xs: '0.95rem', md: '1.05rem' },
                              fontFamily: bodyFontFamily
                            }}
                          >
                            Ideal for commercial real estate agencies in the UK portfolios with seamless integration.
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={3} alignItems="flex-start">
                        <Box 
                          sx={{ 
                            minWidth: 56,
                            height: 56,
                            borderRadius: '50%',
                            bgcolor: '#f2c514',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <Assessment sx={{ color: 'common.white', fontSize: 28 }} />
                        </Box>
                        <Box>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 700, 
                              color: '#000000',
                              mb: 1,
                              fontSize: { xs: '1.1rem', md: '1.2rem' },
                              fontFamily: subtitleFontFamily
                            }}
                          >
                            Advanced Reporting
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#000000',
                              lineHeight: 1.7,
                              fontSize: { xs: '0.95rem', md: '1.05rem' },
                              fontFamily: bodyFontFamily
                            }}
                          >
                            Export data to Excel, PDF, or Word for presentations and analysis.
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={3} alignItems="flex-start">
                        <Box 
                          sx={{ 
                            minWidth: 56,
                            height: 56,
                            borderRadius: '50%',
                            bgcolor: '#f2c514',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <Campaign sx={{ color: 'common.white', fontSize: 28 }} />
                        </Box>
                        <Box>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 700, 
                              color: '#000000',
                              mb: 1,
                              fontSize: { xs: '1.1rem', md: '1.2rem' },
                              fontFamily: subtitleFontFamily
                            }}
                          >
                            Extra Marketing
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#000000',
                              lineHeight: 1.7,
                              fontSize: { xs: '0.95rem', md: '1.05rem' },
                              fontFamily: bodyFontFamily
                            }}
                          >
                            Newsletters, social advertising, regional highlighting to maximize your reach.
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </Paper>

            {/* Banner Advertising Section */}
            <Paper 
              variant="outlined" 
              sx={{ 
                p: { xs: 4, md: 6 }, 
                borderRadius: 4,
                background: 'linear-gradient(135deg, rgba(242, 197, 20,0.05) 0%, rgba(255,250,250,0.98) 100%)',
                borderLeft: (t) => `6px solid #f2c514`,
                boxShadow: '0 4px 20px rgba(242, 197, 20,0.1)'
              }}
            >
              <Stack spacing={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Campaign sx={{ fontSize: 50, color: '#f2c514' }} />
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 900,
                      color: 'text.primary',
                      fontSize: { xs: '1.75rem', md: '2.25rem' },
                      fontFamily: titleFontFamily
                    }}
                  >
                    Banner Advertising
                  </Typography>
                </Stack>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'text.secondary', fontFamily: bodyFontFamily }}>
                  Boost visibility for warehouse rental UK, shops to let UK, office premises, or commercial real estate marketing specialists UK portfolios with highly targeted banner placements. Your ad appears on high-traffic commercial pages viewed by thousands of active buyers and tenants.
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mt: 2 }}>
                  <Card sx={{ width: '100%', bgcolor: 'rgba(255,255,255,0.8)', border: '2px solid rgba(242, 197, 20,0.2)' }}>
                    <CardContent>
                      <Map sx={{ fontSize: 40, color: '#f2c514', mb: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontFamily: subtitleFontFamily }}>
                        Targeting Options
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: bodyFontFamily }}>
                        By area and by property type (office premises for rent UK, industrial units, retail shops).
                      </Typography>
                    </CardContent>
                  </Card>
                  
                  <Card sx={{ width: '100%', bgcolor: 'rgba(255,255,255,0.8)', border: '2px solid rgba(242, 197, 20,0.2)' }}>
                    <CardContent>
                      <PriceCheck sx={{ fontSize: 40, color: '#f2c514', mb: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontFamily: subtitleFontFamily }}>
                        Pricing
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: bodyFontFamily }}>
                        £35 per 1,000 impressions (min. £350). Bulk discounts available.
                      </Typography>
                    </CardContent>
                  </Card>
                  
                  <Card sx={{ width: '100%', bgcolor: 'rgba(255,255,255,0.8)', border: '2px solid rgba(242, 197, 20,0.2)' }}>
                    <CardContent>
                      <Image sx={{ fontSize: 40, color: '#f2c514', mb: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontFamily: subtitleFontFamily }}>
                        Format
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: bodyFontFamily }}>
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
                borderLeft: (t) => `6px solid #f9d85a`,
                boxShadow: '0 4px 20px rgba(242, 197, 20,0.08)'
              }}
            >
              <Stack spacing={4}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Star sx={{ fontSize: 50, color: '#f2c514' }} />
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 900,
                      color: 'text.primary',
                      fontSize: { xs: '1.75rem', md: '2.25rem' },
                      fontFamily: titleFontFamily
                    }}
                  >
                    Why CommercialUK?
                  </Typography>
                </Stack>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <CheckCircle sx={{ color: '#f2c514', fontSize: 28, mt: 0.5 }} />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, fontFamily: subtitleFontFamily }}>
                        Reliable and Trusted Platform
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: bodyFontFamily }}>
                        Dedicated to selling, renting, and leasing commercial property.
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <CheckCircle sx={{ color: '#f2c514', fontSize: 28, mt: 0.5 }} />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, fontFamily: subtitleFontFamily }}>
                        Professional Network
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: bodyFontFamily }}>
                        Used by professional commercial property agents nationwide.
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <HomeWork sx={{ color: '#f2c514', fontSize: 28, mt: 0.5 }} />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, fontFamily: subtitleFontFamily }}>
                        Wide Coverage Including:
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CheckCircle sx={{ fontSize: 16, color: '#f2c514' }} />
                          <Typography variant="body2" sx={{ fontFamily: bodyFontFamily }}>Office buildings</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CheckCircle sx={{ fontSize: 16, color: '#f2c514' }} />
                          <Typography variant="body2" sx={{ fontFamily: bodyFontFamily }}>Retail units</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CheckCircle sx={{ fontSize: 16, color: '#f2c514' }} />
                          <Typography variant="body2" sx={{ fontFamily: bodyFontFamily }}>Industrial units</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CheckCircle sx={{ fontSize: 16, color: '#f2c514' }} />
                          <Typography variant="body2" sx={{ fontFamily: bodyFontFamily }}>Warehouse units</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CheckCircle sx={{ fontSize: 16, color: '#f2c514' }} />
                          <Typography variant="body2" sx={{ fontFamily: bodyFontFamily }}>Restaurants</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CheckCircle sx={{ fontSize: 16, color: '#f2c514' }} />
                          <Typography variant="body2" sx={{ fontFamily: bodyFontFamily }}>Coworking space</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                          <CheckCircle sx={{ fontSize: 16, color: '#f2c514' }} />
                          <Typography variant="body2" sx={{ fontFamily: bodyFontFamily }}>Shops</Typography>
                        </Stack>
                      </Box>
                    </Box>
                  </Stack>
                  
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <TrendingUp sx={{ color: '#f2c514', fontSize: 28, mt: 0.5 }} />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, fontFamily: subtitleFontFamily }}>
                        Expert Marketing Solutions
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph sx={{ fontFamily: bodyFontFamily }}>
                        Our platform is especially beneficial for those learning to market a commercial property for sale in the UK, offering:
                  </Typography>
                      <Stack spacing={0.5}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <TrendingUp sx={{ fontSize: 18, color: '#f2c514' }} />
                          <Typography variant="body2" sx={{ fontFamily: bodyFontFamily }}>Expert advice</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <TrendingUp sx={{ fontSize: 18, color: '#f2c514' }} />
                          <Typography variant="body2" sx={{ fontFamily: bodyFontFamily }}>Intelligent reach</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                          <TrendingUp sx={{ fontSize: 18, color: '#f2c514' }} />
                          <Typography variant="body2" sx={{ fontFamily: bodyFontFamily }}>Professional optimisation</Typography>
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
                background: 'linear-gradient(135deg, rgba(242, 197, 20,0.05) 0%, rgba(255,250,250,0.98) 100%)',
                borderLeft: (t) => `6px solid #f2c514`,
                boxShadow: '0 4px 20px rgba(242, 197, 20,0.1)'
              }}
            >
              <Stack spacing={4}>
                <Stack spacing={2} alignItems="center" textAlign="center">
                  <MilitaryTech sx={{ fontSize: 60, color: '#f2c514' }} />
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 900,
                      color: 'text.primary',
                      fontSize: { xs: '1.75rem', md: '2.25rem' },
                      fontFamily: titleFontFamily
                    }}
                  >
                    Listing Enhancement Packages
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500, fontFamily: subtitleFontFamily }}>
                    HELP YOUR NEXT TENANT OR BUYER DISCOVER YOUR COMMERCIAL LISTING
                  </Typography>
                  <Typography variant="body1" sx={{ maxWidth: 700, color: 'text.secondary', fontFamily: bodyFontFamily }}>
                    At CommercialUK, we offer a range of powerful marketing solutions designed to give your property maximum visibility connecting you with the right tenant, buyer, or investor faster.
                  </Typography>
                </Stack>

                {/* Enhancement Packages Comparison Table */}
                <Box sx={{ overflow: 'auto' }}>
                  <TableContainer sx={{ borderRadius: 3, border: '2px solid rgba(242, 197, 20,0.2)', width: '100%' }}>
                    <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'rgba(242, 197, 20,0.1)' }}>
                          <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem', width: '35%', fontFamily: subtitleFontFamily }}>LISTING FEATURES</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 900, fontSize: '1.2rem', color: '#f2c514', width: '16.25%', fontFamily: titleFontFamily }}>DIAMOND</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 700, fontSize: '1.1rem', width: '16.25%', fontFamily: subtitleFontFamily }}>PLATINUM</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 700, fontSize: '1.1rem', width: '16.25%', fontFamily: subtitleFontFamily }}>GOLD</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 700, fontSize: '1.1rem', width: '16.25%', fontFamily: subtitleFontFamily }}>SILVER</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600, fontFamily: subtitleFontFamily }}>Search results placement</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 700, color: '#f2c514', fontFamily: subtitleFontFamily }}>1st</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 700, fontFamily: subtitleFontFamily }}>2nd</TableCell>
                          <TableCell align="center" sx={{ fontFamily: bodyFontFamily }}>3rd</TableCell>
                          <TableCell align="center" sx={{ fontFamily: bodyFontFamily }}>4th</TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: 'rgba(242, 197, 20,0.05)' }}>
                          <TableCell sx={{ fontWeight: 600, fontFamily: subtitleFontFamily }}>Property retargeting ads</TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: '#f2c514' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: '#f2c514' }} /></TableCell>
                          <TableCell align="center">-</TableCell>
                          <TableCell align="center">-</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600, fontFamily: subtitleFontFamily }}>Smart prospect match ads</TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: '#f2c514' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: '#f2c514' }} /></TableCell>
                          <TableCell align="center">-</TableCell>
                          <TableCell align="center">-</TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: 'rgba(242, 197, 20,0.05)' }}>
                          <TableCell sx={{ fontWeight: 600, fontFamily: subtitleFontFamily }}>Contact upload audience ads</TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: '#f2c514' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: '#f2c514' }} /></TableCell>
                          <TableCell align="center">-</TableCell>
                          <TableCell align="center">-</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600, fontFamily: subtitleFontFamily }}>Premium branding on listing page</TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: '#f2c514' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: '#f2c514' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: '#f2c514' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: '#f2c514' }} /></TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: 'rgba(242, 197, 20,0.05)' }}>
                          <TableCell sx={{ fontWeight: 600, fontFamily: subtitleFontFamily }}>Agent/Agency logo on search results</TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: '#f2c514' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: '#f2c514' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: '#f2c514' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: '#f2c514' }} /></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600, fontFamily: subtitleFontFamily }}>Call tracking</TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: '#f2c514' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: '#f2c514' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: '#f2c514' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: '#f2c514' }} /></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                {/* Media & Visual Marketing Table */}
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: '#f2c514', fontFamily: titleFontFamily }}>
                    Media & Visual Marketing
                  </Typography>
                  <TableContainer sx={{ borderRadius: 3, border: '2px solid rgba(242, 197, 20,0.2)', width: '100%' }}>
                    <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'rgba(242, 197, 20,0.1)' }}>
                          <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem', width: '35%', fontFamily: subtitleFontFamily }}>FEATURE</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 900, fontSize: '1.2rem', color: '#f2c514', width: '16.25%', fontFamily: titleFontFamily }}>DIAMOND</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 700, fontSize: '1.1rem', width: '16.25%', fontFamily: subtitleFontFamily }}>PLATINUM</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 700, fontSize: '1.1rem', width: '16.25%', fontFamily: subtitleFontFamily }}>GOLD</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 700, fontSize: '1.1rem', width: '16.25%', fontFamily: subtitleFontFamily }}>SILVER</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600, fontFamily: subtitleFontFamily }}>Professional photography</TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: '#f2c514' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: '#f2c514' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: '#f2c514' }} /></TableCell>
                          <TableCell align="center">-</TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: 'rgba(242, 197, 20,0.05)' }}>
                          <TableCell sx={{ fontWeight: 600, fontFamily: subtitleFontFamily }}>Matterport 3D tour</TableCell>
                          <TableCell align="center" sx={{ fontFamily: bodyFontFamily }}>✅ (up to 4)</TableCell>
                          <TableCell align="center" sx={{ fontFamily: bodyFontFamily }}>✅ (up to 2)</TableCell>
                          <TableCell align="center" sx={{ fontFamily: bodyFontFamily }}>✅ (up to 1)</TableCell>
                          <TableCell align="center" sx={{ fontFamily: bodyFontFamily }}>-</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600, fontFamily: subtitleFontFamily }}>HD video tours</TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: '#f2c514' }} /></TableCell>
                          <TableCell align="center">-</TableCell>
                          <TableCell align="center">-</TableCell>
                          <TableCell align="center">-</TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: 'rgba(242, 197, 20,0.05)' }}>
                          <TableCell sx={{ fontWeight: 600, fontFamily: subtitleFontFamily }}>Aerial drone photography</TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: '#f2c514' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: '#f2c514' }} /></TableCell>
                          <TableCell align="center"><CheckCircle sx={{ color: '#f2c514' }} /></TableCell>
                          <TableCell align="center">-</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                {/* CTA Section */}
                <Box sx={{ mt: 4, p: 4, borderRadius: 3, bgcolor: 'rgba(242, 197, 20,0.08)', textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#f2c514', mb: 2, fontFamily: titleFontFamily }}>
                    GET SEEN WHERE SERIOUS COMMERCIAL PROPERTY SEARCHES HAPPEN
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 3, color: 'text.secondary', fontFamily: bodyFontFamily }}>
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
                      fontFamily: subtitleFontFamily,
                      background: 'linear-gradient(135deg, rgba(242, 197, 20,1) 0%, rgba(242, 197, 20,1) 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, rgba(242, 197, 20,1) 0%, rgba(242, 197, 20,1) 100%)',
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
                background: 'linear-gradient(135deg, rgba(242, 197, 20,0.9) 0%, rgba(242, 197, 20,0.95) 100%)',
                color: 'common.white',
                borderLeft: '6px solid rgba(255,255,255,0.5)',
                boxShadow: '0 8px 30px rgba(242, 197, 20,0.3)'
              }}
            >
              <Stack spacing={3} alignItems="center">
                <Typography variant="h3" sx={{ fontWeight: 900, fontSize: { xs: '1.75rem', md: '2.5rem' }, fontFamily: titleFontFamily }}>
                  Promote Your Property on CommercialUK
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 400, maxWidth: 700, opacity: 0.95, fontFamily: bodyFontFamily }}>
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
                      color: '#f2c514',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      fontFamily: subtitleFontFamily,
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
                      fontFamily: subtitleFontFamily,
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
        </Box>
      </Box>
    </Page>
    </>
  );
};

export default Advertise;


