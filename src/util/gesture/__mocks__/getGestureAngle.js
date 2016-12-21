const getGestureAngle = jest.fn();

export function mockGestureAngle(angle) {
    getGestureAngle.mockImplementationOnce(() => angle);
}

export default getGestureAngle;