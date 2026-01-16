import {
  Box,
  Container,
  Typography,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

const MainSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6, 0),
  minHeight: '80vh',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#f5f5f5',
}));

const GridContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

const TwoColumnRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

const GradientPanel = styled(Box)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: theme.spacing(6, 4),
  minHeight: '400px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  [theme.breakpoints.down('md')]: {
    minHeight: '300px',
    padding: theme.spacing(4, 3),
  },
}));

const Panel1 = styled(GradientPanel)({
  background: 'linear-gradient(135deg, #d63384 0%, #e91e63 50%, #f8bbd0 100%)',
});

const Panel2 = styled(GradientPanel)({
  background: 'linear-gradient(135deg, #4c63d2 0%, #6c5ce7 50%, #a29bfe 100%)',
});

const Panel3 = styled(GradientPanel)({
  background: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 50%, #64b5f6 100%)',
});

const Panel4 = styled(GradientPanel)({
  background: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 50%, #90caf9 100%)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.1)',
    zIndex: 1,
  },
});

const Headline = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '2.5rem',
  lineHeight: 1.2,
  marginBottom: theme.spacing(2),
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  position: 'relative',
  zIndex: 2,
  [theme.breakpoints.down('md')]: {
    fontSize: '1.8rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
  },
}));

const Subtext = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: '1.1rem',
  lineHeight: 1.6,
  opacity: 0.95,
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  position: 'relative',
  zIndex: 2,
  [theme.breakpoints.down('md')]: {
    fontSize: '1rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.9rem',
  },
}));

const UIScreenshot = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  minHeight: '300px',
  borderRadius: theme.spacing(2),
  background: '#1a1a1a',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  position: 'relative',
  zIndex: 2,
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    minHeight: '250px',
  },
}));

const ScreenshotContent = styled(Box)({
  padding: '20px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'monospace',
  fontSize: '12px',
  color: '#e0e0e0',
});

const ScreenshotHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '20px',
  paddingBottom: '12px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
});

const ScreenshotSidebar = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginBottom: '20px',
});

const ScreenshotMain = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

const TaskItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '4px 0',
  color: '#b0b0b0',
});

const CtaButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f2c514 0%, rgba(242, 198, 20, 0.8) 100%)',
                color: '#000',
                fontWeight: 700,
  padding: theme.spacing(1.5, 4),
                fontSize: '1rem',
  borderRadius: theme.spacing(3),
                textTransform: 'none',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 6px 24px rgba(211, 47, 47, 0.3)',
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  marginTop: theme.spacing(2),
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
}));

