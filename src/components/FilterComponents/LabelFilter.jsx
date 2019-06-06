import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLabelVisibility } from '../../redux/actions/actions';
import Select from 'react-select';
import sortAlphaNum from '../../utils/sortAlphaNum';

class LabelFilter extends Component {
    constructor(props) {
        super(props);
        this.onLabelToggleClick = this.onLabelToggleClick.bind(this);
    }

    onLabelToggleClick() {
        this.props.actions.toggleLabelVisibility();
    }


    render() {
        const { filterMesh, schematicData = { lines: [], artifacts: [], labels: [], markers: [] } } = this.props,
            { areLabelsVisible = false } = filterMesh;

        return (

            <div>
                <div>
                    <button
                        className={('btn btn-primary label-btn ') +
                            (areLabelsVisible ? ' ' : 'active-button')}
                        onClick={this.onLabelToggleClick}> SELECT ALL
                </button>
                </div>

                <div>
                    <button
                        className={('btn btn-primary label-btn ') +
                            (areLabelsVisible ? ' ' : 'active-button')}
                        onClick={this.onLabelToggleClick}> CLEAR ALL
                </button>
                </div>

                <div>
                    <button
                        className={('btn btn-primary label-btn ') +
                            (areLabelsVisible ? ' ' : 'active-button')}
                        onClick={this.onLabelToggleClick}> HIDE LABELS
                </button>
                </div>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        filterMesh: state.delta.filterMesh
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ toggleLabelVisibility }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LabelFilter);