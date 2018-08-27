import inRange from 'lodash/inRange';

import {
    LEFT_GESTURE_ANGLE_RANGE,
    RIGHT_GESTURE_ANGLE_RANGE,
} from '../../constants/index';
import getGestureAngle from './getGestureAngle';


/**
 *
 * @param {object} g - gestureState object
 * @see {@link https://facebook.github.io/react-native/docs/panresponder.html }
 * @return {bool}
 */
export default function isValidHorizontalGestureAngle(g) {
    let gestureAngle = getGestureAngle(g);
    let isLeftRange = inRange(gestureAngle, LEFT_GESTURE_ANGLE_RANGE.MIN, LEFT_GESTURE_ANGLE_RANGE.MAX + 1);
    let isRightRange = inRange(
            gestureAngle,
            RIGHT_GESTURE_ANGLE_RANGE.MIN1,
            RIGHT_GESTURE_ANGLE_RANGE.MAX1 + 1
        ) || inRange(gestureAngle, RIGHT_GESTURE_ANGLE_RANGE.MIN2, RIGHT_GESTURE_ANGLE_RANGE.MAX2 + 1);

    return isLeftRange || isRightRange;
};