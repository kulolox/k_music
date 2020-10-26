import React, { useCallback, useState, useEffect } from 'react';
import { Avatar, Slider } from 'antd';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/rootReducer';
import { setPlayedSconds, getSongUrlById, setPlaying } from '@/store/playerSlice';
import Duration from '@components/Duration';
import Volume from '@components/Volume';
import ListButton from '@components/ListButton';
import styles from './index.module.less';
import Audio from '@/components/Audio';
import Controller from '@/components/Controller';

const DEFAULT_COVER_IMAGE = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';

const Player = () => {
  const { currentIndex, currentUrl, list, playing, volume } = useSelector(
    (state: RootState) => state.player,
  );
  const dispatch = useDispatch();

  const [progressValue, setProgressValue] = useState(0); // 音频播放进度UI展示
  const [currentTime, setCurrentTime] = useState(0); // 音频真实播放进度
  // 总时长
  const [duration, setDuration] = useState(0);
  // 拖动进度条时不更新数据
  const [seeking, setSeeking] = useState(false);

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
      dispatch(setPlayedSconds({ playedSeconds: time }));
      if (!seeking) {
        setProgressValue(time);
      }
    },
    [dispatch, seeking],
  );

  const onDuration = useCallback(duration => {
    setDuration(duration);
  }, []);

  // 进度条
  const progressChange = useCallback(val => {
    setSeeking(true);
    setProgressValue(val);
  }, []);
  const progressAfterChange = useCallback(
    val => {
      setSeeking(false);
      setCurrentTime(progressValue);
    },
    [progressValue],
  );

  // 当切换歌曲时，重置本地播放进度
  useEffect(() => {
    setProgressValue(0);
    setCurrentTime(0);
    setSeeking(false); // 歌曲自然播完会触发progressChange，而progressAfterChange不一定会触发，所以切换歌曲时人为触发seeking为false,防止onTimeUpdate，本地进度条无法更新
  }, [currentIndex]);

  return (
    <div className={styles.player}>
      <Audio
        src={currentUrl}
        playing={playing}
        volume={volume}
        currentTime={currentTime}
        onDuration={onDuration}
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
      />
      <div className={styles.audio}>
        <Controller />
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
            <Volume />
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
