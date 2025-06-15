import React from 'react';
import { Box, Skeleton, useTheme, useMediaQuery } from '@mui/material';

// Skeleton Loading Component
export const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getSkeletonByType = () => {
    switch (type) {
      case 'card':
        return (
          <Box sx={{ p: 2, width: '100%' }}>
            <Skeleton variant="rectangular" height={isMobile ? 120 : 200} />
            <Skeleton variant="text" sx={{ mt: 1 }} />
            <Skeleton variant="text" width="60%" />
          </Box>
        );
      case 'list':
        return (
          <Box sx={{ p: 1 }}>
            <Skeleton variant="text" />
            <Skeleton variant="text" width="80%" />
          </Box>
        );
      default:
        return null;
    }
  };

  return [...Array(count)].map((_, index) => (
    <Box key={index} sx={{ mb: 2 }}>
      {getSkeletonByType()}
    </Box>
  ));
};

// Glass Morphism Container
export const GlassContainer = ({ children, ...props }) => (
  <Box
    sx={{
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: 2,
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: 3,
      transition: 'transform 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
      },
      ...props.sx
    }}
  >
    {children}
  </Box>
);

// Animated Button
export const AnimatedButton = ({ children, ...props }) => (
  <Button
    {...props}
    sx={{
      position: 'relative',
      overflow: 'hidden',
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0))',
        transform: 'translateY(-100%)',
        transition: 'transform 0.3s ease-in-out',
      },
      '&:hover::after': {
        transform: 'translateY(0)',
      },
      ...props.sx
    }}
  >
    {children}
  </Button>
);

// Responsive Grid Container
export const ResponsiveGrid = ({ children, spacing = 2, minChildWidth = 280 }) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        display: 'grid',
        gap: spacing,
        gridTemplateColumns: `repeat(auto-fill, minmax(${minChildWidth}px, 1fr))`,
        [theme.breakpoints.down('sm')]: {
          gridTemplateColumns: '1fr',
        }
      }}
    >
      {children}
    </Box>
  );
};

// Infinite Scroll Container
export const InfiniteScrollContainer = ({ children, onLoadMore, hasMore, loading }) => {
  const [observer, setObserver] = React.useState(null);
  const loadMoreRef = React.useRef(null);

  React.useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !loading) {
        onLoadMore();
      }
    }, options);

    setObserver(observer);

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (observer && loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (observer && loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [observer, loadMoreRef]);

  return (
    <Box>
      {children}
      <Box ref={loadMoreRef} sx={{ height: 20 }} />
      {loading && <SkeletonLoader count={2} />}
    </Box>
  );
};
