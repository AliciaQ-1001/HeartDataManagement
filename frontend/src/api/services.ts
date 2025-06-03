import api from './config';

// 用户相关API
export const userApi = {
  login: (data: { username: string; password: string }) =>
    api.post('/api/user/login', data),

  register: (data: { username: string; password: string }) =>
    api.post('/api/user/register', data),

  getUserInfo: (userId: number) =>
    api.post('/api/user/get', { userId }),

  updateUserInfo: (data: any) =>
    api.post('/api/user/info', data),

  deleteUser: (userId: number) =>
    api.post('/api/user/delete', { userId }),
};

// 心脏数据相关API
export const heartApi = {
  addHeartData: (data: any) =>
    api.post('/api/heart/add', data),

  getHeartData: (userId: number) =>
    api.post('/api/heart/info', { userId }),

  getHeartHistory: (userId: number) =>
    api.post('/api/heart/history', { userId }),
};

// 睡眠数据相关API
export const sleepApi = {
  addSleepData: (data: any) =>
    api.post('/api/sleep/add', data),

  getSleepData: (userId: number) =>
    api.post('/api/sleep/info', { userId }),

  getSleepHistory: (userId: number) =>
    api.post('/api/sleep/history', { userId }),
};

// 呼吸数据相关API
export const respiratoryApi = {
  addRespiratoryData: (data: any) =>
    api.post('/api/respiratory/add', data),

  getRespiratoryData: (userId: number) =>
    api.post('/api/respiratory/info', { userId }),

  getRespiratoryHistory: (userId: number) =>
    api.post('/api/respiratory/history', { userId }),
};

// 仪表盘数据相关API
export const dashboardApi = {
  addDashboardData: (data: any) =>
    api.post('/api/dashboard/add', data),

  getDashboardData: (userId: number) =>
    api.post('/api/dashboard/info', { userId }),

  getDashboardHistory: (userId: number) =>
    api.post('/api/dashboard/history', { userId }),
}; 