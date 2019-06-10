import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getPathData } from '../../utils/requestServer';
import { setFlowData } from '../../redux/actions/actions';
import { bindActionCreators } from 'redux';
import processFlowData from '../../utils/processFlowData';
import * as d3 from 'd3';



class Markers extends Component {
    constructor(props) {
        super(props);
        this.onMarkerClick = this.onMarkerClick.bind(this);
    }

    componentDidMount() {
        const { flowData = {}, width, height } = this.props,
            { dataList = [], path = {}, isLoading = false } = flowData;

        let { markers = [], xScale, yScale, isSouthSask } = this.props,
            markerSizeScale = (xScale(1) - xScale(0)) / 60;

        let data = {}, threshold = 50;
        // console.log(dataList)
        if (dataList.length > 0) {
            const markerList = _.map(markers, (marker, index) => {
                const { name, coords, type = "agri", mockdata = {} } = marker;
                // console.log(index)

                var dataNum = 0;
                for (var i = 0; i < dataList.length; i++) {

                    //Add first index
                    if (i == 0) {
                        data[dataNum] = dataList[i];
                    } else {

                        // data bigger than threshold
                        if (dataList[i] > threshold) {
                            // if at even index
                            if (dataNum % 2 == 0) {
                                data[dataNum] = data[dataNum] + dataList[i]
                            }
                            else {
                                dataNum++;
                                data[dataNum] = dataList[i];
                            }
                            //data smaller than threshold
                        } else {
                            if (dataNum % 2 != 0) {
                                data[dataNum] = data[dataNum] + dataList[i]
                            } else {
                                dataNum++;
                                data[dataNum] = dataList[i]
                            }
                        }

                    }
                }
                makeTimeChart(data, path, index)
            });
        }
    }

    // componentDidUpdate() {
    //     const { flowData = {}, width, height } = this.props,
    //         { dataList = [], path = {}, isLoading = false } = flowData;

    //     let { markers = [], xScale, yScale, isSouthSask } = this.props,
    //         markerSizeScale = (xScale(1) - xScale(0)) / 60;

    //     let data = {}, threshold = 50;

    //     if (dataList.length > 0) {
    //         const markerList = _.map(markers, (marker, index) => {
    //             const { name, coords, type = "agri", mockdata = {} } = marker;
    //             // console.log(index)

    //             var dataNum = 0;
    //             for (var i = 0; i < dataList.length; i++) {

    //                 //Add first index
    //                 if (i == 0) {
    //                     data[dataNum] = dataList[i];
    //                 } else {

    //                     // data bigger than threshold
    //                     if (dataList[i] > threshold) {
    //                         // if at even index
    //                         if (dataNum % 2 == 0) {
    //                             data[dataNum] = data[dataNum] + dataList[i]
    //                         }
    //                         else {
    //                             dataNum++;
    //                             data[dataNum] = dataList[i];
    //                         }
    //                         //data smaller than threshold
    //                     } else {
    //                         if (dataNum % 2 != 0) {
    //                             data[dataNum] = data[dataNum] + dataList[i]
    //                         } else {
    //                             dataNum++;
    //                             data[dataNum] = dataList[i]
    //                         }
    //                     }

    //                 }
    //             }
    //             makeTimeChart(data, path, index)
    //         });
    //     }
    // }

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
                // console.log(fileCatalogInfo)

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
        const { flowData = {}, width, height } = this.props,
            { dataList = [], path = {}, isLoading = false } = flowData;

        let { markers = [], xScale, yScale, isSouthSask } = this.props,
            markerSizeScale = (xScale(1) - xScale(0)) / 60;

        if (isSouthSask) {
            markerSizeScale = markerSizeScale * 0.75;
        }


