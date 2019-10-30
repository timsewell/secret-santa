import React, { Suspense } from 'react';
import { SantaProvider } from "./context";
import NameDisplay from "./name-display";
import NameEntry from "./name-entry";
import { Switch, Route, withRouter } from 'react-router-dom';
import SignIn from './sign-in';
import Header from './header';
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
              <Header />
                { routes }
            </div>
          </SantaProvider>
      </Suspense>
  );
}

export default withRouter(App);
