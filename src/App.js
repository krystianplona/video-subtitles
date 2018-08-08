import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoSrc: 'http://r.dcs.redcdn.pl/http/o2/atendesoftware/portal/video/atendesoftware/atendesoftware2.mp4',
      videoStatus: true,
      videoTime: 0
    }

    this.playPause = this.playPause.bind(this)
  }

  playPause() {
    this.setState({ videoStatus: !this.state.videoStatus });
    if (this.state.videoStatus) {
      this.refs.vidRef.pause();
    } else {
      this.refs.vidRef.play();
    }
  }

  render() {
    return (
      <div className="App">
        <video ref="vidRef" autoPlay="true" loop muted>
            <source src={ this.state.videoSrc } type="video/mp4" />
        </video>
        <div className="Controls">
          <button onClick={this.playPause}></button>
        </div>
      </div>
    );
  }
}

export default App;
