import React from 'react';
import ReactDOM from 'react-dom';

// The main wrapper function for encapsulating different 'fragments'
import SlideShow from './app/ui';
// One particular fragment. The format of this (and subsequent imports) will change soon.
import authenticate from './app/authentication';


class TestApplication1 extends React.Component {
	constructor(props) {
		super(props);
		console.warn('init');
		setTimeout(function() {
			this.props.onFinished({
				success: true,
				details: {
					data: 'junk'
				}
			});
		}.bind(this), 1000);
	}
	render() {
		return (
			<div>
				<p>This is an example of a potential fragment...</p>
			</div>
		);
	}
}

class TestApplication2 extends React.Component {
	constructor(props) {
		super(props);
		console.warn('init');
		setTimeout(function() {
			this.props.onFinished({
				success: false,
				error: new Error('IO Exception')
			});
		}.bind(this), 1000);
	}
	render() {
		return (
			<div>
				<p>This is the second fragment.</p>
			</div>
		);
	}
}

let testApplication1 = <TestApplication1></TestApplication1>;
let testApplication2 = <TestApplication2></TestApplication2>;

const applicationPath = [{
	element: testApplication1,
	callback: function(details) {
		console.log(details);
	}
}, {
	element: testApplication2,
	callback: function(details) {
		console.log(details);
	}
}];

const slideShow = (
	<SlideShow
		views={applicationPath}
	>
	</SlideShow>
);

ReactDOM.render(slideShow, document.querySelector('#react-root'));