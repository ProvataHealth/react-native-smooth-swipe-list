import 'react-native';
import React from 'react';
import { View, Text } from 'react-native';

import SwipeRow from '../SwipeRow';

import renderer from 'react-test-renderer';

describe('SwipeRow', () => {

    it('renders correctly 1', () => {
        const tree = renderer.create(
            <SwipeRow style={{ height: 10 }} id={1}>
                <Text>
                    Child Component
                </Text>
            </SwipeRow>
        );

        expect(tree).toMatchSnapshot();
    });
});