import { Box, CircularProgress } from '@mui/material';
import React, { ReactNode } from 'react';

interface LoadingProps {
  loading: boolean;
  size: number;
  error: Error | null;
  children: () => ReactNode;
}

export function Loading(props: LoadingProps) {
  return (
    <>
      {props.loading && (
        <Box m={4} textAlign="center" >
          <CircularProgress size={props.size} />
        </Box>
      )}
      {!props.loading && props.error && (
        <Box m={4} textAlign="center">
          {props.error.message}
        </Box>
      )}
      {!props.loading && !props.error && <>{props.children()}</>}
    </>
  );
}