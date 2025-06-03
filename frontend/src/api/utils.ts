import { mockHeartData, mockSleepData, mockRespiratoryData, mockDashboardData } from './mockData';
import { heartApi, sleepApi, respiratoryApi, dashboardApi } from './services';
import type { AxiosResponse } from 'axios';

// 定义响应类型
interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

// 通用API调用函数
export const fetchWithFallback = async <T>(
  apiCall: () => Promise<AxiosResponse<ApiResponse<T>>>,
  mockData: ApiResponse<T>,
  errorMessage: string = '获取数据失败'
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    console.error(errorMessage, error);
    return mockData;
  }
};

// 特定API调用函数
export const fetchHeartData = async (userId: number) => {
  return fetchWithFallback(
    () => heartApi.getHeartData(userId),
    mockHeartData,
    '获取心脏数据失败'
  );
};

export const fetchSleepData = async (userId: number) => {
  return fetchWithFallback(
    () => sleepApi.getSleepData(userId),
    mockSleepData,
    '获取睡眠数据失败'
  );
};

export const fetchRespiratoryData = async (userId: number) => {
  return fetchWithFallback(
    () => respiratoryApi.getRespiratoryData(userId),
    mockRespiratoryData,
    '获取呼吸数据失败'
  );
};

export const fetchDashboardData = async (userId: number) => {
  return fetchWithFallback(
    () => dashboardApi.getDashboardData(userId),
    mockDashboardData,
    '获取仪表盘数据失败'
  );
}; 