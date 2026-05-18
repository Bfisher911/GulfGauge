import type { Station } from '../types';

export const CUSTOM_STATION_ID = 'custom-station';

export const stationPresets: Station[] = [
  {
    id: 'south-pass-port-eads-01850',
    name: 'South Pass at Port Eads, Gage 01850',
    mlgToMllwFt: 3.5,
    mllwToNavd88Ft: 0.34,
    sourceNote: 'Sample preset. Verify against project datum documentation before use.',
  },
];
