import React from 'react';
import styles from './index.module.less';

const HoverBox = (props: any) => {
  return <div className={styles.hoverBox}>{props.children}</div>;
};

export default HoverBox;
