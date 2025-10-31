import {
  Box,
  Container,
  Typography,
  Link,
  Stack,
  Divider,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import NextLink from 'next/link';

// ----------------------------------------------------------------------

const FooterSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#1a1a1a',
  color: 'white',
  padding: theme.spacing(6, 0, 2),
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: '#ccc',
  textDecoration: 'none',
  fontSize: '0.875rem',
  '&:hover': {
    color: 'white',
    textDecoration: 'underline',
  },
}));

const FooterTitle = styled(Typography)(({ theme }) => ({
  color: 'white',
  fontWeight: 600,
  fontSize: '0.875rem',
  marginBottom: theme.spacing(2),
}));

const footerLinks = {
  search: [
    'Properties For Sale',
    'Properties For Lease',
    'Auctions',
    'Businesses For Sale',
    'International',
  ],
  products: [
    'Advertise With Us',
    'Showcase',
    'LoopNet Pro',
    'CoStar',
    'Apartments.com',
  ],
  marketplace: [
    'Office Buildings',
    'Retail Properties',
    'Industrial Properties',
    'Land',
    'Multifamily',
  ],
  resources: [
    'Market Research',
    'Broker Directory',
    'Space Calculator',
    'Commercial Real Estate News',
    'Investment Calculator',
  ],
  company: [
    'About Us',
    'Contact Us',
    'Careers',
    'Press',
    'Investor Relations',
  ],
};

export default function HomeFooter() {
  return (
    <FooterSection>
      <Container maxWidth="lg">
        {/* Pages Section - Above all other details */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ mb: 3 }}>
            <FooterTitle>Pages</FooterTitle>
            <Stack spacing={1}>
              <NextLink href="/property-for-rent" passHref legacyBehavior>
                <FooterLink>Property For Rent</FooterLink>
              </NextLink>
              <NextLink href="/property-for-sale" passHref legacyBehavior>
                <FooterLink>Property For Sale</FooterLink>
              </NextLink>
            </Stack>
          </Box>
        </Box>

        {/* Top Navigation Tabs */}
        {/* <Box sx={{ mb: 4 }}>
          <Stack
            direction="row"
            spacing={4}
            sx={{
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            {['For Sale', 'For Lease', 'Coworking', 'Auctions', 'Businesses For Sale', 'International'].map((tab) => (
              <FooterLink key={tab} href="#">
                {tab}
              </FooterLink>
            ))}
          </Stack>
        </Box> */}

        {/* Main Footer Content */}
        {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 4 }}>
          {Object.entries(footerLinks).map(([category, links]) => (
            <Box key={category} sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <FooterTitle variant="h6">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </FooterTitle>
              <Stack spacing={1}>
                {links.map((link) => (
                  <FooterLink key={link} href="#">
                    {link}
                  </FooterLink>
                ))}
              </Stack>
            </Box>
          ))}
        </Box>

        <Divider sx={{ backgroundColor: '#333', mb: 4 }} /> */}

        {/* Bottom Footer */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
          <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: '#d32f2f',
                  mr: 1,
                }}
              >
                CommercialUK
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
            <Stack direction="row" spacing={2} justifyContent="center">
              <IconButton
                sx={{
                  color: '#ccc',
                  '&:hover': {
                    color: '#0077b5',
                  },
                }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: '#ccc',
                  '&:hover': {
                    color: '#1877f2',
                  },
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: '#ccc',
                  '&:hover': {
                    color: '#e4405f',
                  },
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: '#ccc',
                  '&:hover': {
                    color: '#1da1f2',
                  },
                }}
              >
                <TwitterIcon />
              </IconButton>
            </Stack>
          </Box>

          <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
            <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#999',
                  mb: 1,
                }}
              >
                © 2025 CommercialUK
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                justifyContent={{ xs: 'center', md: 'flex-end' }}
              >
                <Box
                  component="img"
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="Download on the App Store"
                  sx={{ height: 40 }}
                />
                <Box
                  component="img"
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  alt="Get it on Google Play"
                  sx={{ height: 40 }}
                />
              </Stack>
            </Box>
          </Box>
        </Box>
      </Container>
    </FooterSection>
  );
}
