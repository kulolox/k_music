import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Popover, Button, Carousel, Pagination } from 'antd';
import { getAlbumList, getCatlist, getBanner } from '@/api';
import CatList from '@/components/CatList';
import IconFont from '@/components/IconFont';
import styles from './index.module.less';
import '@/css/animation.less';
import LazyImage from '@/components/LazyImage';

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
  const [pageNo, setPageNo] = useState(1);
  const [showCatList, setShowCatList] = useState(false);
  // 总专辑数
  const [totalAlbum, setTotalAlbum] = useState(0);
  // 当前风格
  const [cat, setCat] = useState('全部');
  const [catList, setCatList] = useState<ICatList[]>([]);
  // 歌单数据
  const [albumList, setAlbumList] = useState<IAblumList[]>([]);

  // 获取风格列表
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

  // 获取专辑列表
  const getAlbumListFunc = useCallback(async (params = { cat: cat, limit: LIMIT, offset: 0 }) => {
    const { data } = await getAlbumList(params);
    setAlbumList(
      data.playlists.map((album: IAblumList) => ({
        id: album.id,
        coverImgUrl: album.coverImgUrl,
        playCount: album.playCount,
        name: album.name,
        creator: album.creator,
      })),
    );
    setTotalAlbum(data.total);
  }, []);

  // 分页变动
  const onPageNoChange = useCallback(pageIndex => {
    const params = {
      cat,
      limit: LIMIT,
      offset: pageIndex * LIMIT,
    };
    setPageNo(pageIndex);
    getAlbumListFunc(params);
  }, []);

  // 风格切换
  const catSelect = useCallback(cat => {
    const params = {
      cat,
      limit: LIMIT,
      offset: 0,
    };
    setShowCatList(false);
    setCat(cat);
    setPageNo(1);
    getAlbumListFunc(params);
  }, []);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      // 获取顶部轮播图
      getBanner(0).then(({ data }) => {
        setBanner(
          data.banners.map((t: IBanner) => ({
            scm: t.scm,
            imageUrl: t.imageUrl,
          })),
        );
      });
      // 获取歌单分类
      getCatlistFunc();

      // 初始化歌单数据
      getAlbumListFunc();
    }
    fetchData();
  }, [setBanner]);
  return (
    <div className={styles.home}>
      <div className={styles.banner}>
        <Carousel autoplay>
          {(banners as IBanner[]).map(banner => (
            <div key={banner.scm} className={styles.item}>
              <img src={banner.imageUrl} alt="" />
            </div>
          ))}
        </Carousel>
      </div>
      <div className={styles.albumBox}>
        <div className={styles.head}>
          <Popover
            placement="topLeft"
            visible={showCatList}
            title={
              <Button size="small" onClick={() => catSelect('全部')}>
                全部风格
              </Button>
            }
            content={<CatList catList={catList} selectedCat={cat} onSelect={catSelect} />}
            trigger="click"
          >
            <Button onClick={() => setShowCatList(!showCatList)}>
              选择风格
              <IconFont type="icon-up" />
            </Button>
          </Popover>
          <div className={styles.cat}>当前风格：{cat}</div>
        </div>
        <div className={styles.list}>
          {albumList.map(album => (
            <Link key={album.id} className={styles.album} to={`/album/${album.id}`}>
              <div className="hoverBox">
                <div className={styles.cover}>
                  <LazyImage src={album.coverImgUrl} width="100%" height="auto" />
                  {/* <img src={album.coverImgUrl} /> */}
                  <div className={styles.playCount}>
                    <IconFont type="icon-play-count" style={{ fontSize: 16, marginRight: 2 }} />
                    <span>{album.playCount}</span>
                  </div>
                  <div className={styles.creatorName}>{album.creator.nickname}</div>
                </div>
                <div className={styles.name}>{album.name}</div>
              </div>
            </Link>
          ))}
        </div>
        <div className={styles.pagination}>
          <Pagination
            defaultCurrent={1}
            current={pageNo}
            total={totalAlbum}
            onChange={onPageNoChange}
            defaultPageSize={LIMIT}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
};
