import React from 'react';
import { Box, Typography, Paper, Card, CardContent, Avatar, Chip, Divider } from '@mui/material';
import { Dashboard as DashboardIcon, TrendingUp as TrendingUpIcon, People as PeopleIcon, Info as InfoIcon, Description as DescriptionIcon } from '@mui/icons-material';
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
              Welcome Back, {userData?.firstName || 'Agent'}! 👋
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                opacity: 0.95, 
                fontWeight: 400,
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                lineHeight: 1.6,
                textShadow: '0 1px 5px rgba(0,0,0,0.15)',
                mb: 2,
              }}
            >
              Your agent dashboard is ready to help you manage listings, clients, and grow your business.
            </Typography>
            
            {/* <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon sx={{ fontSize: 20, opacity: 0.9 }} />
                <Typography variant="body2" sx={{ opacity: 0.95, fontWeight: 500 }}>
                  <strong>12</strong> New Properties
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleIcon sx={{ fontSize: 20, opacity: 0.9 }} />
                <Typography variant="body2" sx={{ opacity: 0.95, fontWeight: 500 }}>
                  <strong>8</strong> Active Clients
                </Typography>
              </Box>
              <Chip
                label="Online"
                size="small"
                sx={{
                  bgcolor: 'rgba(16, 185, 129, 0.25)',
                  color: '#ffffff',
                  fontWeight: 600,
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              />
            </Box> */}
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

const QuickStats: React.FC = () => {
  const stats = [
    {
      title: 'Total Properties',
      value: '156',
      change: '+12%',
      color: '#10b981',
      icon: <DashboardIcon />,
    },
    {
      title: 'Active Listings',
      value: '89',
      change: '+5%',
      color: '#3b82f6',
      icon: <TrendingUpIcon />,
    },
    {
      title: 'New Clients',
      value: '24',
      change: '+18%',
      color: '#f59e0b',
      icon: <PeopleIcon />,
    },
  ];

  return (
    <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
      {stats.map((stat, index) => (
        <Paper
          key={index}
          sx={{
            p: 3,
            flex: 1,
            minWidth: 200,
            borderRadius: 2,
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: '1px solid #e5e7eb',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: `${stat.color}15`,
                color: stat.color,
              }}
            >
              {stat.icon}
            </Box>
            <Chip
              label={stat.change}
              size="small"
              sx={{
                bgcolor: '#dcfce7',
                color: '#166534',
                fontWeight: 600,
              }}
            />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            {stat.value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {stat.title}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};

const IntroductionSection: React.FC = () => {
  return (
    <Paper sx={{ p: 4, borderRadius: 2, mb: 4, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <InfoIcon sx={{ fontSize: 32, color: '#667eea', mr: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Welcome to Your Agent Dashboard
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, color: 'text.secondary' }}>
        As a commercial real estate agent, this dashboard is your command center for managing 
        your entire business. Here you can efficiently handle property listings, track client 
        interactions, monitor your performance metrics, and access powerful tools to help you 
        close more deals and grow your portfolio.
      </Typography>
      <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
        From creating and managing property listings to tracking leads and generating detailed 
        reports, everything you need to succeed as an agent is at your fingertips. The dashboard 
        is designed to streamline your workflow, save you time, and help you focus on what matters 
        most - building relationships and closing deals.
      </Typography>
    </Paper>
  );
};

const DashboardSections: React.FC = () => {
  const sections = [
    {
      title: 'Property Listings Management',
      description: 'Create, edit, and manage all your commercial property listings. Upload photos, add detailed descriptions, set pricing, and track listing performance. Keep your portfolio organized and up-to-date.',
    },
    {
      title: 'Client & Lead Management',
      description: 'Track all your clients and leads in one place. Manage contact information, view interaction history, schedule follow-ups, and nurture relationships throughout the sales process.',
    },
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
        {/* <QuickStats /> */}
        <DashboardSections />
      </Box>
    </Page>
  );
};

export default AgentDashboard;
