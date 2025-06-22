import React, { useEffect, useState } from 'react';
import { Card, Calendar, Progress, message, Row, Col, Statistic, Tooltip } from 'antd';
import { FireOutlined, HeartOutlined, CalendarOutlined, HeartFilled } from '@ant-design/icons';
import { fetchDashboardData } from '../api/utils';
import './Dashboard.css';

interface DashboardData {
  cellId: number;
  userId: number;
  cellValue: number;
  cellUnit: string;
  cellMin: number;
  cellMax: number;
  cellHematocrit: number;
  cellNeutrophils: number;
  cellLymphocytes: number;
  cellMonocytes: number;
  cellBasophils: number;
  cellNeutrophilsMin?: number;
  cellNeutrophilsMax?: number;
  cellLymphocytesMin?: number;
  cellLymphocytesMax?: number;
  cellMonocytesMin?: number;
  cellMonocytesMax?: number;
  cellBasophilsMin?: number;
  cellBasophilsMax?: number;
  cellHematocritMin?: number;
  cellHematocritMax?: number;
  heartRateMin?: number;
  heartRateMax?: number;
  bpSystolicMin?: number;
  bpSystolicMax?: number;
  bpDiastolicMin?: number;
  bpDiastolicMax?: number;
  oxygenSaturationMin?: number;
  oxygenSaturationMax?: number;
}

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = Number(localStorage.getItem('userId'));
        if (!userId) {
          message.error('请先登录');
          return;
        }
        const response = await fetchDashboardData(userId);
        if (response.code === 20000) {
          setDashboardData(response.data);
        } else {
          message.error(response.msg || '获取数据失败');
        }
      } catch (error) {
        message.error('获取数据失败，请检查网络连接');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 已经设定了一个默认值（当 dashboardData 是空数组时使用 latestData 的默认值 36.5°C），但是如果 dashboardData[0] 存在，而且其 cellValue 是 9500，哪怕后端数据异常，它也会直接使用这个值，因为 dashboardData[0] 优先级更高。
  const latestRaw = dashboardData[0];
  const latestData = (latestRaw && latestRaw.cellValue >= 30 && latestRaw.cellValue <= 45)
    ? latestRaw
    : {
      cellValue: 36.5,
      cellUnit: '°C',
      cellMin: 35,
      cellMax: 42,
      cellHematocrit: 45,
      cellNeutrophils: 60,
      cellLymphocytes: 30,
      cellMonocytes: 8,
      cellBasophils: 2,
      cellNeutrophilsMin: 40,
      cellNeutrophilsMax: 75,
      cellLymphocytesMin: 20,
      cellLymphocytesMax: 40,
      cellMonocytesMin: 2,
      cellMonocytesMax: 10,
      cellBasophilsMin: 0,
      cellBasophilsMax: 2,
      cellHematocritMin: 36,
      cellHematocritMax: 52,
      heartRateMin: 60,
      heartRateMax: 100,
      bpSystolicMin: 90,
      bpSystolicMax: 120,
      bpDiastolicMin: 60,
      bpDiastolicMax: 80,
      oxygenSaturationMin: 95,
      oxygenSaturationMax: 100
    };


  const getTemperatureStatus = (temp: number) => {
    if (temp < 36.1) return { status: '偏低', color: '#1890ff' };
    if (temp > 37.2) return { status: '偏高', color: '#ff4d4f' };
    return { status: '正常', color: '#52c41a' };
  };

  const getValueStatus = (value: number, min: number, max: number) => {
    if (value < min) return { status: '偏低', color: '#1890ff' };
    if (value > max) return { status: '偏高', color: '#ff4d4f' };
    return { status: '正常', color: '#52c41a' };
  };

  const tempStatus = getTemperatureStatus(latestData.cellValue);

  // 计算各指标状态
  const neutrophilsStatus = getValueStatus(
    latestData.cellNeutrophils,
    latestData.cellNeutrophilsMin || 40,
    latestData.cellNeutrophilsMax || 75
  );

  const lymphocytesStatus = getValueStatus(
    latestData.cellLymphocytes,
    latestData.cellLymphocytesMin || 20,
    latestData.cellLymphocytesMax || 40
  );

  const monocytesStatus = getValueStatus(
    latestData.cellMonocytes,
    latestData.cellMonocytesMin || 2,
    latestData.cellMonocytesMax || 10
  );

  const basophilsStatus = getValueStatus(
    latestData.cellBasophils,
    latestData.cellBasophilsMin || 0,
    latestData.cellBasophilsMax || 2
  );

  const hematocritStatus = getValueStatus(
    latestData.cellHematocrit,
    latestData.cellHematocritMin || 36,
    latestData.cellHematocritMax || 52
  );

  return (
    <div className="dashboard-container">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card
                className="dashboard-card temperature-card"
                loading={loading}
                title={
                  <div className="card-title">
                    <FireOutlined /> 体温监测
                  </div>
                }
              >
                <div className="temperature-content">
                  <div className="temperature-gauge">
                    <div className="temperature-value" style={{ color: tempStatus.color }}>
                      {latestData.cellValue}°C
                    </div>
                    <div className="temperature-status" style={{ color: tempStatus.color }}>
                      {tempStatus.status}
                    </div>
                  </div>
                  <div className="temperature-range">
                    正常范围: {latestData.cellMin}°C - {latestData.cellMax}°C
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                className="dashboard-card blood-card"
                loading={loading}
                title={
                  <div className="card-title">
                    <HeartOutlined /> 血液分析
                  </div>
                }
              >
                <div className="blood-content">
                  <Tooltip title={`正常范围: ${latestData.cellHematocritMin || 36}% - ${latestData.cellHematocritMax || 52}%`}>
                    <Progress
                      type="circle"
                      percent={latestData.cellHematocrit}
                      format={() => (
                        <div className="hematocrit-value">
                          <div className="value" style={{ color: hematocritStatus.color }}>{latestData.cellHematocrit}%</div>
                          <div className="label">血红比值</div>
                          <div className="status" style={{ color: hematocritStatus.color, fontSize: '12px' }}>{hematocritStatus.status}</div>
                        </div>
                      )}
                      strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                      }}
                    />
                  </Tooltip>
                </div>
              </Card>
            </Col>
            <Col xs={24}>
              <Card
                className="dashboard-card blood-formula-card"
                loading={loading}
                title="血液组成分析"
              >
                <div className="blood-formula-grid">
                  <Tooltip title={`正常范围: ${latestData.cellNeutrophilsMin || 40}% - ${latestData.cellNeutrophilsMax || 75}%`}>
                    <div className="blood-formula-item neutrophils">
                      <div className="formula-value" style={{ color: neutrophilsStatus.color }}>{latestData.cellNeutrophils}%</div>
                      <div className="formula-label">中性粒细胞</div>
                      <div className="formula-status" style={{ color: neutrophilsStatus.color }}>{neutrophilsStatus.status}</div>
                    </div>
                  </Tooltip>

                  <Tooltip title={`正常范围: ${latestData.cellLymphocytesMin || 20}% - ${latestData.cellLymphocytesMax || 40}%`}>
                    <div className="blood-formula-item lymphocytes">
                      <div className="formula-value" style={{ color: lymphocytesStatus.color }}>{latestData.cellLymphocytes}%</div>
                      <div className="formula-label">淋巴细胞</div>
                      <div className="formula-status" style={{ color: lymphocytesStatus.color }}>{lymphocytesStatus.status}</div>
                    </div>
                  </Tooltip>

                  <Tooltip title={`正常范围: ${latestData.cellMonocytesMin || 2}% - ${latestData.cellMonocytesMax || 10}%`}>
                    <div className="blood-formula-item monocytes">
                      <div className="formula-value" style={{ color: monocytesStatus.color }}>{latestData.cellMonocytes}%</div>
                      <div className="formula-label">单核细胞</div>
                      <div className="formula-status" style={{ color: monocytesStatus.color }}>{monocytesStatus.status}</div>
                    </div>
                  </Tooltip>

                  <Tooltip title={`正常范围: ${latestData.cellBasophilsMin || 0}% - ${latestData.cellBasophilsMax || 2}%`}>
                    <div className="blood-formula-item basophils">
                      <div className="formula-value" style={{ color: basophilsStatus.color }}>{latestData.cellBasophils}%</div>
                      <div className="formula-label">嗜碱性粒细胞</div>
                      <div className="formula-status" style={{ color: basophilsStatus.color }}>{basophilsStatus.status}</div>
                    </div>
                  </Tooltip>
                </div>
              </Card>
            </Col>
            <Col xs={24}>
              <Card
                className="dashboard-card vital-signs-card"
                loading={loading}
                title={
                  <div className="card-title">
                    <HeartFilled /> 生命体征参考范围
                  </div>
                }
              >
                <div className="vital-signs-grid">
                  <div className="vital-sign-item">
                    <div className="vital-sign-title">心率</div>
                    <div className="vital-sign-range">{latestData.heartRateMin || 60} - {latestData.heartRateMax || 100} 次/分钟</div>
                  </div>

                  <div className="vital-sign-item">
                    <div className="vital-sign-title">收缩压</div>
                    <div className="vital-sign-range">{latestData.bpSystolicMin || 90} - {latestData.bpSystolicMax || 120} mmHg</div>
                  </div>

                  <div className="vital-sign-item">
                    <div className="vital-sign-title">舒张压</div>
                    <div className="vital-sign-range">{latestData.bpDiastolicMin || 60} - {latestData.bpDiastolicMax || 80} mmHg</div>
                  </div>

                  <div className="vital-sign-item">
                    <div className="vital-sign-title">血氧饱和度</div>
                    <div className="vital-sign-range">{latestData.oxygenSaturationMin || 95} - {latestData.oxygenSaturationMax || 100}%</div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            className="dashboard-card calendar-card"
            title={
              <div className="card-title">
                <CalendarOutlined /> 日历
              </div>
            }
          >
            <Calendar fullscreen={false} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 