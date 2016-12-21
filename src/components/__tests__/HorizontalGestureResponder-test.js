import 'react-native';
import React from 'react';
import { View, Text } from 'react-native';

import HorizontalGestureResponder from '../HorizontalGestureResponder';

import renderer from 'react-test-renderer';

describe('HorizontalGestureResponder', () => {

    it('renders correctly if enabled 1', () => {
        const tree = renderer.create(
            <HorizontalGestureResponder style={{ height: 10 }}>
                <Text>
                    Child Component
                </Text>
            </HorizontalGestureResponder>
        );
        expect(tree).toMatchSnapshot();
    });

    it('renders correctly if disabled 1', () => {
        const tree = renderer.create(
            <HorizontalGestureResponder enabled={false} style={{ height: 10 }}>
                <Text>
                    Child Component
                </Text>
            </HorizontalGestureResponder>
        );
        expect(tree).toMatchSnapshot();
    })
});