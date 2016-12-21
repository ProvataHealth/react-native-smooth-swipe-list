import React, { PropTypes } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';


const FullWidthSubItem = React.createClass({

    onItemPress() {
        console.log('item pressed');
    },

    render() {
        return (
            <View style={styles.itemsContainer}>
                {this.renderItems()}
            </View>
        );
    },

    renderItems() {
        return ['One', 'Two', 'Three'].map((item) => {
            return (
                <TouchableOpacity key={item} onPress={() => this.onItemPress(item)}>
                    <View style={styles.activityItem}>
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
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        paddingHorizontal: 25
    },
    itemsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'space-around',
        flexDirection: 'row'
    },
    activityItem: {
        flex: 1,
        alignSelf: 'stretch',
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconContainer: {
        marginBottom: 10
    },
    activityLabel: {
        textAlign: 'center'
    }
});

export default FullWidthSubItem;