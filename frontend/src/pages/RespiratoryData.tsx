import React, { useMemo } from 'react';
import { Card, Table } from 'antd';
import ReactECharts from 'echarts-for-react';
import './RespiratoryData.css';

const columns = [
  { title: '时间', dataIndex: 'time', key: 'time' },
  { title: '事件类型', dataIndex: 'type', key: 'type' },
  { title: '持续时间', dataIndex: 'duration', key: 'duration' },
];
const data = [
  { key: 1, time: '2025-05-28 02:10', type: '呼吸暂停', duration: '15s' },
  { key: 2, time: '2025-05-29 03:22', type: '呼吸暂停', duration: '12s' },
];

const genBreathData = () => Array.from({ length: 24 }, () => 12 + Math.round(Math.random() * 8));

const RespiratoryData: React.FC = () => {
  const breathData = useMemo(() => genBreathData(), []);
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  return (
    <div className="respiratory-container">
      <Card title="呼吸率曲线" className="respiratory-card">
        <div className="echarts-box">
          <ReactECharts option={{
            xAxis: { type: 'category', data: hours },
            yAxis: { type: 'value', min: 8, max: 24 },
            series: [{ data: breathData, type: 'line', smooth: true, areaStyle: {} }],
            tooltip: { trigger: 'axis' },
          }} style={{ height: 200, width: '100%' }} />
        </div>
      </Card>
      <Card title="呼吸暂停事件" className="respiratory-card">
        <Table columns={columns} dataSource={data} pagination={false} />
      </Card>
    </div>
  );
};

export default RespiratoryData; 