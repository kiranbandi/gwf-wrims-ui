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

        let { width = 1000 } = this.props;
        // downscale by 20%
        width = width * .75;
        backgroundStyle = { ...backgroundStyle, width: width, height: width / 2.15 };

        return (
            <div className='root-schema-container'>
                <div className='schema-selection-container' style={{ width: width }}>
                    <h2 className='text-primary'>Select a region to get started</h2>
                    <div id='root-schema' className='image-container' style={backgroundStyle}>
                        <svg className='tile-container' width={width} height={width / 2.15}>
                            {this.getTiles(width, width / 2.15)}
                        </svg>
                    </div>
                </div>
            </div>
        );
    }
}

