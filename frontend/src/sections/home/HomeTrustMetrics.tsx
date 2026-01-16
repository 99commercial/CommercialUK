import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

const TrustSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6, 0),
  backgroundColor: '#ffffff',
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(10, 0),
  },
}));

const MetricCard = styled(Box)(({ theme }) => ({
  textAlign: 'left',
  padding: theme.spacing(3, 2.5),
  position: 'relative',
  backgroundColor: '#000000',
  borderRadius: theme.spacing(2),
  border: '1px solid #1a1a1a',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    opacity: 0,
    transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
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
  },
  '& > *': {
    position: 'relative',
    zIndex: 2,
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 16px 32px rgba(102, 126, 234, 0.3)',
    '&::before': {
      opacity: 1,
    },
    '&::after': {
      opacity: 0.6,
    },
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2.5, 2),
  },
}));

const CompanyLogo = styled('img')(({ theme }) => ({
  width: 150,  // Bigger default width
  height: 100, // Bigger default height
  objectFit: 'contain',
  flexShrink: 0,
  filter: 'grayscale(100%) opacity(0.7)',
  transition: 'filter 0.3s ease, transform 0.3s ease',
  '&:hover': {
    filter: 'grayscale(0%) opacity(1)',
    transform: 'scale(1.05)', // Slight zoom effect on hover
  },

  // Small screens
  [theme.breakpoints.up('sm')]: {
    width: 130,
    height: 80,
  },

  // Medium screens
  [theme.breakpoints.up('md')]: {
    width: 170,
    height: 110,
  },

  // Large screens
  [theme.breakpoints.up('lg')]: {
    width: 200,
    height: 130,
  },
}));


const InfiniteScrollContainer = styled(Box)(({ theme }) => ({
  overflow: 'hidden',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent:"space-around",
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '50px',
    height: '100%',
    background: 'linear-gradient(to right, #f8f9fa, transparent)',
    zIndex: 2,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50px',
    height: '100%',
    background: 'linear-gradient(to left, #f8f9fa, transparent)',
    zIndex: 2,
  },
}));


const ScrollingContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between", // Distribute logos evenly
  alignItems: "center",
  width: "100%", // Always cover full width
  animationTimingFunction: "linear",
  animationIterationCount: "infinite",
  animationFillMode: "forwards",
  animationName: "marquee",
  "&:hover": {
    animationPlayState: "paused",
  },
  "@keyframes marquee": {
    "0%": {
      transform: "translateX(0)",
    },
    "100%": {
      transform: "translateX(-104%)",
    },
  },
}));


