import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleDemandVisibility } from '../../redux/actions/actions';

class DemandFilter extends Component {
    constructor(props) {
        super(props);
        this.onDemandClick = this.onDemandClick.bind(this);
    }

    onDemandClick() {
        this.props.actions.toggleDemandVisibility();
    }

    render() {
        const { filterMesh } = this.props,
            { areDemandsVisible = false } = filterMesh;
        return (
            <div>
                <button
                    className={('btn btn-primary demand-btn ') +
                        (areDemandsVisible ? ' ' : 'active-button')}
                    onClick={this.onDemandClick}> HIDE SELECTED DEMANDS </button>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        filterMesh: state.delta.filterMesh
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ toggleDemandVisibility }, dispatch) // *ADDED
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DemandFilter);