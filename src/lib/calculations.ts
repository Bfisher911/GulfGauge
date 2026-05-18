export const FEET_TO_METERS = 0.3048;

// Exact unit conversion used for display only; calculations remain in feet.
export function feetToMeters(valueFt: number): number {
  return valueFt * FEET_TO_METERS;
}

// MLG_to_NAVD88_offset_ft = MLG_to_MLLW_ft + MLLW_to_NAVD88_ft.
export function getTotalOffsetFt(mlgToMllwFt: number, mllwToNavd88Ft: number): number {
  return mlgToMllwFt + mllwToNavd88Ft;
}

// Corps_Elevation_NAVD88_ft = Corps_Elevation_MLG_ft - MLG_to_NAVD88_offset_ft.
export function convertMlgToNavd88(corpsMlgFt: number, totalOffsetFt: number): number {
  return corpsMlgFt - totalOffsetFt;
}

// Difference_ft = RTK_Elevation_NAVD88_ft - Corps_Elevation_NAVD88_ft.
export function getDifference(rtkNavd88Ft: number, corpsNavd88Ft: number): number {
  return rtkNavd88Ft - corpsNavd88Ft;
}

export function formatNumber(value: number, digits = 2): string {
  return value.toFixed(digits);
}

export function parseNumericInput(rawValue: string, fieldLabel: string) {
  const trimmedValue = rawValue.trim();

  if (trimmedValue === '') {
    return { value: null };
  }

  const parsedValue = Number(trimmedValue);

  if (!Number.isFinite(parsedValue)) {
    return { value: null, error: `${fieldLabel} must be a number.` };
  }

  return { value: parsedValue };
}
