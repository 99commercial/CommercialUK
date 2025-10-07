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

  return (
    <MainContent>
      {/* Property Details */}
      <PropertyCard>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Property Details
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <FeatureItem>
                  <LocationOnIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Address
                    </Typography>
                    <Typography variant="body1">
                      {property.general_details.address}
                    </Typography>
                    <Typography variant="body1">
                      {property.general_details.town_city}, {property.general_details.postcode}
                    </Typography>
                  </Box>
                </FeatureItem>
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <FeatureItem>
                  <SquareFootIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Size
                    </Typography>
                    <Typography variant="body1">
                      {formatSize()}
                    </Typography>
                  </Box>
                </FeatureItem>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <FeatureItem>
                  <CalendarIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Year Built
                    </Typography>
                    <Typography variant="body1">
                      {property.general_details.approximate_year_of_construction}
                    </Typography>
                  </Box>
                </FeatureItem>
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <FeatureItem>
                  <BusinessIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Property Type
                    </Typography>
                    <Typography variant="body1">
                      {property.general_details.property_type}
                    </Typography>
                  </Box>
                </FeatureItem>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <FeatureItem>
                  <BusinessIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Property Status
                    </Typography>
                    <Typography variant="body1">
                      {property.property_status}
                    </Typography>
                  </Box>
                </FeatureItem>
              </Box>
              
              {property.business_rates_id && (
                <Box sx={{ flex: 1 }}>
                  <FeatureItem>
                    <BusinessIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Rateable Value
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1976d2' }}>
                        £{property.rateable_value?.toLocaleString()}
                      </Typography>
                    </Box>
                  </FeatureItem>
                </Box>
              )}
            </Box>
          </Box>
        </CardContent>
      </PropertyCard>

      {/* Documents and Virtual Tours */}
      <PropertyCard>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
            Documents and Virtual Tours
          </Typography>
          {property.documents_id ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 2,
              width: '100%'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                Documents
              </Typography>
              {property.documents_id.documents?.map((document) => (
                <Box key={document._id} sx={{ 
                  p: { xs: 2, sm: 3 },
                  border: '1px solid #e0e0e0',
                  borderRadius: 3,
                  width: '100%',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  backgroundImage: `
                    linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(248,249,250,0.85) 100%),
                    url("https://cdn-icons-png.flaticon.com/512/11357/11357455.png"),
                    url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e3f2fd' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
                  `,
                  backgroundSize: 'cover, 120px 120px, 60px 60px',
                  backgroundPosition: 'center, center, 0 0',
                  backgroundRepeat: 'no-repeat, no-repeat, repeat',
                  '&:hover': {
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                    transform: 'translateY(-2px)',
                    backgroundImage: `
                      linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,249,250,0.9) 100%),
                      url("https://cdn-icons-png.flaticon.com/512/11357/11357455.png"),
                      url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e3f2fd' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
                    `,
                  }
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: { xs: 1.5, sm: 2 },
                    flexDirection: { xs: 'column', sm: 'row' }
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      minWidth: { xs: 'auto', sm: 80 },
                      alignSelf: { xs: 'center', sm: 'flex-start' },
                      mb: { xs: 1, sm: 0 }
                    }}>
                      <Avatar
                        src="https://static.vecteezy.com/system/resources/previews/017/178/244/non_2x/file-document-icon-on-transparent-background-free-png.png"
                        sx={{ 
                          width: { xs: 40, sm: 48 }, 
                          height: { xs: 40, sm: 48 }, 
                          backgroundColor: 'transparent',
                          '& img': {
                            objectFit: 'contain'
                          }
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1, width: '100%' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
                        {document.document_name}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Document Type
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
                            {document.document_type || 'PDF Document'}
                          </Typography>
                        </Box>
                        {document.uploaded_at && (
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Upload Date
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
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
                        backgroundColor: '#1976d2',
                        '&:hover': {
                          backgroundColor: '#1565c0',
                        },
                        minWidth: { xs: '100%', sm: '120px' },
                        width: { xs: '100%', sm: 'auto' },
                        mt: { xs: 2, sm: 0 }
                      }}
                      onClick={() => {
                        // Handle download logic here
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
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              Document information not available for this property.
            </Typography>
          )}
          {property.virtual_tours_id ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 2,
              width: '100%',
              mt: 3
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                Virtual Tours
              </Typography>
              {property.virtual_tours_id.virtual_tours?.map((virtualTour) => (
                <Box key={virtualTour._id} sx={{ 
                  p: { xs: 2, sm: 3 },
                  border: '1px solid #e0e0e0',
                  borderRadius: 3,
                  width: '100%',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  backgroundImage: `
                    linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(248,252,248,0.85) 100%),
                    url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7mQq5UqoQFA7iID-j90V9sxM_1Mr8VPSNFpPFeBnZfcKUz8pzxEJlfwlikFNfgdboyWI&usqp=CAU"),
                    url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e8f5e8' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
                  `,
                  backgroundSize: 'cover, 160px 160px, 60px 60px',
                  backgroundPosition: 'center, center, 0 0',
                  backgroundRepeat: 'no-repeat, no-repeat, repeat',
                  '&:hover': {
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                    transform: 'translateY(-2px)',
                    backgroundImage: `
                      linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,252,248,0.9) 100%),
                      url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7mQq5UqoQFA7iID-j90V9sxM_1Mr8VPSNFpPFeBnZfcKUz8pzxEJlfwlikFNfgdboyWI&usqp=CAU"),
                      url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e8f5e8' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
                    `,
                  }
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: { xs: 1.5, sm: 2 },
                    flexDirection: { xs: 'column', sm: 'row' }
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      minWidth: { xs: 'auto', sm: 80 },
                      alignSelf: { xs: 'center', sm: 'flex-start' },
                      mb: { xs: 1, sm: 0 }
                    }}>
                      <Avatar
                        src="https://cdn-icons-png.flaticon.com/512/11357/11357455.png"
                        sx={{ 
                          width: { xs: 40, sm: 48 }, 
                          height: { xs: 40, sm: 48 }, 
                          backgroundColor: 'transparent',
                          '& img': {
                            objectFit: 'contain'
                          }
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1, width: '100%' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
                        {virtualTour.tour_name}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Tour Type
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
                            {virtualTour.link_type || '360° Virtual Tour'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Duration
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
                            {virtualTour.duration || 'N/A'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Description
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
                            {virtualTour.description || 'No description available'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Created Date
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
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
                        '&:hover': {
                          backgroundColor: '#388e3c',
                        },
                        minWidth: { xs: '100%', sm: '120px' },
                        width: { xs: '100%', sm: 'auto' },
                        mt: { xs: 2, sm: 0 }
                      }}
                      onClick={() => {
                        // Handle virtual tour redirect logic here
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
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2, mt: 3 }}>
              Virtual tour information not available for this property.
            </Typography>
          )}
        </CardContent>
      </PropertyCard>

      {/* Description */}
      <PropertyCard>
        <CardContent>
          {property.descriptions_id ? (
            <>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
                Property Descriptions
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr', md: 'repeat(2, 1fr)' },
                gap: 3,
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden'
              }}>
                {property.descriptions_id.general && (
                  <Box sx={{ 
                    gridColumn: { xs: '1', md: '1 / -1' },
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    backgroundColor: '#fafafa',
                    width: '100%',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    boxSizing: 'border-box'
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                      General Description
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      lineHeight: 1.8, 
                      color: '#555',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      hyphens: 'auto'
                    }}>
                      {property.descriptions_id.general}
                    </Typography>
                  </Box>
                )}
                
                {property.descriptions_id.location && (
                  <Box sx={{ 
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    backgroundColor: '#fafafa',
                    width: '100%',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    boxSizing: 'border-box'
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                      Location Description
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      lineHeight: 1.8, 
                      color: '#555',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      hyphens: 'auto'
                    }}>
                      {property.descriptions_id.location}
                    </Typography>
                  </Box>
                )}
                
                {property.descriptions_id.accommodation && (
                  <Box sx={{ 
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    backgroundColor: '#fafafa',
                    width: '100%',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    boxSizing: 'border-box'
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                      Accommodation Details
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      lineHeight: 1.8, 
                      color: '#555',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      hyphens: 'auto'
                    }}>
                      {property.descriptions_id.accommodation}
                    </Typography>
                  </Box>
                )}
                
                {property.descriptions_id.terms && (
                  <Box sx={{ 
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    backgroundColor: '#fafafa',
                    width: '100%',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    boxSizing: 'border-box'
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                      Terms & Conditions
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      lineHeight: 1.8, 
                      color: '#555',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      hyphens: 'auto'
                    }}>
                      {property.descriptions_id.terms}
                    </Typography>
                  </Box>
                )}
                
                {property.descriptions_id.specifications && (
                  <Box sx={{ 
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    backgroundColor: '#fafafa',
                    width: '100%',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    boxSizing: 'border-box'
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                      Specifications
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      lineHeight: 1.8, 
                      color: '#555',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      hyphens: 'auto'
                    }}>
                      {property.descriptions_id.specifications}
                    </Typography>
                  </Box>
                )}
                
                {property.descriptions_id.createdAt && (
                  <Box sx={{ 
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    backgroundColor: '#fafafa',
                    width: '100%',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    boxSizing: 'border-box'
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                      Last Updated
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      lineHeight: 1.8, 
                      color: '#555',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      hyphens: 'auto'
                    }}>
                      {new Date(property.descriptions_id.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Box>
                )}
              </Box>
              {/*  */}
            </>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              Description information not available for this property.
            </Typography>
          )}
        </CardContent>
      </PropertyCard>

      {/* Sale Types */}
      <PropertyCard>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
            Sale Types & Pricing
          </Typography>
          {property.sale_types_id ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 2,
              width: '100%'
            }}>
              {property.sale_types_id.sale_types?.map((saleType, index) => (
                <Box key={saleType._id || index} sx={{ 
                  p: 3,
                  border: '1px solid #e0e0e0',
                  borderRadius: 3,
                  backgroundColor: '#ffffff',
                  width: '100%',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                    transform: 'translateY(-2px)'
                  }
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 0.5 }}>
                        {saleType.sale_type}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem' }}>
                        {saleType.price_unit}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h4" sx={{ 
                        fontWeight: 700, 
                        color: '#1976d2',
                        lineHeight: 1.2,
                        fontSize: '1.75rem'
                      }}>
                        {saleType.price_currency === 'GBP' ? '£' : saleType.price_currency} {saleType.price_value.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              Sale type information not available for this property.
            </Typography>
          )}
        </CardContent>
      </PropertyCard>

       {/* Location & Map */}
       <PropertyCard>
         <CardContent>
           <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
             Location & Map
           </Typography>
           {property.location_id ? (
             <Box sx={{ 
               display: 'flex', 
               flexDirection: 'column',
               gap: 3,
               width: '100%'
             }}>
               {/* Address Details */}
               <Box sx={{ 
                 p: 3,
                 border: '1px solid #e0e0e0',
                 borderRadius: 3,
                 backgroundColor: '#ffffff',
                 width: '100%',
                 maxWidth: '100%',
                 overflow: 'hidden',
                 boxSizing: 'border-box',
                 boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
               }}>
                 <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                   Address Details
                 </Typography>
                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                   <Box>
                     <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                       Full Address
                     </Typography>
                     <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
                       {property.location_id.address_details.formatted_address}
                     </Typography>
                   </Box>
                   
                   <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                     <Box sx={{ flex: 1 }}>
                       <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                         Street
                       </Typography>
                       <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
                         {property.location_id.address_details.street_number} {property.location_id.address_details.route}
                       </Typography>
                     </Box>
                     
                     <Box sx={{ flex: 1 }}>
                       <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                         Locality
                       </Typography>
                       <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
                         {property.location_id.address_details.locality}
                       </Typography>
                     </Box>
                   </Box>
                   
                   <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                     <Box sx={{ flex: 1 }}>
                       <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                         State
                       </Typography>
                       <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
                         {property.location_id.address_details.administrative_area_level_1}
                       </Typography>
                     </Box>
                     
                     <Box sx={{ flex: 1 }}>
                       <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                         Country
                       </Typography>
                       <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
                         {property.location_id.address_details.country}
                       </Typography>
                     </Box>
                   </Box>
                   
                   <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                     <Box sx={{ flex: 1 }}>
                       <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                         Postal Code
                       </Typography>
                       <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
                         {property.location_id.address_details.postal_code}
                       </Typography>
                     </Box>
                     
                     <Box sx={{ flex: 1 }}>
                       <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                         Coordinates
                       </Typography>
                       <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
                         {property.location_id.coordinates.latitude.toFixed(6)}, {property.location_id.coordinates.longitude.toFixed(6)}
                       </Typography>
                     </Box>
                   </Box>
                 </Box>
               </Box>
               
               
               {/* Location Verification */}
               <Box sx={{ 
                 p: 3,
                 border: '1px solid #e0e0e0',
                 borderRadius: 3,
                 backgroundColor: '#ffffff',
                 width: '100%',
                 maxWidth: '100%',
                 overflow: 'hidden',
                 boxSizing: 'border-box',
                 boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
               }}>
                 <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                   Location Verification
                 </Typography>
                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                     <Box sx={{ 
                       width: 8, 
                       height: 8, 
                       borderRadius: '50%', 
                       backgroundColor: property.location_id.location_verified ? '#4caf50' : '#f44336' 
                     }} />
                     <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
                       Location {property.location_id.location_verified ? 'Verified' : 'Not Verified'}
                     </Typography>
                   </Box>
                   
                   <Box>
                     <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                       Geocoding Service
                     </Typography>
                     <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
                       {property.location_id.geocoding_info.geocoding_service} ({property.location_id.geocoding_info.geocoding_accuracy})
                     </Typography>
                   </Box>
                   
                   {property.location_id.verification_notes && (
                     <Box>
                       <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                         Verification Notes
                       </Typography>
                       <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
                         {property.location_id.verification_notes}
                       </Typography>
                     </Box>
                   )}
                 </Box>
               </Box>
             </Box>
           ) : (
             <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
               Location information not available for this property.
             </Typography>
           )}
        </CardContent>
      </PropertyCard>

      {/* Business Details */}
      <PropertyCard>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
            Business Details
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: 3,
            width: '100%'
          }}>
            {/* Council Tax */}
            {property.council_tax && (
              <Box sx={{ 
                p: 3,
                border: '1px solid #e0e0e0',
                borderRadius: 3,
                backgroundColor: '#ffffff',
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
                boxSizing: 'border-box',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                  Council Tax
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Band
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
                        {property.council_tax.band}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Authority
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
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
                p: 3,
                border: '1px solid #e0e0e0',
                borderRadius: 3,
                backgroundColor: '#ffffff',
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
                boxSizing: 'border-box',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                  Planning Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Status
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
                        {property.planning.status}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Application Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
                        {property.planning.application_number}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Decision Date
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
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
                p: 3,
                border: '1px solid #e0e0e0',
                borderRadius: 3,
                backgroundColor: '#ffffff',
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
                boxSizing: 'border-box',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                  Business Rates
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Rateable Value
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                        £{property.business_rates_id.rateable_value_gbp.toLocaleString()}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Rates Payable
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                        £{property.business_rates_id.rates_payable_gbp.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Last Updated
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
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
                p: 3,
                border: '1px solid #e0e0e0',
                borderRadius: 3,
                backgroundColor: '#ffffff',
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
                boxSizing: 'border-box',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                  Energy Performance Certificate (EPC)
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Rating
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#4caf50' }}>
                        {property.epc.rating}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Score
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                        {property.epc.score}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {property.epc.certificate_number && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Certificate Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
                        {property.epc.certificate_number}
                      </Typography>
                    </Box>
                  )}
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Expiry Date
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
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

            {/* Show message if no business details are available */}
            {!property.council_tax && !property.planning && !property.business_rates_id && !property.epc && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                Business details information not available for this property.
              </Typography>
            )}
          </Box>
        </CardContent>
      </PropertyCard>

      {/* Features */}
      <PropertyCard>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Features & Amenities
          </Typography>
          {property.features_id ? (
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              gap: 1.5 
            }}>
              {/* Main Features */}
              {Object.entries(property.features_id.features)
                .filter(([key, value]) => value === 'Yes')
                .map(([key, value]) => {
                const featureName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                
                return (
                  <Chip
                    key={key}
                    label={featureName}
                    color="success"
                    variant="filled"
                    sx={{
                      fontWeight: 500,
                      '& .MuiChip-label': {
                        fontSize: '0.875rem'
                      }
                    }}
                  />
                );
              })}
              
              {/* Additional Features */}
              {property.features_id.additional_features?.filter(feature => feature.feature_value === 'Yes').map((feature) => {
                return (
                  <Chip
                    key={feature._id}
                    label={feature.feature_name}
                    color="success"
                    variant="filled"
                    sx={{
                      fontWeight: 500,
                      '& .MuiChip-label': {
                        fontSize: '0.875rem'
                      }
                    }}
                  />
                );
              })}
              
              {/* Show message if no features are available */}
              {Object.entries(property.features_id.features).filter(([key, value]) => value === 'Yes').length === 0 && 
               (!property.features_id.additional_features || property.features_id.additional_features.filter(feature => feature.feature_value === 'Yes').length === 0) && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2, width: '100%' }}>
                  No specific features listed for this property.
                </Typography>
              )}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              Feature information not available for this property.
            </Typography>
          )}
        </CardContent>
      </PropertyCard>
    </MainContent>
  );
};

export default PropertyDetails;
