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
/*
    Wrapper function/Factory for generating a new wrapper
*/
class Carousel extends React.Component {
    constructor(props) {
        super(props);
        this.counter = 0;
        this.queue = [];
        this.state = {
            views: null,
            slide: false
        };
        setTimeout(() => {
            this.setState({
                views: [this.get(0)]
            });
        }, 0);
    }
    get(index) {
        let finished = false;
        const that = this;
        let nextView = this.props.children[index];
        return nextView ? (
            <div
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: '1',
                    justifyContent: 'center',
                    width: '100%'
                }}
                className='carousel-child'
                onTransitionEnd={e => e.stopPropagation()}
                key={String(this.counter++)}
            > { nextView } </div>
        ) : false;
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.index != nextProps.index) {
            let newView = this.get(nextProps.index);
            if (newView) {
                if (this.state.slide) {
                    this.queue.push(newView);
                } else {
                    this.setState({
                        views: this.state.views.concat([newView]),
                        slide: true
                    });
                }
            }
        }
    }
    _destroyPreviousView() {
        this.setState({
            views: this.state.views.slice(1, this.state.views.length),
            slide: false
        });
        if (this.queue.length > 0) {
            setTimeout(function() {
                this.setState({
                    views: this.state.views.concat([this.queue.shift()]),
                    slide: true
                });
            }.bind(this), 0);
        }
    }
    render() {
        return (
            <div
                onTransitionEnd={this._destroyPreviousView.bind(this)}
                className="hold"
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    height: '100%',
                    justifyContent: 'center',
                    transition: this.state.slide ? 'transform 500ms ease-in-out' : null,
                    transform: this.state.slide ? 'translateX(-50%)' : null,
                    width: this.state.slide ? '200%' : '100%'
                }}
            >
                <style>
                    {`
                        div.hold {
                            transform: translateX(0);
                        }
                    `}
                </style>
                {this.state.views}
            </div>
        );
    }
};

export default Carousel;