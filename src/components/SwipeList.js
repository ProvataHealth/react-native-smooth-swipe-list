import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, ListView, ScrollView, ViewPropTypes, FlatList } from 'react-native';
import createReactClass from 'create-react-class';
import shallowCompare from 'react-addons-shallow-compare';
import reduce from 'lodash/reduce';
import every from 'lodash/every';
import some from 'lodash/some';
import map from 'lodash/map';

import SwipeRow from './SwipeRow';

const SWIPE_STATE = {
    SWIPE_START: 'swipeStart',
    SWIPE_END: 'swipeEnd',
    ROW_OPEN_START: 'rowOpenStart',
    ROW_OPEN_END: 'rowOpenEnd',
    ROW_CLOSE_START: 'rowCloseStart',
    ROW_CLOSE_END: 'rowCloseEnd'
};


const SwipeList = createReactClass({

    propTypes: {
        rowData: (props, propName, componentName) => {
            let rowData = props[propName];
            if (rowData) {
                let isArray = rowData instanceof Array;
                let correctShape = every(rowData, data => {
                    return (data instanceof Object) && data.id != null;
                });
                if (!isArray || !correctShape) {
                    return new Error(
                        `Invalid prop ${propName} supplied to ${componentName} ` +
                        `${propName} must be an Array of objects with ids`
                    );
                }
            }
        },
        style: ViewPropTypes.style,
        rowStyle: ViewPropTypes.style,
        scrollEnabled: PropTypes.bool,
        onScrollStateChange: PropTypes.func,
        gestureTensionParams: PropTypes.shape({
            length: PropTypes.number,
            stretch: PropTypes.number,
            resistanceStrength: PropTypes.number
        }),
        isScrollView: PropTypes.bool,
        swipeRowProps: PropTypes.object,
        onSwipeStateChange: PropTypes.func
    },

    getDefaultProps() {
        return {
            scrollEnabled: true,
            onSwipeStateChange: () => {},
            onScrollStateChange: () => {},
            keyExtractor: (item, index) => (item.key || item.id || index)
        };
    },

    getInitialState() {
        return {
            scrollEnabled: this.props.scrollEnabled,
            dataSource: this.props.rowData || []
        };
    },

    componentWillMount() {
        this.closeTimeout = null;
        this.rowRefs = {};
    },

    componentWillUnmount() {
        this.clearCloseTimeout();
    },

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    },

    componentWillReceiveProps(nextProps) {
        if (this.props.rowData !== nextProps.rowData) {
            this.checkAnimateRemoveRow(nextProps.rowData);
            this.checkAnimateAddRow(nextProps.rowData);
        }
    },

    calloutRow(rowNumber, amount) {
        let rowData = this.state.dataSource[rowNumber - 1];
        let rowId = rowData && rowData.id;
        let row = this.getRowRef(rowId);
        return row && row.calloutRow(amount);
    },

    checkAnimateRemoveRow(nextRowData = []) {
        if (this.props.rowData && (nextRowData.length < this.props.rowData.length)) {
            let numRemoved = 0;
            let indexesToRemove = reduce(this.props.rowData, (result, data, i) => {
                let nextData = nextRowData[i - numRemoved];
                let shouldRemove = !nextData || nextData.id !== data.id;
                if (shouldRemove) {
                    numRemoved += 1;
                    return result.concat([i]);
                }
                return result;
            }, []);
            //FIXME update this, probably isn't need with the FlatList
            let rowRefs = map(indexesToRemove, (index) => {
                let rowData = this.state.dataSource[index];
                return getRefKeyForRow(rowData.id);
            });
            if (rowRefs.length) {
                rowRefs.forEach(ref => {
                    let component = this.rowRefs[ref];
                    component && component.animateOut(() => this.updateDataSource(nextRowData));
                });
            }
        }
        else {
            this.updateDataSource(nextRowData);
        }
    },

    checkAnimateAddRow(nextRowData = []) {
        let rowsAdded = this.props.rowData ? nextRowData.length - this.props.rowData.length : nextRowData.length;
        if (rowsAdded > 0) {
            nextRowData.forEach((nextData) => {
                let existing = some(this.props.rowData, (prevData) => {
                    return prevData.id === nextData.id;
                });

                if (!existing) {
                    nextData.isNew = true;
                }
            });
        }
    },

    updateDataSource(nextRowData) {
        this.setState({
            dataSource: nextRowData
        });
    },

    handleSwipeStart(row, e, g) {
        this.tryCloseOpenRow(row);
        this.listView && this.listView.setNativeProps({ scrollEnabled: false });
        this.props.onScrollStateChange(false);
        this.props.onSwipeStateChange(SWIPE_STATE.SWIPE_START);
    },

    handleSwipeEnd(row, e, g) {
        this.listView && this.listView.setNativeProps({ scrollEnabled: true });
        this.props.onScrollStateChange(true);
        this.props.onSwipeStateChange(SWIPE_STATE.SWIPE_END);
    },

    handleRowOpenStart(row) {
        this.openRowRef = row;
        this.props.onSwipeStateChange(SWIPE_STATE.ROW_OPEN_START);
    },

    handleRowOpenEnd(finished) {
        this.props.onSwipeStateChange(SWIPE_STATE.ROW_OPEN_END, finished);
    },

    handleRowCloseStart() {
        this.openRowRef = null;
        this.props.onSwipeStateChange(SWIPE_STATE.ROW_CLOSE_START);
    },

    handleRowCloseEnd(finished) {
        this.props.onSwipeStateChange(SWIPE_STATE.ROW_CLOSE_END, finished);
    },

    tryCloseOpenRow(row) {
        if (this.openRowRef && this.openRowRef !== row) {
            this.closeOpenRow();
        }
    },

    closeOpenRow() {
        if (this.openRowRef && this.openRowRef.isOpen()) {
            this.openRowRef.close();
            this.openRowRef = null;
        }
    },

    onRowPressCheckSetCloseTimeout() {
        clearTimeout(this.closeTimeout);
        this.closeTimeout = setTimeout( this.closeOpenRow, 250);
    },

    clearCloseTimeout() {
        clearTimeout(this.closeTimeout);
        this.closeTimeout = null;
    },

    isAnotherRowOpen(row) {
        return !!(this.openRowRef && this.openRowRef !== row);
    },

    setListViewRef(component) {
        if (component) {
            this.listView = component;
        }
    },

    getRowRef(rowId) {
        return this.rowRefs[getRefKeyForRow(rowId)]
    },

    setRowRef(component, rowId) {
        this.rowRefs[getRefKeyForRow(rowId)] = component;
    },

    render() {
        if (this.props.isScrollView) {
            return (
                <View style={[styles.listView, this.props.style]}>
                    <ScrollView {...this.props}
                                ref={this.setListViewRef}
                                style={[styles.listView, this.props.style]}
                                scrollEnabled={this.state.scrollEnabled && this.props.scrollEnabled}>
                        {this.renderScrollViewRows()}
                    </ScrollView>
                </View>
            );
        }
        return (
            <View style={[styles.listView, this.props.style]}>
                <FlatList {...this.props}
                          keyExtractor={this.props.keyExtractor}
                          ref={this.setListViewRef}
                          style={[styles.listView, this.props.style]}
                          scrollEnabled={this.state.scrollEnabled && this.props.scrollEnabled}
                          data={this.state.dataSource}
                          renderItem={this.renderSwipeListItem} />
            </View>
        );
    },

    renderScrollViewRows() {
        return map(this.state.dataSource, (rowData, i) => {
            return this.renderSwipeListItem({ index: i, item: rowData });
        });
    },

    renderSwipeListItem({ item, index }) {
        let ref = this.getRowRefProvider(item.id, item, index);
        return (
            <SwipeRow ref={ref}
                      id={item.id}
                      animateAdd={item.isNew}
                      leftSubView={item.leftSubView}
                      rightSubView={item.rightSubView}
                      leftSubViewOptions={item.leftSubViewOptions}
                      rightSubViewOptions={item.rightSubViewOptions}
                      gestureTensionParams={this.props.gestureTensionParams}
                      blockChildEventsWhenOpen={item.blockChildEventsWhenOpen}
                      isAnotherRowOpen={this.isAnotherRowOpen}
                      tryCloseOpenRow={this.tryCloseOpenRow}
                      style={[this.props.rowStyle, item.style]}
                      startCloseTimeout={this.onRowPressCheckSetCloseTimeout}
                      clearCloseTimeout={this.clearCloseTimeout}
                      onSwipeStart={this.handleSwipeStart}
                      onSwipeEnd={this.handleSwipeEnd}
                      onOpenStart={this.handleRowOpenStart}
                      onOpenEnd={this.handleRowOpenEnd}
                      onCloseStart={this.handleRowCloseStart}
                      onCloseEnd={this.handleRowCloseEnd}
                      {...this.props.swipeRowProps}
                      {...item.props}>
                {item.rowView}
            </SwipeRow>
        );
    },

    getRowRefProvider(rowId, item, index) {
        return (component) => {
            if (item.setRef) {
                item.setRef(component, item, index);
            }
            this.setRowRef(component, rowId);
        };
    }
});

function getRefKeyForRow(rowId) {
    return `${rowId}`;
}


const styles = StyleSheet.create({
    container: {
        alignSelf: 'stretch'
    },
    listView: {
        alignSelf: 'stretch',
        backgroundColor: 'rgb(111, 111, 111)'
    }
});

SwipeList.SwipeState = SWIPE_STATE;

export default SwipeList;
