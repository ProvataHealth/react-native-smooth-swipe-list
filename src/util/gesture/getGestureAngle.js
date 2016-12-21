

/**
 *
 * @param {object} g - gestureState object
 * @see {@link https://facebook.github.io/react-native/docs/panresponder.html }
 * @return {float} - between 0 and 360
 */
export default function getGestureAngle(g) {
    let startPoint = { x: g.x0, y: g.y0 };
    let endPoint = { x: g.dx, y: g.dy };
    return getAngleBetweenPoints(startPoint, endPoint);
}

// referenced: https://gist.github.com/conorbuck/2606166
function getAngleBetweenPoints(p1 = { x: 0, y: 0 }, p2 = { x: 0, y: 0 }, returnRadians) {
    let angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    if (!returnRadians) {
        angle = angle * 360 / (2* Math.PI);

        angle = angle < 0 ? angle + 360 : angle;
    }
    return angle;
}