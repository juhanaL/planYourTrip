import { MapContainer, TileLayer } from 'react-leaflet';
import SelectionMarker from './SelectionMarker';

import '../styles/SelectionMap.css';

type Coords = {
  lat: number;
  lng: number;
};

interface Props {
  initCoords: Coords;
  setCoords: (coords: Coords) => void;
  changeWeather: (coords: Coords) => void;
  coords: Coords | null;
}

const SelectionMap = ({ initCoords, setCoords, changeWeather, coords }: Props) => {
  return (
    <MapContainer center={initCoords} zoom={4} scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {coords && (
        <SelectionMarker setCoords={setCoords} changeWeather={changeWeather} coords={coords} />
      )}
    </MapContainer>
  );
};

export default SelectionMap;
