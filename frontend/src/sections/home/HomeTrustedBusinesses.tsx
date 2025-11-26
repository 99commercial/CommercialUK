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
  width: 80,
  height: 80,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2), 0 0 0 3px rgba(255, 255, 255, 0.3)',
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
  padding: theme.spacing(6, 0),
  position: 'relative',
  overflow: 'hidden',
  minHeight: '70vh',
  display: 'flex',
  alignItems: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url("https://img.freepik.com/free-vector/real-estate-sale-rent-background_107791-10997.jpg?semt=ais_hybrid&w=740&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    filter: 'blur(3px)',
    zIndex: 0,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(248, 248, 248, 0.85)',
    zIndex: 1,
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
  padding: theme.spacing(3, 2.5),
  borderRadius: theme.spacing(3),
  background: 'rgba(211, 47, 47, 0.85)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(211, 47, 47, 0.3)',
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(211, 47, 47, 0.15)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    zIndex: 0,
  },
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(211, 47, 47, 0.25)',
    background: 'rgba(211, 47, 47, 0.9)',
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
    title: 'Accessing a Wide Range of Properties',
    description: 'Discover offices, retail spaces, warehouses, and investment options across the UK — all in one place.',
  },
  {
    icon: PhotoCameraIcon,
    title: 'Viewing Verified Listings with Professional Details',
    description: 'See up-to-date details, floor plans, and quality images to make confident decisions',
  },
  {
    icon: SearchIcon,
    title: 'Connecting Directly with Agents and Landlords',
    description: 'Request info, book viewings, and secure your ideal space quickly and easily.',
  },
];

export default function HomeTrustedBusinesses() {
  return (
    <>
      {/* List Your Property Section */}
      <ListPropertySection>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
            {/* Distinctive Title */}
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                color: '#f2c514',
                mb: 2,
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                letterSpacing: '0.05em',
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                zIndex: 1,
              }}
            >
              FIND​‍​‌‍​‍‌​‍​‌‍​‍‌ YOUR NEXT COMMERCIAL SPACE
            </Typography>

            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 500,
                color: '#2c2c2c',
                mb: 3,
                fontSize: { xs: '1rem', sm: '1.2rem', md: '1.3rem' },
                letterSpacing: '0.02em',
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                position: 'relative',
                zIndex: 1,
              }}
            >
              with CommercialUK
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: '#4a4a4a',
                lineHeight: 1.6,
                maxWidth: '700px',
                mx: 'auto',
                mb: 5,
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 400,
                position: 'relative',
                zIndex: 1,
              }}
            >
              CommercialUK simplifies the property search journey for purchasers and tenants by enabling them to locate the most suitable commercial property in less time by:
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 4, 
            mb: 5,
            justifyContent: 'center',
            position: 'relative',
            zIndex: 2,
            maxWidth: '1000px',
            mx: 'auto',
            mt: 10,
          }}>
            {benefits.map((benefit, index) => (
              <Box key={index} sx={{ 
                flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 32px)' },
                minWidth: { xs: '100%', md: '280px' },
                maxWidth: { xs: '100%', md: '320px' },
                textAlign: 'left',
                px: 2,
                position: 'relative',
                '&:not(:last-child)': {
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    right: -16,
                    top: '10%',
                    bottom: '10%',
                    width: '1px',
                    backgroundColor: '#E0E0E0',
                    display: { xs: 'none', md: 'block' },
                  },
                },
              }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: '#000000',
                    fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' },
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    lineHeight: 1.3,
                    textAlign: 'center',
                  }}
                >
                  {benefit.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#666666',
                    lineHeight: 1.6,
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.05rem' },
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    textAlign: 'center',
                  }}
                >
                  {benefit.description}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ textAlign: 'center', mb: 4, position: 'relative', zIndex: 2 }}>
            <Typography
              variant="body1"
              sx={{
                color: '#4a4a4a',
                lineHeight: 1.6,
                maxWidth: '650px',
                mx: 'auto',
                mb: 4,
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 400,
                position: 'relative',
                zIndex: 1,
              }}
            >
              Begin advertising with CommercialUK today and reach businesses and investors actively looking for property.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #f2c514 0%,rgba(242, 198, 20, 0.8) 100%)',
                color: '#000',
                fontWeight: 700,
                px: 4,
                py: 2,
                fontSize: '1rem',
                borderRadius: 3,
                textTransform: 'none',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 6px 24px rgba(211, 47, 47, 0.3)',
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                  transition: 'left 0.5s',
                },
                '&:hover': {
                  backgroundColor: '#f2c514',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 32px rgba(211, 47, 47, 0.4)',
                  '&::before': {
                    left: '100%',
                  },
                },
                '&:active': {
                  transform: 'translateY(0px)',
                },
                zIndex: 1,
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