const companies = [
  { name: 'Amazon', logo: 'https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png' },
  { name: 'Google', logo: 'https://logos-world.net/wp-content/uploads/2020/09/Google-Logo.png' },
  { name: 'IBM', logo: 'https://logos-world.net/wp-content/uploads/2020/09/IBM-Logo.png' },
  { name: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png' },
  { name: 'Ernst & Young', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/EY_logo_2019.svg/1024px-EY_logo_2019.svg.png' },
  { name: 'KPMG', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGncmprKJx4GqdC2g3f0aEHkYSOB2T6aufLw&s' },
];

export default function HomeTrustMetrics() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <TrustSection>
      <Container maxWidth="lg" sx={{ maxWidth: '100%' }}>
        <Typography
          variant={isMobile ? "h5" : "h3"}
          sx={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontWeight: 800,
            color: '#1a1a1a',
            lineHeight: 1.2,
            mb: { xs: 4, md: 6 },
            textAlign: 'center',
            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem', lg: '3.25rem' },
            letterSpacing: '-0.03em',
          }}
        >
          The Smarter Way to Sell or Let{' '}
          <Box component="span" sx={{ display: { xs: 'block', sm: 'inline' } }}>
          Commercial Property
          </Box>
        </Typography>

        <Box
          sx={{
            width: '100%',
          }}
        >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(3, 1fr)',
                },
                gap: { xs: 2.5, sm: 3, md: 3.5 },
              }}
            >
              <MetricCard
                sx={{
                  '&::before': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  },
                  '&:hover': {
                    boxShadow: '0 16px 32px rgba(102, 126, 234, 0.3)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    transition: 'background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    },
                  }}
                >
                  <Box
                    component="svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    sx={{ color: '#ffffff' }}
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                      fill="currentColor"
                    />
                  </Box>
                </Box>
                <Typography
                  variant={isMobile ? "h5" : "h6"}
                  sx={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 900,
                    color: '#ffffff',
                    mb: 1.5,
                    fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem' },
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Reach the Right People
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{ 
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontSize: { xs: '0.9375rem', sm: '1rem', md: '1.0625rem' },
                    fontWeight: 400,
                    lineHeight: 1.6,
                    letterSpacing: '0.01em',
                  }}
                >
                  Connect with your ideal audience and grow your impact effortlessly.
                </Typography>
              </MetricCard>

              <MetricCard
                sx={{
                  '&::before': {
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  },
                  '&:hover': {
                    boxShadow: '0 16px 32px rgba(245, 87, 108, 0.3)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    transition: 'background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    },
                  }}
                >
                  <Box
                    component="svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    sx={{ color: '#ffffff' }}
                  >
                    <path
                      d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
                      fill="currentColor"
                    />
                  </Box>
                </Box>
                <Typography
                  variant={isMobile ? "h5" : "h6"}
                  sx={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 900,
                    color: '#ffffff',
                    mb: 1.5,
                    fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem' },
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Easy-to-Use Platform
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{ 
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontSize: { xs: '0.9375rem', sm: '1rem', md: '1.0625rem' },
                    fontWeight: 400,
                    lineHeight: 1.6,
                    letterSpacing: '0.01em',
                  }}
                >
                 Manage everything smoothly with our simple, intuitive interface.
                </Typography>
              </MetricCard>

              <MetricCard
                sx={{
                  '&::before': {
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  },
                  '&:hover': {
                    boxShadow: '0 16px 32px rgba(79, 172, 254, 0.3)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    transition: 'background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    },
                  }}
                >
                  <Box
                    component="svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    sx={{ color: '#ffffff' }}
                  >
                    <path
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                      fill="currentColor"
                    />
                  </Box>
                </Box>
                <Typography
                  variant={isMobile ? "h5" : "h6"}
                  sx={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 900,
                    color: '#ffffff',
                    mb: 1.5,
                    fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem' },
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Property Solutions for Every Business
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{ 
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontSize: { xs: '0.9375rem', sm: '1rem', md: '1.0625rem' },
                    fontWeight: 400,
                    lineHeight: 1.6,
                    letterSpacing: '0.01em',
                  }}
                >
                  Find the perfect property tailored to your business needs.
                </Typography>
              </MetricCard>
            </Box>
        </Box>

        {/* <Box sx={{ mt: { xs: 4, md: 6 }, textAlign: 'center' }}>
          <Typography
            variant={isMobile ? "body1" : "h6"}
            sx={{
              mb: { xs: 3, md: 4 },
              color: '#666',
              fontWeight: 500,
              fontSize: { xs: '0.9rem', sm: '1rem' },
            }}
          >
            Companies actively searching on LoopNet
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 4, sm: 5 } }}>
            <InfiniteScrollContainer>
            <ScrollingContent sx={{ animationDuration: "20s" }}>
              {[...companies].map((company, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1, // Makes logos evenly distributed
                  }}
                >
                  <CompanyLogo
                    src={company.logo}
                    alt={company.name}
                    style={{ height: 40, objectFit: "contain" }}
                  />
                </Box>
              ))}
              {[...companies].map((company, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1, // Makes logos evenly distributed
                  }}
                >
                  <CompanyLogo
                    src={company.logo}
                    alt={company.name}
                    style={{ height: 40, objectFit: "contain" }}
                  />
                </Box>
              ))}
            </ScrollingContent>
            </InfiniteScrollContainer>
          </Box>

        </Box> */}
        
      </Container>
    </TrustSection>
  );
}
