import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface UserContextProps {
  email: string | null;
  password: string | null;
  userId: number | null;
  loggedIn: boolean;
  startDate: Date;
  endDate: Date
  setCredentials: (email: string| null, password: string| null, userId: number| null, loggedIn: boolean) => void;
  setStartDate: (startDate: Date)=> void;
  setEndDate: (endDate: Date) => void
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [email, setEmail] = useState<string | null>(localStorage.getItem('email') || null);
  const [password, setPassword] = useState<string | null>(localStorage.getItem('password') || null);
  const userIdString = localStorage.getItem('userId');
  const userIdNumber = userIdString ? parseInt(userIdString, 10) : null;
  const [userId, setUserId] = useState<number | null>(userIdNumber);
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 30);
  const [startDate, setStartDate] = useState<Date>(start)
  const [endDate, setEndDate] = useState<Date>(today)
  let initLoggedInState = false;
  if (userIdNumber !== 0 && userIdNumber !== null && typeof userIdNumber === 'number') {
    initLoggedInState = true;
  }
  
  const [loggedIn, setLoggedIn] = useState<boolean>(initLoggedInState);

  const setCredentials = (newEmail: string | null, newPassword: string | null, userId: number | null, loggedIn: boolean) => {
    setEmail(newEmail);
    setPassword(newPassword);
    setUserId(userId);
    setLoggedIn(loggedIn);
  };

  const checkSessionTimeout = () => {
    const sessionTimeout =  60 * 60 * 1000;
    const loginTime = localStorage.getItem('loginTime');

    if (loginTime && new Date().getTime() - parseInt(loginTime, 10) > sessionTimeout) {
      // Handle logout
      setCredentials(null, null, null, false);
      // Clear local storage
      localStorage.removeItem('userName');
      localStorage.removeItem('userPassword');
      localStorage.removeItem('loginTime');
      localStorage.removeItem('loggedIn');
    }
  };

  useEffect(() => {
    // Attach event listener to handle storage changes (e.g., in other tabs)
    const handleStorageChange = () => {
      checkSessionTimeout();
    };
    window.addEventListener('storage', handleStorageChange);
    checkSessionTimeout(); // Check session timeout on component mount
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const contextValue: UserContextProps = {
    email,
    password,
    userId,
    loggedIn,
    startDate,
    endDate,
    setCredentials,
    setStartDate,
    setEndDate
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
