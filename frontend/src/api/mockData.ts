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
      userId: 2
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
      sleepDuration: "01:00"
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
      breatheDuration: "01:00"
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
      cellBasophils: 1
    },
    // ... 更多模拟数据
  ]
}; 