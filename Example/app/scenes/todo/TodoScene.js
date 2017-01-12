import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import times from 'lodash/times';

import { Todo, TodoCollection } from '../../models';
import { TodoSwipeList, TodoDetails } from './components'

const INITIAL_TODO_COUNT = 15;
const TITLES = ['Sleep', 'Write Code', 'Eat'];
const INITIAL_TODOS = times(INITIAL_TODO_COUNT, (i) => {
    return {
        id: i + 1,
        title: TITLES[(i + 1) % 3],
        completed: false,
        archived: false
    };
});

const TodoScene = React.createClass({

    getInitialState() {
        // using this component's state as a store for simplicity sake
        return {
            activeTodo: null,
            todoCount: INITIAL_TODO_COUNT,
            todos: new TodoCollection(INITIAL_TODOS)
        };
    },

    archiveTodo(todo) {
        let updatedTodo = todo.setArchived(true);
        this.setState({
            todos: this.state.todos.putById(updatedTodo.getId(), updatedTodo)
        });
    },

    toggleTodoComplete(todo) {
        let updatedTodo = todo.setComplete(!todo.isComplete());
        this.setState({
            todos: this.state.todos.putById(updatedTodo.getId(), updatedTodo)
        });
        this.tryCloseSwipeRow();
    },

    addTodo() {
        let count = this.state.todoCount + 1;
        this.setState({
            todoCount: count,
            todos: this.state.todos.unshift({
                id: count,
                title: 'A New Todo',
                complete: false,
                archived: false
            })
        });
        this.tryCloseSwipeRow();
    },

    tryCloseSwipeRow() {
        this.swipeList && this.swipeList.tryCloseOpenRow();
    },

    setSwipeListRef(component) {
        this.swipeList = component;
    },

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>
                    Swipe List Example
                </Text>
                {this.renderActiveView()}
            </View>
        );
    },

    renderActiveView() {
        if (this.state.activeTodo) {
            return <TodoDetails todo={this.state.activeTodo} />;
        }
        return (
            <TodoSwipeList ref={this.setSwipeListRef}
                           todos={this.state.todos}
                           addTodo={this.addTodo}
                           archiveTodo={this.archiveTodo}
                           toggleTodoComplete={this.toggleTodoComplete} />
        );
    }
});

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15
    }
});


export default TodoScene;