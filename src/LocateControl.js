import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import Locate from "leaflet.locatecontrol";

import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css';

const LocateControl = ({ options, startDirectly }) => {

  const map = useMap();
  const didInitRef = useRef(false);

  useEffect(() => {

    // In this case, whether we are mounting or remounting,
    // we use a ref so that we only init once.
    if (!didInitRef.current) {
      didInitRef.current = true;
      const lc = new Locate(options);
      lc.addTo(map);

      if (startDirectly) {
        // request location update and set location
        lc.start();
      }
    }
  }, [map, options, startDirectly]);

  return null;

}

export default LocateControl;