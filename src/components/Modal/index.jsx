import React, { Component } from 'react';
import { UserSelection } from './ModalComponents'

class Modal extends Component {
    
    constructor(props) {
        super(props);

        this.componentID = undefined;
        this.show = false;
        this.state = {
            modalComponents: {
                "userSelection" : <UserSelection/>
            }
        }
        this.args = [];
    }
    
    render() {
        
        const { componentID, show, onClick = () => { return; }, args = []} = this.props;

        const { modalComponents } = this.state;

        return (
            <div className={"modal-root" + (show? " visible" : "")} onClick={onClick}>
                {modalComponents[componentID] && modalComponents[componentID]}    
            </div>
        );
    }
}

export default Modal;