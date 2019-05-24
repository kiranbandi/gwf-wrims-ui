import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as d3 from 'd3';
import { tubeMap } from '../utils/tubeMap';

class DashboardRoot extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {


        var width = 800;
        var height = 500;

        var container = d3.select('#tube-map')
            .style('width', width + 'px')
            .style('height', height + 'px');

        var map = tubeMap()
            .width(width)
            .height(height)
            .margin({
                top: 20,
                right: 20,
                bottom: 40,
                left: 100,
            })
            .on("click", function (name) {
                console.log(name);
            });

        d3.json("/assets/files/tubemapSample.json").then(function (data) {
            container
                .datum(data).call(map);

            var svg = container.select('svg');

            var zoom = d3
                .zoom()
                .scaleExtent([0.5, 6])
                .on('zoom', zoomed);

            var zoomContainer = svg.call(zoom);
            var initialScale = 2;
            var initialTranslate = [100, 200];

            zoom.scaleTo(zoomContainer, initialScale);
            zoom.translateTo(zoomContainer, initialTranslate[0], initialTranslate[1]);

            function zoomed() {
                svg.select('g').attr('transform', d3.event.transform.toString());
            }
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



