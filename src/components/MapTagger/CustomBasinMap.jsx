import React, { Component } from 'react';
import MapGL, { Marker } from 'react-map-gl';
import { fromJS } from 'immutable';
import CustomMapStyle from './CustomMapStyle';
import MarkerIcon from './MarkerIcon';

const TOKEN = 'pk.eyJ1IjoicmljYXJkb3JoZWVkZXIiLCJhIjoiY2p4MGl5bWIyMDE1bDN5b2NneHh5djJ2biJ9.3ALfBtMIORYFNtXU9RUUnA';

// An array used to contain the basin names from MapStyle.jsx that are to be interacted with
let basinArray = [
    'SK-South-Saskatchewan-River',
    'Highwood',
    'SK-North-Saskatchewan-River',
    'AB-North-Saskatchewan-River',
    'Tau-Basin',
    'Stribs-Basin'

];


export default class CustomBasinMap extends Component {

    constructor(props) {
        super(props);
        this.state = {
            componentMounted: false, // Used to stop errors for the onviewportChange() method
            mapStyle: CustomMapStyle,
            viewport: {
                latitude: this.props.latitude,
                longitude: this.props.longitude,
                zoom: this.props.zoom
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

    renderMarker(nodeList) {
        return _.map(nodeList, (node, index) => {
            return <Marker key={'maker-' + index} longitude={+node.longitude} latitude={+node.latitude}>
                <MarkerIcon type={node.type} />
            </Marker>
        })
    }


    render() {
        let { viewport, mapStyle } = this.state, { width, onMapClick, currentNodes } = this.props;
        const { componentMounted } = this.state

        // Set the viewports for the map
        viewport.width = width;
        viewport.height = width / 2;


        return (
            <div className="mapboxDiv">
                <MapGL
                    className='root-map'
                    mapStyle={fromJS(mapStyle)}
                    mapboxApiAccessToken={TOKEN}
                    {...viewport}
                    onViewportChange={componentMounted ? this._onViewportChange : null}
                    onClick={onMapClick}
                    doubleClickZoom={false}
                    dragRotate={false}
                    minZoom={5}>
                    {this.renderMarker(currentNodes)}
                </MapGL>
            </div>
        );
    }
}
