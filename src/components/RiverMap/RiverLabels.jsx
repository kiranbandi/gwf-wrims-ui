import React from 'react';

export default (props) => {

    const { labels = [], xScale, yScale, areLabelsVisible } = props, // *Added
        // font-size relative to the size of the screen
        fontScale = Math.round((xScale(1) - xScale(0)) / 0.3);
    // console.log(areLabelsVisible)

    const labelsList = _.map(labels, (label, index) => {

        const { name, coords } = label;
        if (areLabelsVisible) {  // *Added
            return (
                <text key={'label-' + index}
                    x={xScale(coords[0])}
                    y={yScale(coords[1])}
                    fontSize={fontScale + 'px'}
                    className='river-label'>
                    {name}
                </text >)
        } else {
            return
        }
    })
    return (<g className='river-labels-container'>{labelsList}</g>)
}

