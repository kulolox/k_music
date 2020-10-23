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
import { useEventListener } from '@/hooks';

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
      dispatch(getSongUrlById({ id: list[index].id, index, autoPlay: true }));
    } else {
      dispatch(setPlaying({ playing: false }));
    }
  }, [list, currentIndex, dispatch]);

  // audio ontimeupdate事件每隔250ms触发一次
  const onTimeUpdate = useCallback(() => {
    dispatch(setPlayedSconds({ playedSeconds: RPlayer.current!.currentTime }));
    // 防止播放对拖动进度的影响，触发拖动进度条时seeking为true，不在更新进度条，拖动操作完成将seeking置为false
    if (!seeking) {
      setProgressValue(RPlayer.current!.currentTime);
    }
  }, [seeking, dispatch]);

  const onDuration = useCallback(() => {
    setDuration(RPlayer.current!.duration);
  }, []);

  // 音量
  const onVolumeChange = useCallback(val => {
    setVolume(val);
  }, []);
  // 音量控制
  useEffect(() => {
    RPlayer.current!.volume = volume / 100;
  }, [volume]);

  // 进度条
  const progressChange = useCallback(val => {
    setSeeking(true);
    setProgressValue(val);
  }, []);
  const progressAfterChange = useCallback(val => {
    setSeeking(false);
    RPlayer.current!.currentTime = val;
  }, []);
  // 当切换歌曲时，重置本地播放进度
  useEffect(() => {
    setProgressValue(0);
    setSeeking(false); // 歌曲自然播完会触发progressChange，而progressAfterChange不一定会触发，所以切换歌曲时人为触发seeking为false,防止onTimeUpdate，本地进度条无法更新
  }, [currentIndex]);

  // 根据播放状态及当前歌曲切换播放暂停
  useEffect(() => {
    if (playing) {
      RPlayer.current!.play();
    } else {
      RPlayer.current!.pause();
    }
  }, [currentIndex, playing]);

  useEventListener('timeupdate', onTimeUpdate, RPlayer)
  useEventListener('ended', onEndedSong, RPlayer)
  useEventListener('durationchange', onDuration, RPlayer)
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
                step={0.1}
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
