import React, { Component } from 'react';
//  Image url handling is convoluted in scss , much easier to set inline and get images from root
let backgroundStyle = { backgroundImage: 'url(assets/img/gwf.jpg)' };
import YouTube from 'react-youtube';
import vtdata from '../utils/videoTilesData';

class Home extends Component {

  constructor(props) {

    super(props);
    this.state = {
      playerRef: undefined,
      isVidPlaying: false,
      currentVidID: "xrpzzGsfy7o"
    };
    this._onReady = this._onReady.bind(this);
    this._onPlay = this._onPlay.bind(this);
    this._onEnd = this._onEnd.bind(this);
  }

  _onReady(event) {

    this.setState({
      playerRef: event
    });
  }

  _onPlay(id) {
    this.setState({
      isVidPlaying: true,
      currentVidID: id
    });

    setTimeout(() => { this.state.playerRef.target.playVideo(); }, 10);
  }

  _onEnd(event) {
    this.setState({ isVidPlaying: false });
    setTimeout(() => { this.state.playerRef.target.stopVideo(); }, 10);
  }

  render() {

    console.log("lol")

    let widthOfPage = document.body.getBoundingClientRect().width;

    if (widthOfPage > 1170) {
      widthOfPage = 1000
    }
    else if (widthOfPage < 700) {
      widthOfPage = 0.90 * widthOfPage;
    }
    else {
      widthOfPage = 0.75 * widthOfPage;
    }


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
          <div>
            <div className="video-list" style={{ height: ((widthOfPage / 2) + "px") }}>
              {
                vtdata.tileData.map((o, idx) => {

                  let tileStyle = {
                    background: `url(https://img.youtube.com/vi/${o.id}/${o.thumb}.jpg)`,
                    width: ((widthOfPage / 4) + "px"),
                    height: ((widthOfPage / 6.5) + "px"),
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                    lineHeight: ((widthOfPage / 6.5) + "px")
                  };

                  return (
                    <div className="tile-container" style={tileStyle} key={o.id} onClick={() => { this._onPlay(o.id); }}>
                      <div className="tile-text">{o.title}</div>
                    </div>
                  );
                })
              }
            </div>
            <YouTube
              containerClassName='current-video'
              videoId={this.state.currentVidID}
              opts={{ width: (widthOfPage * .85), height: (widthOfPage / 2) }}
              onReady={this._onReady}
              onEnd={this._onEnd} />
          </div>

        </div>

      </div>

    )
  }
};

export default Home;


