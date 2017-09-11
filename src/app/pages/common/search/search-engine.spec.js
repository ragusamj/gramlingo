import test from "tape";
import SearchEngine from "./search-engine";

const searchEngine = new SearchEngine();

test("SearchEngine should skip searching if term contains non-spanish alphabetic chars", (t) => {
    searchEngine.initialize([{ name: "Ir" }]);
    t.deepEqual(searchEngine.search("ir++"), { matches: [], maxExceeded: false });
    t.end();
});

test("SearchEngine should give exact matches the highest weight", (t) => {
    searchEngine.initialize([{ name: "Haber" }]);
    t.deepEqual(searchEngine.search("haber"), {
        matches: [
            { index: 0, match: "haber", post: "", pre: "", source: "", weight: 100 }
        ],
        maxExceeded: false });
    t.end();
});

test("SearchEngine should give matches from the beginning of words the second highest weight", (t) => {
    searchEngine.initialize([{ name: "Abrir" }]);
    t.deepEqual(searchEngine.search("ab"), {
        matches: [
            { index: 0, match: "ab", post: "rir", pre: "", source: "", weight: 90 }
        ],
        maxExceeded: false });
    t.end();
});

test("SearchEngine should give phonetic matches the lowest weight", (t) => {
    searchEngine.initialize([{ name: "Haber" }]);
    t.deepEqual(searchEngine.search("aver"), {
        matches: [
            { index: 0, match: "haber", post: "", pre: "", source: "haber", weight: 70 }
        ],
        maxExceeded: false });
    t.end();
});

test("SearchEngine should weed out duplicate phonetic matches", (t) => {
    searchEngine.initialize([{
        name: "Atar",
        indicative: { present: [["ato"],["atas"],["ata"]] },
        subjunctive: { present: [["ate"],["ates"],["ate"]] },
        imperative: { affirmative: [[],["ata"],["ate"]] }
    }]);
    t.deepEqual(searchEngine.search("ato"), {
        matches: [
            { index: 0, match: "ato", post: "", pre: "", source: "atar", weight: 79 },
            { index: 0, match: "ata", post: "", pre: "", source: "atar", weight: 69 },
            { index: 0, match: "ate", post: "", pre: "", source: "atar", weight: 69 } ],
        maxExceeded: false });
    t.end();
});

test("SearchEngine should not exceed max search results when matching from beginning", (t) => {
    searchEngine.initialize([
        { name: "atestiguar" },
        { name: "atacar" },
        { name: "atender" },
        { name: "aterrizar" },
        { name: "aterrorizar" },
        { name: "atar" },
        { name: "atraer" },
        { name: "atrapar" },
        { name: "atravesar" },
        { name: "atribuir" },
        { name: "atropellar" }
    ]);

    t.deepEqual(searchEngine.search("at").matches.length, 10);
    t.end();
});

test("SearchEngine should order descending by weight", (t) => {
    searchEngine.initialize([
        { name: "abrir", indicative: { present: [["abro"],["abres"],["abre"]] } },
        { name: "averiguar" },
        { name: "haber" }
    ]);

    t.deepEqual(searchEngine.search("aver"), {
        matches: [
            { index: 1, match: "aver", post: "iguar", pre: "", source: "", weight: 90 },
            { index: 2, match: "haber", post: "", pre: "", source: "haber", weight: 70 },
            { index: 0, match: "abro", post: "", pre: "", source: "abrir", weight: 69 },
            { index: 0, match: "abre", post: "", pre: "", source: "abrir", weight: 69 } ],
        maxExceeded: false });
    t.end();
});

test("SearchEngine create phonetic index from data with objects and arrays", (t) => {
    searchEngine.initialize([
        { name: "ir", indicative: { present: [["voy"]] } }
    ]);

    t.deepEqual(searchEngine.search("voy"), {
        matches: [
            { index: 0, match: "voy", post: "", pre: "", source: "ir", weight: 79 }
        ],
        maxExceeded: false });
    t.end();
});

test("SearchEngine create phonetic index from data with objects and arrays and ignore unknown data types", (t) => {
    searchEngine.initialize([
        { name: "ir", unknown: 123, indicative: { present: [["voy"]] } }
    ]);

    t.deepEqual(searchEngine.search("voy"), {
        matches: [
            { index: 0, match: "voy", post: "", pre: "", source: "ir", weight: 79 }
        ],
        maxExceeded: false });
    t.end();
});

test("SearchEngine create phonetic index lazily", (t) => {
    searchEngine.initialize([
        { name: "ir", indicative: { present: [["voy"]] } }
    ]);

    t.true(searchEngine.phoneticIndex === undefined);
    searchEngine.search("voy");
    t.true(searchEngine.phoneticIndex !== undefined);

    let index = searchEngine.phoneticIndex;
    searchEngine.search("voy");

    t.equal(searchEngine.phoneticIndex, index);
    t.end();
});
