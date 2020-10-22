import axios, { AxiosRequestConfig } from 'axios';
import config from './config';

const pending: Array<{
  url: string;
  cancel: Function;
}> = [];

const cancelToken = axios.CancelToken;

const removePending = (config: AxiosRequestConfig) => {
  for (const p in pending) {
    const item: any = p;
    const list: any = pending[p];
    // 当前请求在数组中存在时执行函数体
    if (list.url === config.url + '&request_type=' + config.method) {
      // 执行取消操作
      list.cancel();
      // 从数组中移除记录
      pending.splice(item, 1);
    }
  }
};

const request = axios.create(config);

// 添加请求拦截器
request.interceptors.request.use(
  async config => {
    removePending(config);
    config.cancelToken = await new cancelToken(c => {
      pending.push({
        url: config.url + '&request_type=' + config.method,
        cancel: c,
      });
    });
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// 返回状态判断(添加响应拦截器)
request.interceptors.response.use(
  res => {
    removePending(res.config);
    return res;
  },
  error => {
    return Promise.reject(error);
  },
);

export default request;
