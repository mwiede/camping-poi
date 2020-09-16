import { Component } from "react";
import { withLeaflet } from "react-leaflet";
import Locate from "leaflet.locatecontrol";

import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css';

class LocateControl extends Component {
  componentDidMount() {
    const { options, startDirectly } = this.props;
    const { map } = this.props.leaflet;

    const lc = new Locate(options);
    lc.addTo(map);

    if (startDirectly) {
      // request location update and set location
      lc.start();
    }
  }

  render() {
    return null;
  }
}

export default withLeaflet(LocateControl);