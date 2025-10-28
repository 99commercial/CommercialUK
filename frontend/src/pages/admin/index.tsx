import React from 'react';
import { Box, Typography, Paper, Card, CardContent, Avatar, Chip } from '@mui/material';
import { Dashboard as DashboardIcon, TrendingUp as TrendingUpIcon, People as PeopleIcon } from '@mui/icons-material';
import AdminLayout from '../../layouts/Admin/AdminLayout';
import { Page } from '../../components';

const WelcomeCard: React.FC = () => {
  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 3,
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        position: 'relative',
        overflow: 'hidden',
        mb: 4,
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              bgcolor: 'rgba(255,255,255,0.2)',
              mr: 2,
            }}
          >
            <DashboardIcon sx={{ fontSize: 30 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome Back, Admin! 👋
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
              Here's what's happening with your business today.
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUpIcon sx={{ fontSize: 20, opacity: 0.8 }} />
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              <strong>12</strong> New Properties
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleIcon sx={{ fontSize: 20, opacity: 0.8 }} />
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              <strong>8</strong> Active Clients
            </Typography>
          </Box>
          <Chip
            label="Online"
            size="small"
            sx={{
              bgcolor: 'rgba(16, 185, 129, 0.2)',
              color: '#10b981',
              fontWeight: 600,
            }}
          />
        </Box>
      </CardContent>
      
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
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

const AdminDashboard: React.FC = () => {
  return (
    <Page title="The World's #1 Commercial Real Estate Marketplace">
      <Box>
        <WelcomeCard />
        <QuickStats />
        
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Recent Activity
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your recent property listings and client interactions will appear here.
          </Typography>

        </Paper>
      </Box>
    </Page>
  );
};

export default AdminDashboard;
