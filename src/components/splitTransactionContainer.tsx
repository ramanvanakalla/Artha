import React, { useState, useEffect } from 'react';
import SplitTransactions from './splitTransactionTable.tsx';
import { Skeleton } from './ui/skeleton.tsx';
import { useUserContext } from './userContext.tsx'; 

const SplitTransactionContainer: React.FC = () => {
  const [splitTransactions, setSplitTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    email: contextEmail,
    password: contextPassword,
    userId: contextUserId,
    loggedIn: contextLoggedIn
  } = useUserContext();
  const [loggedIn, setLoggedIn] = useState<boolean>(contextLoggedIn);
  const [email, setEmail] = useState<string|null>(contextEmail);
  const [password, setPassword] = useState<string|null>(contextPassword);
  const [userId, setUserId] = useState<number|null>(contextUserId);
  useEffect(() => {
    setLoggedIn(contextLoggedIn);
    setEmail(contextEmail);
    setPassword(contextPassword);
    setUserId(contextUserId);
  }, [contextLoggedIn, contextEmail, contextPassword, contextUserId]);
  const fetchSplitTransactionsFromAPI = async () => {
    const data = {
      email: email,
      password: password,
    };

    const url = 'https://karchu.onrender.com/v2/split-transaction/get-splits';
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : null,
    };

    try {
      const response = await fetch(url, options);
      const data: [] = await response.json();
      setSplitTransactions(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchSplitTransactionsFromAPI();
  }, [loggedIn, email, password]);

  return (
    <div>
      {loading ? (
        <Skeleton className='mx-60 h-screen' />
      ) : (
        <SplitTransactions transactions={splitTransactions} fetchTransactions={fetchSplitTransactionsFromAPI} />
      )}
    </div>
  );
};

export default SplitTransactionContainer;
