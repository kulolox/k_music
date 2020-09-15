import React, { useCallback, useState } from 'react';
import { Slider, Button } from 'antd';
import IconFont from '@components/IconFont';
import styles from './index.module.less';

interface IProps {
  volume: number;
  onChange: Function;
}

const Volume = (props: IProps) => {
  const [value, setVal] = useState(props.volume);
  const [showVolume, setShowVolume] = useState(false);
  const onVolumeChange = useCallback(val => {
    setVal(val);
    props.onChange(val);
  }, []);

  const onVolumeAfterChange = useCallback(val => {
    toggleVolume(false);
  }, []);

  const toggleVolume = useCallback(val => {
    setShowVolume(val);
  }, []);

  return (
    <div className={styles.volume}>
      <Button onClick={() => toggleVolume(!showVolume)} type="text" icon={<IconFont type="icon-volume" />} />
      {showVolume && (
        <div className={styles.content}>
          <Slider value={value} min={0} max={100} onChange={onVolumeChange} onAfterChange={onVolumeAfterChange} />
        </div>
      )}
    </div>
  );
};

export default Volume;