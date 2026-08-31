import React, { useState, useContext, useRef } from 'react';
import {
  Card,
  CardContent,
  Box,
  Avatar,
  TextField,
  Button,
  IconButton,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import CloseIcon from '@mui/icons-material/Close';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const CreatePost = ({ onPostCreated, onError }) => {
  const { user } = useContext(AuthContext);
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'A';
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setErrorMsg('Please select a valid image file');
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrorMsg('');
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim() && !selectedFile) {
      setErrorMsg('Please enter text or select an image to post');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      if (text.trim()) {
        formData.append('text', text.trim());
      }
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const response = await api.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data && response.data.success) {
        setText('');
        setSelectedFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        if (onPostCreated) {
          onPostCreated(response.data.data);
        }
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to publish post';
      setErrorMsg(message);
      if (onError) onError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = Boolean(text.trim() || selectedFile);

  return (
    <Card
      sx={{
        borderRadius: '16px',
        mb: 3,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        border: '1px solid #E5E7EB',
        backgroundColor: '#FFFFFF',
        maxWidth: 620,
        mx: 'auto'
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }} onClose={() => setErrorMsg('')}>
            {errorMsg}
          </Alert>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: '#6366F1',
              fontWeight: 600,
              fontSize: 15,
              color: '#FFFFFF'
            }}
          >
            {getInitial(user?.username)}
          </Avatar>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '15px', color: '#111827' }}>
            Create Post
          </Typography>
        </Box>

        <TextField
          fullWidth
          multiline
          rows={2}
          placeholder={`What's on your mind, ${user?.username || 'Anshika Pathak'}?`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          variant="standard"
          InputProps={{
            disableUnderline: true
          }}
          sx={{
            mb: 1.5,
            '& .MuiInputBase-root': {
              fontSize: '15px',
              color: '#111827',
              lineHeight: 1.5
            }
          }}
        />

        {imagePreview && (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: 110,
              backgroundColor: '#F9FAFB',
              border: '2px dashed #CBD5E1',
              borderRadius: '12px',
              p: '8px',
              mb: 2,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <img
              src={imagePreview}
              alt="Upload preview"
              style={{
                width: 80,
                height: 80,
                objectFit: 'cover',
                borderRadius: '8px',
                display: 'block'
              }}
            />
            <IconButton
              size="small"
              onClick={handleRemoveImage}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: '#1F2937',
                color: '#FFFFFF',
                width: 20,
                height: 20,
                p: 0,
                '&:hover': {
                  backgroundColor: '#111827'
                }
              }}
            >
              <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            pt: 1.5,
            borderTop: '1px solid #E5E7EB'
          }}
        >
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: 'none' }}
            id="post-image-input"
          />
          <label htmlFor="post-image-input">
            <Button
              component="span"
              startIcon={<ImageOutlinedIcon sx={{ color: '#374151' }} />}
              sx={{
                color: '#374151',
                borderRadius: '20px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '14px',
                px: 2,
                py: 0.6,
                backgroundColor: '#FAFAFC',
                border: '1px solid #E5E7EB',
                transition: 'all 180ms ease-in-out',
                '&:hover': {
                  backgroundColor: '#F3F4F6',
                  color: '#4F46E5'
                }
              }}
            >
              Photo
            </Button>
          </label>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting || !isFormValid}
            endIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <SendRoundedIcon sx={{ fontSize: 16 }} />}
            sx={{
              borderRadius: '24px',
              textTransform: 'none',
              fontWeight: 700,
              px: '24px',
              py: '8px',
              fontSize: '14px',
              letterSpacing: '-0.2px',
              background: isFormValid ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' : '#E5E7EB',
              color: isFormValid ? '#FFFFFF' : '#9CA3AF',
              boxShadow: isFormValid ? '0 4px 14px rgba(79, 70, 229, 0.4)' : 'none',
              transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: isFormValid ? 'linear-gradient(135deg, #4338CA 0%, #6D28D9 100%)' : '#E5E7EB',
                boxShadow: isFormValid ? '0 6px 20px rgba(79, 70, 229, 0.5)' : 'none',
                transform: isFormValid ? 'translateY(-2px)' : 'none'
              },
              '&:active': {
                transform: isFormValid ? 'scale(0.96)' : 'none'
              },
              '&.Mui-disabled': {
                background: '#E5E7EB',
                color: '#9CA3AF'
              }
            }}
          >
            Post
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
