import { createSlice } from '@reduxjs/toolkit';

interface IInfo {
  albumId: string;
  name: string;
  nickname: string;
  coverImgUrl: string;
  description: string;
  trackIds: string[];
  tags: string[];
}

interface IList {
  id: string; // 歌曲id
  name: string; // 歌曲名
  seconds: number; // 歌曲时长
  authors: string; // 歌曲作者
  coverImgUrl: string; // 歌曲封面
  canPlaying: boolean; // 歌曲是否可以播放
}

interface IDefaultState {
  info: IInfo;
  list: IList[];
}

const defaultState: IDefaultState = {
  info: {
    albumId: '',
    name: '',
    nickname: '',
    coverImgUrl: '',
    tags: [],
    description: '',
    trackIds: [],
  },
  list: [],
};

const albumSlice = createSlice({
  name: 'album',
  initialState: defaultState,
  reducers: {
    setInfo: (state, action) => ({ ...state, info: action.payload.data }),
    setList: (state, action) => ({ ...state, list: action.payload.data }),
  },
});

export const { setInfo, setList } = albumSlice.actions;
export default albumSlice.reducer;
