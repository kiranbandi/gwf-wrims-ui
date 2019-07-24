import React, { Component } from 'react'

export default class ModeCard extends Component {
    
    constructor(props) {
        super(props);
    }
    
    
    render() {

        const { title = "", text = "", onClick = {}, innerElements= [], className } = this.props;

        return (
            <div className="mode-card-root" onClick={onClick}>
                <div className="mode-card-content">
                    <div className="mode-card-title"><b>{title}</b></div>
                    <div className="mode-card-text">{text}</div>
                    {innerElements}
                </div>
            </div>
        )
    }
}
