import sinon from "sinon";
import test from "tape";
import throttle from "./throttle";

test("Throttle should throttle", (t) => {

    let counter = 0;
    let clock = sinon.useFakeTimers();
    let debounced = throttle(() => {
        counter++;
    }, 100);

    debounced();
    debounced();
    debounced();
    clock.tick(50);

    debounced();
    debounced();
    debounced();
    clock.tick(40);

    debounced();
    debounced();
    debounced();
    debounced();
    clock.tick(10);

    t.equal(counter, 4);
    t.end();
});

test("Throttle should throttle and execute the callback with arguments", (t) => {
    t.plan(1);

    let clock = sinon.useFakeTimers();
    let debounced = throttle((n) => {
        t.equal(n, 1);
    }, 100);

    debounced(1);
    clock.tick(100);

    t.end();
});
