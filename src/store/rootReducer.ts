import { combineReducers } from '@reduxjs/toolkit';
import albumReducer from './albumSlice';
import playerReducer from './playerSlice';

const rootReducer = combineReducers({
  album: albumReducer,
  player: playerReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
