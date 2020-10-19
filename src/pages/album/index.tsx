import React, { useCallback, useEffect, useState } from 'react';
import { Tag, List, Button, BackTop } from 'antd';
import { PlusSquareOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { getAlbumDetail, getSongList, getSongUrl } from '@/api';
import { useLocalStorage } from '@/hooks'
import { arraySplit, checkMusic } from '@/utils/tool';
import Duration from '@/components/Duration';
import { getSongUrlById, setSongList } from '@/store/playerSlice';
import { IList, IAlbum } from '@/interfaces'
import styles from './index.module.less';

const Album = (props: any) => {
  const dispatch = useDispatch();
  const [id] = useState(props.match.params.id);
  const [loading, setLoading] = useState(true);

  // 播放列表缓存
  const setcacheList = useLocalStorage<IList[]>('cache-song-list', null)[1]
  // 专辑信息列表
  const [album, setAlbum] = useLocalStorage<IAlbum>(id, {
    info: {
      albumId: '',
      name: '',
      nickname: '',
      coverImgUrl: '',
      tags: [],
      description: '',
    },
    list: [],
  })

  // 获取歌单详情
  const getAlbumInfo = useCallback(
    async id => {
      // 如果缓存有数据，则不走请求逻辑
      if (!album.info.albumId) {
        const { data: { playlist } } = await getAlbumDetail(id);

        const albumData: IAlbum = {
          info: {
            albumId: id,
            name: playlist.name,
            nickname: playlist.creator.nickname,
            coverImgUrl: playlist.coverImgUrl,
            description: playlist.description,
            tags: playlist.tags,
          },
          list: [],
        }
  
        // 切割组合歌曲id
        const formatIds = arraySplit(playlist.trackIds.map((t: { id: string }) => t.id)).map(t => t.join(','));
        
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
        albumData.list.map((t, index) => t.url = urlResults[index].data.data[0].url)
        setAlbum(albumData)
      }
      setLoading(false)
    },
    [album, setAlbum],
  );
  useEffect(() => {
    getAlbumInfo(id);
  }, [id, getAlbumInfo]);

  // 载入当前歌单可播放歌曲
  const initData = useCallback(() => {
    const canPlayList = album.list.filter(t => t.url);
    // 更新可播放歌曲列表缓存
    setcacheList(canPlayList)
    dispatch(setSongList({ data: canPlayList }));
    dispatch(getSongUrlById({ id: canPlayList.filter(t => t.url)[0].id, index: 0, autoPlay: false }));
  }, [album.list, dispatch, setcacheList]);

  // 播放
  const playSong = useCallback(() => {
    initData();
    dispatch(getSongUrlById({ id: album.list.filter(t => t.url)[0].id, index: 0, autoPlay: true }));
  }, [album.list, initData, dispatch]);

  const playSongById = useCallback(
    id => {
      // 载入数据
      initData();
      // 根据id播放
      const index = album.list.findIndex(t => t.id === id);
      dispatch(getSongUrlById({ id, index, autoPlay: true }));
    },
    [album.list, initData, dispatch],
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
