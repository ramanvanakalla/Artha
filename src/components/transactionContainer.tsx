import { Component } from 'react';
import { Container, Dimmer, Loader } from 'semantic-ui-react';
import Transactions from './transactionTable.tsx'; // Assuming you have a type or interface for transaction data

interface TransactionContainerState {
  transactions: [];
  loading: boolean;
}

class TransactionContainer extends Component<{}, TransactionContainerState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      transactions: [],
      loading: true,
    };
  }

  fetchTransactionsFromAPI(): void {
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

    fetch(url, options)
      .then((response) => response.json())
      .then((data: []) => {
        this.setState({ transactions: data, loading: false });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  componentDidMount(): void {
    this.fetchTransactionsFromAPI();
  }

  render(): JSX.Element {
    return (
      <div >
        <Container >
          {this.state.loading ? (
            <Dimmer active>
              <Loader>Loading...</Loader>
            </Dimmer>
          ) : (
            <Transactions transactions={this.state.transactions} fetchTransactions={this.fetchTransactionsFromAPI.bind(this)}></Transactions>
          )}
        </Container>
      </div>
    );
  }
}

export default TransactionContainer;
