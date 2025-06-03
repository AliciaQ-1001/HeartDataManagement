import React, { useEffect, useState } from 'react';
import { Card, message } from 'antd';
import ReactECharts from 'echarts-for-react';
import { fetchHeartData } from '../api/utils';
import './HeartData.css';

interface HeartData {
  heartId: number;
  heartHeartRate: number;
  heartHrv: number;
  heartSv: number;
  heartCo: number;
  heartPtt: number;
  heartTimestamp: string;
  userId: number;
}

const HeartData: React.FC = () => {
  const [heartData, setHeartData] = useState<HeartData[]>([]);
  const [loading, setLoading] = useState(true);

  // 生成24小时模拟数据
  const generateMockData = (): HeartData[] => {
    const baseTime = new Date();
    baseTime.setMinutes(0, 0, 0);
    return Array.from({ length: 24 }, (_, i) => {
      const d = new Date(baseTime.getTime());
      d.setHours(i);
      return {
        heartId: i + 1,
        userId: 1,
        heartHeartRate: 60 + Math.round(Math.random() * 30), // 60-90
        heartHrv: 40 + Math.round(Math.random() * 30), // 40-70
        heartSv: 50 + Math.round(Math.random() * 30), // 50-80
        heartCo: 4 + Math.round(Math.random() * 40) / 10, // 4.0-8.0
        heartPtt: 100 + Math.round(Math.random() * 80), // 100-180
        heartTimestamp: d.toISOString(),
      };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = Number(localStorage.getItem('userId'));
        if (!userId) {
          message.error('请先登录');
          setHeartData(generateMockData());
          setLoading(false);
          return;
        }
        const response = await fetchHeartData(userId);
        if (response.code === 20000 && response.data && response.data.length > 1) {
          setHeartData(response.data);
        } else {
          message.warning('使用模拟心脏数据');
          setHeartData(generateMockData());
        }
      } catch (error) {
        message.warning('获取数据失败，使用模拟心脏数据');
        setHeartData(generateMockData());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 处理数据
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const heartRate = heartData.map(d => d.heartHeartRate);
  const hrv = heartData.map(d => d.heartHrv);
  const sv = heartData.map(d => d.heartSv);
  const co = heartData.map(d => d.heartCo);
  const ptt = heartData.map(d => d.heartPtt);

  const mainColor = '#52c1fa';
  const areaColor = 'rgba(82,193,250,0.15)';

  return (
    <div className="heartdata-container">
      <Card title="心率趋势" className="heartdata-card" loading={loading}>
        <ReactECharts option={{
          xAxis: { type: 'category', data: hours },
          yAxis: { type: 'value', min: 40, max: 120 },
          series: [{ data: heartRate, type: 'line', smooth: true, areaStyle: { color: areaColor }, lineStyle: { color: mainColor, width: 3 }, symbol: 'circle', itemStyle: { color: mainColor } }],
          tooltip: { trigger: 'axis' },
        }} style={{ height: 220 }} />
      </Card>
      <Card title="心率变异性 (HRV)" className="heartdata-card" loading={loading}>
        <ReactECharts option={{
          xAxis: { type: 'category', data: hours },
          yAxis: { type: 'value', min: 20, max: 100 },
          series: [{ data: hrv, type: 'line', smooth: true, areaStyle: { color: 'rgba(82,250,200,0.15)' }, lineStyle: { color: '#52fac8', width: 3 }, symbol: 'circle', itemStyle: { color: '#52fac8' } }],
          tooltip: { trigger: 'axis' },
        }} style={{ height: 220 }} />
      </Card>
      <Card title="心搏输出量 (SV)" className="heartdata-card" loading={loading}>
        <ReactECharts option={{
          xAxis: { type: 'category', data: hours },
          yAxis: { type: 'value', min: 40, max: 100 },
          series: [{ data: sv, type: 'bar', itemStyle: { color: '#a0d911', borderRadius: [8, 8, 0, 0] } }],
          tooltip: { trigger: 'axis' },
        }} style={{ height: 220 }} />
      </Card>
      <Card title="心输出量 (CO)" className="heartdata-card" loading={loading}>
        <ReactECharts option={{
          xAxis: { type: 'category', data: hours },
          yAxis: { type: 'value', min: 2, max: 10 },
          series: [{ data: co, type: 'line', smooth: true, areaStyle: { color: 'rgba(82,193,250,0.10)' }, lineStyle: { color: '#faad14', width: 3 }, symbol: 'circle', itemStyle: { color: '#faad14' } }],
          tooltip: { trigger: 'axis' },
        }} style={{ height: 220 }} />
      </Card>
      <Card title="脉搏波传导时间 (PTT)" className="heartdata-card" loading={loading}>
        <ReactECharts option={{
          xAxis: { type: 'category', data: hours },
          yAxis: { type: 'value', min: 80, max: 220 },
          series: [{ data: ptt, type: 'line', smooth: true, areaStyle: { color: 'rgba(24,144,255,0.10)' }, lineStyle: { color: '#1890ff', width: 3 }, symbol: 'circle', itemStyle: { color: '#1890ff' } }],
          tooltip: { trigger: 'axis' },
        }} style={{ height: 220 }} />
      </Card>
    </div>
  );
};

export default HeartData; 