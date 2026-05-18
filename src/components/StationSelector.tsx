import { CUSTOM_STATION_ID } from '../data/stations';
import type { Station } from '../types';

type StationSelectorProps = {
  stations: Station[];
  selectedStationId: string;
  onStationChange: (stationId: string) => void;
};

export function StationSelector({
  stations,
  selectedStationId,
  onStationChange,
}: StationSelectorProps) {
  return (
    <label className="field">
      <span>Station preset</span>
      <select
        value={selectedStationId}
        onChange={(event) => onStationChange(event.target.value)}
      >
        {stations.map((station) => (
          <option key={station.id} value={station.id}>
            {station.name}
          </option>
        ))}
        <option value={CUSTOM_STATION_ID}>Custom station</option>
      </select>
    </label>
  );
}
