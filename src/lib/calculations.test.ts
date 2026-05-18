import { describe, expect, it } from 'vitest';
import {
  convertMlgToNavd88,
  feetToMeters,
  getDifference,
  getTotalOffsetFt,
} from './calculations';

describe('datum calculations', () => {
  it('converts the supplied MLG Corps elevation example to NAVD88', () => {
    const totalOffsetFt = getTotalOffsetFt(3.5, 0.34);

    expect(totalOffsetFt).toBeCloseTo(3.84);
    expect(convertMlgToNavd88(4.5, totalOffsetFt)).toBeCloseTo(0.66);
  });

  it('calculates the RTK minus Corps difference from the example', () => {
    const corpsNavd88Ft = convertMlgToNavd88(4.5, getTotalOffsetFt(3.5, 0.34));

    expect(getDifference(5, corpsNavd88Ft)).toBeCloseTo(4.34);
  });

  it('formats expected metric equivalents using the exact feet-to-meter factor', () => {
    expect(feetToMeters(0.66)).toBeCloseTo(0.201168);
    expect(feetToMeters(4.34)).toBeCloseTo(1.322832);
  });
});
