import React from 'react';
import { Box, Typography, Paper, Card, CardContent, Avatar, Divider } from '@mui/material';
import { Dashboard as DashboardIcon, Info as InfoIcon, Description as DescriptionIcon } from '@mui/icons-material';
import AgentLayout from '../../layouts/Agent/AgentLayout';
import { Page } from '../../components';

const WelcomeCard: React.FC = () => {

  const user = localStorage.getItem('user');
  const userData = user ? JSON.parse(user) : null;

  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        color: 'white',
        borderRadius: 4,
        boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3), 0 0 0 1px rgba(255,255,255,0.1)',
        position: 'relative',
        overflow: 'hidden',
        mb: 4,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 25px 70px rgba(102, 126, 234, 0.4), 0 0 0 1px rgba(255,255,255,0.15)',
        },
      }}
    >
      {/* Animated background pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.08) 0%, transparent 50%)',
          opacity: 0.6,
        }}
      />
      
      <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 }, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
          <Avatar
            sx={{
              width: { xs: 70, sm: 80 },
              height: { xs: 70, sm: 80 },
              bgcolor: 'rgba(255,255,255,0.25)',
              mr: 3,
              border: '3px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05) rotate(5deg)',
              },
            }}
          >
            <DashboardIcon sx={{ fontSize: { xs: 35, sm: 40 } }} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 800, 
                mb: 1.5,
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                letterSpacing: '-0.5px',
              }}
            >
              Welcome Back, {userData.firstName}! 👋
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                opacity: 0.95, 
                fontWeight: 400,
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                lineHeight: 1.6,
                textShadow: '0 1px 5px rgba(0,0,0,0.15)',
              }}
            >
              Your commercial real estate dashboard is ready to help you manage your business.
            </Typography>
          </Box>
        </Box>
      </CardContent>
      
      {/* Enhanced decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, transparent 70%)',
          animation: 'pulse 4s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': {
              transform: 'scale(1)',
              opacity: 0.6,
            },
            '50%': {
              transform: 'scale(1.1)',
              opacity: 0.8,
            },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -60,
          left: -60,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, transparent 70%)',
          animation: 'pulse 5s ease-in-out infinite',
          animationDelay: '1s',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          right: 50,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          transform: 'translateY(-50%)',
          animation: 'pulse 6s ease-in-out infinite',
          animationDelay: '2s',
        }}
      />
      
      {/* Shine effect overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          animation: 'shine 3s infinite',
          '@keyframes shine': {
            '0%': {
              left: '-100%',
            },
            '100%': {
              left: '100%',
            },
          },
        }}
      />
    </Card>
  );
};

const IntroductionSection: React.FC = () => {
  return (
    <Paper sx={{ p: 4, borderRadius: 2, mb: 4, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <InfoIcon sx={{ fontSize: 32, color: '#667eea', mr: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Welcome to Your Dashboard
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, color: 'text.secondary' }}>
        This dashboard is your central hub for managing your commercial real estate business. 
        Here, you can access all the tools and information you need to efficiently manage properties, 
        clients, and transactions in one convenient location.
      </Typography>
      <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
        Whether you're tracking property listings, managing client relationships, or reviewing 
        detailed reports, everything you need is just a click away. The dashboard is designed 
        to be intuitive and user-friendly, helping you stay organized and productive.
      </Typography>
    </Paper>
  );
};

const DashboardSections: React.FC = () => {
  const sections = [
    {
      title: 'Property Management',
      description: 'Access and manage all your commercial property listings. View property details, update information, and track listing status from one central location.',
    },
    {
      title: 'Client Management',
      description: 'Keep track of your clients and their interactions. Manage contact information, view communication history, and maintain strong relationships.',
    }
  ];

  return (
    <Paper sx={{ p: 4, borderRadius: 2, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <DescriptionIcon sx={{ fontSize: 32, color: '#667eea', mr: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Dashboard Sections Overview
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {sections.map((section, index) => (
          <Card
            key={index}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#667eea' }}>
              {section.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
              {section.description}
            </Typography>
          </Card>
        ))}
      </Box>
    </Paper>
  );
};

const AgentDashboard: React.FC = () => {
  return (
    <Page title="Commercial Real Estate Marketplace | CommercialUK">
      <Box>
        <WelcomeCard />
        <IntroductionSection />
        <DashboardSections />
      </Box>
    </Page>
  );
};

export default AgentDashboard;
