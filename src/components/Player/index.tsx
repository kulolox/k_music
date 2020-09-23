import React, { useCallback, useRef, useMemo, useState, useEffect } from 'react';
import { Button, Avatar, Slider } from 'antd';
import classNames from 'classnames';
import IconFont from '@components/IconFont';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/rootReducer';
import { prev, next, onEnded, setPlayedSconds, togglePlaying } from '@/store/playerSlice';
import Duration from '@components/Duration';
import Volume from '@components/Volume';
import ListButton from '@components/ListButton';
import styles from './index.module.less';

const DEFAULT_COVER_IMAGE = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';

const Player = () => {
  const { currentIndex, list, playing } = useSelector((state: RootState) => state.player);
  const dispatch = useDispatch();
  const RPlayer = useRef<HTMLAudioElement>(null);
  const [progressValue, setProgressValue] = useState(0);
  // 总时长
  const [duration, setDuration] = useState(0);
  // 拖动进度条时不更新数据
  const [seeking, setSeeking] = useState(false);
  const [volume, setVolume] = useState(60);
  // 类似computed效果
  const hasPrevSong = useMemo(() => currentIndex > 0, [currentIndex]);
  const hasNextSong = useMemo(() => currentIndex < list.length - 1, [currentIndex, list]);
  const hastSong = useMemo(() => list.length > 0, [list]);

  // redux
  const togglePlay = useCallback(val => {
    dispatch(togglePlaying({ playing: val }));
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

  // audio ontimeupdate事件每隔250ms触发一次
  const onTimeUpdate = useCallback(() => {
    dispatch(setPlayedSconds({ playedSeconds: RPlayer.current!.currentTime }));
    if (!seeking) {
      setProgressValue(RPlayer.current!.currentTime);
    }
  }, []);

  const onDuration = useCallback(() => {
    setDuration(RPlayer.current!.duration);
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
    RPlayer.current!.currentTime = val;
  }, []);

  // 根据播放状态及当前歌曲切换播放暂停
  useEffect(() => {
    console.log('currentIndex:', currentIndex);
    if (playing) {
      RPlayer.current!.play();
    } else {
      RPlayer.current!.pause();
    }
  }, [currentIndex, playing]);

  useEffect(() => {
    RPlayer.current!.addEventListener('timeupdate', onTimeUpdate);
    RPlayer.current!.addEventListener('ended', onEndedSong);
    RPlayer.current!.addEventListener('durationchange', onDuration);
    return () => {
      RPlayer.current!.removeEventListener('timeupdate', onTimeUpdate);
      RPlayer.current!.removeEventListener('ended', onEndedSong);
      RPlayer.current!.removeEventListener('durationchange', onDuration);
    };
  }, [RPlayer.current, currentIndex]);
  return (
    <div className={styles.player}>
      <audio ref={RPlayer} src={list[currentIndex]?.url} preload="auto"></audio>
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
              onClick={() => togglePlay(!playing)}
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
        <div className={styles.main}>
          <Avatar
            className={classNames(styles.coverImage, { [styles.spin]: playing })}
            src={list[currentIndex]?.coverImgUrl ?? DEFAULT_COVER_IMAGE}
          />
          <div className={styles.content}>
            <div className={styles.head}>
              <div>{list[currentIndex]?.name ?? '暂无'}</div>
              <div>
                <Duration seconds={progressValue} />
                /
                <Duration seconds={duration} />
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
