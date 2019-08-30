import React, { Component } from 'react';
import _ from 'lodash';
import LegendIcon from '../MapLegend/LegendIcon'

export default class Markers extends Component {
    // Artifacts may either be reservoirs or sinks
    constructor(props) {
        super(props);
        this.onArtifactClick = this.onArtifactClick.bind(this);
    }

    /**
     * Serves as the onClick for markers
     * @param {*} artifact An interactable marker on the rivermap 
     */
    onArtifactClick(artifact) {
        this.props.onItemClick('artifact', artifact);
    }

    render() {

        let { artifacts = [], xScale, yScale, highlightName = '' } = this.props,
            // scale relative to the size of the screen
            reservoirIconScale = (xScale(1) - xScale(0)) / 90;
        let tempOffset = reservoirIconScale * 150;
        // Reservoirs may either be normal reservoirs or power reservoirs
        const reservoirList = _.map(_.filter(artifacts, (d) => d.type == 'reservoir'),
            (reservoir, index) => {
                let isPowerReservoir = ["R1_LDief", "R6_Cod", "R7_Tobin"].includes(reservoir.name);
                const { coords, size = 1 } = reservoir;
                return <g key={'reservoir-' + index} className={'reservoir' + ((highlightName == reservoir.name) ? ' highlight' : '')}
                    onDoubleClick={this.onArtifactClick.bind(this, reservoir)}
                    transform={"translate(" + (+xScale(coords[0]) - (tempOffset)) + "," + (+yScale(coords[1]) - (tempOffset)) + ") scale(" + (size * reservoirIconScale) + ")"}>
                    {isPowerReservoir ?
                        <LegendIcon
                            title={"POWER RESERVOIR"}
                            hasText={false}
                            circleTransform={"translate(0, -15) scale(1)"}
                            imageTransform={"translate(50, -15) scale(0.65)"}
                            type={"reservoir"}
                        />
                        :
                        <LegendIcon
                            title={"RESERVOIR"}
                            hasText={false}
                            circleTransform={"translate(0, 0) scale(1)"}
                            imageTransform={"translate(50, -15) scale(0.65)"}
                            type={"reservoir"}
                        />
                    }
                    <title>{reservoir.name}</title>
                </g>
            })

        const sinkList = _.map(_.filter(artifacts, (d) => d.type == 'sink'),
            (sink, index) => {
                const { coords, size = 1 } = sink;
                return <g key={'sink-' + index} className={'sink' + ((highlightName == sink.name) ? ' highlight' : '')}
                    transform={"translate(" + (+xScale(coords[0]) - (tempOffset)) + "," + (+yScale(coords[1]) - (tempOffset)) + ") scale(" + (size * reservoirIconScale) + ")"}>
                    <circle className="sinkBorder" cx='150' cy='150' r='200'></circle>
                    <g transform={"translate(-40, -40) scale(0.75)"}>
                        <path d="M256,0C114.615,0,0,114.615,0,256s114.615,256,256,256s256-114.615,256-256S397.385,0,256,0z M256,480 C132.288,480,32,379.712,32,256S132.288,32,256,32s224,100.288,224,224S379.712,480,256,480z" />
                        <circle cx="256" cy="256" r="32" />
                        <circle cx="368" cy="256" r="32" />
                        <circle cx="144" cy="256" r="32" />
                        <title>{sink.name}</title>
                    </g>
                </g>
            })

        return (<g className='artifacts-container'>{[...reservoirList, ...sinkList]}</g>)
    }
}
