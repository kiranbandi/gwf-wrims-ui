import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import attachZoom from '../utils/attachZoom';
import { tubeMap } from '../utils/tubeMap';


class TubeMap extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

        var map = tubeMap()

        d3.json("/assets/files/rivers-corrected.json").then(function (data) {
            d3.select('#tube-map').datum(data).call(map);
            attachZoom('tube-map');
        });

    }

    render() {
        return (
            <div id='tube-map' style={{ width: 1200, height: 800 }}>
            </div>
        );
    }
}

export default connect(null, null)(TubeMap);