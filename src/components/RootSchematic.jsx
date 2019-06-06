/*global $*/
import React, { Component } from 'react';

//  Image url handling is convoluted in scss , much easier to set inline and get images from root
let backgroundStyle = { background: 'url(assets/img/overall.png)', backgroundSize: '100%' };

export default class RootSchematic extends Component {

    constructor(props) {
        super(props);
    }


    render() {

        let { width = 1000 } = this.props;
        // downscale by 20%
        width = width * .80;
        backgroundStyle = { ...backgroundStyle, width: width, height: width / 2.15 }

        return (
            <div className='root-schema-container'>
                <div className='schema-selection-container'>
                    <h2 className='text-primary'>Select a region to investigate</h2>
                    <div className='image-container' style={backgroundStyle}>
                        <div className='selection-box' id='highwood' onClick={this.props.onRegionSelect} style={{ top: width * 0.245, left: 0.175 * width }}></div>
                        <div className='selection-box' id='southSask' onClick={this.props.onRegionSelect} style={{ top: width * 0.15, left: 0.7 * width }}></div>
                        <div className='selection-box' id='cumberlandDelta' onClick={this.props.onRegionSelect} style={{ top: width * 0.01, left: 0.85 * width }}></div>
                    </div>
                </div>
            </div>
        );
    }
}

