import sinon from "sinon";
import test from "tape";
import debounce from "./debounce";

test("Debounce should debounce and execute the callback with arguments", (t) => {
    t.plan(1);

    let clock = sinon.useFakeTimers();
    let debounced = debounce((n) => {
        t.equal(n, 1);
    }, 10);

    debounced(1);
    clock.tick(10);

    t.end();
});
