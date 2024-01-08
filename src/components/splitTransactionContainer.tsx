import { Component } from 'react';
import SplitTransactions from './splitTransactionTable.tsx';
import { Skeleton } from './ui/skeleton.tsx';

interface TransactionContainerState {
  splitTransactions: [];
  loading: boolean;
}

class SplitTransactionContainer extends Component<{}, TransactionContainerState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      splitTransactions: [],
      loading: true,
    };
  }

  fetchSplitTransactionsFromAPI(): void {
    const data = {
      email: "ramanvanakalla123@gmail.com",
      password: "Raman@123",
    };

    const url = 'https://karchu.onrender.com/v2/split-transaction/get-splits';
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
        this.setState({ splitTransactions: data, loading: false });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  componentDidMount(): void {
    this.fetchSplitTransactionsFromAPI();
  }

  render(): JSX.Element {
    return (
      <div >
          {this.state.loading ? (
            <Skeleton className='mx-60 h-screen '/>
          ) : (
            <SplitTransactions transactions={this.state.splitTransactions} fetchTransactions={this.fetchSplitTransactionsFromAPI.bind(this)}></SplitTransactions>
          )}
      </div>
    );
  }
}

export default SplitTransactionContainer;
