import React, { useCallback, useRef, useState } from 'react';
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
  useOnClickOutside(ref, () => setShowVolume(false));

  const onVolumeChange = useCallback(
    val => {
      dispatch(changeVolume({ volume: val }));
    },
    [dispatch],
  );

  const toggleVolume = useCallback(val => {
    setShowVolume(val);
  }, []);

  const onVolumeAfterChange = useCallback(
    val => {
      toggleVolume(false);
    },
    [toggleVolume],
  );

  return (
    <div className={styles.volume} ref={ref}>
      <Button
        onClick={() => toggleVolume(!showVolume)}
        type="text"
        icon={<IconFont type="icon-volume" />}
      />
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
