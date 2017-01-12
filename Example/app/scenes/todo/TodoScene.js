import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';

import { Todo, TodoCollection } from '../../models';
import { TodoSwipeList, TodoDetails } from './components'


const TodoScene = React.createClass({

    getInitialState() {
        // using this component's state as a store for simplicity sake
        return {
            activeTodo: null,
            todoCount: 1,
            todos: new TodoCollection([
                {
                    id: 1,
                    title: 'Write Code',
                    complete: false,
                    archived: false
                },
                {
                    id: 2,
                    title: 'Make a Sandwich',
                    complete: false,
                    archived: false
                },
                {
                    id: 3,
                    title: 'Write More Code',
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
                {this.renderActiveView()}
            </View>
        );
    },

    renderActiveView() {
        if (this.state.activeTodo) {
            return <TodoDetails todo={this.state.activeTodo} />;
        }
        return (
            <TodoSwipeList todos={this.state.todos}
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
        justifyContent: 'flex-start',
        marginTop: 25
    }
});


export default TodoScene;