import getGestureAngle from '../getGestureAngle';

jest.unmock('../getGestureAngle');

describe('getGestureAngle', () => {
    it('returns the correct angle derived from a gestureState object', () => {
        let gestureAngle1 = getGestureAngle({
            x0: 0,
            y0: 0,
            dx: 100,
            dy: 100
        });
        expect(gestureAngle1).toEqual(45);

        let gestureAngle2 = getGestureAngle({
            x0: 0,
            y0: 0,
            dx: 0,
            dy: 0
        });
        expect(gestureAngle2).toEqual(0);
    });
});