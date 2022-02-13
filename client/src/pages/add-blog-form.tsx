import React, { useState, FormEvent } from 'react';
import { Container, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutline';
import { SubmitButton } from '../components/submit-button';
import { useMutation } from '../hooks/use-mutation';
import { addBlogPost } from '../services/blog-service';

export function AddBlogForm() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const navigate = useNavigate();

  const { submit, loading, error } = useMutation(async () => {
    await addBlogPost(title, text);
    navigate('/');
  });

  async function submitForm(event: FormEvent) {
    event.preventDefault();
    await submit();
  }

  return (
    <form onSubmit={submitForm} >
      <Container
        component="div"
        maxWidth="sm"
        sx={{display: 'grid', gridTemplateRows: '1fr 1fr', gridGap: '10px', marginTop: '40px',}}
      >
        <TextField
          required
          label="Title"
          variant="outlined"
          value={title}
          type="text"
          onChange={event => setTitle(event.target.value)}
        />
        <SubmitButton
          loading={loading}
          error={error}
          type="submit"
          variant="contained"
          color="primary"
        ><AddCircleOutlinedIcon />Add</SubmitButton>
      </Container>
    </form>
  );
}