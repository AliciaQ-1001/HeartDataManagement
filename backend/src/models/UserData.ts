export interface UserData {
  id: string;
  name: string;
  heart: {
    rate: number;
    hrv: number;
    sv: number;
    co: number;
    ptt: number;
  };
  respiratory: {
    rate: number;
    apnea: { time: string; duration: number }[];
  };
  sleep: {
    stages: {
      awake: number;
      light: number;
      deep: number;
      rem: number;
    };
    activity: { time: string; type: string; duration: number }[];
  };
  temperature: number;
  blood: {
    neutrophils: number;
    lymphocytes: number;
    monocytes: number;
    basophils: number;
    hematocrit: number;
  };
  updatedAt: string;
} 