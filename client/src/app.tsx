import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CurrentUserContextProvider } from './context/current-user';
import { CssBaseline } from '@mui/material';
import { PublicRoute } from './auth/public-route';
import { Login } from './auth/login';
import { Register } from './auth/register';
import { Toolbar } from './components/toolbar';

export default function App() {
  return (
    <BrowserRouter>
      <CurrentUserContextProvider>
        <CssBaseline />
        <Toolbar />
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          <Route path="*" element={<Navigate replace to="/login" />} />
        </Routes>
      </CurrentUserContextProvider>
    </BrowserRouter>
  );
}