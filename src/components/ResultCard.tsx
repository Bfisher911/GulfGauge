import {
  feetToMeters,
  formatNumber,
} from '../lib/calculations';
import { CautionBox } from './CautionBox';

type ResultCardProps = {
  totalOffsetFt: number | null;
  corpsNavd88Ft: number | null;
  rtkNavd88Ft: number | null;
  differenceFt: number | null;
  showMetric: boolean;
  onCopyResults: () => void;
  onExportCsv: () => void;
  copyStatus: string;
};

function formatMeasurement(valueFt: number | null, showMetric: boolean): string {
  if (valueFt === null) {
    return 'Waiting for inputs';
  }

  const feetText = `${formatNumber(valueFt)} ft`;
  const meterText = `${formatNumber(feetToMeters(valueFt), 3)} m`;

  return showMetric ? `${feetText} / ${meterText}` : feetText;
}

function getInterpretation(differenceFt: number | null, showMetric: boolean): string {
  if (differenceFt === null) {
    return 'Enter enough valid values to compare RTK against the converted Corps elevation.';
  }

  const absoluteDifference = Math.abs(differenceFt);
  const measurement = formatMeasurement(absoluteDifference, showMetric);

  if (absoluteDifference <= 0.05) {
    return 'RTK is approximately equal to the converted Corps elevation.';
  }

  if (differenceFt > 0) {
    return `RTK is ${measurement} above the converted Corps elevation.`;
  }

  return `RTK is ${measurement} below the converted Corps elevation.`;
}

export function ResultCard({
  totalOffsetFt,
  corpsNavd88Ft,
  rtkNavd88Ft,
  differenceFt,
  showMetric,
  onCopyResults,
  onExportCsv,
  copyStatus,
}: ResultCardProps) {
  return (
    <section className="card result-card" aria-labelledby="results-heading">
      <div className="card-header">
        <div>
          <p className="section-kicker">Results</p>
          <h2 id="results-heading">Converted elevation</h2>
        </div>
        <div className="button-row">
          <button type="button" className="secondary-button" onClick={onCopyResults}>
            Copy results
          </button>
          <button type="button" className="secondary-button" onClick={onExportCsv}>
            Export CSV
          </button>
        </div>
      </div>

      <dl className="result-grid">
        <div>
          <dt>Total MLG to NAVD88 offset</dt>
          <dd>{formatMeasurement(totalOffsetFt, showMetric)}</dd>
        </div>
        <div>
          <dt>Corps elevation converted to NAVD88</dt>
          <dd>{formatMeasurement(corpsNavd88Ft, showMetric)}</dd>
        </div>
        <div>
          <dt>RTK elevation in NAVD88</dt>
          <dd>{formatMeasurement(rtkNavd88Ft, showMetric)}</dd>
        </div>
        <div>
          <dt>Difference, RTK minus Corps</dt>
          <dd>{formatMeasurement(differenceFt, showMetric)}</dd>
        </div>
      </dl>

      <p className="interpretation">{getInterpretation(differenceFt, showMetric)}</p>
      {copyStatus ? <p className="copy-status">{copyStatus}</p> : null}

      <CautionBox />
    </section>
  );
}
