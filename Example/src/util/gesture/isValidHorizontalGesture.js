import isValidGestureDistance from './isValidGestureDistance';
import isValidHorizontalGestureAngle from './isValidHorizontalGestureAngle';
import isValidHorizontalGestureSpeed from './isValidHorizontalGestureSpeed';

export default function isValidHorizontalGesture(g) {
    return isValidGestureDistance(g) && isValidHorizontalGestureAngle(g) && isValidHorizontalGestureSpeed(g);
}