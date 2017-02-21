import React, { PropTypes } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import Emoji from 'react-native-emoji';
import map from 'lodash/map';
import find from 'lodash/find';
import reduce from 'lodash/reduce';

import { TodoCollection } from '../../../models';
import { color } from '../../../constants';
import { ListItem, ListItemButton } from '../../../components';
import TodoSubItem from './TodoSubItem';
import SwipeList from 'react-native-smooth-swipe-list';


const TodoSwipeList = React.createClass({

    propTypes: {
        todos: PropTypes.instanceOf(TodoCollection).isRequired,
        toggleTodoComplete: PropTypes.func.isRequired,
        archiveTodo: PropTypes.func.isRequired,
        addTodo: PropTypes.func.isRequired
    },

    componentWillMount() {
        this.rowData = map(this.props.todos, this.constructRowData);
    },

    componentWillReceiveProps(nextProps) {
        if (this.props.todos !== nextProps.todos) {
            this.rowData = reduce(nextProps.todos, (newRowData, todo, i) => {
                if (todo.isArchived()) {
                    return newRowData;
                }
                else if (todo !== this.props.todos.get(i)) {
                    return newRowData.concat([this.constructRowData(todo)]);
                }
                return newRowData.concat([find(this.rowData, data => data.id === todo.getId())]);
            }, []);
        }
    },

    constructRowData(todo) {
        return {
            id: todo.getId(),
            rowView: this.getRowView(todo),
            leftSubView: this.getToggleButton(todo),
            rightSubView: this.getArchiveButton(todo),
            rightSubViewOptions: {
                fullWidth: true,
                closeOnPress: false
            }

        };
    },

    onRowPress() {
        console.log('row pressed...');
    },

    tryCloseOpenRow() {
        this.swipeList && this.swipeList.tryCloseOpenRow();
    },

    setSwipeListRef(component) {
        this.swipeList = component;
    },

    render() {
        return (
            <View style={styles.swipeListContainer}>
                {this.renderAddButton()}
                <SwipeList ref={this.setSwipeListRef}
                           rowData={this.rowData}
                           style={styles.list}
                           rowStyle={styles.row} />
            </View>
        );
    },

    renderAddButton() {
        return (
            <ListItem style={styles.addButton}
                      title="Add Todo"
                      textStyle={styles.addButtonText}
                      onPress={this.props.addTodo} />
        );
    },

    getRowView(todo) {
        let title = todo.isComplete() ? <Text><Emoji name="thumbsup" /> {todo.getTitle()}</Text> : todo.getTitle();
        return <ListItem title={title} onPress={this.onRowPress} />;
    },

    getToggleButton(todo) {
        let text = todo.isComplete() ? 'Undo' : 'Complete';
        return (
            <ListItemButton onPress={() => this.props.toggleTodoComplete(todo)}
                            text={text}
                            color="PRIMARY" />
        );
    },

    getArchiveButton(todo) {
        return (
            <TodoSubItem />
        );
    }
});

const styles = StyleSheet.create({
    swipeListContainer: {
        flex: 1,
        alignSelf: 'stretch'
    },
    list: {
        backgroundColor: color.LIGHT
    },
    addButton: {
        padding: 15,
        backgroundColor: 'white',
        alignItems: 'center'
    },
    addButtonText: {

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
    }
});


export default TodoSwipeList;