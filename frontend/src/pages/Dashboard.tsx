import React from 'react';
import { Card, Calendar, Progress } from 'antd';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-row-container">
      <div className="dashboard-row-item">
        <Card title="Body Temperature" className="dashboard-card body-temp">
          <div className="body-temp-gauge">
            <span className="temp-value">37.5°C</span>
            <div className="temp-range">33°C - 42°C</div>
          </div>
        </Card>
      </div>
      <div className="dashboard-row-item">
        <Card title="Calendar" className="dashboard-card calendar">
          <Calendar fullscreen={false} />
        </Card>
      </div>
      <div className="dashboard-row-item">
        <Card title="Blood Analysis" className="dashboard-card blood-analysis">
          <div style={{ width: '100%', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Progress type="dashboard" percent={13} format={() => '13% Hematocrit'} />
          </div>
        </Card>
      </div>
      <div className="dashboard-row-item">
        <Card title="Blood Formula" className="dashboard-card blood-formula">
          <div className="blood-formula-grid">
            <div className="blood-formula-item neutrophils">60% Neutrophils</div>
            <div className="blood-formula-item lymphocytes">21% Lymphocytes</div>
            <div className="blood-formula-item monocytes">8% Monocytes</div>
            <div className="blood-formula-item basophils">3% Basophils</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 