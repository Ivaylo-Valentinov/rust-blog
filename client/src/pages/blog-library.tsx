import React from 'react';
import { Container, Button, Box, Typography } from '@mui/material';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutline';
import { Link } from 'react-router-dom';

export function BlogLibrary() {
  return (
    <Container component="div" maxWidth="md" sx={{
      display: 'grid',
      justifyContent: 'center',
      paddingTop: 20
    }} >
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridGap: 2
      }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlinedIcon />}
          component={Link}
          to="/blog/new"
        >Add Blog</Button>
      </Box>
      <Typography>No blogs</Typography>
    </Container>
  );
}