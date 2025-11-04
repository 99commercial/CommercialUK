import React, { useState } from 'react';
import { Box, Typography, Breadcrumbs, Tabs, Tab } from '@mui/material';

interface TabItem {
  label: string;
  value: string | number;
  icon?: React.ReactElement;
}

interface HeaderCardProps {
  title: string;
  subtitle?: string;
  breadcrumbs: string[];
  userData?: {
    firstName?: string;
    lastName?: string;
  };
  tabs?: TabItem[];
  defaultTab?: string | number;
  onTabChange?: (value: string | number) => void;
}

const HeaderCard: React.FC<HeaderCardProps> = ({ 
  title, 
  subtitle,
  breadcrumbs, 
  userData,
  tabs,
  defaultTab,
  onTabChange
}) => {
  const [activeTab, setActiveTab] = useState<string | number>(defaultTab || (tabs && tabs.length > 0 ? tabs[0].value : 0));

  const handleTabChange = (event: React.SyntheticEvent, newValue: string | number) => {
    setActiveTab(newValue);
    onTabChange?.(newValue);
  };
  return (
    <Box sx={{ 
      mt: 5,
      mb: 5, 
      backgroundImage: 'url(https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/images/mock/cover/cover-4.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      borderRadius: '12px', // Increased border radius
      minHeight: '225px', // Increased height
      pt: 5,
      px: 5,
      color: 'white',
      position: 'relative',
      overflow: 'hidden',

      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.75) 0%, rgba(51, 65, 85, 0.7) 50%, rgba(220, 38, 38, 0.8) 100%)',
        backdropFilter: 'saturate(150%) brightness(0.9)',
        WebkitBackdropFilter: 'blur(8px) saturate(150%) brightness(0.9)',
        filter: 'drop-shadow(0 0 20px rgba(220, 38, 38, 0.3))',
        zIndex: 1,
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '-50%',
        right: '-20%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite',
        zIndex: 2,
      },
      '@keyframes float': {
        '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
        '50%': { transform: 'translateY(-20px) rotate(180deg)' },
      },
    }}>
      {/* Decorative element */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(220, 38, 38, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse',
          zIndex: 2,
        }}
      />
      
      {/* Optional Tabs in Footer */}
      {tabs && tabs.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            borderBottomLeftRadius: '12px',
            borderBottomRightRadius: '12px',
            zIndex: 4,
            overflow: 'hidden',
            padding:'5px',
            marginTop: 2,
            paddingRight: 2
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              minHeight: 'auto',
              display: 'flex',
              justifyContent: 'flex-end',
              '& .MuiTabs-indicator': {
                backgroundColor: '#333333',
                height: '2px',
              },
              '& .MuiTabs-flexContainer': {
                gap: 0,
                justifyContent: 'flex-end',
              },
            }}
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                label={tab.label}
                value={tab.value}
                icon={tab.icon}
                iconPosition="start"
                sx={{
                  minHeight: 'auto',
                  padding: '12px 20px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  letterSpacing: '0.01em',
                  color: '#9e9e9e', // Grey for inactive tabs
                  '& .MuiTab-iconWrapper': {
                    marginBottom: 0,
                    marginRight: tab.icon ? '8px' : 0,
                    color: '#9e9e9e', // Grey for inactive icons
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    '& svg': {
                      color: '#9e9e9e', // Ensure SVG icons are grey when inactive
                    },
                  },
                  '&.Mui-selected': {
                    color: '#000000', // Black for active tabs
                    fontWeight: 700,
                    '& .MuiTab-iconWrapper': {
                      color: '#000000', // Black for active icons
                      '& svg': {
                        color: '#000000', // Ensure SVG icons are black when active
                      },
                    },
                  },
                }}
              />
            ))}
          </Tabs>
        </Box>
      )}
      
      <Box sx={{ position: 'relative', zIndex: 3 }}>
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