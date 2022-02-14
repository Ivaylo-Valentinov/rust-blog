import React from 'react';
import { RouteProps, Navigate } from 'react-router-dom';
import { useCurrentUser } from '../context/current-user';

export function PrivateRoute({ children }: RouteProps) {
  const user = useCurrentUser();

  return (user ? (
      <>{children}</>
    ) : (
      <Navigate to='/login'/>
    )
  );
}
