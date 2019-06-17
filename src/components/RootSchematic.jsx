/*global $*/
import React, { Component } from 'react';
import * as d3 from 'd3';
import tileMap from '../utils/tileMap';
import Switch from "react-switch";

//  Image url handling is convoluted in scss , much easier to set inline and get images from root
let backgroundStyleSchematic = { background: 'url(assets/img/overall.png)', backgroundSize: '100%' };
let backgroundStyleMap = { background: 'url(assets/img/saskbasin.png)', backgroundSize: '100%' };

export default class RootSchematic extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isMapShown: false
        };

        this.getTiles = this.getTiles.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }


    handleChange(isMapShown) {
        this.setState({ isMapShown });
    }

    getTiles(width, height) {
        return _.map(tileMap, (tile, tileIndex) => {
            const pathData = tile.boundingPath.map(function (d) {
                return [Math.round(d[0] * width), Math.round(d[1] * (height * .985))];
            });
            return <path
                id={tile.tileID}
                d={d3.line()(pathData)}
                className='tile'
                stroke={tile.color}
                onClick={this.props.onRegionSelect}
                key={'tile-index-' + tileIndex}>
                <title>{tile.tileName}</title>
            </path>
        })
    }


    render() {

        let { width = 1000, selectedPlace } = this.props, { isMapShown } = this.state;
        // downscale by 20%
        width = width * .75;
        backgroundStyleMap = { ...backgroundStyleMap, width: width, height: width / 2.15 };
        backgroundStyleSchematic = { ...backgroundStyleSchematic, width: width, height: width / 2.15 };

        return (
            <div className='root-schema-container'>
                <div className='schema-selection-container' style={{ width: width }}>
                    <h2 className='text-primary switch-custom-label'>Basin Map</h2>
                    <div className='switch-container'>
                        <label htmlFor="material-switch">
                            <Switch
                                checked={isMapShown}
                                onChange={this.handleChange}
                                onColor="#86d3ff"
                                onHandleColor="#2693e6"
                                handleDiameter={30}
                                uncheckedIcon={false}
                                checkedIcon={false}
                                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                height={20}
                                width={48}
                                className="react-switch"
                                id="material-switch"
                            />
                        </label>
                    </div>
                    <h2 className='text-primary'>Select a <b>Region</b> to Investigate or Pick a <b>Place</b></h2>
                    {isMapShown ?
                        <div id='root-schema' className='image-container' style={backgroundStyleMap}>
                            <div className='selection-box' id='highwood' onClick={this.props.onRegionSelect} style={{ top: width * 0.275, left: 0.15 * width }}></div>
                            <div className='selection-box' id='southSask' onClick={this.props.onRegionSelect} style={{ top: width * 0.32, left: 0.45 * width }}></div>
                        </div>
                        :
                        <div id='root-schema' className='image-container' style={backgroundStyleSchematic}>
                            <svg className='tile-container' width={width} height={width / 2.15}>
                                {this.getTiles(width, width / 2.15)}
                            </svg>
                        </div>}

                </div>
                <div className='place-selection-container'>
                    <h2 className='text-primary'>Places of Interest</h2>
                    <div className='list-container'>
                        {/* bad idea to attach so many events , need to refactor and attach single event to parent */}
                        {/* id is model#type#name#number */}
                        <p onClick={this.props.onPlaceSelect} id='southSask#link#J_2_J_32#6' className={selectedPlace == 'southSask#link#J_2_J_32#6' ? 'selected-button' : ''}>City of Saskatoon</p>
                        <p onClick={this.props.onPlaceSelect} id='southSask#link#J2_RF_J_38#98' className={selectedPlace == 'southSask#link#J2_RF_J_38#98' ? 'selected-button' : ''}>Cumberland Delta</p>
                        <p onClick={this.props.onPlaceSelect} id='southSask#reservoir#R1_LDief#1' className={selectedPlace == 'southSask#reservoir#R1_LDief#1' ? 'selected-button' : ''}>Diefenbaker Lake</p>
                        <p onClick={this.props.onPlaceSelect} id='southSask#reservoir#R7_Tobin#3' className={selectedPlace == 'southSask#reservoir#R7_Tobin#3' ? 'selected-button' : ''}>Tobin Lake</p>
                        <p onClick={this.props.onPlaceSelect} id='southSask#demand#QuAppelle_0#14' className={selectedPlace == 'southSask#demand#QuAppelle_0#14' ? 'selected-button' : ''}>Qu'Appelle Withdrawal</p>
                        <p onClick={this.props.onPlaceSelect} id='southSask#inflow#In76_SWIFTCCr#61' className={selectedPlace == 'southSask#inflow#In76_SWIFTCCr#61' ? 'selected-button' : ''}>Swift Current Creek</p>
                        <p onClick={this.props.onPlaceSelect} id='southSask#inflow#In5_PrinceA#79' className={selectedPlace == 'southSask#inflow#In5_PrinceA#79' ? 'selected-button' : ''}>Prince Albert Inflow</p>
                        <p onClick={this.props.onPlaceSelect} id='highwood#link#J_LBowDiv_J_HW8#23' className={"highwood " + (selectedPlace == 'highwood#link#J_LBowDiv_J_HW8#23' ? 'selected-button' : '')} >Little Bow Diversion</p>
                        <p onClick={this.props.onPlaceSelect} id='highwood#reservoir#R2_WomenCR#1' className={"highwood " + (selectedPlace == 'highwood#reservoir#R2_WomenCR#1' ? 'selected-button' : '')} >Women's Coulee Reservoir</p>
                        <p onClick={this.props.onPlaceSelect} id='highwood#link#J_MosqCr_MW_302_ClearL#18' className={"highwood " + (selectedPlace == 'highwood#link#J_MosqCr_MW_302_ClearL#18' ? 'selected-button' : '')} >Clear Lake Diversion</p>
                        <p onClick={this.props.onPlaceSelect} id='highwood#link#J_HW9_MW_401_FrankL#38' className={"highwood " + (selectedPlace == 'highwood#link#J_HW9_MW_401_FrankL#38' ? 'selected-button' : '')} >Frank Lake Diversion</p>
                        <p onClick={this.props.onPlaceSelect} id='highwood#inflow#In_SheepRMouth_Nat#2' className={"highwood " + (selectedPlace == 'highwood#inflow#In_SheepRMouth_Nat#2' ? 'selected-button' : '')} >Sheep Mouth Inflow</p>
                    </div>
                </div>

            </div>
        );
    }
}


// image courtesy of South East Alberta Watershed Alliance