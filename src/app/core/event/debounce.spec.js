import sinon from "sinon";
import test from "tape";
import debounce from "./debounce";

test("Debounce should debounce and wait for n ms and then run once", function(t) {

    let counter = 0;
    let clock = sinon.useFakeTimers();
    let debounced = debounce(function() {
        counter++;
    }, 100);
  
    debounced();
    clock.tick(50);

    debounced();
    debounced();
    clock.tick(50);

    debounced();
    clock.tick(50);

    debounced();
    debounced();
    debounced();
    clock.tick(50);

    debounced();
    clock.tick(300);
  
    t.equal(counter, 1);

    clock.restore();
    t.end();
});

test("Debounce should debounce and execute the callback with arguments", (t) => {
    t.plan(1);

    let clock = sinon.useFakeTimers();
    let debounced = debounce((n) => {
        t.equal(n, 1);
        clock.restore();
    }, 10);

    debounced(1);
    clock.tick(10);

    t.end();
});
