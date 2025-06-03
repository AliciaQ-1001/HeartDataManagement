import React, { useEffect, useState } from 'react';
import { Card, Calendar, Progress, message, Row, Col, Statistic } from 'antd';
import { FireOutlined, HeartOutlined, CalendarOutlined } from '@ant-design/icons';
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
      cellBasophils: 2
    };


  const getTemperatureStatus = (temp: number) => {
    if (temp < 36.1) return { status: '偏低', color: '#1890ff' };
    if (temp > 37.2) return { status: '偏高', color: '#ff4d4f' };
    return { status: '正常', color: '#52c41a' };
  };

  const tempStatus = getTemperatureStatus(latestData.cellValue);

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
                  <Progress
                    type="circle"
                    percent={latestData.cellHematocrit}
                    format={() => (
                      <div className="hematocrit-value">
                        <div className="value">{latestData.cellHematocrit}%</div>
                        <div className="label">血红比值</div>
                      </div>
                    )}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                  />
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
                  <div className="blood-formula-item neutrophils">
                    <div className="formula-value">{latestData.cellNeutrophils}%</div>
                    <div className="formula-label">中性粒细胞</div>
                  </div>
                  <div className="blood-formula-item lymphocytes">
                    <div className="formula-value">{latestData.cellLymphocytes}%</div>
                    <div className="formula-label">淋巴细胞</div>
                  </div>
                  <div className="blood-formula-item monocytes">
                    <div className="formula-value">{latestData.cellMonocytes}%</div>
                    <div className="formula-label">单核细胞</div>
                  </div>
                  <div className="blood-formula-item basophils">
                    <div className="formula-value">{latestData.cellBasophils}%</div>
                    <div className="formula-label">嗜碱性粒细胞</div>
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