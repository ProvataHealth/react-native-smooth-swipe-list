import React, { PropTypes } from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';

import {
    LIST_ITEM_HEIGHT
} from './constants';

const ListItem = (props) => (
    <TouchableHighlight onPress={props.onPress}>
        <View style={[styles.container, props.style]}>
            <Text style={styles.text}>
                {props.title}
            </Text>
        </View>
    </TouchableHighlight>
);

ListItem.propTypes = {};

ListItem.displayName = 'ListItem';

const styles = StyleSheet.create({
    container: {
        alignSelf: 'stretch',
        paddingHorizontal: 25,
        justifyContent: 'center',
        height: LIST_ITEM_HEIGHT,
        backgroundColor: '#fff',
        borderBottomColor: '#eee',
        borderBottomWidth: 1
    },
    text: {
        color: '#444'
    }
});


export default ListItem;