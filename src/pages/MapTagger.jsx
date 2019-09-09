import React, { Component } from 'react';
import { } from '../components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


class MapTagger extends Component {

    constructor(props) {
        super(props);
    }


    render() {

        //125px to offset the 30px margin on both sides and vertical scroll bar width
        let widthOfDashboard = document.body.getBoundingClientRect().width - 100,
            mapWidth = widthOfDashboard * 0.65,
            widthOfSlider = 100;

        return (
            <div className='map-tagger-root' >
                <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam, asperiores?</h2>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MapTagger);
