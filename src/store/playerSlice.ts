import { createSlice } from '@reduxjs/toolkit';

export interface IList {
  id: string; // 歌曲id
  name: string; // 歌曲名
  seconds: number; // 歌曲时长
  authors: string; // 歌曲作者
  coverImgUrl: string; // 歌曲封面
  canPlaying: boolean; // 歌曲是否可以播放
  url: string;
}

interface IPlayerDefaultState {
  currentIndex: number; // 当前播放歌曲
  playing: boolean;
  loop: boolean;
  playedSeconds: number;
  list: IList[];
}

const defaultState: IPlayerDefaultState = {
  currentIndex: -1,
  playing: false,
  loop: false,
  playedSeconds: 0,
  list: [],
};

const playerSlice = createSlice({
  name: 'player',
  initialState: defaultState,
  reducers: {
    setSongList: (state, action) => {
      state.list = action.payload.data;
      state.currentIndex = 0;
    },
    setPlayedSconds: (state, action) => {
      state.playedSeconds = action.payload.playedSeconds;
    },
    prev: state => {
      state.currentIndex -= 1;
      state.playing = true;
    },
    next: state => {
      state.currentIndex += 1;
      state.playing = true;
    },
    togglePlaying: (state, action) => {
      const { playing } = action.payload;
      state.playing = playing;
    },
    playById: (state, action) => {
      state.currentIndex = state.list.findIndex(t => t.id === action.payload.data.id);
      state.playing = true;
    },
    onEnded: state => {
      const { currentIndex, list, loop } = state;
      // 单曲循环
      if (loop) {
        // TODO 单曲循环
      }
      // 顺序播放
      if (currentIndex < list.length - 1) {
        state.currentIndex += 1;
        state.playing = true;
      } else {
        state.playing = false;
      }
    },
  },
});

export const {
  setSongList,
  prev,
  next,
  togglePlaying,
  playById,
  onEnded,
  setPlayedSconds,
} = playerSlice.actions;

export default playerSlice.reducer;
