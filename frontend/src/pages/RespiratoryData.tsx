import React, { useEffect, useState } from 'react';
import { Card, Table, message } from 'antd';
import ReactECharts from 'echarts-for-react';
import { fetchRespiratoryData } from '../api/utils';
import './RespiratoryData.css';

interface RespiratoryData {
  breatheId: number;
  userId: number;
  breatheBreathRate: number;
  breatheTimestamp: string;
  breatheTime: string;
  breatheType: string;
  breatheDuration: string;
  breatheOxygenSaturation: number; // 氧饱和度
  breatheLungCapacity: number; // 肺活量
  breatheFEV1: number; // 第一秒用力呼气量
  breatheFVC: number; // 用力肺活量
}

const columns = [
  { title: '时间', dataIndex: 'time', key: 'time' },
  { title: '事件类型', dataIndex: 'type', key: 'type' },
  { title: '持续时间', dataIndex: 'duration', key: 'duration' },
];

const mockData = [
  { key: 1, time: '2025-05-28 02:10', type: '呼吸暂停', duration: '15s' },
  { key: 2, time: '2025-05-29 03:22', type: '呼吸暂停', duration: '12s' },
];

// 生成模拟数据
const generateMockData = (): RespiratoryData[] => {
  const baseTime = new Date();
  baseTime.setMinutes(0, 0, 0);
  return Array.from({ length: 24 }, (_, i) => {
    const d = new Date(baseTime.getTime());
    d.setHours(i);
    return {
      breatheId: i + 1,
      userId: 1,
      breatheBreathRate: 12 + Math.round(Math.random() * 8), // 12-20
      breatheTimestamp: d.toISOString(),
      breatheTime: `${i}:00 - ${(i + 1) % 24}:00`,
      breatheType: 'Normal',
      breatheDuration: '01:00',
      breatheOxygenSaturation: 94 + Math.round(Math.random() * 6), // 94-100
      breatheLungCapacity: 4 + Math.random() * 2, // 4.0-6.0 L
      breatheFEV1: 3 + Math.random() * 1.5, // 3.0-4.5 L
      breatheFVC: 3.8 + Math.random() * 2, // 3.8-5.8 L
    };
  });
};

const RespiratoryData: React.FC = () => {
  const [respiratoryData, setRespiratoryData] = useState<RespiratoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = Number(localStorage.getItem('userId'));
        if (!userId) {
          message.error('请先登录');
          setRespiratoryData(generateMockData());
          setLoading(false);
          return;
        }
        const response = await fetchRespiratoryData(userId);
        if (response.code === 20000 && response.data && response.data.length > 1) {
          setRespiratoryData(response.data);
        } else {
          message.warning('使用模拟呼吸数据');
          setRespiratoryData(generateMockData());
        }
      } catch (error) {
        message.warning('获取数据失败，使用模拟呼吸数据');
        setRespiratoryData(generateMockData());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const breathRate = respiratoryData.map(d => d.breatheBreathRate);
  const oxygenSaturation = respiratoryData.map(d => d.breatheOxygenSaturation);
  const lungCapacity = respiratoryData.map(d => d.breatheLungCapacity);
  const fev1 = respiratoryData.map(d => d.breatheFEV1);
  const fvc = respiratoryData.map(d => d.breatheFVC);

  return (
    <div className="respiratory-container">
      <Card title="呼吸率曲线" className="respiratory-card" loading={loading}>
        <div className="echarts-box">
          <ReactECharts option={{
            xAxis: { type: 'category', data: hours },
            yAxis: { type: 'value', min: 8, max: 24 },
            series: [{
              data: breathRate,
              type: 'line',
              smooth: true,
              areaStyle: { color: 'rgba(24,144,255,0.15)' },
              lineStyle: { color: '#1890ff', width: 3 },
              symbol: 'circle',
              symbolSize: 6,
              itemStyle: { color: '#1890ff' }
            }],
            tooltip: { trigger: 'axis' },
          }} style={{ height: 200, width: '100%' }} />
        </div>
      </Card>

      <Card title="血氧饱和度" className="respiratory-card" loading={loading}>
        <div className="echarts-box">
          <ReactECharts option={{
            xAxis: { type: 'category', data: hours },
            yAxis: { type: 'value', min: 90, max: 100 },
            series: [{
              data: oxygenSaturation,
              type: 'line',
              smooth: true,
              areaStyle: { color: 'rgba(82,250,200,0.15)' },
              lineStyle: { color: '#52fac8', width: 3 },
              symbol: 'circle',
              symbolSize: 6,
              itemStyle: { color: '#52fac8' }
            }],
            tooltip: { trigger: 'axis' },
            markLine: {
              silent: true,
              lineStyle: { color: '#ff4d4f', type: 'dashed' },
              data: [{ yAxis: 95, name: '最低安全值' }]
            }
          }} style={{ height: 200, width: '100%' }} />
        </div>
      </Card>

      <Card title="肺功能数据" className="respiratory-card" loading={loading}>
        <div className="echarts-box">
          <ReactECharts option={{
            tooltip: { trigger: 'axis' },
            legend: { data: ['肺活量', 'FEV1', 'FVC'], top: 0 },
            xAxis: { type: 'category', data: hours },
            yAxis: { type: 'value', min: 0, max: 8 },
            series: [
              {
                name: '肺活量',
                data: lungCapacity,
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: { width: 3, color: '#1890ff' },
                itemStyle: { color: '#1890ff' }
              },
              {
                name: 'FEV1',
                data: fev1,
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: { width: 3, color: '#52fac8' },
                itemStyle: { color: '#52fac8' }
              },
              {
                name: 'FVC',
                data: fvc,
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: { width: 3, color: '#faad14' },
                itemStyle: { color: '#faad14' }
              }
            ]
          }} style={{ height: 260, width: '100%' }} />
        </div>
      </Card>

      <Card title="呼吸暂停事件" className="respiratory-card" loading={loading}>
        <Table columns={columns} dataSource={mockData} pagination={false} />
      </Card>
    </div>
  );
};

export default RespiratoryData; 