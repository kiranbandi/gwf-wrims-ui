import React, { Component } from 'react';
import MapGL, { Marker, Popup } from 'react-map-gl';
import PlaceInfo from './PlaceInfo';
import PlaceMarker from './PlaceMarker';
import PLACES from '../../utils/mapPlaces';

const TOKEN = 'pk.eyJ1IjoicmljYXJkb3JoZWVkZXIiLCJhIjoiY2p4MGl5bWIyMDE1bDN5b2NneHh5djJ2biJ9.3ALfBtMIORYFNtXU9RUUnA';

export default class BasinMap extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewport: {
                width: 400,
                height: 400,
                latitude: 51.40,
                longitude: -110.75,
                zoom: 5.5
            },
            popupInfo: null

        };
        this.renderPlaceMarker = this.renderPlaceMarker.bind(this);
        this.renderPopup = this.renderPopup.bind(this);
    }

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
        const { popupInfo } = this.state;
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


    render() {

        let { viewport } = this.state, { width } = this.props;

        // set the viewports for the map
        viewport.width = width;
        viewport.height = width / 2.5;

        //Darktheme:  mapStyle={'mapbox://styles/ricardorheeder/cjx2a9u8b3bi41cqtk3n66h0i'}
        //Lighttheme:  mapStyle={'mapbox://styles/ricardorheeder/cjx0jhl3106nf1cpefuocmvf1'}

        return (
            <div>
                <MapGL
                    mapStyle={'mapbox://styles/ricardorheeder/cjx0jhl3106nf1cpefuocmvf1'}
                    mapboxApiAccessToken={TOKEN}
                    {...viewport}
                    onViewportChange={(viewport) => this.setState({ viewport })} >
                    {PLACES.map(this.renderPlaceMarker)}
                    {this.renderPopup()}
                </MapGL>
            </div>
        );
    }
}