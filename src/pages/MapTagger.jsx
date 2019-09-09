import React, { Component } from 'react';
import { } from '../components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loading from 'react-loading';
import { getNodes } from '../utils/requestServer';
import toastr from '../utils/toastr';

const BasinList = [
    { 'id': 'tau', 'label': 'Trans Alta Utilities' },
    { 'id': 'stribs', 'label': 'Southern Tributaries' },
    { 'id': 'highwood', 'label': 'Higwood' },
    { 'id': 'northSask', 'label': 'North Saskatchewan River (Alberta)' },
    { 'id': 'northSaskSask', 'label': 'North Saskatchewan River (Saskatchewan)' },
    { 'id': 'southSask', 'label': 'South Saskatchewan River (Saskatchewan)' }
];


class MapTagger extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaderVisible: false,
            currentModel: '',
            currentNodes: []
        };
        this.loadNodes = this.loadNodes.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    loadNodes() {

        const { currentModel = '' } = this.state;

        if (currentModel.length > 0) {

            this.setState({ isLoaderVisible: true });
            // get the nodes for the current select basin
            getNodes(currentModel)
                .then((currentNodes) => {
                    this.setState({ currentNodes });
                })
                // toggle loader once request is completed
                .finally(() => {
                    this.setState({ isLoaderVisible: false });
                });
        }
        else {
            toastr["error"]("Please select a model to update", "UPDATE ERROR");
        }

    }

    onChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }


    render() {

        //125px to offset the 30px margin on both sides and vertical scroll bar width
        let widthOfDashboard = document.body.getBoundingClientRect().width - 100;

        const { isLoaderVisible, currentModel } = this.state;



        return (
            <div className='map-tagger-root' >
                <div className='text-xs-center text-sm-left root-box'>
                    <div className='name-box'>
                        <label className='filter-label'>Select a Model</label>
                        <select id='currentModel' value={currentModel} className="custom-select" onChange={this.onChange}>
                            <option key={'placeholder'} value={''}>Please Select</option>
                            {BasinList.map((val, index) => { return <option key={index} value={val.id}> {val.label}</option> })}
                        </select>
                    </div>
                    <div className='text-xs-left button-box'>
                        <button type="submit" className="filter-button btn btn-primary-outline" onClick={this.loadNodes}>
                            SELECT
                          {isLoaderVisible && <Loading className='filter-loader' type='spin' height='22px' width='22px' color='white' delay={-1} />}
                        </button>
                    </div>
                </div>
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
