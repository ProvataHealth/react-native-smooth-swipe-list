export default function applySimpleTension(dx, length) {
    // TODO the tension should be based on the width of the screen instead
    // E.G the 0.35 and 5 multipliers need to be a fraction of the screen size
    let absDX = Math.abs(dx);
    let minLength = length * 0.35;
    let maxLength = length * 5;
    let stretch = maxLength - minLength;
    let progress = (absDX - minLength) / stretch;
    return (absDX * (1 - progress) * Math.sign(dx));
}