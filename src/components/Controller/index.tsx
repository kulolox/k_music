import React, { useMemo } from 'react';
import { Button } from 'antd';
import IconFont from '@components/IconFont';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/rootReducer';
import { getSongUrlById, togglePlaying } from '@/store/playerSlice';
import styles from './index.module.less';

const Controller = () => {
  const { currentIndex, list, playing } = useSelector((state: RootState) => state.player);
  const dispatch = useDispatch();

  // 上一曲
  const hasPrevSong = useMemo(() => currentIndex > 0, [currentIndex]);
  const prevSong = () => {
    const index = currentIndex - 1;
    dispatch(getSongUrlById({ id: list[index].id, index, autoPlay: true }));
  };

  // 播放暂停
  const hastSong = useMemo(() => list.length > 0, [list]);
  const togglePlay = () => {
    dispatch(togglePlaying({ playing: !playing }));
  };

  // 下一曲
  const hasNextSong = useMemo(() => currentIndex < list.length - 1, [currentIndex, list]);
  const nextSong = () => {
    const index = currentIndex + 1;
    dispatch(getSongUrlById({ id: list[index].id, index, autoPlay: true }));
  };

  return (
    <div className={styles.controller}>
      <div className={styles.button}>
        <Button
          onClick={prevSong}
          disabled={!hasPrevSong}
          shape="circle"
          type="ghost"
          icon={<IconFont type="icon-prev" />}
        />
      </div>
      <div className={styles.button}>
        <Button
          disabled={!hastSong}
          onClick={togglePlay}
          shape="circle"
          type="ghost"
          size="large"
          icon={
            playing ? (
              <IconFont style={{ fontSize: 25 }} type="icon-pause" />
            ) : (
              <IconFont type="icon-play" />
            )
          }
        />
      </div>
      <div className={styles.button}>
        <Button
          onClick={nextSong}
          disabled={!hasNextSong}
          shape="circle"
          type="ghost"
          icon={<IconFont type="icon-next" />}
        />
      </div>
    </div>
  );
};

export default Controller;
