import React, { Component } from 'react';
import { connect } from 'react-redux';
//  Image url handling is convoluted in scss , much easier to set inline and get images from root
let backgroundStyle = { backgroundImage: 'url(assets/img/gwf.jpg)' };
import videoTileData from '../utils/static-reference/videoTilesData';
import { YoutubeLayout } from '../components'
import { Link } from 'react-router';

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
              <h1>Global Water Futures</h1>
              <p>User Centric Decision Support Systems</p>
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
            Futures network for exploration of management options under future water uncertainty.
            Click <Link to={'/Dashboard'}> here </Link>  to get started.
          </p>

          <h1 id='demo-tile'>Dashboard Demonstration</h1>
          <YoutubeLayout videoTileData={videoTileData} />
          <h1>Learn more</h1>
          <p> This project is part of the <a href="https://gwf.usask.ca/impc/">Integrated Modelling Program for Canada</a>(IMPC) which
          delivers tools to support decision making for uncertain water resources, considering the range of stakeholder needs in
          Canada’s major river basins. IMPC is a project of <a href='https://gwf.usask.ca/'>Global Water Futures (GWF)</a>, which aims to position Canada as a global
          leader in water science for cold regions and provides disaster warning, improved prediction of climate and water futures,
          and decision support tools such as interactive visualizations needed to inform adaptation to change and risk management.
          </p>
          <p>Contributions are made by:</p>
          <p><b>Faculty Leads - </b> Carl Gutwin, Saman Razavi, Patricia Gober </p>
          <p><b>IMPC Manager - </b> Hayley Carlson</p>
          <p><b>Highly Qualified Personnel - </b>Leila Eamen, Mustakim Ali Shah, Nhu Do, Ishan Saxena, Ricardo Rheeder, Venkat Bandi</p>

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
