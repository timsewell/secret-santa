import React, { Suspense } from 'react';
import santa from './assets/santa.png';
import { SantaProvider } from "./context";
import NameDisplay from "./name-display";
import NameEntry from "./name-entry";
import './App.css';

function App() {
  return (
      <Suspense loading={'loading...'}>
      <SantaProvider>
        <div className="App">
          <header className="App-header">
            <img src={santa} className="App-logo" alt="logo" />
            <p>
              The Secret Santa Machine
            </p>
          </header>
            <NameDisplay/>
            <NameEntry/>
        </div>
      </SantaProvider>
      </Suspense>
  );
}

export default App;
