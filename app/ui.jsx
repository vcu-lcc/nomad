import React from 'react';

/*
    Wrapper function/Factory for generating a new wrapper
*/
module.exports = class SlideShow extends React.Component {
    constructor(props) {
        super(props);
        window.a = function() {
            return JSON.stringify(this.state);
        }.bind(this);
        this.state = {
            views: props.views, // An array that contains all of our views. This is accessed by reference.
            viewIndex: 0, // The current View index
            class0: 'rendered',
            pos0: 0,
            class1: '',
            pos1: 1
        };
        this.queue = [];
    }
    transition(view, force) {
        let newState = {};
        switch(this.state['class' + view]) {
            case 'rendered':
                !force || ((newState['class' + view] = 'rendered eject')
                        && (newState['class' + +!view] = 'rendered'));
                break;
            case 'rendered eject':
                newState['pos' + view] = this.state['pos' + view] + 2;
            default:
                newState['class' + view] = '';
        }
        this.setState(newState);
    }
    getView(index) {
        let waitingOnFinish = true;
        let _this = this;
        if (index < this.state.views.length) {
            return React.cloneElement(this.state.views[index].element, {
                callback: function(details, finished) {
                    try {
                        this.state.views[index].callback({
                            finished: !!finished,
                            details
                        });
                    } catch (err) {
                        console.error('Error in callback to slide ' + index, err);
                    }
                    if (finished && waitingOnFinish) {
                        waitingOnFinish = false;
                        if (this.state.viewIndex < this.state.views.length - 1) {
                            this.eject(this.state.viewIndex % 2);
                            this.setState({
                                viewIndex: this.state.viewIndex + 1
                            });
                        }
                    } else {
                        throw new Error('Prevented duplicate final callback from slide', index);
                    }
                }.bind(_this)
            });
        }
    }
    eject(index) {
        this.transition(index, true);
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
                        #view {
                            align-items: center;
                            display: flex;
                            flex-direction: column;
                            height: 100%;
                            justify-content: center;
                            position: absolute;
                            transition: transform 500ms ease-in-out;
                            width: 100%;
                            transform: translateX(100vw);
                        }
                        #view.rendered {
                            transform: translateX(0);
                        }
                        #view.rendered.eject {
                            transform: translateX(-100vw);
                        }
                    `}
                </style>
                <div
                    id="view"
                    className={this.state.class0}
                    onTransitionEnd={i => this.transition(0)}
                >
                    <div
                        onTransitionEnd={e => e.stopPropagation()}
                    >
                        {
                           (function() {
                                if (this.state.class0 != '') {
                                    return this.getView(this.state.pos0);
                                }
                            }.bind(this))()
                        }
                    </div>
                </div>
                <div
                    id="view"
                    className={this.state.class1}
                    onTransitionEnd={i => this.transition(1)}
                >
                    <div
                        onTransitionEnd={e => e.stopPropagation()}
                    >
                        {
                           (function() {
                                if (this.state.class1 != '') {
                                    return this.getView(this.state.pos1);
                                }
                            }.bind(this))()
                        }
                    </div>
                </div>
            </div>
        );
    }
}