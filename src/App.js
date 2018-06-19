import React, { Component } from 'react';
import './App.css';
import BlipBox from './BlipBox.js';
import arrow from './play-arrow.svg'
import darkMoon from './dark_moon.wav'

class App extends Component {

  constructor(props) {

    super(props);
    this.state = {isPlaying: false};

    this.audio = new Audio(darkMoon);
    this.songTempo = 128;

    this.toggleAudio = this.toggleAudio.bind(this);
    this.updateVisuals = this.updateVisuals.bind(this);
    this.createBlip = this.createBlip.bind(this);
    this.createClouds = this.createClouds.bind(this);
    this.createStars = this.createStars.bind(this);
    this.blipBox = React.createRef();
  }

  componentDidMount() {
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;

    this.audio.oncanplay = function() {
      const source = audioCtx.createMediaElementSource(this);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
    };
    
    this.analyser = analyser;
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    this.buffer = new Array();
    this.updateVisuals();
  }

  toggleAudio() {
    this.setState(prevState => ({
      isPlaying: !prevState.isPlaying
    }), () => {
      if(this.state.isPlaying){
        this.audio.play() 
        this.beatInterval = setInterval(this.createBlip, 60000/this.songTempo);
        this.cloudInterval = setInterval(this.createClouds, 60000/(this.songTempo/8));
        setTimeout(this.createStars, 0);
        this.starInterval = setInterval(this.createStars, 60000/(this.songTempo/32));
      } else {
        this.audio.pause();
        clearInterval(this.beatInterval);
        clearInterval(this.cloudInterval);
      }
    }) 

  }

  updateVisuals() {
    const BUFFER_SIZE = 16;

    requestAnimationFrame(this.updateVisuals);
    this.analyser.getByteFrequencyData(this.frequencyData);

    // console.log(this.frequencyData.slice(0, this.frequencyData.length/8))

    //If amplitude is a peak, create a Blip
    let total = this.frequencyData.slice(0, this.frequencyData.length/2).reduce((p,c)=>p+c);

    this.amplitude = (total/(16*256))**2;

    // if(this.buffer.filter(t=>t>total).length == 0 && total > 0){
    //   this.createBlip();
    // }

    //Update amplitude buffer
    this.buffer = this.buffer.concat(total);
    if(this.buffer.length > BUFFER_SIZE) {
      this.buffer = this.buffer.slice(1,this.buffer.length-1);
    }
  }


  createBlip () {
    this.blipBox.current.createBlip(this.amplitude);
  }

  createClouds() {
    this.blipBox.current.createClouds(this.amplitude);
  }

  createStars() {
    this.blipBox.current.createStars(this.amplitude);
  }


  render() {
    return (
      <div className="App" onClick={this.toggleAudio}>
        <button className={"play-button " + (this.state.isPlaying ? 'hidden' : 'show')}>
          <img src={arrow}/>
        </button>
        <div className={"visual-container " + (this.state.isPlaying ? 'show' : 'hidden')}> 
          <BlipBox ref={this.blipBox}></BlipBox>
        </div>
      </div>
    );
  }
}

export default App;
