import React, { useState } from 'react';
import { ListedBlog } from './listed-blog';
import { Box, Button, styled, Typography } from '@mui/material';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import { useAsync } from '../hooks/use-async';
import { Loading } from './loading';
import { loadBlogPosts, loadDraftPosts } from '../services/blog-service';

interface BlogListProps {
  isDraft?: boolean;
}

const StyledDiv = styled('div')(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 250px)',
  gridGap: 10,
  justifyContent: 'space-evenly',
  gridAutoRows: 200,
}));


const PAGE_SIZE = 5;

export function BlogList(props: BlogListProps) {
  const [pageNumber, setPageNumber] = useState(0);

  const loadFunc = props.isDraft ? loadDraftPosts : loadBlogPosts;

  const { data: blogs, loading, error } = useAsync(() => loadFunc(pageNumber, PAGE_SIZE), [pageNumber]);

  function nextPage() {
    if (!!blogs?.pageCount && pageNumber < blogs?.pageCount) {
      setPageNumber(pageNumber + 1);
    }
  }

  function previosPage() {
    if (!!blogs?.pageCount && pageNumber > 0) {
      setPageNumber(pageNumber - 1);
    }
  }
  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        m={2}
      >
        <Typography variant="h6" component="span" sx={{flexGrow: 1}}>
          {props.isDraft ? 'Your drafts' : 'Published posts'}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FastRewindIcon />}
          onClick={previosPage}
          disabled={!blogs?.pageCount || pageNumber === 0}
          sx={{marginLeft: '5px', marginRight: '5px'}}
        >Previous</Button>
        <Button
          variant="contained"
          color="primary"
          endIcon={<FastForwardIcon />}
          onClick={nextPage}
          disabled={!blogs?.pageCount || pageNumber === blogs?.pageCount}
          sx={{marginLeft: '5px', marginRight: '5px'}}
        >Next</Button>
      </Box>
      <StyledDiv>
        <Loading loading={loading} error={error} size={50} >
          {() => blogs!.results.map(blog => <ListedBlog key={blog.id} blog={blog} />)}
        </Loading>
      </StyledDiv>
    </>
  );
}