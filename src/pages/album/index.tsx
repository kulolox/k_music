import React, { useCallback, useEffect, useState } from 'react';
import { Tag, List } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setInfo, setList } from '@/store/albumSlice';
import { getAlbumDetail, getSongList } from '@/api';
import { arraySplit, canMusicPlay } from '@/utils/tool';
import styles from './index.module.less';
import { RootState } from '@/store/rootReducer';

const Album = (props: any) => {
  const dispatch = useDispatch();
  const [id] = useState(props.match.params.id);
  const album = useSelector((state: RootState) => state.album);
  // 获取歌单详情
  const getAlbumInfo = useCallback(async () => {
    const { data } = await getAlbumDetail(id);
    const { playlist } = data;
    const info = {
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

    const list = songs.map((t, i) => ({
      id: privileges[i].id,
      name: t.name,
      seconds: t.dt / 1000,
      authors: t.ar.map((j: { name: string }) => j.name).join('，'),
      coverImgUrl: t.al.picUrl,
      canPlay: canMusicPlay(privileges[i]),
    }));

    dispatch(
      setList({
        data: list,
      }),
    );
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      getAlbumInfo();
    };
    fetchData();
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
          <div className={styles.nickname}>{album.info.nickname}</div>
          <div className={styles.tags}>
            标签：{' '}
            {album.info.tags.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          <div className={styles.descript}>{album.info.description}</div>
        </div>
      </div>
      <div className={styles.list}>
        <div>歌曲列表</div>
        <List
          dataSource={album.list}
          renderItem={item => (
            <List.Item key={item.id}>
              <div>{item.name}</div>
              <div>{item.authors}</div>
              <div>{item.seconds}</div>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default Album;
