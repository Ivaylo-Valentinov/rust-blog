import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { useMutation } from '../hooks/use-mutation';
import { BlogModel, addMoreText } from '../services/blog-service';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutline';
import { useCurrentUser } from '../context/current-user';
import { SubmitButton } from './submit-button';

interface EditBlogButtonProps {
  blog: BlogModel;
  reload: () => any;
}

export function EditBlogButton(props: EditBlogButtonProps) {
  const [openAddTextDialog, setOpenAddTextDialog] = useState(false);
  const [text, setText] = useState('');
  const user = useCurrentUser();

  const { submit, loading, error, unsetError } = useMutation(async () => {
    await addMoreText(props.blog.id, text);
    setText('');
    setOpenAddTextDialog(false);
    props.reload();
  });

  function handleCloseAddTextDialog() {
    setText('');
    setOpenAddTextDialog(false);
  };

  return (<>{user?.id === props.blog.added_by &&
    <Box sx={{
      padding: 1,
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'center'
    }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenAddTextDialog(true)}
        startIcon={<AddCircleOutlinedIcon />}
      >
        Add more text
      </Button>
      <Dialog open={openAddTextDialog} onClose={handleCloseAddTextDialog} aria-labelledby="Add more text">
        <DialogTitle>Add more text</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add more text to this post, just write the text here and click the "ADD" button.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            label="Your text"
            value={text}
            onChange={event => setText(event.target.value)}
            type="text"
            multiline
            rows={5}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddTextDialog} color="primary" endIcon={<CloseIcon />}>
            Cancel
          </Button>
          <SubmitButton
            loading={loading}
            error={error}
            onClose={() => { unsetError(); }}
            onClick={submit}
            color="primary">
            Add <CheckIcon />
          </SubmitButton>
        </DialogActions>
      </Dialog>
    </Box>
}</>);
}
