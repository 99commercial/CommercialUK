import React from 'react';
import { NextPage } from 'next';
import { Page } from '@/components';
import {
  Box,
  Button,
  Chip,
  Container,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
} from '@mui/material';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import CampaignIcon from '@mui/icons-material/Campaign';
import EmailIcon from '@mui/icons-material/Email';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InsightsIcon from '@mui/icons-material/Insights';
import UploadIcon from '@mui/icons-material/Upload';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import MapIcon from '@mui/icons-material/Map';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';

const Advertise: NextPage = () => {
  return (
    <Page
      title="Advertise with CommercialUK"
      meta={
        <meta
          name="description"
          content="Market your commercial property with CommercialUK. Listing options, banner advertising, email alert sponsorship, and what's included."
        />
      }
    >
      {/* Hero */}
      <Box
        sx={{
          position: 'relative',
          py: { xs: 8, md: 14 },
          color: 'common.white',
          background:
            'linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(https://www.shutterstock.com/image-photo/modern-minimalist-twostory-house-flat-600nw-2493365641.jpg) center/cover no-repeat',
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={2} alignItems="flex-start">
            <Chip label="Advertise on CommercialUK" sx={{ bgcolor: 'error.light', color: 'error.contrastText', fontWeight: 700 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              Market a Property with CommercialUK
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: 900, opacity: 0.9 }}>
              Engage serious purchasers, tenants, and investors across the UK with tailored marketing.
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Stack spacing={6}>
            {/* Listing Options */}
            <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, borderLeft: (t) => `4px solid ${t.palette.error.light}`, background:
              'linear-gradient(135deg, rgba(244,67,54,0.06), rgba(244,67,54,0.02))' }}>
              <Stack spacing={2}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
                  Listing Options
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Booking your commercial property on CommercialUK is more than just visibility—it's about engaging serious purchasers, tenants, and investors all over the UK. We offer agents, landlords, and developers an effortless, efficient, and customized marketing solution created specifically for commercial property UK.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  You are free to book single properties (with flexible invoice options) or sign up for a subscription package to feature your full portfolio at competitive prices.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PriceCheckIcon color="error" />
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>Individual listings: Only £75 (+VAT) for 6 months or £130 (+VAT) for a year</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <InsightsIcon color="error" />
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>Subscriptions: Great for agents or landlords with 6+ properties</Typography>
                  </Stack>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <InsertDriveFileIcon color="error" />
                  <Typography variant="body1" color="text.secondary">
                    Get a quote today, email your property brochures to <strong>listings@commercialuk.com</strong>, or log in and begin adding your listings immediately.
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Free basic listings for some UK areas are also available, which are usually sponsored by local councils or property partnerships, promoting maximum exposure for your availability.
                </Typography>
              </Stack>
            </Paper>

            {/* What's Included */}
            <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, borderLeft: (t) => `4px solid ${t.palette.error.light}` }}>
              <Stack spacing={2}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
                  What's Included
                </Typography>
                <List dense>
                  <ListItem>
                    <CheckCircleIcon color="error" sx={{ mr: 1 }} />
                    <ListItemText primary="Detail listings – unrestricted text, attachments, high-quality images, maps, and links." />
                  </ListItem>
                  <ListItem>
                    <ImageIcon color="error" sx={{ mr: 1 }} />
                    <ListItemText primary="Smooth experience – a completely responsive mobile platform for effortless browsing." />
                  </ListItem>
                  <ListItem>
                    <PhoneInTalkIcon color="error" sx={{ mr: 1 }} />
                    <ListItemText primary="Don't miss an enquiry – local rate monitored numbers, email forwarding on missed calls." />
                  </ListItem>
                  <ListItem>
                    <EmailIcon color="error" sx={{ mr: 1 }} />
                    <ListItemText primary="Intelligent marketing – new and current properties emailed straight to active occupiers." />
                  </ListItem>
                  <ListItem>
                    <AssessmentIcon color="error" sx={{ mr: 1 }} />
                    <ListItemText primary="Performance monitoring – access enquiries, page views, and brochure downloads in your dashboard." />
                  </ListItem>
                  <ListItem>
                    <UploadIcon color="error" sx={{ mr: 1 }} />
                    <ListItemText primary="Data feed supported – for bulk uploads (minimum numbers of properties apply)." />
                  </ListItem>
                  <ListItem>
                    <SupportAgentIcon color="error" sx={{ mr: 1 }} />
                    <ListItemText primary="Committed customer service – our staff guarantee your listings are precise, optimised, and hassle-free." />
                  </ListItem>
                  <ListItem>
                    <AssessmentIcon color="error" sx={{ mr: 1 }} />
                    <ListItemText primary="Advanced reporting facilities – export search and reporting data to Excel, PDF, or Word for presentations." />
                  </ListItem>
                  <ListItem>
                    <CampaignIcon color="error" sx={{ mr: 1 }} />
                    <ListItemText primary="Company promotion – showcase your agents in prominent positions in our UK commercial property marketplace." />
                  </ListItem>
                  <ListItem>
                    <InsightsIcon color="error" sx={{ mr: 1 }} />
                    <ListItemText primary="Extra marketing – target occupiers through newsletters, social media, and specific regional promotions." />
                  </ListItem>
                  <ListItem>
                    <MapIcon color="error" sx={{ mr: 1 }} />
                    <ListItemText primary="Commercial only – listings designed for offices to let UK, retail units to let, industrial space to rent UK, warehouse units to rent UK, and office coworking space to let." />
                  </ListItem>
                </List>
              </Stack>
            </Paper>

            {/* Banner Advertising */}
            <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, borderLeft: (t) => `4px solid ${t.palette.error.light}`, background:
              'linear-gradient(135deg, rgba(244,67,54,0.06), rgba(244,67,54,0.02))' }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CampaignIcon color="error" />
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    Banner Advertising
                  </Typography>
                </Stack>
                <Typography variant="body1" color="text.secondary">
                  Increase visibility with targeted banner ads on CommercialUK. Banners are carefully positioned at the foot of prominent property pages, visible to thousands of occupiers and investors every day.
                </Typography>
                <List dense>
                  <ListItem>
                    <MapIcon color="error" sx={{ mr: 1 }} />
                    <ListItemText primary="Targeting options: By property type (e.g., office premises for rent UK, warehouses to let near me, shops to let UK) and by area." />
                  </ListItem>
                  <ListItem>
                    <PriceCheckIcon color="error" sx={{ mr: 1 }} />
                    <ListItemText primary="Pricing: £35 per 1,000 impressions (min. £350). Discounts for bulk campaigns." />
                  </ListItem>
                  <ListItem>
                    <ImageIcon color="error" sx={{ mr: 1 }} />
                    <ListItemText primary="Format: 728 x 90 banners for optimal impact." />
                  </ListItem>
                </List>
              </Stack>
            </Paper>

            {/* Email Alert Sponsorship */}
            <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, borderLeft: (t) => `4px solid ${t.palette.error.light}` }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EmailIcon color="error" />
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    Email Alert Sponsorship
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircleIcon color="error" />
                  <Typography variant="body1" color="text.secondary">
                    With more than 40,000 registered occupiers actively looking for business property to rent near me, freehold commercial property to buy UK, warehouse rental UK, and commercial property investment UK, our email alerts guarantee your property reaches the desired audience.
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EmailIcon color="error" />
                  <Typography variant="body1" color="text.secondary">
                    Whenever a corresponding property is advertised, an email goes directly to relevant occupiers. Position your branded banner at the bottom of these alerts and get highly targeted leads.
                  </Typography>
                </Stack>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Minimum order: £1,000 (+VAT)</Typography>
              </Stack>
            </Paper>

            <Divider />

            {/* Why CommercialUK */}
            <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, borderLeft: (t) => `4px solid ${t.palette.error.light}`, background:
              'linear-gradient(135deg, rgba(244,67,54,0.06), rgba(244,67,54,0.02))' }}>
              <Stack spacing={2}>
                <Typography variant="overline" color="error" sx={{ fontWeight: 700 }}>
                  Why CommercialUK?
                </Typography>
                <List dense>
                  <ListItem>
                    <CheckCircleIcon color="error" sx={{ mr: 1 }} />
                    <ListItemText primary="Reliable commercial property marketplace for landlords, agents, and developers." />
                  </ListItem>
                  <ListItem>
                    <CheckCircleIcon color="error" sx={{ mr: 1 }} />
                    <ListItemText primary="Listings optimized for buying, selling, renting, and leasing commercial property in the UK." />
                  </ListItem>
                  <ListItem>
                    <CheckCircleIcon color="error" sx={{ mr: 1 }} />
                    <ListItemText primary="Coverage from office buildings for sale, industrial units, retail space, warehouses, restaurants to let, and small commercial properties for sale UK." />
                  </ListItem>
                  <ListItem>
                    <CheckCircleIcon color="error" sx={{ mr: 1 }} />
                    <ListItemText primary="Strong reach for commercial property investors UK, making us a popular destination for UK commercial property investment opportunities." />
                  </ListItem>
                </List>
              </Stack>
            </Paper>

            {/* CTA */}
            <Paper
              variant="outlined"
              sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, textAlign: 'center', background:
                'linear-gradient(135deg, rgba(244,67,54,0.06), rgba(244,67,54,0.02))' }}
            >
              <Stack spacing={2} alignItems="center">
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
                  Ready to reach more occupiers and investors?
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Start listing today or contact our team for tailored advice.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button variant="contained" color="error" startIcon={<UploadIcon />}>Get Started</Button>
                  <Button variant="outlined" color="error" startIcon={<MailOutlineIcon />} href="mailto:listings@commercialuk.com">Contact Sales</Button>
                </Stack>
              </Stack>
            </Paper>
          </Stack>
        </Container>
      </Box>
    </Page>
  );
};

export default Advertise;


