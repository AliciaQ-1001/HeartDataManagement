import React, { useEffect, useState } from 'react';
import { Card, Table, message, Progress, Row, Col } from 'antd';
import ReactECharts from 'echarts-for-react';
import { fetchSleepData } from '../api/utils';
import './SleepActivity.css';

interface SleepData {
  sleepId: number;
  userId: number;
  sleepValue: number;
  sleepName: string;
  sleepTime: string;
  sleepType: string;
  sleepDuration: string;
  sleepQuality: number; // 睡眠质量评分
  sleepStartTime: string; // 入睡时间
  sleepEndTime: string; // 起床时间
  sleepTotalHours: number; // 总睡眠时长
}

const columns = [
  { title: '时间', dataIndex: 'time', key: 'time' },
  { title: '体动类型', dataIndex: 'type', key: 'type' },
  { title: '持续时间', dataIndex: 'duration', key: 'duration' },
];

const mockData = [
  { key: 1, time: '2025-05-30 01:10', type: '翻身', duration: '10s' },
  { key: 2, time: '2025-05-30 04:22', type: '抬手', duration: '8s' },
];

// 生成模拟数据
const generateMockData = (): SleepData[] => {
  const baseTime = new Date();
  baseTime.setMinutes(0, 0, 0);
  const data: SleepData[] = [
    {
      sleepId: 1,
      userId: 1,
      sleepValue: 45,
      sleepName: "深睡",
      sleepTime: "2025-05-30 00:00:00",
      sleepType: "Deep",
      sleepDuration: "03:30",
      sleepQuality: 85,
      sleepStartTime: "22:30",
      sleepEndTime: "06:30",
      sleepTotalHours: 8
    },
    {
      sleepId: 2,
      userId: 1,
      sleepValue: 35,
      sleepName: "浅睡",
      sleepTime: "2025-05-30 00:00:00",
      sleepType: "Light",
      sleepDuration: "03:00",
      sleepQuality: 85,
      sleepStartTime: "22:30",
      sleepEndTime: "06:30",
      sleepTotalHours: 8
    },
    {
      sleepId: 3,
      userId: 1,
      sleepValue: 15,
      sleepName: "REM",
      sleepTime: "2025-05-30 00:00:00",
      sleepType: "REM",
      sleepDuration: "01:00",
      sleepQuality: 85,
      sleepStartTime: "22:30",
      sleepEndTime: "06:30",
      sleepTotalHours: 8
    },
    {
      sleepId: 4,
      userId: 1,
      sleepValue: 5,
      sleepName: "清醒",
      sleepTime: "2025-05-30 00:00:00",
      sleepType: "Awake",
      sleepDuration: "00:30",
      sleepQuality: 85,
      sleepStartTime: "22:30",
      sleepEndTime: "06:30",
      sleepTotalHours: 8
    }
  ];
  return data;
};

// 创建一个评估睡眠质量的函数
const getSleepQualityStatus = (quality: number) => {
  if (quality >= 90) return { status: '优秀', color: '#52c41a' };
  if (quality >= 75) return { status: '良好', color: '#1890ff' };
  if (quality >= 60) return { status: '一般', color: '#faad14' };
  return { status: '欠佳', color: '#ff4d4f' };
};

