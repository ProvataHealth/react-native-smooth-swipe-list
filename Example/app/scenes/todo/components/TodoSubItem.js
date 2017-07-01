import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { FullWidthSubItem } from '../../../components';

const TodoSubItem = React.createClass({

    onItemPress() {
        console.log('item pressed');
    },

    render() {
        return (
            <FullWidthSubItem style={styles.container}>

            </FullWidthSubItem>
        );
    },

    renderItems() {
        return ['Step One', 'Step Two', 'Step Three'].map((item) => {
            return (
                <TouchableOpacity key={item} onPress={() => this.onItemPress(item)}>
                    <View style={styles.item}>
                        <Text>
                            {item}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        });
    }
});

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-around',
        flexDirection: 'row'
    },
    item: {
        flex: 1,
        alignSelf: 'stretch',
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default TodoSubItem;