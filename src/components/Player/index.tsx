import React, { useCallback, useRef, useMemo, useState } from 'react';
import { Button, Avatar, Slider } from 'antd';
import ReactPlayer from 'react-player';
import IconFont from '@components/IconFont';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/rootReducer';
import { prev, next, togglePlay, onEnded, setPlayedSconds } from '@/store/playerSlice';
import Duration from '@components/Duration';
import Volume from '@components/Volume';
import ListButton from '@components/ListButton';
import styles from './index.module.less';

const DEFAULT_COVER_IMAGE = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';

const Player = () => {
  const { currentIndex, list, playing } = useSelector((state: RootState) => state.player);
  const dispatch = useDispatch();
  const RPlayer = useRef<ReactPlayer>(null);
  const [progressValue, setProgressValue] = useState(0);
  // 拖动进度条时不更新数据
  const [seeking, setSeeking] = useState(false);
  const [volume, setVolume] = useState(60);
  // 类似computed效果
  const hasPrevSong = useMemo(() => currentIndex > 0, [currentIndex]);
  const hasNextSong = useMemo(() => currentIndex < list.length - 1, [currentIndex, list]);
  const hastSong = useMemo(() => list.length > 0, [list]);

  // redux
  const togglePlaySong = useCallback(() => {
    dispatch(togglePlay());
  }, []);
  const prevSong = useCallback(() => {
    dispatch(prev());
  }, []);
  const nextSong = useCallback(() => {
    dispatch(next());
  }, []);
  const onEndedSong = useCallback(() => {
    dispatch(onEnded());
  }, []);
  const onProgressSong = useCallback(state => {
    dispatch(setPlayedSconds({ data: { playedSeconds: state.playedSeconds } }));
    if (!seeking) {
      setProgressValue(state.playedSeconds);
    }
  }, []);

  // 本地状态
  const onVolumeChange = useCallback(val => {
    setVolume(val);
  }, []);
  const progressChange = useCallback(val => {
    setSeeking(true);
    setProgressValue(val);
  }, []);
  const progressAfterChange = useCallback(val => {
    setSeeking(false);
    RPlayer.current!.seekTo(val);
  }, []);

  return (
    <div className={styles.player}>
      <div className={styles.reactPlayer}>
        <ReactPlayer
          ref={RPlayer}
          url={list[currentIndex]?.url}
          playing={playing}
          volume={volume / 100}
          onProgress={onProgressSong}
          onEnded={onEndedSong}
        />
      </div>
      <div className={styles.audio}>
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
              onClick={togglePlaySong}
              shape="circle"
              type="ghost"
              size="large"
              icon={playing ? <IconFont style={{ fontSize: 25 }} type="icon-pause" /> : <IconFont type="icon-play" />}
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
        <div className={styles.main}>
          <Avatar className={styles.coverImage} src={list[currentIndex]?.coverImgUrl ?? DEFAULT_COVER_IMAGE} />
          <div className={styles.content}>
            <div className={styles.head}>
              <div>{list[currentIndex]?.name ?? '暂无'}</div>
              <div>
                <Duration seconds={progressValue} />
                /
                <Duration seconds={list[currentIndex]?.seconds ?? 0} />
              </div>
            </div>
            <div className={styles.progress}>
              <Slider
                onAfterChange={progressAfterChange}
                onChange={progressChange}
                defaultValue={0}
                tooltipVisible={false}
                value={progressValue}
                max={Math.floor(list[currentIndex]?.seconds)}
              />
            </div>
          </div>
        </div>
        <div className={styles.menu}>
          <div className={styles.button}>
            <Volume volume={volume} onChange={onVolumeChange} />
          </div>
          {/* <div className={styles.button}>
            <Button type="text" icon={<SyncOutlined color="#fff" />} />
          </div> */}
          <div className={styles.button}>
            <ListButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
