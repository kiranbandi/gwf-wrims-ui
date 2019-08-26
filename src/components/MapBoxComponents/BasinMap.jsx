import React, { Component } from 'react';
import MapGL, { Popup, FlyToInterpolator } from 'react-map-gl';
import PLACES from '../../utils/static-reference/mapPlaces';
import MarkingMenu from './MarkingMenu'

import { fromJS } from 'immutable';

const TOKEN = 'pk.eyJ1IjoicmljYXJkb3JoZWVkZXIiLCJhIjoiY2p4MGl5bWIyMDE1bDN5b2NneHh5djJ2biJ9.3ALfBtMIORYFNtXU9RUUnA';

import defaultMapStyle from './MapStyle.jsx';

let basinArray = [
    'SK-South-Saskatchewan-River',
    'Highwood',
    // 'Reddeer-River',
    'SK-North-Saskatchewan-River',
    'AB-North-Saskatchewan-River',
    'Tau-Basin',
    // 'Oldman-River',
    'Stribs-Basin'

];

const selectColor = "hsla(0, 36%, 71%, 0)" // have a translucent color for basin selection

let curHover = ''
let prevHover = ''

let basinSelectedLayerIndex = null
let basinPrevSelectedLayerIndex = ''
let basinBorderLayerIndex = ''

let editedMapStyle = null;
let currentSelectedName = ''

export default class BasinMap extends Component {

    constructor(props) {
        super(props);
        this.state = {
            componentMounted: false,
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
            displayImage: false,
            canDrag: true,
            canScroll: true,
        };

        this.renderHoverPopup = this.renderHoverPopup.bind(this);

        this.addMarkingMenu = this.addMarkingMenu.bind(this);
    }

    componentDidMount(){
        this.setState({ componentMounted: true })

        curHover = ''
        prevHover = ''

        basinSelectedLayerIndex = null
        basinPrevSelectedLayerIndex = ''
        basinBorderLayerIndex = ''

        editedMapStyle = null;
        currentSelectedName = ''
    }

    componentWillUnmount(){
        this.setState({ componentMounted: false })
    }

    _onHover = event => {
        let hoverInfo = null;
        const basin = event.features && event.features.find(f => basinArray.indexOf(f.layer.id) > -1);

        if (this.state.markingMenu.mouseOver) { return }
        // If hovering over a basin
        if (basin) {
            // console.log(event.lngLat)
            if (currentSelectedName != curHover) {
                // reset hoverInfo so that it re-renders to mouse cursor
                hoverInfo = {
                    lngLat: event.lngLat,
                    basinName: basin.layer.id.split("-").join(" ")
                };
                this.setState({ hoverInfo })
            }
            if (currentSelectedName == curHover) {
                hoverInfo = null;
                this.setState({ hoverInfo })
            }

            let basinNameId = basin.layer.id;   // Store basin name as ID

            curHover = basinNameId  // store basin ID as current hover
            // Check that we are not still hovering over same basin ()
            if (prevHover != curHover) {
                // We are hovering over new basin - make changes

                basinBorderLayerIndex = this.getBasinBorderLayerIndex()
            }
        }

        else {
            curHover = ''   // Currently hovering nothing
        }

        // If the current hover has changed 
        // OR
        // We have hovered off of a basin
        if ((curHover != prevHover) || (curHover == '' && basinArray.indexOf(prevHover) > -1)) {
            prevHover = curHover    // Set previous hover to what was previously hovered
            this.closeMarkingMenu()
            if (curHover == '') {
                hoverInfo = ''

                editedMapStyle = defaultMapStyle

                // Keeps the basin selected when the cursor is hovering outside of the basins
                if (basinSelectedLayerIndex != '') {
                    editedMapStyle = this.highlightBasin(editedMapStyle, basinSelectedLayerIndex, currentSelectedName, selectColor)
                }

                this.setState({
                    mapStyle: editedMapStyle,
                    hoverInfo
                })
            } else {

                editedMapStyle = defaultMapStyle   // reset the map edits
                // Border the current basin(s)
                editedMapStyle = this.borderBasin(editedMapStyle, basinBorderLayerIndex)

                // Highlight the current basin(s)
                if (basinSelectedLayerIndex != '') {
                    editedMapStyle = this.highlightBasin(editedMapStyle, basinSelectedLayerIndex, currentSelectedName, selectColor)
                }

                this.setState({
                    mapStyle: editedMapStyle,
                    hoverInfo
                });
            }
        }
    };

