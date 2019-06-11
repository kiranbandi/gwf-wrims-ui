/*global $*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loading from 'react-loading';
import * as d3 from 'd3';
import StatCard from '../components/StatCard';

class FlowPanel extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { flowData = {} } = this.props, { dataList = [] } = flowData;
        const timePeriodList = _.map(dataList, (d) => d.flow);
        if (dataList.length > 0) {
            makeTimeChart(timePeriodList);
        }
    }

    componentDidUpdate() {
        const { flowData = {} } = this.props, { dataList = [] } = flowData;
        const timePeriodList = _.map(dataList, (d) => d.flow);
        if (dataList.length > 0) {
            makeTimeChart(timePeriodList);
        }
    }
    render() {

        const { flowData = {}, width, height } = this.props,
            { dataList = [], name = '', isLoading = false } = flowData,
            innerWidth = width - 40,
            innerHeight = height - (height / 2.75);


        return (
            <div className='flow-panel-root-container' style={{ width, height }}>
                <h4 className='title-bar text-center'>FLOW DATA {name ? " - " + name : ""}</h4>
                {isLoading ?
                    <Loading className='loader' type='spin' height='75px' width='75px' color='#d6e5ff' delay={-1} /> :
                    <div className='flow-inner-container'>
                        <div className='metrics-container'>
                            <StatCard
                                title={"Summer Flow"}
                                major={4310}
                                minor={'12%'}
                                type={"success"}
                                arrow={"negative"}
                                width={innerWidth / 3.1}
                                icon="sun" />
                            <StatCard
                                title={"Winter Flow"}
                                major={2000}
                                minor={'5%'}
                                type={"primary"}
                                arrow={"positive"}
                                width={innerWidth / 3.1}
                                icon="snow" />
                            <StatCard
                                title={"Spawning Rate"}
                                major={90}
                                minor={'15%'}
                                type={"info"}
                                arrow={"negative"}
                                width={innerWidth / 3.1}
                                icon="fish" />
                        </div>

                        {dataList.length <= 0 ?
                            <h4 className='title-bar text-center m-a-lg'>No Data Available</h4> :
                            <svg height={innerHeight} width={innerWidth} className='flow-data-chart metric-chart'>
                            </svg>}
                    </div>
                }
            </div>);
    }
}

function mapStateToProps(state) {
    return {
        flowData: state.delta.flowData
    };
}

export default connect(mapStateToProps)(FlowPanel);


// temp stopgap implementation
function makeTimeChart(dataList) {

    var metricCount = dataList;
    var metricMonths = [];
    var initalYear = 1928;

    //  since data is in months we divide by 12.
    for (let y = 0, constraint = (dataList.length / 12); y < constraint; y++) {
        for (let m = 0; m < 12; m++) {
            metricMonths.push(("" + (initalYear + y) + "-" + ((m < 9) ? "0" + (m + 1) : m + 1)));
        }
    }

    var svg = d3.select("svg.metric-chart"),
        margin = {
            top: 20,
            right: 20,
            bottom: +svg.attr("height") * (0.30),
            left: 40
        },
        margin2 = {
            top: +svg.attr("height") * (0.775),
            right: 20,
            bottom: 25,
            left: 40
        },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        height2 = +svg.attr("height") - margin2.top - margin2.bottom;

    var x = d3.scaleTime().range([0, width]),
        x2 = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        y2 = d3.scaleLinear().range([height2, 0]);

    var xAxis = d3.axisBottom(x)
        .scale(x)
        .tickSize(-height),
        xAxis2 = d3.axisBottom(x2),
        yAxis = d3.axisLeft(y)
            .scale(y)
            .ticks(8)
            .tickSize(width);

    var brush = d3.brushX()
        .extent([
            [0, 0],
            [width, (height2 + 2)]
        ])
        .on("brush end", brushed);

    var zoom = d3.zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([
            [0, 0],
            [width, height]
        ])
        .extent([
            [0, 0],
            [width, height]
        ])
        .on("zoom", zoomed);

    var line = d3.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.price);
        });

    var area = d3.area()
        .x(function (d) {
            return x(d.date);
        })
        .y0((height))
        .y1(function (d) {
            return y(d.price);
        });

    var line2 = d3.line()
        .x(function (d) {
            return x2(d.date);
        })
        .y(function (d) {
            return y2(d.price);
        });

    var area2 = d3.area()
        .x(function (d) {
            return x2(d.date);
        })
        .y0((height2))
        .y1(function (d) {
            return y2(d.price);
        });


    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


    // Combine the months and count array to make "data"
    var data = [];
    for (var i = 0; i < metricCount.length; i++) {
        var obj = {
            date: d3.timeParse("%Y-%m")(metricMonths[i]),
            price: (Math.round(metricCount[i] * 1000) / 1000)
        };
        data.push(obj);
    }

    x.domain(d3.extent(data, function (d) {
        return d.date;
    }));

    y.domain([0, d3.max(data, function (d) {
        return d.price;
    })]);

    x2.domain(x.domain());
    y2.domain(y.domain());

    focus.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis)
        .attr("transform", "translate(" + width + ", 0)");

    focus.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);

    focus.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    focus.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    context.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area2);
    context.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line2);

    context.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

    var contextBrush = context.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, x.range());

    contextBrush.selectAll(".handle")
        .attr('rx', 3)
        .attr('ry', 3);

    svg.append("rect")
        .attr("class", "zoom")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoom);


    function brushed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
        var s = d3.event.selection || x2.range();
        x.domain(s.map(x2.invert, x2));
        focus.select(".area").attr("d", area);
        focus.select(".line").attr("d", line);
        focus.select(".axis--x").call(xAxis);
        svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
            .scale(width / (s[1] - s[0]))
            .translate(-s[0], 0));
    }

    function zoomed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
        var t = d3.event.transform;
        x.domain(t.rescaleX(x2).domain());
        focus.select(".area").attr("d", area);
        focus.select(".line").attr("d", line);
        focus.select(".axis--x").call(xAxis);

        contextBrush.call(brush.move, x.range().map(t.invertX, t));
    }


}