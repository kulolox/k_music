import React, { useRef, useEffect, useCallback } from 'react';
import { useEventListener } from '@/hooks';

interface Iprops {
  src: string;
  playing: Boolean;
  seekToTime: number;
  volume: number;
  onTimeUpdate?: Function;
  onEnded?: Function;
  onDuration?: Function;
}

const Audio = (props: Iprops) => {
  const RPlayer = useRef<HTMLAudioElement>(null);

  const onTimeUpdate = useCallback(() => {
    if (props.onTimeUpdate) {
      props.onTimeUpdate(RPlayer.current!.currentTime);
    }
  }, [props]);

  const onDuration = useCallback(() => {
    if (props.onDuration) {
      props.onDuration!(RPlayer.current!.duration);
    }
  }, [props]);

  const onEnded = useCallback(() => {
    if (props.onEnded) {
      props.onEnded();
    }
  }, [props]);

  // 根据播放状态及当前歌曲切换播放暂停
  useEffect(() => {
    if (props.playing) {
      RPlayer.current!.play();
    } else {
      RPlayer.current!.pause();
    }
  }, [props.playing]);

  // 音量控制
  useEffect(() => {
    RPlayer.current!.volume = props.volume / 100;
  }, [props.volume]);

  // 进度
  useEffect(() => {
    RPlayer.current!.currentTime = props.seekToTime;
  }, [props.seekToTime]);

  useEventListener('timeupdate', onTimeUpdate, RPlayer);
  useEventListener('ended', onEnded, RPlayer);
  useEventListener('durationchange', onDuration, RPlayer);

  return <audio ref={RPlayer} src={props.src} preload="auto" />;
};

export default Audio;
