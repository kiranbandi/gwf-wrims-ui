import React, { Component } from 'react'
import * as d3 from 'd3';

var snowflake = "M512.002,256c0-7.415-6.011-13.427-13.427-13.427h-21.127l20.113-20.113 c5.244-5.244,5.244-13.746,0-18.989s-13.745-5.244-18.989,0l-39.103,39.103h-19.875l20.113-20.113 c5.244-5.244,5.244-13.746,0-18.989c-5.245-5.244-13.746-5.244-18.989,0l-39.103,39.103h-93.197l65.901-65.901h55.299 c7.416,0,13.427-6.011,13.427-13.427s-6.011-13.427-13.427-13.427h-28.444l14.054-14.054h55.299c7.416,0,13.427-6.011,13.427-13.427 c0-7.416-6.011-13.427-13.427-13.427h-28.444l14.94-14.94c5.244-5.244,5.244-13.746,0-18.989c-5.244-5.244-13.746-5.244-18.989,0 l-14.94,14.94V61.475c0-7.416-6.011-13.427-13.427-13.427s-13.427,6.011-13.427,13.427v55.299l-14.054,14.054v-28.443 c0-7.416-6.011-13.427-13.427-13.427c-7.416,0-13.427,6.011-13.427,13.427v55.299l-65.901,65.901v-93.197l39.103-39.103 c5.244-5.244,5.244-13.746,0-18.989c-5.245-5.244-13.746-5.244-18.989,0l-20.114,20.113V72.533l39.103-39.103 c5.244-5.244,5.244-13.746,0-18.989c-5.245-5.244-13.746-5.244-18.989,0l-20.114,20.113V13.427C269.429,6.011,263.418,0,256.002,0 c-7.415,0-13.427,6.011-13.427,13.427v21.127l-20.113-20.113c-5.244-5.244-13.745-5.244-18.989,0 c-5.244,5.244-5.244,13.746,0,18.989l39.103,39.103v19.876l-20.113-20.113c-5.244-5.244-13.745-5.244-18.989,0 c-5.244,5.244-5.244,13.746,0,18.989l39.103,39.103v93.197l-65.901-65.901v-55.3c0-7.416-6.011-13.427-13.427-13.427 s-13.427,6.011-13.427,13.427v28.444l-14.054-14.054v-55.3c0-7.416-6.011-13.427-13.427-13.427c-7.416,0-13.427,6.011-13.427,13.427 v28.444L93.972,74.981c-5.244-5.244-13.746-5.244-18.989,0c-5.244,5.244-5.244,13.746,0,18.989l14.94,14.94H61.477 c-7.416,0-13.427,6.011-13.427,13.427s6.011,13.427,13.427,13.427h55.299l14.054,14.054h-28.443 c-7.416,0-13.427,6.011-13.427,13.427s6.011,13.427,13.427,13.427h55.299l65.901,65.901h-93.197L91.286,203.47 c-5.244-5.244-13.745-5.244-18.989,0c-5.244,5.244-5.244,13.746,0,18.989l20.113,20.113H72.535L33.432,203.47 c-5.244-5.244-13.745-5.244-18.989,0c-5.244,5.244-5.244,13.746,0,18.989l20.113,20.113H13.429c-7.416,0-13.427,6.012-13.427,13.427 c0,7.416,6.011,13.427,13.427,13.427h21.128l-20.113,20.114c-5.244,5.244-5.244,13.746,0,18.989 c2.622,2.622,6.058,3.933,9.494,3.933s6.873-1.311,9.494-3.933l39.103-39.103h19.876l-20.113,20.114 c-5.244,5.244-5.244,13.746,0,18.989c2.622,2.622,6.058,3.933,9.494,3.933s6.873-1.311,9.494-3.933l39.103-39.103h93.197 l-65.901,65.901h-55.299c-7.416,0-13.427,6.011-13.427,13.427c0,7.416,6.011,13.427,13.427,13.427h28.444l-14.054,14.054h-55.3 c-7.416,0-13.427,6.011-13.427,13.427s6.011,13.427,13.427,13.427h28.444l-14.94,14.94c-5.244,5.244-5.244,13.745,0,18.989 c2.622,2.622,6.058,3.933,9.494,3.933s6.873-1.311,9.494-3.933l14.94-14.94v28.444c0,7.416,6.011,13.427,13.427,13.427 c7.416,0,13.427-6.011,13.427-13.427v-55.299l14.054-14.054v28.444c0,7.416,6.011,13.427,13.427,13.427s13.427-6.011,13.427-13.427 v-55.299l65.901-65.901v93.197l-39.103,39.103c-5.244,5.244-5.244,13.746,0,18.989c5.244,5.244,13.746,5.244,18.989,0l20.113-20.113 v19.875l-39.103,39.103c-5.244,5.244-5.244,13.746,0,18.989c2.622,2.622,6.058,3.933,9.494,3.933c3.437,0,6.873-1.311,9.494-3.933 l20.113-20.113v21.127c0,7.416,6.012,13.427,13.427,13.427c7.416,0,13.427-6.011,13.427-13.427v-21.127l20.114,20.114 c5.244,5.244,13.746,5.244,18.989,0s5.244-13.745,0-18.989l-39.103-39.103v-19.876l20.114,20.114 c2.622,2.622,6.059,3.933,9.494,3.933s6.873-1.311,9.494-3.933c5.244-5.244,5.244-13.745,0-18.989l-39.103-39.103V288.42 l65.901,65.901v55.299c0,7.416,6.011,13.427,13.427,13.427c7.416,0,13.427-6.011,13.427-13.427v-28.444l14.054,14.054v55.299 c0,7.416,6.011,13.427,13.427,13.427s13.427-6.011,13.427-13.427v-28.444l14.94,14.94c2.622,2.622,6.059,3.933,9.494,3.933 c3.437,0,6.873-1.311,9.494-3.933c5.244-5.244,5.244-13.745,0-18.989l-14.94-14.94h28.444c7.416,0,13.427-6.011,13.427-13.427 c0-7.416-6.011-13.427-13.427-13.427h-55.299l-14.054-14.054h28.444c7.416,0,13.427-6.011,13.427-13.427 c0-7.416-6.011-13.427-13.427-13.427h-55.299l-65.901-65.901h93.197l39.103,39.103c2.622,2.622,6.059,3.933,9.494,3.933 s6.873-1.311,9.494-3.933c5.244-5.244,5.244-13.745,0-18.989l-20.114-20.114h19.876l39.103,39.103 c2.622,2.622,6.059,3.933,9.494,3.933c3.436,0,6.873-1.311,9.494-3.933c5.244-5.244,5.244-13.745,0-18.989l-20.114-20.114h21.127 C505.99,269.427,512.002,263.416,512.002,256z"
var sunshine = "";
var fish = "M353.165,182.381c1.217-2.613,9.533-13.636,17.062-25.062c0.007-0.008,0.013-0.016,0.017-0.023 c1.699-2.578,3.355-5.175,4.885-7.702c0.043-0.071,0.086-0.143,0.129-0.214c0.248-0.412,17.859-28.646-7.225-17.212 c0,0.002-0.002,0.005-0.004,0.007c-4.713,2.417-10.707,6.021-18.244,11.072c-16.441,11.021-49.885,27.154-49.885,27.154 s-5.82,3.144-9.658,0.749c-19.396-12.1-47.656-33.594-84.912-45.562c-0.621-0.2-1.408-0.673-0.338-1.664l15.955-11.158 c0,0,1.25-1.08-0.355-1.602c-7.896-2.573-40.783-13.601-69.24-3.462c-5.797,2.065-10.555,3.761-14.467,5.155 c-1.682,0.6-3.391,1.305-6.799,1.726C52.482,117.237,0,174.203,0,196.737c0,15.123,8.154,25.271,37.947,39.378 c0.598-0.095,5.146,3.17,15.137,0.168c2.678-0.805,21.697-7.968,22.453-8.291c0.758-0.346,1.25-0.517,1.564-0.466 c0.404,0.064,0.701,0.962,0.699,1.144c-0.063,5.387-10.16,9.75-15.893,14.537c-0.984,0.459-1.248,2.744,0.475,3.484 0.002,0,20.246,10.854,52.307,14.229c2.592,0.273,36.34,21.897,70.371,16.096c17.999-3.069,26.564-4.119,30.473-5.197 c3.412-0.94,1.783-2.022,1.783-2.022l-17.059-13.592c-1.155-1.281-0.221-2.265,0.746-2.539 c37.882-10.779,67.834-27.771,85.672-42.328c2.402-1.961,8.645,2.701,13.102,4.953c14.801,7.477,76.238,32.803,81.301,27.442 c0.436-0.452,0.467-1.125,0.023-2.05C372.456,223.524,341.21,208.035,353.165,182.381z M62.835,180.632 c-5.465,0-9.895-4.512-9.895-10.077s4.43-10.076,9.895-10.076s9.896,4.511,9.896,10.076S68.3,180.632,62.835,180.632z M107.118,237.965c-0.609,0.547-1.164,1.373-0.842,0.185c0,0,15.426-23.21,17.426-53.211 c1.498-22.484-13.482-50.02-13.482-50.02s0.029-0.804,0.555-0.169C116.108,141.2,168.618,182.688,107.118,237.965z";

