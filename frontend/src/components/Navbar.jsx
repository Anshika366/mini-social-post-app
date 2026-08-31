import React, { useState, useContext } from 'react';
import { AppBar, Toolbar, Typography, Box, Avatar, IconButton, Container, InputBase } from '@mui/material';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PublicIcon from '@mui/icons-material/Public';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'A';
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        color: '#111827',
        height: 64,
        top: 0,
        zIndex: 1100,
        justifyContent: 'center'
      }}
    >
      <Container maxWidth="md" disableGutters sx={{ px: 2 }}>
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 64, gap: 2 }}>
          <Box
            onClick={() => navigate('/')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              minWidth: 'fit-content'
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: '#6366F1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <PublicIcon sx={{ color: '#FFFFFF', fontSize: 20 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: '18px',
                color: '#111827',
                letterSpacing: '-0.3px',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              TaskPlanet Social
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F1F5F9',
              borderRadius: '24px',
              px: '16px',
              py: '6px',
              maxWidth: 440,
              width: '100%'
            }}
          >
            <SearchRoundedIcon sx={{ color: '#9CA3AF', fontSize: 20, mr: 1 }} />
            <InputBase
              placeholder="Search TaskPlanet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                fontSize: '14px',
                color: '#111827',
                width: '100%'
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 'fit-content' }}>
            <IconButton sx={{ color: '#4B5563' }}>
              <NotificationsNoneRoundedIcon fontSize="small" />
            </IconButton>

            {user && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: '#6366F1',
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#FFFFFF'
                  }}
                >
                  {getInitial(user.username)}
                </Avatar>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: '#111827',
                    fontSize: '14px',
                    display: { xs: 'none', md: 'block' }
                  }}
                >
                  {user.username || 'Anshika Pathak'}
                </Typography>
              </Box>
            )}

            <IconButton
              onClick={handleLogout}
              title="Logout"
              sx={{ color: '#6B7280' }}
            >
              <LogoutRoundedIcon fontSize="small" />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
