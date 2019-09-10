import React, { Component } from 'react';
import { } from '../components';
import uniqid from 'uniqid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loading from 'react-loading';
import { getNodes, registerNode, updateNode, deleteNode } from '../utils/requestServer';
import toastr from '../utils/toastr';
import { CustomBasinMap, EditPanel } from '../components';
import PLACES from '../utils/static-reference/mapPlaces';

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
            innerLoaderState: false,
            deleteLoaderState: false,
            currentModel: '',
            currentNodes: [],
            selectedNode: -1,
            markerType: '',
            markerNote: '',
            markerLink: '',
            editModeON: false
        };
        this.loadNodes = this.loadNodes.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onMapClick = this.onMapClick.bind(this);
        this.onEditSubmit = this.onEditSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }


    onEditSubmit(event) {

        event.preventDefault();

        let { editModeON, markerNote, markerLink, currentModel,
            markerType, selectedNode, currentNodes } = this.state;


        if (markerType.length == 0) {
            toastr["error"]("Please select a Marker Type", "UPDATE ERROR");
        }
        else {
            if (editModeON) {
                // make a call to edit the selected node then 
            }
            else {

                // get the element from the current nodes list 
                let marker = currentNodes[selectedNode];
                //  add other elements to the marker
                marker = {
                    'latitude': String(marker.latitude),
                    'longitude': String(marker.longitude),
                    'note': markerNote,
                    'link': markerLink,
                    'type': markerType,
                    'modelID': currentModel,
                    'number': uniqid()
                }

                // toggle inner loader
                this.setState({ innerLoaderState: true });

                registerNode(marker)
                    .then((response) => {

                        debugger;
                        // store the new node permanently
                        currentNodes[selectedNode] = marker;
                        // reset the form
                        this.setState({
                            currentNodes,
                            selectedNode: -1,
                            markerType: '',
                            markerNote: '',
                            markerLink: '',
                            editModeON: false
                        });
                    })
                    // toggle loader once request is completed
                    .finally(() => {
                        this.setState({ innerLoaderState: false });
                    });
            }
        }

    }

    onDelete() {



    }


    onMapClick(marker) {

        const { lngLat } = marker;

        let { currentNodes, selectedNode, editModeON } = this.state;

        if (!editModeON) {
            if (selectedNode == -1) {
                selectedNode = currentNodes.push({ latitude: lngLat[1], longitude: lngLat[0], type: 'new' }) - 1;
            }
            else {
                currentNodes[selectedNode].latitude = lngLat[1];
                currentNodes[selectedNode].longitude = lngLat[0];
            }
            this.setState({ currentNodes, selectedNode });
        }
    }

    loadNodes() {

        const currentModel = document.getElementById('currentModel').value || '';

        if (currentModel.length > 0) {

            this.setState({ isLoaderVisible: true, currentModel });
            // get the nodes for the current select basin
            getNodes(currentModel)
                .then((currentNodes) => {
                    this.setState({
                        currentNodes,
                        selectedNode: -1,
                        markerType: '',
                        markerNote: '',
                        markerLink: '',
                        editModeON: false
                    });
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
        const widthOfDashboard = document.body.getBoundingClientRect().width - 100,
            { isLoaderVisible, currentModel, selectedNode,
                innerLoaderState, deleteLoaderState, editModeON,
                currentNodes, markerNote, markerType } = this.state;


        // set the zoom and lat long level if a sub model has been selected
        var place = _.find(PLACES, (d) => d.id == currentModel) || {};

        const { latitude = 52, longitude = -105.75, zoom = 5.1 } = place;



        return (
            <div className='map-tagger-root' >
                <div className='filter-root-box'>
                    <div className='name-box'>
                        <label className='filter-label'>Select a Model</label>
                        <select id='currentModel' defaultValue={currentModel} className="custom-select">
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
                {currentModel.length > 0 &&

                    <div className='m-t'>
                        <CustomBasinMap
                            key={'map-' + currentModel}
                            modelID={currentModel}
                            latitude={latitude}
                            longitude={longitude}
                            zoom={zoom}
                            onMapClick={this.onMapClick}
                            currentNodes={currentNodes}
                            width={widthOfDashboard * 0.75} />
                        <EditPanel
                            onChange={this.onChange}
                            selectedNode={selectedNode}
                            model={_.find(BasinList, (d) => d.id == currentModel)}
                            markerType={markerType}
                            markerNote={markerNote}
                            onEditSubmit={this.onEditSubmit}
                            onDelete={this.onDelete}
                            innerLoaderState={innerLoaderState}
                            deleteLoaderState={deleteLoaderState}
                            editModeON={editModeON}
                            width={widthOfDashboard * 0.25} />
                    </div>}
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
