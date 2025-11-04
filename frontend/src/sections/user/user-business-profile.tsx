import React from 'react';
import {
  Box,
  Card,
  Typography,
  Divider,
  Chip,
  Paper,
  Grid,
  Avatar,
} from '@mui/material';
import { 
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckCircleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  Verified as VerifiedIcon,
  CreditCard as CreditCardIcon,
  Badge as BadgeIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  Info as InfoIcon,
  AccessTime as AccessTimeIcon,
  Store as StoreIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  border: 'none',
  background: '#ffffff',
  overflow: 'visible',
  marginBottom: theme.spacing(3),
  position: 'relative',
}));

const BusinessHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(5),
  background: `
    linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%),
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(0, 0, 0, 0.03) 10px,
      rgba(0, 0, 0, 0.03) 20px
    )
  `,
  backgroundSize: '100% 100%, 100% 100%, 100% 100%, 40px 40px',
  color: 'white',
  borderRadius: '16px 16px 0 0',
  position: 'relative',
  marginBottom: 0,
  boxShadow: '0 8px 32px rgba(220, 38, 38, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  overflow: 'visible',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, transparent 0%, rgba(0, 0, 0, 0.1) 100%)',
    pointerEvents: 'none',
    borderRadius: '16px 16px 0 0',
    overflow: 'hidden',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
  },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  background: '#ffffff',
  borderRadius: '0 0 16px 16px',
  padding: theme.spacing(4, 3),
  marginTop: 0,
  paddingTop: theme.spacing(4),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(5, 4),
    paddingTop: theme.spacing(5),
  },
}));

const InfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 0,
  background: '#ffffff',
  border: 'none',
  boxShadow: 'none',
}));

const BusinessHoursCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: 12,
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-1px)',
  },
}));

const StatusBadge = styled(Box)<{ status: 'open' | 'closed' }>(({ theme, status }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
  borderRadius: 20,
  fontSize: '0.75rem',
  fontWeight: 600,
  backgroundColor: status === 'open' ? '#10b981' : '#6b7280',
  color: 'white',
  minWidth: 60,
  justifyContent: 'center',
}));

const WorkingHours = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: '#6b7280',
  fontWeight: 500,
  marginTop: theme.spacing(0.5),
}));

const ServiceChip = styled(Chip)<{ active?: boolean }>(({ theme, active }) => ({
  borderRadius: 20,
  fontWeight: 500,
  fontSize: '0.875rem',
  padding: theme.spacing(0.5, 1.5),
  height: 32,
  background: active ? '#dc2626' : '#f3f4f6',
  color: active ? 'white' : '#6b7280',
  border: active ? 'none' : '1px solid #d1d5db',
}));

const StatusChip = styled(Chip)<{ status: 'open' | 'closed' | 'active' | 'inactive' }>(({ theme, status }) => ({
  borderRadius: 20,
  fontWeight: 500,
  fontSize: '0.75rem',
  padding: theme.spacing(0.25, 1),
  height: 24,
  background: status === 'open' || status === 'active' ? '#10b981' : '#ef4444',
  color: 'white',
  border: 'none',
}));

const InfoField = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  borderRadius: 12,
  background: '#f9fafb',
  border: '1px solid #e5e7eb',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: '#f3f4f6',
    borderColor: '#dc2626',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.1)',
  },
}));

const FieldLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: theme.spacing(1),
  fontFamily: '"Inter", sans-serif',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const FieldValue = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 500,
  color: '#1f2937',
  fontFamily: '"Inter", sans-serif',
  lineHeight: 1.6,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: '#dc2626',
  marginBottom: theme.spacing(3),
  fontFamily: '"Poppins", sans-serif',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  position: 'relative',
  '&::after': {
    content: '""',
    flex: 1,
    height: '2px',
    background: 'linear-gradient(90deg, #dc2626, transparent)',
    marginLeft: theme.spacing(2),
  },
}));

interface UserBusinessProfileProps {
  businessData: any;
}

