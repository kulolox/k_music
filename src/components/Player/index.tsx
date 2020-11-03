import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/rootReducer';
import { getSongUrlById, setPlaying, setCurrentTime } from '@/store/playerSlice';
import Volume from '@components/Volume';
import ListButton from '@components/ListButton';
import styles from './index.module.less';
import Audio from '@/components/Audio';
import Controller from '@/components/Controller';
import PlayerInfo from '../PlayerInfo';

const Player = () => {
  const { currentIndex, currentUrl, list, playing, volume, currentTime } = useSelector(
    (state: RootState) => state.player,
  );
  const dispatch = useDispatch();

  const onEnded = useCallback(() => {
    if (currentIndex < list.length - 1) {
      const index = currentIndex + 1;
      dispatch(getSongUrlById({ id: list[index].id, index, autoPlay: true }));
    } else {
      dispatch(setPlaying({ playing: false }));
    }
  }, [list, currentIndex, dispatch]);

  // audio ontimeupdate事件每隔250ms触发一次
  const onTimeUpdate = useCallback(
    time => {
      dispatch(setCurrentTime({ currentTime: time }));
    },
    [dispatch],
  );

  console.log('player render');

  return (
    <div className={styles.player}>
      <Audio
        src={currentUrl}
        playing={playing}
        volume={volume}
        currentTime={currentTime}
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
      />
      <div className={styles.audio}>
        <Controller />
        <PlayerInfo />
        <div className={styles.menu}>
          <div className={styles.button}>
            <Volume />
          </div>
          <div className={styles.button}>
            <ListButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
