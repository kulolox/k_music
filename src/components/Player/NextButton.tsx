import React, { useCallback, useMemo } from 'react';
import { Button } from 'antd';
import IconFont from '@components/IconFont';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/rootReducer';
import { getSongUrlById } from '@/store/playerSlice';

interface IProps {
  className: string;
}

const NextButton = (props: IProps) => {
  const { currentIndex, list } = useSelector((state: RootState) => state.player);
  const dispatch = useDispatch();

  // 类似computed效果
  const hasNextSong = useMemo(() => currentIndex < list.length - 1, [currentIndex, list]);

  const nextSong = useCallback(() => {
    const index = currentIndex + 1;
    dispatch(getSongUrlById({ id: list[index].id, index, autoPlay: true }));
  }, [list, currentIndex, dispatch]);

  return (
    <div className={props.className}>
      <Button
        onClick={nextSong}
        disabled={!hasNextSong}
        shape="circle"
        type="ghost"
        icon={<IconFont type="icon-next" />}
      />
    </div>
  );
};

export default NextButton;
