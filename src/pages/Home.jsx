import React, { Component } from 'react';
//  Image url handling is convoluted in scss , much easier to set inline and get images from root
let backgroundStyle = { backgroundImage: 'url(assets/img/gwf.jpg)' };
import YouTube from 'react-youtube';

class Home extends Component {

  constructor(props) {

    super(props);
    this.state = {
      isVidPlaying: false,
      currentVidID: undefined
    };
    this._onReady = this._onReady.bind(this);
    this._onPlay = this._onPlay.bind(this);
    this._onEnd = this._onEnd.bind(this);
  }

  _onReady(event) {
    event.target.playVideo();
  }

  _onPlay(event) {

    this.setState({
      isVidPlaying: true,
      currentVidID: event.target.getVideoData().video_id
    });    
  }

  _onEnd(event) {
    this.setState({
      isVidPlaying: false,
      currentVidID: undefined
    }); 
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
          {this.state.isVidPlaying ?
            <div>
              <YouTube
                containerClassName='youtube-container'
                videoId={this.state.currentVidID}
                opts={{ width: widthOfPage, height: widthOfPage / 2 }}
                onReady={this._onReady}
                onEnd={this._onEnd} />
            </div>
            :
            <div>
              <div className="video-tray">
                <YouTube
                  containerClassName='youtube-container'
                  videoId="xrpzzGsfy7o"
                  opts={{ width: widthOfPage / 3, height: widthOfPage / 6 }}
                  onPlay={this._onPlay} />
                <YouTube
                  containerClassName='youtube-container'
                  videoId="kOvwu_0z2jM"
                  opts={{ width: widthOfPage / 3, height: widthOfPage / 6 }}
                  onPlay={this._onPlay} />
                <YouTube
                  containerClassName='youtube-container'
                  videoId="QW206F8BTzE"
                  opts={{ width: widthOfPage / 3, height: widthOfPage / 6 }}
                  onPlay={this._onPlay} />
              </div>
              <div className="video-tray">
                <YouTube
                  containerClassName='youtube-container'
                  videoId="NNAkYbNBeK0"
                  opts={{ width: widthOfPage / 3, height: widthOfPage / 6 }}
                  onPlay={this._onPlay} />
                <YouTube
                  containerClassName='youtube-container'
                  videoId="Y74jb1V_DOg"
                  opts={{ width: widthOfPage / 3, height: widthOfPage / 6 }}
                  onPlay={this._onPlay} />
              </div>

            </div>
          }

        </div>

      </div>

    )
  }
};

export default Home;


