import React, { useState, FormEvent } from 'react';
import { Container, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { authService } from '../services/auth-service';
import { useMutation } from '../hooks/use-mutation';
import { SubmitButton } from '../components/submit-button';

export function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const navigate = useNavigate();

  const { submit, loading, error } = useMutation(() => authService.register(username, email, password, confirmedPassword));

  async function submitForm(event: FormEvent) {
    event.preventDefault();
    try {
      await submit();
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form onSubmit={submitForm} >
      <Container
        component="div"
        maxWidth="sm"
        sx={{ display: 'grid', gridTemplateRows: '1fr 1fr', gridGap: '10px', marginTop: '40px'}}
      >
        <TextField
          required
          label="Your name"
          variant="outlined"
          value={username}
          type="text"
          onChange={event => setUsername(event.target.value)}
        />
        <TextField
          required
          label="Your email"
          variant="outlined"
          value={email}
          type="email"
          onChange={event => setEmail(event.target.value)}
        />
        <TextField
          required
          label="Password"
          type="password"
          value={password}
          variant="outlined"
          onChange={event => setPassword(event.target.value)}
        />
        <TextField
          required
          label="Confirm password"
          type="password"
          value={confirmedPassword}
          variant="outlined"
          onChange={event => setConfirmedPassword(event.target.value)}
        />
        <SubmitButton
          loading={loading}
          error={error}
          type="submit"
          variant="contained"
          color="primary"
        >Register <HowToRegIcon /></SubmitButton>
      </Container>
    </form>
  );
}