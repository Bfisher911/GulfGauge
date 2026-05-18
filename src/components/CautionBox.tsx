export function CautionBox() {
  return (
    <aside className="caution-box" aria-label="Datum caution">
      <strong>Datum caution</strong>
      <p>
        MLG is spatially variable. This calculator only works when the station offsets match
        the project location or reach. Do not apply one offset across the entire Gulf unless
        the datum documentation supports it.
      </p>
    </aside>
  );
}
