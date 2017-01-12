
export default function isValidVelocity(v, threshold) {
    return v ? Math.abs(v) >= threshold : false;
};

