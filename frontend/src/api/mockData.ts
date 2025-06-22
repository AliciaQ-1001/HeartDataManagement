// 模拟心脏数据
export const mockHeartData = {
  code: 20000,
  msg: "success",
  data: [
    {
      heartId: 1,
      heartHeartRate: 75,
      heartHrv: 65,
      heartSv: 70,
      heartCo: 5,
      heartPtt: 110,
      heartTimestamp: "2025-05-21T23:00:00",
      userId: 2,
      heartSystolic: 120, // 收缩压
      heartDiastolic: 80, // 舒张压
    },
    // ... 更多模拟数据
  ]
};

// 模拟睡眠数据
export const mockSleepData = {
  code: 20000,
  msg: "success",
  data: [
    {
      sleepId: 1,
      userId: 2,
      sleepValue: 85,
      sleepName: "深睡",
      sleepTime: "2025-05-21 23:00:00",
      sleepType: "Stage 3",
      sleepDuration: "01:00",
      sleepQuality: 85, // 睡眠质量评分
      sleepStartTime: "22:30", // 入睡时间
      sleepEndTime: "06:30", // 起床时间
      sleepTotalHours: 8, // 总睡眠时长
    },
    // ... 更多模拟数据
  ]
};

// 模拟呼吸数据
export const mockRespiratoryData = {
  code: 20000,
  msg: "success",
  data: [
    {
      breatheId: 1,
      userId: 2,
      breatheBreathRate: 15,
      breatheTimestamp: "2025-05-21 23:00:00",
      breatheTime: "23:00 - 00:00",
      breatheType: "Normal",
      breatheDuration: "01:00",
      breatheOxygenSaturation: 98, // 氧饱和度
      breatheLungCapacity: 5.8, // 肺活量(L)
      breatheFEV1: 4.2, // 第一秒用力呼气量(L)
      breatheFVC: 5.6, // 用力肺活量(L)
    },
    // ... 更多模拟数据
  ]
};

// 模拟仪表盘数据
export const mockDashboardData = {
  code: 20000,
  msg: "success",
  data: [
    {
      cellId: 1,
      userId: 2,
      cellValue: 9500,
      cellUnit: "count/μL",
      cellMin: 4000,
      cellMax: 11000,
      cellHematocrit: 45,
      cellNeutrophils: 60,
      cellLymphocytes: 30,
      cellMonocytes: 7,
      cellBasophils: 1,
      // 添加参考范围
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
      oxygenSaturationMax: 100,
    },
    // ... 更多模拟数据
  ]
}; 