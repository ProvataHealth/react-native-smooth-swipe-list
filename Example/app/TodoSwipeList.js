import React, { PropTypes } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import map from 'lodash/map';
import find from 'lodash/find';

import TodoCollection from './model/TodoCollection';
import { COLORS } from './constants';
import ListItem from './components/ListItem';
import ListItemButton from './components/ListItemButton';
import FullWidthSubItem from './components/FullWidthSubItem';
import SwipeList from '@provata/react-native-smooth-swipe-list';



const TodoSwipeList = React.createClass({

    propTypes: {
        todos: PropTypes.instanceOf(TodoCollection).isRequired,
        toggleTodoComplete: PropTypes.func.isRequired,
        archiveTodo: PropTypes.func.isRequired
    },

    componentWillMount() {
        this.rowData = map(this.props.todos, this.constructRowData);
    },

    componentWillReceiveProps(nextProps) {
        if (this.props.todos !== nextProps.todos) {
            this.rowData = map(nextProps.todos, (todo, i) => {
                let prevTodo = this.props.todos.get(i);
                if (todo === prevTodo) {
                    return find(this.rowData, data => data.key === todo.getId());
                }
                return this.constructRowData(todo);
            });
        }
    },

    constructRowData(todo) {
        return {
            key: todo.getId(),
            rowView: this.getRowView(todo),
            leftSubView: this.getLeftView(todo),
            leftSubViewOptions: {
                fullWidth: true,
                closeOnClick: false
            },
            rightSubView: this.getRightView(todo)
        };
    },

    onRowPress() {
        console.log('row pressed...');
    },

    addTodo() {

    },

    loadMore() {
        console.log('load more...');
    },

    render() {
        return (
            <View style={styles.swipeListContainer}>
                <SwipeList rowData={this.rowData}
                           gestureTensionParams={{ length: 1 }}
                           style={styles.list}
                           rowStyle={styles.row}
                           renderFooter={this.renderFooter} />
            </View>
        );
    },

    renderAddButton() {
        return (
            <TouchableHighlight onPress={this.addTodo}>
                <View style={styles.addButton}>
                    <Text>
                        Add
                    </Text>
                </View>
            </TouchableHighlight>
        );
    },

    getRowView(todo) {
        return <ListItem title={todo.getTitle()} onPress={this.onRowPress} />;
    },

    getLeftView(todo) {
        return (
            <FullWidthSubItem />
        );
    },

    getRightView(todo) {
        return <ListItemButton onPress={() => this.props.archiveTodo(todo)} text="Archive" color="primary" />;
    },

    renderFooter() {
        return (
            <ListItem style={styles.loadButton}
                      title="Load More"
                      textStyle={styles.loadButtonText}
                      onPress={this.loadMore} />
        );
    }
});

const styles = StyleSheet.create({
    swipeListContainer: {
        flex: 1,
        alignSelf: 'stretch'
    },
    list: {
        backgroundColor: COLORS.light
    },
    addButton: {
        padding: 15,
        backgroundColor: 'white',
        alignItems: 'center'
    },
    row: {
        alignSelf: 'stretch',
        height: 55,
        backgroundColor: '#eee'
    },
    fullSubView: {
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(50, 175, 175)'
    },
    buttonText: {
        color: '#fff',
        backgroundColor: 'transparent'
    },
    loadButton: {
        alignItems: 'center',
        backgroundColor: COLORS.primary
    },
    loadButtonText: {
        color: COLORS.white,
        fontWeight: 'bold'
    }
});


export default TodoSwipeList;