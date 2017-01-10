import clamp from 'lodash/clamp';

const MIN_RESISTANCE = 0.5;

export default function applySimpleTension(dx, threshold = 50, stretch = 3, resistanceStrength = 0.55) {
    let absDX = Math.abs(dx);
    if (absDX > threshold) {
        stretch = Math.max(stretch, 1);
        let delta = absDX - threshold;
        let maxLength = threshold * stretch;
        let resistanceBase = MIN_RESISTANCE + ((1 - MIN_RESISTANCE) * clamp(resistanceStrength, 0, 1));
        let resistanceDelta = 1 - resistanceBase;
        let change = (maxLength - threshold);
        let progress = Math.min(delta / change, 1);
        let resistance = resistanceBase + (resistanceDelta * progress);
        return ((absDX + (change * (resistanceDelta * progress))) - (delta * resistance)) * Math.sign(dx);
    }

    return dx;
}