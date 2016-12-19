import React, { PropTypes } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import map from 'lodash/map';
import find from 'lodash/find';

import TodoCollection from './model/TodoCollection';
import SwipeList from '../src/components/SwipeList';


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
            rightSubView: this.getRightView(todo),
            style: styles.row
        };
    },

    onRowPress() {
        console.log('row pressed...');
    },

    addTodo() {

    },

    render() {
        return (
            <View style={styles.swipeListContainer}>
                <SwipeList rowData={this.rowData} blockChildEventsWhenOpen={false} />
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
        return (
            <TouchableHighlight onPress={this.onRowPress}>
                <View style={styles.rowInner}>
                    <Text>{todo.getTitle()}</Text>
                </View>
            </TouchableHighlight>
        );
    },

    getLeftView(todo) {
        if (todo.isComplete) {

        }
        return (
            <View style={styles.fullSubViewInner}>
                <Text style={styles.buttonText}>{todo.getDescription()}</Text>
            </View>
        );
    },

    getRightView(todo) {
        return (
            <TouchableHighlight onPress={() => this.props.archiveTodo(todo)}>
                <View style={styles.button}>
                    <Text style={styles.buttonText}>Archive</Text>
                </View>
            </TouchableHighlight>
        );
    }
});

const styles = StyleSheet.create({
    swipeListContainer: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: 'rgb(75, 75, 75)'
    },
    addButton: {
        padding: 15,
        backgroundColor: 'white',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#333'
    },
    row: {
        alignSelf: 'stretch',
        height: 55,
        backgroundColor: '#ddd',
        borderBottomColor: '#aaa',
        borderBottomWidth: 1
    },
    rowInner: {
        alignSelf: 'stretch',
        height: 55,
        backgroundColor: '#fff',
        borderBottomColor: '#eee',
        borderBottomWidth: 1
    },
    button: {
        flex: 1,
        minWidth: 75,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(50, 175, 200)'
    },
    fullSubView: {
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center'
    },
    fullSubViewInner: {
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(50, 175, 175)'
    },
    buttonText: {
        color: '#fff',
        backgroundColor: 'transparent'
    }
});


export default TodoSwipeList;