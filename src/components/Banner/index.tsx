import React, { useState, useEffect } from 'react';
import { Carousel } from 'antd';

import { IBanner } from '@/interfaces';
import { getBanner } from '@/api';

const Banner = () => {
  const [banners, setBanners] = useState<IBanner[]>([]);

  // 获取轮播图
  useEffect(() => {
    const fetchData = async () => {
      const res = await getBanner(0);
      setBanners(
        res.data.banners.map((t: IBanner) => ({
          scm: t.scm,
          imageUrl: t.imageUrl,
        })),
      );
    };
    fetchData();
  }, []);

  return (
    <Carousel autoplay>
      {banners.map(banner => (
        <div key={banner.scm}>
          <img src={banner.imageUrl} alt="" />
        </div>
      ))}
    </Carousel>
  );
};

export default Banner;
