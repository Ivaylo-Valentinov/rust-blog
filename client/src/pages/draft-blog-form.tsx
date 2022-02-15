import React, { useState, FormEvent } from 'react';
import { Box, Container, Switch, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutline';
import { SubmitButton } from '../components/submit-button';
import { useMutation } from '../hooks/use-mutation';
import { publishBlogPost, saveDraftBlogPost } from '../services/blog-service';

export function DraftBlogForm() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const navigate = useNavigate();
  const [checked, setChecked] = useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    unsetDraft();
    unsetPublish();
    setChecked(event.target.checked);
  };

  const { submit: submitDraft, loading: loadingDraft, error: errorDraft, unsetError: unsetDraft } = useMutation(async () => {
    await saveDraftBlogPost("1", title, text);
    navigate('/');
  });

  const { submit: submitPublish, loading: loadingPublish, error: errorPublish, unsetError: unsetPublish } = useMutation(async () => {
    await publishBlogPost("1");
    navigate('/');
  });

  async function submitForm(event: FormEvent) {
    event.preventDefault();
    if (checked) {
      await submitPublish();
    } else {
      await submitDraft();
    }
  }

  return (
    <form onSubmit={submitForm} >
      <Container
        component="div"
        maxWidth="sm"
        sx={{display: 'flex', flexDirection: 'column', gridGap: '10px', marginTop: '40px'}}
      >
        <TextField
          required
          label="Title"
          variant="outlined"
          value={title}
          type="text"
          onChange={event => setTitle(event.target.value)}
          disabled={checked}
        />
        <TextField
          required
          label="Enter the blog text here"
          multiline
          rows={20}
          value={text}
          variant="outlined"
          onChange={event => setText(event.target.value)}
          sx={{flexGrow: 1}}
          disabled={checked}
        />
        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <Switch
            checked={checked}
            onChange={handleChange}
          />
          <SubmitButton
            loading={checked ? loadingPublish : loadingDraft}
            error={checked ? errorPublish : errorDraft}
            type="submit"
            variant="contained"
            color="primary"
            sx={{flexGrow: 1}}
          ><AddCircleOutlinedIcon />{checked ? 'Publish' : 'Save draft'}</SubmitButton>
        </Box>
        <Typography>* "Publish" will publish the last saved draft version.</Typography>
      </Container>
    </form>
  );
}
