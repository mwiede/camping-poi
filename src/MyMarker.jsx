import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
function MyMarker(mark, fillColor) {

  var myIcon = new L.Icon.Default();
  myIcon.options.imagePath = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/';
  myIcon.options.iconUrl = 'marker-icon-' + fillColor + '.png';
  myIcon.options.iconRetinaUrl = 'marker-icon-2x-' + fillColor + '.png';

  const openPositionInNativeApp = (geocoords, label) => {
    if (window.navigator.appVersion.indexOf('Mac') !== -1) {
      window.open('maps://?q=' + geocoords, '_system');
    }
    else {
      window.open('geo:0,0?q=' + geocoords + '(' + encodeURI(label) + ')', '_system');
    }
  };

  return <Marker
    key={mark.id}
    position={[
      mark.latitude,
      mark.longitude
    ]}
    icon={myIcon}
  >
    <Popup>
      {mark.code} - {mark.titre} <br /> {mark.description_de}
      <br />
      <button onClick={() => openPositionInNativeApp(mark.latitude + ',' + mark.longitude, mark.titre)}>Nav</button>
    </Popup>
  </Marker>;
}
export default MyMarker;