import React, { Component } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { ReactiveComponent, If, Rspan } from "oo7-react";
// import { renderRoutes } from 'react-router-config';
import "./App.scss";
import { Bond, TransformBond } from "oo7";
import {
  calls,
  runtime,
  chain,
  system,
  runtimeUp,
  ss58Decode,
  ss58Encode,
  pretty,
  addressBook,
  secretStore,
  metadata,
  nodeService,
  bytesToHex,
  hexToBytes,
  AccountId,
  api
} from "oo7-substrate";

const loading = () => (
  <div className="animated fadeIn pt-3 text-center">Loading...</div>
);

// Containers
const DefaultLayout = React.lazy(() => import("./containers/DefaultLayout"));

// Pages
const Login = React.lazy(() => import("./views/Pages/Login"));
const Register = React.lazy(() => import("./views/Pages/Register"));
const Page404 = React.lazy(() => import("./views/Pages/Page404"));
const Page500 = React.lazy(() => import("./views/Pages/Page500"));

class App extends ReactiveComponent {
  constructor() {
    super([], { ensureRuntime: runtimeUp });

    // For debug only.
    window.runtime = runtime;
    window.secretStore = secretStore;
    window.addressBook = addressBook;
    window.chain = chain;
    window.calls = calls;
    window.system = system;
    window.that = this;
    window.metadata = metadata;
    this.seed = new Bond();
    this.seedAccount = this.seed.map(s =>
      s ? secretStore().accountFromPhrase(s) : undefined
    );
    this.seedAccount.use();
    this.name = new Bond();
  }
  render() {
    console.log(chain.height);
    return (
      <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route
              exact
              path="/login"
              name="Login Page"
              render={props => <Login {...props} />}
            />
            <Route
              exact
              path="/register"
              name="Register Page"
              render={props => <Register {...props} />}
            />
            <Route
              exact
              path="/404"
              name="Page 404"
              render={props => <Page404 {...props} />}
            />
            <Route
              exact
              path="/500"
              name="Page 500"
              render={props => <Page500 {...props} />}
            />
            <Route
              path="/"
              name="Home"
              render={props => <DefaultLayout {...props} />}
            />
          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}

export default App;
