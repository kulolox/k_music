// 首页
// 轮播图
export interface IBanner {
  scm: string;
  imageUrl: string;
}

// 分类
export interface ICat {
  type: number;
  typeName: string;
  list: [];
}

// 专辑
export interface IAblum {
  id: string;
  coverImgUrl: string;
  playCount: number;
  name: string;
  creator: any;
}

// 专辑相关
// 专辑信息
export interface IInfo {
  albumId: string;
  name: string;
  nickname: string;
  coverImgUrl: string;
  description: string;
  createTime: number,
  avatarUrl: string,
  tags: string[];
}

// 歌曲数据
export interface ISong{
  id: number; // 歌曲id
  name: string; // 歌曲名
  seconds: number; // 歌曲时长
  authors: string; // 歌曲作者
  coverImgUrl: string; // 歌曲封面
  canPlaying?: boolean; // 歌曲是否可以播放
  url: string | null;
}

// 专辑详情
export interface IAlbumDetail {
  info: IInfo;
  list: ISong[];
}

// 播放器相关
export interface IPlayerDefaultState {
  currentIndex: number; // 当前播放歌曲
  currentUrl: string;
  playing: boolean;
  loop: boolean;
  volume: number;
  playedSeconds: number;
  list: ISong[];
}