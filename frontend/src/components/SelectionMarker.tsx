import { LatLng } from 'leaflet';
import { Marker, useMapEvents } from 'react-leaflet';

type Coords = {
  lat: number;
  lng: number;
};

interface Props {
  setCoords: (coords: Coords) => void;
  changeWeather: (coords: Coords) => void;
  coords: Coords;
}

const SelectionMarker = ({ setCoords, changeWeather, coords }: Props) => {
  const map = useMapEvents({
    click(e) {
      if (e.latlng instanceof LatLng) {
        setCoords(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
        changeWeather(e.latlng);
      }
    },
  });

  return <Marker position={coords} />;
};

export default SelectionMarker;
