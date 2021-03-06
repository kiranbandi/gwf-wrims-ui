import React, { Component } from 'react';
import uniqid from 'uniqid';
import Loading from 'react-loading';
import { getNodes, registerNode, updateNode, deleteNode } from '../utils/requestServer';
import toastr from '../utils/toastr';
import { CustomBasinMap, EditPanel, RiverMapModal } from '../components';
import PLACES from '../utils/static-reference/mapPlaces';

const BasinList = [
    { 'id': 'tau', 'label': 'Trans Alta Utilities' },
    { 'id': 'stribs', 'label': 'Southern Tributaries' },
    { 'id': 'highwood', 'label': 'Higwood' },
    { 'id': 'northSask', 'label': 'North Saskatchewan River (Alberta)' },
    { 'id': 'northSaskSask', 'label': 'North Saskatchewan River (Saskatchewan)' },
    { 'id': 'southSask', 'label': 'South Saskatchewan River (Saskatchewan)' }
];


export default class MapTagger extends Component {

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
            editModeON: false,
            isModalVisible: false
        };
        this.loadNodes = this.loadNodes.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onMapClick = this.onMapClick.bind(this);
        this.onEditSubmit = this.onEditSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onMapPointClick = this.onMapPointClick.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.setMarkerLink = this.setMarkerLink.bind(this);
    }


    setMarkerLink(markerLink) {
        this.setState({ markerLink });
    }


    toggleModal(event) {
        event.preventDefault();
        this.setState({ isModalVisible: !this.state.isModalVisible });
    }

    onMapPointClick(event) {
        let { selectedNode, currentNodes } = this.state;
        // get the index of the node that has been clicked and type cast it to a number
        const clickedNode = +event.currentTarget.id.split("-")[1];
        //  if a different node has been clicked than the current one then enter edit mode
        if (selectedNode != clickedNode) {
            const marker = currentNodes[clickedNode];

            // remove markers that dont have numbers meaning are temp nodes that the user has ignored
            currentNodes = _.filter(currentNodes, (d) => !!d.number);

            this.setState({
                selectedNode: clickedNode,
                markerType: marker.type,
                markerNote: marker.note,
                markerLink: marker.link,
                editModeON: true,
                currentNodes
            });
        }
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
                    'number': marker.number
                }

                // toggle inner loader
                this.setState({ innerLoaderState: true });

                updateNode(marker)
                    .then((response) => {
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

        event.preventDefault();

        let { selectedNode, currentNodes, currentModel } = this.state;

        if (selectedNode != -1) {
            // toggle inner loader
            this.setState({ deleteLoaderState: true });

            // get the element from the current nodes list 
            let marker = currentNodes[selectedNode];

            deleteNode({ modelID: currentModel, number: marker.number })
                .then((response) => {
                    // remove the selected node permanently
                    currentNodes.splice(selectedNode, 1);
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
                    this.setState({ deleteLoaderState: false });
                });
        }
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
        else {
            this.setState({
                selectedNode: -1,
                editModeON: false,
                markerType: '',
                markerNote: '',
                markerLink: '',
            });
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

        let { selectedNode, currentNodes, markerType } = this.state;

        if (event.target.id == 'markerType') {
            markerType = event.target.value;
            currentNodes[selectedNode].type = markerType || 'new';
            this.setState({ markerType, currentNodes });
        }
        else {
            this.setState({ [event.target.id]: event.target.value });
        }
    }


    render() {

        //125px to offset the 30px margin on both sides and vertical scroll bar width
        const widthOfDashboard = document.body.getBoundingClientRect().width - 100,
            { isLoaderVisible, currentModel, selectedNode,
                innerLoaderState, deleteLoaderState,
                editModeON, currentNodes, markerNote,
                markerLink, markerType, isModalVisible } = this.state;


        // set the zoom and lat long level if a sub model has been selected
        var place = _.find(PLACES, (d) => d.id == currentModel) || {};

        const { latitude = 52, longitude = -105.75, zoom = 5.1 } = place;



        return (
            <div className='map-tagger-root' >
                {isModalVisible &&
                    <RiverMapModal
                        markerLink={markerLink}
                        setMarkerLink={this.setMarkerLink}
                        currentModel={currentModel}
                        width={widthOfDashboard * 0.60}
                        toggleModal={this.toggleModal} />}
                <div className='filter-root-box m-t'>
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
                            onMapPointClick={this.onMapPointClick}
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
                            toggleModal={this.toggleModal}
                            innerLoaderState={innerLoaderState}
                            deleteLoaderState={deleteLoaderState}
                            editModeON={editModeON}
                            width={widthOfDashboard * 0.25} />
                    </div>}
            </div>
        );
    }
}
