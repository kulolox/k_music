import React from 'react';
import { Tag } from 'antd';
import { ICatList } from '@pages/home';
import styles from './index.module.less';

interface Iprops {
  catList: ICatList[];
  onSelect: Function;
  selectedCat: string;
}

const { CheckableTag } = Tag;

const CatList = (props: Iprops) => {
  return (
    <div className={styles.catList}>
      {props.catList.map(cat => (
        <div key={cat.type} className={styles.catItem}>
          <div className={styles.catType}>{cat.typeName}</div>
          <div className={styles.catContent}>
            {cat.list.map((t: { name: string }) => (
              <CheckableTag
                key={t.name}
                className={styles.tag}
                checked={props.selectedCat === t.name}
                onClick={() => props.onSelect(t.name)}
              >
                {t.name}
              </CheckableTag>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CatList;
