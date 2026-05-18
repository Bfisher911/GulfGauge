import { useEffect, useMemo, useState } from 'react';
import { CUSTOM_STATION_ID, stationPresets } from '../data/stations';
import {
  convertMlgToNavd88,
  feetToMeters,
  formatNumber,
  getDifference,
  getTotalOffsetFt,
  parseNumericInput,
} from '../lib/calculations';
import type { Station } from '../types';
import { ExamplePanel } from './ExamplePanel';
import { ResultCard } from './ResultCard';
import { StationSelector } from './StationSelector';
import { UnitToggle } from './UnitToggle';

const CUSTOM_STATIONS_STORAGE_KEY = 'mlg-navd88-custom-stations';

function readCustomStations(): Station[] {
  try {
    const storedValue = window.localStorage.getItem(CUSTOM_STATIONS_STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue) as Station[];

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(
      (station) =>
        typeof station.id === 'string' &&
        typeof station.name === 'string' &&
        Number.isFinite(station.mlgToMllwFt) &&
        Number.isFinite(station.mllwToNavd88Ft),
    );
  } catch {
    return [];
  }
}

function writeCustomStations(stations: Station[]) {
  window.localStorage.setItem(CUSTOM_STATIONS_STORAGE_KEY, JSON.stringify(stations));
}

function toInputValue(value: number): string {
  return String(value);
}

function csvValue(value: string | number | null): string {
  if (value === null) {
    return '';
  }

  return `"${String(value).replace(/"/g, '""')}"`;
}

