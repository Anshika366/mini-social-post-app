import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import Navbar from '../components/Navbar';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import api from '../services/api';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  const fetchPosts = useCallback(async (pageNumber = 1, isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      else setLoadingMore(true);

      const response = await api.get(`/api/posts?page=${pageNumber}&limit=10`);
      if (response.data && response.data.success) {
        const { posts: newPosts, hasMore: moreAvailable } = response.data.data;

        if (pageNumber === 1) {
          setPosts(newPosts);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        }

        setHasMore(moreAvailable);
        setPage(pageNumber);
      }
    } catch (error) {
      setToast({
        open: true,
        message: 'Failed to load social feed posts',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(1, true);
  }, [fetchPosts]);

  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setToast({
      open: true,
      message: 'Post created successfully!',
      severity: 'success'
    });
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
  };

  const handlePostDeleted = (deletedPostId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== deletedPostId));
  };

  const handleNotification = (message, severity = 'info') => {
    setToast({
      open: true,
      message,
      severity
    });
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchPosts(page + 1, false);
    }
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  return (
    <Box sx={{ backgroundColor: '#F5F6FA', minHeight: '100vh', pb: 6 }}>
      <Navbar />
      <div className="feed-container">
        <CreatePost
          onPostCreated={handlePostCreated}
          onError={(msg) => handleNotification(msg, 'error')}
        />

        {loading ? (
          <>
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
          </>
        ) : posts.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onPostUpdated={handlePostUpdated}
                onPostDeleted={handlePostDeleted}
                onNotification={handleNotification}
              />
            ))}

            {hasMore && (
              <Box sx={{ textAlign: 'center', mt: 3, mb: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  sx={{
                    borderRadius: 999,
                    px: 4,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 700,
                    borderColor: '#CBD5E1',
                    color: '#4F46E5',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                    '&:hover': {
                      borderColor: '#4F46E5',
                      backgroundColor: '#EEEDFD'
                    }
                  }}
                >
                  {loadingMore ? <CircularProgress size={20} color="inherit" /> : 'Load More Posts'}
                </Button>
              </Box>
            )}
          </>
        )}
      </div>

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
    </Box>
  );
};

export default Feed;
