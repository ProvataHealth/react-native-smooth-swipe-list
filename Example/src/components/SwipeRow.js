import React, { PropTypes } from 'react';
import {
    StyleSheet,
    View,
    TouchableHighlight,
    Animated,
    Easing
} from 'react-native';

import {
    applySimpleTension,
    normalizeVelocity,
    isValidHorizontalGestureAngle,
    isValidHorizontalGesture
} from '../util/gesture';
import {
    getLayout,
    getWidth
} from '../util/layout';
import {
    GESTURE_DISTANCE_THRESHOLD,
    OPEN_POSITION_THRESHOLD_FACTOR,
    CLOSE_POSITION_THRESHOLD_FACTOR,
    OPEN_VELOCITY_THRESHOLD,
    MAX_OPEN_THRESHOLD
} from '../constants';
import HorizontalGestureResponder from './HorizontalGestureResponder';


const SwipeRow = React.createClass({

    propTypes: {
        style: View.propTypes.style,
        swipeEnabled: PropTypes.bool,
        onSwipeStart: PropTypes.func,
        onSwipeUpdate: PropTypes.func,
        onSwipeEnd: PropTypes.func,
        onOpen: PropTypes.func,
        onClose: PropTypes.func,
        onCapture: PropTypes.func,
        leftSubView: PropTypes.element,
        rightSubView: PropTypes.element,
        startOpen: PropTypes.bool,
        blockChildEventsWhenOpen: PropTypes.bool
    },

    getDefaultProps() {
        return {
            swipeEnabled: true,
            blockChildEventsWhenOpen: true,
            onSwipeStart: () => {},
            onSwipeUpdate: () => {},
            onSwipeEnd: () => {},
            onOpen: () => {},
            onClose: () => {}
        };
    },

    getInitialState() {
        return {
            pan: new Animated.ValueXY(),
            animating: false,
            velocityPan: false,
            open: false
        };
    },

    componentWillReceiveProps(nextProps) {
        this.close();
    },

    componentWillUnmount() {
        this.clearCloseTimeout();
    },

    onSwipeStart(e, g) {
        this.props.onSwipeStart(this, e, g);
        this.state.pan.stopAnimation();
        this.state.pan.setOffset({ x: this.state.pan.x._value, y: this.state.pan.y._value });
        this.state.pan.setValue({ x: 0, y: 0 });
        this.clearCloseTimeout();
    },

    onSwipeUpdate(e, g) {
        let { dx } = g;
        this.props.onSwipeUpdate(this, e, g);
        this.state.open ? this.handleSwipeWhenOpen(dx) : this.handleSwipeWhenClosed(dx);
    },

    onSwipeEnd(e, g) {
        let { dx, vx } = g;
        this.props.onSwipeEnd(this, e, g);
        this.state.pan.flattenOffset();
        vx = normalizeVelocity(vx);
        if (this.state.open) {
            this.checkAnimateOpenOrClose(dx, vx);
        }
        else {
            if (this.state.activeSide === 'left' && dx > 0 || this.state.activeSide === 'right' && dx < 0) {
                this.checkAnimateOpenOrClose(dx, vx);
            }
        }
    },

    handleSwipeWhenOpen(dx) {
        this.updatePanPosition(dx);
    },

    handleSwipeWhenClosed(dx) {
        if (dx <= 0) {
            if (!this.state.activeSide && this.props.rightSubView) {
                this.setState({
                    activeSide: 'right'
                });
            }
            dx = this.props.rightSubView && this.state.activeSide === 'right' ? dx : 0;
            this.updatePanPosition(dx);
        }
        else if (dx >= 0) {
            if (!this.state.activeSide && this.props.leftSubView) {
                this.setState({
                    activeSide: 'left'
                });
            }
            dx = this.props.leftSubView && this.state.activeSide === 'left' ? dx : 0;
            this.updatePanPosition(dx);
        }
    },

    updatePanPosition(dx) {
        let relativeDX;
        if (this.state.activeSide === 'left') {
            relativeDX = dx + this.state.leftSubViewWidth;
            dx = relativeDX >= 0 ? dx : -this.state.leftSubViewWidth;
            this.setPanPosition(dx);
        }
        else if (this.state.activeSide === 'right') {
            relativeDX = this.state.rightSubViewWidth - dx;
            dx = relativeDX >= 0 ? dx : this.state.rightSubViewWidth;
            this.setPanPosition(dx);
        }
    },

    setPanPosition(dx) {
        dx = applySimpleTension(dx, this.getActiveSubViewWidth());
        this.state.pan.setValue({ x: dx, y: 0 });
    },

    checkAnimateOpenOrClose(dx, vx) {
        if ((Math.abs(dx) <= GESTURE_DISTANCE_THRESHOLD) && this.state.open) {
            this.animateOpenOrClose(0, vx);
        }
        else {
            this.checkOpenOrClose(dx, vx);
        }
    },

    checkOpenOrClose(dx, vx) {
        let isLeft = this.state.activeSide === 'left';
        let openPosition = this.getActiveSubViewOpenPosition();
        let toValue;
        let isOpen;
        if (this.state.open) {
            let pastClosedThreshold = this.isPastCloseThreshold(dx, vx);
            if ((dx > 0 && isLeft) || (dx < 0 && !isLeft)) {
                isOpen = true;
                toValue = openPosition;
            }
            else {
                isOpen = !pastClosedThreshold;
                toValue = pastClosedThreshold ? 0 : openPosition;
            }
        }
        else {
            let pastOpenThreshold = this.isPastOpenThreshold(dx, vx);
            isOpen = pastOpenThreshold;
            toValue = pastOpenThreshold ? openPosition : 0;
        }
        this.animateOpenOrClose(toValue, vx);
    },

    isPastOpenThreshold(dx, vx) {
        if (dx > 0 && this.props.leftSubView || dx < 0 && this.props.rightSubView) {
            let thresholdBase = this.getActiveSubViewWidth() * OPEN_POSITION_THRESHOLD_FACTOR;
            let absVX = Math.abs(vx);
            let velocityMod = (absVX * (thresholdBase * 2));
            let threshold = thresholdBase - velocityMod;
            return Math.abs(dx) >= Math.min(threshold, MAX_OPEN_THRESHOLD);
        }

        return false;
    },

    isPastCloseThreshold(dx, vx) {
        let thresholdBase = this.getActiveSubViewWidth() * CLOSE_POSITION_THRESHOLD_FACTOR;
        let absVX = Math.abs(vx);
        let velocityMod = (absVX * (thresholdBase * 2));
        let threshold = thresholdBase - velocityMod;
        return Math.abs(dx) >= threshold;
    },

    animateOpenOrClose(toValue, vx, noBounce) {
        let isOpen = toValue !== 0;
        Animated.spring(
            this.state.pan,
            {
                toValue: { x: toValue, y: 0 },
                velocity: vx,
                friction: noBounce ? 7 : 4,
                tension: 22 * Math.abs(vx)
            }
        ).start(() => {
            this.setState({
                activeSide: isOpen ? this.state.activeSide : null
            });
        });
        this.setState({
            open: isOpen
        });
        isOpen ? this.props.onOpen(this) : this.props.onClose(this);
    },

    close(skipAnimation) {
        this.clearCloseTimeout();
        if (skipAnimation) {
            this.setState({ pan: new Animated.ValueXY() });
        }
        else {
            this.animateOpenOrClose(0, 0.75, true);
        }
        this.props.onClose(this);
    },

    isOpen() {
        return this.state.open;
    },

    getActiveSubViewOpenPosition() {
        return this.state.activeSide === 'left'
            ? this.state.leftSubViewWidth
            : -this.state.rightSubViewWidth;
    },

    getActiveSubViewWidth() {
        return this.state.activeSide === 'left'
            ? this.state.leftSubViewWidth
            : this.state.rightSubViewWidth;
    },

    setLeftSubViewWidth(e) {
        if (!this.state.leftSubViewWidth) {
            let width = getWidth(e);
            if (width !== this.state.leftSubViewWidth) {
                this.setState({ leftSubViewWidth: width });
            }
        }
    },

    setRightSubViewWidth(e) {
        if (!this.state.rightSubViewWidth) {
            let width = getWidth(e);
            if (width !== this.state.rightSubViewWidth) {
                this.setState({ rightSubViewWidth: width });
            }
        }
    },

    isSwipeable() {
        return !!(this.props.leftSubView || this.props.rightSubView) && this.props.swipeEnabled;
    },

    checkSetCloseTimeout() {
        if (this.state.open) {
            // if the row is open and a gesture comes in and isn't followed by an
            // onResponderStart call we want to close the row
            if (!this.closeTimeout) {
                this.closeTimeout = setTimeout(this.close, 250);
            }
        }
    },

    clearCloseTimeout() {
        clearTimeout(this.closeTimeout);
        this.closeTimeout = null;
    },

    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                <HorizontalGestureResponder style={[styles.containerInner]}
                                            enabled={this.isSwipeable()}
                                            onGestureStart={this.checkSetCloseTimeout}
                                            onResponderStart={this.onSwipeStart}
                                            onResponderEnd={this.onSwipeEnd}
                                            onResponderUpdate={this.onSwipeUpdate}>
                    {this.renderSubView()}
                    <Animated.View style={[styles.containerInner, this.state.pan.getLayout()]}
                                   pointerEvents={this.getRowPointerEvents()}>
                        {this.props.children}
                    </Animated.View>
                </HorizontalGestureResponder>
            </View>
        );
    },

    getRowPointerEvents() {
        return this.state.open && this.props.blockChildEventsWhenOpen ? 'none' : 'box-none';
    },

    renderSubView() {
        let activeSubView;
        let subViewStyle;
        let onLayout;
        if (this.state.activeSide === 'left' && this.props.leftSubView) {
            activeSubView = this.props.leftSubView;
            subViewStyle = styles.leftSubView;
            onLayout = this.setLeftSubViewWidth;
        }
        else if (this.state.activeSide === 'right' && this.props.rightSubView) {
            activeSubView = this.props.rightSubView;
            subViewStyle = styles.rightSubView;
            onLayout = this.setRightSubViewWidth;
        }

        return (
            <Animated.View style={[styles.subViewContainer, subViewStyle, this.getSubViewPanStyle()]}
                           onLayout={onLayout}>
                {this.checkRenderSubViewWithProps(activeSubView, { onLayout: onLayout })}
            </Animated.View>
        );
    },

    getSubViewPanStyle() {
        if (this.state.activeSide === 'left' && this.state.leftSubViewWidth) {
            return {
                transform: [{
                    translateX: this.state.pan.x.interpolate({
                        inputRange: [0, this.state.leftSubViewWidth],
                        outputRange: [-this.state.leftSubViewWidth, 0]
                    })
                }]
            };
        }
        else if (this.state.activeSide === 'right' && this.state.rightSubViewWidth) {
            return {
                transform: [{
                    translateX: this.state.pan.x.interpolate({
                        inputRange: [-this.state.rightSubViewWidth, 0],
                        outputRange: [0, this.state.rightSubViewWidth]
                    })
                }]
            };
        }
    },

    checkRenderSubViewWithProps(subView, props) {
        if (subView) {
            return React.cloneElement( subView, props);
        }
    }
});

const styles = StyleSheet.create({
    container: {
        alignSelf: 'stretch',
        backgroundColor: 'transparent'
    },
    containerInner: {
        alignSelf: 'stretch'
    },
    subViewContainer: {
        position: 'absolute',
        flexDirection: 'row',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    leftSubView: {
        alignItems: 'flex-start'
    },
    rightSubView: {
        justifyContent: 'flex-end'
    }
});


export default SwipeRow;