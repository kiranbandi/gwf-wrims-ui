import React, { Component } from 'react';
import { line } from 'd3';
import _ from 'lodash';
import { twoPointHull } from '../../utils/hullGenerator'

export default class RiverLines extends Component {

    constructor(props) {
        super(props);
        this.onLinkClick = this.onLinkClick.bind(this);
    }

    onLinkClick(link) {
        this.props.onItemClick('link', link);
    }

    render() {
        const { lines, xScale, yScale, lineWidth, highlightName = '', trackedLink } = this.props;

        _.map(lines, (line) => {
            const { shiftCoords = [0, 0] } = line;
            line.newNodes = _.map(line.nodes, (innerD) => {
                return { x: xScale(innerD.coords[0] + shiftCoords[0]), y: yScale(innerD.coords[1] + shiftCoords[1]) };
            })
        });
        const d3Line = line().x((d) => d.x).y((d) => d.y);

        let hullPoints = undefined;

        const linksList = _.map(lines, (d, index) => {
            if (trackedLink == d.name) { hullPoints = [[d.newNodes[0].x, d.newNodes[0].y], [d.newNodes[1].x, d.newNodes[1].y]]; }
            return <path
                onDoubleClick={this.onLinkClick.bind(this, d)}
                key={'river-line-' + index}
                id={d.name}
                d={d3Line(d.newNodes)}
                strokeWidth={lineWidth}
                className={((highlightName == d.name) ? 'highlight ' : ' ') + 'flowLine type-' + (d.type) + " " + (d.reverse ? 'reverse-flow' : 'forward-flow')}>
            </path>
        })

        return (
            <g className='lines-container'>
                {hullPoints &&
                     <path
                        fill={"transparent"}
                        stroke={`#fd9050`}
                        strokeWidth={"2.5px"}
                        d={twoPointHull(hullPoints, 13.5)}
                        className={"hull-path"}>
                    </path>}
                {linksList}
            </g>)
    }
}
