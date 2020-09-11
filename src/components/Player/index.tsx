import React from 'react';
import { Button, Avatar, Progress } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import ReactPlayer from 'react-player';

import IconFont from '@components/IconFont';
import styles from './index.module.less';

const Player = () => {
  return (
    <div className={styles.player}>
      <div className={styles.reactPlayer}>
        <ReactPlayer />
      </div>
      <div className={styles.audio}>
        <div className={styles.controller}>
          <div className={styles.button}>
            <Button shape="circle" type="ghost" icon={<IconFont type="icon-prev" />} />
          </div>
          <div className={styles.button}>
            <Button shape="circle" type="ghost" size="large" icon={<IconFont type="icon-play" />} />
          </div>
          <div className={styles.button}>
            <Button shape="circle" type="ghost" icon={<IconFont type="icon-next" />} />
          </div>
        </div>
        <div className={styles.main}>
          <Avatar
            className={styles.coverImage}
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />
          <div className={styles.content}>
            <div className={styles.head}>
              <div>name</div>
              <div>time</div>
            </div>
            <div className={styles.progress}>
              <Progress size="small" percent={50} showInfo={false} />
            </div>
          </div>
        </div>
        <div className={styles.menu}>
          <div className={styles.button}>
            <Button type="text" icon={<IconFont type="icon-volume" />} />
          </div>
          <div className={styles.button}>
            <Button type="text" icon={<SyncOutlined color="#fff" />} />
          </div>
          <div className={styles.button}>
            <Button type="text" icon={<IconFont type="icon-music-list" />} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
