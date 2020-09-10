import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

const Home = React.lazy(() => import('@pages/home'));

function App(): JSX.Element {
  return (
    <Router>
      <React.Suspense fallback="加载中...">
        <Switch>
          <Route path="/" exact component={Home} />
        </Switch>
      </React.Suspense>
    </Router>
  );
}

export default App;
