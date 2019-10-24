import React from 'react';
import santa from './assets/santa.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={santa} className="App-logo" alt="logo" />
        <p>
          The Secret Santa machine
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
