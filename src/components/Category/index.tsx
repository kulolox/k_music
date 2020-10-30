import React, { useState, useEffect, useCallback } from 'react';
import { Popover, Button } from 'antd';
import { getCatlist } from '@/api';
import IconFont from '@/components/IconFont';
import styles from './index.module.less';
import { ICat } from '@/interfaces';
import '@/css/animation.less';
import List from './List';

interface IProps {
  currentCat: string;
  catSelect: Function;
}

export default (props: IProps): JSX.Element => {
  const [showCatList, setShowCatList] = useState(false);
  // 分类表
  const [catList, setCatList] = useState<ICat[]>([]);
  // 获取风格列表
  const getCatlistFunc = useCallback(async () => {
    const { data } = await getCatlist();
    const { categories, sub } = data;
    const list: ICat[] = [];
    Object.keys(categories).forEach(t => {
      list.push({
        type: parseInt(t),
        typeName: categories[t],
        list: sub.filter((s: { category: number }) => s.category === parseInt(t)),
      });
    });
    setCatList(list);
  }, []);

  const onSelect = useCallback(
    val => {
      props.catSelect(val);
      setShowCatList(false);
    },
    [props],
  );

  useEffect(() => {
    async function fetchData(): Promise<void> {
      // 获取歌单分类
      getCatlistFunc();
    }
    fetchData();
  }, [getCatlistFunc]);
  return (
    <div className={styles.category}>
      <Popover
        placement="topLeft"
        visible={showCatList}
        title={
          <Button size="small" onClick={() => onSelect('全部')}>
            全部风格
          </Button>
        }
        content={<List catList={catList} selectedCat={props.currentCat} onSelect={onSelect} />}
        trigger="click"
      >
        <Button onClick={() => setShowCatList(!showCatList)}>
          选择风格
          <IconFont type="icon-up" />
        </Button>
      </Popover>
      <div className={styles.cat}>当前风格：{props.currentCat}</div>
    </div>
  );
};
