import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as d3 from 'd3';
import attachZoom from '../utils/attachZoom';
import { tubeMap } from '../utils/tubeMap';

class DashboardRoot extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

        var width = 1200;
        var height = 800;

        var container = d3.select('#tube-map')
            .style('width', width + 'px')
            .style('height', height + 'px');

        var map = tubeMap()

        d3.json("/assets/files/sample.json").then(function (data) {
            container.datum(data).call(map);
            attachZoom('tube-map');

        });

    }

    render() {
        return (
            <div className='dashboard-page-root' >
                <div id='tube-map'>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({}, dispatch)
    };
}


export default connect(null, mapDispatchToProps)(DashboardRoot);



