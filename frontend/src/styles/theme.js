import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4F46E5',
      dark: '#4338CA',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#7C3AED',
      contrastText: '#FFFFFF'
    },
    background: {
      default: '#F4F6F8',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280'
    },
    divider: '#E5E7EB'
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  shape: {
    borderRadius: 16
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'none',
          fontWeight: 600
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          border: '1px solid #E5E7EB',
          backgroundColor: '#FFFFFF'
        }
      }
    }
  }
});

export default theme;
