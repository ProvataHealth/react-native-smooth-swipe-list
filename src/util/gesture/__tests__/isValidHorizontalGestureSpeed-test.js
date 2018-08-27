import isValidHorizontalGestureSpeed from '../isValidHorizontalGestureSpeed';
import isValidVelocity from '../isValidVelocity';
import { mockGestureAngle } from '../getGestureAngle';

import {
    QUICK_GESTURE_VELOCITY_THRESHOLD,
    VELOCITY_THRESHOLD_ANGLE_SLOP,
    VELOCITY_THRESHOLD_SLOP_MOD
} from '../../../constants/index';

jest.unmock('../isValidHorizontalGestureSpeed');
jest.mock('../getGestureAngle');
jest.mock('../isValidVelocity');


describe('isValidHorizontalGestureSpeed', () => {

    it('returns true for normal speeds inside horizontal threshold', () => {
        mockGestureAngle(180 + VELOCITY_THRESHOLD_ANGLE_SLOP);
        let velocity = QUICK_GESTURE_VELOCITY_THRESHOLD;
        expect(isValidHorizontalGestureSpeed({ vx: velocity })).toBeTruthy();
    });

    it('returns true for slower speeds with with shallower angle', () => {
        mockGestureAngle(180 + VELOCITY_THRESHOLD_ANGLE_SLOP);
        let velocity = QUICK_GESTURE_VELOCITY_THRESHOLD * VELOCITY_THRESHOLD_SLOP_MOD;
        expect(isValidHorizontalGestureSpeed({ vx: velocity })).toBeTruthy();
    });

    it('returns false if speed is too slow', () => {
        expect(isValidHorizontalGestureSpeed({ vx: QUICK_GESTURE_VELOCITY_THRESHOLD * 0.99 })).toBeFalsy();
    });
});