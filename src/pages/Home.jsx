import React, { Component } from 'react';
//  Image url handling is convoluted in scss , much easier to set inline and get images from root
let backgroundStyle = { backgroundImage: 'url(assets/img/gwf.jpg)' };
import YouTube from 'react-youtube';

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
                ["xrpzzGsfy7o 0 Region-Selection", "kOvwu_0z2jM 0 Points-of-Interest", "QW206F8BTzE 0 Selection-Filter", "NNAkYbNBeK0 0 Decreasing-Supply", "Y74jb1V_DOg 0 Visualizing-Flow-Rates"].map((str, idx) => {
                  let id = str.split(" ");

                  let tileStyle = {
                    background: `url(https://img.youtube.com/vi/${id[0]}/${id[1]}.jpg)`,
                    width: ((widthOfPage / 4) + "px"),
                    height: ((widthOfPage / 6.5) + "px"),
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                    lineHeight: ((widthOfPage / 6.5) + "px")
                  }

                  return (
                    <div className="tile-container" style={tileStyle} key={id[0]} onClick={() => { this._onPlay(id[0]); }}>
                      <div className="tile-text">{id[2].split("-").join(" ")}</div>
                    </div>
                  )
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


