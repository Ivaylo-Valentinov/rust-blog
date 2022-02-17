import React, { useState } from 'react';
import { Box, Stack, Switch, Typography } from '@mui/material';
import { BlogParagraph } from '../services/blog-service';
import { Comments } from './comments';


interface ParagraphProps {
  paragraph: BlogParagraph;
}

export function Paragraph(props: ParagraphProps) {
  const [checked, setChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (<Stack direction="column">
    <Box 
      component="div" 
      sx={{
        display: 'flex',
        flexDirection: 'row',
        width: '600px',
        paddingTop: 1,
      }}
    >
      <Box sx={{flexGrow: 1}} >
        <Typography 
          variant="body1" 
          component="p" 
          sx={{textAlign: 'left', paddingTop: 1}}
        >
          {props.paragraph.text}
        </Typography>
      </Box>
      <Switch
        checked={checked}
        onChange={handleChange}
      />
    </Box>
    {checked && <Box>
      <Comments blogId={props.paragraph.blog_id} paragraphId={props.paragraph.id} />
    </Box>}
    </Stack>);
}
