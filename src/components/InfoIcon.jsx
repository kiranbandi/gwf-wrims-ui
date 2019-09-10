import React, { Component } from 'react'

export default class InfoIcon extends Component {
   
    constructor(props) {
        super(props);
    }

    render() {

        const { xOffset = 0, yOffset = 0, onClick = () => { return; }, hoverText = "", style = {} } = this.props;

        return (
            <div className="info-icon" title={hoverText} style={{...style, transform: `translate(${xOffset}px, ${yOffset}px)`}} onClick={onClick}>
                <span className="icon icon-info-with-circle sample-icon"></span>
            </div>
        )
    }
}
