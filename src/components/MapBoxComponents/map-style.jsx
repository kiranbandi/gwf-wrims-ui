import {fromJS} from 'immutable';
import MAP_STYLE from '../../../build/assets/files/mapBoxStyle.json';

// Make a copy of the map style
const mapStyle = {
    ...MAP_STYLE,
    sources: {...MAP_STYLE.sources},
    layers: MAP_STYLE.layers.slice()
  };

  
// Add the geojson files for basins
mapStyle.sources.basins = {
    type: 'vector',
    url: 'mapbox://mapbox.82pkq93d'
    // type: 'geojson',
    // data: '../../../build/assets/files/HighwoodESPG4269.geojson'
  };
  
  // Insert custom layers before mountain detail
  mapStyle.layers.splice(
    mapStyle.layers.findIndex(layer => layer.id === 'MountainDetail'),
    0,
    // Basin polygons
    {
      id: 'basins',
      interactive: true,
      type: 'fill',
      source: 'basins',
      'source-layer': 'original',
      paint: {
        'fill-outline-color': 'rgba(0,0,0,0.1)',
        'fill-color': 'rgba(0,0,0,0.1)'
      }
    },
    // Highlighted basin polygons
    {
      id: 'basins-highlighted',
      type: 'fill',
      source: 'basins',
      'source-layer': 'original',
      paint: {
        'fill-outline-color': '#484896',
        'fill-color': '#6e599f',
        'fill-opacity': 0.75
      },
      filter: ['in', 'BASIN', '']
    }
  );
//   console.log(mapStyle)

  export const highlightLayerIndex = mapStyle.layers.findIndex(
    layer => layer.id === 'basins-highlighted'
  );
  
  export const defaultMapStyle = fromJS(mapStyle);