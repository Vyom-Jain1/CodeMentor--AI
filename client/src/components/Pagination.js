import React from 'react';
import { Pagination as MuiPagination, Box } from '@mui/material';

const Pagination = ({ count, page, onChange, color = 'primary' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: 3,
        mb: 3,
      }}
    >
      <MuiPagination
        count={count}
        page={page}
        onChange={onChange}
        color={color}
        showFirstButton
        showLastButton
        size="large"
      />
    </Box>
  );
};

export default Pagination; 