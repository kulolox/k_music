import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './index.module.less';
import IconFont from '../IconFont';
import Player from '../Player';

const PlayerBox = () => {
  const [isLock, setLock] = useState(true);
  const toggltLock = () => {
    setLock(!isLock);
  };
  return (
    <div className={classNames(styles.playerBox, { [styles.locked]: isLock })}>
      <div className={styles.lockBox} onClick={toggltLock}>
        <IconFont type={isLock ? 'icon-lock_fill' : 'icon-unlock_fill'} />
      </div>
      <Player />
    </div>
  );
};

export default PlayerBox;
