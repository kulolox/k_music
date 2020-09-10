import { AxiosResponse, AxiosRequestConfig } from 'axios';

const axiosConfig: AxiosRequestConfig = {
  baseURL: '/',
  // 请求后的数据处理
  transformResponse: [
    function (data: AxiosResponse): AxiosResponse {
      return data;
    },
  ],
  timeout: 30000,
  responseType: 'json',
  // 最大响应数据大小
  maxContentLength: 2000,
  // 自定义错误状态码范围
  validateStatus: function (status: number) {
    return status >= 200 && status < 300;
  },
};

export default axiosConfig;
