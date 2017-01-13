import isValidVelocity from '../isValidVelocity';

jest.unmock('../isValidVelocity');

describe('isValidVelocity', () => {
    it('returns true if over threshold', () => {
        expect(isValidVelocity(5.1, 5));
    });

    it('returns false if under threshold', () => {
        expect(isValidVelocity(4.9, 5));
    });
});