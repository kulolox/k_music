import React, { Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PlayerBox from '@components/PlayerBox';
import './App.css';

const Home = React.lazy(() => import('@pages/home'));
const Album = React.lazy(() => import('@pages/album'));

function App(): JSX.Element {
  return (
    <Fragment>
      <Router>
        <React.Suspense fallback="加载中...">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/album/:id?" exact component={Album} />
          </Switch>
        </React.Suspense>
      </Router>
      <PlayerBox />
    </Fragment>
  );
}

export default App;
