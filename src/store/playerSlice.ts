import { getSongUrl } from '@/api';
import { IList } from '@/interfaces';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface IPlayerDefaultState {
  currentIndex: number; // 当前播放歌曲
  currentUrl: string;
  playing: boolean;
  loop: boolean;
  volume: number;
  playedSeconds: number;
  list: IList[];
}

const defaultState: IPlayerDefaultState = {
  currentIndex: -1,
  currentUrl: '',
  playing: false,
  loop: false,
  volume: 60,
  playedSeconds: 0,
  list: [],
};

// 每次播放都重新获取歌曲url
export const getSongUrlById = createAsyncThunk(
  'player/getSongUrl',
  async (data: any, { dispatch }) => {
    // 播放前先关闭播放状态
    dispatch(setPlaying(false))
    const res = await getSongUrl(data.id);
    // 更新状态
    dispatch(setCurrentUrl({ url: res.data.data[0].url }));
    dispatch(setCurrentIndex({ index: data.index }));
    return {
      autoPlay: data.autoPlay,
    };
  },
);

const playerSlice = createSlice({
  name: 'player',
  initialState: defaultState,
  extraReducers: builder => {
    builder.addCase(getSongUrlById.fulfilled, (state, action) => {
      // 根据传递参数决定是否自动播放
      state.playing = action.payload.autoPlay;
    });
  },
  reducers: {
    setSongList: (state, action) => {
      state.list = action.payload.data;
      state.currentIndex = 0;
    },
    changeVolume: (state, action) => {
      state.volume = action.payload.volume
    },
    setPlayedSconds: (state, action) => {
      state.playedSeconds = action.payload.playedSeconds;
    },
    setPlaying: (state, action) => {
      state.playing = action.payload.playing;
    },
    setCurrentUrl: (state, action) => {
      state.currentUrl = action.payload.url;
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
  setCurrentUrl,
  changeVolume,
  togglePlaying,
  setPlaying,
  setPlayedSconds,
} = playerSlice.actions;

export default playerSlice.reducer;
