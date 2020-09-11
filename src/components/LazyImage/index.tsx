import React, { useState, useEffect } from 'react';
import IMAGE_PLACHOLDER from '@/assets/imgs/default_image.svg';

interface IProps {
  src: string;
  width: string;
  height: string;
}

const LazyImage = (props: IProps) => {
  const [isOnload, setOnload] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.src = props.src;
    img.onload = () => {
      setOnload(true);
    };
  }, []);
  return (
    <img
      src={isOnload ? props.src : IMAGE_PLACHOLDER}
      style={{
        width: props.width,
        height: props.height,
      }}
      alt=""
    />
  );
};

export default LazyImage;
