import React, { Component, Fragment } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoSrc: 'http://r.dcs.redcdn.pl/http/o2/atendesoftware/portal/video/atendesoftware/atendesoftware2.mp4',
      videoStatus: true,
      videoTime: 0,
      videoTimePercent: 0,

    }

    this.playPause = this.playPause.bind(this)
    this.reset = this.reset.bind(this)
  }

  playPause() {
    this.setState({ videoStatus: !this.state.videoStatus });
    if (this.state.videoStatus) {
      this.refs.vidRef.pause();
    } else {
      this.refs.vidRef.play();
    }
  }

  reset() {
    this.setState({ videoStatus: false });
    this.refs.vidRef.currentTime = 0;
  }

  onProgressBarClick(e) {
    console.log(e.target)
  }

  time_convert(num) {
    var hours = Math.floor(num / 60);
    var minutes = num % 60;
    return hours + ":" + Math.floor(minutes);
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        videoTimePercent: this.refs.vidRef && this.refs.vidRef.currentTime / this.refs.vidRef.duration * 100,
        videoTime: this.refs.vidRef && this.refs.vidRef.currentTime
      })
    },100)
  }

  render() {
    const { duration } = this.refs.vidRef ? this.refs.vidRef : 0;

    return (
      <Fragment>
        <div className="App">
          <video ref="vidRef" autoPlay="true" loop muted>
              <source src={ this.state.videoSrc } type="video/mp4" />
          </video>
          <div className="Controls">
            <button onClick={this.playPause}></button>
            <button onClick={this.reset}></button>
            <div className="ProgressBar" onClick={ (e)=>{this.onProgressBarClick(e)} }>
              <span style={{width: `${this.state.videoTimePercent}%`}}></span>
            </div>
            <button className="Subtitles"></button>
            <div>{this.time_convert(this.state.videoTime)} / { this.time_convert(duration) }</div>
          </div>
        </div>
        <div>
          {this.state.videoTimePercent}
        </div>
      </Fragment>
    );
  }
}

export default App;
