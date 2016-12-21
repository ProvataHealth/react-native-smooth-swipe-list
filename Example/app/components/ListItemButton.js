import React, { PropTypes } from 'react';
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';


const ListItemButton = (props) => (
    <TouchableHighlight onPress={props.onPress}>
        <View style={styles.container}>
            <Text style={styles.text}>
                {props.text}
            </Text>
        </View>
    </TouchableHighlight>
);

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
        color: '#fff'
    }
});

export default ListItemButton;