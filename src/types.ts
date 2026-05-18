export type Station = {
  id: string;
  name: string;
  mlgToMllwFt: number;
  mllwToNavd88Ft: number;
  sourceNote?: string;
};

export type ParsedInput = {
  value: number | null;
  error?: string;
};
