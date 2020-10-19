// 专辑相关
export interface IInfo {
  albumId: string;
  name: string;
  nickname: string;
  coverImgUrl: string;
  description: string;
  tags: string[];
}

export interface IList {
  id: number; // 歌曲id
  name: string; // 歌曲名
  seconds: number; // 歌曲时长
  authors: string; // 歌曲作者
  coverImgUrl: string; // 歌曲封面
  canPlaying?: boolean; // 歌曲是否可以播放
  url: string | null;
}

export interface IAlbum {
  info: IInfo;
  list: IList[];
}