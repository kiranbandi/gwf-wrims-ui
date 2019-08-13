import React, { Component } from 'react';
import MapGL, { Marker, Popup, FlyToInterpolator } from 'react-map-gl';
import PlaceInfo from './PlaceInfo';
import PlaceMarker from './PlaceMarker';
import PLACES from '../../utils/static-reference/mapPlaces';
import MarkingMenu from './MarkingMenu'

import { fromJS } from 'immutable';

const TOKEN = 'pk.eyJ1IjoicmljYXJkb3JoZWVkZXIiLCJhIjoiY2p4MGl5bWIyMDE1bDN5b2NneHh5djJ2biJ9.3ALfBtMIORYFNtXU9RUUnA';

import defaultMapStyle from './map-style.jsx';

let basinArray = [
    'AB-South-Saskatchewan-River',
    'SK-South-Saskatchewan-River-Upstream',
    'SK-South-Saskatchewan-River-Downstream',
    'Reddeer-River',
    'Oldman-River',
    'SK-North-Saskatchewan-River',
    'AB-North-Saskatchewan-River',
    'Bow-River',
    'Highwood'
];


const highlightColor = "hsl(0, 36%, 71%)"
let curHover = ''
let prevHover = ''
let basinLayerIndex = null

let basinBorderLayerIndex = ''
let basinPrevBorderLayerIndex = ''
let editedMapStyle = null;
let currentBorderName = ''

