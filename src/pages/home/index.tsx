import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Popover, Button, Carousel } from 'antd';
import { getAlbumList, getCatlist } from '@/api';
import CatList from '@/components/CatList';
import HoverBox from '@/components/HoverBox';
import styles from './index.module.less';

interface IBanner {
  scm: string;
  imageUrl: string;
}

export interface ICatList {
  type: number;
  typeName: string;
  list: [];
}

interface IAblumList {
  id: string;
  coverImgUrl: string;
  playCount: number;
  name: string;
  creator: any;
}

const LIMIT = 35;

export default (): JSX.Element => {
  const [banners, setBanner] = useState<IBanner[]>([]);
  // 页码
  // const [pageNo] = useState(1);
  const [cat] = useState('全部');
  const [catList, setCatList] = useState<ICatList[]>([]);
  // 歌单数据
  const [albumList, setAlbumList] = useState<IAblumList[]>([]);

  const getCatlistFunc = useCallback(async () => {
    const { data } = await getCatlist();
    const { categories, sub } = data;
    const rec: ICatList[] = [];
    Object.keys(categories).forEach(t => {
      rec.push({
        type: parseInt(t),
        typeName: categories[t],
        list: sub.filter((s: { category: number }) => s.category === parseInt(t)),
      });
    });
    setCatList(rec);
  }, []);

  const getAlbumListFunc = useCallback(async params => {
    const { data } = await getAlbumList(params);
    console.log('album:', data);
    setAlbumList(
      data.playlists.map((album: IAblumList) => ({
        id: album.id,
        coverImgUrl: album.coverImgUrl,
        playCount: album.playCount,
        name: album.name,
        creator: album.creator,
      })),
    );
  }, []);

  const catSelect = useCallback(cat => {
    const params = {
      cat,
      limit: LIMIT,
      offset: 0,
    };
    getAlbumListFunc(params);
  }, []);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      // 获取顶部轮播图
      // getBanner(0).then(({ data }) => {
      //   setBanner(
      //     data.banners.map((t: Banner) => ({
      //       scm: t.scm,
      //       imageUrl: t.imageUrl,
      //     })),
      //   );
      // });
      // 获取歌单分类
      getCatlistFunc();

      // 初始化歌单数据
      const params = {
        cat: cat,
        limit: LIMIT,
        offset: 0,
      };
      getAlbumListFunc(params);
    }
    fetchData();
  }, [setBanner]);
  return (
    <div className={styles.home}>
      <div className={styles.banner}>
        <Carousel autoplay>
          {(banners as Array<IBanner>).map(banner => (
            <div key={banner.scm} className={styles.item}>
              <img src={banner.imageUrl} alt="" />
            </div>
          ))}
        </Carousel>
      </div>
      <div className={styles.album}>
        <div className={styles.head}>
          <div className={styles.cat}>{cat}</div>
          <Popover
            placement="bottomLeft"
            title={
              <div>
                <Button>全部风格</Button>
              </div>
            }
            content={<CatList catList={catList} onSelect={catSelect} />}
            trigger="click"
          >
            <Button>Bottom</Button>
          </Popover>
        </div>
        <div className={styles.list}>
          {albumList.map(album => (
            <Link key={album.id} className={styles.album} to={`/playlist/${album.id}`}>
              <HoverBox>
                <div>
                  <div className={styles.cover}>
                    <img src={album.coverImgUrl} />
                    <div className={styles.playCount}>
                      <span>{album.playCount}</span>
                    </div>
                    <div className={styles.creatorName}>{album.creator.nickname}</div>
                  </div>
                  <div className={styles.name}>{album.name}</div>
                </div>
              </HoverBox>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
