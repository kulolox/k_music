import React, { useCallback, useEffect, useState } from 'react';
import { Tag, List, Button, BackTop } from 'antd';
import { PlusSquareOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { IInfo, IList, setInfo, setList } from '@/store/albumSlice';
import { getAlbumDetail, getSongList, getSongUrl } from '@/api';
import { arraySplit, checkMusic } from '@/utils/tool';
import Duration from '@/components/Duration';
import { RootState } from '@/store/rootReducer';
import { getSongUrlById, setPlaying } from '@/store/playerSlice';
import styles from './index.module.less';
import { setSongList } from '@/store/playerSlice';

const Album = (props: any) => {
  const dispatch = useDispatch();
  const [id] = useState(props.match.params.id);
  const [songListData, setSongListData] = useState<IList[]>([]);
  const [loading, setLoading] = useState(true);
  const album = useSelector((state: RootState) => state.album);
  // 获取歌单详情
  const getAlbumInfo = useCallback(async id => {
    const { data } = await getAlbumDetail(id);
    const { playlist } = data;
    const info: IInfo = {
      albumId: playlist.id,
      name: playlist.name,
      nickname: playlist.creator.nickname,
      coverImgUrl: playlist.coverImgUrl,
      description: playlist.description,
      tags: playlist.tags,
    };
    dispatch(
      setInfo({
        data: info,
      }),
    );
    getAlbumList(playlist.trackIds);
  }, []);

  // 获取歌曲列表
  const getAlbumList = useCallback(async trackIds => {
    // 切割组合歌曲id
    const formatIds = arraySplit(trackIds.map((t: { id: string }) => t.id)).map(t => t.join(','));
    const requests = formatIds.map(ids => getSongList(ids));

    const result = await Promise.all(requests);

    let songs: any[] = [];
    let privileges: any[] = [];

    result.forEach(t => {
      songs = songs.concat(t.data.songs);
      privileges = privileges.concat(t.data.privileges);
    });

    const list: IList[] = songs.map((t, i) => ({
      id: t.id,
      name: t.name,
      seconds: t.dt / 1000,
      authors: t.ar.map((j: { name: string }) => j.name).join('，'),
      coverImgUrl: t.al.picUrl,
      canPlaying: checkMusic(privileges[i]), // 先通过checkMusic筛一遍
      url: null,
    }));
    // 后台获取歌曲url
    getSongsUrl(list);
  }, []);

  // 获取所有歌曲播放链接
  const getSongsUrl = useCallback(async (list: IList[]) => {
    // 添加歌曲缓存机制,以专辑id为key
    let data: IList[] = [];
    const cacheAlbumSongList = localStorage.getItem(id) || null;
    if (cacheAlbumSongList) {
      data = JSON.parse(cacheAlbumSongList);
    } else {
      const request = list.map(t => getSongUrl(t.id));
      const result = await Promise.all(request);
      data = list.map((t, index) => ({
        ...t,
        url: result[index].data.data[0].url, // 由于服务器在国外，一些可以播放的歌曲也取不到url
      }));
      localStorage.setItem(id, JSON.stringify(data));
    }
    setSongListData(data);
    dispatch(
      setList({
        data,
      }),
    );
    const cacheSongList = localStorage.getItem('cache-song-list') || null;
    if (cacheSongList) {
      dispatch(setSongList({ data: JSON.parse(cacheSongList) }));
    } else {
      const canPlayList = data.filter(t => t.url);
      localStorage.setItem('cache-song-list', JSON.stringify(canPlayList));
      dispatch(setSongList({ data: canPlayList }));
    }
    // 歌曲列表加载状态
    setLoading(false);
  }, []);

  // 载入当前歌单可播放歌曲
  const initData = useCallback(() => {
    const canPlayList = songListData.filter(t => t.canPlaying);
    // 更新可播放歌曲列表
    localStorage.setItem('cache-song-list', JSON.stringify(canPlayList));
    dispatch(
      setSongList({
        data: canPlayList,
      }),
    );
    dispatch(setPlaying({ playing: false }));
  }, [songListData]);

  // 播放
  const playSong = useCallback(() => {
    initData();
    dispatch(setPlaying({ playing: true }));
  }, [songListData]);

  const playSongById = useCallback(
    id => {
      initData();
      const index = songListData.findIndex(t => t.id === id);
      dispatch(getSongUrlById({ id, index }));
    },
    [songListData],
  );

  useEffect(() => {
    getAlbumInfo(id);
  }, [id]);

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
          <div className={styles.nickname}>
            创建者：
            {album.info.nickname}
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
          <div className={styles.descript}>
            介绍：
            {album.info.description}
          </div>
        </div>
      </div>
      <div className={styles.listBox}>
        <div className={styles.title}>歌曲列表</div>
        <List
          size="small"
          loading={loading}
          dataSource={album.list}
          renderItem={(item, index) => (
            <List.Item key={item.id}>
              <div className={styles.item}>
                <div className={styles.index}>{index + 1}</div>
                <div className={styles.main}>
                  <div className={styles.songName}>{item.name}</div>
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
      </div>
      <BackTop visibilityHeight={600} />
    </div>
  );
};

export default Album;
