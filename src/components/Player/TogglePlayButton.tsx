import React, { useCallback, useMemo } from 'react';
import { Button } from 'antd';
import IconFont from '@components/IconFont';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/rootReducer';
import { togglePlaying } from '@/store/playerSlice';

interface IProps {
  className: string;
}

const TogglePlayButton = (props: IProps) => {
  const { list, playing } = useSelector((state: RootState) => state.player);
  const dispatch = useDispatch();
  // 类似computed效果
  const hastSong = useMemo(() => list.length > 0, [list]);

  const togglePlay = useCallback(
    val => {
      dispatch(togglePlaying({ playing: val }));
    },
    [dispatch],
  );

  return (
    <div className={props.className}>
      <Button
        disabled={!hastSong}
        onClick={() => togglePlay(!playing)}
        shape="circle"
        type="ghost"
        size="large"
        icon={
          playing ? (
            <IconFont style={{ fontSize: 25 }} type="icon-pause" />
          ) : (
            <IconFont type="icon-play" />
          )
        }
      />
    </div>
  );
};

export default TogglePlayButton;
