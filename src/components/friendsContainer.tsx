import React, { useState, useEffect } from 'react';
import FriendTransactions from './friendsTransactions.tsx'
import { Skeleton } from './ui/skeleton.tsx';
import { useUserContext } from './userContext.tsx'; 
import SplitTransactions from './splitTransactionTable.tsx';


const FriendsContainer: React.FC = () => {
  const [moneyLentToFriend, setMoneyLentToFriend] = useState([]);
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
  const fetchMoneyLentToFriends = async () => {
    const data = {
      email: email,
      password: password,
    };
    console.log("user ", userId)
    const url = 'https://karchu.onrender.com/v2/friends/money-friends';
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
      setMoneyLentToFriend(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchSplitTransactionsFromAPI = async () => {
    const data = {
      email: email,
      password: password,
    };
    console.log("user ", userId)
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
  }

  const fetchData = async () => {
    try {
      await fetchMoneyLentToFriends();
      await fetchSplitTransactionsFromAPI();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [loggedIn, email, password]);

  return (
    <div>
      {loading ? (
        <Skeleton className='mx-60 h-screen' />
      ) : (
        <div className="flex">
          <div className='lg:w-1/3 sm:w-full'>
             <FriendTransactions transactions={moneyLentToFriend} email={email} password={password} fetchTransactions={fetchMoneyLentToFriends} />
          </div>
          <div className='lg:w-2/3 sm:w-full'>
            <SplitTransactions transactions={splitTransactions} email={email} password={password} fetchTransactions={fetchSplitTransactionsFromAPI} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendsContainer;
