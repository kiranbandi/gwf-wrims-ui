import React, { Component } from 'react';
import { connect } from 'react-redux';
//  Image url handling is convoluted in scss , much easier to set inline and get images from root
let backgroundStyle = { backgroundImage: 'url(assets/img/gwf.jpg)' };
import videoTileData from '../utils/static-reference/videoTilesData';
import { YoutubeLayout } from '../components'

class Home extends Component {

  componentDidMount() {
    const { mode = 1 } = this.props;
    if (mode == 2) {
      window.scrollTo(0, document.getElementById('demo-tile').offsetTop - 25);
    }
  }


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
          <p>
            The Nelson-Churchill River Basin, the third largest watershed in North America,
            provides water for the majority of residents in Alberta, Saskatchewan and Manitoba.
            Water in the basin supports a wide array of socioeconomic activities, from residential
            use, to commercial and industrial services, agricultural production, hydroelectric energy
            production, recreation, and traditional-cultural activities of Indigenous communities.
          </p>
          <p>
            The river basin, and the livelihoods it supports, are at risk from a changing climate, and
            competing visions of how to best manage and use water into the future. This decision support
            platform provides access to the innovative modelling tools developed through the Global Water
            Futures network for exploration of management options under future water uncertainty. To access
            the platform, login and select from one of the many options below.
          </p>

          <h1 id='demo-tile'>Dashboard Demonstration</h1>
          <YoutubeLayout videoTileData={videoTileData} />
          <h1>Learn more</h1>
          <p>The project is aimed at building decision support tools for all parties involved in the Global Water Futures
            Project.The tools are in the form of novel visualizations and interactive decision - making systems.Global Water
            Futures (GWF) aims to position Canada as a global leader in water science for cold regions and will address
            the strategic needs of the Canadian economy in adapting to change and managing risks of uncertain water futures
            extreme events. End-user needs will be our beacon and will drive strategy and shape our science.
          </p>
        </div>
      </div>

    )
  }
};

function mapStateToProps(state) {
  return {
    mode: state.delta.mode
  };
}

export default connect(mapStateToProps, null)(Home);
