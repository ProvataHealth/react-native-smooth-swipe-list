import React, { PropTypes } from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';

import {
    color
} from '../../constants'

const Button = (props) => (
    <TouchableHighlight onPress={props.onPress}
                        style={[styles.container, props.style]}
                        underlayColor={color.SECONDARY}>
        <Text style={styles.text}>
            {props.children}
        </Text>
    </TouchableHighlight>
);

Button.propTypes = {};

Button.displayName = 'Button';

const styles = StyleSheet.create({
    container: {
        width: 200,
        height: 50,
        backgroundColor: color.PRIMARY,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    text: {
        color: color.LIGHT,
        fontSize: 18
    }
});


export default Button;