import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { color } from '../../constants';


const ListItemButton = (props) => (
    <TouchableOpacity onPress={props.onPress}>
        <View style={[styles.container, getBackgroundStyle(props)]}>
            <Text style={styles.text}>
                {props.text}
            </Text>
        </View>
    </TouchableOpacity>
);

function getBackgroundStyle(props) {
    let backgroundColor = props.open ? 'rgb(200, 0, 100)' : color[props.color];
    return color ? { backgroundColor } : {};
}

ListItemButton.propTypes = {
    onPress: PropTypes.func
};

ListItemButton.displayName = 'ListItemButton';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: 'rgb(55, 210, 240)',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch'
    },
    text: {
        color: color.LIGHT
    }
});


export default ListItemButton;