import React, { ReactNode, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames';
import styles from './index.module.less';

interface IProps {
  children: ReactNode;
  className?: string;
  getContainerDom?: Function;
}

const ScrollContainer = (props: IProps) => {
  const { className, children, getContainerDom } = props;
  const [slideBlockStyle, setSlideBlockStyle] = React.useState<object>({});
  const [hasScrollBar, setHasScrollBar] = React.useState(true);
  const container = useRef<HTMLDivElement>(null);

  // 解析滚动条
  const parseDom = useCallback((dom = container.current) => {
    if (!dom) return;
    const { clientHeight, scrollHeight, scrollTop } = dom;
    // 滑块高度
    const slideBlockHeight = clientHeight ** 2 / scrollHeight;
    // 滑块距离顶部距离
    const slideBlockTop =
      (scrollTop * (clientHeight - slideBlockHeight)) / (scrollHeight - clientHeight);

    if (slideBlockTop !== slideBlockTop) {
      setHasScrollBar(false);
    } else {
      setHasScrollBar(true);
      setSlideBlockStyle({
        height: slideBlockHeight, // 滑块高度
        top: slideBlockTop, // 滑块距离顶部距离
      });
    }
  }, []);

  const handelScroll = React.useCallback(
    e => {
      parseDom(e.target);
    },
    [parseDom],
  );

  useEffect(() => {
    const containerDom = container.current!;
    // 滚动容器dom传递到父组件
    if (getContainerDom) {
      getContainerDom(containerDom);
    }
    containerDom.addEventListener('scroll', handelScroll);
    return () => containerDom.removeEventListener('scroll', handelScroll);
  }, [getContainerDom, handelScroll]);

  return (
    <div className={classNames(styles.container, className)}>
      <div ref={container} className={styles.scrollContent}>
        {children}
      </div>
      {hasScrollBar && (
        <div className={styles.scrollBar}>
          <span style={{ ...slideBlockStyle }} />
        </div>
      )}
    </div>
  );
};

export default ScrollContainer;