    // Handling clicks on the map and where to redirect users
    _onMouseUp = event => {
        let hoverInfo = null;
        this.setState({ hoverInfo })

        if (curHover == '' || this.state.markingMenu.mouseOver) { return }  // If not hovering over anything, don't do anything 

        basinSelectedLayerIndex = this.getBasinLayerIndex()
        // Unselect the previous basin
        if (basinPrevSelectedLayerIndex != '') {
            editedMapStyle = defaultMapStyle
            editedMapStyle = this.borderBasin(editedMapStyle, basinBorderLayerIndex) // Reapply border
        }
        basinPrevSelectedLayerIndex = basinSelectedLayerIndex   // Store the previous border index

        currentSelectedName = curHover

        // Apply border, repaint current basin
        editedMapStyle = this.highlightBasin(editedMapStyle, basinSelectedLayerIndex, currentSelectedName, selectColor)

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
        if (curHover != '') {
            if (!this.state.markingMenu.mouseOver) {
                this.setState({
                    markingMenu: { ...this.state.markingMenu, curClick: true, xPos: event.point[0] - 12.5, yPos: event.point[1] - 12.5 },
                });
            }
        } else {
            this.closeMarkingMenu();
        }

        // If mouse button up, impossible to be hovering
        this.setState({ canDrag: true, canScroll: true })
    }

    _onMouseDown = event => {
        // If not hovering over a marking menu button AND if mouse down THEN remove the marking menu
        if (this.state.markingMenu.mouseOver == false) {
            this.setState({
                markingMenu: { ...this.state.markingMenu, curClick: false }
            });
        }
        if (this.state.markingMenu.mouseOver) {
            this.setState({ canDrag: false, canScroll: false })
        }
    };

    getBasinLayerIndex() {
        let layers = defaultMapStyle.get('layers')
        let basinHighlightLayerIndex = layers.findIndex((l) => {
            return l.toObject().id == (curHover)
        })
        return basinHighlightLayerIndex
    }

    getBasinBorderLayerIndex() {
        // Get index of the current basin's border
        let layers = defaultMapStyle.get('layers')
        let layerIndex = layers.findIndex((l) => {
            return l.toObject().id == (curHover + '-Border')
        })
        return layerIndex
    }

    mouseOut() {
        // Indicates that we finished hovering over a button
        this.setState({
            markingMenu: { ...this.state.markingMenu, mouseOver: false }
        });
    }

    mouseOver() {
        // Clears hover info, so that it dissapears while hovering over a button
        // Indicates that we are hovering over a button
        this.setState({
            markingMenu: { ...this.state.markingMenu, mouseOver: true },
            hoverInfo: null
        });
    }

    highlightBasin(mapToEdit, basinHighlightIndex, basinHighlightName, color) {
        if (basinHighlightName == 'Tau-Basin') {
            mapToEdit = mapToEdit.setIn(['layers', basinHighlightIndex + 1, 'paint', 'fill-color'], color)
        }
        else if (basinHighlightName == 'Highwood') {
            mapToEdit = mapToEdit.setIn(['layers', basinHighlightIndex - 1, 'paint', 'fill-color'], color)
        }
        else if (basinHighlightName == 'Stribs-Basin') {
            mapToEdit = mapToEdit.setIn(['layers', basinHighlightIndex - 1, 'paint', 'fill-color'], color)
        }

        mapToEdit = mapToEdit.setIn(['layers', basinHighlightIndex, 'paint', 'fill-color'], color)

        return mapToEdit
    }

    borderBasin(mapToEdit, basinBorderIndex, basinBorderName = '') {
        mapToEdit = mapToEdit.setIn(['layers', basinBorderIndex, 'layout', 'visibility'], "visible")

        return mapToEdit
    }

    unborderBasin(mapToEdit, basinBorderIndex, basinBorderName) {
        mapToEdit = mapToEdit.setIn(['layers', basinBorderIndex, 'layout', 'visibility'], "none")

        return mapToEdit
    }

