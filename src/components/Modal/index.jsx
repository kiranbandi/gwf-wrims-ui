import React, { Component } from 'react';
import { UserSelection, InformationContainer } from './ModalComponents'

class Modal extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            modalComponents: {
                "userSelection" : function(args) { return ( <UserSelection args={args}/> ); },
                "infoContainer" : function(args) { return ( <InformationContainer args={args}/> ); } 

            }
        }
    }
    
    render() {
        
        const { componentID = "", show = false, onClick = () => { return; }, args = []} = this.props;

        const { modalComponents } = this.state;

        return (
            <div className={"modal-root" + (show? " visible" : "")} onClick={onClick}>
                {modalComponents[componentID] && modalComponents[componentID](args)}    
            </div>
        );
    }
}

export default Modal;