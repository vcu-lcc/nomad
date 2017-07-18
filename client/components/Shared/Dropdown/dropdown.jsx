/*
    Copyright (C) 2017 Darren Chan

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
import React from 'react';

module.exports = class Dropdown extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeIndex: 0,
			isExpanded: false
		};
	}
	createOption(i) {
		return (
			<div
				key={i}
				style={{
					transform: this.state.isExpanded || this.state.activeIndex == i ? 'scale(1)' : null,
					transition: 'transform 250ms ease-out, height 250 ease-out',
					height: this.state.isExpanded || this.state.activeIndex == i ? '22px' : null,
					overflowY: 'hidden'
				}}
				className={this.state.activeIndex == i ? 'active option' : 'option'}
				onClick={function() {
					!this.state.isExpanded || this.setState({
						activeIndex: i
					});
				}.bind(this)}
			>
				{this.props.options[i]}
			</div>
		)
	}
	createOptions(options) {
		let children = [];
		for (let i = 0; i != options.length; i++) {
			children.push(this.createOption(i));
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
				onBlur={function() {
					this.setState({
						isExpanded: false
					});
				}.bind(this)}
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
						// Manipulate this offsetTop
					}}
					onClick={function() {
						this.setState({
							isExpanded: !this.state.isExpanded
						});
					}.bind(this)}
				>
					<style>{`
						div.dropbox {
							padding: 5px 10px 5px 10px;
							border: #BDBDBD solid 2px;
						}
						div.dropbox:hover {
							border: #9E9E9E solid 2px;
						}
						div.dropbox div.option {
							transform: scale(0);
							height: 0;
						}
						div.dropbox.preview div.option.active {
							transform: scale(1);
							padding: 5px 10px 5px 10px;
						}
						div.dropbox.expanded {
							padding: 5px 0 5px 0;
						}
						div.dropbox.expanded div.option {
							padding: 10px 10px 10px 20px;
						}
						div.dropbox.expanded div.option:hover {
							background: #BDBDBD;
						}
						div.dropbox.expanded div.option.active {
							background: #E1F5FE;
						}
						div.dropbox.expanded div.option.active:hover {
							background: #81D4FA;
						}
					`}</style>
					<div
						className={'dropbox ' + (this.state.isExpanded ? 'expanded' : 'preview')}
						style={{
							display: 'flex'
						}}
					>
						<div
							style={{
								flexGrow: 1,
								transform: 'translateY(-2px)'
							}}
						>
							{this.createOptions(this.props.options)}
						</div>
						<img
							style={{
								display: this.state.isExpanded ? 'none' : 'block'
							}}
							src={require("./dropdown.svg")}
						/>
					</div>
				</div>
			</div>
		);
	}
}