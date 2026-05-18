type UnitToggleProps = {
  showMetric: boolean;
  onChange: (showMetric: boolean) => void;
};

export function UnitToggle({ showMetric, onChange }: UnitToggleProps) {
  return (
    <fieldset className="segmented-control">
      <legend>Unit display</legend>
      <button
        type="button"
        className={!showMetric ? 'is-active' : ''}
        aria-pressed={!showMetric}
        onClick={() => onChange(false)}
      >
        Feet only
      </button>
      <button
        type="button"
        className={showMetric ? 'is-active' : ''}
        aria-pressed={showMetric}
        onClick={() => onChange(true)}
      >
        Feet and meters
      </button>
    </fieldset>
  );
}
