import React from 'react';
import { View, StyleSheet } from 'react-native';

import { TodoScene } from './scenes';

const Main = () => (
    <View style={styles.container}>
        <TodoScene/>
    </View>
);


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 25
    }
});


export default Main;