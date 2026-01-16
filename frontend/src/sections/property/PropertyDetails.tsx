import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  LocationOn as LocationOnIcon,
  SquareFoot as SquareFootIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  Download as DownloadIcon,
  PlayArrow as PlayArrowIcon,
  Description as DescriptionIcon,
  VideoLibrary as VideoLibraryIcon,
  CheckCircle as CheckCircleIcon,
  AttachMoney as AttachMoneyIcon,
  Sell as SellIcon,
  Map as MapIcon,
  VerifiedUser as VerifiedUserIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Receipt as ReceiptIcon,
  Assessment as AssessmentIcon,
  LocalTaxi as LocalTaxiIcon,
  EnergySavingsLeaf as EcoIcon,
} from '@mui/icons-material';
import { Property } from '../../components/PropertyCard';

// ----------------------------------------------------------------------

const MainContent = styled(Box)(({ theme }) => ({
  flex: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  width: '100%',
}));

const PropertyCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e0e0e0',
}));

const FeatureItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 0),
}));

// ----------------------------------------------------------------------

interface PropertyDetailsProps {
  property: Property;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property }) => {
  // Format size
  const formatSize = () => {
    if (property?.general_details) {
      const { size_minimum, size_maximum } = property.general_details;
      if (size_minimum === size_maximum) {
        return `${size_minimum} sq ft`;
      }
      return `${size_minimum} - ${size_maximum} sq ft`;
    }
    return '';
  };

  // Check if documents exist and have items
  const hasDocuments = property.documents_id?.documents && property.documents_id.documents.length > 0;
  
  // Check if virtual tours exist and have items
  const hasVirtualTours = property.virtual_tours_id?.virtual_tours && property.virtual_tours_id.virtual_tours.length > 0;
  
  // Check if descriptions exist and have any content
  const hasDescriptions = property.descriptions_id && (
    property.descriptions_id.general ||
    property.descriptions_id.location ||
    property.descriptions_id.accommodation ||
    property.descriptions_id.terms ||
    property.descriptions_id.specifications
  );
  
  // Check if sale types exist and have items
  const hasSaleTypes = property.sale_types_id?.sale_types && property.sale_types_id.sale_types.length > 0;
  
  // Check if location exists
  const hasLocation = property.location_id;
  
  // Check if business details exist
  const hasBusinessDetails = property.council_tax || property.planning || property.business_rates_id || property.epc;
  
  // Check if features exist and have any enabled features
  const hasFeatures = property.features_id && (
    Object.entries(property.features_id.features || {}).some(([key, value]) => value === 'Yes') ||
    (property.features_id.additional_features && property.features_id.additional_features.some(feature => feature.feature_value === 'Yes'))
  );

  return (
    <MainContent>
      {/* Property Details */}
      {property.general_details && (
        <PropertyCard>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                mb: 4,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: { xs: '1.5rem', md: '1.75rem' },
                letterSpacing: '-0.02em',
                color: '#1a1a1a',
                borderBottom: '2px solid #f2c514',
                paddingBottom: 2
              }}
            >
              Property Details
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                {property.general_details.address && (
                  <Box sx={{ 
                    flex: 1,
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e8e8e8',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      transform: 'translateY(-2px)',
                      borderColor: '#f2c514'
                    }
                  }}>
                    <FeatureItem>
                      <LocationOnIcon sx={{ color: '#f2c514', fontSize: 28 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#666',
                            fontSize: '0.8125rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            fontWeight: 600,
                            mb: 1,
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                          }}
                        >
                          Address
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: 600,
                            fontSize: '1.0625rem',
                            color: '#1a1a1a',
                            mb: 0.5,
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            lineHeight: 1.5
                          }}
                        >
                          {property.general_details.address}
                        </Typography>
                        {(property.general_details.town_city || property.general_details.postcode) && (
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: 400,
                              fontSize: '1rem',
                              color: '#555',
                              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                              lineHeight: 1.5
                            }}
                          >
                            {property.general_details.town_city}{property.general_details.town_city && property.general_details.postcode ? ', ' : ''}{property.general_details.postcode}
                          </Typography>
                        )}
                      </Box>
                    </FeatureItem>
                  </Box>
                )}
                
                {formatSize() && (
                  <Box sx={{ 
                    flex: 1,
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e8e8e8',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      transform: 'translateY(-2px)',
                      borderColor: '#f2c514'
                    }
                  }}>
                    <FeatureItem>
                      <SquareFootIcon sx={{ color: '#f2c514', fontSize: 28 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#666',
                            fontSize: '0.8125rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            fontWeight: 600,
                            mb: 1,
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                          }}
                        >
                          Size
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: 600,
                            fontSize: '1.0625rem',
                            color: '#1a1a1a',
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            lineHeight: 1.5
                          }}
                        >
                          {formatSize()}
                        </Typography>
                      </Box>
                    </FeatureItem>
                  </Box>
                )}
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                {property.general_details.approximate_year_of_construction && (
              <Box sx={{ 
                    flex: 1,
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e8e8e8',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    transform: 'translateY(-2px)',
                      borderColor: '#f2c514'
                    }
                  }}>
                    <FeatureItem>
                      <CalendarIcon sx={{ color: '#f2c514', fontSize: 28 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="body2" 
                        sx={{ 
                            color: '#666',
                            fontSize: '0.8125rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            fontWeight: 600,
                            mb: 1,
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                          }}
                        >
                          Year Built
                      </Typography>
                        <Typography 
                          variant="body1" 
                      sx={{
                            fontWeight: 600,
                            fontSize: '1.0625rem',
                            color: '#1a1a1a',
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            lineHeight: 1.5
                          }}
                        >
                          {property.general_details.approximate_year_of_construction}
                        </Typography>
                  </Box>
                    </FeatureItem>
              </Box>
            )}
                
                {property.general_details.property_type && (
              <Box sx={{ 
                    flex: 1,
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e8e8e8',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    transform: 'translateY(-2px)',
                      borderColor: '#f2c514'
                    }
                  }}>
                    <FeatureItem>
                      <BusinessIcon sx={{ color: '#f2c514', fontSize: 28 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="body2" 
                        sx={{ 
                            color: '#666',
                            fontSize: '0.8125rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            fontWeight: 600,
                            mb: 1,
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                          }}
                        >
                          Property Type
                      </Typography>
                        <Typography 
                          variant="body1" 
                      sx={{
                            fontWeight: 600,
                            fontSize: '1.0625rem',
                            color: '#1a1a1a',
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            lineHeight: 1.5
                          }}
                        >
                          {property.general_details.property_type}
                        </Typography>
                  </Box>
                    </FeatureItem>
              </Box>
            )}
              </Box>
            </Box>
          </CardContent>
        </PropertyCard>
      )}

      {/* Description */}
      {hasDescriptions && (
        <PropertyCard>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                mb: 4,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: { xs: '1.5rem', md: '1.75rem' },
                letterSpacing: '-0.02em',
                color: '#1a1a1a',
                borderBottom: '2px solid #f2c514',
                paddingBottom: 2
              }}
            >
              Property Overview
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* General Description - Main Overview */}
                {property.descriptions_id.general && (
                      <Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      fontSize: { xs: '1rem', md: '1.0625rem' },
                      lineHeight: 1.8, 
                      color: '#333',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      hyphens: 'auto',
                      fontWeight: 400,
                      letterSpacing: '0.01em'
                    }}
                  >
                      {property.descriptions_id.general}
                    </Typography>
                  </Box>
                )}
                
              {/* Other Descriptions */}
              {(property.descriptions_id.location || property.descriptions_id.accommodation || property.descriptions_id.terms || property.descriptions_id.specifications) && (
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: '1fr', md: 'repeat(2, 1fr)' },
                  gap: 3,
                  width: '100%'
                }}>
                {property.descriptions_id.location && (
                  <Box sx={{ 
                      p: 3,
                      border: '1px solid #e8e8e8',
                    borderRadius: 2,
                    backgroundColor: '#ffffff',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                        borderColor: '#f2c514'
                      }
                    }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600, 
                          mb: 2, 
                          color: '#1a1a1a',
                          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                          fontSize: '1.0625rem'
                        }}
                      >
                      Location Description
                    </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                          lineHeight: 1.7, 
                      color: '#555',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                          fontSize: '1rem'
                        }}
                      >
                      {property.descriptions_id.location}
                    </Typography>
                  </Box>
                )}
                
                {property.descriptions_id.accommodation && (
                  <Box sx={{ 
                      p: 3,
                      border: '1px solid #e8e8e8',
                    borderRadius: 2,
                    backgroundColor: '#ffffff',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                        borderColor: '#f2c514'
                      }
                    }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600, 
                          mb: 2, 
                          color: '#1a1a1a',
                          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                          fontSize: '1.0625rem'
                        }}
                      >
                      Accommodation Details
                    </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                          lineHeight: 1.7, 
                      color: '#555',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                          fontSize: '1rem'
                        }}
                      >
                      {property.descriptions_id.accommodation}
                    </Typography>
                  </Box>
                )}
                
                {property.descriptions_id.terms && (
                  <Box sx={{ 
                      p: 3,
                      border: '1px solid #e8e8e8',
                    borderRadius: 2,
                    backgroundColor: '#ffffff',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                        borderColor: '#f2c514'
                      }
                    }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600, 
                          mb: 2, 
                          color: '#1a1a1a',
                          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                          fontSize: '1.0625rem'
                        }}
                      >
                      Terms & Conditions
                    </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                          lineHeight: 1.7, 
                      color: '#555',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                          fontSize: '1rem'
                        }}
                      >
                      {property.descriptions_id.terms}
                    </Typography>
                  </Box>
                )}
                
                {property.descriptions_id.specifications && (
                  <Box sx={{ 
                      p: 3,
                      border: '1px solid #e8e8e8',
                    borderRadius: 2,
                    backgroundColor: '#ffffff',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                        borderColor: '#f2c514'
                      }
                    }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600, 
                          mb: 2, 
                          color: '#1a1a1a',
                          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                          fontSize: '1.0625rem'
                        }}
                      >
                      Specifications
                    </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                          lineHeight: 1.7, 
                      color: '#555',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                          fontSize: '1rem'
                        }}
                      >
                      {property.descriptions_id.specifications}
                    </Typography>
                  </Box>
                )}
                  </Box>
                )}
                
              {/* Features & Amenities - Two Column Bullet List */}
              {hasFeatures && (
                <Box sx={{ mt: 2 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700,
                      mb: 3,
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                      letterSpacing: '-0.01em',
                      color: '#1a1a1a'
                    }}
                  >
                    Features & Amenities
                  </Typography>
                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                    gap: { xs: 2, md: 3 },
                    columnGap: { xs: 2, md: 4 }
                  }}>
                    {/* Main Features */}
                    {Object.entries(property.features_id.features || {})
                      .filter(([key, value]) => value === 'Yes')
                      .map(([key, value], index) => {
                        const featureName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        
                        return (
                          <Box 
                            key={key}
                            sx={{ 
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 1.5,
                              py: 0.5
                            }}
                          >
                            <CheckCircleIcon 
                              sx={{ 
                                color: '#f2c514',
                                fontSize: 20,
                                mt: 0.25,
                                flexShrink: 0
                              }} 
                            />
                            <Typography 
                              variant="body1"
                              sx={{
                                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                                fontSize: '1rem',
                                color: '#333',
                                fontWeight: 400,
                                lineHeight: 1.6,
                                flex: 1
                              }}
                            >
                              {featureName}
                    </Typography>
                          </Box>
                        );
                      })}
                    
                    {/* Additional Features */}
                    {property.features_id.additional_features?.filter(feature => feature.feature_value === 'Yes').map((feature) => {
                      return (
                        <Box 
                          key={feature._id}
                          sx={{ 
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1.5,
                            py: 0.5
                          }}
                        >
                          <CheckCircleIcon 
                            sx={{ 
                              color: '#f2c514',
                              fontSize: 20,
                              mt: 0.25,
                              flexShrink: 0
                            }} 
                          />
                          <Typography 
                            variant="body1"
                            sx={{
                              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                              fontSize: '1rem',
                              color: '#333',
                              fontWeight: 400,
                              lineHeight: 1.6,
                              flex: 1
                            }}
                          >
                            {feature.feature_name}
                    </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                  </Box>
                )}
              </Box>
          </CardContent>
        </PropertyCard>
      )}

      {/* Sale Types */}
      {hasSaleTypes && (
        <PropertyCard>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <SellIcon sx={{ color: '#f2c514', fontSize: 32 }} />
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: { xs: '1.5rem', md: '1.75rem' },
                  letterSpacing: '-0.02em',
                  color: '#1a1a1a',
                  borderBottom: '2px solid #f2c514',
                  paddingBottom: 2,
                  flex: 1
                }}
              >
              Sale Types & Pricing
            </Typography>
            </Box>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 3,
              width: '100%'
            }}>
              {property.sale_types_id.sale_types.map((saleType, index) => (
                <Box 
                  key={saleType._id || index} 
                  sx={{ 
                    position: 'relative',
                    p: 3.5,
                    border: '2px solid #e8e8e8',
                  borderRadius: 3,
                  backgroundColor: '#ffffff',
                  width: '100%',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                      boxShadow: '0 8px 24px rgba(242, 197, 20, 0.15)',
                      transform: 'translateY(-4px)',
                      borderColor: '#f2c514'
                    }
                  }}
                >
                  {/* Accent Bar */}
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(90deg, #f2c514 0%, #f5d547 100%)',
                  }} />
                  
                  {/* Sale Type Badge */}
                  <Box sx={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 2.5,
                    px: 2,
                    py: 0.75,
                    borderRadius: 2,
                    backgroundColor: 'rgba(242, 197, 20, 0.1)',
                    border: '1px solid rgba(242, 197, 20, 0.2)'
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                        fontWeight: 600,
                        color: '#1a1a1a',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                      }}
                    >
                        {saleType.sale_type}
                      </Typography>
                    </Box>

                  {/* Price Display */}
                  <Box sx={{ mb: 2 }}>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                        fontWeight: 700, 
                        color: '#1a1a1a',
                        lineHeight: 1.1,
                        fontSize: { xs: '1.75rem', md: '2rem' },
                        mb: 0.5,
                        letterSpacing: '-0.02em'
                      }}
                    >
                      {saleType.price_currency === 'GBP' ? '£' : saleType.price_currency}{saleType.price_value.toLocaleString()}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                        color: '#666',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      <Box 
                        component="span"
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: '#f2c514',
                          display: 'inline-block'
                        }}
                      />
                      {saleType.price_unit}
                      </Typography>
                    </Box>

                  {/* Decorative Element */}
                  <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 80,
                    height: 80,
                    background: 'linear-gradient(135deg, rgba(242, 197, 20, 0.05) 0%, transparent 100%)',
                    borderRadius: '50% 0 0 0',
                    pointerEvents: 'none'
                  }} />
                </Box>
              ))}
            </Box>
          </CardContent>
        </PropertyCard>
      )}

       {/* Location & Map */}
       {hasLocation && (
         <>
         <PropertyCard>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                 <MapIcon sx={{ color: '#f2c514', fontSize: 32 }} />
                 <Typography 
                   variant="h4" 
                   sx={{ 
                     fontWeight: 700, 
                     fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                     fontSize: { xs: '1.5rem', md: '1.75rem' },
                     letterSpacing: '-0.02em',
                     color: '#1a1a1a',
                     borderBottom: '2px solid #f2c514',
                     paddingBottom: 2,
                     flex: 1
                   }}
                 >
               Location & Map
             </Typography>
               </Box>
               
             <Box sx={{ 
               display: 'flex', 
               flexDirection: 'column',
               gap: 3,
               width: '100%'
             }}>
               {/* Address Details */}
               <Box sx={{ 
                   p: 3.5,
                   border: '2px solid #e8e8e8',
                 borderRadius: 3,
                 backgroundColor: '#ffffff',
                 width: '100%',
                 overflow: 'hidden',
                 boxSizing: 'border-box',
                   boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                   transition: 'all 0.3s ease',
                   position: 'relative',
                   '&:hover': {
                     boxShadow: '0 4px 16px rgba(242, 197, 20, 0.12)',
                     borderColor: '#f2c514'
                   }
                 }}>
                   <Box sx={{
                     position: 'absolute',
                     top: 0,
                     left: 0,
                     right: 0,
                     height: 4,
                     background: 'linear-gradient(90deg, #f2c514 0%, #f5d547 100%)',
                   }} />
                   
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, mt: 1 }}>
                     <LocationOnIcon sx={{ color: '#f2c514', fontSize: 24 }} />
                     <Typography 
                       variant="h6" 
                       sx={{ 
                         fontWeight: 600, 
                         color: '#1a1a1a',
                         fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                         fontSize: '1.125rem'
                       }}
                     >
                   Address Details
                 </Typography>
                   </Box>
                   
                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                   <Box>
                       <Typography 
                         variant="body2" 
                         sx={{ 
                           fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                           fontSize: '0.75rem',
                           textTransform: 'uppercase',
                           letterSpacing: '0.1em',
                           fontWeight: 600,
                           color: '#666',
                           mb: 1
                         }}
                       >
                       Full Address
                     </Typography>
                       <Typography 
                         variant="body1" 
                         sx={{ 
                           fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                           fontWeight: 500,
                           color: '#1a1a1a',
                           fontSize: '1rem',
                           lineHeight: 1.6
                         }}
                       >
                       {property.location_id.address_details.formatted_address}
                     </Typography>
                   </Box>
                   
                     <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2.5 }}>
                       <Box>
                         <Typography 
                           variant="body2" 
                           sx={{ 
                             fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                             fontSize: '0.75rem',
                             textTransform: 'uppercase',
                             letterSpacing: '0.1em',
                             fontWeight: 600,
                             color: '#666',
                             mb: 1
                           }}
                         >
                         Street
                       </Typography>
                         <Typography 
                           variant="body1" 
                           sx={{ 
                             fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                             fontWeight: 500,
                             color: '#1a1a1a',
                             fontSize: '0.9375rem'
                           }}
                         >
                         {property.location_id.address_details.street_number} {property.location_id.address_details.route}
                       </Typography>
                     </Box>
                     
                       <Box>
                         <Typography 
                           variant="body2" 
                           sx={{ 
                             fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                             fontSize: '0.75rem',
                             textTransform: 'uppercase',
                             letterSpacing: '0.1em',
                             fontWeight: 600,
                             color: '#666',
                             mb: 1
                           }}
                         >
                         Locality
                       </Typography>
                         <Typography 
                           variant="body1" 
                           sx={{ 
                             fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                             fontWeight: 500,
                             color: '#1a1a1a',
                             fontSize: '0.9375rem'
                           }}
                         >
                         {property.location_id.address_details.locality}
                       </Typography>
                   </Box>
                   
                       <Box>
                         <Typography 
                           variant="body2" 
                           sx={{ 
                             fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                             fontSize: '0.75rem',
                             textTransform: 'uppercase',
                             letterSpacing: '0.1em',
                             fontWeight: 600,
                             color: '#666',
                             mb: 1
                           }}
                         >
                         State
                       </Typography>
                         <Typography 
                           variant="body1" 
                           sx={{ 
                             fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                             fontWeight: 500,
                             color: '#1a1a1a',
                             fontSize: '0.9375rem'
                           }}
                         >
                         {property.location_id.address_details.administrative_area_level_1}
                       </Typography>
                     </Box>
                     
                       <Box>
                         <Typography 
                           variant="body2" 
                           sx={{ 
                             fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                             fontSize: '0.75rem',
                             textTransform: 'uppercase',
                             letterSpacing: '0.1em',
                             fontWeight: 600,
                             color: '#666',
                             mb: 1
                           }}
                         >
                         Country
                       </Typography>
                         <Typography 
                           variant="body1" 
                           sx={{ 
                             fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                             fontWeight: 500,
                             color: '#1a1a1a',
                             fontSize: '0.9375rem'
                           }}
                         >
                         {property.location_id.address_details.country}
                       </Typography>
                   </Box>
                   
                       <Box>
                         <Typography 
                           variant="body2" 
                           sx={{ 
                             fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                             fontSize: '0.75rem',
                             textTransform: 'uppercase',
                             letterSpacing: '0.1em',
                             fontWeight: 600,
                             color: '#666',
                             mb: 1
                           }}
                         >
                         Postal Code
                       </Typography>
                         <Typography 
                           variant="body1" 
                           sx={{ 
                             fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                             fontWeight: 500,
                             color: '#1a1a1a',
                             fontSize: '0.9375rem'
                           }}
                         >
                         {property.location_id.address_details.postal_code}
                       </Typography>
                     </Box>
                     
                       <Box>
                         <Typography 
                           variant="body2" 
                           sx={{ 
                             fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                             fontSize: '0.75rem',
                             textTransform: 'uppercase',
                             letterSpacing: '0.1em',
                             fontWeight: 600,
                             color: '#666',
                             mb: 1
                           }}
                         >
                         Coordinates
                       </Typography>
                         <Typography 
                           variant="body1" 
                           sx={{ 
                             fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                             fontWeight: 500,
                             color: '#1a1a1a',
                             fontSize: '0.9375rem'
                           }}
                         >
                         {property.location_id.coordinates.latitude.toFixed(6)}, {property.location_id.coordinates.longitude.toFixed(6)}
                       </Typography>
                     </Box>
                   </Box>
                 </Box>
               </Box>
               
               {/* Location Verification */}
               <Box sx={{ 
                   p: 3.5,
                   border: '2px solid #e8e8e8',
                 borderRadius: 3,
                 backgroundColor: '#ffffff',
                 width: '100%',
                 overflow: 'hidden',
                 boxSizing: 'border-box',
                   boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                   transition: 'all 0.3s ease',
                   position: 'relative',
                   '&:hover': {
                     boxShadow: '0 4px 16px rgba(242, 197, 20, 0.12)',
                     borderColor: '#f2c514'
                   }
                 }}>
                   <Box sx={{
                     position: 'absolute',
                     top: 0,
                     left: 0,
                     right: 0,
                     height: 4,
                     background: 'linear-gradient(90deg, #f2c514 0%, #f5d547 100%)',
                   }} />
                   
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, mt: 1 }}>
                     {property.location_id.location_verified ? (
                       <VerifiedUserIcon sx={{ color: '#4caf50', fontSize: 24 }} />
                     ) : (
                       <CheckCircleOutlineIcon sx={{ color: '#f44336', fontSize: 24 }} />
                     )}
                     <Typography 
                       variant="h6" 
                       sx={{ 
                         fontWeight: 600, 
                         color: '#1a1a1a',
                         fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                         fontSize: '1.125rem'
                       }}
                     >
                   Location Verification
                 </Typography>
                   </Box>
                   
                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                     <Box sx={{ 
                         width: 12, 
                         height: 12, 
                       borderRadius: '50%', 
                         backgroundColor: property.location_id.location_verified ? '#4caf50' : '#f44336',
                         boxShadow: property.location_id.location_verified ? '0 0 8px rgba(76, 175, 80, 0.4)' : '0 0 8px rgba(244, 67, 54, 0.4)'
                       }} />
                       <Typography 
                         variant="body1" 
                         sx={{ 
                           fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                           fontWeight: 600,
                           color: '#1a1a1a',
                           fontSize: '0.9375rem'
                         }}
                       >
                       Location {property.location_id.location_verified ? 'Verified' : 'Not Verified'}
                     </Typography>
                   </Box>
                   
                   <Box>
                       <Typography 
                         variant="body2" 
                         sx={{ 
                           fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                           fontSize: '0.75rem',
                           textTransform: 'uppercase',
                           letterSpacing: '0.1em',
                           fontWeight: 600,
                           color: '#666',
                           mb: 1
                         }}
                       >
                       Geocoding Service
                     </Typography>
                       <Typography 
                         variant="body1" 
                         sx={{ 
                           fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                           fontWeight: 500,
                           color: '#1a1a1a',
                           fontSize: '0.9375rem'
                         }}
                       >
                       {property.location_id.geocoding_info.geocoding_service} ({property.location_id.geocoding_info.geocoding_accuracy})
                     </Typography>
                   </Box>
                   
                   {property.location_id.verification_notes && (
                     <Box>
                         <Typography 
                           variant="body2" 
                           sx={{ 
                             fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                             fontSize: '0.75rem',
                             textTransform: 'uppercase',
                             letterSpacing: '0.1em',
                             fontWeight: 600,
                             color: '#666',
                             mb: 1
                           }}
                         >
                         Verification Notes
                       </Typography>
                         <Typography 
                           variant="body1" 
                           sx={{ 
                             fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                             fontWeight: 400,
                             color: '#555',
                             fontSize: '0.9375rem',
                             lineHeight: 1.6
                           }}
                         >
                         {property.location_id.verification_notes}
                       </Typography>
                     </Box>
                   )}
                 </Box>
               </Box>
             </Box>
          </CardContent>
           {/* Google Maps Embed */}
           <PropertyCard sx={{ margin:3 }}>
             <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
               <Box sx={{ 
                 position: 'relative',
                 width: '100%',
                 height: { xs: 400, md: 500 },
                 borderRadius: 3,
                 overflow: 'hidden',
                 border: '2px solid #e8e8e8',
                 boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
               }}>
                 <iframe
                   src={`https://www.google.com/maps?q=${property.location_id.coordinates.latitude},${property.location_id.coordinates.longitude}&hl=en&z=14&output=embed`}
                   width="100%"
                   height="100%"
                   style={{ border: 0 }}
                   allowFullScreen
                   loading="lazy"
                   referrerPolicy="no-referrer-when-downgrade"
                   title="Property Location Map"
                 />
             </Box>
           </CardContent>
         </PropertyCard>
         </PropertyCard>
         </>
       )}

      {/* Business Details */}
      {hasBusinessDetails && (
        <PropertyCard>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <BusinessIcon sx={{ color: '#f2c514', fontSize: 32 }} />
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: { xs: '1.5rem', md: '1.75rem' },
                  letterSpacing: '-0.02em',
                  color: '#1a1a1a',
                  borderBottom: '2px solid #f2c514',
                  paddingBottom: 2,
                  flex: 1
                }}
              >
              Business Details
            </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 3,
              width: '100%'
            }}>
            {/* Council Tax */}
            {property.council_tax && (
              <Box sx={{ 
                  position: 'relative',
                  p: 3.5,
                  border: '2px solid #e8e8e8',
                borderRadius: 3,
                backgroundColor: '#ffffff',
                width: '100%',
                overflow: 'hidden',
                boxSizing: 'border-box',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(242, 197, 20, 0.15)',
                    transform: 'translateY(-4px)',
                    borderColor: '#f2c514'
                  }
                }}>
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(90deg, #f2c514 0%, #f5d547 100%)',
                  }} />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, mt: 1 }}>
                    <ReceiptIcon sx={{ color: '#f2c514', fontSize: 24 }} />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#1a1a1a',
                        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                        fontSize: '1.125rem'
                      }}
                    >
                  Council Tax
                </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2.5 }}>
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            fontWeight: 600,
                            color: '#666',
                            mb: 1
                          }}
                        >
                        Band
                      </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            fontWeight: 600,
                            color: '#1a1a1a',
                            fontSize: '1rem'
                          }}
                        >
                        {property.council_tax.band}
                      </Typography>
                    </Box>
                    
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            fontWeight: 600,
                            color: '#666',
                            mb: 1
                          }}
                        >
                        Authority
                      </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            fontWeight: 500,
                            color: '#1a1a1a',
                            fontSize: '0.9375rem',
                            lineHeight: 1.5
                          }}
                        >
                        {property.council_tax.authority}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Planning */}
            {property.planning && (
              <Box sx={{ 
                  position: 'relative',
                  p: 3.5,
                  border: '2px solid #e8e8e8',
                borderRadius: 3,
                backgroundColor: '#ffffff',
                width: '100%',
                overflow: 'hidden',
                boxSizing: 'border-box',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(242, 197, 20, 0.15)',
                    transform: 'translateY(-4px)',
                    borderColor: '#f2c514'
                  }
                }}>
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(90deg, #f2c514 0%, #f5d547 100%)',
                  }} />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, mt: 1 }}>
                    <AssessmentIcon sx={{ color: '#f2c514', fontSize: 24 }} />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#1a1a1a',
                        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                        fontSize: '1.125rem'
                      }}
                    >
                  Planning Information
                </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2.5 }}>
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            fontWeight: 600,
                            color: '#666',
                            mb: 1
                          }}
                        >
                        Status
                      </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            fontWeight: 600,
                            color: '#1a1a1a',
                            fontSize: '1rem'
                          }}
                        >
                        {property.planning.status}
                      </Typography>
                    </Box>
                    
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            fontWeight: 600,
                            color: '#666',
                            mb: 1
                          }}
                        >
                        Application Number
                      </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            fontWeight: 500,
                            color: '#1a1a1a',
                            fontSize: '0.9375rem',
                            lineHeight: 1.5
                          }}
                        >
                        {property.planning.application_number}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          fontWeight: 600,
                          color: '#666',
                          mb: 1
                        }}
                      >
                      Decision Date
                    </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                          fontWeight: 500,
                          color: '#1a1a1a',
                          fontSize: '0.9375rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}
                      >
                        <CalendarIcon sx={{ color: '#f2c514', fontSize: 18 }} />
                      {new Date(property.planning.decision_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Business Rates */}
            {property.business_rates_id && (
              <Box sx={{ 
                  position: 'relative',
                  p: 3.5,
                  border: '2px solid #e8e8e8',
                borderRadius: 3,
                backgroundColor: '#ffffff',
                width: '100%',
                overflow: 'hidden',
                boxSizing: 'border-box',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(242, 197, 20, 0.15)',
                    transform: 'translateY(-4px)',
                    borderColor: '#f2c514'
                  }
                }}>
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(90deg, #f2c514 0%, #f5d547 100%)',
                  }} />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, mt: 1 }}>
                    <LocalTaxiIcon sx={{ color: '#f2c514', fontSize: 24 }} />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#1a1a1a',
                        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                        fontSize: '1.125rem'
                      }}
                    >
                  Business Rates
                </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2.5 }}>
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            fontWeight: 600,
                            color: '#666',
                            mb: 1
                          }}
                        >
                        Rateable Value
                      </Typography>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            fontWeight: 700,
                            color: '#1976d2',
                            fontSize: '1.5rem',
                            letterSpacing: '-0.01em'
                          }}
                        >
                        £{property.business_rates_id.rateable_value_gbp.toLocaleString()}
                      </Typography>
                    </Box>
                    
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            fontWeight: 600,
                            color: '#666',
                            mb: 1
                          }}
                        >
                        Rates Payable
                      </Typography>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            fontWeight: 700,
                            color: '#1976d2',
                            fontSize: '1.5rem',
                            letterSpacing: '-0.01em'
                          }}
                        >
                        £{property.business_rates_id.rates_payable_gbp.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          fontWeight: 600,
                          color: '#666',
                          mb: 1
                        }}
                      >
                      Last Updated
                    </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                          fontWeight: 500,
                          color: '#1a1a1a',
                          fontSize: '0.9375rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}
                      >
                        <CalendarIcon sx={{ color: '#f2c514', fontSize: 18 }} />
                      {new Date(property.business_rates_id.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {/* EPC (Energy Performance Certificate) */}
            {property.epc && (
              <Box sx={{ 
                  position: 'relative',
                  p: 3.5,
                  border: '2px solid #e8e8e8',
                borderRadius: 3,
                backgroundColor: '#ffffff',
                width: '100%',
                overflow: 'hidden',
                boxSizing: 'border-box',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(242, 197, 20, 0.15)',
                    transform: 'translateY(-4px)',
                    borderColor: '#f2c514'
                  }
                }}>
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(90deg, #f2c514 0%, #f5d547 100%)',
                  }} />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, mt: 1 }}>
                    <EcoIcon sx={{ color: '#f2c514', fontSize: 24 }} />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#1a1a1a',
                        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                        fontSize: '1.125rem'
                      }}
                    >
                      Energy Performance Certificate
                </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2.5 }}>
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            fontWeight: 600,
                            color: '#666',
                            mb: 1
                          }}
                        >
                        Rating
                      </Typography>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            fontWeight: 700,
                            color: '#4caf50',
                            fontSize: '1.5rem',
                            letterSpacing: '-0.01em'
                          }}
                        >
                        {property.epc.rating}
                      </Typography>
                    </Box>
                    
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            fontWeight: 600,
                            color: '#666',
                            mb: 1
                          }}
                        >
                        Score
                      </Typography>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            fontWeight: 700,
                            color: '#1976d2',
                            fontSize: '1.5rem',
                            letterSpacing: '-0.01em'
                          }}
                        >
                        {property.epc.score}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {property.epc.certificate_number && (
                    <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            fontWeight: 600,
                            color: '#666',
                            mb: 1
                          }}
                        >
                        Certificate Number
                      </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            fontWeight: 500,
                            color: '#1a1a1a',
                            fontSize: '0.9375rem',
                            lineHeight: 1.5
                          }}
                        >
                        {property.epc.certificate_number}
                      </Typography>
                    </Box>
                  )}
                  
                  <Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          fontWeight: 600,
                          color: '#666',
                          mb: 1
                        }}
                      >
                      Expiry Date
                    </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                          fontWeight: 500,
                          color: '#1a1a1a',
                          fontSize: '0.9375rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}
                      >
                        <CalendarIcon sx={{ color: '#f2c514', fontSize: 18 }} />
                      {new Date(property.epc.expiry_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </CardContent>
      </PropertyCard>
      )}

      {/* Documents and Virtual Tours */}
      {(hasDocuments || hasVirtualTours) && (
        <PropertyCard>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <DescriptionIcon sx={{ color: '#f2c514', fontSize: 32 }} />
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: { xs: '1.5rem', md: '1.75rem' },
                  letterSpacing: '-0.02em',
                  color: '#1a1a1a',
                  borderBottom: '2px solid #f2c514',
                  paddingBottom: 2,
                  flex: 1
                }}
              >
                Documents and Virtual Tours
            </Typography>
            </Box>
            
            {hasDocuments && (
            <Box sx={{ 
              display: 'flex', 
                flexDirection: 'column',
                gap: 3,
                width: '100%',
                mb: hasVirtualTours ? 4 : 0
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <DescriptionIcon sx={{ color: '#f2c514', fontSize: 24 }} />
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 600,
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                      color: '#1a1a1a'
                    }}
                  >
                    Documents
                  </Typography>
                </Box>
                
                {property.documents_id.documents.map((document) => (
                  <Box 
                    key={document._id} 
                    sx={{
                      position: 'relative',
                      p: 3.5,
                      border: '2px solid #e8e8e8',
                      borderRadius: 3,
                      backgroundColor: '#ffffff',
                      width: '100%',
                      overflow: 'hidden',
                      boxSizing: 'border-box',
                      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(242, 197, 20, 0.15)',
                        transform: 'translateY(-4px)',
                        borderColor: '#f2c514'
                      }
                    }}
                  >
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: 'linear-gradient(90deg, #f2c514 0%, #f5d547 100%)',
                    }} />
                    
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: 3,
                      flexDirection: { xs: 'column', sm: 'row' }
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: { xs: 'auto', sm: 80 },
                        width: { xs: '100%', sm: 80 },
                        height: 80,
                        borderRadius: 2,
                        backgroundColor: 'rgba(242, 197, 20, 0.1)',
                        border: '2px solid rgba(242, 197, 20, 0.2)',
                        mb: { xs: 2, sm: 0 }
                      }}>
                        <DescriptionIcon sx={{ color: '#f2c514', fontSize: 40 }} />
                      </Box>
                      
                      <Box sx={{ flex: 1, width: '100%' }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600, 
                            mb: 2,
                            color: '#1a1a1a',
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            fontSize: '1.125rem'
                          }}
                        >
                          {document.document_name}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                          <Box>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                fontWeight: 600,
                                color: '#666',
                                mb: 0.5
                              }}
                            >
                              Document Type
                            </Typography>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                                fontWeight: 500,
                                color: '#1a1a1a',
                                fontSize: '0.9375rem'
                              }}
                            >
                              {document.document_type || 'PDF Document'}
                            </Typography>
                          </Box>
                          
                          {document.uploaded_at && (
                            <Box>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                                  fontSize: '0.75rem',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.1em',
                                  fontWeight: 600,
                                  color: '#666',
                                  mb: 0.5
                                }}
                              >
                                Upload Date
                              </Typography>
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                                  fontWeight: 500,
                                  color: '#1a1a1a',
                                  fontSize: '0.9375rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5
                                }}
                              >
                                <CalendarIcon sx={{ color: '#f2c514', fontSize: 18 }} />
                                {new Date(document.uploaded_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                      
                      <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                    sx={{
                          backgroundColor: '#f2c514',
                          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                          fontWeight: 600,
                          textTransform: 'none',
                          borderRadius: 2,
                          px: 3,
                          py: 1.5,
                          '&:hover': {
                            backgroundColor: '#dfb612',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                          },
                          minWidth: { xs: '100%', sm: '140px' },
                          width: { xs: '100%', sm: 'auto' },
                          mt: { xs: 2, sm: 0 }
                        }}
                        onClick={() => {
                          if (document.file_url) {
                            window.open(document.file_url, '_blank');
                          }
                        }}
                      >
                        Download
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
            
            {hasVirtualTours && (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: 3,
                width: '100%',
                mt: hasDocuments ? 4 : 0
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <VideoLibraryIcon sx={{ color: '#f2c514', fontSize: 24 }} />
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 600,
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                      color: '#1a1a1a'
                    }}
                  >
                    Virtual Tours
                  </Typography>
                </Box>
                
                {property.virtual_tours_id.virtual_tours.map((virtualTour) => (
                  <Box 
                    key={virtualTour._id} 
                    sx={{ 
                      position: 'relative',
                      p: 3.5,
                      border: '2px solid #e8e8e8',
                      borderRadius: 3,
                      backgroundColor: '#ffffff',
                      width: '100%',
                      overflow: 'hidden',
                      boxSizing: 'border-box',
                      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(76, 175, 80, 0.15)',
                        transform: 'translateY(-4px)',
                        borderColor: '#4caf50'
                      }
                    }}
                  >
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: 'linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)',
                    }} />
                    
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: 3,
                      flexDirection: { xs: 'column', sm: 'row' }
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: { xs: 'auto', sm: 80 },
                        width: { xs: '100%', sm: 80 },
                        height: 80,
                        borderRadius: 2,
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        border: '2px solid rgba(76, 175, 80, 0.2)',
                        mb: { xs: 2, sm: 0 }
                      }}>
                        <VideoLibraryIcon sx={{ color: '#4caf50', fontSize: 40 }} />
                      </Box>
                      
                      <Box sx={{ flex: 1, width: '100%' }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600, 
                            mb: 2,
                            color: '#1a1a1a',
                            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                            fontSize: '1.125rem'
                          }}
                        >
                          {virtualTour.tour_name}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                          <Box>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                fontWeight: 600,
                                color: '#666',
                                mb: 0.5
                              }}
                            >
                              Tour Type
                            </Typography>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      fontWeight: 500,
                                color: '#1a1a1a',
                                fontSize: '0.9375rem'
                              }}
                            >
                              {virtualTour.link_type || '360° Virtual Tour'}
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                fontWeight: 600,
                                color: '#666',
                                mb: 0.5
                              }}
                            >
                              Duration
                            </Typography>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                                fontWeight: 500,
                                color: '#1a1a1a',
                                fontSize: '0.9375rem'
                              }}
                            >
                              {virtualTour.duration || 'N/A'}
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                fontWeight: 600,
                                color: '#666',
                                mb: 0.5
                              }}
                            >
                              Description
                            </Typography>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                                fontWeight: 400,
                                color: '#555',
                                fontSize: '0.9375rem',
                                lineHeight: 1.6
                              }}
                            >
                              {virtualTour.description || 'No description available'}
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                fontWeight: 600,
                                color: '#666',
                                mb: 0.5
                              }}
                            >
                              Created Date
                            </Typography>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                                fontWeight: 500,
                                color: '#1a1a1a',
                                fontSize: '0.9375rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                              }}
                            >
                              <CalendarIcon sx={{ color: '#4caf50', fontSize: 18 }} />
                              {(property.virtual_tours_id?.createdAt ? new Date(property.virtual_tours_id.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              }) : 'N/A')}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      <Button
                        variant="contained"
                        startIcon={<PlayArrowIcon />}
                        sx={{
                          backgroundColor: '#4caf50',
                          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                          fontWeight: 600,
                          textTransform: 'none',
                          borderRadius: 2,
                          px: 3,
                          py: 1.5,
                          '&:hover': {
                            backgroundColor: '#388e3c',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                          },
                          minWidth: { xs: '100%', sm: '140px' },
                          width: { xs: '100%', sm: 'auto' },
                          mt: { xs: 2, sm: 0 }
                        }}
                        onClick={() => {
                          if (virtualTour.tour_url) {
                            window.open(virtualTour.tour_url, '_blank');
                          }
                        }}
                      >
                        View Tour
                      </Button>
            </Box>
                  </Box>
                ))}
              </Box>
            )}
          </CardContent>
        </PropertyCard>
      )}

    </MainContent>
  );
};

export default PropertyDetails;
