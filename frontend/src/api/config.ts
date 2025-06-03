import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://10.151.9.255:8080',
  timeout: 5000,
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code === 20000) {
      return res;
    } else {
      return Promise.reject(new Error(res.message || '请求失败'));
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api; 