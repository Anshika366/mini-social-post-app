import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';

const EmptyState = () => {
  return (
    <Card
      sx={{
        borderRadius: '20px',
        p: 4,
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        border: '1px solid #f1f5f9',
        backgroundColor: '#ffffff',
        my: 3
      }}
    >
      <CardContent>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            backgroundColor: '#eeedfd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}
        >
          <DynamicFeedIcon sx={{ fontSize: 36, color: '#4f46e5' }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          No posts available yet
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 360, mx: 'auto' }}>
          Be the first community member to create a post above! Share thoughts, updates, or images with everyone.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
