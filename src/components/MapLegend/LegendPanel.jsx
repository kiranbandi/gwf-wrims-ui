import React, { Component } from 'react'
import * as d3 from 'd3';
import _ from 'lodash';
import { line, scaleLinear } from 'd3';


export default class LegendPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (

            <div id='map-legend' className='legend-root-container '>
                <svg width="200" height="25">
                    <text fontSize="20px" x='65' y='25' className="legend-label">LEGEND</text>

                </svg>
                <div>
                    <div className='filter-div'>
                        <svg width="200" height="200">
                            <g key={'marker-gray'} className='river-marker'
                                transform={"translate(5, 5) scale(0.08)"}>
                                <circle
                                    cx='150' cy='150' r='200'
                                    className={'type-inflow'}>
                                </circle>
                            </g>
                            <text x="65" y="13" fontSize="10px" className="legend-label" transform={"translate(5, 5)"}>
                                - Inflow Marker</text>
                            <g key={'marker-blue'} className='river-marker'
                                transform={"translate(5, 45) scale(0.08)"}>
                                <circle
                                    cx='150' cy='150' r='200'
                                    className={'type-demand'}>
                                </circle>
                            </g>
                            <g key={'marker-blue-image'} className='river-marker'
                                transform={"translate(5, 44) scale(0.055)"}>
                                <path id="XMLID_845_" d="M300,240.715V155l-120,85.715V155h-30V85h-30v70H90V35H30v120H0v230h420V155L300,240.715z M160,335h-40
                                v-40h40V335z M230,335h-40v-40h40V335z M300,335h-40v-40h40V335z"/>
                            </g>
                            <text x="65" y="13" fontSize="10px" className="legend-label" transform={"translate(5, 45)"}>
                                - Demand Marker</text>
                            <g key={'marker-green'} className='river-marker'
                                transform={"translate(5, 85) scale(0.08)"}>
                                <circle
                                    cx='150' cy='150' r='200'
                                    className={'type-agri'}>
                                </circle>
                            </g>
                            <g key={'marker-green-image'} className='river-marker'
                                transform={"translate(5, 86) scale(0.048)"}>
                                <path d="m512 54.1875v-29.941406c-16.90625 0-32.179688 7.097656-43.023438 18.457031l-6.578124-15.863281c-3.707032-8.945313-12.363282-14.726563-22.046876-14.726563-9.683593 0-18.335937 5.78125-22.046874 14.726563l-6.621094 15.96875c-10.847656-11.421875-26.164063-18.5625-43.125-18.5625v29.941406c16.304687 0 29.570312 13.265625 29.570312 29.570312v.5h.039063c.078125 8.078126 2.464843 16.082032 7.097656 23.023438 4.957031 7.421875 12.023437 12.945312 20.113281 16.011719v41.917969l-19.296875-22.066407-33.511719 30.597657 20.191407 22.113281 10.917969-9.96875 21.703124 24.816406v32.75l-19.296874-22.066406-33.511719 30.59375 20.191406 22.113281 10.917969-9.964844 21.699218 24.8125v24.25c-51.421874-6.140625-103.070312-9.523437-154.371093-10.082031v-26.28125l21.699219-24.816406 10.917968 9.96875 20.191406-22.113281-33.511718-30.597657-19.296875 22.066407v-32.75l21.699219-24.816407 10.917968 9.96875 20.191406-22.113281-33.511718-30.597656-19.296875 22.070312v-41.917968c8.09375-3.070313 15.160156-8.59375 20.117187-16.015626 5.082032-7.613281 7.464844-16.507812 7.054688-25.378906.960937-15.441406 13.824218-27.710937 29.503906-27.710937v-29.945313c-16.90625 0-32.179688 7.097656-43.023438 18.457032l-6.582031-15.859376c-3.707031-8.945312-12.363281-14.726562-22.046875-14.726562s-18.335937 5.78125-22.046875 14.726562l-6.621093 15.96875c-10.847657-11.421874-26.164063-18.566406-43.125-18.566406v29.945313c16.304687 0 29.570312 13.265625 29.570312 29.570312v.496094h.039062c.074219 8.082031 2.460938 16.085937 7.097657 23.027344 4.957031 7.421875 12.023437 12.945312 20.113281 16.011719v41.917968l-19.296875-22.066406-33.511719 30.597656 20.191406 22.113282 10.917969-9.96875 21.699219 24.816406v32.75l-19.292969-22.070313-33.511719 30.597657 20.1875 22.113281 10.917969-9.964844 21.699219 24.8125v26.28125c-51.179688.542969-102.800781 3.890625-154.296875 9.988281v-24.152344l21.699219-24.816406 10.917968 9.96875 20.191407-22.113281-33.511719-30.597656-19.296875 22.070312v-32.753906l21.699219-24.8125 10.917968 9.964844 20.191407-22.113281-33.507813-30.597657-19.296875 22.070313v-41.917969c8.089844-3.066406 15.15625-8.59375 20.113281-16.015625 5.085938-7.613281 7.46875-16.511719 7.054688-25.378906.964844-15.441406 13.824219-27.710938 29.503906-27.710938v-29.945312c-16.90625 0-32.179687 7.101562-43.023437 18.460937l-6.574219-15.863281c-3.710938-8.949219-12.363281-14.730469-22.050781-14.730469-9.683594 0-18.335938 5.78125-22.046875 14.726563l-6.621094 15.96875c-10.851562-11.417969-26.164062-18.5625-43.125-18.5625v29.941406c16.304688 0 29.570312 13.265625 29.570312 29.570312v.5h.039063c.078125 8.078126 2.460937 16.082032 7.097656 23.023438 4.957031 7.421875 12.023438 12.945312 20.113281 16.015625v41.917969l-19.296874-22.070313-33.511719 30.597657 20.191406 22.113281 10.917969-9.96875 21.703125 24.816406v32.75l-19.300781-22.066406-33.511719 30.597656 20.191406 22.113281 10.917969-9.96875 21.703125 24.816406v28.007813c-14.816407 2.0625-29.609375 4.347656-44.367188 6.863281l-12.45312475 2.125v90.394532h510.98828175v-90.382813l-12.441407-2.132813c-14.371093-2.46875-28.785156-4.707031-43.226562-6.738281v-28.136719l21.699219-24.816406 10.917968 9.96875 20.191406-22.113281-33.511718-30.597656-19.292969 22.066406v-32.75l21.699219-24.8125 10.917968 9.964844 20.191407-22.113281-33.511719-30.597657-19.300781 22.070313v-41.917969c8.09375-3.070313 15.15625-8.59375 20.117187-16.015625 5.082032-7.613281 7.464844-16.507812 7.050782-25.378906.964843-15.441406 13.828124-27.714844 29.507812-27.714844zm0 0"
                            /></g>
                            <text x="65" y="13" fontSize="10px" className="legend-label" transform={"translate(5, 85)"}>
                                - Agri Marker</text>
                            <g key={'reservoir-cyan'} className='river-marker'
                                transform={"translate(8, 125) scale(0.11)"}>
                                <circle cx='150' cy='150' r='200'
                                    className={'type-reservoir'}
                                />
                            </g>
                            <g key={'reservoir-cyan-image'} className='river-marker'
                                transform={"translate(13.5, 124) scale(0.07)"}>
                               <path d="m153.785156 221.5c8.269532 0 15-6.730469 15-15 0-5.617188-8.121094-19.28125-15-28.609375-6.882812 9.328125-15 22.992187-15 28.609375 0 8.269531 6.726563 15 15 15zm0 0"/><path d="m18.785156 234c0 33.136719 26.863282 60 60 60h150c33.136719 0 60-26.863281 60-60v-135h-270zm106.042969-67.074219c3.6875-5.496093 7.71875-10.777343 11.34375-14.878906 4.71875-5.339844 9.964844-10.546875 17.613281-10.546875 7.644532 0 12.894532 5.207031 17.609375 10.546875 3.628907 4.101563 7.65625 9.382813 11.34375 14.878906 10.644531 15.863281 16.046875 29.175781 16.046875 39.574219 0 24.8125-20.1875 45-45 45s-45-20.1875-45-45c0-10.398438 5.398438-23.710938 16.042969-39.574219zm0 0"/><path d="m160.050781 1.371094c-3.976562-1.828125-8.558593-1.828125-12.535156 0l-147.015625 67.628906h306.566406zm0 0"/><path d="m168.738281 361.832031v-37.871093h-30v38.136718l-38.140625-38.136718h-56.8125v173.039062c0 6.066406 3.652344 11.535156 9.257813 13.859375 1.855469.765625 3.804687 1.140625 5.738281 1.140625 3.902344 0 7.738281-1.523438 10.609375-4.394531l69.347656-69.347657v58.742188c0 8.285156 6.714844 15 15 15 8.285157 0 15-6.714844 15-15v-58.832031l69.4375 69.4375c2.871094 2.871093 6.707031 4.394531 10.609375 4.394531 1.933594 0 3.882813-.375 5.738282-1.140625 5.605468-2.324219 9.257812-7.792969 9.257812-13.859375v-173.039062h-57.171875zm-94.953125 98.953125v-121.214844l60.605469 60.609376zm160 0-60.789062-60.785156 60.789062-60.789062zm0 0"/>
                             </g>
                            <text x="65" y="20" fontSize="10px" className="legend-label" transform={"translate(5, 125)"}>
                                - Reservoir Marker</text>
                        </svg>
                    </div>

                    <div className='filter-div'>
                        <svg className='flow-data-chart'>
                            <g className='lines-container'>
                                <path className='flow-spark-line'
                                    transform={"translate(5, 5)"}
                                    key={'river-line-gray'}
                                    d=" M 5 10 L 60 10"
                                    stroke={'#5c6b84'}
                                    strokeWidth={'2.25'}
                                    className={'river forward-flow'}
                                />
                                <text x="65" y="13" fontSize="10px" className="legend-label" transform={"translate(5, 5)"}>
                                    - Inflow Flow</text>
                                <path className='flow-spark-line'
                                    transform={"translate(5, 45)"}
                                    key={'river-line-blue'}
                                    d=" M 5 10 L 60 10"
                                    stroke={'#428dff'}
                                    strokeWidth={'2.25'}
                                    className={'river forward-flow'}
                                />
                                <text x="65" y="13" fontSize="10px" className="legend-label" transform={"translate(5, 45)"}>
                                    - Demand Flow</text>
                                <path className='flow-spark-line'
                                    transform={"translate(5, 85)"}
                                    key={'river-line-green'}
                                    d=" M 5 10 L 60 10"
                                    stroke={'#51a83a'}
                                    strokeWidth={'2.25'}
                                    className={'river forward-flow'}
                                />
                                <text x="65" y="13" fontSize="10px" className="legend-label" transform={"translate(5, 85)"}>
                                    - Agri Flow</text>
                                <path className='flow-spark-line'
                                    transform={"translate(5, 125)"}
                                    key={'river-line-orange'}
                                    d=" M 5 10 L 60 10"
                                    stroke={'#f7a02e'}
                                    strokeWidth={'2.25'}
                                    className={'river forward-flow'}
                                />
                                <text x="65" y="13" fontSize="10px" className="legend-label" transform={"translate(5, 125)"}>
                                    - River Flow</text>
                            </g>

                        </svg>
                    </div>
                </div>
            </div>
        );
    }
}
