import React, { useState, useEffect } from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import CategoryTable from './categoryTable';
import { useUserContext } from './userContext.tsx'; 

const CategoryContainer: React.FC = () => {
  const [categories, setCategories] = useState([]);
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

  const fetchCategoriesFromAPI = async () => {
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
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchCategoriesFromAPI();
  }, [loggedIn, email, password]);

  return (
    <div>
      {loading ? (
        <Dimmer active>
          <Loader>Loading...</Loader>
        </Dimmer>
      ) : (
        <CategoryTable categories={categories} fetchTransactions={fetchCategoriesFromAPI} />
      )}
    </div>
  );
};

export default CategoryContainer;
