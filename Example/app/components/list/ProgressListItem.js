import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { View, StyleSheet, Animated } from 'react-native';
import ListItem from './ListItem';
import {
    ANIMATION_EASING_DEFAULT
} from '../../constants/animation';


const styles = StyleSheet.create({
    progressContainer: {
        marginTop: 5,
        backgroundColor: '#c2c3cc'
    },
    progressBar: {
        width: '100%',
        height: 8,
        backgroundColor: '#62c1ff'
    }
});


const ProgressListItem = createReactClass({
    displayName: 'ProgressListItem',
    propTypes: {
        ...ListItem.propTypes,
        progress: PropTypes.number // between 0 and 1
    },

    getDefaultProps() {
        return {
            progress: 0,
            openRow: PropTypes.func.isRequired
        };
    },

    getInitialState() {
        return {
            progressAnim: new Animated.Value(0)
        }
    },

    componentDidMount() {
        if (this.props.progress) {
            this.animateProgressBar(this.props.progress);
        }
    },

    componentWillReceiveProps(nextProps) {
        if (nextProps.progress !== this.props.progress) {
            this.animateProgressBar(nextProps.progress);
        }
    },

    animateProgressBar(toValue) {
        return Animated.timing(
            this.state.progressAnim,
            {
                toValue,
                duration: 2000,
                easing: ANIMATION_EASING_DEFAULT
            }
        ).start();
    },

    openRow() {
        this.props.openRow('right');
    },

    render() {
        let { progress, ...listItemProps } = this.props;
        return (
            <ListItem {...listItemProps} onPress={this.openRow}>
                <View style={styles.progressContainer}>
                    {this.renderProgressBar()}
                </View>
            </ListItem>
        )
    },

    renderProgressBar() {
        let progressStyle = {
            width: this.state.progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
            })
        };
        return (
            <Animated.View style={[styles.progressBar, progressStyle]}/>
        );
    }
});


export default ProgressListItem;