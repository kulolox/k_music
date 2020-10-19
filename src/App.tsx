import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PlayerBox from '@components/PlayerBox';
import { useDispatch } from 'react-redux';
import { useLocalStorage } from '@/hooks'
import {
  getSongUrlById,
  //  getSongUrlById, 
  setSongList } from './store/playerSlice';
import './App.css';
import { IList } from '@/interfaces';

const Home = React.lazy(() => import('@pages/home'));
const Album = React.lazy(() => import('@pages/album'));

function App(): JSX.Element {
  const dispatch = useDispatch();
  const [data] = useLocalStorage<IList[]>('cache-song-list', null)
  // 初始化播放器数据
  useEffect(() => {
    if (data) {
      // 载入缓存中的数据
      dispatch(setSongList({ data }));
      dispatch(getSongUrlById({ id: data[0].id, index: 0, autoPlay: false }))
    }
  }, [data, dispatch]);

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
