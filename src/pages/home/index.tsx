import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Pagination } from 'antd';
import { useImmerReducer } from 'use-immer';
import { getAlbumList } from '@/api';
import { IAblum } from '@/interfaces';
import IconFont from '@/components/IconFont';
import LazyImage from '@/components/LazyImage';
import Category from '@/components/Category';
import '@/css/animation.less';
import styles from './index.module.less';
// import Banner from '@/components/Banner';

interface IState {
  pageNo: number;
  totalCount: number;
  cat: string;
  albumList: IAblum[];
}
const LIMIT = 25;

const initalState: IState = {
  pageNo: 1,
  totalCount: 0,
  cat: '华语',
  albumList: [],
};
// userReducer 整个多个state
function homeReducer(state: IState, action: any) {
  switch (action.type) {
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
    default:
      return;
  }
}

export default (): JSX.Element => {
  const [state, dispatch] = useImmerReducer(homeReducer, initalState);
  const { pageNo, totalCount, cat, albumList } = state;

  // 分页变动
  const onPageNoChange = (pageIndex: number) => {
    dispatch({
      type: 'PAGE_CHANGE',
      payload: pageIndex,
    });
  };

  // 切换分类
  const catSelect = useCallback(
    (cat: string) => {
      dispatch({
        type: 'CAT_SELECT',
        payload: cat,
      });
    },
    [dispatch],
  );

  // 获取专辑列表
  useEffect(() => {
    async function fetchData() {
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
    }
    fetchData();
  }, [cat, dispatch, pageNo]);
  console.log('home render');
  return (
    <div className={styles.home}>
      {/* <Banner /> */}
      <div className={styles.albumBox}>
        <Category currentCat={cat} catSelect={catSelect} />
        <div className={styles.list}>
          {albumList.map(album => (
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
          ))}
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
