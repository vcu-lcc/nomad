import React from 'react';

module.exports = class Dropdown extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			options: props.options,
			activeIndex: 0,
			isExpanded: false
		};
	}
	createOption(i, highlight=false) {
		return (
			<div
				key={i}
				className={this.state.activeIndex == i && highlight ? 'option active' : 'option'}
				style={{
					background: highlight ? null : 'none'
				}}
				onClick={function() {
					this.setState({
						activeIndex: i
					});
				}.bind(this)}
			>
				{this.state.options[i]}
			</div>
		)
	}
	createOptions(options) {
		let children = [];
		for (let i = 0; i != options.length; i++) {
			children.push(this.createOption(i, true));
		}
		return children;
	}
	render() {
		return (
			<div
				style={{
					userSelect: 'none',
					cursor: 'default',
					display: 'flex',
					fontFamily: '"Segoe UI"',
					alignItems: 'center'
				}}
			>
				<div
					style={{
						paddingRight: '16px',
						fontSize: 'larger'
					}}
				>
					{this.props.label}
				</div>
				<div
					style={{
						width: this.props.width || '150px'
					}}
					onClick={function() {
						this.setState({
							isExpanded: !this.state.isExpanded
						});
					}.bind(this)}
				>
					<style>{`
						div.dropdownPreview div.option {
							padding: 5px 10px 5px 10px;
						}
						div.dropdownPreview {
							display: flex;
							padding: 5px 10px 5px 10px;
							border: #BDBDBD solid 2px;
						}
						div.dropdownPreview:hover {
							border: #9E9E9E solid 2px;
						}
					`}</style>
					<div
						className="dropdownPreview"
						style={{
							display: this.state.isExpanded ? 'none' : 'flex',
						}}
					>
						<div
							style={{
								flexGrow: 1,
								transform: 'translateY(-2px)'
							}}
						>
							{this.createOption(this.state.activeIndex)}
						</div>
						<img src="images/dropdown.svg" />
					</div>
					<div
						style={{
							display: this.state.isExpanded ? 'flex' : 'none',
							flexDirection: 'column',
							border: '#BDBDBD solid 2px',
							padding: '5px 0 5px 0',
							background: '#F5F5F5'
						}}
					>
						<style>{`
							div.option {
								padding: 10px 10px 10px 20px;
							}
							div.option:hover {
								background: #BDBDBD;
							}
							div.option.active {
								background: #90CAF9;
							}
							div.option.active:hover {
								background: #42A5F5;
							}
						`}</style>
						{this.createOptions(this.state.options)}
					</div>
				</div>
			</div>
		);
	}
}