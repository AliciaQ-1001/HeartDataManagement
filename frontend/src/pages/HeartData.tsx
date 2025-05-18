import React, { useMemo } from 'react';
import { Card } from 'antd';
import ReactECharts from 'echarts-for-react';
import './HeartData.css';

// 生成模拟数据
const genData = (min: number, max: number) => Array.from({ length: 24 }, () => min + Math.round(Math.random() * (max - min)));

const HeartData: React.FC = () => {
  // 模拟数据，后期可替换为API数据
  const heartRate = useMemo(() => genData(60, 100), []);
  const hrv = useMemo(() => genData(30, 80), []);
  const sv = useMemo(() => genData(50, 90), []);
  const co = useMemo(() => genData(3, 8), []);
  const ptt = useMemo(() => genData(100, 200), []);
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const mainColor = '#52c1fa';
  const areaColor = 'rgba(82,193,250,0.15)';

  return (
    <div className="heartdata-container">
      <Card title="心率趋势" className="heartdata-card">
        <ReactECharts option={{
          xAxis: { type: 'category', data: hours },
          yAxis: { type: 'value', min: 40, max: 120 },
          series: [{ data: heartRate, type: 'line', smooth: true, areaStyle: { color: areaColor }, lineStyle: { color: mainColor, width: 3 }, symbol: 'circle', itemStyle: { color: mainColor } }],
          tooltip: { trigger: 'axis' },
        }} style={{ height: 220 }} />
      </Card>
      <Card title="心率变异性 (HRV)" className="heartdata-card">
        <ReactECharts option={{
          xAxis: { type: 'category', data: hours },
          yAxis: { type: 'value', min: 20, max: 100 },
          series: [{ data: hrv, type: 'line', smooth: true, areaStyle: { color: 'rgba(82,250,200,0.15)' }, lineStyle: { color: '#52fac8', width: 3 }, symbol: 'circle', itemStyle: { color: '#52fac8' } }],
          tooltip: { trigger: 'axis' },
        }} style={{ height: 220 }} />
      </Card>
      <Card title="心搏输出量 (SV)" className="heartdata-card">
        <ReactECharts option={{
          xAxis: { type: 'category', data: hours },
          yAxis: { type: 'value', min: 40, max: 100 },
          series: [{ data: sv, type: 'bar', itemStyle: { color: '#a0d911', borderRadius: [8, 8, 0, 0] } }],
          tooltip: { trigger: 'axis' },
        }} style={{ height: 220 }} />
      </Card>
      <Card title="心输出量 (CO)" className="heartdata-card">
        <ReactECharts option={{
          xAxis: { type: 'category', data: hours },
          yAxis: { type: 'value', min: 2, max: 10 },
          series: [{ data: co, type: 'line', smooth: true, areaStyle: { color: 'rgba(82,193,250,0.10)' }, lineStyle: { color: '#faad14', width: 3 }, symbol: 'circle', itemStyle: { color: '#faad14' } }],
          tooltip: { trigger: 'axis' },
        }} style={{ height: 220 }} />
      </Card>
      <Card title="脉搏波传导时间 (PTT)" className="heartdata-card">
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