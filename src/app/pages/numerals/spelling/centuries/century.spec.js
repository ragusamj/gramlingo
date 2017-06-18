import test from "tape";
import Century from "./century";

test("Century should spell 1700", (t) => {
    t.equal(Century.spell(1700), "XVIII");
    t.end();
});
