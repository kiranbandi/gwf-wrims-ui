/*global $*/
import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setLogoutData, setLoginData } from '../redux/actions/actions';
import { GoogleLogin } from 'react-google-login';
import config from '../../config.json';
import { requestLogin } from '../utils/requestServer';

//  Image url handling is convoluted in scss , much easier to set inline and get images from root
let logoIconStyle = { background: 'url(assets/img/pawslogo.png)', backgroundSize: '100%' };

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

    logOut(event) {
        event.preventDefault();
        this.props.setLogoutData();
    }

    googleResponse(response) {
        requestLogin(response).then((data) => {
            this.props.actions.setLoginData({ username: data.user.name.givenName, token: data.token });
        }).catch((error) => {
            console.log('login failed', error);
        });
    }


    render() {
        const loginRedirectURL = 'https://cas.usask.ca/cas/login?service=' + encodeURIComponent((process.env.NODE_ENV == 'development') ? 'https://localhost:8888/' : 'https://gwf-hci.usask.ca/');

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
                            <span className="icon icon-home navbar-brand-icon"></span> Home
                            </Link>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse ">

                        <ul className='nav navbar-nav'>
                            <li>
                                <Link to={'/Dashboard'}>
                                    <span className="icon icon-line-graph"></span> Dashboard
                                </Link>
                            </li>
                        </ul>
                        <ul className='nav navbar-nav navbar-right'>
                            <li> {this.props.logged_in ?
                                <Link to='/Logout' onClick={this.logOut}>
                                    <span className="icon icon-log-out"></span> Logout
                                        </Link>
                                :
                                <span className='login-container'>
                                    <span className='login-text'>Login</span>
                                    <a href={loginRedirectURL}>
                                        <span style={logoIconStyle} className="paws-icon"></span>
                                    </a>
                                    <GoogleLogin
                                        theme='dark'
                                        clientId={config.GOOGLE_CLIENT_ID}
                                        buttonText=""
                                        className='google-login-button'
                                        onSuccess={this.googleResponse}
                                        onFailure={this.googleResponse}
                                        icon={false}
                                        cookiePolicy={'single_host_origin'}>
                                        <span className='login-internal'>
                                            <span className="icon icon-google-plus"></span>
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
        username: state.delta.username
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setLogoutData: bindActionCreators(setLogoutData, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
