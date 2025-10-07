import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import BusinessIcon from '@mui/icons-material/Business';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StoreIcon from '@mui/icons-material/Store';
import FactoryIcon from '@mui/icons-material/Factory';
import WorkIcon from '@mui/icons-material/Work';
import LandscapeIcon from '@mui/icons-material/Landscape';
import CampaignIcon from '@mui/icons-material/Campaign';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SearchIcon from '@mui/icons-material/Search';

// ----------------------------------------------------------------------

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  mb: 6,
  position: 'relative',
  zIndex: 2,
}));

const LogoIcon = styled(Box)(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2), 0 0 0 4px rgba(255, 255, 255, 0.3)',
}));

const TrustedSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    animation: 'float 20s ease-in-out infinite',
  },
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-20px)' },
  },
}));

const TrendingSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
  },
}));

const ListPropertySection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff4500 100%)',
  position: 'relative',
  overflow: 'hidden',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.08"%3E%3Ccircle cx="40" cy="40" r="3"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    animation: 'float 25s ease-in-out infinite',
  },
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
    '50%': { transform: 'translateY(-30px) rotate(180deg)' },
  },
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(3, 2),
  borderRadius: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white',
  '&:hover': {
    transform: 'translateY(-5px)',
    background: 'rgba(255, 255, 255, 0.15)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
  },
}));

const PropertyCard = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(3, 2),
  borderRadius: theme.spacing(2),
  backgroundColor: 'white',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
  },
}));

const BenefitCard = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4, 3),
  borderRadius: theme.spacing(3),
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
    transition: 'left 0.5s',
  },
  '&:hover': {
    transform: 'translateY(-10px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    '&::before': {
      left: '100%',
    },
  },
}));

const trendingProperties = [
  { icon: BusinessIcon, title: 'London Offices', color: '#667eea' },
  { icon: StoreIcon, title: 'Manchester Retail Units', color: '#764ba2' },
  { icon: FactoryIcon, title: 'Birmingham Industrial Units', color: '#667eea' },
  { icon: WorkIcon, title: 'Edinburgh Co-Working', color: '#764ba2' },
  { icon: LandscapeIcon, title: 'Development Land', color: '#667eea' },
];

const benefits = [
  {
    icon: CampaignIcon,
    title: 'Reaching the correct audience of business decision-makers',
    description: 'Target the right professionals actively seeking commercial property',
  },
  {
    icon: PhotoCameraIcon,
    title: 'Providing professional marketing materials',
    description: 'High-quality images, floorplans, and drone shots to showcase your property',
  },
  {
    icon: SearchIcon,
    title: 'Producing more enquiries and quality leads',
    description: 'Generate better leads and faster deal closures',
  },
];

export default function HomeTrustedBusinesses() {
  return (
    <>
      {/* List Your Property Section */}
      <ListPropertySection>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            {/* Logo with Zooming Effect */}
            <LogoContainer>
              <LogoIcon>
                <BusinessIcon 
                  sx={{ 
                    fontSize: 60, 
                    color: '#ff6b35',
                    filter: 'drop-shadow(0 4px 8px rgba(255, 107, 53, 0.3))',
                  }} 
                />
              </LogoIcon>
            </LogoContainer>

            {/* Distinctive Title */}
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 900,
                color: '#ffffff',
                mb: 4,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                textShadow: '0 6px 12px rgba(0, 0, 0, 0.4), 0 0 40px rgba(255, 255, 255, 0.3)',
                letterSpacing: '0.05em',
                animation: 'titlePulse 3s ease-in-out infinite',
                '@keyframes titlePulse': {
                  '0%, 100%': { 
                    transform: 'scale(1)',
                    filter: 'brightness(1)',
                  },
                  '50%': { 
                    transform: 'scale(1.02)',
                    filter: 'brightness(1.1)',
                  },
                },
              }}
            >
              LIST YOUR PROPERTY
            </Typography>

            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 700,
                color: 'rgba(255, 255, 255, 0.95)',
                mb: 6,
                fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                textShadow: '0 3px 6px rgba(0, 0, 0, 0.3)',
                letterSpacing: '0.02em',
                animation: 'fadeInUp 2s ease-out',
                '@keyframes fadeInUp': {
                  '0%': { 
                    opacity: 0,
                    transform: 'translateY(30px)',
                  },
                  '100%': { 
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              with CommercialUK
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 1.7,
                maxWidth: '900px',
                mx: 'auto',
                mb: 6,
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.3rem' },
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                animation: 'fadeInUp 2s ease-out 0.5s both',
              }}
            >
              CommercialUK facilitates landlords and agents letting or selling commercial property quicker by:
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 4, 
            mb: 8,
            justifyContent: 'center'
          }}>
            {benefits.map((benefit, index) => (
              <Box key={index} sx={{ 
                flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 32px)' },
                minWidth: { xs: '100%', md: '300px' },
                maxWidth: { xs: '100%', md: '400px' },
                height: { xs: 'auto', md: '280px' },
                display: 'flex',
                flexDirection: 'column'
              }}>
                <BenefitCard>
                  <Box sx={{
                    position: 'relative',
                    mb: 3,
                  }}>
                    <benefit.icon
                      sx={{
                        fontSize: 64,
                        color: '#667eea',
                        filter: 'drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3))',
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      color: '#333',
                      fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' },
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {benefit.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#555',
                      lineHeight: 1.6,
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                    }}
                  >
                    {benefit.description}
                  </Typography>
                </BenefitCard>
              </Box>
            ))}
          </Box>

          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                color: '#666',
                lineHeight: 1.6,
                maxWidth: '600px',
                mx: 'auto',
                mb: 4,
                fontSize: { xs: '1rem', sm: '1.1rem' },
              }}
            >
              Begin advertising with CommercialUK today and reach businesses and investors actively looking for property.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                color: 'white',
                fontWeight: 700,
                px: 6,
                py: 3,
                fontSize: '1.2rem',
                borderRadius: 4,
                textTransform: 'none',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                  transition: 'left 0.5s',
                },
                '&:hover': {
                  transform: 'translateY(-3px) scale(1.05)',
                  boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                  '&::before': {
                    left: '100%',
                  },
                },
                '&:active': {
                  transform: 'translateY(-1px) scale(1.02)',
                },
                animation: 'buttonGlow 3s ease-in-out infinite alternate',
                '@keyframes buttonGlow': {
                  '0%': { boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)' },
                  '100%': { boxShadow: '0 8px 32px rgba(102, 126, 234, 0.5), 0 0 20px rgba(102, 126, 234, 0.3)' },
                },
              }}
            >
              🚀 Start Listing Today
            </Button>
          </Box>
        </Container>
      </ListPropertySection>
    </>
  );
}
