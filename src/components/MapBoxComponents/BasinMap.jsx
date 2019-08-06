import React, { Component } from 'react';
import MapGL, { Marker, Popup, FlyToInterpolator } from 'react-map-gl';
import PlaceInfo from './PlaceInfo';
import PlaceMarker from './PlaceMarker';
import PLACES from '../../utils/static-reference/mapPlaces';

import { fromJS } from 'immutable';

const TOKEN = 'pk.eyJ1IjoicmljYXJkb3JoZWVkZXIiLCJhIjoiY2p4MGl5bWIyMDE1bDN5b2NneHh5djJ2biJ9.3ALfBtMIORYFNtXU9RUUnA';

import defaultMapStyle from './map-style.jsx';


let basinArray = [
    'AB-South-Saskatchewan-River',
    'SK-South-Saskatchewan-River-Upstream',
    'SK-South-Saskatchewan-River-Downstream',
    'Reddeer-River',
    'Oldman-River',
    'SK-North-Saskatchewan-River',
    'AB-North-Saskatchewan-River',
    'Bow-River',
    'Highwood'
];

const highlightColor = "hsl(0, 36%, 71%)"
let curHover = ''
let prevHover = ''
let basinLayerIndex = null

let basinBorderLayerIndex = ''
let basinPrevBorderLayerIndex = ''
let editedMapStyle = null;
let currentBorderName = ''

