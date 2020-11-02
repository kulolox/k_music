import React, { useRef, useState } from 'react';
import { Slider, Button } from 'antd';
import classNames from 'classnames';
import IconFont from '@components/IconFont';
import { useOnClickOutside } from '@/hooks';
import { changeVolume } from '@/store/playerSlice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/rootReducer';
import styles from './index.module.less';

const Volume = () => {
  const { volume } = useSelector((state: RootState) => state.player);
  const dispatch = useDispatch();

  const ref = useRef(null);
  const [showVolume, setShowVolume] = useState(false);

  // 他处点击关闭声音调节弹窗
  useOnClickOutside(ref, () => setShowVolume(false));

  const onVolumeChange = (val: number) => {
    dispatch(changeVolume({ volume: val }));
  };

  const toggleVolume = () => {
    setShowVolume(!showVolume);
  };

  const onVolumeAfterChange = () => {
    toggleVolume();
  };

  return (
    <div className={styles.volume} ref={ref}>
      <Button onClick={toggleVolume} type="text" icon={<IconFont type="icon-volume" />} />
      <div className={classNames(styles.content, { [styles.hide]: !showVolume })}>
        <Slider
          value={volume}
          min={0}
          max={100}
          onChange={onVolumeChange}
          onAfterChange={onVolumeAfterChange}
        />
      </div>
    </div>
  );
};

export default Volume;
