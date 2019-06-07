import React, { Component } from 'react'

export default class StatCard extends Component {
    constructor(props) {
        super(props);
    }
    //types: success, danger, info, warning
    //arrow: positive, negative

    render() {
        return (
            <div className={"statcard statcard-" + this.props.type}  >
                <div className="p-a">
                    <span className="statcard-desc">{this.props.title}</span>
                    <h2 className="statcard-number">
                        {this.props.major}%
                        <small className={"delta-indicator delta-" + this.props.arrow}>{this.props.minor}%</small>
                    </h2>
                    <hr className="statcard-hr m-b-0" />
                </div>
            </div >
        )
    }
}
