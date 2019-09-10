/*global $*/
import React, { Component } from 'react';
import { line } from 'd3';
import tileMap from '../utils/static-reference/tileMap';
import readwareBlobs from '../utils/static-reference/readwareBlobs';
import Switch from "react-switch";
import { BasinMap, UserActivityPanel } from '../components';
import { compose, bindActionCreators } from 'redux';
import { firestoreConnect } from 'react-redux-firebase'
import { connect } from 'react-redux'

//  Image url handling is convoluted in scss , much easier to set inline and get images from root
let backgroundStyleSchematic = { background: 'url(assets/img/overall.png)', backgroundSize: '100%' };

class RootSchematic extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isMapShown: false,
        };
        this.getTiles = this.getTiles.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }


    handleChange() {
        this.setState({ isMapShown: !this.state.isMapShown });
    }

    getTiles(width, height) {
        return _.map(tileMap, (tile, tileIndex) => {
            const pathData = tile.boundingPath.map(function (d) {
                return [Math.round(d[0] * width), Math.round(d[1] * height)];
            });
            return <path
                id={tile.tileID}
                d={line()(pathData)}
                className='tile'
                stroke={tile.color}
                onClick={this.props.onRegionSelect}
                key={'tile-index-' + tileIndex}>
                <title>{tile.tileName}</title>
            </path>
        })
    }

    getReadwareBlobs = (width, height, activeBasinUsers) => {
        return Object.keys(readwareBlobs).map((basin, idx) => {

            if (activeBasinUsers[basin]) {
                let userCount = activeBasinUsers[basin].users.length;

                let titleText = userCount === 1? `1 user is active on this basin` : `${userCount} users are active on this basin`;

                let countWeight = (userCount < 10)? " light" : (userCount < 100)? " medium" : " heavy";

                if (userCount !== 0) {
                    return (<g className="readware-blob" transform={`translate(${Math.round(readwareBlobs[basin].coords[0] * width)}, ${Math.round(readwareBlobs[basin].coords[1] * height)})`} key={idx}>
                                <circle r={`10.5px`} fill={`red`}></circle>
                                <text className={"readware-blob-text" + countWeight}>{userCount}</text>
                                <title>{titleText}</title>
                            </g>)
                }
            }
        }) 
    }

    render() {

        let { width = 1000, selectedPlace, mode }  = this.props, { isMapShown } = this.state;

        const { activeUsers, activeBasinUsers, userData, trackedUser } = this.props;

        let isModeZero = (mode === 0);

        if (mode !== 1) {
            isMapShown = true;
        }

        if (mode === 3) {
            isMapShown = false;
        }
        // downscale selectively based on the content being shown
        width = width * (isMapShown ? 1 : 0.75);
        backgroundStyleSchematic = { ...backgroundStyleSchematic, width: width, height: width / 2.15 };

        return (
            <div className='root-schema-container'>
                <div className='schema-selection-container' style={{ width: width }}>
                    {(mode !== 3)  && <h2 className='text-primary switch-custom-label'>Basin Map</h2>}
                    {(!isModeZero && (mode !== 3))  &&
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
                        </div>}

                    {(mode === 3)
                        ?
                        <h2 className='text-primary m-l'> Select a <b>Region</b> to Investigate</h2>
                        :
                        <h2 className='text-primary m-l'> Select a <b>Region</b> to Investigate or Pick a <b>Place</b></h2>}

                    {isMapShown ?
                        <BasinMap
                            width={width}
                            onPlaceSelect={this.props.onPlaceSelect}
                            onRegionSelect={this.props.onRegionSelect} /> :
                        <div id='root-schema' className='image-container' style={backgroundStyleSchematic}>
                            <svg className='tile-container' width={width} height={width / 2.15}>
                                <g className="root-schematic-tiles">{this.getTiles(width, width / 2.15)}</g>
                                {(mode === 3) && <g className="root-schematic-readware-blobs">{this.getReadwareBlobs(width, (width / 2.15), activeBasinUsers)}</g>}
                            </svg>
                        </div>}
                </div>
                {(mode === 3) &&
                    <UserActivityPanel 
                        width={width} 
                        activeUsers={activeUsers} 
                        activeBasinUsers={activeBasinUsers} 
                        userData={userData} 
                        onTrackedUserSelect={this.props.onTrackedUserSelect}
                        trackedUser={trackedUser}/> }
                {(!isMapShown && mode !== 3) && <div className='place-selection-container'>
                    <h2 className='text-primary'>Places of Interest</h2>
                    <div className='list-container'>
                        {/* bad idea to attach so many events , need to refactor and attach single event to parent */}
                        {/* id is model#type#name#number */}
                        <p onClick={this.props.onPlaceSelect} id='southSask#link#J_3_J1_RF#8' className={selectedPlace == 'southSask#link#J_3_J1_RF#8' ? 'selected-button' : ''}>City of Saskatoon</p>
                        <p onClick={this.props.onPlaceSelect} id='southSask#link#J2_RF_J_38#98' className={selectedPlace == 'southSask#link#J2_RF_J_38#98' ? 'selected-button' : ''}>Cumberland Delta</p>
                        <p onClick={this.props.onPlaceSelect} id='southSask#reservoir#R1_LDief#1' className={selectedPlace == 'southSask#reservoir#R1_LDief#1' ? 'selected-button' : ''}>Diefenbaker Lake</p>
                        <p onClick={this.props.onPlaceSelect} id='southSask#demand#QuAppelle_0#14' className={selectedPlace == 'southSask#demand#QuAppelle_0#14' ? 'selected-button' : ''}>Qu'Appelle Withdrawal</p>
                        <p onClick={this.props.onPlaceSelect} id='southSask#inflow#In76_SWIFTCCr#61' className={selectedPlace == 'southSask#inflow#In76_SWIFTCCr#61' ? 'selected-button' : ''}>Swift Current Creek</p>
                        <p onClick={this.props.onPlaceSelect} id='southSask#inflow#In5_PrinceA#79' className={selectedPlace == 'southSask#inflow#In5_PrinceA#79' ? 'selected-button' : ''}>Prince Albert Inflow</p>
                        <p onClick={this.props.onPlaceSelect} id='highwood#link#J_LBowDiv_J_HW8#23' className={"highwood " + (selectedPlace == 'highwood#link#J_LBowDiv_J_HW8#23' ? 'selected-button' : '')} >Little Bow Diversion</p>
                        <p onClick={this.props.onPlaceSelect} id='highwood#reservoir#R2_WomenCR#1' className={"highwood " + (selectedPlace == 'highwood#reservoir#R2_WomenCR#1' ? 'selected-button' : '')} >Women's Coulee Reservoir</p>
                        <p onClick={this.props.onPlaceSelect} id='highwood#link#J_MosqCr_MW_302_ClearL#18' className={"highwood " + (selectedPlace == 'highwood#link#J_MosqCr_MW_302_ClearL#18' ? 'selected-button' : '')} >Clear Lake Diversion</p>
                        <p onClick={this.props.onPlaceSelect} id='highwood#link#J_HW9_MW_401_FrankL#38' className={"highwood " + (selectedPlace == 'highwood#link#J_HW9_MW_401_FrankL#38' ? 'selected-button' : '')} >Frank Lake Diversion</p>
                    </div>
                </div>}
            </div>
        );
    }
}




export default RootSchematic;