import React from 'react';
import santa from './assets/santa.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={santa} className="App-logo" alt="logo" />
        <p>
          The Secret Santa Machine
        </p>
      </header>
    </div>
  );
}

export default App;
