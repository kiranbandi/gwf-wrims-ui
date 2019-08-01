import React, { Component } from 'react';
import MapGL, { Marker, Popup } from 'react-map-gl';
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

let curHover = ''
let prevHover = ''
let basinLayerIndex = null

export default class BasinMap extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // mapStyle: _.cloneDeep(defaultMapStyle),
            mapStyle: defaultMapStyle,
            viewport: {
                width: 400,
                height: 400,
                latitude: 51.40,
                longitude: -110.75,
                zoom: 5.5
            },
            popupInfo: null,
            hoverInfo: null,
            mapObjectFromImmutable: defaultMapStyle

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

        // If hovering over a basin
        if (basin) {

            // reset hoverInfo so that it re-renders to mouse cursor
            hoverInfo = {
                lngLat: event.lngLat,
                basinName: basin.layer.id.split("-").join(" ")
            };
            this.setState({ hoverInfo })

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

        // console.log('Current Hover: ' + curHover)
        // console.log('Previous Hover: ' + prevHover)

        // If the current hover has changed 
        // OR
        // We have hovered off of a basin
        if ((curHover != prevHover) || (curHover == '' && basinArray.indexOf(prevHover) > -1)) {
            prevHover = curHover    // Set previous hover to what was previously hovered

            if (curHover == '') {
                hoverInfo = ''
                this.setState({
                    mapStyle: defaultMapStyle,
                    hoverInfo
                })
            } else {
                let defaultMapStyleCopy = defaultMapStyle

                if (curHover == 'SK-South-Saskatchewan-River-Upstream' || curHover == 'SK-South-Saskatchewan-River-Downstream') {
                    if (curHover == 'SK-South-Saskatchewan-River-Upstream') {
                        defaultMapStyleCopy = defaultMapStyle.setIn(['layers', basinLayerIndex + 1, 'paint', 'fill-color'], "hsl(0, 36%, 71%)")
                    }
                    else if (curHover == 'SK-South-Saskatchewan-River-Downstream') {
                        defaultMapStyleCopy = defaultMapStyle.setIn(['layers', basinLayerIndex - 1, 'paint', 'fill-color'], "hsl(0, 36%, 71%)")
                    }
                }
                else if (curHover == 'SK-North-Saskatchewan-River' || curHover == 'AB-North-Saskatchewan-River') {
                    if (curHover == 'SK-North-Saskatchewan-River') {
                        defaultMapStyleCopy = defaultMapStyle.setIn(['layers', basinLayerIndex + 1, 'paint', 'fill-color'], "hsl(0, 36%, 71%)")
                    }
                    else if (curHover == 'AB-North-Saskatchewan-River') {
                        defaultMapStyleCopy = defaultMapStyle.setIn(['layers', basinLayerIndex - 1, 'paint', 'fill-color'], "hsl(0, 36%, 71%)")
                    }
                }

                this.setState({
                    mapStyle: defaultMapStyleCopy.setIn(['layers', basinLayerIndex, 'paint', 'fill-color'], "hsl(0, 36%, 71%)"),
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



        let place = null;
        // console.log(curHover)
        if (curHover == '') { return }
        if (curHover == 'SK-South-Saskatchewan-River-Upstream' || curHover == 'SK-South-Saskatchewan-River-Downstream') {
            place = PLACES[0]
            this.props.onRegionSelect({ 'target': place })
        }
        else if (curHover == 'Highwood') {
            place = PLACES[1]
            this.props.onRegionSelect({ 'target': place })
        }


        if (place != null) {
            // set the popup info for the current place marker
            this.setState({ popupInfo: place }) // viewport
        }

    };

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
                    onViewportChange={(viewport) => this.setState({ viewport })}
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