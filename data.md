# 心脏数据管理系统 - 后端接口需求文档

## 1. 用户信息管理

### 接口：`/api/user/info`

#### 数据结构
```typescript
interface UserInfo {
  name: string;        // 姓名
  gender: string;      // 性别
  age: string;         // 年龄
  phone: string;       // 联系方式
  address: string;     // 住址
  email: string;       // 邮箱
  id: string;          // 身份证号
  emergency: string;   // 紧急联系人
  allergy: string;     // 过敏史
  history: string;     // 既往病史
}
```

#### 接口说明
- GET `/api/user/info` - 获取用户信息
- PUT `/api/user/info` - 更新用户信息

## 2. 心脏数据监测

### 接口：`/api/heart/data`

#### 数据结构
```typescript
interface HeartData {
  heartRate: number[];    // 心率数据（24小时）
  hrv: number[];         // 心率变异性（24小时）
  sv: number[];          // 心搏输出量（24小时）
  co: number[];          // 心输出量（24小时）
  ptt: number[];         // 脉搏波传导时间（24小时）
  timestamp: string[];   // 时间戳（24小时）
}
```

#### 数据范围
- 心率：40-120 bpm
- 心率变异性：20-100 ms
- 心搏输出量：40-100 ml
- 心输出量：2-10 L/min
- 脉搏波传导时间：80-220 ms

## 3. 睡眠活动监测

### 接口：`/api/sleep/activity`

#### 数据结构
```typescript
interface SleepData {
  sleepStages: {
    value: number;      // 占比
    name: string;       // 阶段名称（清醒/浅睡/深睡/REM）
  }[];
  bodyMovements: {
    time: string;       // 时间
    type: string;       // 体动类型
    duration: string;   // 持续时间
  }[];
}
```

#### 接口说明
- GET `/api/sleep/activity` - 获取睡眠活动数据
- GET `/api/sleep/activity/history` - 获取历史睡眠数据

## 4. 呼吸数据监测

### 接口：`/api/respiratory/data`

#### 数据结构
```typescript
interface RespiratoryData {
  breathRate: number[];    // 呼吸率数据（24小时）
  timestamp: string[];     // 时间戳（24小时）
  apneaEvents: {
    time: string;          // 时间
    type: string;          // 事件类型
    duration: string;      // 持续时间
  }[];
}
```

#### 数据范围
- 呼吸率：8-24 次/分钟

## 5. 仪表盘数据

### 接口：`/api/dashboard`

#### 数据结构
```typescript
interface DashboardData {
  bodyTemperature: {
    value: number;         // 体温值
    unit: string;          // 单位（°C）
    range: {              // 正常范围
      min: number;
      max: number;
    };
  };
  bloodAnalysis: {
    hematocrit: number;    // 红细胞压积百分比
    bloodFormula: {        // 血细胞分类计数
      neutrophils: number;  // 中性粒细胞
      lymphocytes: number;  // 淋巴细胞
      monocytes: number;    // 单核细胞
      basophils: number;    // 嗜碱性粒细胞
    };
  };
}
```

#### 接口说明
- GET `/api/dashboard` - 获取仪表盘数据
- GET `/api/dashboard/history` - 获取历史数据

## 6. 问诊系统

### 接口：`/api/consultation`

#### 数据结构
```typescript
interface Message {
  id: number;        // 消息ID
  sender: string;    // 发送者（医生/患者/智能助手）
  content: string;   // 消息内容
  time: string;      // 发送时间
}
```

#### 接口说明
- GET `/api/consultation` - 获取问诊历史
- POST `/api/consultation` - 发送新消息

#### 问诊模式
- 医生问诊
- 智能助手健康助手问诊

## 7. 技术建议

### 实时数据
- 建议使用WebSocket实现心脏数据的实时推送
- 考虑使用Redis等缓存机制减少数据库压力

### 性能优化
- 实现数据分页机制
- 添加数据缓存层
- 实现数据压缩传输

### 安全措施
- 实现用户认证和授权
- 数据加密传输
- 敏感信息脱敏

### 错误处理
- 统一的错误响应格式
- 详细的错误日志记录
- 友好的错误提示信息

## 8. 响应格式

### 成功响应
```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

### 错误响应
```json
{
  "code": 400,
  "message": "error message",
  "data": null
}
```

## 9. 用户认证

### 接口：`/api/auth`

#### 登录接口
- POST `/api/auth/login`
```typescript
interface LoginRequest {
  username: string;    // 用户名
  password: string;    // 密码
}

interface LoginResponse {
  token: string;       // JWT令牌
  user: {
    id: string;        // 用户ID
    username: string;  // 用户名
    email: string;     // 邮箱
    phone: string;     // 手机号
  };
}
```

#### 注册接口
- POST `/api/auth/register`
```typescript
interface RegisterRequest {
  username: string;    // 用户名
  password: string;    // 密码
  email: string;       // 邮箱
  phone: string;       // 手机号
}

interface RegisterResponse {
  id: string;          // 用户ID
  username: string;    // 用户名
  email: string;       // 邮箱
  phone: string;       // 手机号
}
```

#### 登出接口
- POST `/api/auth/logout` 