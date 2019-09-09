import React, { Component } from 'react';
import MapGL, { Popup, FlyToInterpolator } from 'react-map-gl';
import PLACES from '../../utils/static-reference/mapPlaces';
import { fromJS } from 'immutable';
import defaultMapStyle from './MapStyle.jsx';

const TOKEN = 'pk.eyJ1IjoicmljYXJkb3JoZWVkZXIiLCJhIjoiY2p4MGl5bWIyMDE1bDN5b2NneHh5djJ2biJ9.3ALfBtMIORYFNtXU9RUUnA';

// An array used to contain the basin names from MapStyle.jsx that are to be interacted with
let basinArray = [
    'SK-South-Saskatchewan-River',
    'Highwood',
    // 'Reddeer-River',
    'SK-North-Saskatchewan-River',
    'AB-North-Saskatchewan-River',
    'Tau-Basin',
    // 'Oldman-River',
    'Stribs-Basin'

];

const selectColor = "hsla(0, 36%, 71%, 0)" // A translucent color for basin selection

let curHover = ''
let prevHover = ''

let basinSelectedLayerIndex = null
let basinPrevSelectedLayerIndex = ''
let basinBorderLayerIndex = ''

let editedMapStyle = null;
let currentSelectedName = ''

export default class BasinMap extends Component {

    constructor(props) {
        super(props);
        this.state = {
            componentMounted: false, // Used to stop errors for the onviewportChange() method
            mapStyle: defaultMapStyle,
            viewport: {
                width: 400,
                height: 400,
                latitude: 52.25,
                longitude: -110.75,
                zoom: 5.1
            } 
        };
    }

    componentDidMount() {
        this.setState({ componentMounted: true })
    }

    componentWillUnmount() {
        this.setState({ componentMounted: false })
    }

    /**
     * Method for react-map-gl to render any changes onto the viewport
     * 
     * @viewport The current viewport used by react-map-gl
     */
    _onViewportChange = viewport => {
        this.setState({
            viewport: { ...this.state.viewport, ...viewport }
        });
    }


    render() {
        let { viewport, mapStyle } = this.state, { width } = this.props;
        const { componentMounted } = this.state

        // Set the viewports for the map
        viewport.width = width;
        viewport.height = width / 2;

        return (
            <div className="mapboxDiv">

                <MapGL
                    mapStyle={fromJS(mapStyle)}
                    mapboxApiAccessToken={TOKEN}
                    {...viewport}

                    onViewportChange={componentMounted ? this._onViewportChange : null}
                    doubleClickZoom={false}
                    dragRotate={false}
                    minZoom={2}>

                    <div className="markingMenuDiv">
                    </div>
                </MapGL>
            </div>
        );
    }
}
