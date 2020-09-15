import React, { useCallback, useEffect, useState } from 'react';
import { Tag, List, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { IInfo, IList, setInfo, setList } from '@/store/albumSlice';
import { getAlbumDetail, getSongList, getSongUrl } from '@/api';
import { arraySplit, canMusicPlay } from '@/utils/tool';
import Duration from '@/components/Duration';
import { RootState } from '@/store/rootReducer';
import { playById } from '@/store/playerSlice';
import styles from './index.module.less';
import { setSongList } from '@/store/playerSlice';

const Album = (props: any) => {
  const dispatch = useDispatch();
  const [id] = useState(props.match.params.id);
  const [loading, setLoading] = useState(true);
  const album = useSelector((state: RootState) => state.album);
  // 获取歌单详情
  const getAlbumInfo = useCallback(async () => {
    const { data } = await getAlbumDetail(id);
    const { playlist } = data;
    const info: IInfo = {
      albumId: playlist.id,
      name: playlist.name,
      nickname: playlist.creator.nickname,
      coverImgUrl: playlist.coverImgUrl,
      description: playlist.description,
      tags: playlist.tags,
      trackIds: playlist.trackIds,
    };
    dispatch(
      setInfo({
        data: info,
      }),
    );
    getAlbumList(info.trackIds);
  }, []);

  // 获取歌曲列表
  const getAlbumList = useCallback(async trackIds => {
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
      id: privileges[i].id,
      name: t.name,
      seconds: t.dt / 1000,
      authors: t.ar.map((j: { name: string }) => j.name).join('，'),
      coverImgUrl: t.al.picUrl,
      canPlaying: canMusicPlay(privileges[i]),
    }));
    // 先存储无url的数据
    dispatch(
      setList({
        data: list,
      }),
    );
    // 歌曲列表加载状态
    setLoading(false);
    // 后台获取歌曲url
    getSongsUrl(list);
  }, []);

  const getSongsUrl = useCallback(async (list: IList[]) => {
    const data = list.filter(t => t.canPlaying);
    const request = data.map(t => getSongUrl(t.id));
    const result = await Promise.all(request);
    const newData = data.map((t, index) => ({
      ...t,
      url: result[index].data.data[0].url,
    }));
    dispatch(
      setSongList({
        data: newData,
      }),
    );
  }, []);

  const playSong = useCallback(id => {
    dispatch(playById({ data: { id } }));
  }, []);

  useEffect(() => {
    getAlbumInfo();
  }, []);
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
                  {item.canPlaying ? (
                    <Button onClick={() => playSong(item.id)} type="text" size="small">
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
    </div>
  );
};

export default Album;
