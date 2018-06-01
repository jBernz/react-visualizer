import React, { Component } from 'react';

class BlipBox extends Component {

	constructor(props){
		super(props);

		this.state = {blips:[], blipCount: 0, clouds:[], cloudCount: 0};
		this.createBlip = this.createBlip.bind(this);
	}

	createBlip(amplitude) {
	    const blip =  <Blip key={this.state.blipCount} amplitude={amplitude}></Blip>;
	    this.setState({blips: this.state.blips.concat(blip), blipCount: ++this.state.blipCount});
	    setTimeout(()=>{
	      const idx = this.state.blips.indexOf(blip);
	      this.setState({...this.state, blips: this.state.blips.slice(0,idx).concat(this.state.blips.slice(idx+1))});
	    }, 4000);
  	}

  	createClouds(amplitude) {
  		console.log('clouds');
  		for(let i=0; i<4; i++){
  			const cloud = <Cloud key={this.state.cloudCount} amplitude={amplitude}></Cloud>;
	    	this.setState({clouds: this.state.clouds.concat(cloud), cloudCount: ++this.state.cloudCount});
  		}
		setTimeout(()=>{
	  		this.setState({...this.state, clouds: this.state.clouds.slice(4)});
		}, 16000);

  	}

	render(){
		return (
			<div className='blip-box'>{this.state.blips}{this.state.clouds}</div>
		);
	}
}

class Blip extends Component {
	constructor(props){
		super(props)
		this.state = {
			background: `rgb(
				${Math.round(Math.random()*255)},
				${Math.round(Math.random()*255)},
				${Math.round(Math.random()*255)})`,
			// left: `${Math.round(Math.random()*80)}%`,
			// bottom: '-300px',
			opacity: 1,
			height: props.amplitude*1000,
			width: props.amplitude*1000
		};
	}

	componentDidMount(){
		setTimeout(()=>{this.setState({...this.state, opacity: 0})},100);
		setTimeout(()=>{this.setState({...this.state, transform: 'scale(3,3)'})},500);
	}

	render(){
		return(
			<div className='blip' style={this.state}></div>
		);
	}
}

class Cloud extends Component {
	constructor(props){
		super(props) 
	
		let brightness = Math.round(Math.random()*255);
		let size = Math.round(Math.random()*15);

		//Offset Cloud from center depending on amplitude
		let left = 50 + Math.round((Math.random()-0.5)*60);
		let offsetLeft = left > 50 ? Math.round(props.amplitude*500)-size/2 :  Math.round(props.amplitude*-500)-size/2;
		let bottom = 50 + Math.round((Math.random()-0.5)*60);
		let offsetBottom = bottom > 50 ? Math.round(props.amplitude*500)+size/2 :  Math.round(props.amplitude*-500)+size/2;

		this.state = {
			background: `rgb(${brightness}, ${brightness}, ${brightness})`,
			left: `calc(${left}% + ${offsetLeft}px)`,
			bottom: `calc(${bottom}% + ${offsetBottom}px)`,
			opacity: 0,
			height: `${size}%`,
			width: `${size*1.3}%`
		};

		console.log(this.state.left)
	}

	componentDidMount(){
		setTimeout(()=>{this.setState({...this.state, opacity: 0.8, transform: 'translateX(200px)'})}, 100);
		setTimeout(()=>{this.setState({...this.state, opacity: 0})}, 5000);
	}

	render(){
		return(
			<div className='cloud' style={this.state}></div>
		);
	}
}

export default BlipBox;