import test from "tape";
import NumeralGenerator from "./numeral-generator";

let mockRandomValue = 0.2;
let mockRandomRangeSeed = 0;

// the number of "random" numbers needed to run generator.randomize() twice,
// without causing infinite loops when looking up unique numbers in the caches
const mockRandomRangeMaxValue = 18;

const mockIntegerGenerator = {
    random: () => mockRandomValue,
    range: () => {
        mockRandomRangeSeed = mockRandomRangeSeed >= mockRandomRangeMaxValue ? 1 : mockRandomRangeSeed;
        return mockRandomRangeSeed++;
    }
};

const assertUnique = (t, a, b) => {
    for(let x of a) {
        for(let y of b) {
            t.notEqual(x.q, y.q);
        }
    }
};

test("NumeralGenerator should randomize all numeral types", (t) => {
    const generator = new NumeralGenerator(mockIntegerGenerator);
    mockRandomRangeSeed = 0;

    t.deepEqual(generator.randomize(), {
        "centuries": [
            { "q": [["0-99"]],    "a": [["I"]] },
            { "q": [["100-199"]], "a": [["II"]] },
            { "q": [["200-299"]], "a": [["III"]] },
            { "q": [["300-399"]], "a": [["IV"]] },
            { "q": [["400-499"]], "a": [["V"]] },
            { "q": [["500-599"]], "a": [["VI"]] }
        ],
        "fractions": [
            { "p": 0.8571428571428571, "q": [["6/7"]],   "a": [["seis séptimos"]] },
            { "p": 0.8888888888888888, "q": [["8/9"]],   "a": [["ocho novenos"]] },
            { "p": 0.9090909090909091, "q": [["10/11"]], "a": [["diez onceavos", "diez onzavos"]] },
            { "p": 0.9230769230769231, "q": [["12/13"]], "a": [["doce treceavos", "doce trezavos"]] },
            { "p": 0.9333333333333333, "q": [["14/15"]], "a": [["catorce quinceavos", "catorce quinzavos"]] },
            { "p": 0.9411764705882353, "q": [["16/17"]], "a": [["dieciséis diecisieteavos"]] }
        ],
        "integers": [
            { "q": [[1]], "a": [["uno"]] },
            { "q": [[2]], "a": [["dos"]] },
            { "q": [[3]], "a": [["tres"]] },
            { "q": [[4]], "a": [["cuatro"]] },
            { "q": [[5]], "a": [["cinco"]] },
            { "q": [[6]], "a": [["seis"]] }
        ],
        "ordinals": [
            { "q": [["7ª"]],  "a": [["séptima"]] },
            { "q": [["8ª"]],  "a": [["octava"]] },
            { "q": [["9ª"]],  "a": [["novena"]] },
            { "q": [["10ª"]], "a": [["décima"]] },
            { "q": [["11ª"]], "a": [["undécima", "oncena", "decimoprimera"]] },
            { "q": [["12ª"]], "a": [["duodécima", "docena", "decimosegunda"]] }
        ],
        "time": [
            { "q": [["02:03"]], "a": [["son las dos y tres"]] },
            { "q": [["04:05"]], "a": [["son las cuatro y cinco"]] },
            { "q": [["06:07"]], "a": [["son las seis y siete"]] },
            { "q": [["13:14"]], "a": [["son las trece y catorce", "es la una y catorce"]] },
            { "q": [["15:16"]], "a": [["son las quince y dieciséis", "son las tres y dieciséis"]] },
            { "q": [["17:01"]], "a": [["son las diecisiete y uno", "son las cinco y uno"]] }
        ]
    });

    t.end();
});

test("NumeralGenerator should randomize centuries", (t) => {
    const generator = new NumeralGenerator(mockIntegerGenerator);
    mockRandomRangeSeed = 0;

    t.deepEqual(generator.randomize("centuries"), [
        { "q": [["0-99"]],    "a": [["I"]] },
        { "q": [["100-199"]], "a": [["II"]] },
        { "q": [["200-299"]], "a": [["III"]] },
        { "q": [["300-399"]], "a": [["IV"]] },
        { "q": [["400-499"]], "a": [["V"]] },
        { "q": [["500-599"]], "a": [["VI"]] }
    ]);

    t.end();
});

test("NumeralGenerator should randomize centuries and not repeat values from last batch", (t) => {
    const generator = new NumeralGenerator(mockIntegerGenerator);
    mockRandomRangeSeed = 0;

    let batch1 = generator.randomize("centuries");
    let batch2 = generator.randomize("centuries");

    assertUnique(t, batch1, batch2);

    t.end();
});

test("NumeralGenerator should randomize fractions", (t) => {
    const generator = new NumeralGenerator(mockIntegerGenerator);
    mockRandomRangeSeed = 1;

    t.deepEqual(generator.randomize("fractions"), [
        { p: 0.5,                q: [["1/2"]],   a: [["un medio"]] },
        { p: 0.75,               q: [["3/4"]],   a: [["tres cuartos"]] },
        { p: 0.8333333333333334, q: [["5/6"]],   a: [["cinco sextos"]] },
        { p: 0.875,              q: [["7/8"]],   a: [["siete octavos"]] },
        { p: 0.9,                q: [["9/10" ]], a: [["nueve décimos"]] },
        { p: 0.9166666666666666, q: [["11/12"]], a: [["once doceavos", "once dozavos"]] }
    ]);

    t.end();
});

