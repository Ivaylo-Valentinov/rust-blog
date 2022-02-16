import React, { useState } from 'react';
import { ListedBlog } from '../components/listed-blog';
import { Box, Button, Typography, Container, styled } from '@mui/material';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import { useAsync } from '../hooks/use-async';
import { Loading } from '../components/loading';
import { useParams } from 'react-router-dom';
import { loadSearchBlogByTitle } from '../services/blog-service';

const StyledDiv = styled('div')(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 250px)',
  gridGap: 10,
  justifyContent: 'space-evenly',
  gridAutoRows: 200,
}));

const PAGE_SIZE = 10;

export function SearchResults() {
  const { title } = useParams<{ title: string }>();
  const [pageNumber, setPageNumber] = useState(0);

  const { data: blogs, loading, error } = useAsync(() => loadSearchBlogByTitle(title || '', pageNumber, PAGE_SIZE), [title, pageNumber]);

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
    <Container component="div" maxWidth="md" sx={{
      display: 'grid',
      justifyContent: 'center',
      paddingTop: 5
    }} >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        m={2}
      >
        <Typography variant="h6" component="span" sx={{flexGrow: 1}}>
          Search Results
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
    </Container>
  );
}
