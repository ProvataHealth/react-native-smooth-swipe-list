import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';

import {
    layout
} from '../../constants';


const ListItem = (props) => (
    <TouchableHighlight onPress={props.onPress}>
        <View style={[styles.container, props.style]}>
            <Text style={[styles.text, props.textStyle]}>
                {props.title}
            </Text>
            {props.children}
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
        height: layout.LIST_ITEM_HEIGHT,
        backgroundColor: '#fff',
        borderBottomColor: '#eee',
        borderBottomWidth: 1
    },
    text: {
        color: '#444'
    }
});


export default ListItem;