        const markerList = _.map(markers, (marker, index) => {
            const { name, coords, type = "agri", mockdata = {} } = marker;
            // console.log(index)
            // makeTimeChart(dataList, path, index)
            if ((!!coords && coords.length > 0)) {
                return (
                    <g key={'marker-' + index} className='river-marker'
                        transform={"translate(" + (+xScale(coords[0]) - (isSouthSask ? 10 : 0)) + "," + (+yScale(coords[1]) - (isSouthSask ? 10 : 0)) + ") scale(" + (markerSizeScale) + ")"}>
                        <circle
                            // probably the worst way to do this but im on a deadline so sue me !!
                            onDoubleClick={this.onMarkerClick.bind(this, marker)}
                            cx='150' cy='150' r='200'
                            className={'type-' + type}>
                        </circle>
                        <path id="marker-image"
                            transform={type == 'demand' ? "translate(5, 0) scale(0.68)"
                                : type == 'agri' ? "translate(5, 20) scale(0.58)"
                                    : "translate(0,0) scale(1.05)"}
                            d={
                                type == 'demand' ? "M300,240.715V155l-120,85.715V155h-30V85h-30v70H90V35H30v120H0v230h420V155L300,240.715z M160,335h-40 v-40h40V335z M230,335h-40v-40h40V335z M300,335h-40v-40h40V335z"
                                    : type == 'agri' ? "m512 54.1875v-29.941406c-16.90625 0-32.179688 7.097656-43.023438 18.457031l-6.578124-15.863281c-3.707032-8.945313-12.363282-14.726563-22.046876-14.726563-9.683593 0-18.335937 5.78125-22.046874 14.726563l-6.621094 15.96875c-10.847656-11.421875-26.164063-18.5625-43.125-18.5625v29.941406c16.304687 0 29.570312 13.265625 29.570312 29.570312v.5h.039063c.078125 8.078126 2.464843 16.082032 7.097656 23.023438 4.957031 7.421875 12.023437 12.945312 20.113281 16.011719v41.917969l-19.296875-22.066407-33.511719 30.597657 20.191407 22.113281 10.917969-9.96875 21.703124 24.816406v32.75l-19.296874-22.066406-33.511719 30.59375 20.191406 22.113281 10.917969-9.964844 21.699218 24.8125v24.25c-51.421874-6.140625-103.070312-9.523437-154.371093-10.082031v-26.28125l21.699219-24.816406 10.917968 9.96875 20.191406-22.113281-33.511718-30.597657-19.296875 22.066407v-32.75l21.699219-24.816407 10.917968 9.96875 20.191406-22.113281-33.511718-30.597656-19.296875 22.070312v-41.917968c8.09375-3.070313 15.160156-8.59375 20.117187-16.015626 5.082032-7.613281 7.464844-16.507812 7.054688-25.378906.960937-15.441406 13.824218-27.710937 29.503906-27.710937v-29.945313c-16.90625 0-32.179688 7.097656-43.023438 18.457032l-6.582031-15.859376c-3.707031-8.945312-12.363281-14.726562-22.046875-14.726562s-18.335937 5.78125-22.046875 14.726562l-6.621093 15.96875c-10.847657-11.421874-26.164063-18.566406-43.125-18.566406v29.945313c16.304687 0 29.570312 13.265625 29.570312 29.570312v.496094h.039062c.074219 8.082031 2.460938 16.085937 7.097657 23.027344 4.957031 7.421875 12.023437 12.945312 20.113281 16.011719v41.917968l-19.296875-22.066406-33.511719 30.597656 20.191406 22.113282 10.917969-9.96875 21.699219 24.816406v32.75l-19.292969-22.070313-33.511719 30.597657 20.1875 22.113281 10.917969-9.964844 21.699219 24.8125v26.28125c-51.179688.542969-102.800781 3.890625-154.296875 9.988281v-24.152344l21.699219-24.816406 10.917968 9.96875 20.191407-22.113281-33.511719-30.597656-19.296875 22.070312v-32.753906l21.699219-24.8125 10.917968 9.964844 20.191407-22.113281-33.507813-30.597657-19.296875 22.070313v-41.917969c8.089844-3.066406 15.15625-8.59375 20.113281-16.015625 5.085938-7.613281 7.46875-16.511719 7.054688-25.378906.964844-15.441406 13.824219-27.710938 29.503906-27.710938v-29.945312c-16.90625 0-32.179687 7.101562-43.023437 18.460937l-6.574219-15.863281c-3.710938-8.949219-12.363281-14.730469-22.050781-14.730469-9.683594 0-18.335938 5.78125-22.046875 14.726563l-6.621094 15.96875c-10.851562-11.417969-26.164062-18.5625-43.125-18.5625v29.941406c16.304688 0 29.570312 13.265625 29.570312 29.570312v.5h.039063c.078125 8.078126 2.460937 16.082032 7.097656 23.023438 4.957031 7.421875 12.023438 12.945312 20.113281 16.015625v41.917969l-19.296874-22.070313-33.511719 30.597657 20.191406 22.113281 10.917969-9.96875 21.703125 24.816406v32.75l-19.300781-22.066406-33.511719 30.597656 20.191406 22.113281 10.917969-9.96875 21.703125 24.816406v28.007813c-14.816407 2.0625-29.609375 4.347656-44.367188 6.863281l-12.45312475 2.125v90.394532h510.98828175v-90.382813l-12.441407-2.132813c-14.371093-2.46875-28.785156-4.707031-43.226562-6.738281v-28.136719l21.699219-24.816406 10.917968 9.96875 20.191406-22.113281-33.511718-30.597656-19.292969 22.066406v-32.75l21.699219-24.8125 10.917968 9.964844 20.191407-22.113281-33.511719-30.597657-19.300781 22.070313v-41.917969c8.09375-3.070313 15.15625-8.59375 20.117187-16.015625 5.082032-7.613281 7.464844-16.507812 7.050782-25.378906.964843-15.441406 13.828124-27.714844 29.507812-27.714844zm0 0"
                                        : "M265.963,183.754c-9.717,0-18.94-4.233-25.305-11.614c-1.709-1.982-4.198-3.123-6.816-3.123s-5.106,1.14-6.816,3.123 c-6.363,7.38-15.586,11.613-25.304,11.613s-18.94-4.233-25.305-11.614c-1.709-1.982-4.198-3.123-6.816-3.123 c-2.618,0-5.106,1.14-6.816,3.123c-6.363,7.38-15.586,11.613-25.304,11.613c-9.718,0-18.94-4.233-25.304-11.613 c-1.71-1.983-4.198-3.123-6.816-3.123c-2.618,0-5.106,1.14-6.816,3.123c-6.364,7.381-15.587,11.614-25.305,11.614 c-9.718,0-18.94-4.233-25.304-11.613c-1.71-1.983-4.198-3.123-6.816-3.123c-2.618,0-5.106,1.14-6.816,3.123 C27.94,179.522,18.717,183.754,9,183.754c-4.971,0-9,4.029-9,9s4.029,9,9,9c10.469,0,20.558-3.195,29.029-9 c1.055-0.723,2.09-1.48,3.092-2.283c1.002,0.803,2.037,1.56,3.092,2.283c8.47,5.805,18.56,9,29.028,9 c10.468,0,20.558-3.195,29.029-9c1.055-0.723,2.09-1.48,3.092-2.283c1.002,0.803,2.037,1.56,3.092,2.283 c8.47,5.805,18.56,9,29.028,9s20.558-3.195,29.028-9c1.055-0.723,2.089-1.48,3.092-2.283c1.002,0.803,2.037,1.56,3.092,2.283 c8.47,5.805,18.56,9,29.029,9c10.469,0,20.558-3.195,29.028-9c1.055-0.723,2.089-1.48,3.092-2.283 c1.002,0.803,2.037,1.56,3.092,2.283c8.47,5.805,18.56,9,29.029,9c4.971,0,9-4.029,9-9S270.934,183.754,265.963,183.754z M265.963,135.851c-9.717,0-18.94-4.233-25.305-11.614c-1.709-1.982-4.198-3.123-6.816-3.123s-5.106,1.14-6.816,3.123 c-6.363,7.38-15.586,11.613-25.304,11.613s-18.94-4.233-25.305-11.614c-1.709-1.982-4.198-3.123-6.816-3.123 c-2.618,0-5.106,1.14-6.816,3.123c-6.363,7.38-15.586,11.613-25.304,11.613c-9.718,0-18.94-4.233-25.304-11.613 c-1.71-1.983-4.198-3.123-6.816-3.123c-2.618,0-5.106,1.14-6.816,3.123c-6.364,7.381-15.587,11.614-25.305,11.614 c-9.718,0-18.94-4.233-25.304-11.613c-1.71-1.983-4.198-3.123-6.816-3.123c-2.618,0-5.106,1.14-6.816,3.123 C27.94,131.618,18.717,135.851,9,135.851c-4.971,0-9,4.029-9,9c0,4.971,4.029,9,9,9c10.469,0,20.558-3.195,29.029-9 c1.055-0.723,2.089-1.48,3.092-2.283c1.002,0.803,2.037,1.56,3.092,2.283c8.47,5.805,18.56,9,29.028,9 c10.468,0,20.558-3.195,29.029-9c1.055-0.723,2.089-1.48,3.092-2.283c1.002,0.803,2.037,1.56,3.092,2.283 c8.47,5.805,18.56,9,29.028,9s20.558-3.195,29.028-9c1.055-0.723,2.089-1.48,3.092-2.283c1.002,0.803,2.037,1.56,3.092,2.283 c8.471,5.805,18.56,9,29.029,9c10.469,0,20.558-3.195,29.028-9c1.055-0.723,2.089-1.48,3.092-2.283 c1.002,0.803,2.037,1.56,3.092,2.283c8.471,5.805,18.56,9,29.029,9c4.971,0,9-4.029,9-9 C274.964,139.881,270.934,135.851,265.963,135.851z M9,105.947c10.469,0,20.558-3.195,29.029-9c1.055-0.723,2.089-1.48,3.092-2.283c1.002,0.803,2.037,1.56,3.092,2.283 c8.47,5.805,18.56,9,29.028,9c10.468,0,20.558-3.195,29.029-9c1.055-0.723,2.089-1.48,3.092-2.283 c1.002,0.803,2.037,1.56,3.092,2.283c8.47,5.805,18.56,9,29.028,9s20.558-3.195,29.028-9c1.055-0.723,2.089-1.48,3.092-2.283 c1.002,0.803,2.037,1.56,3.092,2.283c8.471,5.805,18.56,9,29.029,9c10.469,0,20.558-3.195,29.028-9 c1.055-0.723,2.089-1.48,3.092-2.283c1.002,0.803,2.037,1.56,3.092,2.283c8.471,5.805,18.56,9,29.029,9c4.971,0,9-4.029,9-9 s-4.029-9-9-9c-9.717,0-18.94-4.233-25.305-11.614c-1.709-1.982-4.198-3.123-6.816-3.123s-5.106,1.14-6.816,3.123 c-6.363,7.38-15.586,11.613-25.304,11.613s-18.94-4.233-25.305-11.614c-1.709-1.982-4.198-3.123-6.816-3.123 c-2.618,0-5.106,1.14-6.816,3.123c-6.363,7.38-15.586,11.613-25.304,11.613c-9.718,0-18.94-4.233-25.304-11.613 c-1.71-1.983-4.198-3.123-6.816-3.123c-2.618,0-5.106,1.14-6.816,3.123c-6.364,7.381-15.587,11.614-25.305,11.614 c-9.718,0-18.941-4.232-25.304-11.612c-1.71-1.983-4.198-3.123-6.816-3.123c-2.618,0-5.106,1.14-6.816,3.123 C27.94,83.715,18.717,87.947,9,87.947c-4.971,0-9,4.029-9,9S4.029,105.947,9,105.947z"

                            }
                        />
                        <title>
                            {name}
                        </title>
                        <g height={1000} width={1000} className={'flow-data-chart doughnut-chart' + index} transform="translate(150, 150)"></g>
                        {/* <svg className='doughnut-chart'> */}

                        {/* </svg> */}
                        {/* <div id="my_dataviz"></div> */}
                    </g>

                );
            }
        });



