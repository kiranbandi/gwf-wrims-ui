import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loading from 'react-loading';
import StatCard from './StatCard';
import calculateMetrics from '../../utils/processors/calculateMetrics';

import makeTimeChart from "./makeTimeChart";

class FlowPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dropDownVisible: false,     // Toggle to display the dropdown box for the statcards
            statcards: [
                {
                    name: "Summer Flow",
                    color: "#1bc98e",
                    visible: true
                },
                {
                    name: "Winter Flow",
                    color: "#1ca8dd",
                    visible: true
                },
                {
                    name: "Spawning Rate",
                    color: "#9f86ff",
                    visible: true
                }
            ],
            showPowerData: false    // Toggle to view the power data associated with a few reservoir nodes
        }
        
        this.waterFlowToggle = this.waterFlowToggle.bind(this);
        this.powerFigureToggle = this.powerFigureToggle.bind(this);
    }

    componentDidMount() {
        const { flowData = {} } = this.props, { dataList = [] } = flowData; // populate datalist
        // populate the data with flow data
        const timePeriodList = _.map(dataList, (d) => d.flow);
        if (dataList.length > 0) {
            makeTimeChart(timePeriodList);
        }
    }

    componentDidUpdate() {
        const { flowData = {} } = this.props, { dataList = [] } = flowData; // populate datalist
        // populate the data with flow data or power data
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

    onDropdownButtonClick = () => {
        this.setState({ dropDownVisible: !this.state.dropDownVisible })
    }

    /**
     * Toggles visibility of selected statcards
     * 
     * @statcardID the selected statcard's ID
     */
    toggleVisibility = (statcardID) => {
        let { statcards } = this.state;

        statcards[statcardID].visible = !statcards[statcardID].visible;  

        this.setState({ statcards: statcards});
    }

    /**
     * Adds statcard components to be rendered based on selected statcards
     * 
     * @metrics Metrics used to display the effects of toggled options
     * @innerWidth The width allowed for each statcard
     */
    addStatCards = (metrics, innerWidth) => {
        const { statcards } = this.state;

        let visibleStatCards = []

        for (let i = 0; i < statcards.length; i++) {
            // Add data for summerflow
            if ((i === 0) && statcards[i].visible) {
                let summerFlow = metrics[0];

                visibleStatCards.push(
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
                );
            }
            // Add data for winterflow
            if ((i === 1) && statcards[i].visible) {
                let winterFlow = metrics[1];

                visibleStatCards.push(
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
                );
            }
            // Add data for spawning rate
            if ((i === 2) && statcards[i].visible) {
                let spawningRate = metrics[2];
                
                visibleStatCards.push(
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
                );
            }
        }

        return visibleStatCards;
    }

    render() {
        const { flowData = {}, width, height } = this.props,
            { dataList = [], name = '', isLoading = false, flowParams = { threshold: 'base' } } = flowData,
            innerWidth = width - 60,
            innerHeight = height - (175);

        const { summerFlow = { major: '', minor: '' },
            winterFlow = { major: '', minor: '' },
            spawningRate = { major: '', minor: '' } } = calculateMetrics(dataList, name, flowParams.threshold);
        let isPowerReservoir = ["R1_LDief", "R6_Cod", "R7_Tobin"].includes(name);

        // if a node has no power associated with it, show water data by default
        if (!isPowerReservoir && this.state.showPowerData) { this.waterFlowToggle(); }

        let metrics = [summerFlow, winterFlow, spawningRate]
        
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
                                {this.addStatCards(metrics, innerWidth)}
                            </div>

                            <div className={"sm-root" + (this.state.dropDownVisible ? " sm-visible" : " sm-hidden")} style={{ 'width': ((.65) * width) + "px", transform: `translateX(${((.3456) * width)}px)` }}>
                                <div className={"sm-options-container" + (this.state.dropDownVisible ? " sm-visible" : " sm-hidden")} style={{ width: (((.65) * width) - 70) + "px" }}>
                                    {this.state.statcards.map((statcard, idx) => {
                                        return (
                                            <div className="sm-option" key={idx} onClick={() => this.toggleVisibility(idx)}>
                                                <div className="sm-option-icon"><div style={{ background: statcard.color }}>&zwnj;</div></div>
                                                <div className="sm-option-text">{statcard.name}</div>
                                                <div className={"sm-option-check" + (statcard.visible ? " sm-visble" : " sm-hidden")}><i className="icon icon-check"></i></div>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className='two-button-group'>
                                    <button id="dropdown-icon" onClick={this.onDropdownButtonClick} className="btn statcard-button"><i className="icon icon-chevron-down"></i></button>
                                </div>
                            </div>
                        </div>

                        {dataList.length <= 0 ?
                            <h4 className='title-bar text-center m-a-lg'>No Data Available</h4> :
                            <svg className='flow-data-chart metric-chart' height={(isPowerReservoir? (innerHeight - (innerHeight * .1) )  : innerHeight)} width={innerWidth + (innerWidth * 0.1)}>
                                <defs>
                                    <clipPath id="clip">
                                        <rect/>
                                    </clipPath>
                                </defs>
                                <g className="focus">
                                    <g className="axis axis--y"/>
                                    <path className="area"/>
                                    <g className="axis axis--x"/>
                                    <path className="line"/>
                                </g>
                                <g className="context">
                                    <path className="area"/>
                                    <path className="line"/>
                                    <g className="axis axis--x"/>
                                    <g className="brush"/>
                                </g>
                                <rect className="zoom"/>
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
                                <span className="btx-text" style={{transform: "translate(0px,-2px)" }}>&nbsp;POWER FIGURES&nbsp;</span>
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


