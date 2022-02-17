import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Likes } from '../components/likes';
import { Loading } from '../components/loading';
import { useAsync } from '../hooks/use-async';
import { useParams } from 'react-router-dom';
import { loadPostById } from '../services/blog-service';
import { Comments } from '../components/comments';
import { Paragraph } from '../components/paragraph';

export function Blog() {
  const { id } = useParams<{ id: string }>();

  const { data: blogData, loading, error } = useAsync(() => loadPostById(id || ''), []);

  return (
    <Loading loading={loading} error={error} size={100} >
      {() => <>
        <Container
          maxWidth="md"
          sx={{
            display: 'grid',
            gridGap: 2,
            alignItems: 'center',
            justifyItems: 'center',
            marginTop: 5,
          }}
        >
          <Box
            textAlign="center"
          >
            <Typography variant="h4">
              {blogData!.blog.title}
            </Typography>
            <Likes id={id!} userLiked={blogData!.likes.user_liked} likeCount={blogData!.likes.like_count} />
          </Box>
          <Box
            sx={{
              width: 'md'
            }}
          >
            {blogData!.paragraphs.map((paragraph) => <Paragraph key={paragraph.id} paragraph={paragraph} />)}
          </Box>
        </Container>
        <Container
          maxWidth="md"
          sx={{
            marginTop: 5,
            marginBottom: 20
          }}
        >
          <Comments blogId={blogData!.blog.id} />
        </Container>
      </>
      }
    </Loading>
  );
}
