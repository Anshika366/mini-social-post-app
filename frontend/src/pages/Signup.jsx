import React, { useState, useContext } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Person } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      setToast({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      setToast({
        open: true,
        message: 'Please enter a valid email address',
        severity: 'error'
      });
      return;
    }

    if (formData.password.length < 6) {
      setToast({
        open: true,
        message: 'Password must be at least 6 characters long',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const result = await signup(formData.username, formData.email, formData.password);
      if (result.success) {
        setToast({
          open: true,
          message: 'Account created successfully! Please log in.',
          severity: 'success'
        });
        setTimeout(() => {
          navigate('/login');
        }, 1200);
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Try again.';
      setToast({
        open: true,
        message,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join TaskPlanet Social Community today">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          margin="normal"
          id="username"
          name="username"
          label="Username"
          value={formData.username}
          onChange={handleChange}
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person sx={{ color: '#9CA3AF' }} />
              </InputAdornment>
            ),
            sx: { borderRadius: '14px' }
          }}
        />

        <TextField
          fullWidth
          margin="normal"
          id="email"
          name="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email sx={{ color: '#9CA3AF' }} />
              </InputAdornment>
            ),
            sx: { borderRadius: '14px' }
          }}
        />

        <TextField
          fullWidth
          margin="normal"
          id="password"
          name="password"
          label="Password (min 6 chars)"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock sx={{ color: '#9CA3AF' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
            sx: { borderRadius: '14px' }
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{
            mt: 3,
            mb: 2,
            height: 52,
            borderRadius: 999,
            fontWeight: 700,
            fontSize: '16px',
            textTransform: 'none',
            backgroundColor: '#4F46E5',
            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
            '&:hover': {
              backgroundColor: '#4338CA'
            }
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
        </Button>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" sx={{ color: '#6B7280' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#4F46E5', fontWeight: 700, textDecoration: 'none' }}>
              Log In
            </Link>
          </Typography>
        </Box>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%', borderRadius: '12px' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </AuthLayout>
  );
};

export default Signup;
