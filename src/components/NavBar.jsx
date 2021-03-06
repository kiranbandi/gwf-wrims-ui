/*global $*/
import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setLogoutData, setLoginData } from '../redux/actions/actions';
import { GoogleLogin } from 'react-google-login';
import { requestLogin } from '../utils/requestServer';
import { setMode } from '../redux/actions/actions';

let backgroundStyleGoogleLogo = { background: 'url(assets/img/google/g-logo.png)', backgroundSize: '100%' };
// Google client ID for the GWF project 
const GOOGLE_ID = '35101241949-nlhoc8npcecg7il8589aq194cc5cboab.apps.googleusercontent.com';
//  Image url handling is convoluted in scss , much easier to set inline and get images from root
let logoIconStyle = { background: 'url(assets/img/pawslogo.png)', backgroundSize: '100%' };
// List of allowed usernames to have access to edit map nodes
let accessList = ['vkb698', 'iss469', 'rir954', 'hkc042', 'sya953', 'ncd881'];

class NavBar extends Component {

    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);
        this.googleResponse = this.googleResponse.bind(this);
    }

    componentDidMount() {
        //fix for mobile browsers , navbar doesnt automatically collapse and needs to be toggled manually
        $('.navbar-collapse').on('click', function (e) {
            var toggle = $(".navbar-toggle").is(":visible");
            if ($(e.target).is('a') && toggle) {
                $(this).collapse('hide');
            }
        });
    }



    _onSwitchModeButtonClick = () => {
        window.scrollTo(0, 0);
        this.props.actions.setMode(-1);
    }

    logOut(event) {
        event.preventDefault();
        this.props.actions.setLogoutData();
        document.location.reload(true);
    }

    googleResponse(response) {
        if (response.accessToken) {
            // set isPAWS flag to false so server knows we are authenticating with google and not paws
            requestLogin(response.accessToken, false)
                .then((userData) => { this.props.actions.setLoginData({ ...userData, username: response.googleId, email: response.w3.U3 }); })
                .catch((error) => {
                    console.log('login failed', error);
                });
        }
    }


    render() {
        const loginRedirectURL = 'https://cas.usask.ca/cas/login?service=' + encodeURIComponent((process.env.NODE_ENV == 'development') ? 'https://localhost:8888/' : 'https://gwf-hci.usask.ca/');
        const { mode, logged_in, username } = this.props;
        const nullUserState = (mode === -1 || mode === 2);
        // show map tagger only to people in the accessList
        const showMapTagger = accessList.indexOf(username) > -1;

        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <Link data-toggle="collapse" data-target="#navbar" className="navbar-brand navbar-brand-emphasized" to='/'>
                            <span className="icon icon-home navbar-brand-icon"></span>
                            Home
                        </Link>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse ">

                        <ul className='nav navbar-nav'>
                            <li>
                                <Link to={'/Dashboard'}>
                                    <span className="icon icon-line-graph"></span>
                                    Dashboard
                                </Link>
                            </li>
                            {showMapTagger &&
                                <li>
                                    <Link to={'/MapTagger'}>
                                        <span className="icon icon-new-message"></span>
                                        Map Editor
                                </Link>
                                </li>}
                            <li>
                                <Link to={'/Parser'}>
                                    <span className="icon icon-classic-computer"></span>
                                    MODSIM Parser
                                </Link>
                            </li>
                        </ul>
                        <ul className='nav navbar-nav navbar-right'>
                            {!nullUserState &&
                                <li>

                                    <a className="mode-switch-button" onClick={this._onSwitchModeButtonClick}>
                                        <span className="icon icon icon-sound-mix"></span>
                                        SWITCH MODE
                                    </a>
                                </li>
                            }
                            <li> {this.props.logged_in ?

                                <Link to='/Logout' onClick={this.logOut}>
                                    <span className="icon icon-log-out"></span> Logout
                                        </Link>
                                :
                                <span className='login-container'>
                                    <span className='login-text'>Login</span>
                                    <span className="login-container-seperator">|</span>
                                    <a href={loginRedirectURL}>
                                        <span style={logoIconStyle} className="paws-icon"></span>
                                    </a>
                                    <GoogleLogin
                                        theme='dark'
                                        clientId={GOOGLE_ID}
                                        buttonText=""
                                        className='google-login-button'
                                        onSuccess={this.googleResponse}
                                        onFailure={this.googleResponse}
                                        icon={false}
                                        cookiePolicy={'single_host_origin'}>
                                        <span className='login-internal'>
                                            <div className="google-logo" style={backgroundStyleGoogleLogo}></div>
                                        </span>
                                    </GoogleLogin>
                                </span>

                            }
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

function mapStateToProps(state) {
    return {
        logged_in: state.delta.sessionStatus,
        username: state.delta.username,
        mode: state.delta.mode
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ setLogoutData, setLoginData, setMode }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
