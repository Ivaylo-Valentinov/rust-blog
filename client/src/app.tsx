import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CurrentUserContextProvider } from './context/current-user';
import { CssBaseline } from '@mui/material';
import { PublicRoute } from './auth/public-route';
import { Login } from './auth/login';
import { Register } from './auth/register';
import { Toolbar } from './components/toolbar';
import { PrivateRoute } from './auth/private-route';
import { BlogLibrary } from './pages/blog-library';
import { AddBlogForm } from './pages/add-blog-form';
import { DraftBlogForm } from './pages/draft-blog-form';
import { Blog } from './pages/blog';

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
          <Route path="/blog/new" element={
            <PrivateRoute>
              <AddBlogForm />
            </PrivateRoute>
          } />
          <Route path="/blog/:id/draft" element={
            <PrivateRoute>
              <DraftBlogForm />
            </PrivateRoute>
          } />
          <Route path="/blog/:id" element={
            <PrivateRoute>
              <Blog />
            </PrivateRoute>
          } />
          <Route path="/" element={
            <PrivateRoute>
              <BlogLibrary />
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </CurrentUserContextProvider>
    </BrowserRouter>
  );
}
