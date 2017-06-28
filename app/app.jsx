import React from 'react';
import ReactDOM from 'react-dom';

// The main wrapper function for encapsulating different 'fragments'
import Carousel from './app/carousel';
import ActiveDirectoryLoginForm from './app/authentication';
import ComputerNameGenerator from './app/computer-name-generator';

class MessageSpan extends React.Component {
	constructor(props) {
		super(props);
		setTimeout(function() {
			props.finish({});
		}.bind(this), 1000);
	}
	render() {
		return (
			<div>
				<h1>{this.props.children}</h1>
			</div>
		);
	}
}

class NomadArrayAdapter extends Carousel.ArrayAdapter {
	constructor() {
		super();
		this.stage = -1;
		this.credentials = null;
	}
	next(previousCallbackProps) {
		switch(++this.stage) {
			case 0:
				return <ActiveDirectoryLoginForm />;
			case 1: {
				this.credentials = previousCallbackProps;
				return <ComputerNameGenerator />;
			}
			default:
				return null;
		}
	}
	onMessage(details) {
		switch(this.stage) {
			case 0: {
				console.error(details.details.name, details.details.message);
			}
		}
	}
}

ReactDOM.render((
	<Carousel
		adapter={new NomadArrayAdapter()}
	>
	</Carousel>
), document.querySelector('#react-root'));