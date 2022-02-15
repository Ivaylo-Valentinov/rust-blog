import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { BlogModel } from '../services/blog-service';

interface ListedBlogProps {
  blog: BlogModel;
}

function getLink(blog: BlogModel): string {
  let str = `/blog/${blog.id}`;

  if (blog.text !== undefined && blog.text !== null) {
    str += '/draft';
  }

  return str;
}

export function ListedBlog(props: ListedBlogProps) {
  return (
    <Card 
      component="div" 
      sx={{
        display: 'grid'
      }}
    >
      <CardActionArea component={Link} to={getLink(props.blog)}>
        <CardContent component="div" >
          <Typography 
            variant="body1" 
            text-align="center" 
            component="p" 
            sx={{
              width: '250px',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              paddingTop: 5
            }}
          >
            {props.blog.title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}