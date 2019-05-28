import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

class Markers extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const { markers = [], xScale, yScale } = this.props;

        const markerSizeScale = (xScale(1) - xScale(0)) / 60;

        const markerList = _.map(markers, (marker, index) => {

            const { name, coords, id, type = "agri" } = marker;

            return (
                <g key={'marker-' + index} className='river-marker'
                    transform={"translate(" + xScale(coords[0]) + "," + yScale(coords[1]) + ") scale(" + (markerSizeScale) + ")"}>
                    <circle
                        cx='150' cy='150' r='200'
                        className={'type-' + type}>
                    </circle>
                    <text x={name.length > 2 ? 10 : 75} y={210} fontSize='175px'>
                        {name}
                    </text>
                </g>)
        });

        return (<g className='river-marker-container' > {markerList}</g>)
    }
}

export default connect(null, null)(Markers);