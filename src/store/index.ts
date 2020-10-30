import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { useDispatch } from 'react-redux';
import rootReducer from './rootReducer';

const middleware = getDefaultMiddleware({
  serializableCheck: false,
  // serializableCheck: {
  //   ignoredActions: ['player/setAudio'], // redux推荐只将可序列化的数据存入store，该配置忽略了该规则，因为我们需要全局共享audio实例
  // },
})

// 开发模式添加logger插件
if (process.env.NODE_ENV !== 'production') {
  middleware.push(logger)
}

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware,
});

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./rootReducer', () => {
    const newRootReducer = require('./rootReducer').defult;
    store.replaceReducer(newRootReducer);
  });
}

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
