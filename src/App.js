import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoSrc: 'http://r.dcs.redcdn.pl/http/o2/atendesoftware/portal/video/atendesoftware/atendesoftware2.mp4',
      videoStatus: true,
      videoTime: 0,
      videoTimePercent: 0,
      muted: true,
      subtitles: [],
      currentText: '',
      showSubtitles: true
    }

    this.playPause = this.playPause.bind(this);
    this.reset = this.reset.bind(this);
    this.mute = this.mute.bind(this);
    this.showHideSubtitles = this.showHideSubtitles.bind(this);
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
  
  showHideSubtitles() {
    this.setState({ showSubtitles: !this.state.showSubtitles})
  }
  
  mute() {
    this.setState({ muted: !this.state.muted})
  }

  // rewind method
  onProgressBarClick(e) {
    const clickedPosition = e.pageX - e.target.getBoundingClientRect().left;
    const progressBarWidth = e.target.offsetWidth;
    const clickedPositionPercent = clickedPosition / progressBarWidth * 100;
    
    this.setState({
      videoTimePercent: clickedPositionPercent
    },()=>{
      this.refs.vidRef.currentTime = this.refs.vidRef.duration * (this.state.videoTimePercent / 100)
    });
  }

  timeConvert(num) {
    const hours = Math.floor(num / 60);
    const minutes = num % 60;
    return hours + ":" + Math.floor(minutes);
  }
  
  componentWillMount() {
    // fetch subtitles and puts them inside of state
    fetch('http://r.dcs.redcdn.pl/http/o2/atendesoftware/portal/video/atendesoftware/atendesoftware_2a.txt')
      .then(response => response.text())
      .then(data => {
        const subtitles = data.trim().split("\n").map((e)=>{
          const timestampStartHelper = e.slice(0,12).split(':').map((e) => {return Number(e)}) //timestamp always end after 25 char
          const timestampEndHelper = e.slice(13,25).split(':').map((e) => {return Number(e)}) //timestamp always end after 25 char
          const timestampStart = (timestampStartHelper[0] * 3600) +  (timestampStartHelper[1] * 60) + timestampStartHelper[2];
          const timestampEnd = (timestampEndHelper[0] * 3600) + ( timestampEndHelper[1] * 60) + timestampEndHelper[2];
          const text = e.slice(26, e.length - 1);
          
          return {
            timestampStart,
            timestampEnd,
            text
          }
        });
        this.setState({
          subtitles
        });
      });
  }
  
  componentDidMount() {
    setInterval(() => {
      const currentText = this.state.subtitles.filter((e)=>{
        if(this.refs.vidRef.currentTime > e.timestampStart && this.refs.vidRef.currentTime < e.timestampEnd) {
          return e
        } else {
          return false
        }
      })[0];
      
      this.setState({
        videoTimePercent: this.refs.vidRef ? this.refs.vidRef.currentTime / this.refs.vidRef.duration * 100 : 0,
        videoTime: this.refs.vidRef && this.refs.vidRef.currentTime,
        currentText: currentText ? currentText.text : ''
      })
    }, 100);
  }

  render() {
    const { duration } = this.refs.vidRef ? this.refs.vidRef : 0;
    const { videoTime, videoTimePercent, currentText, showSubtitles, videoSrc, muted } = this.state;
    
    return (
      <div className="App">
        <video ref="vidRef" autoPlay="true" loop muted={muted}>
            <source src={videoSrc} type="video/mp4" />
        </video>
        {
          currentText && showSubtitles && <div className="Subtitles">{currentText}</div>
        }
        <div className="Controls">
          <button onClick={this.playPause}>P</button>
          <button onClick={this.reset}>R</button>
          <div className="ProgressBar" onClick={ (e)=>{this.onProgressBarClick(e)} }>
            <progress value={videoTimePercent ? videoTimePercent : 0} max='100' ref="progressBarRef"></progress>
          </div>
          <button onClick={this.showHideSubtitles} className="SubtitlesButton">T</button>
          <div className="Time">{videoTime && this.timeConvert(videoTime)} / {videoTime && this.timeConvert(duration)}</div>
          <button onClick={this.mute}>M</button>
        </div>
      </div>
    );
  }
}

export default App;
