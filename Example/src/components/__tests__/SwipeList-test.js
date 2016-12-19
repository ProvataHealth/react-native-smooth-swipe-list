import 'react-native';
import React from 'react';
import { View, Text } from 'react-native';

import SwipeList from '../SwipeList';

import renderer from 'react-test-renderer';

describe('SwipeList', () => {

    it('renders correctly 1', () => {
        const tree = renderer.create(
            <SwipeList style={{ height: 10 }}>
                <Text>
                    Child Component
                </Text>
            </SwipeList>
        );

        expect(tree).toMatchSnapshot();
    });
});