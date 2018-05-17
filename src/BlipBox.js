import React, { Component } from 'react';

class BlipBox extends Component {

	constructor(props){
		super(props);

		this.state = {blips:[], blipCount: 0};
		this.createBlip = this.createBlip.bind(this);
	}

	createBlip() {
	    const blip =  <Blip key={this.state.blipCount}></Blip>;
	    this.setState({blips: this.state.blips.concat(blip), blipCount: ++this.state.blipCount});
	    setTimeout(()=>{
	      const idx = this.state.blips.indexOf(blip);
	      this.setState({...this.state, blips: this.state.blips.slice(0,idx).concat(this.state.blips.slice(idx+1))});
	    }, 1000);
  	}

	render(){
		return (
			<div>{this.state.blips}</div>
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
			// left: `${Math.round(Math.random()*100)}%`,
			// top: `${Math.round(Math.random()*100)}%`,
			opacity: 1
		};
	}

	componentDidMount(){
		setTimeout(()=>{this.setState({...this.state, opacity: 0})},100);
	}

	render(){
		return(
			<div className='blip' style={this.state}></div>
		);
	}
}

export default BlipBox;