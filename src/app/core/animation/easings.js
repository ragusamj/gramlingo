const easeIn = p => t => Math.pow(t, p);
const easeOut = p => t => 1 - easeIn(p)(1 - t);
const easeInOut = p => t => t < 0.5 ? easeIn(p)(t * 2) / 2 : easeOut(p)(t * 2 - 1) / 2 + 0.5;

const easeInSine = (t) => 1 - Math.cos(t * Math.PI / 2);
const easeOutSine = (t) => 1 - easeInSine(1 - t);
const easeInOutSine = (t) => t < 0.5 ? easeInSine(t * 2) / 2 : easeOutSine(t * 2 - 1) / 2 + 0.5;

const easeInCircular = (t) => 1 - Math.sqrt(1 - Math.pow(t, 3));
const easeOutCircular = (t) => 1 - easeInCircular(1 - t);
const easeInOutCircular = (t) => t < 0.5 ? easeInCircular(t * 2) / 2 : easeOutCircular(t * 2 - 1) / 2 + 0.5;

const easeInElastic = (t) => - Math.pow(2, 10 * (t -= 1)) * Math.sin((t - 0.4 / 4) * (2 * Math.PI) / 0.4);
const easeOutElastic = (t) => 1 - easeInElastic(1 - t);
const easeInOutElastic = (t) => t < 0.5 ? easeInElastic(t * 2) / 2 : easeOutElastic(t * 2 - 1) / 2 + 0.5;

const easeInBack = (t) => t * t * (2.7 * t - 1.7);
const easeOutBack = (t) => 1 - easeInBack(1 - t);
const easeInOutBack = (t) => t < 0.5 ? easeInBack(t * 2) / 2 : easeOutBack(t * 2 - 1) / 2 + 0.5;

export default {

    linear: t => t,

    easeInQuad: easeIn(2),
    easeOutQuad: easeOut(2),
    easeInOutQuad: easeInOut(2),

    easeInCubic: easeIn(3),
    easeOutCubic: easeOut(3),
    easeInOutCubic: easeInOut(3),

    easeInQuart: easeIn(4),
    easeOutQuart: easeOut(4),
    easeInOutQuart: easeInOut(4),

    easeInQuint: easeIn(5),
    easeOutQuint: easeOut(5),
    easeInOutQuint: easeInOut(5),

    easeInSine: easeInSine,
    easeOutSine: easeOutSine,
    easeInOutSine: easeInOutSine,

    easeInCircular: easeInCircular,
    easeOutCircular: easeOutCircular,
    easeInOutCircular: easeInOutCircular,

    easeInElastic: easeInElastic,
    easeOutElastic: easeOutElastic,
    easeInOutElastic: easeInOutElastic,

    easeInBack: easeInBack,
    easeOutBack: easeOutBack,
    easeInOutBack: easeInOutBack
};