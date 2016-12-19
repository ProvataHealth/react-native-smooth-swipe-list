import 'react-native';
import React from 'react';
import Main from '../index';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders Main correctly', () => {
    const tree = renderer.create(
        <Main />
    );
    expect(tree).toMatchSnapshot();
});
