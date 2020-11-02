import React, { useState, useEffect } from 'react';
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

  const onSelect = (val: string) => {
    props.catSelect(val);
    setShowCatList(false);
  };

  useEffect(() => {
    getCatlist().then(res => {
      const { categories, sub } = res.data;
      const list: ICat[] = [];
      Object.keys(categories).forEach(t => {
        list.push({
          type: parseInt(t),
          typeName: categories[t],
          list: sub.filter((s: { category: number }) => s.category === parseInt(t)),
        });
      });
      setCatList(list);
    });
  }, []);

  return (
    <div className={styles.category}>
      <Popover
        placement="topLeft"
        visible={showCatList}
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
