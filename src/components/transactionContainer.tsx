import React, { useState, useEffect } from 'react';
import { Container, Dimmer, Loader } from 'semantic-ui-react';
import Transactions from './transactionTable.tsx'; // Assuming you have a type or interface for transaction data
import { useNavigate } from 'react-router-dom';
import { useUserContext } from './userContext.tsx'; 

const TransactionContainer: React.FC<{}> = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loggedIn: contextLoggedIn } = useUserContext();
  const [loggedIn, setLoggedIn] = useState<boolean>(contextLoggedIn);

  useEffect(() => {
    setLoggedIn(contextLoggedIn);
  }, [contextLoggedIn]);
  const navigate = useNavigate();

  const fetchTransactionsFromAPI = async () => {
    const data = {
      email: "ramanvanakalla123@gmail.com",
      password: "Raman@123",
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
    console.log(loggedIn)
    const fetchData = async () => {
      console.log("Fetching data");
        await fetchTransactionsFromAPI();
        return;
      if (loggedIn) {
        console.log("Fetching data");
        await fetchTransactionsFromAPI();
      } else {
        console.log("routing it to login")
        navigate("/login");
      }
    };

    fetchData();
  }, [loggedIn]);

  return (
    <div>
      <Container>
        {loading ? (
          <Dimmer active>
            <Loader>Loading...</Loader>
          </Dimmer>
        ) : (
          <Transactions transactions={transactions} fetchTransactions={fetchTransactionsFromAPI} />
        )}
      </Container>
    </div>
  );
};

export default TransactionContainer;
