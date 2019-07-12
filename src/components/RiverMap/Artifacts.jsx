import React, { Component } from 'react';
import _ from 'lodash';
import LegendIcon from '../MapLegend/LegendIcon'

export default class Markers extends Component {

    constructor(props) {
        super(props);
        this.onArtifactClick = this.onArtifactClick.bind(this);
    }

    onArtifactClick(artifact) {
        this.props.onItemClick('artifact', artifact);
    }

    render() {

        let { artifacts = [], xScale, yScale, highlightName = '' } = this.props,
            // scale relative to the size of the screen
            reservoirIconScale = (xScale(1) - xScale(0)) / 90;
        let tempOffset = reservoirIconScale * 150;

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
                    <circle cx='150' cy='150' r='200'></circle>
                    <text x='75' y='230'>S</text>
                    <title>{sink.name}</title>
                </g>
            })

        return (<g className='artifacts-container'>{[...reservoirList, ...sinkList]}</g>)
    }
}

