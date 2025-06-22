# Heart Management 心脏健康数据管理系统

## 项目简介
本项目为心脏健康数据管理系统，采用前后端分离架构，便于后续对接心脏健康监测设备，实现数据的采集、可视化与管理。

### 主要功能包括：
- 心脏相关数据（心率、心率变异性、心搏输出量、心输出量、脉搏波传导时间）
- 呼吸数据（呼吸率、睡眠呼吸暂停检测）
- 睡眠与体动数据（睡眠周期、体动）
- 用户信息管理
- 咨询入口
- 数据可视化展示（ECharts）
- 侧边栏导航与顶部搜索/提醒

### 技术栈：
前端：React + TypeScript + Ant Design + ECharts + Axios + React Router + vite
后端：Node.js + Express + TypeScript + MongoDB（当前为模拟数据，已预留真实设备数据接口）

## 启动方式

### 1. 启动后端（暂不需要）
```bash
cd backend
npm install
npm run dev
```

### 2. 启动前端
```bash
cd frontend
npm install
npm run dev
```

前端默认端口：3000  
后端默认端口：5000

## 目录结构
```
Heart_Management/
├── backend/         # 后端代码
│   ├── src/
│   │   ├── models/UserData.ts
│   │   ├── routes/userdata.ts
│   │   └── app.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── frontend/        # 前端代码
│   ├── src/
│   │   ├── components/Sidebar.tsx, Topbar.tsx
│   │   ├── pages/Dashboard.tsx, HeartData.tsx, RespiratoryData.tsx, SleepActivity.tsx, UserInfo.tsx, Consultation.tsx
│   │   ├── api/userdata.ts
│   │   └── App.tsx, main.tsx
│   ├── public/index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
└── README.md        # 总体说明
``` 

## 主要页面说明
- 首页（Dashboard）：展示心脏、呼吸、睡眠等数据总览
- 心脏数据：心率、HRV、SV、CO、PTT等趋势图
- 呼吸数据：呼吸率曲线、呼吸暂停事件列表
- 睡眠与体动：睡眠阶段、体动事件列表
- 用户信息：用户基本信息
- 咨询：预留医生问诊、消息等功能

## 设备数据对接说明
- 后端接口已预留真实数据的存储与查询代码（见 routes/userdata.ts 注释部分）。
- 只需将设备采集到的数据通过 POST/PUT 请求发送到 /api/userdata，即可实现数据的实时接入与展示。