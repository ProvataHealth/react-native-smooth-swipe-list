import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';

import map from 'lodash/map';
import find from 'lodash/find';
import reduce from 'lodash/reduce';

import { TodoCollection } from '../../../models';
import { color } from '../../../constants';
import { ListItem, ListItemButton } from '../../../components';
//import TodoSubItem from './TodoSubItem';
import SwipeList from 'react-native-smooth-swipe-list';
import ProgressListItem from '../../../components/list/ProgressListItem';


const TodoSwipeList = createReactClass({

    propTypes: {
        todos: PropTypes.instanceOf(TodoCollection).isRequired,
        toggleTodoComplete: PropTypes.func.isRequired,
        archiveTodo: PropTypes.func.isRequired,
        addTodo: PropTypes.func.isRequired
    },

    componentWillMount() {
        this.rowData = map(this.props.todos, this.constructRowData);
    },

    componentDidMount() {
        // open the row on the left, then the right
        this.callOutRowSwipe();
    },

    callOutRowSwipe() {
        Promise.resolve()
            .then(() => this.swipeList.calloutRow(3, 100))
            .then(() => this.swipeList.calloutRow(3, -100));
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
            rightSubView: this.getToggleButton(todo),
            leftSubView: this.getArchiveButton(todo),
            leftSubViewOptions: {
                closeOnPress: false
            }

        };
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
        let title = todo.getTitle();
        return <ProgressListItem title={title} progress={todo.getProgress()} />;
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
            <ListItemButton onPress={() => this.props.archiveTodo(todo)}
                            text="Archive"
                            color="RED" />
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