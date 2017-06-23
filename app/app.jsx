import React from 'react';
import ReactDOM from 'react-dom';

// The main wrapper function for encapsulating different 'fragments'
import SlideShow from './app/ui';
// One particular fragment. The format of this (and subsequent imports) will change soon.
import ActiveDirectoryLoginForm from './app/authentication';

class TestApplication1 extends React.Component {
	constructor(props) {
		super(props);
		setTimeout(function() {
			props.callback({}, true);
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

const applicationPath = [{
	element: <ActiveDirectoryLoginForm></ActiveDirectoryLoginForm>,
	callback: function(details) {
	}
}, {
	element: <TestApplication1>Second</TestApplication1>,
	callback: function(details) {
	}
}, {
	element: <TestApplication1>Third</TestApplication1>,
	callback: function(details) {
	}
}, {
	element: <TestApplication1>Fourth</TestApplication1>,
	callback: function(details) {
	}
}];

const slideShow = (
	<SlideShow
		views={applicationPath}
	>
	</SlideShow>
);

ReactDOM.render(slideShow, document.querySelector('#react-root'));