import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, IconButton, styled } from '@mui/material';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutline';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useAsync } from '../hooks/use-async';
import { Loading } from './loading';
import { useMutation } from '../hooks/use-mutation';
import { SubmitButton } from './submit-button';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCurrentUser } from '../context/current-user';
import { addComment, deleteComment, loadCommentsUsingParagraphId, loadCommentsUsingPostId } from '../services/blog-service';

interface CommentsProps {
  blogId: number;
  paragraphId?: number;
}

const StyledDiv = styled('div')(() => ({
  display: 'grid',
  gridAutoFlow: 'row',
  gridGap: 10,
}));

const PAGE_SIZE = 5;

export function Comments(props: CommentsProps) {
  const [pageNumber, setPageNumber] = useState(0);
  const [openAddCommentDialog, setOpenAddCommentDialog] = useState(false);
  const [commentText, setCommentText] = useState('');
  const user = useCurrentUser();

  const { data: comments, loading, error, reload } = useAsync(() => {
    if (props.paragraphId !== undefined) {
      return loadCommentsUsingParagraphId(props.blogId, props.paragraphId, pageNumber, PAGE_SIZE);
    }
  
    return loadCommentsUsingPostId(props.blogId, pageNumber, PAGE_SIZE);
  }, [props.blogId, props.paragraphId, pageNumber]);

  const { submit: submitComment, loading: mutationLoading, error: mutationError, unsetError } = useMutation(async () => {
    await addComment(props.blogId, commentText, props.paragraphId);
    setCommentText('');
    setOpenAddCommentDialog(false);
    reload();
  });

  async function onDelete(id: number) {
    await deleteComment(id);
    reload();
  }

  function nextPage() {
    if (!!comments?.pageCount && pageNumber < comments?.pageCount) {
      setPageNumber(pageNumber + 1);
    }
  }

  function previosPage() {
    if (!!comments?.pageCount && pageNumber > 0) {
      setPageNumber(pageNumber - 1);
    }
  }

  function handleCloseAddCommentDialog() {
    setCommentText('');
    setOpenAddCommentDialog(false);
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        m={2}
      >
        <Typography variant="h6" component="span" sx={{flexGrow: 1}}>
          Comments
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenAddCommentDialog(true)}
          startIcon={<AddCircleOutlinedIcon />}
        >
          Add comment
        </Button>
        <Dialog open={openAddCommentDialog} onClose={handleCloseAddCommentDialog} aria-labelledby="Add new comment">
          <DialogTitle>Add comment</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To add a comment to this post, just write the comment here and click the "ADD" button.
          </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              label="Your comment"
              value={commentText}
              onChange={event => setCommentText(event.target.value)}
              type="text"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddCommentDialog} color="primary" endIcon={<CloseIcon />}>
              Cancel
          </Button>
            <SubmitButton
              loading={mutationLoading}
              error={mutationError}
              onClose={() => { unsetError(); }}
              onClick={submitComment}
              color="primary">
              Add <CheckIcon />
            </SubmitButton>
          </DialogActions>
        </Dialog>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FastRewindIcon />}
          onClick={previosPage}
          disabled={!comments?.pageCount || pageNumber === 0}
          sx={{marginLeft: '5px', marginRight: '5px'}}
        >Previous</Button>
        <Button
          variant="contained"
          color="primary"
          endIcon={<FastForwardIcon />}
          onClick={nextPage}
          disabled={!comments?.pageCount || pageNumber === comments?.pageCount}
          sx={{marginLeft: '5px', marginRight: '5px'}}
        >Next</Button>
      </Box>
      <StyledDiv>
        <Loading loading={loading} error={error} size={50}>
          {() => (
            comments!.results.map(comment => (
              <Box
                sx={{
                  display: "grid",
                  gridGap: 5,
                  gridTemplateColumns: "auto 1fr auto",
                  alignItems: "center"
                }}
                key={comment.id}
              >
                <AccountCircle />
                <Paper
                  component="div"
                  sx={{
                    padding: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  <Typography variant="body1" component="p">
                    {comment.text}
                  </Typography>
                </Paper>
                <IconButton onClick={() => onDelete(comment.id)} disabled={user?.id !== comment.user_id}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))
          )}
        </Loading>
      </StyledDiv>
    </>
  );
}
