import React, { PropTypes } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { color } from '../../constants';


const ListItemButton = (props) => (
    <TouchableOpacity onPress={props.onPress}>
        <View style={[styles.container, getBackgroundStyle(props.color)]}>
            <Text style={styles.text}>
                {props.text}
            </Text>
        </View>
    </TouchableOpacity>
);

function getBackgroundStyle(colorKey) {
    return colorKey ? { backgroundColor: color[colorKey] } : {};
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