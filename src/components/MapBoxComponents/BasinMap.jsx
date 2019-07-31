import React, { Component } from 'react';
import MapGL, { Marker, Popup } from 'react-map-gl';
import PlaceInfo from './PlaceInfo';
import PlaceMarker from './PlaceMarker';
import PLACES from '../../utils/static-reference/mapPlaces';

import { fromJS } from 'immutable';

const TOKEN = 'pk.eyJ1IjoicmljYXJkb3JoZWVkZXIiLCJhIjoiY2p4MGl5bWIyMDE1bDN5b2NneHh5djJ2biJ9.3ALfBtMIORYFNtXU9RUUnA';

// import { defaultMapStyle, highlightLayerIndex } from './map-style.jsx';

import defaultMapStyle from './map-style.jsx';


let basinArray = ['bow-river', 'noth-saskatchewan-river'];

let curHover = ''
let prevHover = ''

export default class BasinMap extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mapStyle: _.cloneDeep(defaultMapStyle),
            viewport: {
                width: 400,
                height: 400,
                latitude: 51.40,
                longitude: -110.75,
                zoom: 5.5
            },
            popupInfo: null,
            hoverInfo: null

        };
        this.renderPlaceMarker = this.renderPlaceMarker.bind(this);
        this.renderPopup = this.renderPopup.bind(this);
        this._onHover = this._onHover.bind(this);
    }

    _onHover = event => {

        //  immutable code sequence
        //  if a is the object  
        //  layers = mapStyle.get('layers')
        //  basinNameId = basin.layer.id;

        //  basinLayerIndex =layers.findIndex((l)=>{
        //     return l.toObject().id == basinNameId
        //     })
        let { mapStyle } = this.state;

    
        // let countyName = '';
        let hoverInfo = null;
        const basin = event.features && event.features.find(f => basinArray.indexOf(f.layer.id) > -1);

        // If hovering over a basin
        if (basin) {
            let basinNameId = basin.layer.id;   // Store basin name as ID

            curHover = basinNameId  // store basin ID as current hover

            // Check that we are not still hovering over same basin ()
            if (prevHover != curHover){
                // console.log("test")
                hoverInfo = {
                    lngLat: event.lngLat,
                    basinName: basin.layer.id.split("-").join(" ")
                };
    
                mapStyle.layers[40].paint['fill-color'] = 'red';
            }

            // let a = fromJS(mapStyle)
            // let layers = a.get('layers')

        }

        else {
            curHover = ''   // Currently hovering nothing
            mapStyle.layers[40].paint['fill-color'] = defaultMapStyle.layers[40].paint['fill-color'];   // Set paint back to normal
        }

        // If the current hover has changed 
        // OR
        // We have hovered off of a basin
        if ((curHover != prevHover) || (curHover == '' && basinArray.indexOf(prevHover) > -1)){
            prevHover = curHover    // Set previous hover to what was previously hovered
            this.setState({
                // mapStyle: defaultMapStyle.setIn(['layers', highlightLayerIndex, 'filter', 2], countyName),
                mapStyle
                // hoverInfo
            });
        }

    };

    renderPlaceMarker(place, index) {
        return (
            <Marker key={`marker-${index}`} longitude={place.longitude} latitude={place.latitude}>
                <PlaceMarker size={20} onClick={() => {
                    this.props.onRegionSelect({ 'target': place })
                    // set the popup info for the current place marker
                    this.setState({ popupInfo: place })
                }} />
            </Marker>
        );
    };

    renderPopup() {
        const { popupInfo, hoverInfo } = this.state;
        if (hoverInfo) {
            console.log("Hover Info:")
            console.log(hoverInfo)
            return (
                <Popup longitude={hoverInfo.lngLat[0]} latitude={hoverInfo.lngLat[1]} closeButton={false}>
                    <div className="county-info">{hoverInfo.basinName}</div>
                </Popup>
            );
        }
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


    render() {

        let { viewport, mapStyle } = this.state, { width } = this.props;

        // set the viewports for the map
        viewport.width = width;
        viewport.height = width / 2.5;

        console.log('render');

        // debugger;

        //Darktheme:  mapStyle={'mapbox://styles/ricardorheeder/cjx2a9u8b3bi41cqtk3n66h0i'}
        //Lighttheme: mapbox://styles/ricardorheeder/cjy67he431dft1cmldbiuecro

        return (
            <div>
                <MapGL
                    mapStyle={fromJS(mapStyle)}
                    mapboxApiAccessToken={TOKEN}
                    {...viewport}
                    onViewportChange={(viewport) => this.setState({ viewport })}
                    onHover={this._onHover}
                >
                    {/* {PLACES.map(this.renderPlaceMarker)} */}
                    {/* {this.renderPopup()} */}

                </MapGL>
            </div>
        );
    }
}