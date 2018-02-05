import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, ViewPropTypes } from 'react-native';


const FullWidthSubItem = ({ style, children }) => (
    <View style={[styles.container, style]}>
        {children}
    </View>
);

FullWidthSubItem.propTypes = { style: ViewPropTypes.style };

FullWidthSubItem.displayName = "FullWidthSubItem";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    }
});


export default FullWidthSubItem;