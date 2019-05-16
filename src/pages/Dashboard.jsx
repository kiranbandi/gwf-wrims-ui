import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class DashboardRoot extends Component {

    constructor(props) {
        super(props);
    }

    render() {
           return (
            <div className='dashboard-page-root' >
                GWF Dashboard Coming Soon...
            </div >
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({}, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        userType: state.delta.userDetails.accessType,

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardRoot);



