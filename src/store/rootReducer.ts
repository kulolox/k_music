import { combineReducers } from '@reduxjs/toolkit';
import albumReducer from './albumSlice';

const rootReducer = combineReducers({
  album: albumReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
