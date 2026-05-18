import { DatumCalculator } from './components/DatumCalculator';

export default function App() {
  return (
    <main className="app-shell">
      <section className="page-header" aria-labelledby="app-title">
        <div>
          <p className="eyebrow">Coastal field calculator</p>
          <h1 id="app-title">MLG ↔ NAVD88 Datum Converter</h1>
          <p className="subtitle">
            Compare Corps MLG elevations against RTK GNSS NAVD88 field measurements.
          </p>
        </div>
        <div className="datum-rail" aria-label="Datum relationship sketch">
          <div className="rail-line rail-line--mlg">
            <span>MLG</span>
          </div>
          <div className="rail-line rail-line--mllw">
            <span>MLLW</span>
          </div>
          <div className="rail-line rail-line--navd">
            <span>NAVD88</span>
          </div>
        </div>
      </section>

      <DatumCalculator />
    </main>
  );
}
