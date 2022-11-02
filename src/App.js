import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import 'leaflet/dist/leaflet.css';
import { Map, TileLayer, LayersControl, FeatureGroup } from 'react-leaflet';
import LocateControl from './LocateControl'
import MyMarker from './MyMarker';

function App() {

  const initialPosition = [48.135, 11.581];

  const [roundedPosition, setRoundedPosition] = useState({ lat: initialPosition[0], lng: initialPosition[1] });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [zoom, setZoom] = useState(11);
  const [auswahl, setAuswahl] = useState('all');

  const mapRef = useRef(<Map />)

  const filteredMarkers = markers
    .filter(el => auswahl === 'all' || (auswahl === 'black' && el.eau_noire === '1') || (auswahl === 'grey' && el.eau_usee === '1'));

  console.log(auswahl + ' enthält ' + filteredMarkers.length);

  const map = mapRef.current;
  var position;
  if (map.leafletElement != null) {
    position = map.leafletElement.getCenter();
  }

  const cors_proxy = 'https://proxy.cors.sh/https://park4night.com';
  const url = cors_proxy + `/services/V4/lieuxGetFilter.php?&latitude=${roundedPosition.lat}&longitude=${roundedPosition.lng}&context_user=guest&context_os=ANDROID&context_lang=en&langue_locale=en_EN&context_latitude=${roundedPosition.lat}&context_longitude=${roundedPosition.lng}&context_version=7.0.4&context_secondlang=it&context_thirdlang=de&isMonthPremium=false&isYearPremium=false&context_id_user=guest&os=ANDROID&apikey=guest`;

  const changeMapPosition = (position) => {

    const roundedLat = Math.round((position.lat) * 10) / 10;
    const roundedLng = Math.round((position.lng) * 10) / 10;

    const diflat = Math.abs(roundedLat - roundedPosition.lat) > 0.1;
    const diflng = Math.abs(roundedLng - roundedPosition.lng) > 0.1;

    if (diflat || diflng) {
      setRoundedPosition({
        lat: roundedLat,
        lng: roundedLng,
      });
    }
  };

  const locate = (event) => {
    const map = mapRef.current;
    if (map != null) {
      map.leafletElement.locate()
    }
  };

  const centerMap = (event) => {
    const map = mapRef.current;
    if (currentLocation && map) {
      map.leafletElement.setView(currentLocation, 13);
    }
  };

  useEffect(() => {

    // fetch
    fetch(url, {
      //mode: 'no-cors',
      headers: { 'X-Requested-With': 'xyz' }
    })
      .then(response => response.json())
      .then(data => {
        setMarkers(data.lieux)
      }
      );
    // dann marker in stat ablegen

  }, [url]);

  // Setup LocateControl options
  const locateOptions = {
    position: 'topright',
    strings: {
      title: 'Show me where I am, yo!'
    },
    onActivate: () => { } // callback before engine starts retrieving locations
  }

  return (
    <>
      <Map center={initialPosition} zoom={zoom} ref={mapRef}

        onMoveend={(event) => {
          console.log(event.target.getCenter());
          changeMapPosition(event.target.getCenter());
        }}

        onzoomend={(event) => {
          setZoom(event.target.getZoom())
        }}

        onLocationfound={(event) => {
          setCurrentLocation(event.latlng);
        }}
      >


        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />

        <LayersControl position="topright" collapsed={false}>

          <LayersControl.Overlay name="Black Water Dump" checked={true}>

            <FeatureGroup color="Black" >
              {markers.filter(el => el.eau_noire === '1').map(mark => MyMarker(mark, 'black'))}
            </FeatureGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Grey Water Dump" checked={true}>
            <FeatureGroup color="Grey">
              {markers.filter(el => el.eau_usee === '1').map(mark => MyMarker(mark, 'grey'))}
            </FeatureGroup>
          </LayersControl.Overlay>

        </LayersControl>

        <LocateControl options={locateOptions} startDirectly />

      </Map>

      {false && <>
        <form>
          <label>
            <input type="radio" checked={auswahl === 'all'} onChange={(event) => { setAuswahl('all') }} /> All</label>
          <label>
            <input type="radio" checked={auswahl === 'grey'} onChange={(event) => { setAuswahl('grey') }} /> Only show Greywater</label>
          <label>
            <input type="radio" checked={auswahl === 'black'} onChange={(event) => { setAuswahl('black') }} /> Only show Blackwater</label>
        </form>

        {position && <>Position: {position.lat} - {position.lng}</>}

        <button onClick={locate}>locate</button>

        <button onClick={centerMap}>center</button>

      Zoom: {zoom}

      </>}

    </>
  );
}


export default App;

