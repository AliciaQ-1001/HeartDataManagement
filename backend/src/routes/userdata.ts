import express from 'express';
import { UserData } from '../models/UserData';

const router = express.Router();

// 模拟数据存储
let mockData: UserData[] = [
  {
    id: '1',
    name: 'Kate Tanner',
    heart: { rate: 75, hrv: 55, sv: 70, co: 5, ptt: 150 },
    respiratory: { rate: 16, apnea: [] },
    sleep: { stages: { awake: 5, light: 35, deep: 45, rem: 15 }, activity: [] },
    temperature: 37.5,
    blood: { neutrophils: 60, lymphocytes: 21, monocytes: 8, basophils: 3, hematocrit: 13 },
    updatedAt: new Date().toISOString(),
  },
];

// 获取所有用户数据
router.get('/', (req, res) => {
  res.json(mockData);
});

// 新增或更新用户数据
router.post('/', (req, res) => {
  const data: UserData = req.body;
  const idx = mockData.findIndex(d => d.id === data.id);
  if (idx >= 0) mockData[idx] = data;
  else mockData.push(data);
  res.json({ success: true });
});

export default router; 