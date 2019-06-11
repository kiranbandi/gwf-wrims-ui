/*global $*/
import React, { Component } from 'react';
import * as d3 from 'd3';

//  Image url handling is convoluted in scss , much easier to set inline and get images from root
let backgroundStyle = { background: 'url(assets/img/overall.png)', backgroundSize: '100%' };

export default class RootSchematic extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let { width = 1000 } = this.props;
        // downscale by 20%
        width = width * .75;

        var height = (width / 2.15);

        var svg = d3.select(".image-container")
            .append("svg")
            .attr("width", width)
            .attr("height", height);


        var tiles = [
            {
                tileName: "highwood",
                color: "#fff4f785",
                hoverColor: "#ff6e95ab",

                boundingPath: [
                    [0.149500, 0.567571],
                    [0.2566555, 0.567571],
                    [0.2753575, 0.611429],
                    [0.2753575, 0.72500],
                    [0.149500, 0.72500],
                    [0.149500, 0.56450]
                ]
            },
            {
                tileName: "southSask",
                color: "#c8eac02d",
                hoverColor: "#68ff4698",

                boundingPath: [
                    [0.700000, 0.020429],
                    [0.993500, 0.020429],
                    [0.993500, 0.641000],
                    [0.582400, 0.641000],
                    [0.582400, 0.395714],
                    [0.636500, 0.395714],
                    [0.723571, 0.204286],
                    [0.702143, 0.155714],
                    [0.702143, 0.021429]
                ]
            }
        ]

        tiles.forEach((t) => {
            let pathData = t.boundingPath.map(function (d) {
                return [Math.round(d[0] * width), Math.round(d[1] * (height * .985))];
            });

            let area = d3.line()(pathData);

            svg.append("path")
                .attr("class", t.tileName)
                .attr("d", area)
                .style("fill", "transparent")
                .style("stroke", t.color)
                .style("stroke-width", "6.2px")
                .on('mouseover', function () {
                    // select element in current context
                    d3.select(this)
                        .style("fill", "transparent")
                        .style("stroke", t.hoverColor)
                        .style("stroke-width", "6.2px");
                }).on('mouseout', function () {
                    // select element in current context
                    d3.select(this)
                        .style("fill", "transparent")
                        .style("stroke", t.color)
                        .style("stroke-width", "6.2px");
                });
        })


    }


    render() {

        let { width = 1000 } = this.props;
        // downscale by 20%
        width = width * .75;
        backgroundStyle = { ...backgroundStyle, width: width, height: width / 2.15 }

        return (
            <div className='image-container' style={backgroundStyle}>
                {/* <div className='selection-box' id='highwood' onClick={this.props.onRegionSelect} style={{ top: width * 0.245, left: 0.175 * width }}></div> */}
                {/* <div className='selection-box' id='southSask' onClick={this.props.onRegionSelect} style={{ top: width * 0.15, left: 0.7 * width }}></div> */}
            </div>
            // <div className='root-schema-container'>
            //     <div className='schema-selection-container' style={{ width: width }}>
            //         <h2 className='text-primary'>Select a region to investigate</h2>
            //         <div className='image-container' style={backgroundStyle}>
            //             {/* <div className='selection-box' id='highwood' onClick={this.props.onRegionSelect} style={{ top: width * 0.245, left: 0.175 * width }}></div> */}
            //             {/* <div className='selection-box' id='southSask' onClick={this.props.onRegionSelect} style={{ top: width * 0.15, left: 0.7 * width }}></div> */}
            //         </div>
            //     </div>
                // {/* <div style={{ width: width * 0.15 }}>
                //     <h2 className='text-primary'>Places of Interest</h2>
                // </div> */}
            // </div>
        );
    }
}

