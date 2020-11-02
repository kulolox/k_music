import React, { ReactNode, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './index.module.less';
import { useEventListener } from '@/hooks';

interface IProps {
  children: ReactNode;
  className?: string;
  getContainerDom?: Function;
}

const ScrollContainer = (props: IProps) => {
  const { children, className, getContainerDom } = props;

  const [slideBlockHeight, setSlideBlockHeight] = useState(0);
  const [slideBlockTop, setSlideBlockTop] = useState(0);
  const [hasScrollBar, setHasScrollBar] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  // 计算滚动条位置
  const handelScroll = (e: Event) => {
    const { clientHeight, scrollHeight, scrollTop } = e.target as HTMLElement;
    // 滑块距离顶部距离
    const slideBlockTop =
      (scrollTop * (clientHeight - slideBlockHeight)) / (scrollHeight - clientHeight);
    setSlideBlockTop(slideBlockTop);
  };

  // 计算滚动条高度
  useEffect(() => {
    // 子元素未载入
    if (!props.children) return;
    // 滚动容器未挂载
    if (!container.current) return;
    const { clientHeight, scrollHeight } = container.current;
    // 当滚动高度等于容器高度，不出滚动条
    if (scrollHeight === clientHeight) {
      setHasScrollBar(false);
    } else {
      // 滑块高度
      const slideBlockHeight = clientHeight ** 2 / scrollHeight;
      setHasScrollBar(true);
      setSlideBlockHeight(slideBlockHeight);
    }
  }, [props.children]);

  useEffect(() => {
    // 滚动容器dom传递到父组件
    if (getContainerDom) {
      getContainerDom(container.current);
    }
  }, [getContainerDom]);

  useEventListener('scroll', handelScroll, container);

  return (
    <div className={classNames(styles.container, className)}>
      <div ref={container} className={styles.scrollContent}>
        {children}
      </div>
      {hasScrollBar && (
        <div className={styles.scrollBar}>
          <span style={{ height: slideBlockHeight, top: slideBlockTop }} />
        </div>
      )}
    </div>
  );
};

export default ScrollContainer;
