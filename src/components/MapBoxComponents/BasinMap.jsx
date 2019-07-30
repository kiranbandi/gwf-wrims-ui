import React, { Component } from 'react';
import MapGL, { Marker, Popup } from 'react-map-gl';
import PlaceInfo from './PlaceInfo';
import PlaceMarker from './PlaceMarker';
import PLACES from '../../utils/static-reference/mapPlaces';

const TOKEN = 'pk.eyJ1IjoicmljYXJkb3JoZWVkZXIiLCJhIjoiY2p4MGl5bWIyMDE1bDN5b2NneHh5djJ2biJ9.3ALfBtMIORYFNtXU9RUUnA';

import { defaultMapStyle, highlightLayerIndex } from './map-style.jsx';

export default class BasinMap extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mapStyle: defaultMapStyle,
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
    }

    _onHover = event => {
        let countyName = '';
        let hoverInfo = null;

        const county = event.features && event.features.find(f => f.layer.id === 'ab-bow-9oizy4'); //ab-bow-9oizy4
        // console.log(event)
        if (county) {
            hoverInfo = {
                lngLat: event.lngLat,
                county: county.properties
            };
            // console.log(basin.properties)
            countyName = county.properties.COUNTY;
            console.log(county)
        }
        this.setState({
            mapStyle: defaultMapStyle.setIn(['layers', highlightLayerIndex, 'filter', 2], countyName),
            hoverInfo
        });
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
            return (
                <Popup longitude={hoverInfo.lngLat[0]} latitude={hoverInfo.lngLat[1]} closeButton={false}>
                    <div className="county-info">{hoverInfo.county.COUNTY}</div>
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

        //Darktheme:  mapStyle={'mapbox://styles/ricardorheeder/cjx2a9u8b3bi41cqtk3n66h0i'}
        //Lighttheme: mapbox://styles/ricardorheeder/cjy67he431dft1cmldbiuecro

        return (
            <div>
                <MapGL
                    mapStyle={mapStyle}
                    mapboxApiAccessToken={TOKEN}
                    {...viewport}
                    onViewportChange={(viewport) => this.setState({ viewport })}
                    onHover={this._onHover}
                >
                    {PLACES.map(this.renderPlaceMarker)}
                    {this.renderPopup()}

                </MapGL>
            </div>
        );
    }
}