import React from 'react';
import ReactDOM from 'react-dom';

// The main wrapper function for encapsulating different 'fragments'
import SlideShow from './app/ui';
// One particular fragment. The format of this (and subsequent imports) will change soon.
import ActiveDirectoryLoginForm from './app/authentication';

class TestApplication1 extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div>
				<p>This is where the second view fragment will be.</p>
			</div>
		);
	}
}

const applicationPath = [{
	element: <ActiveDirectoryLoginForm></ActiveDirectoryLoginForm>,
	callback: function(details) {
		console.log(details);
	}
}, {
	element: <TestApplication1></TestApplication1>,
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