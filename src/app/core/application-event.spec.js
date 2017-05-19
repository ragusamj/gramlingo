import test from "tape";
import ApplicationEvent from "./application-event";

const applicationEvent = new ApplicationEvent();

test("ApplicationEvent should emit event", (t) => {
    t.plan(1);
    applicationEvent.on("test-event", () => {
        t.assert(true);
    });
    applicationEvent.emit("test-event");
});

test("ApplicationEvent should emit event with data", (t) => {
    t.plan(1);
    applicationEvent.on("test-event-with-data", (data) => {
        t.deepEqual(data, { data: "data" });
    });
    applicationEvent.emit("test-event-with-data", { data: "data" });
});

test("ApplicationEvent should handle empty listener list", (t) => {
    applicationEvent.emit("is-anybody-there-event");
    t.end();
});

test("ApplicationEvent should remove listener", (t) => {
    let removeListener = applicationEvent.on("removed-test-event", () => {
        t.fail();
    });
    removeListener();
    applicationEvent.emit("removed-test-event");
    t.end();
});
