import React from 'react';
import PropTypes from 'prop-types';
import { PanResponder, Animated } from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';
import createReactClass from 'create-react-class';

import {
    isValidHorizontalGesture,
} from '../util/gesture/index';


const HorizontalGestureResponder = createReactClass({

    propTypes: {
        enabled: PropTypes.bool, // should we respond to gestures
        leftGestureEnabled: PropTypes.bool,
        rightGestureEnabled: PropTypes.bool,
        shouldSetResponderOnStart: PropTypes.func,
        shouldSetResponderOnMove: PropTypes.func,
        shouldSetResponderCapture: PropTypes.func, // hook for becoming capture on start
        allowTermination: PropTypes.bool, // should we allow another responder to capture?
        onGestureStart: PropTypes.func,
        onResponderStart: PropTypes.func,
        onResponderEnd: PropTypes.func,
        onResponderUpdate: PropTypes.func,
        onInvalidGesture: PropTypes.func
    },

    getDefaultProps() {
        return {
            enabled: true,
            leftGestureEnabled: true,
            rightGestureEnabled: true,
            allowTermination: false,
            shouldSetResponderCapture: () => false,
            shouldSetResponderOnMove: () => true,
            shouldSetResponderOnStart: () => false,
            onGestureStart: () => {},
            onResponderStart: () => {},
            onResponderEnd: () => {},
            onResponderUpdate: () => {},
            onInvalidGesture: () => {}
        };
    },

    componentWillMount() {
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponderCapture: this.handleOnStartShouldSetPanResponderCapture,
            onStartShouldSetPanResponder: this.handleOnStartShouldSetPanResponder,
            onMoveShouldSetPanResponder: this.handleOnMoveShouldSetPanResponder,
            onPanResponderGrant: this.handleResponderStart,
            onPanResponderMove: this.handlePanResponderMove,
            onPanResponderRelease: this.handlePanResponderEnd,
            onPanResponderTerminationRequest: () => this.props.allowTermination,
            onPanResponderTerminate: this.handlePanResponderEnd
        });
    },

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    },

    handleOnStartShouldSetPanResponderCapture(e, g) {
        this.props.onGestureStart(e, g);
        return this.props.enabled && this.props.shouldSetResponderCapture(e, g);
    },

    handleOnStartShouldSetPanResponder(e, g) {
        return this.props.enabled && this.props.shouldSetResponderOnStart(e, g);
    },

    handleOnMoveShouldSetPanResponder(e, g) {
        if (this.props.enabled && this.props.shouldSetResponderOnMove(e, g)) {
            if (isValidHorizontalGesture(g)) {
                return true;
            }
            else {
                this.props.onInvalidGesture(e, g);
                return false;
            }
        }
        return false;
    },

    handleResponderStart(e, g) {
        return this.props.onResponderStart(e, g);
    },

    handlePanResponderMove(e, g) {
        return this.props.onResponderUpdate(e, g);
    },

    handlePanResponderEnd(e, g) {
        return this.props.onResponderEnd(e, g);
    },

    render() {
        let panHandlers = this.props.enabled ? this.panResponder.panHandlers : {};
        return (
            <Animated.View {...panHandlers} style={this.props.style}>
                {this.props.children}
            </Animated.View>
        );
    }
});


export default HorizontalGestureResponder;