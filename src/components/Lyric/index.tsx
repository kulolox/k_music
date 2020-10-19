import React, { useState, useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { easeCubicInOut } from 'd3-ease';
import ScrollContainer from '@components/ScrollContainer';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/rootReducer';
import styles from './index.module.less';

interface ILyric {
  time: number;
  txt: string;
}

const timeExp = /\[(\d{2}):(\d{2}\.\d{1,3})\]/g;

const BASELINE = 180;

// 解析歌词
const parseLyric = (lyricStr: string) => {
  if (!lyricStr) return [];
  const lines = lyricStr.split('\n');
  let lyricArr: ILyric[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let result: any = timeExp.exec(line);
    if (result) {
      // 去掉时间，留下歌词部分
      const txt = line.replace(timeExp, '').trim();
      if (txt) {
        lyricArr.push({
          time: result[1] * 60 + result[2] * 1,
          txt,
        });
      }
    }
  }
  lyricArr.sort((a, b) => a.time - b.time);
  return lyricArr;
};

/**
 *
 * @param time 当前播放进度
 * @param range 歌词提取出的时间数组
 */
const getTimeIndex = (time: number, range: number[]) => {
  const len = range.length;
  if (time <= range[0]) return 0;
  if (time >= range[len - 1]) return len - 1;
  let index = 0;
  for (const t of range) {
    if (t > time) {
      index = range.indexOf(t) - 1;
      break;
    }
  }
  return index;
};

const scroll = (dom: HTMLDivElement, distance: number) => {
  const duration = 600; // 动画持续时间(ms)
  let state = 0;
  let start: number | null = null;
  const { scrollTop } = dom;
  const maxScrollTop = distance - scrollTop;
  const work = (timestamp: number) => {
    if (!start) {
      start = timestamp;
    }
    state = timestamp - start;
    const t = state / duration;
    let progress = easeCubicInOut(t);
    if (progress > 1) {
      progress = 1;
    }
    const newScrollTop = maxScrollTop * progress;
    dom.scrollTop = newScrollTop + scrollTop;
    if (progress < 1) {
      window.requestAnimationFrame(work);
    }
  };
  window.requestAnimationFrame(work);
};

// containerDom：滚动容器， 当前dom：dom
const srcollToActiveLine = (containerDom: any, dom: any) => {
  if (!containerDom) return;
  // 如果当前标亮的段落超过基准线，则滚动超过的部分
  if (dom.offsetTop > BASELINE) {
    scroll(containerDom, dom.offsetTop - BASELINE);
  } else {
    scroll(containerDom, 0);
  }
};

interface Iprops {
  lyric: string;
}

const Lyric = (props: Iprops) => {
  const { playedSeconds } = useSelector((state: RootState) => state.player);
  // 歌词解析时间轴数据
  const formatLyrics = useMemo(() => parseLyric(props.lyric), [props.lyric]);
  // 时间轴
  const timeRange = useMemo(() => formatLyrics.map(lyr => lyr.time), [formatLyrics]);
  // 歌词渲染dom
  const lyricDom = useRef<any>(document.getElementsByClassName('lyric'));
  // 当前播放歌词
  const [activeIndex, setActiveIndex] = useState(0);
  // 滚动容器
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  // 根据播放进度，确定当前歌词
  useEffect(() => {
    setActiveIndex(getTimeIndex(playedSeconds, timeRange));
  }, [playedSeconds, timeRange]);

  // 根据当前选中歌词dom,确定滚动
  useEffect(() => {
    if (lyricDom.current.length > 0) {
      srcollToActiveLine(container, lyricDom.current[activeIndex]);
    }
  }, [activeIndex, container]);

  return (
    <ScrollContainer getContainerDom={(ref: HTMLDivElement) => setContainer(ref)}>
      <div className={styles.lyrContainer}>
        {formatLyrics.map((line, index) => (
          <div
            className={classNames(styles.line, {
              [styles.active]: activeIndex === index,
            })}
            key={line.time + line.txt}
          >
            {line.txt}
          </div>
        ))}
      </div>
    </ScrollContainer>
  );
};

export default Lyric;
