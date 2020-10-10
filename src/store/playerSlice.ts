import { getSongUrl } from '@/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface IList {
  id: number; // 歌曲id
  name: string; // 歌曲名
  seconds: number; // 歌曲时长
  authors: string; // 歌曲作者
  coverImgUrl: string; // 歌曲封面
  canPlaying: boolean; // 歌曲是否可以播放
  url: string;
}

interface IPlayerDefaultState {
  currentIndex: number; // 当前播放歌曲
  currentUrl: string;
  playing: boolean;
  loop: boolean;
  playedSeconds: number;
  list: IList[];
}

const defaultState: IPlayerDefaultState = {
  currentIndex: -1,
  currentUrl: '',
  playing: false,
  loop: false,
  playedSeconds: 0,
  list: [],
};

// 每次播放都重新获取歌曲url
export const getSongUrlById = createAsyncThunk('player/getSongUrl', async (data: any) => {
  const res = await getSongUrl(data.id);
  return {
    data: res.data,
    index: data.index,
  };
});

const playerSlice = createSlice({
  name: 'player',
  initialState: defaultState,
  extraReducers: builder => {
    builder.addCase(getSongUrlById.fulfilled, (state, action) => {
      state.currentUrl = action.payload.data.data[0].url;
      state.currentIndex = action.payload.index; // 更新当前序号
      state.playing = true;
    });
  },
  reducers: {
    setSongList: (state, action) => {
      state.list = action.payload.data;
      state.currentIndex = 0;
    },
    setPlayedSconds: (state, action) => {
      state.playedSeconds = action.payload.playedSeconds;
    },
    setPlaying: (state, action) => {
      state.playing = action.payload.playing;
    },
    setCurrentIndex: (state, action) => {
      state.currentIndex = action.payload.index;
    },
    togglePlaying: (state, action) => {
      const { playing } = action.payload;
      state.playing = playing;
    },
  },
});

export const {
  setSongList,
  setCurrentIndex,
  togglePlaying,
  setPlaying,
  setPlayedSconds,
} = playerSlice.actions;

export default playerSlice.reducer;
