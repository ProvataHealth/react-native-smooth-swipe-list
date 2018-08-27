import React from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    Animated,
    Easing,
    ViewPropTypes
} from 'react-native';

import createReactClass from 'create-react-class';

import {
    applySimpleTension
} from '../util/gesture/index';
import {
    getWidth,
    getHeight
} from '../util/layout/index';
import {
    GESTURE_DISTANCE_THRESHOLD,
    OPEN_POSITION_THRESHOLD_FACTOR,
    CLOSE_POSITION_THRESHOLD_FACTOR,
    MAX_OPEN_THRESHOLD,
    OPEN_TENSION_THRESHOLD
} from '../constants/index';
import HorizontalGestureResponder from './HorizontalGestureResponder';
import isFinite from 'lodash/isFinite';
function isDefined(value) {
    return (value !== null || value !== undefined);
}

const SubViewOptionsShape = {
    fullWidth: PropTypes.bool,
    closeOnClick: PropTypes.bool
};

const defaultSubViewOptions = {
    fullWidth: false,
    closeOnPress: true
};

const SwipeRow = createReactClass({

    propTypes: {
        style: ViewPropTypes.style,
        id: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]).isRequired,
        rowViewStyle: ViewPropTypes.style,
        gestureTensionParams: PropTypes.shape({
            threshold: PropTypes.number,
            stretch: PropTypes.number,
            resistanceStrength: PropTypes.number
        }),
        onGestureStart: PropTypes.func,
        swipeEnabled: PropTypes.bool,
        onSwipeStart: PropTypes.func,
        onSwipeUpdate: PropTypes.func,
        onSwipeEnd: PropTypes.func,
        onOpenStart: PropTypes.func,
        onOpenEnd: PropTypes.func,
        onCloseStart: PropTypes.func,
        onCloseEnd: PropTypes.func,
        onCapture: PropTypes.func,
        leftSubView: PropTypes.element,
        rightSubView: PropTypes.element,
        leftSubViewOptions: PropTypes.shape(SubViewOptionsShape),
        rightSubViewOptions: PropTypes.shape(SubViewOptionsShape),
        startOpen: PropTypes.bool,
        blockChildEventsWhenOpen: PropTypes.bool,
        isAnotherRowOpen: PropTypes.func,
        closeOnPropUpdate: PropTypes.bool,
        animateRemoveSpeed: PropTypes.number,
        animateAddSpeed: PropTypes.number,
        startCloseTimeout: PropTypes.func.isRequired,
        clearCloseTimeout: PropTypes.func.isRequired,
        animateAdd: PropTypes.bool
    },

    getDefaultProps() {
        return {
            swipeEnabled: true,
            blockChildEventsWhenOpen: true,
            leftSubViewOptions: defaultSubViewOptions,
            rightSubViewOptions: defaultSubViewOptions,
            closeOnPropUpdate: false,
            gestureTensionParams: {},
            animateRemoveSpeed: 150,
            animateAddSpeed: 150,
            isAnotherRowOpen: () => false,
            onGestureStart: () => {},
            onSwipeStart: () => {},
            onSwipeUpdate: () => {},
            onSwipeEnd: () => {},
            onOpenStart: () => {},
            onOpenEnd: () => {},
            onCloseStart: () => {},
            onCloseEnd: () => {}
        };
    },

    getInitialState() {
        return {
            pan: new Animated.ValueXY(),
            heightAnim: new Animated.Value(0),
            heightAnimating: false,
            activeSide: null,
            open: false
        };
    },

    componentDidMount() {
        this.mounted = true;
    },

    componentWillReceiveProps(nextProps) {
        if (!this.props.animateAdd && nextProps.animateAdd) {
            this.animateIn();
        }
        else if (this.props.id !== nextProps.id) {
            this.clearCloseTimeout();
            this.resetState();
        }
        this.props.closeOnPropUpdate && this.close();
    },

    componentWillUpdate(nextProps, nextState) {
        this.checkHandleSubViewWidthUpdate(nextState);
    },

    componentDidUpdate(prevProps, prevState) {
        this.checkOpenOnUpdate();
    },

    componentWillUnmount() {
        this.mounted = false;
        this.clearCloseTimeout();
    },

    calloutRow(openPosition) {
        return new Promise((resolve) => {
            this.resolveCallout = resolve;
            if (this.gestureActive) {
                // user interaction takes precedence
                return resolve(false);
            }
            this.onSwipeStart();
            this.runOpenAndClose(0, openPosition, openPosition / 25);
        })
    },

    runOpenAndClose(currentPosition, endPosition, speed) {
        requestAnimationFrame((timestamp) => {
            if (this.gestureActive) {
                // end if the user has started a gesture
                return this.resolveCallout(false);
            }

            currentPosition += speed;
            let absCurrent = Math.abs(currentPosition);
            let absEnd = Math.abs(endPosition);

            // close once we are past the delay
            if (absCurrent >= (absEnd + 75)) {
                return this.onSwipeEnd(null, { dx: 0, vx: 1 }).then(() => this.resolveCallout(true));
            }

            // only animate the row while we are less than the end position
            if (absCurrent < absEnd) {
                this.onSwipeUpdate(null, { dx: currentPosition });
            }

            // keep looping until we reach the threshold past the end, this gives the open state a little delay
            return this.runOpenAndClose(currentPosition, endPosition, speed);
        });
    },

    resetState(additionalState) {
        if (this.mounted) {
            this.setState({
                ...this.getInitialState(),
                ...additionalState
            });
        }
    },

    checkOpenOnUpdate() {
        if (this.state.openOnNextUpdate) {
            const switchOffOpenFlag = (isLeft) => {
                this.setState({
                    openOnNextUpdate: false
                }, () => {
                    let openPosition = isLeft ? this.state.leftSubViewWidth : -this.state.rightSubViewWidth;
                    this.mounted && this.animateOpenOrClose(openPosition, 0.75, true);
                });
            };
            if (this.state.activeSide === 'left' && this.state.leftSubViewWidth) {
                switchOffOpenFlag(true);
            }
            else if (this.state.activeSide === 'right' && this.state.rightSubViewWidth) {
                switchOffOpenFlag();
            }
        }
    },

    checkHandleSubViewWidthUpdate(nextState) {
        let updateLeft = this.state.leftSubViewWidth !== nextState.leftSubViewWidth && nextState.leftSubViewWidth >= 0;
        let updateRight = this.state.rightSubViewWidth !== nextState.rightSubViewWidth && nextState.rightSubViewWidth >= 0;
        if (nextState.open && !nextState.heightAnimating && (updateLeft || updateRight)) {
            let activeSide = nextState.activeSide;
            let position = activeSide === 'left' ? nextState.leftSubViewWidth : nextState.rightSubViewWidth;
            this.animateOpenOrClose(position, 15, true);
        }
    },

    animateIn() {
        this.state.heightAnim.setValue(0);
        this.setState({
            heightAnimating: true
        }, () => {
            if (!this.mounted) {
                return;
            }
            Animated.timing(
                this.state.heightAnim,
                {
                    toValue: this.state.rowHeight,
                    duration: this.props.animateAddSpeed,
                    easing: Easing.in(Easing.cubic)
                }
            ).start(() => this.resetState({ animateInComplete: true }));
        });
    },

    animateOut(onComplete) {
        this.state.heightAnim.setValue(this.state.rowHeight);
        this.setState({
            heightAnimating: true
        }, () => {
            if (!this.mounted) {
                return;
            }
            Animated.timing(
                this.state.heightAnim,
                {
                    toValue: 0,
                    duration: this.props.animateRemoveSpeed,
                    easing: Easing.in(Easing.cubic)
                }
            ).start(onComplete);
        });
    },

    onSwipeStart(e, g) {
        this.gestureActive = !!e;
        e && this.props.onSwipeStart(this, e, g); // support this being called manually for the callouts
        let offsetX = this.state.pan.x._value || 0;
        this.state.pan.setOffset({ x: offsetX, y: 0 });
        this.state.pan.setValue({ x: 0, y: 0 });
        this.clearCloseTimeout();
    },

    onSwipeUpdate(e, g) {
        let { dx } = g;
        e && this.props.onSwipeUpdate(this, e, g);
        this.state.open ? this.updatePanPosition(dx) : this.handleSwipeWhenClosed(dx);
    },

    onSwipeEnd(e, g) {
        this.gestureActive = false;
        let { dx, vx } = g;
        e && this.props.onSwipeEnd(this, e, g);
        this.state.pan.flattenOffset();

        if (this.state.open) {
            return this.checkAnimateOpenOrClose(dx, vx);
        }
        else if (this.state.activeSide === 'left' && dx > 0 || this.state.activeSide === 'right' && dx < 0) {
            return this.checkAnimateOpenOrClose(dx, vx);
        }
        else {
            return this.checkAnimateOpenOrClose(0, vx);
        }
    },

    handleSwipeWhenClosed(dx) {
        if (dx >= 0) {
            if (!this.state.activeSide && this.props.leftSubView) {
                this.setState({
                    activeSide: 'left'
                });
            }
            this.updatePanPosition(dx);
        }
        else if (dx <= 0) {
            if (!this.state.activeSide && this.props.rightSubView) {
                this.setState({
                    activeSide: 'right'
                });
            }
            this.updatePanPosition(dx);
        }
    },

    updatePanPosition(dx) {
        let relativeDX = this.getRelativeDX(dx);
        let absOffset = Math.abs(this.state.pan.x._offset);
        if (this.state.activeSide === 'left') {
            let threshold = (this.state.leftSubViewWidth - absOffset);
            dx = relativeDX >= threshold ? dx : -(this.state.leftSubViewWidth - threshold);
            if (dx > 0) {
                dx = this.applyTensionToGesture(dx);
            }
            this.setPanPosition(dx);
        }
        else if (this.state.activeSide === 'right') {
            let threshold = (this.state.rightSubViewWidth - absOffset);
            dx = relativeDX >= threshold ? dx : (this.state.rightSubViewWidth - threshold);
            if (dx < 0) {
                dx = this.applyTensionToGesture(dx);
            }
            this.setPanPosition(dx);
        }
    },

    getRelativeDX(dx) {
        if (this.state.activeSide === 'left') {
            return dx + this.state.leftSubViewWidth;
        }
        else if (this.state.activeSide === 'right') {
            return this.state.rightSubViewWidth - dx;
        }
    },

    setPanPosition(dx) {
        if (isFinite(dx)) {
            this.state.pan.setValue({ x: dx, y: 0 });
        }
    },

    applyTensionToGesture(dx) {
        let tensionParams = this.props.gestureTensionParams;
        let tensionThreshold = this.state.open
            ? OPEN_TENSION_THRESHOLD
            : (tensionParams.threshold || this.getActiveSubViewWidth());
        return applySimpleTension(
            dx,
            tensionThreshold,
            tensionParams.stretch,
            tensionParams.resistanceStrength
        );
    },

    checkAnimateOpenOrClose(dx, vx) {
        if ((Math.abs(dx) <= GESTURE_DISTANCE_THRESHOLD) && this.state.open) {
            return this.animateOpenOrClose(0, vx);
        }
        else {
            return this.checkOpenOrClose(dx, vx);
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
        return this.animateOpenOrClose(toValue, vx);
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

    close(skipAnimation) {
        // don't allow a manual close if the gesture is active
        if (this.state.open && !this.gestureActive) {
            this.clearCloseTimeout();
            if (skipAnimation) {
                this.setState({ pan: new Animated.ValueXY() });
                this.props.onCloseStart();
                this.props.onCloseEnd(true);
            }
            else {
                this.animateOpenOrClose(0, 1.75, true);
            }
        }
    },

    open(side, skipAnimation) {
        if (!this.state.open) {
            this.clearCloseTimeout();
            let openPosition = side === 'left' ? this.state.leftSubViewWidth : -this.state.rightSubViewWidth;
            if (skipAnimation) {
                this.setState({
                    pan: new Animated.ValueXY({ x: openPosition, y: 0 }),
                    activeSide: side,
                    open: true
                });
                this.props.onOpenStart(this);
                this.props.onOpenEnd(true);
            }
            else {
                this.setState({
                    activeSide: side,
                    openOnNextUpdate: true,
                });
            }
        }
    },

    animateOpenOrClose(toValue, vx, noBounce) {
        if (!this.mounted) {
            return Promise.resolve();
        }
        let isOpen = toValue !== 0;

        // don't wait for the animation to change the open state
        isOpen ? this.props.onOpenStart(this) : this.props.onCloseStart();
        this.setState({
            open: isOpen
        });

        return new Promise((resolve) => {
            Animated.spring(
                this.state.pan,
                {
                    toValue: { x: toValue, y: 0 },
                    velocity: vx,
                    friction: noBounce ? 10 : 5,
                    tension: 22 * Math.abs(vx)
                }
            ).start(({ finished }) => {
                resolve();
                this.onAnimateFinish(finished, isOpen);
            });
        });
    },

    onAnimateFinish(finished, isOpen) {
        if (this.mounted) {
            isOpen ? this.props.onOpenEnd(finished) : this.props.onCloseEnd(finished);
            if (this.state.pan.x._value === 0) {
                this.setState({
                    activeSide: isOpen ? this.state.activeSide : null
                });
            }
        }
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

    setRowHeight(e) {
        let height = getHeight(e);
        if (height === this.state.rowHeight || this.state.heightAnimating) {
            return;
        }
        this.setState({
            rowHeight: height
        }, () => {
            if (this.props.animateAdd && !this.state.animateInComplete) {
                this.animateIn();
            }
        });
    },

    setLeftSubViewWidth(e) {
        let width = getWidth(e);
        if (width !== this.state.leftSubViewWidth) {
            this.setState({ leftSubViewWidth: width });
        }
    },

    setRightSubViewWidth(e) {
        let width = getWidth(e);
        if (width !== this.state.rightSubViewWidth) {
            this.setState({ rightSubViewWidth: width });
        }
    },

    isSwipeable() {
        return !!(this.props.leftSubView || this.props.rightSubView) && this.props.swipeEnabled;
    },

    checkSetCloseTimeout(e, g) {
        this.props.onGestureStart(this, e, g);
        this.props.startCloseTimeout();
        return this.props.isAnotherRowOpen(this);
    },

    clearCloseTimeout() {
        this.props.clearCloseTimeout();
    },

    shouldCloseOnClick() {
        let options = this.state.activeSide === 'left' ? this.props.leftSubViewOptions : this.props.rightSubViewOptions;
        let closeOnPress = options.fullWidth ? false : options.closeOnPress;
        return isDefined(closeOnPress) ? closeOnPress : defaultSubViewOptions.closeOnPress;
    },

    render() {
        return (
            <Animated.View style={[styles.container, this.props.style, this.getHeightStyle()]}
                           onLayout={this.setRowHeight}>
                <HorizontalGestureResponder style={[styles.containerInner]}
                                            enabled={this.isSwipeable()}
                                            allowTermination={false}
                                            shouldSetResponderCapture={this.checkSetCloseTimeout}
                                            onResponderStart={this.onSwipeStart}
                                            onResponderEnd={this.onSwipeEnd}
                                            onResponderUpdate={this.onSwipeUpdate}>
                    {this.renderSubView()}
                    <Animated.View style={[styles.containerInner, this.props.rowViewStyle, this.state.pan.getLayout()]}
                                   pointerEvents={this.getRowPointerEvents()}>
                        {React.cloneElement(React.Children.only(this.props.children),
                            {
                                open: this.state.open,
                                openRow: this.open,
                                closeRow: this.close
                            })}
                    </Animated.View>
                </HorizontalGestureResponder>
            </Animated.View>
        );
    },

    getHeightStyle() {
        if (this.state.heightAnimating) {
            return {
                height: this.state.heightAnim,
                overflow: 'hidden'
            };
        }
    },

    getRowPointerEvents() {
        return (this.state.open && this.props.blockChildEventsWhenOpen) ? 'none' : 'box-none';
    },

    renderSubView() {
        let activeSide = this.state.activeSide;
        let isLeft = activeSide === 'left';
        let subView = this.getActiveSubView(isLeft);
        let onLayout = this.getActiveSubViewOnLayout(isLeft);
        let activeSideStyle = this.getActiveSideStyle(isLeft);
        let panStyle = this.getSubViewPanStyle(isLeft);
        let wrapperStyle = this.getSubViewWrapperStyle(isLeft);
        if (activeSide) {
            return (
                <Animated.View style={[styles.subViewContainer, activeSideStyle, panStyle]} {...this.checkGetBlockCloseTimeout(isLeft)}>
                    <View style={[styles.subViewWrapper, wrapperStyle]} onLayout={onLayout}>
                        {React.cloneElement(subView, { open: this.state.open })}
                    </View>
                </Animated.View>
            );
        }
    },

    checkGetBlockCloseTimeout(isLeft) {
        let opts = isLeft ? this.props.leftSubViewOptions : this.props.rightSubViewOptions;
        if (!opts.fullWidth) {
            return;
        }
        return { onStartShouldSetResponderCapture: this.props.clearCloseTimeout };
    },

    getActiveSubView(isLeft) {
        return isLeft ? this.props.leftSubView : this.props.rightSubView;
    },

    getActiveSubViewOnLayout(isLeft) {
        return isLeft ? this.setLeftSubViewWidth : this.setRightSubViewWidth;
    },

    getSubViewWrapperStyle(isLeft) {
        let widthKnown = isLeft ? this.state.leftSubViewWidth : this.state.rightSubViewWidth;
        let fullWidth = isLeft
            ? this.props.leftSubViewOptions.fullWidth
            : this.props.rightSubViewOptions.fullWidth;

        fullWidth = isDefined(fullWidth) ? fullWidth : defaultSubViewOptions.fullWidth;
        return {
            opacity: widthKnown ? 1 : 0,
            flex: fullWidth ? 1 : 0
        };
    },

    getActiveSideStyle(isLeft) {
        return isLeft ? styles.leftSubView : styles.rightSubView;
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
    subViewWrapper: {
        flexDirection: 'row',
        alignItems: 'stretch',
        alignSelf: 'stretch'
    },
    fullSubView: {
        flex: 1
    },
    leftSubView: {
        alignItems: 'flex-start'
    },
    rightSubView: {
        justifyContent: 'flex-end'
    }
});


export default SwipeRow;
