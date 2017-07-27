import React from 'react';
import Radium from 'radium';
import PropTypes from 'prop-types';

const styles = {
	base: {
		display: 'flex',
		userSelect: 'none',
		cursor: 'default',
		fontFamily: '"Segoe UI"',
		fontSize: 'larger'
	},
	input: {
		border: '#BDBDBD solid 2px',
		flexGrow: '1',
		height: '24px',
		padding: '5px 10px',
		':hover': {
			border: '#9E9E9E solid 2px'
		},
		':focus': {
			outline: 'none'
		},
	}
};

class InputBox extends React.Component {
	constructor(props) {
		super(props);
		this.inputBox = null;
	}
	getValue() {
		return this.inputBox.value;
	}
	setValue(str) {
		this.inputBox.value = str;
	}
	render() {
		return (
			<div
				style={[styles.base, {
					width: this.props.width
				}]}
			>
				<input
					ref={r => this.inputBox = r}
					onChange={() => this.props.onChange(this.getValue())}
					style={[styles.input]}
					placeholder={this.props.placeholder}
				></input>
			</div>
		)
	}
}

InputBox.defaultProps = {
	onChange: function() {
	},
	placeholder: null,
	width: '600px'
};

InputBox.propTypes = {
	onChange: PropTypes.func,
	placeholder: PropTypes.string,
	width: PropTypes.string
};

export default Radium(InputBox);