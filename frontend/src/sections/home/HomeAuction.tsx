import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

const AuctionSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 2),
  background: 'linear-gradient(180deg, #f2c514 0%,rgb(140, 122, 51) 100%)',
  position: 'relative',
  overflow: 'visible',
  borderRadius: theme.spacing(4),
  margin: theme.spacing(4, 2),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)
    `,
    backgroundSize: '20px 20px',
    opacity: 0.3,
    zIndex: 0,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    opacity: 0.5,
    mixBlendMode: 'overlay',
    pointerEvents: 'none',
    zIndex: 1,
    backgroundSize: '150px 150px',
    borderRadius: theme.spacing(4),
  },
}));

const AuctionCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  height: '100%',
  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  zIndex: 1,
  border: '1px solid rgba(255,255,255,0.1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 25px 70px rgba(0,0,0,0.4)',
  },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  padding: theme.spacing(2, 0),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  height: '100%',
}));

export default function HomeAuction() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <AuctionSection>
      <Container maxWidth="xl" sx={{ position: 'relative', overflow: 'visible' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            gap: { xs: 4, md: 6, lg: 8 },
            alignItems: 'center',
            minHeight: { xs: 'auto', md: '600px' },
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Content Section - Left Side */}
          <Box 
            sx={{ 
              flex: { xs: '1', lg: '0 0 50%' }, 
              width: { xs: '100%', lg: '50%' },
              position: 'relative',
              zIndex: 2,
            }}
          >
            <ContentBox sx={{ pr: { xs: 0, lg: 4 } }}>
              <Typography
                variant={isMobile ? "h4" : isTablet ? "h3" : "h2"}
                component="h2"
                sx={{
                  fontWeight: 400,
                  mb: { xs: 2, md: 3 },
                  color: '#ffffff',
                  lineHeight: 1.2,
                  fontSize: { xs: '1.75rem', md: '2.25rem', lg: '2.75rem' },
                  fontStyle: 'normal',
                }}
              >
                Trusted by Leading Businesses
              </Typography>

              <Typography
                variant={isMobile ? "body2" : "body1"}
                sx={{
                  color: '#d6d6d6',
                  lineHeight: 1.7,
                  mb: { xs: 3, md: 4 },
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  fontWeight: 400,
                  fontStyle: 'normal',
                }}
              >
                Trusted by Leading Businesses From start-ups to multinational corporations, CommercialUK is the market of choice for locating office space, retail units, and industrial property. Our site is employed by investors, agents, landlords, and developers keen to speed up the deal.
              </Typography>

              <Stack spacing={{ xs: 2, md: 3 }}>
                <Button
                  variant="contained"
                  fullWidth={isMobile}
                  href="/general/all-properties"
                  sx={{
                    backgroundColor: '#ffffff',
                    color: '#357abd',
                    fontWeight: 700,
                    py: { xs: 1.5, md: 2 },
                    borderRadius: 2,
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    textTransform: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
                    },
                  }}
                >
                  Explore More
                </Button>
              </Stack>
            </ContentBox>
          </Box>

          {/* Card Section - Right Side */}
          <Box 
            sx={{ 
              position: { xs: 'relative', lg: 'absolute' },
              right: { xs: 'auto', lg: '-25%' },
              top: { xs: 'auto', lg: '50%' },
              transform: { xs: 'none', lg: 'translateY(-50%)' },
              width: { xs: '100%', lg: '50%' },
              height: { xs: '300px', md: '400px', lg: '500px' },
              overflow: 'visible',
              zIndex: 1,
            }}
          >
            <AuctionCard
              sx={{
                position: 'absolute',
                right: { xs: 0, lg: '-50%' },
                width: { xs: '100%', lg: '200%' },
                height: '100%',
                maxWidth: { xs: '100%', lg: 'none' },
              }}
            >
              <Box sx={{ position: 'relative', height: '100%' }}>
                <CardMedia
                  component="img"
                  height="100%"
                  image="/images/auction.jpg"
                  alt="Commercial Property Platform"
                  sx={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                    display: 'block',
                  }}
                />
              </Box>
            </AuctionCard>
          </Box>
        </Box>
      </Container>
    </AuctionSection>
  );
}
