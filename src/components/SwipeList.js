import React, { PropTypes } from 'react';
import { StyleSheet, View, ListView } from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';

import {
    OPEN_POSITION_THRESHOLD_FACTOR
} from '../constants';
import SwipeRow from './SwipeRow';
import {
    getWidth,
    getHeight
} from '../util/layout';


const SwipeList = React.createClass({

    propsTypes: {
        style: View.propTypes.style,
        rowStyle: View.propTypes.style,
        scrollEnabled: PropTypes.bool,
        blockChildEventsWhenOpen: PropTypes.bool,
        rowData: PropTypes.array
    },

    getDefaultProps() {
        return {
            scrollEnabled: true
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

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    },

    componentWillReceiveProps(nextProps) {
        if (this.props.rowData !== nextProps.rowData) {
            this.lastOpenRow = null;
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(nextProps.rowData)
            });
        }
    },

    handleSwipeStart(row, e, g) {
        this.tryCloseOpenRow(row);
        this.listView && this.listView.setNativeProps({ scrollEnabled: false });
    },

    handleSwipeEnd(row, e, g) {
        this.listView && this.listView.setNativeProps({ scrollEnabled: true });
    },

    handleRowOpen(row) {
        this.lastOpenRow = row;
    },

    tryCloseOpenRow(row) {
        if (this.lastOpenRow !== row) {
            this.lastOpenRow && this.lastOpenRow.close();
        }
    },

    handleScroll() {
        if (this.lastOpenRow && this.lastOpenRow.isOpen()) {
            this.lastOpenRow.close();
        }
    },

    setListViewRef(component) {
        if (component) {
            this.listView = component;
        }
    },

    render() {
        return (
            <ListView ref={this.setListViewRef}
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
            <SwipeRow key={rowData.key || `${sectionId}:${rowId}`}
                      leftSubView={rowData.leftSubView}
                      rightSubView={rowData.rightSubView}
                      leftSubViewOptions={rowData.leftSubViewOptions}
                      rightSubViewOptions={rowData.rightSubViewOptions}
                      style={rowData.style}
                      onSwipeStart={this.handleSwipeStart}
                      onSwipeEnd={this.handleSwipeEnd}
                      onOpen={this.handleRowOpen}
                      blockChildEventsWhenOpen={this.props.blockChildEventsWhenOpen}>
                {rowData.rowView}
            </SwipeRow>
        );
    }
});


const styles = StyleSheet.create({
    listView: {
        alignSelf: 'stretch',
        backgroundColor: 'rgb(111, 111, 111)'
    }
});


export default SwipeList