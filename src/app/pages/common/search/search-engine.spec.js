import test from "tape";
import SearchEngine from "./search-engine";

test("SearchEngine should skip searching if term contains non-spanish alphabetic chars", (t) => {
    let service = new SearchEngine([{ name: "Ir" }]);
    t.deepEqual(service.search("ir++"), { matches: [], maxExceeded: false });
    t.end();
});

test("SearchEngine should give exact matches the highest weight", (t) => {
    let service = new SearchEngine([{ name: "Haber" }]);
    t.deepEqual(service.search("haber"), {
        matches: [
            { index: 0, match: "haber", post: "", pre: "", source: "", weight: 100 },
            { index: 0, match: "haber", post: "", pre: "", source: "haber", weight: 50 } // TODO: remove duplicates
        ],
        maxExceeded: false });
    t.end();
});

test("SearchEngine should give matches from the beginning of words the second highest weight", (t) => {
    let service = new SearchEngine([{ name: "Abrir" }]);
    t.deepEqual(service.search("ab"), {
        matches: [
            { index: 0, match: "ab", post: "rir", pre: "", source: "", weight: 90 }
        ],
        maxExceeded: false });
    t.end();
});

test("SearchEngine should give matches inside of words a lower weight", (t) => {
    let service = new SearchEngine([{ name: "Abrir" }]);
    t.deepEqual(service.search("ir"), {
        matches: [
            { index: 0, match: "ir", post: "", pre: "abr", source: "", weight: 77 }
        ],
        maxExceeded: false });
    t.end();
});

test("SearchEngine should give phonetic matches the lowest weight", (t) => {
    let service = new SearchEngine([{ name: "Haber" }]);
    t.deepEqual(service.search("aver"), {
        matches: [
            { index: 0, match: "haber", post: "", pre: "", source: "haber", weight: 50 }
        ],
        maxExceeded: false });
    t.end();
});

test("SearchEngine should weed out duplicate phonetic matches", (t) => {
    let service = new SearchEngine([{
        name: "Atar",
        indicative: { present: [["ato"],["atas"],["ata"]] },
        subjunctive: { present: [["ate"],["ates"],["ate"]] },
        imperative: { affirmative: [[],["ata"],["ate"]] }
    }]);
    t.deepEqual(service.search("ato"), {
        matches: [
            { index: 0, match: "ato", post: "", pre: "", source: "atar", weight: 59 },
            { index: 0, match: "ata", post: "", pre: "", source: "atar", weight: 49 },
            { index: 0, match: "ate", post: "", pre: "", source: "atar", weight: 49 } ],
        maxExceeded: false });
    t.end();
});

test("SearchEngine should not exceed max search results when matching from beginning", (t) => {
    let service = new SearchEngine([
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

    t.deepEqual(service.search("at").matches.length, 10);
    t.end();
});

test("SearchEngine should not exceed max search results when matching inside", (t) => {
    let service = new SearchEngine([
        { name: "acostar" },
        { name: "ajustar" },
        { name: "apostar" },
        { name: "asustar" },
        { name: "arrestar" },
        { name: "bastar" },
        { name: "conquistar" },
        { name: "contestar" },
        { name: "costar" },
        { name: "estar" },
        { name: "detestar" }
    ]);

    t.deepEqual(service.search("star").matches.length, 10);
    t.end();
});

test("SearchEngine should order descending by weight", (t) => {
    let service = new SearchEngine([
        { name: "dormir" },
        { name: "gemir" },
        { name: "mirar" }
    ]);

    t.deepEqual(service.search("mir"), {
        matches: [
            { index: 2, match: "mir", post: "ar", pre: "", source: "", weight: 90 },
            { index: 1, match: "mir", post: "", pre: "ge", source: "", weight: 78 },
            { index: 0, match: "mir", post: "", pre: "dor", source: "", weight: 77 }
        ],
        maxExceeded: false });
    t.end();
});

test("SearchEngine create phonetic index from data with objects and arrays", (t) => {
    let service = new SearchEngine([
        { name: "ir", indicative: { present: [["voy"]] } }
    ]);

    t.deepEqual(service.search("voy"), {
        matches: [
            { index: 0, match: "voy", post: "", pre: "", source: "ir", weight: 59 }
        ],
        maxExceeded: false });
    t.end();
});

test("SearchEngine create phonetic index from data with objects and arrays and ignore unknown data types", (t) => {
    let service = new SearchEngine([
        { name: "ir", unknown: 123, indicative: { present: [["voy"]] } }
    ]);

    t.deepEqual(service.search("voy"), {
        matches: [
            { index: 0, match: "voy", post: "", pre: "", source: "ir", weight: 59 }
        ],
        maxExceeded: false });
    t.end();
});

test("SearchEngine create phonetic index lazily", (t) => {
    let service = new SearchEngine([
        { name: "ir", indicative: { present: [["voy"]] } }
    ]);

    t.true(service.phoneticIndex === undefined);
    service.search("voy");
    t.true(service.phoneticIndex !== undefined);

    let index = service.phoneticIndex;
    service.search("voy");

    t.equal(service.phoneticIndex, index);
    t.end();
});