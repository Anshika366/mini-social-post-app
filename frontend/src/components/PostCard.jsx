import React, { useState, useContext, useRef } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Box,
  Button,
  Collapse,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  CircularProgress
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import { AuthContext } from '../context/AuthContext';
import CommentSection from './CommentSection';
import api, { getImageUrl, updatePostApi, deletePostApi } from '../services/api';

const PostCard = ({ post, onPostUpdated, onPostDeleted, onNotification }) => {
  const { user } = useContext(AuthContext);
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const [menuAnchor, setMenuAnchor] = useState(null);
  const isMenuOpen = Boolean(menuAnchor);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editText, setEditText] = useState(post.text || '');
  const [editFile, setEditFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(post.image ? getImageUrl(post.image) : null);
  const [isImageRemoved, setIsImageRemoved] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const editFileInputRef = useRef(null);

  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  const [isFullscreenImageOpen, setIsFullscreenImageOpen] = useState(false);

  const isOwner = Boolean(
    user &&
      (user.id === post.user?._id ||
        user._id === post.user?._id ||
        user.id === post.user ||
        user._id === post.user ||
        (user.username && post.user?.username && user.username === post.user.username))
  );

  const isLiked = post.likes && post.likes.includes(user?.username);
  const likesCount = post.likes ? post.likes.length : 0;
  const commentsCount = post.comments ? post.comments.length : 0;

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'A';
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return '28m ago';
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

  const handleOpenMenu = (e) => {
    setMenuAnchor(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const handleToggleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    try {
      const response = await api.post(`/api/posts/${post._id}/like`);
      if (response.data && response.data.success) {
        if (onPostUpdated) {
          onPostUpdated(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleOpenDelete = () => {
    handleCloseMenu();
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const data = await deletePostApi(post._id);
      if (data && data.success) {
        setIsDeleteDialogOpen(false);
        if (onPostDeleted) {
          onPostDeleted(post._id);
        }
        if (onNotification) {
          onNotification('Post deleted successfully', 'success');
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete post';
      if (onNotification) {
        onNotification(message, 'error');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenEdit = () => {
    handleCloseMenu();
    setEditText(post.text || '');
    setEditFile(null);
    setIsImageRemoved(false);
    setEditImagePreview(post.image ? getImageUrl(post.image) : null);
    setIsEditDialogOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditDialogOpen(false);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFile(file);
      setEditImagePreview(URL.createObjectURL(file));
      setIsImageRemoved(false);
    }
  };

  const handleRemoveEditImage = () => {
    setEditFile(null);
    setEditImagePreview(null);
    setIsImageRemoved(true);
    if (editFileInputRef.current) {
      editFileInputRef.current.value = '';
    }
  };

  const handleSaveEdit = async () => {
    if (!editText.trim() && !editImagePreview) {
      if (onNotification) onNotification('Post must contain text or an image', 'error');
      return;
    }

    setIsSavingEdit(true);
    try {
      const formData = new FormData();
      formData.append('text', editText.trim());
      if (editFile) {
        formData.append('image', editFile);
      }
      if (isImageRemoved && !editFile) {
        formData.append('removeImage', 'true');
      }

      const data = await updatePostApi(post._id, formData);

      if (data && data.success) {
        setIsEditDialogOpen(false);
        if (onPostUpdated) {
          onPostUpdated(data.data);
        }
        if (onNotification) {
          onNotification('Post updated successfully', 'success');
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update post';
      if (onNotification) {
        onNotification(message, 'error');
      }
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleCopyText = () => {
    handleCloseMenu();
    if (post.text) {
      navigator.clipboard.writeText(post.text);
      if (onNotification) {
        onNotification('Copied to clipboard', 'info');
      }
    }
  };

  const handleOpenProfile = () => {
    handleCloseMenu();
    setIsProfileDialogOpen(true);
  };

  const username = post.user?.username || 'Anshika Pathak';

  return (
    <Card
      sx={{
        borderRadius: '16px',
        mb: 2.5,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        border: '1px solid #E5E7EB',
        backgroundColor: '#FFFFFF',
        maxWidth: 620,
        mx: 'auto'
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            onClick={handleOpenProfile}
            sx={{
              bgcolor: '#6366F1',
              fontWeight: 600,
              width: 40,
              height: 40,
              fontSize: 15,
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            {getInitial(username)}
          </Avatar>
        }
        action={
          <IconButton onClick={handleOpenMenu} size="small" sx={{ color: '#9CA3AF' }}>
            <MoreHorizRoundedIcon />
          </IconButton>
        }
        title={
          <Typography
            onClick={handleOpenProfile}
            variant="subtitle1"
            sx={{ fontWeight: 700, color: '#111827', fontSize: '15px', lineHeight: 1.3, cursor: 'pointer' }}
          >
            {username}
          </Typography>
        }
        subheader={
          <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '13px' }}>
            {formatRelativeTime(post.createdAt)}
          </Typography>
        }
        sx={{ p: { xs: 1.5, sm: 2 }, pb: 1 }}
      />

      <Menu
        anchorEl={menuAnchor}
        open={isMenuOpen}
        onClose={handleCloseMenu}
        PaperProps={{
          elevation: 0,
          sx: {
            width: 180,
            borderRadius: '16px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
            py: 0.5
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {isOwner ? (
          [
            <MenuItem key="edit" onClick={handleOpenEdit} sx={{ fontSize: '14px', py: 1 }}>
              <ListItemIcon>
                <EditIcon fontSize="small" sx={{ color: '#4F46E5' }} />
              </ListItemIcon>
              <ListItemText primary="Edit Post" />
            </MenuItem>,
            <MenuItem key="delete" onClick={handleOpenDelete} sx={{ fontSize: '14px', py: 1, color: '#DC2626' }}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" sx={{ color: '#DC2626' }} />
              </ListItemIcon>
              <ListItemText primary="Delete Post" />
            </MenuItem>
          ]
        ) : (
          [
            <MenuItem key="profile" onClick={handleOpenProfile} sx={{ fontSize: '14px', py: 1 }}>
              <ListItemIcon>
                <PersonIcon fontSize="small" sx={{ color: '#4F46E5' }} />
              </ListItemIcon>
              <ListItemText primary="View Profile" />
            </MenuItem>,
            <MenuItem
              key="copy"
              onClick={handleCopyText}
              disabled={!post.text}
              sx={{ fontSize: '14px', py: 1 }}
            >
              <ListItemIcon>
                <ContentCopyIcon fontSize="small" sx={{ color: '#6B7280' }} />
              </ListItemIcon>
              <ListItemText primary="Copy Text" />
            </MenuItem>
          ]
        )}
      </Menu>

      {post.text && (
        <CardContent sx={{ px: { xs: 1.5, sm: 2 }, pt: 0.5, pb: 1.5, mb: post.image ? 1.5 : 0 }}>
          <Typography
            variant="body1"
            sx={{
              color: '#1F2937',
              fontSize: '15px',
              whiteSpace: 'pre-line',
              lineHeight: 1.5
            }}
          >
            {post.text}
          </Typography>
        </CardContent>
      )}

      {post.image && (
        <Box sx={{ px: { xs: 1.5, sm: 2 }, mb: 1.5 }}>
          <CardMedia
            component="img"
            image={getImageUrl(post.image)}
            alt="Post media content"
            onClick={() => setIsFullscreenImageOpen(true)}
            sx={{
              borderRadius: '14px',
              maxHeight: { xs: 300, sm: 380 },
              objectFit: 'cover',
              width: '100%',
              backgroundColor: '#FAFAFC',
              cursor: 'pointer'
            }}
          />
        </Box>
      )}

      <CardActions
        disableSpacing
        sx={{
          px: { xs: 1.5, sm: 2 },
          py: 1,
          borderTop: '1px solid #E5E7EB',
          justify: 'space-between',
          flexWrap: 'wrap',
          gap: 0.5
        }}
      >
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          <Button
            size="small"
            onClick={handleToggleLike}
            disabled={isLiking}
            startIcon={
              isLiked ? (
                <FavoriteIcon sx={{ color: '#EF4444' }} />
              ) : (
                <FavoriteBorderIcon sx={{ color: '#111827' }} />
              )
            }
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              fontWeight: 600,
              color: isLiked ? '#EF4444' : '#111827',
              px: { xs: 1, sm: 1.5 },
              fontSize: '13px'
            }}
          >
            {likesCount} Likes
          </Button>

          <Button
            size="small"
            onClick={() => setShowComments(!showComments)}
            startIcon={<ChatBubbleOutlineRoundedIcon sx={{ color: showComments ? '#4F46E5' : '#4B5563' }} />}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              fontWeight: 600,
              color: showComments ? '#4F46E5' : '#4B5563',
              px: { xs: 1, sm: 1.5 },
              fontSize: '13px'
            }}
          >
            {commentsCount} Comments
          </Button>
        </Box>

        <IconButton size="small" onClick={handleCopyText} sx={{ color: '#9CA3AF' }}>
          <ShareOutlinedIcon fontSize="small" />
        </IconButton>
      </CardActions>

      <Collapse in={showComments} timeout={250}>
        <Box sx={{ px: { xs: 1.5, sm: 2 }, pb: 2 }}>
          <CommentSection
            postId={post._id}
            comments={post.comments || []}
            onCommentAdded={(updated) => onPostUpdated && onPostUpdated(updated)}
          />
        </Box>
      </Collapse>

      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDelete} PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '18px', color: '#111827' }}>Delete Post</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#6B7280', fontSize: '15px' }}>
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDelete} variant="outlined" sx={{ borderRadius: 999, color: '#6B7280', borderColor: '#E5E7EB' }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            disabled={isDeleting}
            sx={{
              borderRadius: 999,
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              '&:hover': { backgroundColor: '#B91C1C' }
            }}
          >
            {isDeleting ? <CircularProgress size={20} color="inherit" /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isEditDialogOpen} onClose={handleCloseEdit} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '20px', color: '#111827' }}>Edit Post</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="Edit text content..."
            sx={{ mt: 1, mb: 2 }}
          />

          {editImagePreview && (
            <Box sx={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', maxHeight: 260, mb: 2 }}>
              <img src={editImagePreview} alt="Edit preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <IconButton
                size="small"
                onClick={handleRemoveEditImage}
                sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(17, 24, 39, 0.75)', color: '#FFFFFF' }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}

          <input type="file" accept="image/*" ref={editFileInputRef} onChange={handleEditImageChange} style={{ display: 'none' }} id={`edit-file-${post._id}`} />
          <label htmlFor={`edit-file-${post._id}`}>
            <Button component="span" startIcon={<ImageIcon sx={{ color: '#4F46E5' }} />} sx={{ borderRadius: 999, color: '#6B7280', border: '1px solid #E5E7EB' }}>
              Replace Image
            </Button>
          </label>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseEdit} variant="outlined" sx={{ borderRadius: 999, color: '#6B7280', borderColor: '#E5E7EB' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            disabled={isSavingEdit}
            sx={{ borderRadius: 999, backgroundColor: '#4F46E5', color: '#FFFFFF', '&:hover': { backgroundColor: '#4338CA' } }}
          >
            {isSavingEdit ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isProfileDialogOpen} onClose={() => setIsProfileDialogOpen(false)} PaperProps={{ sx: { borderRadius: '24px', p: 2, textAlign: 'center', width: 320 } }}>
        <Avatar sx={{ width: 72, height: 72, bgcolor: '#6366F1', fontSize: 28, fontWeight: 700, margin: '0 auto 16px auto' }}>
          {getInitial(username)}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>
          {username}
        </Typography>
        <Button onClick={() => setIsProfileDialogOpen(false)} variant="contained" sx={{ mt: 2.5, borderRadius: 999, backgroundColor: '#4F46E5', width: '100%' }}>
          Close
        </Button>
      </Dialog>

      <Dialog
        open={isFullscreenImageOpen}
        onClose={() => setIsFullscreenImageOpen(false)}
        maxWidth="lg"
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            boxShadow: 'none',
            borderRadius: { xs: 0, sm: '20px' },
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ position: 'relative', p: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <IconButton
            onClick={() => setIsFullscreenImageOpen(false)}
            sx={{ position: 'absolute', top: 12, right: 12, color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <CloseIcon />
          </IconButton>
          {post.image && (
            <img
              src={getImageUrl(post.image)}
              alt="Fullscreen post image"
              style={{ maxHeight: '85vh', maxWidth: '90vw', objectFit: 'contain', borderRadius: '12px' }}
            />
          )}
        </Box>
      </Dialog>
    </Card>
  );
};

export default PostCard;
