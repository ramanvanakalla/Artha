import React, { useState, useEffect } from 'react';
import Transactions from './transactionTable.tsx'; 
import CategoryTable from './categoryTable';
import { useUserContext } from './userContext.tsx'; 
import { Skeleton } from './ui/skeleton.tsx';


const CategoryContainer: React.FC = () => {
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [ categoriesLoaded, setCategoriesLoaded] = useState(false)
  const [ transactionsLoaded, setTransactionsLoaded] = useState(false)

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

  const fetchCategoriesFromAPI = async () => {
    console.log("user id", userId)
    const data = {
      email: email,
      password: password,
    };

    const url = 'https://karchu.onrender.com/v1/net-amount/';
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
      console.log(data);
      setCategories(data);
      setCategoriesLoaded(true)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchTransactionsFromAPI = async () => {
    console.log("user id", userId)
    if( email == null || password == null){
      console.log("invalid cred: email:",email, " password:", password)
    }
    const data = {
      email: email,
      password: password,
    };

    const url = 'https://karchu.onrender.com/v1/transactions/get';
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
      setTransactions(data);
      setTransactionsLoaded(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchData = async () => {
    try {
      await fetchCategoriesFromAPI();
      await fetchTransactionsFromAPI();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [loggedIn, email, password]);

  return (
    <div>
      <div className="flex">
          <div className='lg:w-1/3 sm:w-full'>
            { 
              categoriesLoaded ? 
                <CategoryTable categories={categories} email={email} password={password} fetchTransactions={fetchCategoriesFromAPI} />
              :
                <Skeleton className='h-screen' />
            }
          </div>
          <div className='lg:w-2/3 sm:w-full'>
            {
              transactionsLoaded ?
                <Transactions transactions={transactions} email={email} password={password} fetchCategories={fetchCategoriesFromAPI} fetchTransactions={fetchTransactionsFromAPI} />
              :
                <Skeleton className='h-screen' />
            }
          </div>
        </div>
    </div>
  );
};

export default CategoryContainer;
