import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Tag, List, Button, BackTop } from 'antd';
import { PlusSquareOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { getAlbumDetail, getSongList, getSongUrl } from '@/api';
import { useLocalStorage, useRouter } from '@/hooks';
import { arraySplit, checkMusic } from '@/utils/tool';
import Duration from '@/components/Duration';
import { getSongUrlById, setSongList } from '@/store/playerSlice';
import { ISong, IAlbumDetail } from '@/interfaces';
import styles from './index.module.less';
import LazyImage from '@/components/LazyImage';
import Loadinger from '@/components/Loadinger';

const formateTime = (time: number) => {
  if (time) {
    return moment().format('YYYY-MM-DD');
  } else {
    return 'NULL';
  }
};

// 初始化数据
const initState: IAlbumDetail = {
  info: {
    albumId: '',
    name: '',
    nickname: '',
    coverImgUrl: '',
    createTime: 0,
    avatarUrl: '',
    tags: [],
    description: '',
  },
  list: [],
};

const Album = () => {
  const dispatch = useDispatch();
  // 获取路由相关数据与方法
  const router: any = useRouter();
  const [loading, setLoading] = useState(false);

  // 播放列表缓存
  const setcacheList = useLocalStorage<ISong[]>('cache-song-list', null)[1];
  // 专辑信息列表
  const [album, setAlbum] = useLocalStorage(router.query.id, initState);

  const canPlayList = useMemo(() => album.list.filter(t => t.url), [album.list]);

  useEffect(() => {
    // 如果缓存有数据，则不走请求逻辑
    if (album && album.list.length > 0) return;
    async function getAlbum() {
      setLoading(true);
      const {
        data: { playlist },
      } = await getAlbumDetail(router.query.id);

      const albumData: IAlbumDetail = {
        info: {
          albumId: router.query.id,
          name: playlist.name,
          nickname: playlist.creator.nickname,
          avatarUrl: playlist.creator.avatarUrl,
          createTime: playlist.createTime,
          coverImgUrl: playlist.coverImgUrl,
          description: playlist.description,
          tags: playlist.tags,
        },
        list: [],
      };

      // 切割组合歌曲id
      const formatIds = arraySplit(playlist.trackIds.map((t: { id: string }) => t.id)).map(t =>
        t.join(','),
      );

      try {
        const requests = formatIds.map(ids => getSongList(ids));
        const result = await Promise.all(requests);

        let songs: any[] = [];
        let privileges: any[] = [];
        result.forEach(t => {
          songs = songs.concat(t.data.songs);
          privileges = privileges.concat(t.data.privileges);
        });

        albumData.list = songs.map((t, i) => ({
          id: t.id,
          name: t.name,
          seconds: t.dt / 1000,
          authors: t.ar.map((j: { name: string }) => j.name).join('，'),
          coverImgUrl: t.al.picUrl,
          canPlaying: checkMusic(privileges[i]), // 先通过checkMusic筛一遍
          url: null,
        }));

        // 获取歌曲url
        const urlRequests = albumData.list.map(t => getSongUrl(t.id));
        const urlResults = await Promise.all(urlRequests);
        albumData.list.map((t, index) => (t.url = urlResults[index].data.data[0].url));
        setAlbum(albumData);
      } finally {
        setLoading(false);
      }
    }
    getAlbum();
  }, [album, router.query.id, setAlbum]);

  // 载入当前歌单可播放歌曲
  const initData = useCallback(() => {
    // 更新可播放歌曲列表缓存
    setcacheList(canPlayList);
    dispatch(setSongList({ data: canPlayList }));
    dispatch(getSongUrlById({ id: canPlayList[0].id, index: 0, autoPlay: false }));
  }, [canPlayList, dispatch, setcacheList]);

  // 播放
  const playSong = useCallback(() => {
    setcacheList(canPlayList);
    dispatch(setSongList({ data: canPlayList }));
    dispatch(getSongUrlById({ id: canPlayList[0].id, index: 0, autoPlay: true }));
  }, [setcacheList, canPlayList, dispatch]);

  const playSongById = useCallback(
    id => {
      // 载入数据
      setcacheList(canPlayList);
      dispatch(setSongList({ data: canPlayList }));
      // 根据id播放
      const index = canPlayList.findIndex(t => t.id === id);
      dispatch(getSongUrlById({ id, index, autoPlay: true }));
    },
    [setcacheList, canPlayList, dispatch],
  );

  return (
    <div className={styles.album}>
      <div className={styles.head}>
        <div className={styles.logo}>
          <img className={styles.img} src={album.info.coverImgUrl} alt="" />
        </div>
        <div className={styles.main}>
          <div className={styles.name}>
            <Tag color="magenta">歌单</Tag>
            {album.info.name}
          </div>
          <div className={styles.creater}>
            <LazyImage width="36px" height="36px" src={album.info.avatarUrl} border />
            <div className={styles.nickname}>{album.info.nickname}</div>
            <div className={styles.createTime}>创建时间：{formateTime(album.info.createTime)}</div>
          </div>
          <div className={styles.buttonGroup}>
            <Button size="small" icon={<PlayCircleOutlined />} onClick={playSong}>
              播放
            </Button>
            <Button size="small" onClick={initData}>
              <PlusSquareOutlined />
            </Button>
          </div>
          <div className={styles.tags}>
            标签：
            {album.info.tags.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          <div className={styles.descript}>介绍：{album.info.description}</div>
        </div>
      </div>
      <div className={styles.listBox}>
        <div className={styles.title}>歌曲列表</div>
        <div className={styles.list}>
          {loading ? (
            <Loadinger text="Loading..." />
          ) : (
            <List
              bordered
              size="small"
              dataSource={album.list}
              renderItem={(item, index) => (
                <List.Item key={item.id}>
                  <div className={styles.item}>
                    <div className={styles.index}>{index + 1}</div>
                    <div className={styles.song}>
                      <div className={styles.songTitle}>
                        <LazyImage border src={item.coverImgUrl} width="36px" height="36px" />
                        <div className={styles.songName}>{item.name}</div>
                      </div>
                      <div className={styles.songCreator}>{item.authors}</div>
                    </div>
                    <div className={styles.second}>
                      <Duration seconds={item.seconds} />
                    </div>
                    <div className={styles.canPlaying}>
                      {item.url ? (
                        <Button onClick={() => playSongById(item.id)} type="text" size="small">
                          播放
                        </Button>
                      ) : (
                        <Button type="text" size="small" disabled>
                          无版权
                        </Button>
                      )}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          )}
        </div>
      </div>
      <BackTop className={styles.backTop} visibilityHeight={600} />
    </div>
  );
};

export default Album;
