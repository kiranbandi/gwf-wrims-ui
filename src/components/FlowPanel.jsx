/*global $*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loading from 'react-loading';
import * as d3 from 'd3';
import StatCard from '../components/StatCard';
import calculateMetrics from '../utils/calculateMetrics';

class FlowPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dropDownVisible: false,
            statcards: [
                {
                    name: "Summer Flow",
                    color: "#1bc98e",
                    visible: true,
                    id: 0
                },
                {
                    name: "Winter Flow",
                    color: "#1ca8dd",
                    visible: true,
                    id: 1
                },
                {
                    name: "Spawning Rate",
                    color: "#9f86ff",
                    visible: true,
                    id: 2
                }
            ]  ,
            showPowerData: false
        }
        
        this.waterFlowToggle = this.waterFlowToggle.bind(this);
        this.powerFigureToggle = this.powerFigureToggle.bind(this);
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
        // console.log("FlowPanel: " + flowData)
        // Added functionality in index.jsx: actions.setFlowData to add values for power
        const timePeriodList = this.state.showPowerData? (_.map(dataList, (d) => d.power)) : _.map(dataList, (d) => d.flow);
        
        if (dataList.length > 0) {
                makeTimeChart(timePeriodList);
        }
    }
    waterFlowToggle() {
        
        if (this.state.showPowerData) {
            this.setState({showPowerData: false});
        }
    }

    powerFigureToggle() {
        
        if (!this.state.showPowerData) {
            this.setState({showPowerData: true});
        }
    }

    fakeDropDownClick = () => {

        this.setState({ dropDownVisible: !this.state.dropDownVisible })
    }

    setVisible = (statCardID) => {
        // temp implementation to test out the menu
        var updatedStatcards = this.state.statcards.map((statcard, idx) => {
            if (idx === statCardID) {
                statcard.visible = !statcard.visible;
            }
            
            return statcard;
        });

        this.setState({ statcards: updatedStatcards});
    }

    addStatCards = () => {
        let divStatCards = []
        // console.log("HERE: " + innerWidth + summerFlow)
        // console.log(summerFlow)

        const { flowData = {}, width, height } = this.props,
            { dataList = [], name = '', isLoading = false, flowParams = { threshold: 'base' } } = flowData,
            innerWidth = width - 40,
            innerHeight = height - (155);

        const { summerFlow = { major: '', minor: '' },
            winterFlow = { major: '', minor: '' },
            spawningRate = { major: '', minor: '' } } = calculateMetrics(dataList, name, flowParams.threshold);

         // Outer loop to create parent
        for (let i = 0; i < 3; i++) {
            if (this.state.statcards[i].id == 0 && this.state.statcards[i].visible){
                divStatCards.push(
                    <StatCard
                        key={i}
                        title={"Summer Flow"}
                        major={summerFlow.major || 'N/A'}
                        minor={!!summerFlow.minor ? summerFlow.minor + '%' : ''}
                        type={"success"}
                        arrow={!!summerFlow.minor ? summerFlow.minor > 0 ? 'positive' : 'negative' : ''}
                        width={innerWidth / 3.1}
                        icon="sun" 
                    />
                )
            }

            if (this.state.statcards[i].id == 1 && this.state.statcards[i].visible){
                divStatCards.push(
                    <StatCard
                        key={i}
                        title={"Winter Flow"}
                        major={winterFlow.major || 'N/A'}
                        minor={!!winterFlow.minor ? winterFlow.minor + '%' : ''}
                        type={"primary"}
                        arrow={!!winterFlow.minor > 0 ? winterFlow.minor > 0 ? 'positive' : 'negative' : ''}
                        width={innerWidth / 3.1}
                        icon="snow" 
                    />
                )
            }

            if (this.state.statcards[i].id == 2 && this.state.statcards[i].visible){
                divStatCards.push(
                    <StatCard
                        key={i}
                        title={"Spawning Rate"}
                        major={!!spawningRate.major ? spawningRate.major + '%' : 'N/A'}
                        minor={!!spawningRate.minor ? spawningRate.minor + '%' : ''}
                        type={"info"}
                        arrow={!!spawningRate.minor > 0 ? spawningRate.minor > 0 ? 'positive' : 'negative' : ''}
                        width={innerWidth / 3.1}
                        icon="fish" 
                    />
                )
            }


        }

        return divStatCards
    }

    render() {
        const { flowData = {}, width, height } = this.props,
            { dataList = [], name = '', isLoading = false, flowParams = { threshold: 'base' } } = flowData,
            innerWidth = width - 40,
            innerHeight = height - (155);

        // const { summerFlow = { major: '', minor: '' },
        //     winterFlow = { major: '', minor: '' },
        //     spawningRate = { major: '', minor: '' } } = calculateMetrics(dataList, name, flowParams.threshold);
        let isPowerReservoir = ["R1_LDief", "R6_Cod", "R7_Tobin"].includes(name);

        return (
            <div className='flow-panel-root-container' style={{ width, height:  (height+'px') }}>
                <h4 className='title-bar text-center'>FLOW DATA
                {name.length > 0 && <strong style={{ marginLeft: 10 }}>{name}</strong>}
                </h4>

                {isLoading ?
                    <Loading className='loader' type='spin' height='75px' width='75px' color='#d6e5ff' delay={-1} /> :
                    <div className='flow-inner-container'>
                        <p className='exclaimatory-text'>* All values are in 1000m<sup>3</sup>/week</p>
                        <div className='entire-panel' style={{ width, height: '90px' }}>
                            <div className='metrics-container' style={{ 'width': width - 70 }}>
                                {this.addStatCards()}
                            </div>

                            <div className={"sm-root" + (this.state.dropDownVisible ? " sm-visible" : " sm-hidden")} style={{ 'width': ((.65) * width) + "px", transform: `translateX(${((.35) * width) + 4}px)` }}>
                                <div className={"sm-options-container" + (this.state.dropDownVisible ? " sm-visible" : " sm-hidden")} style={{ width: (((.65) * width) - 70) + "px" }}>
                                    {this.state.statcards.map((statcard, idx) => {
                                        return (
                                            <div className="sm-option" key={idx} onClick={() => this.setVisible(idx)}>
                                                <div className="sm-option-icon"><div style={{ background: statcard.color }}>&zwnj;</div></div>
                                                <div className="sm-option-text">{statcard.name}</div>
                                                <div className={"sm-option-check" + (statcard.visible ? " sm-visble" : " sm-hidden")}><i className="icon icon-check"></i></div>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className='two-button-group'>
                                    <button id="dropdown-icon" onClick={this.fakeDropDownClick} className="btn statcard-button"><i className="icon icon-chevron-down"></i></button>
                                    <button id="submit-icon" className="btn statcard-button"><i className="icon icon-check"></i></button>
                                </div>
                            </div>
                        </div>

                        {dataList.length <= 0 ?
                            <h4 className='title-bar text-center m-a-lg'>No Data Available</h4> :
                            <svg height={(isPowerReservoir? (innerHeight - (innerHeight * .1) )  : innerHeight)} width={innerWidth + (innerWidth * 0.1)} className='flow-data-chart metric-chart'>
                                <defs>
                                    <clipPath id="clip">
                                        <rect>
                                        </rect>
                                    </clipPath>
                                </defs>
                                <g className="focus">
                                    <g className="axis axis--y"></g>
                                    <path className="area"></path>
                                    <g className="axis axis--x"></g>
                                    <path className="line"></path>
                                </g>
                                <g className="context">
                                    <path className="area"></path>
                                    <path className="line"></path>
                                    <g className="axis axis--x"></g>
                                    <g className="brush"></g>
                                </g>
                                <rect className="zoom">
                                </rect>
                            </svg>}
                        {isPowerReservoir && <div className="toggle-btn-container" style={{height: (height * .10) + "px" }}>
                            
                            <div className={"btx " + (this.state.showPowerData ? "" : "toggle-selected") } style={{ height: "25px"}} onClick={this.waterFlowToggle} >
                                <div className="btx-icon" style={{height: "20px", width: "20px", transform: "translate(0px,-12px)" }}>
                                    <svg style={{transform: "translate(-2px, -1px)"}}>
                                        <g className="water-drop" style={{transform:"scale(0.038)"}}>
                                            <path d="M270.265,149.448c-36.107-47.124-70.38-78.948-73.439-141.372c0-1.836-0.612-3.06-1.836-4.284
                                            c-0.612-3.06-3.672-4.896-6.732-3.06c-3.672,0-6.731,2.448-6.731,6.732c-77.112,83.232-207.468,294.372-43.452,354.959
                                            c74.052,27.541,157.896-9.791,172.584-90.576C318.614,228.396,295.969,182.497,270.265,149.448z M138.686,323.256
                                            c-17.748-10.404-28.764-31.211-34.272-49.572c-2.448-9.18-3.672-18.359-3.06-27.539c3.672-15.912,8.568-31.213,14.076-46.512
                                            c3.06,13.463,9.18,26.928,17.748,36.719c19.584,21.422,59.364,34.273,70.38,61.201c6.732,16.523-19.584,30.6-30.6,34.271
                                            C161.33,335.496,148.477,329.377,138.686,323.256z"/>
                                        </g>
                                    </svg>
                                </div>
                                <span className="btx-text" style={{transform: "translate(0px,-2px)" }}>&nbsp;FLOW RATES&nbsp;</span>
                            </div>

                            <div className={"btx " + (this.state.showPowerData ? "toggle-selected" : "") } style={{ height: "25px"}} onClick={this.powerFigureToggle}>
                                <div className="btx-icon" style={{height: "20px", width: "20px", transform: "translate(0px,-12px)" }}>
                                    <svg style={{transform: "translate(-2px, -1px)"}}>
                                        <g className="bolt" style={{transform:"scale(0.03)"}}>
                                            <path d="M207.523,560.316c0,0,194.42-421.925,194.444-421.986l10.79-23.997c-41.824,12.02-135.271,34.902-135.57,35.833
                                            C286.96,122.816,329.017,0,330.829,0c-39.976,0-79.952,0-119.927,0l-12.167,57.938l-51.176,209.995l135.191-36.806
                                            L207.523,560.316z"/>
                                        </g>
                                    </svg>  
                                </div>
                                <span className="btx-text" style={{transform: "translate(0px,-2px)" }}> &nbsp;POWER FIGURES&nbsp;</span>
                            </div>
                        </div>}    
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
            left: 42
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


    svg.select("defs").select("clipPath#clip")
        .select("rect")
        .attr("width", width)
        .attr("height", height);

    var focus = svg.select("g.focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var context = svg.select("g.context")
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

    focus.select("g.axis.axis--y")
        .call(yAxis)
        .attr("transform", "translate(" + width + ", 0)");

    focus.select("path.area")
        .datum(data)
        .attr("d", area);

    focus.select("g.axis.axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    focus.select("path.line")
        .datum(data)
        .attr("d", line);

    context.select("path.area")
        .datum(data)
        .attr("d", area2);
    context.select("path.line")
        .datum(data)
        .attr("d", line2);

    context.select("g.axis.axis--x")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

    var contextBrush = context.select("g.brush");

    contextBrush.call(brush)
        .call(brush.move, x.range());

    contextBrush.selectAll(".handle")
        .attr('rx', 3)
        .attr('ry', 3);

    svg.select("rect.zoom")
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
        // contextBrush
    }


}