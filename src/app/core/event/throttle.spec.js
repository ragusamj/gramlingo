import sinon from "sinon";
import test from "tape";
import throttle from "./throttle";

test("Throttle should throttle", (t) => {

    let counter = 0;
    let clock = sinon.useFakeTimers();
    let throttled = throttle(() => {
        counter++;
    }, 100);

    throttled();
    throttled();
    throttled();
    clock.tick(50);

    throttled();
    throttled();
    throttled();
    clock.tick(40);

    throttled();
    throttled();
    throttled();
    throttled();
    clock.tick(10);

    throttled();
    throttled();
    clock.tick(70);

    t.equal(counter, 1);

    clock.restore();
    t.end();
});

test("Throttle should throttle and execute the callback with arguments", (t) => {
    t.plan(1);

    let clock = sinon.useFakeTimers();
    let throttled = throttle((n) => {
        t.equal(n, 1);
        clock.restore();
    }, 100);

    throttled(1);
    clock.tick(100);

    t.end();
});
