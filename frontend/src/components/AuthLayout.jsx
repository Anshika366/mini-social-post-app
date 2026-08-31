import React from 'react';
import { Box, Container, Card, CardContent, Typography } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F6FA 60%, #EEEDFD 100%)',
        p: 2
      }}
    >
      <Container maxWidth="xs" disableGutters sx={{ width: { xs: '92%', sm: '420px' } }}>
        <Card
          sx={{
            borderRadius: '28px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.06)',
            border: '1px solid #E5E7EB',
            overflow: 'hidden',
            backgroundColor: '#FFFFFF'
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              pt: 5,
              pb: 4,
              px: 3,
              textAlign: 'center',
              color: '#FFFFFF'
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}
            >
              <PublicIcon sx={{ fontSize: 34, color: '#FFFFFF' }} />
            </Box>
            <Typography variant="h1" sx={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.5px' }}>
              TaskPlanet <span style={{ fontWeight: 500, opacity: 0.9 }}>Social</span>
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.8, fontSize: '14px', color: '#F3F4F6' }}>
              {subtitle || 'Connect with tasks, projects & community'}
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Typography variant="h2" sx={{ fontSize: '20px', fontWeight: 700, mb: 3, color: '#111827', textAlign: 'center' }}>
              {title}
            </Typography>
            {children}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AuthLayout;
