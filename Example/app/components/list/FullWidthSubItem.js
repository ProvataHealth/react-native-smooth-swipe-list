import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';


const FullWidthSubItem = ({ style, children }) => (
    <View style={[styles.container, style]}>
        {children}
    </View>
);

FullWidthSubItem.propTypes = { style: View.propTypes.style };

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