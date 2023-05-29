import React from 'react';
import { Route, HashRouter, Switch } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "react-query";
import DataContextProvider from './app/context';
import Detail from './pages/detail';
import Home from './pages/home';
import Playground from './pages/playground';
import FullLoader from './app/layout/FullLoader';
import BundleEditor from './pages/bundleEditor';
import Wallet from './pages/wallet';

const client = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={client}>
      <DataContextProvider>
          <HashRouter>
              <Switch>
                  <Route path="/" exact render={props => <Home {...props} />} />
                  <Route path="/detail/:type?/:tokenInfo?" render={(props) => <Detail {...props} />} />
                  <Route path="/playground" render={(props) => <Playground {...props} />} />
                  <Route path="/bundle-editor" render={(props) => <BundleEditor {...props} />} />
                  <Route path="/wallet" render={(props) => <Wallet {...props} />} />
              </Switch>
          </HashRouter>
          <FullLoader />
      </DataContextProvider>
    </QueryClientProvider>
  );
}

export default App;
