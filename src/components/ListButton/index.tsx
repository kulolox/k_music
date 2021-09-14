import React, { useState, useCallback, useEffect } from 'react';
import { Button, Badge } from 'antd';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import IconFont from '@components/IconFont';
import ScrollContainer from '@components/ScrollContainer';
import Duration from '@components/Duration';
import { RootState } from '@/store/rootReducer';
import { getSongUrlById } from '@/store/playerSlice';
import { getSongLyric } from '@/api';
import Lyric from '@components/Lyric';
import styles from './index.module.less';

const ListButton = () => {
  const { list, playing, currentIndex } = useSelector((state: RootState) => state.player);
  const dispatch = useDispatch();
  const [showContainer, setShowContainer] = useState(false);
  const [lyric, setLyric] = useState('');

  const toggleContainer = () => {
    setShowContainer(!showContainer);
  };

  const play = useCallback(
    id => {
      const index = list.findIndex(t => t.id === id);
      dispatch(getSongUrlById({ id, index, autoPlay: true }));
    },
    [list, dispatch],
  );

  useEffect(() => {
    // 初始化歌词
    setLyric('');
    const id = list[currentIndex]?.id;
    if (!list[currentIndex]?.id) return;
    getSongLyric(id).then(res => {
      if (res.data.lrc) {
        setLyric(res.data.lrc.lyric);
      }
    });
  }, [currentIndex, list]);

  return (
    <div className={styles.list}>
      <Badge
        className={styles.button}
        count={list.length}
        overflowCount={99}
        size="small"
        offset={[5, 0]}
      >
        <Button onClick={toggleContainer} type="text" icon={<IconFont type="icon-music-list" />} />
      </Badge>
      <div className={classNames(styles.container, { [styles.hide]: !showContainer })}>
        <div
          className={styles.backImg}
          style={{ backgroundImage: `url('${list[currentIndex]?.coverImgUrl}')` }}
        />
        <div className={styles.content}>
          <div className={styles.listBox}>
            <div className={styles.head}>播放列表</div>
            <ScrollContainer>
              {list.map((item, index) => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.index}>{index + 1}</div>
                  <div className={styles.songName}>{item.name}</div>
                  <div className={styles.songCreator}>{item.authors}</div>
                  <div className={styles.second}>
                    <Duration seconds={item.seconds} />
                  </div>
                  <div className={styles.canPlaying}>
                    <Button
                      shape="circle"
                      type="ghost"
                      size="small"
                      onClick={() => play(item.id)}
                      icon={
                        index === currentIndex && playing ? (
                          <IconFont type="icon-pause" />
                        ) : (
                          <IconFont type="icon-play" />
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </ScrollContainer>
          </div>
          <div className={styles.lyricBox}>
            <div className={styles.head}>歌词</div>
            {lyric ? <Lyric lyric={lyric} /> : <div className={styles.noLyric}>暂无歌词</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ListButton);
