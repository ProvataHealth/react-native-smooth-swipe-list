// For use with View.onLayout

/**
 *
 * @param {event} e - { nativeEvent: { layout: { x, y, width, height } } }
 * @see {@link https://facebook.github.io/react-native/docs/view.html#onlayout }
 * @returns {*|layout}
 */
export function getLayout(e) {
    return e && e.nativeEvent.layout;
}


/**
 *
 * @param {event} e - { nativeEvent: { layout: { x, y, width, height } } }
 * @see {@link https://facebook.github.io/react-native/docs/view.html#onlayout }
 * @returns {*|float} - width
 */
export function getWidth(e) {
    return e && e.nativeEvent.layout.width;
}


/**
 *
 * @param {event} e - { nativeEvent: { layout: { x, y, width, height } } }
 * @see {@link https://facebook.github.io/react-native/docs/view.html#onlayout }
 * @returns {*|float} - height
 */
export function getHeight(e) {
    return e && e.nativeEvent.layout.height;
}

export default {
    getLayout,
    getWidth,
    getHeight
};