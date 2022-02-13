import React, { useState, FormEvent } from 'react';
import { authService } from '../services/auth-service';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Box, Container } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { SubmitButton } from '../components/submit-button';
import { useMutation } from '../hooks/use-mutation';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { submit, loading, error } = useMutation(async () => {
    await authService.login(email, password);
    navigate('/');
  });
  
  async function submitForm(event: FormEvent) {
    event.preventDefault();
    submit();
  }

  return (
    <form onSubmit={submitForm} >
      <Container
        component="div"
        maxWidth="sm"
        sx={{display: "grid", gridTemplateRows: 'auto', gridGap: '10px', marginTop: '40px',}}
      >
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
          value={password}
          type="password"
          variant="outlined"
          onChange={event => setPassword(event.target.value)}
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridGap: 5
          }}
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            endIcon={<HowToRegIcon />}
            component={Link}
            to="/register"
          >Register</Button>
          <SubmitButton
            loading={loading}
            error={error}
            type="submit"
            variant="contained"
            color="primary"
          >Login<LockOpenIcon /></SubmitButton>
        </Box>
      </Container>
    </form>
  );
}