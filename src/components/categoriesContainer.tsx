import { Component } from 'react';
import { Container, Dimmer, Loader } from 'semantic-ui-react';
import CategoryTable from './categoryTable'

interface CategoryContainerState {
  categories: [];
  loading: boolean;
}

class CategoryContainer extends Component<{}, CategoryContainerState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      categories: [],
      loading: true,
    };
  }

  fetchCategoriesFromAPI(): void {
    const data = {
      email: "ramanvanakalla123@gmail.com",
      password: "Raman@123",
    };

    const url = 'https://karchu.onrender.com/v1/net-amount/';
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
        this.setState({ categories: data, loading: false });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  componentDidMount(): void {
    this.fetchCategoriesFromAPI();
  }

  render(): JSX.Element {
    return (
      <div >
        <Container>
          {this.state.loading ? (
            <Dimmer active>
              <Loader>Loading...</Loader>
            </Dimmer>
          ) : (
            <CategoryTable categories={this.state.categories} fetchTransactions={this.fetchCategoriesFromAPI.bind(this)}></CategoryTable>
          )}
        </Container>
      </div>
    );
  }
}

export default CategoryContainer;
