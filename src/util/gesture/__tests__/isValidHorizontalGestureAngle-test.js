import isValidHorizontalGestureAngle from '../isValidHorizontalGestureAngle';
import getGestureAngle from '../getGestureAngle';

import {
    LEFT_GESTURE_ANGLE_RANGE,
    RIGHT_GESTURE_ANGLE_RANGE
} from '../../../constants/index';

jest.unmock('../isValidHorizontalGestureAngle');

jest.mock('../getGestureAngle');
import { mockGestureAngle } from '../getGestureAngle';

describe('isValidHorizontalGestureAngle', () => {
    // VALID LEFT
    it('returns true for valid left gestures in min range', () => {
        mockGestureAngle(LEFT_GESTURE_ANGLE_RANGE.MIN);
        expect(isValidHorizontalGestureAngle()).toBeTruthy();
    });

    it('returns true for valid left gestures in max range', () => {
        mockGestureAngle(LEFT_GESTURE_ANGLE_RANGE.MAX);
        expect(isValidHorizontalGestureAngle()).toBeTruthy();
    });

    // VALID RIGHT
    it('returns true for valid right gestures in min range', () => {
        mockGestureAngle(RIGHT_GESTURE_ANGLE_RANGE.MIN1);
        expect(isValidHorizontalGestureAngle()).toBeTruthy();

        mockGestureAngle(RIGHT_GESTURE_ANGLE_RANGE.MIN2);
        expect(isValidHorizontalGestureAngle()).toBeTruthy();
    });

    it('returns true for valid right gestures in max range', () => {
        mockGestureAngle(RIGHT_GESTURE_ANGLE_RANGE.MAX1);
        expect(isValidHorizontalGestureAngle()).toBeTruthy();

        mockGestureAngle(RIGHT_GESTURE_ANGLE_RANGE.MAX2);
        expect(isValidHorizontalGestureAngle()).toBeTruthy();
    });

    // INVALID LEFT
    it('returns false for left gestures outside the min range', () => {
        mockGestureAngle(LEFT_GESTURE_ANGLE_RANGE.MIN - 1);
        expect(isValidHorizontalGestureAngle()).toBeFalsy();
    });

    it('returns false for left gestures outside the max range', () => {
        mockGestureAngle(LEFT_GESTURE_ANGLE_RANGE.MAX + 1);
        expect(isValidHorizontalGestureAngle()).toBeFalsy();
    });

    // INVALID RIGHT
    it('returns false for right gestures outside the min range', () => {
        mockGestureAngle(RIGHT_GESTURE_ANGLE_RANGE.MIN1 - 1);
        expect(isValidHorizontalGestureAngle()).toBeFalsy();

        mockGestureAngle(RIGHT_GESTURE_ANGLE_RANGE.MIN2 - 1);
        expect(isValidHorizontalGestureAngle()).toBeFalsy();
    });

    // GENERAL INVALID
    it('returns false for right gestures outside the max range', () => {
        mockGestureAngle(RIGHT_GESTURE_ANGLE_RANGE.MAX1 + 1);
        expect(isValidHorizontalGestureAngle()).toBeFalsy();

        mockGestureAngle(RIGHT_GESTURE_ANGLE_RANGE.MAX2 + 1);
        expect(isValidHorizontalGestureAngle()).toBeFalsy();
    });

    it('returns false for invalid params', () => {
        expect(isValidHorizontalGestureAngle()).toBeFalsy();
    })
});