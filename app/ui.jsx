import React from 'react';

/*
    Wrapper function/Factory for generating a new wrapper
*/
module.exports = class SlideShow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            views: props.views, // An array that contains all of our views. This is accessed by reference.
            viewIndex: 0, // The current View index
            transition: null, // A function (or falsey value) that serves as a callback for onTransitionEnd
            transitionElem: null // A View (or falsey value) that gets animated in.
        };
        this.cachedViews = {};
    }
    getView(index) {
        return this.cachedViews[index] || (this.cachedViews[index] = // This is so that we don't clone an element twice.
            /*
                @FIXME: Child constructors still call twice
            */
            (function(awaitingCallback) {
                return React.cloneElement(this.state.views[index].element, {
                    callback: function(details, finished) {
                        if (!awaitingCallback) {
                            return;
                        }
                        awaitingCallback = false;
                        try {
                            this.state.views[index].callback({
                                finished: !!finished,
                                details
                            });
                        } catch (err) {
                            console.error('Error in callback to slide ' + index, err);
                        }
                        if (finished) {
                            if (this.state.viewIndex < this.state.views.length - 1) {
                                this.nextPage();
                            }
                        }
                    }.bind(this)
                });
            }.bind(this))(true));
    }
    render() {
        return (
            <div
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    height: '100%',
                    justifyContent: 'center',
                    position: 'fixed',
                    width: '100%'
                }}
            >
                <style>
                    {`
                        div.fixed {
                            transform: translateX(0);
                        }
                        div.right {
                            transform: translateX(100vw);
                        }
                    `}
                </style>
                <div
                    className="fixed"
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        height: '100%',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        position: 'absolute',
                        transform: this.state.transition ? 'translateX(-100vw)' : null,
                        transition: this.state.transition ? 'transform 500ms ease-in-out' : null,
                        width: '100%',
                        zIndex: '1'
                    }}
                    onTransitionEnd={this.state.transition}
                >
                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute'
                            }}
                        >
                            {this.getView(this.state.viewIndex)}
                        </div>
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            transform: 'translateX(100vw)'
                        }}
                    >
                        {this.state.transitionElem}
                    </div>
                </div>
            </div>
        );
    }
    nextPage() {
        this.setState({
            transitionElem: this.getView(this.state.viewIndex + 1),
            transition: function() {
                // Async callback after transition ends
                this.setState({
                    transition: null,
                    transitionElem: null,
                    viewIndex: this.state.viewIndex + 1
                });
            }.bind(this)
        });
    }
}