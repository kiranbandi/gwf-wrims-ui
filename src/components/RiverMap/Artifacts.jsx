import React, { Component } from 'react';
import _ from 'lodash';

export default class Markers extends Component {

    constructor(props) {
        super(props);
        this.onArtifactClick = this.onArtifactClick.bind(this);
    }

    onArtifactClick(artifact) {
        this.props.onItemClick('artifact', artifact);
    }

    render() {

        let { artifacts = [], xScale, yScale } = this.props,
            // scale relative to the size of the screen
            reservoirIconScale = (xScale(1) - xScale(0)) / 90;

        const reservoirList = _.map(_.filter(artifacts, (d) => d.type == 'reservoir'),
            (reservoir, index) => {
                const { coords, size = 1 } = reservoir;
                return <g key={'reservoir-' + index} className='reservoir'
                    onDoubleClick={this.onArtifactClick.bind(this, reservoir)}
                    transform={"translate(" + (+xScale(coords[0]) - (10)) + "," + (+yScale(coords[1]) - (10)) + ") scale(" + (size * reservoirIconScale) + ")"}>
                    <circle cx='150' cy='150' r='200'></circle>
                    <g key={'reservoir-cyan-image'} className='river-marker'
                        transform={"translate(50, -15) scale(0.65)"}>
                        <path d="m153.785156 221.5c8.269532 0 15-6.730469 15-15 0-5.617188-8.121094-19.28125-15-28.609375-6.882812 9.328125-15 22.992187-15 28.609375 0 8.269531 6.726563 15 15 15zm0 0" /><path d="m18.785156 234c0 33.136719 26.863282 60 60 60h150c33.136719 0 60-26.863281 60-60v-135h-270zm106.042969-67.074219c3.6875-5.496093 7.71875-10.777343 11.34375-14.878906 4.71875-5.339844 9.964844-10.546875 17.613281-10.546875 7.644532 0 12.894532 5.207031 17.609375 10.546875 3.628907 4.101563 7.65625 9.382813 11.34375 14.878906 10.644531 15.863281 16.046875 29.175781 16.046875 39.574219 0 24.8125-20.1875 45-45 45s-45-20.1875-45-45c0-10.398438 5.398438-23.710938 16.042969-39.574219zm0 0" /><path d="m160.050781 1.371094c-3.976562-1.828125-8.558593-1.828125-12.535156 0l-147.015625 67.628906h306.566406zm0 0" /><path d="m168.738281 361.832031v-37.871093h-30v38.136718l-38.140625-38.136718h-56.8125v173.039062c0 6.066406 3.652344 11.535156 9.257813 13.859375 1.855469.765625 3.804687 1.140625 5.738281 1.140625 3.902344 0 7.738281-1.523438 10.609375-4.394531l69.347656-69.347657v58.742188c0 8.285156 6.714844 15 15 15 8.285157 0 15-6.714844 15-15v-58.832031l69.4375 69.4375c2.871094 2.871093 6.707031 4.394531 10.609375 4.394531 1.933594 0 3.882813-.375 5.738282-1.140625 5.605468-2.324219 9.257812-7.792969 9.257812-13.859375v-173.039062h-57.171875zm-94.953125 98.953125v-121.214844l60.605469 60.609376zm160 0-60.789062-60.785156 60.789062-60.789062zm0 0" />
                    </g>
                    <title>{reservoir.name}</title>
                </g>
            })

        const sinkList = _.map(_.filter(artifacts, (d) => d.type == 'sink'),
            (sink, index) => {
                const { coords, size = 1 } = sink;
                return <g key={'sink-' + index} className='sink'
                    transform={"translate(" + (+xScale(coords[0]) - (10)) + "," + (+yScale(coords[1]) - (10)) + ") scale(" + (size * reservoirIconScale) + ")"}>
                    <circle cx='150' cy='150' r='200'></circle>
                    <text x='75' y='225'>S</text>
                    <title>{sink.name}</title>
                </g>
            })

        return (<g className='artifacts-container'>{[...reservoirList, ...sinkList]}</g>)
    }
}

