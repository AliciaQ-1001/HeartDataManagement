import React, { useMemo } from 'react';
import { Card, Table } from 'antd';
import ReactECharts from 'echarts-for-react';
import './SleepActivity.css';

const columns = [
  { title: '时间', dataIndex: 'time', key: 'time' },
  { title: '体动类型', dataIndex: 'type', key: 'type' },
  { title: '持续时间', dataIndex: 'duration', key: 'duration' },
];
const data = [
  { key: 1, time: '2025-05-30 01:10', type: '翻身', duration: '10s' },
  { key: 2, time: '2025-05-30 04:22', type: '抬手', duration: '8s' },
];

const genSleepStage = () => [
  { value: 5, name: '清醒' },
  { value: 35, name: '浅睡' },
  { value: 45, name: '深睡' },
  { value: 15, name: 'REM' },
];

const SleepActivity: React.FC = () => {
  const sleepStage = useMemo(() => genSleepStage(), []);
  return (
    <div className="sleep-container">
      <Card title="睡眠阶段" className="sleep-card">
        <div className="echarts-box">
          <ReactECharts option={{
            tooltip: { trigger: 'item' },
            legend: { bottom: 0, left: 'center', itemGap: 24, textStyle: { fontSize: 18 } },
            series: [
              {
                name: '睡眠阶段',
                type: 'pie',
                radius: ['45%', '80%'],
                avoidLabelOverlap: false,
                itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
                label: { show: true, position: 'outside', fontSize: 18, distanceToLabelLine: 16 },
                data: sleepStage,
              },
            ],
          }} style={{ height: 340, width: '100%' }} />
        </div>
      </Card>
      <Card title="体动事件" className="sleep-card">
        <Table columns={columns} dataSource={data} pagination={false} />
      </Card>
    </div>
  );
};

export default SleepActivity; 