const UserBusinessProfile: React.FC<UserBusinessProfileProps> = ({ 
  businessData
}) => {

  const businessTypes = [
    { value: 'sole_trader', label: 'Sole Trader' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'limited_company', label: 'Limited Company' },
    { value: 'llp', label: 'Limited Liability Partnership' },
  ];

  // const services = [
  //   { value: 'sales', label: 'Sales' },
  //   { value: 'lettings', label: 'Lettings' },
  //   { value: 'property_management', label: 'Property Management' },
  //   { value: 'valuation', label: 'Valuation' },
  //   { value: 'consultation', label: 'Consultation' },
  // ];

  const redressSchemes = [
    { value: 'property_ombudsman', label: 'Property Ombudsman' },
    { value: 'property_redress_scheme', label: 'Property Redress Scheme' },
    { value: 'ombudsman_services', label: 'Ombudsman Services' },
  ];

  return (
    <Box sx={{ fontFamily: '"Inter", sans-serif' }}>
      <StyledCard>
      {/* Business Header */}
      <BusinessHeader>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 3, md: 4 },
            width: '100%',
            position: 'relative',
            zIndex: 1,
          }}>
            <Avatar
              sx={{
                width: { xs: 120, md: 160 },
                height: { xs: 120, md: 160 },
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: '4px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
              }}
            >
              <BusinessIcon sx={{ fontSize: { xs: 60, md: 80 }, color: 'white' }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography 
                sx={{ 
                  fontWeight: 700, 
                  mb: 0.5,
                  color: 'white',
                  fontSize: { xs: '1.75rem', md: '2.25rem' },
                  fontFamily: '"Poppins", sans-serif',
                  lineHeight: 1.2,
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                }}
              >
                {businessData?.business_name || 'Business Profile'}
              </Typography>
              <Typography 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.95)', 
                  mb: 1,
                  fontWeight: 400,
                  fontSize: { xs: '0.95rem', md: '1.1rem' },
                  fontFamily: '"Inter", sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  textShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
                }}
              >
                <InfoIcon sx={{ fontSize: 18 }} />
                Professional Real Estate Services
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              position: 'relative',
              zIndex: 1,
            }}>
              <CheckCircleIcon 
                sx={{ 
                  color: '#10b981', 
                  fontSize: 24,
                  filter: 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.4))',
                }} 
              />
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'white', 
                  fontWeight: 600,
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.95rem',
                  textShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
                }}
              >
                Active
              </Typography>
            </Box>
          </Box>
      </BusinessHeader>

        {/* Content Area with 3D Effect */}
        <ContentWrapper>

          {/* Business Details Section */}
          <SectionTitle>
            <BusinessIcon sx={{ fontSize: 28 }} />
            Business Details
          </SectionTitle>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoField>
                <FieldLabel>
                  <StoreIcon sx={{ fontSize: 16 }} />
                  Business Name
                </FieldLabel>
                <FieldValue sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                  {businessData?.business_name || 'Not provided'}
                </FieldValue>
              </InfoField>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoField>
                <FieldLabel>
                  <BadgeIcon sx={{ fontSize: 16 }} />
                  Business Type
                </FieldLabel>
                <FieldValue>
                  {businessTypes.find(type => type.value === businessData?.business_type)?.label || 'Not provided'}
                </FieldValue>
              </InfoField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <InfoField>
                <FieldLabel>
                  <DescriptionIcon sx={{ fontSize: 16 }} />
                  Company Registration
                </FieldLabel>
                <FieldValue>{businessData?.company_registration_number || 'Not provided'}</FieldValue>
              </InfoField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <InfoField>
                <FieldLabel>
                  <CreditCardIcon sx={{ fontSize: 16 }} />
                  VAT Number
                </FieldLabel>
                <FieldValue>{businessData?.vat_number || 'Not provided'}</FieldValue>
              </InfoField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <InfoField>
                <FieldLabel>
                  <VerifiedIcon sx={{ fontSize: 16 }} />
                  Estate Agent License
                </FieldLabel>
                <FieldValue>{businessData?.estate_agent_license || 'Not provided'}</FieldValue>
              </InfoField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <InfoField>
                <FieldLabel>
                  <AssignmentIcon sx={{ fontSize: 16 }} />
                  Ombudsman Membership
                </FieldLabel>
                <FieldValue>{businessData?.property_ombudsman_membership || 'Not provided'}</FieldValue>
              </InfoField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <InfoField>
                <FieldLabel>
                  <PhoneIcon sx={{ fontSize: 16 }} />
                  Business Phone
                </FieldLabel>
                <FieldValue>{businessData?.business_phone || 'Not provided'}</FieldValue>
              </InfoField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <InfoField>
                <FieldLabel>
                  <EmailIcon sx={{ fontSize: 16 }} />
                  Business Email
                </FieldLabel>
                <FieldValue sx={{ wordBreak: 'break-word' }}>
                  {businessData?.business_email || 'Not provided'}
                </FieldValue>
              </InfoField>
            </Grid>

            <Grid size={12}>
              <InfoField>
                <FieldLabel>
                  <LanguageIcon sx={{ fontSize: 16 }} />
                  Website
                </FieldLabel>
                <FieldValue>
                  {businessData?.website ? (
                    <a 
                      href={businessData.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ 
                        color: '#dc2626', 
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontFamily: '"Inter", sans-serif',
                      }}
                    >
                      {businessData.website}
                    </a>
                  ) : 'Not provided'}
                </FieldValue>
              </InfoField>
            </Grid>
          </Grid>

          <Divider 
            sx={{ 
              my: 5, 
              borderColor: '#e5e7eb',
              borderWidth: 1,
              '&::before, &::after': {
                borderColor: '#dc2626',
                opacity: 0.3,
              },
            }} 
          />

          {/* Business Address Section */}
          <SectionTitle>
            <LocationIcon sx={{ fontSize: 28 }} />
            Business Address
          </SectionTitle>

          <Grid container spacing={3}>
            <Grid size={12}>
              <InfoField>
                <FieldLabel>
                  <HomeIcon sx={{ fontSize: 16 }} />
                  Street Address
                </FieldLabel>
                <FieldValue>{businessData?.business_address?.street || 'Not provided'}</FieldValue>
              </InfoField>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <InfoField>
                <FieldLabel>
                  <LocationIcon sx={{ fontSize: 16 }} />
                  City
                </FieldLabel>
                <FieldValue>{businessData?.business_address?.city || 'Not provided'}</FieldValue>
              </InfoField>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <InfoField>
                <FieldLabel>
                  <LocationIcon sx={{ fontSize: 16 }} />
                  County
                </FieldLabel>
                <FieldValue>{businessData?.business_address?.county || 'Not provided'}</FieldValue>
              </InfoField>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <InfoField>
                <FieldLabel>
                  <LocationIcon sx={{ fontSize: 16 }} />
                  Postcode
                </FieldLabel>
                <FieldValue>{businessData?.business_address?.postcode || 'Not provided'}</FieldValue>
              </InfoField>
            </Grid>

            <Grid size={12}>
              <InfoField>
                <FieldLabel>
                  <LocationIcon sx={{ fontSize: 16 }} />
                  Country
                </FieldLabel>
                <FieldValue>{businessData?.business_address?.country || 'Not provided'}</FieldValue>
              </InfoField>
            </Grid>
          </Grid>

          <Divider 
            sx={{ 
              my: 5, 
              borderColor: '#e5e7eb',
              borderWidth: 1,
              '&::before, &::after': {
                borderColor: '#dc2626',
                opacity: 0.3,
              },
            }} 
          />

          {/* Services Section */}
          <SectionTitle>
            <WorkIcon sx={{ fontSize: 28 }} />
            Services Offered
          </SectionTitle>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {businessData?.services?.map((service: string) => {
              return (
                <ServiceChip
                  key={service}
                  active={true}
                  label={service.charAt(0).toUpperCase() + service.slice(1).replace(/_/g, ' ')}
                />
              );
            })}
          </Box>

          <Divider 
            sx={{ 
              my: 5, 
              borderColor: '#e5e7eb',
              borderWidth: 1,
              '&::before, &::after': {
                borderColor: '#dc2626',
                opacity: 0.3,
              },
            }} 
          />

          {/* Business Hours Section */}
          <SectionTitle>
            <AccessTimeIcon sx={{ fontSize: 28 }} />
            Business Hours
          </SectionTitle>

          <Grid container spacing={2}>
            {Object.entries(businessData?.business_hours || {}).map(([day, hours]: [string, any]) => {
              const isOpen = !hours.closed;
              const dayName = day.charAt(0).toUpperCase() + day.slice(1);
              
              // Convert 24-hour format to 12-hour format with AM/PM
              const formatTime = (time24: string) => {
                if (!time24) return '';
                const [hours, minutes] = time24.split(':');
                const hour = parseInt(hours);
                const ampm = hour >= 12 ? 'PM' : 'AM';
                const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                return `${hour12}:${minutes} ${ampm}`;
              };
              
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={day}>
                  <BusinessHoursCard>
                    <Box sx={{ textAlign: 'center' }}>
                      {/* Day Name */}
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        color: '#1f2937',
                        mb: 1.5,
                        fontSize: '1.1rem',
                      }}>
                        {dayName}
                      </Typography>
                      
                      {/* Status Badge */}
                      <StatusBadge status={isOpen ? 'open' : 'closed'}>
                        {isOpen ? 'Open' : 'Closed'}
                      </StatusBadge>
                      
                      {/* Working Hours (only if open) */}
                      {isOpen && hours.open && hours.close && (
                        <WorkingHours>
                          {formatTime(hours.open)} – {formatTime(hours.close)}
                        </WorkingHours>
                      )}
                    </Box>
                  </BusinessHoursCard>
                </Grid>
              );
            })}
          </Grid>
        </ContentWrapper>
      </StyledCard>
    </Box>
  );
};

export default UserBusinessProfile;
