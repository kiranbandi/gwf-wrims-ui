import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getPathData } from '../../utils/requestServer';
import { setFlowData } from '../../redux/actions/actions';
import { bindActionCreators } from 'redux';
import processFlowData from '../../utils/processFlowData';

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
                // clear data and set is loading to false
                actions.setFlowData({ dataList: [], path, isLoading: true });
                getPathData(path)
                    .then((data) => {
                        actions.setFlowData({ dataList: processFlowData(data), path, isLoading: false });
                    })
                    .catch((error) => {
                        alert('error fetching data');
                        actions.setFlowData({ dataList: [], path, isLoading: false });
                    })
            }
            else {
                // if no id found set text to no data found 
                actions.setFlowData({ dataList: [], path, isLoading: false });
            }
        }
        else {
            // if no id found set text to no data found 
            actions.setFlowData({ dataList: [], path, isLoading: false });
        }
    }

    render() {

        const { markers = [], xScale, yScale } = this.props,
            markerSizeScale = (xScale(1) - xScale(0)) / 60;

        const markerList = _.map(markers, (marker, index) => {
            const { name, coords, type = "agri" } = marker;
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

        return (<g className='river-marker-container'>{markerList}</g>)
    }
}


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ setFlowData }, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Markers);