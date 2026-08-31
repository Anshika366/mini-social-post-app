import React, { useState, useContext } from 'react';
import {
  Box,
  Typography,
  Avatar,
  TextField,
  IconButton,
  CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const CommentSection = ({ postId, comments = [], onCommentAdded }) => {
  const { user } = useContext(AuthContext);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'C';
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return 'just now';
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return 'just now';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await api.post(`/api/posts/${postId}/comment`, {
        text: commentText.trim()
      });

      if (response.data && response.data.success) {
        setCommentText('');
        if (onCommentAdded) {
          onCommentAdded(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#F9FAFB',
        borderRadius: '12px',
        p: '14px',
        mt: '12px',
        border: '1px solid #E5E7EB'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '14px', color: '#111827' }}>
          Comments ({comments.length})
        </Typography>
        <ExpandLessRoundedIcon sx={{ color: '#6B7280', fontSize: 20 }} />
      </Box>

      {comments.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mb: 2 }}>
          {comments.map((comment, index) => {
            const author = comment.username || 'Community Member';
            return (
              <Box
                key={comment._id || index}
                sx={{
                  display: 'flex',
                  gap: 1.2,
                  backgroundColor: '#FFFFFF',
                  p: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid #F1F5F9'
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: '#4F46E5',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#FFFFFF'
                  }}
                >
                  {getInitial(author)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '13px', color: '#111827' }}>
                      {author}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#9CA3AF', fontSize: '11px' }}>
                      {formatRelativeTime(comment.createdAt)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#374151', fontSize: '13px', lineHeight: 1.45 }}>
                    {comment.text}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '13px', mb: 2 }}>
          No comments yet. Be the first to comment!
        </Typography>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 999,
              backgroundColor: '#FFFFFF',
              fontSize: '13px',
              '& fieldset': {
                borderColor: '#E5E7EB'
              },
              '&:hover fieldset': {
                borderColor: '#CBD5E1'
              },
              '&.Mui-focused fieldset': {
                borderColor: '#4F46E5'
              }
            }
          }}
        />
        <IconButton
          type="submit"
          disabled={isSubmitting || !commentText.trim()}
          sx={{
            backgroundColor: '#4F46E5',
            color: '#FFFFFF',
            width: 36,
            height: 36,
            '&:hover': {
              backgroundColor: '#4338CA'
            },
            '&.Mui-disabled': {
              backgroundColor: '#E5E7EB',
              color: '#9CA3AF'
            }
          }}
        >
          {isSubmitting ? <CircularProgress size={16} color="inherit" /> : <SendIcon sx={{ fontSize: 16 }} />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default CommentSection;
