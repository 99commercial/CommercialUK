import React from 'react';
import { Box, Typography, Breadcrumbs } from '@mui/material';

interface HeaderCardProps {
  title: string;
  subtitle?: string;
  breadcrumbs: string[];
  userData?: {
    firstName?: string;
    lastName?: string;
  };
}

const HeaderCard: React.FC<HeaderCardProps> = ({ 
  title, 
  subtitle,
  breadcrumbs, 
  userData 
}) => {
  return (
    <Box sx={{ 
      mb: 5, 
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #dc2626 100%)',
      borderRadius: 4,
      p: 5,
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '-50%',
        right: '-20%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite',
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '-30%',
        left: '-10%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(220, 38, 38, 0.2) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse',
      },
      '@keyframes float': {
        '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
        '50%': { transform: 'translateY(-20px) rotate(180deg)' },
      }
    }}>
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ 
              fontWeight: 900, 
              mb: subtitle ? 0.5 : 0,
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              background: 'linear-gradient(45deg, #ffffff 0%, #f1f5f9 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="h6" sx={{ 
                fontWeight: 400, 
                mb: 0.5,
                color: 'rgba(255, 255, 255, 0.9)',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                fontSize: '1.1rem',
              }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        <Breadcrumbs sx={{ 
          '& .MuiBreadcrumbs-separator': {
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '1.2rem',
          },
        }}>
          {breadcrumbs.map((breadcrumb, index) => (
            <Typography 
              key={index}
              sx={{ 
                color: index === breadcrumbs.length - 1 ? 'white' : 'rgba(255, 255, 255, 0.8)',
                fontWeight: index === breadcrumbs.length - 1 ? 700 : 500,
                fontSize: '1rem',
                textShadow: index === breadcrumbs.length - 1 ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
              }}
            >
              {breadcrumb}
            </Typography>
          ))}
        </Breadcrumbs>
      </Box>
    </Box>
  );
};

export default HeaderCard;