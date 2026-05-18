# MLG ↔ NAVD88 Datum Converter

A simple React + TypeScript field calculator for comparing Army Corps elevations
reported in Mean Low Gulf (MLG) against RTK GNSS field measurements collected in
NAVD88 using Geoid 18.

The app is intentionally client-side only. It stores any custom station presets
in the browser with `localStorage`; no backend or paid API is required.

## Run Locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite, usually `http://localhost:5173`.

To run the production build and unit tests:

```bash
npm run test
npm run build
```

## What Each Input Means

- **Corps/design elevation in MLG, ft**: the elevation from Corps or design
  documents reported in Mean Low Gulf.
- **RTK field elevation in NAVD88, ft**: the field-measured RTK GNSS elevation
  already expressed in NAVD88.
- **Station preset**: the nearest applicable station or reach-specific datum
  relationship. The included South Pass at Port Eads preset is a sample starting
  point and should not be assumed correct for every project.
- **MLG to MLLW offset, ft**: the local relationship from Mean Low Gulf to Mean
  Lower Low Water.
- **MLLW to NAVD88 offset, ft**: the local relationship from Mean Lower Low Water
  to NAVD88.
- **Unit display**: show feet only, or feet plus metric equivalents.

Decimal and negative values are allowed because elevations and datum
relationships may fall below zero.

## Formula Used

```text
MLG_to_NAVD88_offset_ft = MLG_to_MLLW_ft + MLLW_to_NAVD88_ft

Corps_Elevation_NAVD88_ft = Corps_Elevation_MLG_ft - MLG_to_NAVD88_offset_ft

Difference_ft = RTK_Elevation_NAVD88_ft - Corps_Elevation_NAVD88_ft
```

Metric display uses:

```text
meters = feet * 0.3048
```

Example:

```text
Corps elevation = 4.5 ft MLG
MLG to MLLW offset = 3.5 ft
MLLW to NAVD88 offset = 0.34 ft
Total offset = 3.84 ft
Converted Corps elevation = 4.5 - 3.84 = 0.66 ft NAVD88
RTK measured elevation = 5.0 ft NAVD88
Difference = 5.0 - 0.66 = 4.34 ft
```

## Why The Closest Station Matters

MLG is spatially variable. This calculator only works when the station offsets
match the project location or reach. Do not apply one offset across the entire
Gulf unless the datum documentation supports it.

Use the closest applicable station, a reach-specific datum relationship, or a
custom station value supported by project documentation.

## Features

- Editable station offsets for both presets and custom stations.
- Custom station save and remove using `localStorage`.
- Partial calculations when only some valid inputs are available.
- Friendly inline validation for non-numeric entries.
- Feet-only or feet-and-meters result display.
- Copyable plain-language summary.
- CSV export row for field notes or QA records.
