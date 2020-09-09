import React, { useState, useEffect } from 'react';
import { Carousel } from 'antd';
import { getBanner } from '@/api';
import styles from './index.module.less';

interface Banner {
  scm: string;
  imageUrl: string;
}

export default (): JSX.Element => {
  const [banners, setBanner] = useState([
    {
      scm: '',
      imageUrl: ''
    }
  ]);
  useEffect(() => {
    async function fetchData() {
      const { data } = await getBanner(0);
      console.log('data:', data);
      setBanner(
        data.banners.map((t: Banner) => ({
          scm: t.scm,
          imageUrl: t.imageUrl
        }))
      );
    }
    fetchData();
  }, [setBanner]);
  return (
    <div className={styles.home}>
      <div>
        <Carousel autoplay>
          {(banners as Array<Banner>).map(banner => (
            <div key={banner.scm} className={styles.item}>
              <img src={banner.imageUrl} alt='' />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};
