import React from 'react';
import { Card, CardContent, CardHeader, Skeleton, Box } from '@mui/material';

const LoadingSkeleton = () => {
  return (
    <Card
      sx={{
        borderRadius: '18px',
        mb: 2.5,
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        border: '1px solid #f1f5f9'
      }}
    >
      <CardHeader
        avatar={<Skeleton animation="wave" variant="circular" width={44} height={44} />}
        title={<Skeleton animation="wave" height={18} width="40%" style={{ marginBottom: 6 }} />}
        subheader={<Skeleton animation="wave" height={14} width="20%" />}
      />
      <CardContent sx={{ pt: 0 }}>
        <Skeleton animation="wave" height={16} width="90%" sx={{ mb: 1 }} />
        <Skeleton animation="wave" height={16} width="60%" sx={{ mb: 2 }} />
        <Skeleton animation="wave" variant="rounded" height={220} sx={{ borderRadius: '12px' }} />
      </CardContent>
      <Box sx={{ display: 'flex', gap: 2, px: 2, pb: 2 }}>
        <Skeleton animation="wave" height={32} width={80} sx={{ borderRadius: '16px' }} />
        <Skeleton animation="wave" height={32} width={80} sx={{ borderRadius: '16px' }} />
      </Box>
    </Card>
  );
};

export default LoadingSkeleton;
