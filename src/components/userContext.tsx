import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UserContextProps {
  email: string | null;
  password: string | null;
  userId: number| null;
  loggedIn: boolean,
  setCredentials: (email: string, password: string, userId: number, loggedIn: boolean) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [userId, setUserId] = useState<number| null>(null)
  const [loggedIn, setLoggedIn] = useState<boolean>(false)

  const setCredentials = (newEmail: string, newPassword: string, userId: number, loggedIn: boolean) => {
    setEmail(newEmail);
    setPassword(newPassword);
    setUserId(userId);
    setLoggedIn(loggedIn)
  };

  const contextValue: UserContextProps = {
    email,
    password,
    userId,
    loggedIn,
    setCredentials,
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export const UserConsumer = UserContext.Consumer;
