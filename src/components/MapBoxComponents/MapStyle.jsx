import { fromJS } from 'immutable';
import MAP_STYLE from '../../../build/assets/files/mapbox-advanced.json';

// Make a copy of the map style to export for use
const defaultMapStyle = {
  ...MAP_STYLE,
  sources: { ...MAP_STYLE.sources },  // Gets the sources from the MapBox-provided json
  layers: MAP_STYLE.layers.slice()  // Gets the layers from the MapBox-provided json
};

export default fromJS(defaultMapStyle);