export default class BasinMap extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // mapStyle: _.cloneDeep(defaultMapStyle),
            mapStyle: defaultMapStyle,
            viewport: {
                width: 400,
                height: 400,
                latitude: 52.25,
                longitude: -110.75,
                zoom: 5.1
            },
            popupInfo: null,
            hoverInfo: null,
            mapSelectedBorder: defaultMapStyle
        };

        this.renderPlaceMarker = this.renderPlaceMarker.bind(this);
        this.renderPopup = this.renderPopup.bind(this);
        this.renderHoverPopup = this.renderHoverPopup.bind(this);
        this._onHover = this._onHover.bind(this);
        this._onClick = this._onClick.bind(this);
    }

    _onHover = event => {
        let hoverInfo = null;
        const basin = event.features && event.features.find(f => basinArray.indexOf(f.layer.id) > -1);

        // console.log(event.lngLat)

        // If hovering over a basin
        if (basin) {

            if (currentBorderName != curHover ){
                // reset hoverInfo so that it re-renders to mouse cursor
                hoverInfo = {
                    lngLat: event.lngLat,
                    basinName: basin.layer.id.split("-").join(" ")
                };
                this.setState({ hoverInfo })
            }
            if (currentBorderName == curHover){
                hoverInfo = null;
                this.setState({ hoverInfo })

            }


            let basinNameId = basin.layer.id;   // Store basin name as ID

            curHover = basinNameId  // store basin ID as current hover
            // Check that we are not still hovering over same basin ()
            if (prevHover != curHover) {
                // Hovering over new basin - make changes

                // let mapObjectFromImmutable = fromJS(mapStyle)
                let layers = defaultMapStyle.get('layers')
                let basinNameId = basin.layer.id;
                basinLayerIndex = layers.findIndex((l) => {
                    return l.toObject().id == basinNameId
                })

            }
        }

        else {
            curHover = ''   // Currently hovering nothing
            if (basinLayerIndex != null) {
                // mapStyle.layers[basinLayerIndex].paint['fill-color'] = defaultMapStyle.layers[basinLayerIndex].paint['fill-color'];  

            }
        }

        // If the current hover has changed 
        // OR
        // We have hovered off of a basin
        if ((curHover != prevHover) || (curHover == '' && basinArray.indexOf(prevHover) > -1)) {
            prevHover = curHover    // Set previous hover to what was previously hovered

            if (curHover == '') {
                hoverInfo = ''

                editedMapStyle = defaultMapStyle

                // Border companion basin
                if (basinBorderLayerIndex != ''){
                    editedMapStyle = this.borderBasin(editedMapStyle, basinBorderLayerIndex, currentBorderName)
                }

                this.setState({
                    mapStyle: editedMapStyle,
                    hoverInfo
                })
            } else {
                editedMapStyle = defaultMapStyle   // reset the map edits

                // Highlight current basin(s)
                editedMapStyle = this.highlightBasin(editedMapStyle, basinLayerIndex, curHover)

                // Border the current basin(s)
                if (basinBorderLayerIndex != ''){
                    editedMapStyle = this.borderBasin(editedMapStyle, basinBorderLayerIndex, currentBorderName)
                }


                this.setState({
                    mapStyle: editedMapStyle,
                    hoverInfo
                });
            }
        }

    };

    // Handling clicks on the map and where to redirect users
    _onClick = event => {

        // EXAMPLE OF HOW TO CHANGE VIEWPORT IN 'onClick'
        // let { viewport } = this.state
        // viewport.zoom = 10  
        let hoverInfo = null;
        this.setState({ hoverInfo })

        let place = null;
        if (curHover == '') { return }  // If not hovering over anything, don't do anything

        // Get index of the current basin's border
        let layers = defaultMapStyle.get('layers')
        basinBorderLayerIndex = layers.findIndex((l) => {
            return l.toObject().id == (curHover + '-Border')
        })

        if (basinPrevBorderLayerIndex != ''){
            editedMapStyle = this.unborderBasin(editedMapStyle, basinPrevBorderLayerIndex, currentBorderName)
        }

        basinPrevBorderLayerIndex = basinBorderLayerIndex   // Store the previous border index
        currentBorderName = curHover    // Store current basin-border's name

        // Apply border, repaint current basin
        editedMapStyle = this.borderBasin(editedMapStyle, basinBorderLayerIndex, currentBorderName)
        editedMapStyle = editedMapStyle.setIn(['layers', basinLayerIndex, 'paint', 'fill-color'], highlightColor)

        this.setState({
            mapStyle: editedMapStyle
        });

        // Get information for the Info-Card pop-up
        if (curHover == 'SK-South-Saskatchewan-River-Upstream' || curHover == 'SK-South-Saskatchewan-River-Downstream') {
            place = PLACES[0]
            this._goToViewport(place)
            this.props.onRegionSelect({ 'target': place })
        }
        else if (curHover == 'Highwood') {
            place = PLACES[1]
            this._goToViewport(place)
            this.props.onRegionSelect({ 'target': place })
        }
        else if (curHover == 'Reddeer-River') {
            place = PLACES[2]
            this._goToViewport(place)
            // this.props.onRegionSelect({ 'target': place })
        }
        else if (curHover == 'SK-North-Saskatchewan-River' || curHover == 'AB-North-Saskatchewan-River') {
            place = PLACES[3]
            this._goToViewport(place)
            // this.props.onRegionSelect({ 'target': place })
        }
        else if (curHover == 'Bow-River') {
            place = PLACES[4]
            this._goToViewport(place)
            // this.props.onRegionSelect({ 'target': place })
        }
        else if (curHover == 'Oldman-River') {
            place = PLACES[5]
            this._goToViewport(place)
            // this.props.onRegionSelect({ 'target': place })
        }
        else if (curHover == 'AB-South-Saskatchewan-River') {
            place = PLACES[6]
            this._goToViewport(place)
            // this.props.onRegionSelect({ 'target': place })
        }
        
        if (place != null) {
            // set the popup info for the current place marker
            this.setState({ popupInfo: place }) // viewport
        }
    };

    highlightBasin(mapToEdit, basinHighlightIndex, basinHighlightName){

        if (basinHighlightName == 'SK-South-Saskatchewan-River-Upstream' || basinHighlightName == 'SK-South-Saskatchewan-River-Downstream') {
            if (basinHighlightName == 'SK-South-Saskatchewan-River-Upstream') {
                mapToEdit = mapToEdit.setIn(['layers', basinHighlightIndex + 1, 'paint', 'fill-color'], highlightColor)
            }
            else if (basinHighlightName == 'SK-South-Saskatchewan-River-Downstream') {
                mapToEdit = mapToEdit.setIn(['layers', basinHighlightIndex - 1, 'paint', 'fill-color'], highlightColor)
            }
        }

        else if (basinHighlightName == 'SK-North-Saskatchewan-River' || basinHighlightName == 'AB-North-Saskatchewan-River') {
            if (basinHighlightName == 'SK-North-Saskatchewan-River') {
                mapToEdit = mapToEdit.setIn(['layers', basinHighlightIndex + 1, 'paint', 'fill-color'], highlightColor)
            }
            else if (basinHighlightName == 'AB-North-Saskatchewan-River') {
                mapToEdit = mapToEdit.setIn(['layers', basinHighlightIndex - 1, 'paint', 'fill-color'], highlightColor)
            }
        }

        mapToEdit = mapToEdit.setIn(['layers', basinLayerIndex, 'paint', 'fill-color'], highlightColor)

        return mapToEdit
    }

    borderBasin(mapToEdit, basinBorderIndex, basinBorderName){

        if (basinBorderName == 'SK-South-Saskatchewan-River-Upstream' || basinBorderName == 'SK-South-Saskatchewan-River-Downstream') {
            if (basinBorderName == 'SK-South-Saskatchewan-River-Upstream') {
                mapToEdit = mapToEdit.setIn(['layers', basinBorderIndex + 1, 'layout', 'visibility'], "visible")
            }
            else if (basinBorderName == 'SK-South-Saskatchewan-River-Downstream') {
                mapToEdit = mapToEdit.setIn(['layers', basinBorderIndex - 1, 'layout', 'visibility'], "visible")
            }
        }
        
        else if (basinBorderName == 'SK-North-Saskatchewan-River' || basinBorderName == 'AB-North-Saskatchewan-River') {
            if (basinBorderName == 'SK-North-Saskatchewan-River') {
                mapToEdit = mapToEdit.setIn(['layers', basinBorderIndex + 1, 'layout', 'visibility'], "visible")
            }
            else if (basinBorderName == 'AB-North-Saskatchewan-River') {
                mapToEdit = mapToEdit.setIn(['layers', basinBorderIndex - 1, 'layout', 'visibility'], "visible")
            }
        }
        mapToEdit = mapToEdit.setIn(['layers', basinBorderIndex, 'layout', 'visibility'], "visible")

        return mapToEdit
    }

    unborderBasin(mapToEdit, basinBorderIndex, basinBorderName){

        if (basinBorderName == 'SK-South-Saskatchewan-River-Upstream' || basinBorderName == 'SK-South-Saskatchewan-River-Downstream') {
            if (basinBorderName == 'SK-South-Saskatchewan-River-Upstream') {
                mapToEdit = mapToEdit.setIn(['layers', basinBorderIndex + 1, 'layout', 'visibility'], "none")
            }
            else if (basinBorderName == 'SK-South-Saskatchewan-River-Downstream') {
                mapToEdit = mapToEdit.setIn(['layers', basinBorderIndex - 1, 'layout', 'visibility'], "none")
            }
        }
        
        else if (basinBorderName == 'SK-North-Saskatchewan-River' || basinBorderName == 'AB-North-Saskatchewan-River') {
            if (basinBorderName == 'SK-North-Saskatchewan-River') {
                mapToEdit = mapToEdit.setIn(['layers', basinBorderIndex + 1, 'layout', 'visibility'], "none")
            }
            else if (basinBorderName == 'AB-North-Saskatchewan-River') {
                mapToEdit = mapToEdit.setIn(['layers', basinBorderIndex - 1, 'layout', 'visibility'], "none")
            }
        }
        mapToEdit = mapToEdit.setIn(['layers', basinBorderIndex, 'layout', 'visibility'], "none")

        return mapToEdit
    }

    renderPlaceMarker(place, index) {
        return (
            <Marker key={`marker-${index}`} longitude={place.longitude} latitude={place.latitude}>
                <PlaceMarker size={20} onClick={() => {
                    // console.log(place)
                    this.props.onRegionSelect({ 'target': place })
                    // set the popup info for the current place marker
                    this.setState({ popupInfo: place })
                }} />
            </Marker>
        );
    };

    renderPopup() {
        const { popupInfo } = this.state;

        if (popupInfo) {
            return (
                popupInfo && (
                    <Popup
                        tipSize={5}
                        anchor="left"
                        longitude={popupInfo.longitude}
                        latitude={popupInfo.latitude}
                        closeOnClick={false}
                        onClose={() => this.setState({ popupInfo: null })}>
                        <PlaceInfo info={popupInfo} />
                    </Popup>
                )
            );
        }
        return null;
    }

    renderHoverPopup() {
        const { hoverInfo } = this.state;
        if (hoverInfo) {
            // console.log("Hover Info:")
            // console.log(hoverInfo)
            return (
                <Popup longitude={hoverInfo.lngLat[0]} latitude={hoverInfo.lngLat[1]} closeButton={false}>
                    <div className="basin-info">{hoverInfo.basinName}</div>
                </Popup>
            );
        }
        return null;
    }

    _onViewportChange = viewport =>
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });

    _goToViewport = ({longitude, latitude, zoom}) => {
        this._onViewportChange({
          longitude,
          latitude,
          zoom,
          transitionInterpolator: new FlyToInterpolator(),
          transitionDuration: 1500
        });
      };

    render() {

        let { viewport, mapStyle } = this.state, { width } = this.props;

        // set the viewports for the map
        viewport.width = width;
        viewport.height = width / 2.5;

        // console.log('render');

        return (
            <div>
                <MapGL
                    mapStyle={fromJS(mapStyle)}
                    mapboxApiAccessToken={TOKEN}
                    {...viewport}

                    onViewportChange={this._onViewportChange}

                    // onViewportChange={(viewport) => this.setState({ viewport })}
                    onHover={this._onHover}
                    onClick={this._onClick}
                >
                    {/* {PLACES.map(this.renderPlaceMarker)} */}
                    {this.renderPopup()}
                    {this.renderHoverPopup()}

                </MapGL>
            </div>
        );
    }
}
