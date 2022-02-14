import { Button, ButtonProps, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface SubmitButtonProps extends ButtonProps {
  loading: boolean;
  error: Error | null;
  onClose?: () => void;
}

export function SubmitButton({ loading, error, disabled, onClose, children, ...rest }: SubmitButtonProps) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!!error) {
      setOpen(true);
    }
  }, [error]);

  function handleClose() {
    setOpen(false);
    if (onClose !== undefined) {
      onClose();
    }
  }
  return (
    <>
      <Button {...rest} disabled={loading}>
        {!loading && <>{children}</>}
        {loading && <CircularProgress size={25} />}
      </Button >
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {error?.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
