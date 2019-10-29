import React, { Suspense } from 'react';
import santa from './assets/santa.png';
import { SantaProvider } from "./context";
import NameDisplay from "./name-display";
import NameEntry from "./name-entry";
import { Switch, Route, withRouter } from 'react-router-dom';
import SignIn from './sign-in';
import './App.css';

function App() {
    const routes = (
        <Switch>
            <Route path="/add-names" exact component={NameEntry} />
            <Route path='/' exact component={SignIn} />
            <Route
                path="/*"
                exact
                component={NameDisplay}
            />
        </Switch>
    );
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
                { routes }
            </div>
          </SantaProvider>
      </Suspense>
  );
}

export default withRouter(App);
