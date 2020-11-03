import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, Slider } from 'antd';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/rootReducer';
import { setCurrentTime } from '@/store/playerSlice';
import Duration from '@components/Duration';
import styles from './index.module.less';

const DEFAULT_COVER_IMAGE = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';

const PlayerInfo = () => {
  const { currentIndex, list, playing, currentTime } = useSelector(
    (state: RootState) => state.player,
  );
  const dispatch = useDispatch();

  const [seeking, setSeeking] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  // 进度条
  const progressChange = useCallback((val: number) => {
    // 进度条操作
    setSeeking(true);
    setProgressValue(val);
  }, []);

  const progressAfterChange = () => {
    // 操作完成，将本地进度同步到播放器
    setSeeking(false);
    dispatch(
      setCurrentTime({
        currentTime: progressValue,
      }),
    );
  };

  // 当切换歌曲时，重置本地播放进度
  useEffect(() => {
    // 重置当前播放进度，进度条进度，操作状态
    dispatch(
      setCurrentTime({
        currentTime: 0,
      }),
    );
    setProgressValue(0);
    setSeeking(false); // onEnd有概率不触发progressAfterChange，手动重置
  }, [currentIndex, dispatch]);

  useEffect(() => {
    // 如果未操作进度条，则同步播放进度
    if (!seeking) {
      setProgressValue(currentTime);
    }
  }, [currentTime, seeking]);

  return (
    <div className={styles.info}>
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
            <Duration seconds={list[currentIndex]?.seconds} />
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
  );
};

export default PlayerInfo;