    setPlace(curHover) {
        // Get information for the Info-Card pop-up
        if (curHover == 'SK-South-Saskatchewan-River') {
            this.setState({
                place: PLACES[0]
            });
        }
        else if (curHover == 'Highwood') {
            this.setState({
                place: PLACES[1]
            });
        }
        else if (curHover == 'SK-North-Saskatchewan-River') {
            this.setState({
                place: PLACES[2]
            });
        }
        else if (curHover == 'AB-North-Saskatchewan-River') {
            this.setState({
                place: PLACES[3]
            });
        }
        else if (curHover == 'Tau-Basin') {
            this.setState({
                place: PLACES[4]
            });
        }
        else if (curHover == 'Stribs-Basin') {
            this.setState({
                place: PLACES[5]
            });
        }
    }

    iconButtonClick = () => {
        this._goToViewport(this.state.place)
        this.props.onRegionSelect({ 'target': this.state.place })
    }

    renderHoverPopup() {
        const { hoverInfo } = this.state;
        if (hoverInfo) {
            return (
                <Popup longitude={hoverInfo.lngLat[0]} latitude={hoverInfo.lngLat[1]} closeButton={false}>
                    <div className="basin-info">{hoverInfo.basinName}</div>
                </Popup>
            );
        }
        return null;
    }

    _onViewportChange = viewport => {
        this.setState({
            viewport: { ...this.state.viewport, ...viewport }
        });
    }

    _goToViewport = ({ longitude, latitude, zoom }) => {
        this.state.componentMounted ? this._onViewportChange({
            longitude,
            latitude,
            zoom,
            transitionInterpolator: new FlyToInterpolator(),
            transitionDuration: 1500
        }) : null;
    };

    viewSchematic() {
        this.iconButtonClick()
        this.setState({
            markingMenu: { ...this.state.markingMenu, curClick: false, mouseOver: false }
        });
    }

    addMarkingMenu() {
        const { popupInfo } = this.state;

        if (this.state.markingMenu.curClick) {
            // console.log("add marking menu")

            return (
            <div ref="markingmenu">
                <MarkingMenu
                    x={this.state.markingMenu.xPos}
                    y={this.state.markingMenu.yPos}
                    type="circle"
                    margin={35}
                >
                    <div className="button marking-menu-button" onMouseOut={() => this.mouseOut()} onMouseOver={() => this.mouseOver()} >
                        <button className="icon icon-controller-record" />
                    </div>
                    <div className="button marking-menu-button" onMouseOut={() => this.mouseOut()} onMouseOver={() => this.mouseOver()}>
                        <button className="icon icon-image" onClick={() => { event.preventDefault(); this.setState({ displayImage: !this.state.displayImage }) }} />
                        <div className="basin-image-div" >
                            {this.state.displayImage
                                ? <div className="polaroid">
                                    <img className="basin-image" width={240} src={popupInfo.image} />
                                    <div className="text-container">
                                        <p className="text-styling">{popupInfo.name}</p>
                                    </div>
                                </div>
                                : <img />
                            }
                        </div>
                    </div>
                    <div className="button marking-menu-button" onMouseOut={() => this.mouseOut()} onMouseOver={() => this.mouseOver()}>
                        <button className="icon icon-pie-chart" onClick={() => this.viewSchematic()} />
                    </div>
                    <div className="button marking-menu-button" onMouseOut={() => this.mouseOut()} onMouseOver={() => this.mouseOver()}>
                        <a className="icon icon-info-with-circle" target="_new" href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=${`${popupInfo.name}`}`} />
                    </div>
                </MarkingMenu>
            </div>
                
            )
        }
        else {''}
        
    }
    
    closeMarkingMenu() {
        if (this.state.markingMenu.curClick == true) { 
            this.setState({
                markingMenu: { ...this.state.markingMenu, curClick: false, mouseOver: false }
            });
        }
    }

    render() {
        let { viewport, mapStyle } = this.state, { width } = this.props;
        const { componentMounted } = this.state

        // set the viewports for the map
        viewport.width = width;
        viewport.height = width / 2.5;

        return (
            <div className="mapboxDiv">

                <MapGL
                    mapStyle={fromJS(mapStyle)}
                    mapboxApiAccessToken={TOKEN}
                    {...viewport}

                    onViewportChange={componentMounted ? this._onViewportChange : null }
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
