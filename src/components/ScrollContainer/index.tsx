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
  const container = useRef<HTMLDivElement>(null);
  const [slideBlockStyle, setSlideBlockStyle] = React.useState<object>({});
  const [hasScrollBar, setHasScrollBar] = React.useState(true);

  // 解析滚动条
  const parseDom = useCallback((dom = container.current) => {
    if (!dom) return;
    const { clientHeight, scrollHeight, scrollTop } = dom;
    // 滑块高度
    const slideBlockHeight = clientHeight ** 2 / scrollHeight;
    // 滑块距离顶部距离
    const slideBlockTop = (scrollTop * (clientHeight - slideBlockHeight)) / (scrollHeight - clientHeight);

    if (isNaN(slideBlockTop)) {
      setHasScrollBar(false);
      return;
    }
    setHasScrollBar(true);
    setSlideBlockStyle({
      height: slideBlockHeight,
      top: slideBlockTop,
    });
  }, []);

  const handelScroll = React.useCallback(e => {
    parseDom(e.target);
  }, []);

  useEffect(() => {
    if (!children) return;
    // 滚动容器传出组件
    if (getContainerDom) {
      getContainerDom(container.current);
    }
    const dom = container.current as HTMLElement;
    dom.addEventListener('scroll', handelScroll);
    return () => dom.removeEventListener('scroll', handelScroll);
  }, []);

  return (
    <div className={classNames(styles.container, className)}>
      {hasScrollBar && (
        <div className={styles.scrollBar}>
          <span style={{ ...slideBlockStyle }} />
        </div>
      )}
      <div ref={container} className={styles.scrollContent}>
        {children}
      </div>
    </div>
  );
};

export default ScrollContainer;
