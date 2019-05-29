import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getPathData } from '../../utils/requestServer';
import { setFlowData } from '../../redux/actions/actions';
import { bindActionCreators } from 'redux';

class Markers extends Component {

    constructor(props) {
        super(props);
        this.onMarkerClick = this.onMarkerClick.bind(this);
    }

    onMarkerClick(marker) {
        const { id = false } = marker,
            { fileCatalogInfo, actions } = this.props;

        let pathIndex, path;
        // if the id is valid and in the catalog file then
        //  pull its data from the server
        if (id) {
            pathIndex = _.findIndex(fileCatalogInfo, (d) => d.b == id);
            if (pathIndex > -1) {
                path = fileCatalogInfo[pathIndex];
                getPathData(path)
                    .then((data) => {
                        var dataByLine = data.split("\n");
                        var dataList = [];
                        _.map(dataByLine, (d, i) => {

                            if (i == 0) {
                                d = d.slice(1);
                            }
                            else if (i == (dataByLine.length - 1)) {
                                d = d.slice(0, -1)
                            }
                            dataList = dataList.concat(d.split(/\s+/));
                        })
                        dataList = _.map(dataList, (d) => Number(d));
                        //    make a call to redux action here 
                        actions.setFlowData(dataList);
                    })
                    .catch((error) => {
                        alert('error fetching data');
                    })
            }
        }
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
                        // probably the worst way to do this but im on a deadline so sue me !!
                        onDoubleClick={this.onMarkerClick.bind(this, marker)}
                        cx='150' cy='150' r='200'
                        className={'type-' + type}>
                    </circle>
                    <text
                        onDoubleClick={this.onMarkerClick.bind(this, marker)}
                        x={name.length > 2 ? 10 : 75} y={210} fontSize='175px'>
                        {name}
                    </text>
                </g>)
        });

        return (<g className='river-marker-container' > {markerList}</g>)
    }
}


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ setFlowData }, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Markers);