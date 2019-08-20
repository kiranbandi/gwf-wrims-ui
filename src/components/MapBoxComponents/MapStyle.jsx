import { fromJS } from 'immutable';
import MAP_STYLE from '../../../build/assets/files/mapBoxStyle.json';

// Make a copy of the map style
const defaultMapStyle = {
  ...MAP_STYLE,
  sources: { ...MAP_STYLE.sources },
  layers: MAP_STYLE.layers.slice()
};

export default fromJS(defaultMapStyle);
