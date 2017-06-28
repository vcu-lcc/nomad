import React from 'react';

/*
    Wrapper function/Factory for generating a new wrapper
*/
module.exports = class Carousel extends React.Component {
    constructor(props) {
        super(props);
        if (!(this.props.adapter instanceof Carousel.ArrayAdapter)) {
            throw new Error('An invalid adapter was provided. adapter\'s class must extend Carousel.ArrayAdapter');
        }
        this.counter = 0;
        this.state = {
            views: [this.getNext(null)],
            slide: false
        };
    }
    getNext(previousProps) {
        let finished = false;
        const api = this;
        const nextView = this.props.adapter.next(previousProps);
        return nextView ? (
            <div
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    justifyContent: 'center',
                    width: '100vw'
                }}
                onTransitionEnd={e => e.stopPropagation()}
                key={String(this.counter++)}
            >
                {
                    React.cloneElement(nextView, {
                        postMessage: function(details) {
                            this.props.adapter.onMessage(details);
                        }.bind(api),
                        finish: function(details) {
                            if (!finished) {
                                this.push(details);
                                finished = true;
                                return;
                            }
                            throw new Error('Duplicate finish callback!');
                        }.bind(api)
                    })
                }
            </div>
        ) : false;
    }
    push(callbackParams) {
        let newView = this.getNext(callbackParams);
        if (newView) {
            this.setState({
                views: this.state.views.concat([newView]),
                slide: true
            });
        }
    }
    pop() {
        this.setState({
            views: this.state.views.slice(1, this.state.views.length),
            slide: false
        });
    }
    render() {
        return (
            <div
                onTransitionEnd={this.pop.bind(this)}
                className="hold"
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    height: '100%',
                    justifyContent: 'center',
                    position: 'fixed',
                    transition: this.state.slide ? 'transform 500ms ease-in-out' : null,
                    transform: this.state.slide ? 'translateX(-100vw)' : null,
                    minWidth: '100%'
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

module.exports.ArrayAdapter = class {
    constructor() {
    }
    next(props) {
        throw new Error('ArrayAdapter.next() not implemented!');
    }
    onMessage(props) {
        throw new Error('ArrayAdapter.onMessage() not implemented!');
    }
}