import normalizeVelocity from './normalizeVelocity';

export default function isValidVelocity(v, threshold) {
    v = normalizeVelocity(v);
    return v ? Math.abs(v) >= threshold : false;
};

