import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useEventListener } from '@/hooks';
import { getSongUrlById, setPlaying, setCurrentTime } from '@/store/playerSlice';
import { RootState } from '@/store/rootReducer';

const Audio = () => {
  const { currentIndex, currentUrl, list, playing, volume, seekToTime } = useSelector(
    (state: RootState) => state.player,
  );
  const dispatch = useDispatch();

  const RPlayer = useRef<HTMLAudioElement>(null);

  const onTimeUpdate = () => {
    dispatch(setCurrentTime({ currentTime: RPlayer.current!.currentTime }));
  };

  const onDuration = () => {
    console.log('onDuration');
  };

  const onEnded = () => {
    if (currentIndex < list.length - 1) {
      const index = currentIndex + 1;
      dispatch(getSongUrlById({ id: list[index].id, index, autoPlay: true }));
    } else {
      dispatch(setPlaying({ playing: false }));
    }
  };

  // 根据播放状态及当前歌曲切换播放暂停
  useEffect(() => {
    if (playing) {
      RPlayer.current!.play();
    } else {
      RPlayer.current!.pause();
    }
  }, [playing]);

  // 音量控制
  useEffect(() => {
    RPlayer.current!.volume = volume / 100;
  }, [volume]);

  // 进度
  useEffect(() => {
    RPlayer.current!.currentTime = seekToTime;
  }, [seekToTime]);

  useEventListener('timeupdate', onTimeUpdate, RPlayer);
  useEventListener('ended', onEnded, RPlayer);
  useEventListener('durationchange', onDuration, RPlayer);

  return <audio ref={RPlayer} src={currentUrl} preload="auto" />;
};

export default Audio;
