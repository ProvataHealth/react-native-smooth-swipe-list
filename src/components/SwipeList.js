import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, ListView, ScrollView } from 'react-native';
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


const SwipeList = React.createClass({

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
        style: View.propTypes.style,
        rowStyle: View.propTypes.style,
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
            onScrollStateChange: () => {}
        };
    },

    getInitialState() {
        let ds;
        if (!this.props.isScrollView) {
            ds = new ListView.DataSource({ rowHasChanged: (prevData, nextData) => prevData !== nextData });
            ds = this.props.rowData ? ds.cloneWithRows(this.props.rowData) : ds;
        }
        else {
            ds = this.props.rowData;
        }

        return {
            scrollEnabled: this.props.scrollEnabled,
            dataSource: ds
        };
    },

    componentWillMount() {
        this.closeTimeout = null;
        this.rowRefs = {};
        this.rowIds = [];
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

    calloutRow(rowNumber, sectionId, amount) {
        let rowId = this.rowIds[rowNumber - 1];
        let row = this.getRowRef(rowId, sectionId);
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
            let rowRefs = map(indexesToRemove, (index) => {
                if (this.props.isScrollView) {
                    let rowData = this.state.dataSource[index];
                    return getRefKeyForRow('s1', rowData.id);
                }
                let secId = this.state.dataSource.getSectionIDForFlatIndex(index);
                let rowId = this.state.dataSource.getRowIDForFlatIndex(index);
                return getRefKeyForRow(secId, rowId);
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
        let ds = this.props.isScrollView ? nextRowData : this.state.dataSource.cloneWithRows(nextRowData);
        this.setState({
            dataSource: ds
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

    getRowRef(rowId, sectionId) {
        sectionId = sectionId || 's1';
        return this.rowRefs[getRefKeyForRow(sectionId, rowId)]
    },

    setRowRef(component, sectionId, rowId) {
        this.rowRefs[getRefKeyForRow(sectionId, rowId)] = component;
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
                <ListView {...this.props}
                          ref={this.setListViewRef}
                          style={[styles.listView, this.props.style]}
                          scrollEnabled={this.state.scrollEnabled && this.props.scrollEnabled}
                          enableEmptySections
                          dataSource={this.state.dataSource}
                          renderRow={this.renderSwipeListItem} />
            </View>
        );
    },

    renderScrollViewRows() {
        return map(this.state.dataSource, (rowData, i) => {
            let rowId = rowData.id || i + 1;
            // save of the rowId in the order it was mapped
            this.rowIds[i] = rowId;

            return this.renderSwipeListItem(rowData, 's1', rowId);
        });
    },

    renderSwipeListItem(rowData, sectionId, rowId) {
        let ref = this.getRowRefProvider(sectionId, rowId);
        return (
            <SwipeRow ref={ref}
                      id={rowData.id}
                      key={rowData.id}
                      animateAdd={rowData.isNew}
                      leftSubView={rowData.leftSubView}
                      rightSubView={rowData.rightSubView}
                      leftSubViewOptions={rowData.leftSubViewOptions}
                      rightSubViewOptions={rowData.rightSubViewOptions}
                      gestureTensionParams={this.props.gestureTensionParams}
                      blockChildEventsWhenOpen={rowData.blockChildEventsWhenOpen}
                      isAnotherRowOpen={this.isAnotherRowOpen}
                      tryCloseOpenRow={this.tryCloseOpenRow}
                      style={[this.props.rowStyle, rowData.style]}
                      startCloseTimeout={this.onRowPressCheckSetCloseTimeout}
                      clearCloseTimeout={this.clearCloseTimeout}
                      onSwipeStart={this.handleSwipeStart}
                      onSwipeEnd={this.handleSwipeEnd}
                      onOpenStart={this.handleRowOpenStart}
                      onOpenEnd={this.handleRowOpenEnd}
                      onCloseStart={this.handleRowCloseStart}
                      onCloseEnd={this.handleRowCloseEnd}
                      {...this.props.swipeRowProps}
                      {...rowData.props}>
                {rowData.rowView}
            </SwipeRow>
        );
    },

    getRowRefProvider(sectionId, rowId) {
        return (component) => this.setRowRef(component, sectionId, rowId);
    }
});

function getRefKeyForRow(sectionId, rowId) {
    return `${sectionId}:${rowId}`;
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