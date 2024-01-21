import React, { useState, useEffect } from 'react';
import { Container, Dimmer, Loader } from 'semantic-ui-react';
import Transactions from './transactionTable.tsx'; // Assuming you have a type or interface for transaction data
import { useNavigate } from 'react-router-dom';
import { useUserContext } from './userContext.tsx'; 

const TransactionContainer: React.FC<{}> = () => {
  const [transactions, setTransactions] = useState([]);
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
  const navigate = useNavigate();

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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    console.log(loggedIn);
    const fetchData = async () => {
      if (loggedIn) {
        console.log("Fetching data");
        await fetchTransactionsFromAPI();
      } else {
        console.log("Routing to login");
        navigate("/login");
      }
    };
  
    fetchData();
  }, [loggedIn, email, password]); // Include email and password as dependencies
  

  return (
    <div>
      <Container>
        {loading ? (
          <Dimmer active>
            <Loader>Loading...</Loader>
          </Dimmer>
        ) : (
          <Transactions transactions={transactions} email={email} password={password} fetchTransactions={fetchTransactionsFromAPI} />
        )}
      </Container>
    </div>
  );
};

export default TransactionContainer;