test("NumeralGenerator should randomize fractions and not repeat values from last batch", (t) => {
    const generator = new NumeralGenerator(mockIntegerGenerator);
    mockRandomRangeSeed = 1;

    let batch1 = generator.randomize("fractions");
    let batch2 = generator.randomize("fractions");

    assertUnique(t, batch1, batch2);

    t.end();
});

test("NumeralGenerator should randomize integers", (t) => {
    const generator = new NumeralGenerator(mockIntegerGenerator);
    mockRandomRangeSeed = 1;

    t.deepEqual(generator.randomize("integers"), [
        { q: [[1]], a: [["uno"]] },
        { q: [[2]], a: [["dos"]] },
        { q: [[3]], a: [["tres"]] },
        { q: [[4]], a: [["cuatro"]] },
        { q: [[5]], a: [["cinco"]] },
        { q: [[6]], a: [["seis"]] }
    ]);

    t.end();
});

test("NumeralGenerator should randomize integers and not repeat values from last batch", (t) => {
    const generator = new NumeralGenerator(mockIntegerGenerator);
    mockRandomRangeSeed = 1;

    let batch1 = generator.randomize("integers");
    let batch2 = generator.randomize("integers");

    assertUnique(t, batch1, batch2);

    t.end();
});

test("NumeralGenerator should randomize ordinals, masculine", (t) => {
    const generator = new NumeralGenerator(mockIntegerGenerator);
    mockRandomValue = 0.5; // > 0.5 masculine
    mockRandomRangeSeed = 1;

    t.deepEqual(generator.randomize("ordinals"), [
        { q: [["1º"]], a: [["primero"]] },
        { q: [["2º"]], a: [["segundo"]] },
        { q: [["3º"]], a: [["tercero"]] },
        { q: [["4º"]], a: [["cuarto"]] },
        { q: [["5º"]], a: [["quinto"]] }, 
        { q: [["6º"]], a: [["sexto"]] }
    ]);

    t.end();
});

test("NumeralGenerator should randomize ordinals, feminine", (t) => {
    const generator = new NumeralGenerator(mockIntegerGenerator);
    mockRandomValue = 0.4; // < 0.5 feminine
    mockRandomRangeSeed = 1;

    t.deepEqual(generator.randomize("ordinals"), [
        { q: [["1ª"]], a: [["primera"]] },
        { q: [["2ª"]], a: [["segunda"]] },
        { q: [["3ª"]], a: [["tercera"]] },
        { q: [["4ª"]], a: [["cuarta"]] },
        { q: [["5ª"]], a: [["quinta"]] }, 
        { q: [["6ª"]], a: [["sexta"]] }
    ]);

    t.end();
});

test("NumeralGenerator should randomize ordinals, primer and tercer", (t) => {
    const generator = new NumeralGenerator(mockIntegerGenerator);
    mockRandomValue = 0.3; // treshold for primer and tercer
    mockRandomRangeSeed = 1;

    t.deepEqual(generator.randomize("ordinals"), [
        { q: [["1"]],  a: [[ "primer"]] },
        { q: [["2ª"]], a: [[ "segunda"]] },
        { q: [["3"]],  a: [[ "tercer"]] },
        { q: [["4ª"]], a: [[ "cuarta"]] },
        { q: [["5ª"]], a: [[ "quinta"]] },
        { q: [["6ª"]], a: [[ "sexta"]] }
    ]);

    t.end();
});

test("NumeralGenerator should randomize ordinals and not repeat values from last batch", (t) => {
    const generator = new NumeralGenerator(mockIntegerGenerator);
    mockRandomRangeSeed = 1;

    let batch1 = generator.randomize("ordinals");
    let batch2 = generator.randomize("ordinals");

    assertUnique(t, batch1, batch2);

    t.end();
});

test("NumeralGenerator should randomize time", (t) => {
    const generator = new NumeralGenerator(mockIntegerGenerator);
    mockRandomRangeSeed = 1;

    t.deepEqual(generator.randomize("time"), [
        { q: [["01:02"]], a: [["es la una y dos"]] },
        { q: [["03:04"]], a: [["son las tres y cuatro"]] },
        { q: [["05:06"]], a: [["son las cinco y seis"]] },
        { q: [["07:08"]], a: [["son las siete y ocho"]] },
        { q: [["09:10"]], a: [["son las nueve y diez"]] },
        { q: [["11:12"]], a: [["son las once y doce"]] }
    ]);

    t.end();
});

test("NumeralGenerator should randomize time and not repeat values from last batch", (t) => {
    const generator = new NumeralGenerator(mockIntegerGenerator);
    mockRandomRangeSeed = 1;

    let batch1 = generator.randomize("time");
    let batch2 = generator.randomize("time");

    assertUnique(t, batch1, batch2);

    t.end();
});

test("NumeralGenerator should format time span", (t) => {
    const generator = new NumeralGenerator(mockIntegerGenerator);
    t.equal(generator.formatTimeSpan(12, 34), "12:34");
    t.end();
});