export default function HomeTrustedBusinesses() {
  return (
    <MainSection>
      <Container maxWidth="xl">
        <GridContainer>
          {/* Row 1: Full Width - Panel1 */}
          <Panel1 sx={{ width: '100%' }}>
            <Headline>
              FIND YOUR NEXT COMMERCIAL SPACE
            </Headline>
            <Subtext sx={{ mb: 2 }}>
              with CommercialUK
            </Subtext>
            <Subtext>
              CommercialUK simplifies the property search journey for purchasers and tenants by enabling them to locate the most suitable commercial property in less time by:
            </Subtext>
          </Panel1>

          {/* Row 2: Two Columns - Panel2 and Panel3 */}
          <TwoColumnRow>
            <Panel2>
              <Headline>
                Accessing a Wide Range of Properties
              </Headline>
              <Subtext>
                Discover offices, retail spaces, warehouses, and investment options across the UK — all in one place.
              </Subtext>
            </Panel2>

            <Panel3>
              <Headline>
                Viewing Verified Listings with Professional Details
              </Headline>
              <Subtext sx={{ mb: 3 }}>
                See up-to-date details, floor plans, and quality images to make confident decisions
              </Subtext>
              <Headline sx={{ fontSize: '1.5rem', mb: 2 }}>
                Connecting Directly with Agents and Landlords
              </Headline>
              <Subtext>
                Request info, book viewings, and secure your ideal space quickly and easily.
              </Subtext>
            </Panel3>
          </TwoColumnRow>

          {/* Row 3: Full Width - Panel4 */}
          <Panel4 sx={{ width: '100%' }}>
            <Headline>
              Begin advertising with CommercialUK today
            </Headline>
            <Subtext>
              Reach businesses and investors actively looking for property.
            </Subtext>
            <CtaButton
              variant="contained"
              size="large"
              href="/auth/login"
              sx={{ position: 'relative', zIndex: 2 }}
            >
              🚀 Start Listing Today
            </CtaButton>
            <UIScreenshot sx={{ mt: 3 }}>
              <ScreenshotContent>
                <ScreenshotHeader>
                  <Box sx={{ width: '12px', height: '12px', borderRadius: '50%', bgcolor: '#ff5f57' }} />
                  <Box sx={{ width: '12px', height: '12px', borderRadius: '50%', bgcolor: '#ffbd2e' }} />
                  <Box sx={{ width: '12px', height: '12px', borderRadius: '50%', bgcolor: '#28ca42' }} />
                  <Typography sx={{ ml: 2, fontSize: '11px', color: '#888' }}>CommercialUK Platform</Typography>
                </ScreenshotHeader>
                
                <Box sx={{ display: 'flex', gap: 3, height: '100%' }}>
                  <ScreenshotSidebar sx={{ minWidth: '180px' }}>
                    <Box sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>Navigation</Box>
                    <Box sx={{ color: '#888' }}>New Listing</Box>
                    <Box sx={{ color: '#888' }}>My Properties</Box>
                    <Box sx={{ color: '#888' }}>Saved Searches</Box>
                    <Box sx={{ color: '#888' }}>Analytics</Box>
                    <Box sx={{ color: '#888' }}>Teams</Box>
                    <Box sx={{ color: '#888' }}>Settings</Box>
                  </ScreenshotSidebar>
                  
                  <ScreenshotMain sx={{ flex: 1 }}>
                    <Box sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>Active Listings</Box>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ color: '#888', mb: 1, fontSize: '10px' }}>In Progress (2)</Box>
                      <TaskItem>
                        <Box sx={{ width: '12px', height: '12px', border: '1px solid #888', borderRadius: '2px' }} />
                        <Box>LND-248 Release new property listings</Box>
                      </TaskItem>
                      <TaskItem>
                        <Box sx={{ width: '12px', height: '12px', border: '1px solid #888', borderRadius: '2px' }} />
                        <Box>LND-210 Design property showcase assets</Box>
                      </TaskItem>
              </Box>
                    <Box>
                      <Box sx={{ color: '#888', mb: 1, fontSize: '10px' }}>Completed (4)</Box>
                      <TaskItem>
                        <Box sx={{ width: '12px', height: '12px', border: '1px solid #4caf50', borderRadius: '2px', bgcolor: '#4caf50' }} />
                        <Box sx={{ color: '#888' }}>LND-344 Enable property data transmission</Box>
                      </TaskItem>
                      <TaskItem>
                        <Box sx={{ width: '12px', height: '12px', border: '1px solid #4caf50', borderRadius: '2px', bgcolor: '#4caf50' }} />
                        <Box sx={{ color: '#888' }}>LND-462 Launch property search features</Box>
                      </TaskItem>
                      <TaskItem>
                        <Box sx={{ width: '12px', height: '12px', border: '1px solid #4caf50', borderRadius: '2px', bgcolor: '#4caf50' }} />
                        <Box sx={{ color: '#888' }}>LND-248 Replace property screenshots</Box>
                      </TaskItem>
                      <TaskItem>
                        <Box sx={{ width: '12px', height: '12px', border: '1px solid #4caf50', borderRadius: '2px', bgcolor: '#4caf50' }} />
                        <Box sx={{ color: '#888' }}>LND-247 Add property details</Box>
                      </TaskItem>
          </Box>
                  </ScreenshotMain>
          </Box>
              </ScreenshotContent>
            </UIScreenshot>
          </Panel4>
        </GridContainer>
        </Container>
    </MainSection>
  );
}
