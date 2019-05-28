import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TubeMap } from '../components';


class DashboardRoot extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className='dashboard-page-root' >
                <TubeMap />
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(DashboardRoot);

