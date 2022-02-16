import React, { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { useMutation } from '../hooks/use-mutation';
import { dislikePost, likePost } from '../services/blog-service';

interface LikesProps {
  id: string;
  userLiked: boolean;
  likeCount: number;
}

export function Likes(props: LikesProps) {
  const [liked, setLiked] = useState<boolean>(props.userLiked || false);
  const [count, setCount] = useState<number>(props.likeCount);

  const { submit: submit_like } = useMutation(() => likePost(props.id));

  const { submit: submit_dislike } = useMutation(() => dislikePost(props.id));

  async function like() {
    await submit_like();
    setLiked(true);
    setCount(count + 1);
  }

  async function dislike() {
    await submit_dislike();
    setLiked(false);
    setCount(count - 1);
  }

  return (
    <Box sx={{
      padding: 5,
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'center'
    }}>
      <IconButton color="inherit" disabled={liked} onClick={like}>
        {<ThumbUpIcon />}
      </IconButton>
      <IconButton color="inherit" disabled={!liked} onClick={dislike}>
        {<ThumbDownIcon />}
      </IconButton>
      <Typography variant="h6">Likes: {count}</Typography>
    </Box>
  );
}
