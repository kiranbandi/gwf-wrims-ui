import { fromJS } from 'immutable';
import MAP_STYLE from '../../../build/assets/files/mapBoxStyle.json';
// type: 'geojson',
// data: '../../../build/assets/files/HighwoodESPG4269.geojson'

// Make a copy of the map style
const mapStyle = {
  ...MAP_STYLE,
  sources: { ...MAP_STYLE.sources },
  layers: MAP_STYLE.layers.slice()
};

// Add the geojson files for basins
mapStyle.sources.counties = {
  // type: 'vector',
  // url: 'mapbox://mapbox.82pkq93d'
  type: 'geojson',
  data: '../../../build/assets/files/AB_Bow.geojson'
};

// console.log(mapStyle.sources)

// Insert custom layers before mountain detail
mapStyle.layers.splice(
  mapStyle.layers.findIndex(layer => layer.id === 'MountainDetail'),
  0,
  // Basin polygons
  {
    id: 'counties',
    interactive: true,
    type: 'fill',
    source: 'counties',
    'source-layer': 'original',
    paint: {
      'fill-outline-color': 'rgba(0,0,0,0.1)',
      'fill-color': 'rgba(0,0,0,0.1)'
    }
  },
  // Highlighted basin polygons
  {
    id: 'counties-highlighted',
    type: 'fill',
    source: 'counties',
    'source-layer': 'original',
    paint: {
      'fill-outline-color': '#484896',
      'fill-color': '#6e599f',
      'fill-opacity': 0.75
    },
    filter: ['in', 'COUNTY', '']
  }
);
console.log("Mapstyle:")
console.log(mapStyle)
console.log("Sources:")
console.log(mapStyle.sources.counties.data)

export const highlightLayerIndex = mapStyle.layers.findIndex(
  layer => layer.id === 'counties-highlighted'
);

export const defaultMapStyle = fromJS(mapStyle);