export default class StatCard extends Component {
    constructor(props) {
        super(props);
    }
    //types: success, danger, info, warning
    //arrow: positive, negative
    //icon: fish, sun, snow

    componentDidMount() {
        this.setIcon();
    }

    setIcon() {

        let svg = d3.select(".icon" + this.props.icon);
        // svg.remove("g")

        if (this.props.icon == 'snow') {
            svg.append("g")
                .attr("class", "icon-graphic")

            svg.append("path")
                .attr("class", "card-icon")
                .attr("transform", "translate(0, 0) scale(0.04)")
                .attr("d", "m498.899 340.374-203.696-84.374 203.697-84.374c7.654-3.17 11.288-11.945 8.118-19.599s-11.945-11.288-19.599-8.118l-203.706 84.378 84.378-203.707c3.17-7.654-.464-16.428-8.118-19.599-7.654-3.169-16.428.464-19.599 8.118l-84.374 203.698-84.374-203.697c-3.17-7.654-11.944-11.287-19.599-8.118-7.654 3.17-11.288 11.945-8.118 19.599l84.378 203.707-203.706-84.379c-7.653-3.17-16.429.464-19.599 8.118-3.17 7.654.464 16.428 8.118 19.599l203.697 84.374-203.696 84.374c-7.654 3.17-11.288 11.945-8.118 19.599s11.945 11.288 19.599 8.118l203.706-84.378-84.379 203.707c-3.17 7.654.464 16.428 8.118 19.599 7.654 3.169 16.428-.464 19.599-8.118l84.374-203.698 84.374 203.697c3.17 7.654 11.944 11.287 19.599 8.118 7.654-3.17 11.288-11.945 8.118-19.599l-84.378-203.707 203.706 84.378c7.653 3.17 16.429-.464 19.599-8.118 3.17-7.653-.465-16.428-8.119-19.598z")
                .attr("fill", "#2d7dff")
                .attr("stroke", "black")
                .attr("strokeWidth", "5");

            svg.append("path")
                .attr("class", "card-icon")
                .attr("transform", "translate(0, 0) scale(0.04)")
                .attr("d", "m359.973 507.018c7.654-3.17 11.288-11.945 8.118-19.599l-84.378-203.707 203.706 84.378c7.653 3.17 16.429-.464 19.599-8.118s-.464-16.428-8.118-19.599l-203.697-84.373 203.697-84.374c7.654-3.17 11.288-11.945 8.118-19.599s-11.945-11.288-19.599-8.118l-203.706 84.378 84.378-203.707c3.17-7.654-.464-16.428-8.118-19.599-7.654-3.169-16.428.464-19.599 8.118l-84.374 203.698v78.407l84.374 203.696c3.17 7.654 11.944 11.287 19.599 8.118z")
                .attr("fill", "#0050ff")
                .attr("stroke", "black")
                .attr("strokeWidth", "5");

            svg.append("path")
                .attr("class", "card-icon")
                .attr("transform", "translate(0, 0) scale(0.04)")
                .attr("d", "m178.224 95.943-67.08-27.786c-7.654-3.17-11.288-11.945-8.118-19.599 3.171-7.654 11.944-11.288 19.599-8.118l53.222 22.045 22.045-53.222c3.17-7.654 11.945-11.288 19.599-8.118s11.288 11.945 8.118 19.599l-27.786 67.08c-2.289 5.526-10.09 12.055-19.599 8.119z")
                .attr("fill", "#5aaaff")
                .attr("stroke", "black")
                .attr("strokeWidth", "5");


            svg.append("path")
                .attr("class", "card-icon")
                .attr("transform", "translate(0, 0) scale(0.04)")
                .attr("d", "m1.146 217.489c-3.17-7.654.464-16.428 8.118-19.599l53.222-22.045-22.045-53.222c-3.17-7.654.464-16.428 8.118-19.599 7.654-3.168 16.429.464 19.599 8.118l27.785 67.08c3.17 7.654-.464 16.428-8.118 19.599l-67.08 27.786c-9.627 3.987-17.329-2.636-19.599-8.118z")
                .attr("fill", "#5aaaff")
                .attr("stroke", "black")
                .attr("strokeWidth", "5");

            svg.append("path")
                .attr("class", "card-icon")
                .attr("transform", "translate(0, 0) scale(0.04)")
                .attr("d", "m333.776 95.943 67.08-27.786c7.654-3.17 11.288-11.945 8.118-19.599-3.171-7.654-11.944-11.288-19.599-8.118l-53.222 22.045-22.045-53.221c-3.17-7.654-11.945-11.288-19.599-8.118s-11.288 11.945-8.118 19.599l27.786 67.08c2.289 5.525 10.09 12.054 19.599 8.118z")
                .attr("fill", "#2d7dff")
                .attr("stroke", "black")
                .attr("strokeWidth", "5");

            svg.append("path")
                .attr("class", "card-icon")
                .attr("transform", "translate(0, 0) scale(0.04)")
                .attr("d", "m510.854 217.489c3.17-7.654-.464-16.428-8.118-19.599l-53.222-22.045 22.045-53.222c3.17-7.654-.464-16.428-8.118-19.599-7.654-3.168-16.429.464-19.599 8.118l-27.785 67.08c-3.17 7.654.464 16.428 8.118 19.599l67.08 27.786c9.628 3.987 17.329-2.636 19.599-8.118z")
                .attr("fill", "#2d7dff")
                .attr("stroke", "black")
                .attr("strokeWidth", "5");

            svg.append("path")
                .attr("class", "card-icon")
                .attr("transform", "translate(0, 0) scale(0.04)")
                .attr("d", "m178.224 416.057-67.08 27.786c-7.654 3.17-11.288 11.945-8.118 19.599 3.171 7.654 11.944 11.288 19.599 8.118l53.222-22.045 22.045 53.222c3.17 7.654 11.945 11.288 19.599 8.118s11.288-11.945 8.118-19.599l-27.786-67.08c-2.289-5.526-10.09-12.055-19.599-8.119z")
                .attr("fill", "#5aaaff")
                .attr("stroke", "black")
                .attr("strokeWidth", "5");

            svg.append("path")
                .attr("class", "card-icon")
                .attr("transform", "translate(0, 0) scale(0.04)")
                .attr("d", "m1.146 294.511c-3.17 7.654.464 16.428 8.118 19.599l53.222 22.045-22.045 53.222c-3.17 7.654.464 16.428 8.118 19.599 7.654 3.168 16.429-.464 19.599-8.118l27.785-67.08c3.17-7.654-.464-16.428-8.118-19.599l-67.08-27.786c-9.627-3.987-17.329 2.636-19.599 8.118z")
                .attr("fill", "#5aaaff")
                .attr("stroke", "black")
                .attr("strokeWidth", "5");

            svg.append("path")
                .attr("class", "card-icon")
                .attr("transform", "translate(0, 0) scale(0.04)")
                .attr("d", "m333.776 416.057 67.08 27.786c7.654 3.17 11.288 11.945 8.118 19.599-3.171 7.654-11.944 11.288-19.599 8.118l-53.222-22.045-22.045 53.222c-3.17 7.654-11.945 11.288-19.599 8.118s-11.288-11.945-8.118-19.599l27.786-67.08c2.289-5.526 10.09-12.055 19.599-8.119z")
                .attr("fill", "#2d7dff")
                .attr("stroke", "black")
                .attr("strokeWidth", "5");

            svg.append("path")
                .attr("class", "card-icon")
                .attr("transform", "translate(0, 0) scale(0.04)")
                .attr("d", "m510.854 294.511c3.17 7.654-.464 16.428-8.118 19.599l-53.222 22.045 22.045 53.222c3.17 7.654-.464 16.428-8.118 19.599-7.654 3.168-16.429-.464-19.599-8.118l-27.785-67.08c-3.17-7.654.464-16.428 8.118-19.599l67.08-27.786c9.628-3.987 17.329 2.636 19.599 8.118z")
                .attr("fill", "#2d7dff")
                .attr("stroke", "black")
                .attr("strokeWidth", "5");

            svg.append("path")
                .attr("class", "card-icon")
                .attr("transform", "translate(0, 0) scale(0.04)")
                .attr("d", "m256 112.467c-79.145 0-143.533 64.389-143.533 143.533s64.388 143.533 143.533 143.533 143.533-64.388 143.533-143.533-64.388-143.533-143.533-143.533zm0 257.066c-62.603 0-113.533-50.931-113.533-113.533s50.93-113.533 113.533-113.533 113.533 50.93 113.533 113.533-50.93 113.533-113.533 113.533z")
                .attr("fill", "#5aaaff")
                .attr("stroke", "black")
                .attr("strokeWidth", "5");

            svg.append("path")
                .attr("class", "card-icon")
                .attr("transform", "translate(0, 0) scale(0.04)")
                .attr("d", "m399.533 256c0-79.145-64.389-143.533-143.533-143.533v30c62.603 0 113.533 50.931 113.533 113.533s-50.93 113.533-113.533 113.533v30c79.145 0 143.533-64.388 143.533-143.533z")
                .attr("fill", "#2d7dff")
                .attr("stroke", "black")
                .attr("strokeWidth", "5");
        }
        else if (this.props.icon == 'fish') {
            svg.append("g")
                .attr("class", "icon-graphic")
                .append("path")
                .attr("class", "card-icon")
                .attr("transform", "translate(0,-2.5) scale(0.075)")
                .attr("d", fish)
                .attr("fill", "#80C7EA")
                .attr("stroke", "black")
                .attr("strokeWidth", "10");
        } else {
            svg.append("g")
                .attr("class", "icon-graphic")
                .append("path")
                .attr("class", "card-icon")
                .attr("transform", "translate(0, 0) scale(0.045)")
                .attr("d", "M495,267.5v-40h-74.324c-3.799-33.108-16.904-63.424-36.634-88.257l52.61-52.61l-28.285-28.284 l-52.609,52.609c-24.834-19.731-55.15-32.835-88.257-36.634V0h-40v74.324c6.565-0.753,13.236-1.154,20-1.154v348.66 c-6.764,0-13.435-0.401-20-1.154V495h40v-74.324c33.107-3.799,63.423-16.904,88.257-36.634l52.609,52.609l28.285-28.284 l-52.61-52.61c19.731-24.833,32.835-55.149,36.634-88.257H495z")
                .attr("fill", "#FFCD00")
                .attr("stroke", "black")
                .attr("strokeWidth", "5")

            svg.append("path")
                .attr("class", "card-icon")
                .attr("transform", "translate(0, 0) scale(0.045)")
                .attr("d", "M247.5,73.17c-6.764,0-13.435,0.401-20,1.154c-33.107,3.799-63.423,16.904-88.257,36.634 L86.634,58.349L58.349,86.633l52.61,52.61c-19.731,24.833-32.835,55.149-36.634,88.257H0v40h74.324 c3.799,33.108,16.904,63.424,36.634,88.257l-52.61,52.61l28.285,28.284l52.609-52.609c24.834,19.731,55.15,32.835,88.257,36.634 c6.565,0.753,13.236,1.154,20,1.154V73.17z")
                .attr("fill", "#FFDA44")
                .attr("stroke", "black")
                .attr("strokeWidth", "5")
        }
    }

    render() {
        return (
            <div className={"statcard statcard-" + this.props.type}
                style={!!this.props.width ? { width: this.props.width + "px" } : { width: 200 }}>
                <div className="p-a">
                    <span className="statcard-desc">{this.props.title}</span>
                    <div className='statcard-content'>
                            <svg className={"icon" + this.props.icon} width="35" height="35"
                                transform={"scale(1.45)"} >
                            </svg>
                        <span className="statcard-lead-num statcard-major" transform={"translate(-5, 0)"}>
                            {this.props.major}
                            {this.props.minor && <sub className={"delta-indicator delta-" + this.props.arrow}>{this.props.minor}</sub>}
                        </span>
                    </div>
                </div>
            </div >
        )
    }
}

