/*global $*/
import React, { Component } from 'react';
import * as d3 from 'd3';
import tileMap from '../utils/tileMap';

//  Image url handling is convoluted in scss , much easier to set inline and get images from root
let backgroundStyle = { background: 'url(assets/img/overall.png)', backgroundSize: '100%' };

export default class RootSchematic extends Component {

    constructor(props) {
        super(props);
        this.getTiles = this.getTiles.bind(this);
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

        let { width = 1000, selectedPlace } = this.props;
        // downscale by 20%
        width = width * .75;
        backgroundStyle = { ...backgroundStyle, width: width, height: width / 2.15 };

        return (
            <div className='root-schema-container'>
                <div className='schema-selection-container' style={{ width: width }}>
                    <h2 className='text-primary'>Select a <b>Region</b> to Investigate or Pick a <b>Place</b></h2>
                    <div id='root-schema' className='image-container' style={backgroundStyle}>
                        <svg className='tile-container' width={width} height={width / 2.15}>
                            {this.getTiles(width, width / 2.15)}
                        </svg>
                    </div>
                </div>
                <div className='place-selection-container'>
                    <h2 className='text-primary'>Places of Interest</h2>
                    <div className='list-container'>
                        {/* bad idea to attach so many events , need to refactor and attach single event to parent */}
                        {/* id is model#type#name#number */}
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
