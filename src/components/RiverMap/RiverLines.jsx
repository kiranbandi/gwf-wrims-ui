import React, { Component } from 'react';
import { line } from 'd3';
import _ from 'lodash';

export default class RiverLines extends Component {

    constructor(props) {
        super(props);
        this.onLinkClick = this.onLinkClick.bind(this);
    }

    onLinkClick(link) {
        this.props.onItemClick('link', link);
    }

    render() {
        const { lines, xScale, yScale, lineWidth } = this.props;

        _.map(lines, (line) => {
            const { shiftCoords = [0, 0] } = line;
            line.newNodes = _.map(line.nodes, (innerD) => {
                return { x: xScale(innerD.coords[0] + shiftCoords[0]), y: yScale(innerD.coords[1] + shiftCoords[1]) };
            })
        });
        const d3Line = line().x((d) => d.x).y((d) => d.y);

        return (
            <g className='lines-container'>
                {_.map(lines, (d, index) => {
                    return <path
                        onDoubleClick={this.onLinkClick.bind(this, d)}
                        key={'river-line-' + index}
                        id={d.name}
                        d={d3Line(d.newNodes)}
                        strokeWidth={lineWidth}
                        className={'flowLine type-' + (d.type) + " " + (d.reverse ? 'reverse-flow' : 'forward-flow')}>
                    </path>
                })}
            </g>)
    }
}

