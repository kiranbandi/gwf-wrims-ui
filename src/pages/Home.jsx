import React, { Component } from 'react';
//  Image url handling is convoluted in scss , much easier to set inline and get images from root
let backgroundStyle = { backgroundImage: 'url(assets/img/gwf.jpg)' };
import videoTileData from '../utils/videoTilesData';
import { YoutubeLayout } from '../components'

class Home extends Component {

  render() {

    return (
      <div>
        <div className="home-header" style={backgroundStyle}>
          <div className="container">
            <div className='col-lg-12 text-lg-left text-md-center text-sm-center text-xs-center'>
              <h1>GWF-HCI</h1>
              <p>Global Water Futures, User Centric Decision Support Systems</p>
            </div>
          </div>
        </div>

        <div className="container home-body">
          <h1> What is this ?</h1>
          <p>The project is aimed at building decision support tools for all parties involved in the Global Water Futures
            Project.The tools are in the form of novel visualizations and interactive decision - making systems.Global Water
            Futures (GWF) aims to position Canada as a global leader in water science for cold regions and will address
            the strategic needs of the Canadian economy in adapting to change and managing risks of uncertain water futures
            extreme events. End-user needs will be our beacon and will drive strategy and shape our science. </p>
          <h1>Dashboard Demonstration</h1>
          <YoutubeLayout videoTileData={videoTileData}/>
        </div>
      </div>

    )
  }
};

export default Home;


