import React from 'react';

export default (props) => {

    const { labels = [], xScale, yScale } = props,
        // font-size relative to the size of the screen
        fontScale = Math.round((xScale(1) - xScale(0)) / 0.3);

    const labelsList = _.map(labels, (label, index) => {

        const { name, coords } = label;

        return (
            <text key={'label-' + index}
                x={xScale(coords[0])}
                y={yScale(coords[1])}
                fontSize={fontScale + 'px'}
                className='river-label'>
                {name}
            </text >)
    })

    return (<g className='river-labels-container'>{labelsList}</g>)
}
