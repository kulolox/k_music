import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PlayerBox from '@components/PlayerBox';
import './App.css';
import { useDispatch } from 'react-redux';
import { getSongUrlById, setSongList } from './store/playerSlice';

const Home = React.lazy(() => import('@pages/home'));
const Album = React.lazy(() => import('@pages/album'));

function App(): JSX.Element {
  const dispatch = useDispatch();
  // 初始化播放器数据
  useEffect(() => {
    const cache = localStorage.getItem('cache-song-list') || null;
    if (cache) {
      const data = JSON.parse(cache);
      dispatch(setSongList({ data }));
      dispatch(getSongUrlById({ index: 0, id: data[0].id }));
    }
  }, [dispatch]);
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
