import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import styles from './index.module.less';
import IconFont from '../IconFont';
import Player from '../Player';

const PlayerBox = () => {
  // TODO 播放器容器暂时展开
  const [isLock, setLock] = useState(false);
  const toggltLock = useCallback(val => {
    setLock(val);
  }, []);
  return (
    <div className={classNames(styles.playerBox, { [styles.locked]: isLock })}>
      <div className={styles.lockBox} onClick={() => toggltLock(!isLock)}>
        <IconFont type={isLock ? 'icon-lock_fill' : 'icon-unlock_fill'} />
      </div>
      <div className={styles.player}>
        <Player />
      </div>
    </div>
  );
};

export default PlayerBox;
