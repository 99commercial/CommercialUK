import React from 'react';
import {
  Box,
  Card,
  CardContent,
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
  Schedule as ScheduleIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  border: 'none',
  background: '#ffffff',
  overflow: 'hidden',
}));

const BusinessHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  padding: theme.spacing(4),
  background: '#dc2626',
  color: 'white',
  borderRadius: '12px 12px 0 0',
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
  marginBottom: theme.spacing(2),
}));

const FieldLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 500,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: theme.spacing(0.5),
}));

const FieldValue = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 600,
  color: '#1f2937',
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
    <Box>
      <StyledCard>
      {/* Business Header */}
      <BusinessHeader>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <BusinessIcon sx={{ fontSize: 30, color: 'white' }} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 700, 
              mb: 0.5,
              color: 'white',
            }}>
              {businessData?.business_name || 'Business Profile'}
            </Typography>
            <Typography variant="body1" sx={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              mb: 2,
              fontWeight: 400,
            }}>
              Professional Real Estate Services
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
              <Typography sx={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>✓</Typography>
        </Box>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
              Active
          </Typography>
        </Box>
      </BusinessHeader>

        {/* Content Area */}
        <Box sx={{ p: 4 }}>

          {/* Business Details Section */}
          <Typography variant="h6" sx={{ 
            fontWeight: 700, 
            color: '#dc2626',
            mb: 3,
          }}>
            Business Details
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoField>
                <FieldLabel>Business Name</FieldLabel>
                <FieldValue>{businessData?.business_name || 'Not provided'}</FieldValue>
              </InfoField>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoField>
                <FieldLabel>Business Type</FieldLabel>
                <FieldValue>{businessTypes.find(type => type.value === businessData?.business_type)?.label || 'Not provided'}</FieldValue>
              </InfoField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <InfoField>
                <FieldLabel>Company Registration</FieldLabel>
                <FieldValue>{businessData?.company_registration_number || 'Not provided'}</FieldValue>
              </InfoField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <InfoField>
                <FieldLabel>VAT Number</FieldLabel>
                <FieldValue>{businessData?.vat_number || 'Not provided'}</FieldValue>
              </InfoField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <InfoField>
                <FieldLabel>Estate Agent License</FieldLabel>
                <FieldValue>{businessData?.estate_agent_license || 'Not provided'}</FieldValue>
              </InfoField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <InfoField>
                <FieldLabel>Ombudsman Membership</FieldLabel>
                <FieldValue>{businessData?.property_ombudsman_membership || 'Not provided'}</FieldValue>
              </InfoField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <InfoField>
                <FieldLabel>Business Phone</FieldLabel>
                <FieldValue>{businessData?.business_phone || 'Not provided'}</FieldValue>
              </InfoField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <InfoField>
                <FieldLabel>Business Email</FieldLabel>
                <FieldValue>{businessData?.business_email || 'Not provided'}</FieldValue>
              </InfoField>
            </Grid>

            <Grid size={12}>
              <InfoField>
                <FieldLabel>Website</FieldLabel>
                <FieldValue>
                {businessData?.website ? (
                    <a 
                      href={businessData.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ 
                        color: '#dc2626', 
                        textDecoration: 'underline',
                      }}
                    >
                    {businessData.website}
                  </a>
                ) : 'Not provided'}
                </FieldValue>
              </InfoField>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: '#e5e7eb' }} />

          {/* Business Address Section */}
          <Typography variant="h6" sx={{ 
            fontWeight: 700, 
            color: '#dc2626',
            mb: 3,
          }}>
            Business Address
          </Typography>

          <Grid container spacing={3}>
            <Grid size={12}>
              <InfoField>
                <FieldLabel>Street Address</FieldLabel>
                <FieldValue>{businessData?.business_address?.street || 'Not provided'}</FieldValue>
              </InfoField>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <InfoField>
                <FieldLabel>City</FieldLabel>
                <FieldValue>{businessData?.business_address?.city || 'Not provided'}</FieldValue>
              </InfoField>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <InfoField>
                <FieldLabel>County</FieldLabel>
                <FieldValue>{businessData?.business_address?.county || 'Not provided'}</FieldValue>
              </InfoField>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <InfoField>
                <FieldLabel>Postcode</FieldLabel>
                <FieldValue>{businessData?.business_address?.postcode || 'Not provided'}</FieldValue>
              </InfoField>
            </Grid>

            <Grid size={12}>
              <InfoField>
                <FieldLabel>Country</FieldLabel>
                <FieldValue>{businessData?.business_address?.country || 'Not provided'}</FieldValue>
              </InfoField>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: '#e5e7eb' }} />

          {/* Services Section */}
          <Typography variant="h6" sx={{ 
            fontWeight: 700, 
            color: '#dc2626',
            mb: 3,
          }}>
            Services Offered
          </Typography>

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

          <Divider sx={{ my: 4, borderColor: '#e5e7eb' }} />

          {/* Business Hours Section */}
          <Typography variant="h6" sx={{ 
            fontWeight: 700, 
            color: '#dc2626',
            mb: 3,
          }}>
            Business Hours
          </Typography>

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
          </Box>
      </StyledCard>
    </Box>
  );
};

export default UserBusinessProfile;
