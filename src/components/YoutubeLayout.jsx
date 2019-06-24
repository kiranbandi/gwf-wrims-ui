import React, { Component } from 'react';
import YouTube from 'react-youtube';

class YoutubeLayout extends Component {


    constructor(props) {
        super(props);

        this.videoTileData = [];

        this.state = {
            playerRef: undefined,
            isVidPlaying: false,
            currentVidID: undefined,
        }

        this._onReady = this._onReady.bind(this);
        this._onPlay = this._onPlay.bind(this);
        this._onEnd = this._onEnd.bind(this);
        this._onEndM = this._onEndM.bind(this);
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

    _onEndM(event) {
        setTimeout(() => { event.target.stopVideo(); }, 10);
    }

    render() {

        let widthOfPage = document.body.getBoundingClientRect().width,
            onMobile = false;

        if (widthOfPage > 1170) {
            widthOfPage = 1000
        }
        else if (widthOfPage < 700) {
            onMobile = true;
            widthOfPage = 0.90 * widthOfPage;
        }
        else {
            onMobile = true;
            widthOfPage = 0.75 * widthOfPage;
        }

        const { currentVidID = this.props.videoTileData[0].id } = this.state;

        return (
            onMobile ?
                <div className="youtube-layout-mobile">
                    {
                        this.props.videoTileData.map((o, idx) => {
                            return (
                                <YouTube
                                    containerClassName='mobile-video-tile'
                                    key={idx}
                                    videoId={o.id}
                                    opts={{ width: (widthOfPage), height: (widthOfPage / 2) }}
                                    onEnd={this._onEndM}
                                />
                            )
                        })
                    }
                </div>
                :
                <div className="youtube-layout-pc">
                    <div className="video-list" style={{ height: ((widthOfPage / 2) + "px") }}>
                        {
                            this.props.videoTileData.map((o, idx) => {

                                let tileStyle = {
                                    background: `url(https://img.youtube.com/vi/${o.id}/${o.thumb}.jpg)`,
                                    width: ((widthOfPage / 4) + "px"),
                                    height: ((widthOfPage / 6.5) + "px"),
                                    backgroundSize: "100% 100%",
                                    backgroundRepeat: "no-repeat"
                                };

                                return (
                                    <div className="tile-container" style={tileStyle} key={idx} onClick={() => { this._onPlay(o.id); }}>
                                        <div className="tile-tint">
                                            <div className="tile-text">{o.title}</div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <YouTube
                        containerClassName='current-video'
                        videoId={currentVidID}
                        opts={{ width: (widthOfPage * .8295), height: (widthOfPage / 2) }}
                        onReady={this._onReady}
                        onEnd={this._onEnd} />
                </div>

        );
    }
}

export default YoutubeLayout;