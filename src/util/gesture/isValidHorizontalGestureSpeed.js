import inRange from 'lodash/inRange';

import {
    VELOCITY_THRESHOLD_ANGLE_SLOP,
    VELOCITY_THRESHOLD_SLOP_MOD,
    QUICK_GESTURE_VELOCITY_THRESHOLD
} from '../../constants/index';
import getGestureAngle from './getGestureAngle';
import isValidVelocity from './isValidVelocity';

/**
 *
 * @param {object} g - gestureState object
 * @param {float} [thresholdOverride] - value to use instead of the quick gesture constant
 * @return {bool}
 */
export default function isValidHorizontalGestureSpeed(g, thresholdOverride) {
    // the closer we are to horizontal, decrease the velocity threshold, for simplicity sake making it a static range
    let gestureAngle = getGestureAngle(g);
    let insideLeftSlop = inRange(
        gestureAngle,
        180 - VELOCITY_THRESHOLD_ANGLE_SLOP,
        180 + VELOCITY_THRESHOLD_ANGLE_SLOP + 1
    );
    let insideRightSlop = inRange(
            gestureAngle, 360 - VELOCITY_THRESHOLD_ANGLE_SLOP,
            361
        ) || inRange(gestureAngle, 0, VELOCITY_THRESHOLD_ANGLE_SLOP + 1);
    let baseThreshold = thresholdOverride || QUICK_GESTURE_VELOCITY_THRESHOLD;
    let velocityThreshold = baseThreshold * ((insideLeftSlop || insideRightSlop) ? VELOCITY_THRESHOLD_SLOP_MOD : 1);
    let { vx } = g;
    return isValidVelocity(vx, velocityThreshold);
};