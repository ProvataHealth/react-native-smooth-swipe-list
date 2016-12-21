import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';

import TodoCollection from './model/TodoCollection';
import Todo from './model/Todo';
import TodoSwipeList from './TodoSwipeList';


const Main = React.createClass({

    getInitialState() {
        // using this component's state as a store for simplicity sake
        return {
            todoCount: 1,
            todos: new TodoCollection([
                {
                    id: 1,
                    title: 'List Item One',
                    description: 'Full SubView 1',
                    complete: false,
                    archived: false
                },
                {
                    id: 2,
                    title: 'List Item Two',
                    description: 'Full SubView 2',
                    complete: false,
                    archived: false
                },
                {
                    id: 3,
                    title: 'List Item Three',
                    description: 'Full SubView 3',
                    complete: false,
                    archived: false
                }
            ])
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
    },

    createTodo(title, description) {
        let count = this.state.todoCount + 1;
        this.setState({
            todoCount: count,
            todos: this.state.todos.push({
                id: count,
                title,
                description,
                complete: false,
                archived: false
            })
        });
    },

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.heading}>
                    Example List
                </Text>
                <TodoSwipeList todos={this.state.todos}
                               archiveTodo={this.archiveTodo}
                               toggleTodoComplete={this.toggleTodoComplete} />
            </View>
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
        justifyContent: 'flex-start',
        marginTop: 25
    },
    heading: {
        alignSelf: 'stretch',
        paddingHorizontal: 25,
        paddingVertical: 10,
        textAlign: 'center',
        fontSize: 22,
        color: 'rgb(10, 110, 150)'
    }
});


export default Main;