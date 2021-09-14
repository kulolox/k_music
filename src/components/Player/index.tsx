import React from 'react';
import Volume from '@components/Volume';
import ListButton from '@components/ListButton';
import styles from './index.module.less';
import Audio from '@/components/Audio';
import Controller from '@/components/Controller';
import PlayerInfo from '../PlayerInfo';

const Player = () => {
  return (
    <div className={styles.player}>
      <Audio />
      <div className={styles.audio}>
        <Controller />
        <PlayerInfo />
        <div className={styles.menu}>
          <div className={styles.button}>
            <Volume />
          </div>
          <div className={styles.button}>
            <ListButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