const SleepActivity: React.FC = () => {
  const [sleepData, setSleepData] = useState<SleepData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = Number(localStorage.getItem('userId'));
        if (!userId) {
          message.error('请先登录');
          setSleepData(generateMockData());
          setLoading(false);
          return;
        }
        const response = await fetchSleepData(userId);
        if (response.code === 20000 && response.data && response.data.length > 1) {
          setSleepData(response.data);
        } else {
          message.warning('使用模拟睡眠数据');
          setSleepData(generateMockData());
        }
      } catch (error) {
        message.warning('获取数据失败，使用模拟睡眠数据');
        setSleepData(generateMockData());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sleepStageData = sleepData.map(item => ({
    value: item.sleepValue,
    name: item.sleepName
  }));

  const sleepInfo = sleepData.length > 0 ? sleepData[0] : {
    sleepQuality: 85,
    sleepStartTime: "22:30",
    sleepEndTime: "06:30",
    sleepTotalHours: 8
  };

  const qualityStatus = getSleepQualityStatus(sleepInfo.sleepQuality);

  // 睡眠周期图表数据
  const sleepCycleHours = ['22:00', '23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00'];
  const sleepCycleData = [
    { value: 1, itemStyle: { color: '#a0d911' } }, // 清醒
    { value: 2, itemStyle: { color: '#52c41a' } }, // 浅睡
    { value: 3, itemStyle: { color: '#1890ff' } }, // 深睡
    { value: 3, itemStyle: { color: '#1890ff' } }, // 深睡
    { value: 2, itemStyle: { color: '#52c41a' } }, // 浅睡
    { value: 2.5, itemStyle: { color: '#722ed1' } }, // REM
    { value: 3, itemStyle: { color: '#1890ff' } }, // 深睡
    { value: 2, itemStyle: { color: '#52c41a' } }, // 浅睡
    { value: 1, itemStyle: { color: '#a0d911' } }, // 清醒
  ];

  return (
    <div className="sleep-container">
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12} className="same-height-col">
          <Card title="睡眠阶段分布" className="sleep-card same-height-card" loading={loading}>
            <div className="echarts-box">
              <ReactECharts option={{
                tooltip: { trigger: 'item' },
                legend: { bottom: 0, left: 'center', itemGap: 24, textStyle: { fontSize: 14 } },
                series: [
                  {
                    name: '睡眠阶段',
                    type: 'pie',
                    radius: ['45%', '80%'],
                    avoidLabelOverlap: false,
                    itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
                    label: { show: true, position: 'outside', fontSize: 14, distanceToLabelLine: 16 },
                    data: sleepStageData,
                  },
                ],
              }} style={{ height: 300, width: '100%' }} />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12} className="same-height-col">
          <Card title="睡眠质量评估" className="sleep-card same-height-card" loading={loading}>
            <div className="sleep-quality-container">
              <Progress
                type="circle"
                percent={sleepInfo.sleepQuality}
                strokeColor={{
                  '0%': '#1890ff',
                  '50%': '#52c41a',
                  '100%': '#52c41a',
                }}
                format={() => (
                  <div className="quality-value">
                    <div className="value" style={{ color: qualityStatus.color }}>{sleepInfo.sleepQuality}</div>
                    <div className="status" style={{ color: qualityStatus.color }}>{qualityStatus.status}</div>
                  </div>
                )}
                size={160}
              />

              <div className="sleep-time-info">
                <div className="sleep-time-item">
                  <div className="time-label">入睡时间</div>
                  <div className="time-value">{sleepInfo.sleepStartTime}</div>
                </div>
                <div className="sleep-time-item">
                  <div className="time-label">起床时间</div>
                  <div className="time-value">{sleepInfo.sleepEndTime}</div>
                </div>
                <div className="sleep-time-item">
                  <div className="time-label">总睡眠时长</div>
                  <div className="time-value">{sleepInfo.sleepTotalHours} 小时</div>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="睡眠周期" className="sleep-card" loading={loading}>
            <div className="echarts-box">
              <ReactECharts option={{
                tooltip: { trigger: 'axis' },
                xAxis: { type: 'category', data: sleepCycleHours },
                yAxis: {
                  type: 'category',
                  data: ['清醒', '浅睡', 'REM', '深睡'],
                  axisLine: { show: true },
                  axisLabel: { fontSize: 14 }
                },
                visualMap: {
                  show: false,
                  min: 1,
                  max: 3,
                  inRange: {
                    color: ['#a0d911', '#52c41a', '#722ed1', '#1890ff']
                  }
                },
                series: [{
                  name: '睡眠阶段',
                  type: 'heatmap',
                  data: sleepCycleHours.map((hour, index) => {
                    // 根据值确定在Y轴上的位置 (0:清醒, 1:浅睡, 2:REM, 3:深睡)
                    let stage;
                    const value = sleepCycleData[index].value;
                    if (value === 1) stage = 0; // 清醒
                    else if (value === 2) stage = 1; // 浅睡
                    else if (value === 2.5) stage = 2; // REM
                    else stage = 3; // 深睡

                    return [index, stage, value];
                  }),
                  label: { show: false },
                  emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
                }]
              }} style={{ height: 260, width: '100%' }} />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="体动事件" className="sleep-card" loading={loading}>
            <Table columns={columns} dataSource={mockData} pagination={false} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SleepActivity; 