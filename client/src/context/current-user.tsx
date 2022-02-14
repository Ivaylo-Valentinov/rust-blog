import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { authService, UserAuth } from '../services/auth-service';

const CurrentUserContext = createContext<UserAuth | null>(null);

interface CurrentUserContextProviderProps {
  children: ReactNode;
}

export function CurrentUserContextProvider({ children }: CurrentUserContextProviderProps) {
  const [user, setUser] = useState<UserAuth | null>(authService.storedUser);

  useEffect(() => {
    authService.changeHandler = setUser;
    return (() => { authService.changeHandler = null; });
  });

  return (
    <CurrentUserContext.Provider value={user}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  return useContext(CurrentUserContext);
}
