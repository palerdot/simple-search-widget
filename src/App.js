import React, { Component } from 'react';
import './App.css';
// import './css/font-awesome.min.css';

// import our components
import SearchWidget from './components/SearchWidget'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Simple Search Widget</h1>
        </header>
        <div className="App-intro">
          <SearchWidget />
        </div>
      </div>
    );
  }
}

export default App;
