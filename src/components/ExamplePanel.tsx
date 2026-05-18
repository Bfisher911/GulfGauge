export function ExamplePanel() {
  return (
    <section className="example-panel" aria-labelledby="example-heading">
      <div>
        <p className="section-kicker">Field check example</p>
        <h2 id="example-heading">4.5 ft MLG with local offsets</h2>
      </div>
      <div className="example-grid">
        <p>
          <strong>Inputs:</strong> Corps elevation 4.5 ft MLG, MLG to MLLW 3.5 ft,
          MLLW to NAVD88 0.34 ft, RTK elevation 5.0 ft NAVD88.
        </p>
        <p>
          <strong>Result:</strong> Corps elevation converted to NAVD88 is 0.66 ft.
          RTK is 4.34 ft above the converted Corps elevation.
        </p>
      </div>
    </section>
  );
}
