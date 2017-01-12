import React, { PropTypes } from 'react';
import { StyleSheet, View, ListView, TouchableWithoutFeedback } from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';
import reduce from 'lodash/reduce';
import every from 'lodash/every';
import map from 'lodash/map';

import {
    OPEN_POSITION_THRESHOLD_FACTOR
} from '../constants';
import SwipeRow from './SwipeRow';
import {
    getWidth,
    getHeight
} from '../util/layout';


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
        swipeRowProps: PropTypes.object
    },

    getDefaultProps() {
        return {
            scrollEnabled: true,
            onScrollStateChange: () => {}
        };
    },

    getInitialState() {
        let ds = new ListView.DataSource({ rowHasChanged: (prevData, nextData) => prevData !== nextData });
        ds = this.props.rowData ? ds.cloneWithRows(this.props.rowData) : ds;

        return {
            scrollEnabled: this.props.scrollEnabled,
            dataSource: ds
        };
    },

    componentWillMount() {
        this.rowRefs = {};
    },

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    },

    componentWillReceiveProps(nextProps) {
        if (this.props.rowData !== nextProps.rowData) {
            this.openRowRef = null;
            this.checkAnimateRemoveRow(nextProps.rowData);
        }
    },

    checkAnimateRemoveRow(nextRowData) {
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
        else {
            this.updateDataSource(nextRowData);
        }
    },

    updateDataSource(nextRowData) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(nextRowData)
        });
    },

    handleSwipeStart(row, e, g) {
        this.tryCloseOpenRow(row);
        this.listView && this.listView.setNativeProps({ scrollEnabled: false });
        this.props.onScrollStateChange(false);
    },

    handleSwipeEnd(row, e, g) {
        this.listView && this.listView.setNativeProps({ scrollEnabled: true });
        this.props.onScrollStateChange(true);
    },

    handleRowOpen(row) {
        this.openRowRef = row;
    },

    tryCloseOpenRow(row) {
        if (this.openRowRef && this.openRowRef !== row) {
            this.openRowRef.close();
            this.openRowRef = null;
        }
    },

    shouldRowCaptureEvents(row) {
        return !!(this.openRowRef && this.openRowRef !== row);
    },

    handleScroll() {
        if (this.openRowRef && this.openRowRef.isOpen()) {
            this.openRowRef.close();
        }
    },

    setListViewRef(component) {
        if (component) {
            this.listView = component;
        }
    },

    setRowRef(component, sectionId, rowId) {
        this.rowRefs[getRefKeyForRow(sectionId, rowId)] = component;
    },

    render() {
        return (
            <ListView {...this.props}
                      ref={this.setListViewRef}
                      style={[styles.listView, this.props.style]}
                      scrollEnabled={this.state.scrollEnabled && this.props.scrollEnabled}
                      onScroll={this.handleScroll}
                      enableEmptySections
                      dataSource={this.state.dataSource}
                      renderRow={this.renderSwipeListItem} />
        );
    },

    renderSwipeListItem(rowData, sectionId, rowId) {
        return (
            <SwipeRow ref={(component) => this.setRowRef(component, sectionId, rowId)}
                      id={rowData.id}
                      leftSubView={rowData.leftSubView}
                      rightSubView={rowData.rightSubView}
                      leftSubViewOptions={rowData.leftSubViewOptions}
                      rightSubViewOptions={rowData.rightSubViewOptions}
                      gestureTensionParams={this.props.gestureTensionParams}
                      blockChildEventsWhenOpen={rowData.blockChildEventsWhenOpen}
                      shouldRowCaptureEvents={this.shouldRowCaptureEvents}
                      style={[this.props.rowStyle, rowData.style]}
                      onSwipeStart={this.handleSwipeStart}
                      onSwipeEnd={this.handleSwipeEnd}
                      onOpen={this.handleRowOpen}
                      {...this.props.swipeRowProps}
                      {...rowData.props}>
                {rowData.rowView}
            </SwipeRow>
        );
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


export default SwipeList