        return (<g className='river-marker-container'>{markerList}</g>)
    }
}


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ setFlowData }, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        flowData: state.delta.flowData
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Markers);

// temp stopgap implementation
function makeTimeChart(data, path, index, threshold = 50) {
    // set the dimensions and margins of the graph
    var width = 500, height = 500, margin = 40;
    // console.log("doughnut-chart" + index)
    // The radius of the pieplot is half the width or half the height (smallest one). I substract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin

    // append the svg object to the div called 'my_dataviz'
    var svg = d3.select("g.doughnut-chart" + index)
        .append("g")
        .attr("width", width)
        .attr("height", height)
        .append("g");
    // .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Create dummy data
    // var data = {
    //     // 1: 40, 2: 5, 3: 20, 4: 10
    // }

    var colorList = ["blue", "red"]
    // console.log(dataList)



    // set the color scale
    var color = d3.scaleOrdinal()
        .domain(data)
        .range(colorList)

    // Compute the position of each group on the pie:
    var pie = d3.pie()
        .sort(null) // Do not sort group by size
        .value(function (d) { return d.value; })
    var data_ready = pie(d3.entries(data))

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
        .selectAll('whatever')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', d3.arc()
            .innerRadius(radius + 50)         // This is the size of the donut hole
            .outerRadius(radius + 100)
        )
        .attr('fill', function (d) { return (color(d.data.key)) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)

}