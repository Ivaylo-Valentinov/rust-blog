import React from 'react';
import { Container, Typography } from '@mui/material';

export function Blog() {
  return (
    <Container component="div" maxWidth="md" sx={{
      display: 'grid',
      justifyContent: 'center',
      paddingTop: 20
    }} >
      <Typography>Single blog</Typography>
    </Container>
  );
}
