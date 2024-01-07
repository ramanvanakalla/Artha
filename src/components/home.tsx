import { Component } from 'react';

interface HomeState {
  
}

class Home extends Component<{}, HomeState> {
  constructor(props: {}) {
    super(props);
    this.state = {
    
    };
  }

  render(): JSX.Element {
    return (
      <div >
        HOME
      </div>
    );
  }
}

export default Home;