export default class BasinMap extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // mapStyle: _.cloneDeep(defaultMapStyle),
            mapStyle: defaultMapStyle,
            viewport: {
                width: 400,
                height: 400,
                latitude: 52.25,
                longitude: -110.75,
                zoom: 5.1
            },
            popupInfo: null,
            hoverInfo: null,
            mapSelectedBorder: defaultMapStyle,
            place: null,
            markingMenu: {
                curClick: false,
                prevClick: false,
                xPos: 0,
                yPos: 0,
                mouseOver: false
            },
            displayImage : false,
            canDrag: true,
            canScroll: true,

            basinStruct : {
                southSask: {
                    displayName : "South-Saskatchewan-River",
                    highlightColor: "hsl(115, 67%, 47%)"
                },
                northSaskSask: {
                    displayName : "SK-North-Saskatchewan-River",
                    highlightColor: "hsl(72, 66%, 44%)"
                },
                northSask: {
                    displayName : "AB-North-Saskatchewan-River",
                    highlightColor: "hsl(72, 66%, 44%)"
                },

                stribs: {
                    displayName : "SK-North-Saskatchewan-River",
                    highlightColor: "hsl(115, 67%, 87%)"
                },
                highwood: {
                    displayName : "Highwood-River",
                    highlightColor: "hsla(46, 99%, 56%, 0)"
                },
                // alberta: {
                //     displayName : "SK-North-Saskatchewan-River",
                //     highlightColor: "hsl(115, 67%, 87%)"
                // }
            }
        };

        this.renderPlaceMarker = this.renderPlaceMarker.bind(this);
        this.renderPopup = this.renderPopup.bind(this);
        this.renderHoverPopup = this.renderHoverPopup.bind(this);
        this._onHover = this._onHover.bind(this);
        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);

        // this._getCursor = this._getCursor.bind(this);

        this.addMarkingMenu = this.addMarkingMenu.bind(this);
    }


    _onHover = event => {
        let hoverInfo = null;
        const basin = event.features && event.features.find(f => basinArray.indexOf(f.layer.id) > -1);

        if (this.state.markingMenu.mouseOver) { return } 
        // If hovering over a basin
        if (basin) {

            if (currentBorderName != curHover ){
                // reset hoverInfo so that it re-renders to mouse cursor
                hoverInfo = {
                    lngLat: event.lngLat,
                    basinName: basin.layer.id.split("-").join(" ")
                };
                this.setState({ hoverInfo })
            }
            if (currentBorderName == curHover){
                hoverInfo = null;
                this.setState({ hoverInfo })
            }

            let basinNameId = basin.layer.id;   // Store basin name as ID

            curHover = basinNameId  // store basin ID as current hover
            // Check that we are not still hovering over same basin ()
            if (prevHover != curHover) {
                // Hovering over new basin - make changes

                let layers = defaultMapStyle.get('layers')
                let basinNameId = basin.layer.id;
                basinLayerIndex = layers.findIndex((l) => {
                    return l.toObject().id == basinNameId
                })
            }
        }

        else {
            curHover = ''   // Currently hovering nothing

            if (basinLayerIndex != null) { // CONSIDER REMOVING
                // mapStyle.layers[basinLayerIndex].paint['fill-color'] = defaultMapStyle.layers[basinLayerIndex].paint['fill-color'];  
            }
        }

        // If the current hover has changed 
        // OR
        // We have hovered off of a basin
        if ((curHover != prevHover) || (curHover == '' && basinArray.indexOf(prevHover) > -1)) {
            prevHover = curHover    // Set previous hover to what was previously hovered

            if (curHover == '') {
                hoverInfo = ''

                editedMapStyle = defaultMapStyle

                // Border companion basin
                if (basinBorderLayerIndex != ''){
                    editedMapStyle = this.borderBasin(editedMapStyle, basinBorderLayerIndex, currentBorderName)
                }

                this.setState({
                    mapStyle: editedMapStyle,
                    hoverInfo
                })
            } else {
                editedMapStyle = defaultMapStyle   // reset the map edits

                // Highlight current basin(s)
                editedMapStyle = this.highlightBasin(editedMapStyle, basinLayerIndex, curHover)

                // Border the current basin(s)
                if (basinBorderLayerIndex != ''){
                    editedMapStyle = this.borderBasin(editedMapStyle, basinBorderLayerIndex, currentBorderName)
                }

                this.setState({
                    mapStyle: editedMapStyle,
                    hoverInfo
                });
            }
        }
    };

    _onMouseDown = event => {
        // If not hovering over a marking menu button AND if mouse down THEN remove the marking menu
        if ( this.state.markingMenu.mouseOver == false ){
            this.setState({
                markingMenu: {...this.state.markingMenu, curClick: false}
            });
        }
        if (this.state.markingMenu.mouseOver){
            this.setState({canDrag: false, canScroll: false})
        }
    };

    // Handling clicks on the map and where to redirect users
    _onMouseUp = event => {
        let hoverInfo = null;
        this.setState({ hoverInfo })

        if (curHover == '' || this.state.markingMenu.mouseOver) { return }  // If not hovering over anything, don't do anything 

        // Get index of the current basin's border
        let layers = defaultMapStyle.get('layers')
        basinBorderLayerIndex = layers.findIndex((l) => {
            return l.toObject().id == (curHover + '-Border')
        })

        if (basinPrevBorderLayerIndex != ''){
            editedMapStyle = this.unborderBasin(editedMapStyle, basinPrevBorderLayerIndex, currentBorderName)
        }

        basinPrevBorderLayerIndex = basinBorderLayerIndex   // Store the previous border index
        currentBorderName = curHover    // Store current basin-border's name

        // Apply border, repaint current basin
        editedMapStyle = this.borderBasin(editedMapStyle, basinBorderLayerIndex, currentBorderName)
        editedMapStyle = editedMapStyle.setIn(['layers', basinLayerIndex, 'paint', 'fill-color'], highlightColor)

        this.setState({
            mapStyle: editedMapStyle
        });

        this.setPlace(curHover);
        
        // Update popupInfo state to new place selected
        if (this.state.place != null) {
            // set the popup info for the current place marker
            this.setState({ popupInfo: this.state.place }) // viewport
        }

        // If a basin is selected, place the marking menu down, else, remove the marking menu
        if (curHover != ''){
            if ( !this.state.markingMenu.mouseOver ) {
                this.setState({
                    markingMenu: {...this.state.markingMenu, curClick: true, xPos: event.point[0] - 12.5, yPos: event.point[1] - 12.5},
                });
            }
        }else{
            this.closeMarkingMenu();
        }

        // If mouse button up, impossible to be hovering
        this.setState({canDrag: true, canScroll: true})
    }

    closeMarkingMenu(){
        if (this.state.markingMenu.curClick == true){
            console.log("close marking menu")
            this.setState({
                markingMenu: {...this.state.markingMenu, curClick: false, mouseOver: false}
            });
        }
    }

    mouseOut() {
        // Indicates that we finished hovering over a button
        this.setState({
            markingMenu: {...this.state.markingMenu, mouseOver: false}
        });
    }
    
    mouseOver() {
        // Clears hover info, so that it dissapears while hovering over a button
        // Indicates that we are hovering over a button
        this.setState({
            markingMenu: {...this.state.markingMenu, mouseOver: true},
            hoverInfo: null
        });
    }

    highlightBasin(mapToEdit, basinHighlightIndex, basinHighlightName){

        if (basinHighlightName == 'SK-South-Saskatchewan-River-Upstream' || basinHighlightName == 'SK-South-Saskatchewan-River-Downstream') {
            if (basinHighlightName == 'SK-South-Saskatchewan-River-Upstream') {
                mapToEdit = mapToEdit.setIn(['layers', basinHighlightIndex + 1, 'paint', 'fill-color'], highlightColor)
            }
            else if (basinHighlightName == 'SK-South-Saskatchewan-River-Downstream') {
                mapToEdit = mapToEdit.setIn(['layers', basinHighlightIndex - 1, 'paint', 'fill-color'], highlightColor)
            }
        }

        else if (basinHighlightName == 'SK-North-Saskatchewan-River' || basinHighlightName == 'AB-North-Saskatchewan-River') {
            if (basinHighlightName == 'SK-North-Saskatchewan-River') {
                mapToEdit = mapToEdit.setIn(['layers', basinHighlightIndex + 1, 'paint', 'fill-color'], highlightColor)
            }
            else if (basinHighlightName == 'AB-North-Saskatchewan-River') {
                mapToEdit = mapToEdit.setIn(['layers', basinHighlightIndex - 1, 'paint', 'fill-color'], highlightColor)
            }
        }

        mapToEdit = mapToEdit.setIn(['layers', basinLayerIndex, 'paint', 'fill-color'], highlightColor)

        return mapToEdit
    }

    borderBasin(mapToEdit, basinBorderIndex, basinBorderName){

        if (basinBorderName == 'SK-South-Saskatchewan-River-Upstream' || basinBorderName == 'SK-South-Saskatchewan-River-Downstream') {
            if (basinBorderName == 'SK-South-Saskatchewan-River-Upstream') {
                mapToEdit = mapToEdit.setIn(['layers', basinBorderIndex + 1, 'layout', 'visibility'], "visible")
            }
            else if (basinBorderName == 'SK-South-Saskatchewan-River-Downstream') {
                mapToEdit = mapToEdit.setIn(['layers', basinBorderIndex - 1, 'layout', 'visibility'], "visible")
            }
        }
        
        else if (basinBorderName == 'SK-North-Saskatchewan-River' || basinBorderName == 'AB-North-Saskatchewan-River') {
            if (basinBorderName == 'SK-North-Saskatchewan-River') {
                mapToEdit = mapToEdit.setIn(['layers', basinBorderIndex + 1, 'layout', 'visibility'], "visible")
            }
            else if (basinBorderName == 'AB-North-Saskatchewan-River') {
                mapToEdit = mapToEdit.setIn(['layers', basinBorderIndex - 1, 'layout', 'visibility'], "visible")
            }
        }
        mapToEdit = mapToEdit.setIn(['layers', basinBorderIndex, 'layout', 'visibility'], "visible")

        return mapToEdit
    }

    unborderBasin(mapToEdit, basinBorderIndex, basinBorderName){

        if (basinBorderName == 'SK-South-Saskatchewan-River-Upstream' || basinBorderName == 'SK-South-Saskatchewan-River-Downstream') {
            if (basinBorderName == 'SK-South-Saskatchewan-River-Upstream') {
                mapToEdit = mapToEdit.setIn(['layers', basinBorderIndex + 1, 'layout', 'visibility'], "none")
            }
            else if (basinBorderName == 'SK-South-Saskatchewan-River-Downstream') {
                mapToEdit = mapToEdit.setIn(['layers', basinBorderIndex - 1, 'layout', 'visibility'], "none")
            }
        }
        
        else if (basinBorderName == 'SK-North-Saskatchewan-River' || basinBorderName == 'AB-North-Saskatchewan-River') {
            if (basinBorderName == 'SK-North-Saskatchewan-River') {
                mapToEdit = mapToEdit.setIn(['layers', basinBorderIndex + 1, 'layout', 'visibility'], "none")
            }
            else if (basinBorderName == 'AB-North-Saskatchewan-River') {
                mapToEdit = mapToEdit.setIn(['layers', basinBorderIndex - 1, 'layout', 'visibility'], "none")
            }
        }
        mapToEdit = mapToEdit.setIn(['layers', basinBorderIndex, 'layout', 'visibility'], "none")

        return mapToEdit
    }

    setPlace(curHover){ 
        console.log("set place")
        // Get information for the Info-Card pop-up
        if (curHover == 'SK-South-Saskatchewan-River-Upstream' || curHover == 'SK-South-Saskatchewan-River-Downstream') {
            this.setState({
                place: PLACES[0]
            });
        }
        else if (curHover == 'Highwood') {
            this.setState({
                place: PLACES[1]
            });
        }
        else if (curHover == 'Reddeer-River') {
            this.setState({
                place: PLACES[2]
            });
        }
        else if (curHover == 'SK-North-Saskatchewan-River' || curHover == 'AB-North-Saskatchewan-River') {
            this.setState({
                place: PLACES[3]
            });
        }
        else if (curHover == 'Bow-River') {
            this.setState({
                place: PLACES[4]
            });
        }
        else if (curHover == 'Oldman-River') {
            this.setState({
                place: PLACES[5]
            });
        }
        else if (curHover == 'AB-South-Saskatchewan-River') {
            this.setState({
                place: PLACES[6]
            });
        }
    }

    // Can delete
    renderPlaceMarker(place, index) {
        return (
            <Marker key={`marker-${index}`} longitude={place.longitude} latitude={place.latitude}>
                <PlaceMarker size={20} onClick={() => {
                    // console.log(place)
                    this.props.onRegionSelect({ 'target': place })
                    // set the popup info for the current place marker
                    this.setState({ popupInfo: place })
                }} />
            </Marker>
        );
    };

    iconButtonClick = () => { 
        this._goToViewport(this.state.place)
        this.props.onRegionSelect({ 'target': this.state.place })
    }

    // Can delete
    renderPopup() {
        const { popupInfo } = this.state;

        if (popupInfo) {
            return (
                popupInfo && (
                    <Popup
                        tipSize={5}
                        anchor="left"
                        longitude={popupInfo.longitude}
                        latitude={popupInfo.latitude}
                        closeOnClick={false}
                        onClose={() => this.setState({ popupInfo: null })}>
                        <PlaceInfo info={popupInfo} iconButton={this.iconButtonClick}/>
                    </Popup>
                )
            );
        }
        return null;
    }

    renderHoverPopup() {
        const { hoverInfo } = this.state;
        if (hoverInfo) {
            // console.log("Hover Info:")
            // console.log(hoverInfo)
            return (
                <Popup longitude={hoverInfo.lngLat[0]} latitude={hoverInfo.lngLat[1]} closeButton={false}>
                    <div className="basin-info">{hoverInfo.basinName}</div>
                </Popup>
            );
        }
        return null;
    }

    _onViewportChange = viewport =>{
        console.log("on viewport change")

        this.setState({
        viewport: {...this.state.viewport, ...viewport}
        });
    }

    _goToViewport = ({longitude, latitude, zoom}) => {
        this._onViewportChange({
          longitude,
          latitude,
          zoom,
          transitionInterpolator: new FlyToInterpolator(),
          transitionDuration: 1500
        });
      };

    viewSchematic(){
        this.iconButtonClick()
        this.setState({
            markingMenu: {...this.state.markingMenu, curClick: false, mouseOver: false}
        });
        console.log("schematic clicked")
    }

    addMarkingMenu(){
        const { popupInfo } = this.state;

        if (this.state.markingMenu.curClick){
            console.log("add marking menu")

            return ( 
                <MarkingMenu
                    x={this.state.markingMenu.xPos}
                    y={this.state.markingMenu.yPos}
                    type="circle"
                    margin={45}
                >
                    <div className="button marking-menu-button" onMouseOut={() => this.mouseOut()} onMouseOver={() => this.mouseOver()} >
                        <button className="icon icon-location-pin" />
                    </div>
                    <div className="button marking-menu-button"  onMouseOut={() => this.mouseOut()} onMouseOver={() => this.mouseOver()}>
                        <button className="icon icon-image" onClick={() => this.setState({displayImage: !this.state.displayImage})}/>
                        <div className="basin-image-div" >
                            {this.state.displayImage 
                            ? <div className="polaroid">
                                <img className="basin-image" width={240} src={popupInfo.image} />
                                <div className="text-container">
                                    <p className="text-styling">{popupInfo.name}</p>
                                </div> 
                            </div>
                            : <img/>
                            }
                        </div>
                    </div>
                    <div className="button marking-menu-button"  onMouseOut={() => this.mouseOut()} onMouseOver={() => this.mouseOver()}>
                        <button className="icon icon-air" onClick={() => this.viewSchematic()}/>
                    </div>
                    <div className="button marking-menu-button"  onMouseOut={() => this.mouseOut()} onMouseOver={() => this.mouseOver()}>
                        <a className="icon icon-info-with-circle"  target="_new" href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=${`${popupInfo.name}`}`} />
                    </div>
                </MarkingMenu>
            )
        }
        else{
            return('')
        }
    }

    render() {
        let { viewport, mapStyle } = this.state, { width } = this.props;

        // set the viewports for the map
        viewport.width = width;
        viewport.height = width / 2.5;

        return (
            <div className="mapboxDiv">

                <MapGL
                    mapStyle={fromJS(mapStyle)}
                    mapboxApiAccessToken={TOKEN}
                    {...viewport}

                    onViewportChange={this._onViewportChange}
                    doubleClickZoom={false}
                    dragRotate={false}
                    minZoom={2}
                    
                    onHover={this._onHover}
                    onMouseDown={this._onMouseDown}
                    onMouseUp={this._onMouseUp}

                    // if transition, dragging, panning, potating, or zooming, close menu
                    onInteractionStateChange={() => this.closeMarkingMenu()}
                >
                    {this.renderHoverPopup()}

                    <div className="markingMenuDiv">
                        {this.addMarkingMenu()}                
                    </div>
                </MapGL>

            </div>
        );
    }
}
