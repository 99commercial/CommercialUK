import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CampaignIcon from '@mui/icons-material/Campaign';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import ComputerIcon from '@mui/icons-material/Computer';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import SecurityIcon from '@mui/icons-material/Security';
import ListIcon from '@mui/icons-material/List';
import PublicIcon from '@mui/icons-material/Public';
import SpeedIcon from '@mui/icons-material/Speed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// ----------------------------------------------------------------------

const BenefitsSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  background: 'linear-gradient(180deg, #0a0e27 0%, #1a1f3a 50%, #0f1525 100%)',
  position: 'relative',
  overflow: 'hidden',
}));

const MainCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  background: '#0f1525',
  borderRadius: theme.spacing(4),
  padding: theme.spacing(8, 4),
  marginBottom: theme.spacing(8),
  overflow: 'hidden',
  border: '1px solid rgba(0, 255, 255, 0.1)',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: '#00f0ff',
    boxShadow: '0 0 20px #00f0ff, 0 0 40px #00f0ff',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80%',
    height: '60%',
    background: 'linear-gradient(180deg, rgba(0, 240, 255, 0.15) 0%, rgba(0, 240, 255, 0.05) 50%, transparent 100%)',
    borderRadius: '0 0 50% 50%',
    filter: 'blur(40px)',
    pointerEvents: 'none',
  },
}));

const BenefitCard = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  color: 'white',
  position: 'relative',
  zIndex: 1,
  padding: theme.spacing(4, 3),
  borderRadius: theme.spacing(2),
  background: 'rgba(15, 21, 37, 0.8)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 240, 255, 0.2)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    background: 'rgba(15, 21, 37, 0.95)',
    borderColor: 'rgba(0, 240, 255, 0.4)',
    boxShadow: '0 20px 60px rgba(0, 240, 255, 0.2), 0 0 40px rgba(0, 240, 255, 0.1)',
    '& .icon-wrapper': {
      transform: 'scale(1.1)',
      background: 'rgba(0, 240, 255, 0.2)',
      borderColor: 'rgba(0, 240, 255, 0.5)',
    },
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0, 240, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 240, 255, 0.3)',
  marginBottom: theme.spacing(2),
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 4px 20px rgba(0, 240, 255, 0.1)',
}));

const benefits = [
  {
    icon: CampaignIcon,
    title: 'Reach the Right People',
    description: 'The Smarter Way to Sell or Let Commercial Property',
  },
  {
    icon: ComputerIcon,
    title: 'Easy-to-Use Platform',
    description: 'The Smarter Way to Sell or Let Commercial Property',
  },
  {
    icon: HomeWorkIcon,
    title: 'Property Solutions for Every Business',
    description: 'The Smarter Way to Sell or Let Commercial Property',
  },
];

const whyChooseBenefits = [
  {
    icon: SecurityIcon,
    title: 'Trusted UK Platform',
  },
  {
    icon: ListIcon,
    title: 'Broad Listings',
  },
  {
    icon: PublicIcon,
    title: 'International Exposure',
  },
  {
    icon: SpeedIcon,
    title: 'Quicker Deals',
  },
  {
    icon: TrendingUpIcon,
    title: 'Stronger Marketing',
  },
];

export default function HomeBenefits() {
  return (
    <BenefitsSection>
      <Container maxWidth="lg">
        {/* <Box sx={{ textAlign: 'center', mb: 6, position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 600,
              color: '#ffffff',
              mb: 4,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)',
              letterSpacing: '0.02em',
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
              lineHeight: 1.2,
            }}
          >
            The Smarter Way to Sell or Let Commercial Property
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
                <benefit.icon
                  sx={{
                    fontSize: 64,
                    mb: 3,
                    color: 'white',
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: 'white',
                  }}
                >
                  {benefit.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: 1.6,
                  }}
                >
                  {benefit.description}
                </Typography>
              </BenefitCard>
            </Box>
          ))}
        </Box> */}

        {/* Separator Line */}
        {/* <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mb: 6, 
          position: 'relative', 
          zIndex: 1 
        }}>
          <Box sx={{
            width: '80%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
            borderRadius: '1px',
          }} />
        </Box> */}

        {/* Main Card with Light Beam Effect */}
        <MainCard sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 900,
                color: '#ffffff',
                mb: 2,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                lineHeight: 1.3,
                fontFamily: 'inherit',

              }}
            >
              Why Choose CommercialUK
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                lineHeight: 1.5,
                fontFamily: 'inherit',
              }}
            >
              The right way to find your commercial property
            </Typography>
          </Box>
        </MainCard>

        {/* Subcards */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 4, 
          mb: 6,
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          {whyChooseBenefits.map((benefit, index) => (
            <Box key={index} sx={{ 
              flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 32px)', md: '1 1 calc(20% - 32px)' },
              minWidth: { xs: '100%', sm: '280px', md: '200px' },
              maxWidth: { xs: '100%', sm: '350px', md: '240px' },
              height: { xs: 'auto', sm: '220px', md: '200px' },
              display: 'flex',
              flexDirection: 'column'
            }}>
              <BenefitCard>
                <IconWrapper className="icon-wrapper">
                  <benefit.icon
                    sx={{
                      fontSize: 40,
                      color: '#00f0ff',
                      filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.5))',
                    }}
                  />
                </IconWrapper>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 900,
                    mb: 0,
                    color: '#ffffff',
                    fontSize: { xs: '0.95rem', sm: '1rem', md: '1.05rem' },
                    lineHeight: 1.4,
                    fontFamily: 'inherit',
                  }}
                >
                  {benefit.title}
                </Typography>
              </BenefitCard>
            </Box>
          ))}
        </Box>

      </Container>
    </BenefitsSection>
  );
}