export function DatumCalculator() {
  const [customStations, setCustomStations] = useState<Station[]>(() => readCustomStations());
  const [corpsMlgFt, setCorpsMlgFt] = useState('4.5');
  const [rtkNavd88Ft, setRtkNavd88Ft] = useState('5.0');
  const [selectedStationId, setSelectedStationId] = useState(stationPresets[0].id);
  const [customStationName, setCustomStationName] = useState(stationPresets[0].name);
  const [mlgToMllwFt, setMlgToMllwFt] = useState(toInputValue(stationPresets[0].mlgToMllwFt));
  const [mllwToNavd88Ft, setMllwToNavd88Ft] = useState(
    toInputValue(stationPresets[0].mllwToNavd88Ft),
  );
  const [showMetric, setShowMetric] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [copyStatus, setCopyStatus] = useState('');

  const stations = useMemo(() => [...stationPresets, ...customStations], [customStations]);
  const selectedStation = stations.find((station) => station.id === selectedStationId) ?? null;
  const isCustomStation = selectedStationId === CUSTOM_STATION_ID;
  const isSavedCustomStation = customStations.some((station) => station.id === selectedStationId);

  const parsedCorpsMlg = parseNumericInput(corpsMlgFt, 'Corps/design elevation');
  const parsedRtkNavd88 = parseNumericInput(rtkNavd88Ft, 'RTK field elevation');
  const parsedMlgToMllw = parseNumericInput(mlgToMllwFt, 'MLG to MLLW offset');
  const parsedMllwToNavd88 = parseNumericInput(mllwToNavd88Ft, 'MLLW to NAVD88 offset');

  const totalOffsetFt =
    parsedMlgToMllw.value !== null && parsedMllwToNavd88.value !== null
      ? getTotalOffsetFt(parsedMlgToMllw.value, parsedMllwToNavd88.value)
      : null;
  const corpsNavd88Ft =
    parsedCorpsMlg.value !== null && totalOffsetFt !== null
      ? convertMlgToNavd88(parsedCorpsMlg.value, totalOffsetFt)
      : null;
  const rtkValueFt = parsedRtkNavd88.value;
  const differenceFt =
    rtkValueFt !== null && corpsNavd88Ft !== null ? getDifference(rtkValueFt, corpsNavd88Ft) : null;

  const hasStationName = customStationName.trim().length > 0;
  const canSaveStation =
    hasStationName && parsedMlgToMllw.value !== null && parsedMllwToNavd88.value !== null;

  useEffect(() => {
    writeCustomStations(customStations);
  }, [customStations]);

  function handleStationChange(stationId: string) {
    setSelectedStationId(stationId);
    setSaveStatus('');
    setCopyStatus('');

    if (stationId === CUSTOM_STATION_ID) {
      setCustomStationName('');
      return;
    }

    const station = stations.find((candidate) => candidate.id === stationId);

    if (!station) {
      return;
    }

    setCustomStationName(station.name);
    setMlgToMllwFt(toInputValue(station.mlgToMllwFt));
    setMllwToNavd88Ft(toInputValue(station.mllwToNavd88Ft));
  }

  function handleSaveStation() {
    if (!canSaveStation || parsedMlgToMllw.value === null || parsedMllwToNavd88.value === null) {
      setSaveStatus('Enter a station name and valid offsets before saving.');
      return;
    }

    const stationToSave: Station = {
      id: isSavedCustomStation ? selectedStationId : `custom-${Date.now()}`,
      name: customStationName.trim(),
      mlgToMllwFt: parsedMlgToMllw.value,
      mllwToNavd88Ft: parsedMllwToNavd88.value,
      sourceNote: 'Saved locally in this browser.',
    };

    setCustomStations((currentStations) => {
      const existingIndex = currentStations.findIndex((station) => station.id === stationToSave.id);

      if (existingIndex === -1) {
        return [...currentStations, stationToSave];
      }

      return currentStations.map((station) =>
        station.id === stationToSave.id ? stationToSave : station,
      );
    });

    setSelectedStationId(stationToSave.id);
    setSaveStatus(`${stationToSave.name} saved in this browser.`);
  }

  function handleRemoveSavedStation() {
    if (!isSavedCustomStation) {
      return;
    }

    setCustomStations((currentStations) =>
      currentStations.filter((station) => station.id !== selectedStationId),
    );
    handleStationChange(stationPresets[0].id);
    setSaveStatus('Saved station removed.');
  }

  function resetCalculator() {
    const defaultStation = stationPresets[0];

    setCorpsMlgFt('4.5');
    setRtkNavd88Ft('5.0');
    setSelectedStationId(defaultStation.id);
    setCustomStationName(defaultStation.name);
    setMlgToMllwFt(toInputValue(defaultStation.mlgToMllwFt));
    setMllwToNavd88Ft(toInputValue(defaultStation.mllwToNavd88Ft));
    setShowMetric(false);
    setSaveStatus('');
    setCopyStatus('');
  }

  function buildResultSummary() {
    const lines = [
      `Station: ${customStationName.trim() || 'Custom station'}`,
      `MLG to MLLW offset: ${mlgToMllwFt || 'not entered'} ft`,
      `MLLW to NAVD88 offset: ${mllwToNavd88Ft || 'not entered'} ft`,
    ];

    if (totalOffsetFt !== null) {
      lines.push(`Total MLG to NAVD88 offset: ${formatNumber(totalOffsetFt)} ft`);
    }

    if (corpsNavd88Ft !== null) {
      lines.push(`Corps elevation converted to NAVD88: ${formatNumber(corpsNavd88Ft)} ft`);
    }

    if (rtkValueFt !== null) {
      lines.push(`RTK elevation: ${formatNumber(rtkValueFt)} ft NAVD88`);
    }

    if (differenceFt !== null) {
      const direction =
        Math.abs(differenceFt) <= 0.05
          ? 'approximately equal to'
          : differenceFt > 0
            ? 'above'
            : 'below';
      const differenceText = `${formatNumber(Math.abs(differenceFt))} ft`;
      const metricText = showMetric
        ? ` / ${formatNumber(feetToMeters(Math.abs(differenceFt)), 3)} m`
        : '';

      lines.push(
        direction === 'approximately equal to'
          ? 'RTK is approximately equal to the converted Corps elevation.'
          : `RTK is ${differenceText}${metricText} ${direction} the converted Corps elevation.`,
      );
    }

    return lines.join('\n');
  }

  async function copyResults() {
    try {
      await navigator.clipboard.writeText(buildResultSummary());
      setCopyStatus('Results copied.');
    } catch {
      setCopyStatus('Copy unavailable in this browser. Select the results and copy manually.');
    }
  }

  function exportCsv() {
    const headers = [
      'station_name',
      'corps_elev_mlg_ft',
      'mlg_to_mllw_ft',
      'mllw_to_navd88_ft',
      'total_offset_ft',
      'corps_elev_navd88_ft',
      'rtk_elev_navd88_ft',
      'difference_ft',
      'difference_m',
    ];
    const values = [
      customStationName.trim() || 'Custom station',
      parsedCorpsMlg.value,
      parsedMlgToMllw.value,
      parsedMllwToNavd88.value,
      totalOffsetFt,
      corpsNavd88Ft,
      rtkValueFt,
      differenceFt,
      differenceFt !== null ? feetToMeters(differenceFt) : null,
    ];
    const csvContent = `${headers.join(',')}\n${values.map(csvValue).join(',')}\n`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = 'mlg-navd88-conversion.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <div className="calculator-layout">
      <section className="card input-card" aria-labelledby="input-heading">
        <div className="card-header">
          <div>
            <p className="section-kicker">Inputs</p>
            <h2 id="input-heading">Datum and field elevations</h2>
          </div>
          <button type="button" className="secondary-button" onClick={resetCalculator}>
            Reset
          </button>
        </div>

        <p className="reach-note">
          Use the closest applicable station or reach-specific datum relationship.
        </p>

        <div className="field-grid">
          <label className="field">
            <span>Corps/design elevation in MLG, ft</span>
            <input
              inputMode="decimal"
              value={corpsMlgFt}
              onChange={(event) => setCorpsMlgFt(event.target.value)}
              placeholder="Example: 4.5"
            />
            {parsedCorpsMlg.error ? <small>{parsedCorpsMlg.error}</small> : null}
          </label>

          <label className="field">
            <span>RTK field elevation in NAVD88, ft</span>
            <input
              inputMode="decimal"
              value={rtkNavd88Ft}
              onChange={(event) => setRtkNavd88Ft(event.target.value)}
              placeholder="Example: 5.0"
            />
            {parsedRtkNavd88.error ? <small>{parsedRtkNavd88.error}</small> : null}
          </label>

          <StationSelector
            stations={stations}
            selectedStationId={selectedStationId}
            onStationChange={handleStationChange}
          />

          {(isCustomStation || isSavedCustomStation) && (
            <label className="field">
              <span>Station name</span>
              <input
                value={customStationName}
                onChange={(event) => setCustomStationName(event.target.value)}
                placeholder="Closest station or reach"
              />
            </label>
          )}

          <label className="field">
            <span>MLG to MLLW offset, ft</span>
            <input
              inputMode="decimal"
              value={mlgToMllwFt}
              onChange={(event) => setMlgToMllwFt(event.target.value)}
              placeholder="Example: 3.5"
            />
            {parsedMlgToMllw.error ? <small>{parsedMlgToMllw.error}</small> : null}
          </label>

          <label className="field">
            <span>MLLW to NAVD88 offset, ft</span>
            <input
              inputMode="decimal"
              value={mllwToNavd88Ft}
              onChange={(event) => setMllwToNavd88Ft(event.target.value)}
              placeholder="Example: 0.34"
            />
            {parsedMllwToNavd88.error ? <small>{parsedMllwToNavd88.error}</small> : null}
          </label>
        </div>

        {selectedStation?.sourceNote ? <p className="source-note">{selectedStation.sourceNote}</p> : null}

        <div className="station-actions">
          <UnitToggle showMetric={showMetric} onChange={setShowMetric} />
          <div className="button-row">
            <button
              type="button"
              className="primary-button"
              onClick={handleSaveStation}
              disabled={!canSaveStation}
            >
              Save station
            </button>
            {isSavedCustomStation ? (
              <button type="button" className="secondary-button" onClick={handleRemoveSavedStation}>
                Remove saved
              </button>
            ) : null}
          </div>
        </div>
        {saveStatus ? <p className="copy-status">{saveStatus}</p> : null}
      </section>

      <ResultCard
        totalOffsetFt={totalOffsetFt}
        corpsNavd88Ft={corpsNavd88Ft}
        rtkNavd88Ft={rtkValueFt}
        differenceFt={differenceFt}
        showMetric={showMetric}
        onCopyResults={copyResults}
        onExportCsv={exportCsv}
        copyStatus={copyStatus}
      />

      <ExamplePanel />
    </div>
  );
}
