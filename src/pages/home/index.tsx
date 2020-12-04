import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Carousel, Pagination } from 'antd';
import { useImmerReducer } from 'use-immer';
import { getAlbumList, getBanner } from '@/api';
import { IBanner, IAblum } from '@/interfaces';
import IconFont from '@/components/IconFont';
import LazyImage from '@/components/LazyImage';
import Category from '@/components/Category';
import '@/css/animation.less';
import styles from './index.module.less';
import Loadinger from '@/components/Loadinger';

interface IState {
  banners: IBanner[];
  pageNo: number;
  loading: boolean;
  totalCount: number;
  cat: string;
  albumList: IAblum[];
}
const LIMIT = 35;

const initalState: IState = {
  banners: [],
  pageNo: 1,
  loading: false,
  totalCount: 0,
  cat: '华语',
  albumList: [],
};
// userReducer 整个多个state
function homeReducer(state: IState, action: any) {
  switch (action.type) {
    case 'GET_BANNER': {
      state.banners = action.payload;
      return;
    }
    case 'GET_ALBUM_LIST': {
      const { albumList, totalCount } = action.payload;
      state.albumList = albumList;
      state.totalCount = totalCount;
      return;
    }
    case 'CAT_SELECT': {
      state.pageNo = 1;
      state.cat = action.payload;
      return;
    }
    case 'PAGE_CHANGE': {
      state.pageNo = action.payload;
      return;
    }
    case 'SET_PAGE_LOADING': {
      state.loading = action.payload;
      return;
    }
    default:
      return;
  }
}

export default (): JSX.Element => {
  const [state, dispatch] = useImmerReducer(homeReducer, initalState);
  const { banners, pageNo, loading, totalCount, cat, albumList } = state;

  // 分页变动
  const onPageNoChange = (pageIndex: number) => {
    dispatch({
      type: 'PAGE_CHANGE',
      payload: pageIndex,
    });
  };

  // 风格切换
  const catSelect = (cat: string) => {
    dispatch({
      type: 'CAT_SELECT',
      payload: cat,
    });
  };

  // 获取轮播图
  useEffect(() => {
    getBanner(0).then(res => {
      dispatch({
        type: 'GET_BANNER',
        payload: res.data.banners.map((t: IBanner) => ({
          scm: t.scm,
          imageUrl: t.imageUrl,
        })),
      });
    });
  }, [dispatch]);

  // 获取专辑列表
  useEffect(() => {
    async function fetchData() {
      // loading开始
      dispatch({
        type: 'SET_PAGE_LOADING',
        payload: true,
      });
      const { data } = await getAlbumList({
        cat,
        limit: LIMIT,
        offset: (pageNo - 1) * LIMIT,
      });
      // 更新歌单列表
      dispatch({
        type: 'GET_ALBUM_LIST',
        payload: {
          albumList: data.playlists.map((album: IAblum) => ({
            id: album.id,
            coverImgUrl: album.coverImgUrl,
            playCount: album.playCount,
            name: album.name,
            creator: album.creator,
          })),
          totalCount: data.total,
        },
      });
      // loading结束
      dispatch({
        type: 'SET_PAGE_LOADING',
        payload: false,
      });
    }
    fetchData();
  }, [cat, dispatch, pageNo]);

  return (
    <div className={styles.home}>
      <div className={styles.banner}>
        <Carousel autoplay>
          {banners.map(banner => (
            <div key={banner.scm} className={styles.item}>
              <img src={banner.imageUrl} alt="" />
            </div>
          ))}
        </Carousel>
      </div>
      <div className={styles.albumBox}>
        <Category currentCat={cat} catSelect={catSelect} />
        <div className={styles.list}>
          {loading ? (
            <Loadinger text="Loading..." />
          ) : (
            albumList.map(album => (
              <Link key={album.id} className={styles.album} to={`/album/${album.id}`}>
                <div className="hoverBox">
                  <div className={styles.cover}>
                    <LazyImage src={album.coverImgUrl} width="100%" height="auto" />
                    <div className={styles.playCount}>
                      <IconFont type="icon-play-count" style={{ fontSize: 16, marginRight: 2 }} />
                      <span>{album.playCount}</span>
                    </div>
                    <div className={styles.creatorName}>{album.creator.nickname}</div>
                  </div>
                  <div className={styles.name}>{album.name}</div>
                </div>
              </Link>
            ))
          )}
        </div>

        <Pagination
          className={styles.pagination}
          defaultCurrent={1}
          current={pageNo}
          total={totalCount}
          onChange={onPageNoChange}
          defaultPageSize={LIMIT}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};
