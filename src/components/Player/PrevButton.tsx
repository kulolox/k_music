import React, { useCallback, useMemo } from 'react';
import { Button } from 'antd';
import IconFont from '@components/IconFont';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/rootReducer';
import { getSongUrlById } from '@/store/playerSlice';

interface IProps {
  className: string;
}

const PrevButton = (props: IProps) => {
  const { currentIndex, list } = useSelector((state: RootState) => state.player);
  const dispatch = useDispatch();
  // 类似computed效果
  const hasPrevSong = useMemo(() => currentIndex > 0, [currentIndex]);

  const prevSong = useCallback(() => {
    const index = currentIndex - 1;
    dispatch(getSongUrlById({ id: list[index].id, index }));
  }, [list, currentIndex, dispatch]);

  return (
    <div className={props.className}>
      <Button
        onClick={prevSong}
        disabled={!hasPrevSong}
        shape="circle"
        type="ghost"
        icon={<IconFont type="icon-prev" />}
      />
    </div>
  );
};

export default PrevButton;
