import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Avatar, Slider } from 'antd';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/rootReducer';
import { setPlayedSconds, getSongUrlById, setPlaying } from '@/store/playerSlice';
import Duration from '@components/Duration';
import Volume from '@components/Volume';
import ListButton from '@components/ListButton';
import PrevButton from './PrevButton';
import NextButton from './NextButton';
import TogglePlayButton from './TogglePlayButton';
import styles from './index.module.less';

const DEFAULT_COVER_IMAGE = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';

const Player = () => {
  const { currentIndex, currentUrl, list, playing } = useSelector(
    (state: RootState) => state.player,
  );
  const dispatch = useDispatch();
  const RPlayer = useRef<HTMLAudioElement>(null);
  const [progressValue, setProgressValue] = useState(0);
  // 总时长
  const [duration, setDuration] = useState(0);
  // 拖动进度条时不更新数据
  const [seeking, setSeeking] = useState(false);
  const [volume, setVolume] = useState(60);

  const onEndedSong = useCallback(() => {
    if (currentIndex < list.length - 1) {
      const index = currentIndex + 1;
      dispatch(getSongUrlById({ id: list[index].id, index }));
    } else {
      dispatch(setPlaying({ playing: false }));
    }
  }, [list, currentIndex]);

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

  // 音量控制
  useEffect(() => {
    RPlayer.current!.volume = volume / 100;
  }, [volume]);

  // 根据播放状态及当前歌曲切换播放暂停
  useEffect(() => {
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
      <audio ref={RPlayer} src={currentUrl} preload="auto"></audio>
      <div className={styles.audio}>
        <div className={styles.controller}>
          <PrevButton className={styles.button} />
          <TogglePlayButton className={styles.button} />
          <NextButton className={styles.button} />
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
