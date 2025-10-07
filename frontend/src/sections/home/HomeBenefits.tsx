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
  padding: theme.spacing(8, 0),
  backgroundImage: 'url("https://t4.ftcdn.net/jpg/07/65/52/03/360_F_765520370_deyZELJd9dKt4hmXW9a4in6RumicRzCn.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)',
    backdropFilter: 'blur(1px)',
  },
}));

const BenefitCard = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  color: 'white',
  position: 'relative',
  zIndex: 1,
  padding: theme.spacing(3, 2),
  borderRadius: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  '&:hover': {
    transform: 'translateY(-5px)',
    background: 'rgba(255, 255, 255, 0.15)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
  },
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
    description: 'Why Choose CommercialUK',
  },
  {
    icon: ListIcon,
    title: 'Broad Listings',
    description: 'Why Choose CommercialUK',
  },
  {
    icon: PublicIcon,
    title: 'International Exposure',
    description: 'Why Choose CommercialUK',
  },
  {
    icon: SpeedIcon,
    title: 'Quicker Deals',
    description: 'Why Choose CommercialUK',
  },
  {
    icon: TrendingUpIcon,
    title: 'Stronger Marketing',
    description: 'Why Choose CommercialUK',
  },
];

export default function HomeBenefits() {
  return (
    <BenefitsSection>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6, position: 'relative', zIndex: 1 }}>
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
        </Box>

        {/* Separator Line */}
        <Box sx={{ 
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
        </Box>

        <Box sx={{ textAlign: 'center', mb: 6, position: 'relative', zIndex: 1 }}>
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
            Why Choose CommercialUK
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3, 
          mb: 6,
          justifyContent: 'center'
        }}>
          {whyChooseBenefits.map((benefit, index) => (
            <Box key={index} sx={{ 
              flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 24px)', md: '1 1 calc(20% - 24px)' },
              minWidth: { xs: '100%', sm: '250px', md: '180px' },
              maxWidth: { xs: '100%', sm: '300px', md: '220px' },
              height: { xs: 'auto', sm: '200px', md: '180px' },
              display: 'flex',
              flexDirection: 'column'
            }}>
              <BenefitCard>
                <benefit.icon
                  sx={{
                    fontSize: 48,
                    mb: 2,
                    color: 'white',
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: 'white',
                    fontSize: '1rem',
                  }}
                >
                  {benefit.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: 1.4,
                    fontSize: '0.85rem',
                  }}
                >
                  {benefit.description}
                </Typography>
              </BenefitCard>
            </Box>
          ))}
        </Box>

      </Container>
    </BenefitsSection>
  );
}
