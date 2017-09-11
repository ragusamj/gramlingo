import test from "tape";
import NumeralsSearchEngine from "./numerals-search-engine";

const engine = new NumeralsSearchEngine();

test("NumeralsSearchEngine should ignore undefined search term", (t) => {
    t.deepEqual(engine.search(undefined), { matches: [] });
    t.end();
});

test("NumeralsSearchEngine should search terms with other chars than numbers", (t) => {
    t.deepEqual(engine.search("xxx"), { matches: [] });
    t.end();
});

test("NumeralsSearchEngine should search valid fractions", (t) => {
    engine.initialize("fractions");
    t.deepEqual(engine.search("3/4"), { matches: [ { pre: "", match: "tres cuartos", post: "", source: "" } ] });
    t.end();
});

test("NumeralsSearchEngine should ignore invalid fractions", (t) => {
    engine.initialize("fractions");
    t.deepEqual(engine.search("3/"), { matches: [] });
    t.end();
});

test("NumeralsSearchEngine should search valid times, hh:mm", (t) => {
    engine.initialize("time");
    t.deepEqual(engine.search("01:00"), { matches: [ { pre: "", match: "es la una", post: "", source: "" } ] });
    t.end();
});

test("NumeralsSearchEngine should search valid times, hh", (t) => {
    engine.initialize("time");
    t.deepEqual(engine.search("01"), { matches: [ { pre: "", match: "es la una", post: "", source: "" } ] });
    t.end();
});

test("NumeralsSearchEngine should ignore invalid times, hh:mm", (t) => {
    engine.initialize("time");
    t.deepEqual(engine.search("33:33"), { matches: [] });
    t.end();
});

test("NumeralsSearchEngine should ignore invalid times, hh", (t) => {
    engine.initialize("time");
    t.deepEqual(engine.search("25"), { matches: [] });
    t.end();
});

test("NumeralsSearchEngine should ignore invalid times, hh", (t) => {
    engine.initialize("time");
    t.deepEqual(engine.search("-1"), { matches: [] });
    t.end();
});

test("NumeralsSearchEngine should search valid years", (t) => {
    engine.initialize("centuries");
    t.deepEqual(engine.search("1066"), { matches: [ { pre: "", match: "XI", post: "", source: "" } ] });
    t.end();
});

test("NumeralsSearchEngine should ignore invalid years, min", (t) => {
    engine.initialize("centuries");
    t.deepEqual(engine.search("-1"), { matches: [] });
    t.end();
});

test("NumeralsSearchEngine should ignore invalid years, max", (t) => {
    engine.initialize("centuries");
    t.deepEqual(engine.search("3000"), { matches: [] });
    t.end();
});

test("NumeralsSearchEngine should search valid integers", (t) => {
    engine.initialize("integers");
    t.deepEqual(engine.search("123"), { matches: [ { pre: "", match: "ciento veintitrés", post: "", source: "" } ] });
    t.end();
});

test("NumeralsSearchEngine should ignore invalid integers, min", (t) => {
    engine.initialize("integers");
    t.deepEqual(engine.search("-1"), { matches: [] });
    t.end();
});

test("NumeralsSearchEngine should ignore invalid integers, max", (t) => {
    engine.initialize("integers");
    t.deepEqual(engine.search("1000001"), { matches: [] });
    t.end();
});

test("NumeralsSearchEngine should search valid ordinals", (t) => {
    engine.initialize("ordinals");
    t.deepEqual(engine.search("3"), { matches: [ { pre: "", match: "tercero", post: "", source: "" } ] });
    t.end();
});

test("NumeralsSearchEngine should ignore invalid ordinals, max", (t) => {
    engine.initialize("ordinals");
    t.deepEqual(engine.search("-1"), { matches: [] });
    t.end();
});

test("NumeralsSearchEngine should ignore invalid ordinals, min", (t) => {
    engine.initialize("ordinals");
    t.deepEqual(engine.search("10001"), { matches: [] });
    t.end();
});
