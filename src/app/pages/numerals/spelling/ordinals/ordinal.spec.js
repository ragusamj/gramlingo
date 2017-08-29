import test from "tape";
import OrdinalSuffix from "./ordinal-suffix";
import Ordinal from "./ordinal";

test("Ordinal should spell 1 - 1000 without crashing", (t) => {
    for(let i = 1; i <= 1000; i++) {
        Ordinal.spell(i, OrdinalSuffix.feminine);
    }
    t.end();
});

test("Ordinal should spell 1, neuter", (t) => {
    t.deepEqual(Ordinal.spell(1, OrdinalSuffix.neuter), ["primer"]);
    t.end();
});

test("Ordinal should spell 1, masculine", (t) => {
    t.deepEqual(Ordinal.spell(1, OrdinalSuffix.masculine), ["primero"]);
    t.end();
});

test("Ordinal should spell 1, feminine", (t) => {
    t.deepEqual(Ordinal.spell(1, OrdinalSuffix.feminine), ["primera"]);
    t.end();
});

test("Ordinal should spell 2, masculine", (t) => {
    t.deepEqual(Ordinal.spell(2, OrdinalSuffix.masculine), ["segundo"]);
    t.end();
});

test("Ordinal should spell 2, feminine", (t) => {
    t.deepEqual(Ordinal.spell(2, OrdinalSuffix.feminine), ["segunda"]);
    t.end();
});

test("Ordinal should spell 3, neuter", (t) => {
    t.deepEqual(Ordinal.spell(3, OrdinalSuffix.neuter), ["tercer"]);
    t.end();
});

test("Ordinal should spell 3, masculine", (t) => {
    t.deepEqual(Ordinal.spell(3, OrdinalSuffix.masculine), ["tercero"]);
    t.end();
});

test("Ordinal should spell 3, feminine", (t) => {
    t.deepEqual(Ordinal.spell(3, OrdinalSuffix.feminine), ["tercera"]);
    t.end();
});

test("Ordinal should spell 5, masculine", (t) => {
    t.deepEqual(Ordinal.spell(5, OrdinalSuffix.masculine), ["quinto"]);
    t.end();
});

test("Ordinal should spell 5, feminine", (t) => {
    t.deepEqual(Ordinal.spell(5, OrdinalSuffix.feminine), ["quinta"]);
    t.end();
});

test("Ordinal should spell 9, masculine", (t) => {
    t.deepEqual(Ordinal.spell(9, OrdinalSuffix.masculine), ["noveno"]);
    t.end();
});

test("Ordinal should spell 9, feminine", (t) => {
    t.deepEqual(Ordinal.spell(9, OrdinalSuffix.feminine), ["novena"]);
    t.end();
});

test("Ordinal should spell 11, masculine", (t) => {
    t.deepEqual(Ordinal.spell(11, OrdinalSuffix.masculine), ["undécimo", "onceno", "decimoprimero"]);
    t.end();
});

test("Ordinal should spell 11, feminine", (t) => {
    t.deepEqual(Ordinal.spell(11, OrdinalSuffix.feminine), ["undécima", "oncena", "decimoprimera"]);
    t.end();
});

test("Ordinal should spell 17, masculine", (t) => {
    t.deepEqual(Ordinal.spell(17, OrdinalSuffix.masculine), ["décimo séptimo", "decimoséptimo"]);
    t.end();
});

test("Ordinal should spell 17, feminine", (t) => {
    t.deepEqual(Ordinal.spell(17, OrdinalSuffix.feminine), ["décima séptima", "decimoséptima"]);
    t.end();
});

test("Ordinal should spell 20, masculine", (t) => {
    t.deepEqual(Ordinal.spell(20, OrdinalSuffix.masculine), ["vigésimo", "veinteno"]);
    t.end();
});

test("Ordinal should spell 20, feminine", (t) => {
    t.deepEqual(Ordinal.spell(20, OrdinalSuffix.feminine), ["vigésima", "veintena"]);
    t.end();
});

test("Ordinal should spell 24, masculine", (t) => {
    t.deepEqual(Ordinal.spell(24, OrdinalSuffix.masculine), ["vigésimo cuarto", "vigesimocuarto"]);
    t.end();
});

test("Ordinal should spell 24, feminine", (t) => {
    t.deepEqual(Ordinal.spell(24, OrdinalSuffix.feminine), ["vigésima cuarta", "vigesimocuarta"]);
    t.end();
});

test("Ordinal should spell 26, masculine", (t) => {
    t.deepEqual(Ordinal.spell(26, OrdinalSuffix.masculine), ["vigésimo sexto", "vigesimosexto"]);
    t.end();
});

test("Ordinal should spell 26, feminine", (t) => {
    t.deepEqual(Ordinal.spell(26, OrdinalSuffix.feminine), ["vigésima sexta", "vigesimosexta"]);
    t.end();
});

test("Ordinal should spell 30, masculine", (t) => {
    t.deepEqual(Ordinal.spell(30, OrdinalSuffix.masculine), ["trigésimo"]);
    t.end();
});

test("Ordinal should spell 30, feminine", (t) => {
    t.deepEqual(Ordinal.spell(30, OrdinalSuffix.feminine), ["trigésima"]);
    t.end();
});

test("Ordinal should spell 31, masculine", (t) => {
    t.deepEqual(Ordinal.spell(31, OrdinalSuffix.masculine), ["trigésimo primero"]);
    t.end();
});

test("Ordinal should spell 31, feminine", (t) => {
    t.deepEqual(Ordinal.spell(31, OrdinalSuffix.feminine), ["trigésima primera"]);
    t.end();
});

test("Ordinal should spell 39, masculine", (t) => {
    t.deepEqual(Ordinal.spell(39, OrdinalSuffix.masculine), ["trigésimo noveno"]);
    t.end();
});

test("Ordinal should spell 39, feminine", (t) => {
    t.deepEqual(Ordinal.spell(39, OrdinalSuffix.feminine), ["trigésima novena"]);
    t.end();
});

test("Ordinal should spell 46, masculine", (t) => {
    t.deepEqual(Ordinal.spell(46, OrdinalSuffix.masculine), ["cuadragésimo sexto"]);
    t.end();
});

test("Ordinal should spell 46, feminine", (t) => {
    t.deepEqual(Ordinal.spell(46, OrdinalSuffix.feminine), ["cuadragésima sexta"]);
    t.end();
});

test("Ordinal should spell 55, masculine", (t) => {
    t.deepEqual(Ordinal.spell(55, OrdinalSuffix.masculine), ["quincuagésimo quinto"]);
    t.end();
});

test("Ordinal should spell 55, feminine", (t) => {
    t.deepEqual(Ordinal.spell(55, OrdinalSuffix.feminine), ["quincuagésima quinta"]);
    t.end();
});

test("Ordinal should spell 60, masculine", (t) => {
    t.deepEqual(Ordinal.spell(60, OrdinalSuffix.masculine), ["sexagésimo"]);
    t.end();
});

test("Ordinal should spell 99, masculine", (t) => {
    t.deepEqual(Ordinal.spell(99, OrdinalSuffix.masculine), ["nonagésimo noveno"]);
    t.end();
});

test("Ordinal should spell 99, feminine", (t) => {
    t.deepEqual(Ordinal.spell(99, OrdinalSuffix.feminine), ["nonagésima novena"]);
    t.end();
});

test("Ordinal should spell 100, masculine", (t) => {
    t.deepEqual(Ordinal.spell(100, OrdinalSuffix.masculine), ["centésimo"]);
    t.end();
});

test("Ordinal should spell 100, feminine", (t) => {
    t.deepEqual(Ordinal.spell(100, OrdinalSuffix.feminine), ["centésima"]);
    t.end();
});

test("Ordinal should spell 101, masculine", (t) => {
    t.deepEqual(Ordinal.spell(101, OrdinalSuffix.masculine), ["centésimo primero"]);
    t.end();
});

test("Ordinal should spell 101, feminine", (t) => {
    t.deepEqual(Ordinal.spell(101, OrdinalSuffix.feminine), ["centésima primera"]);
    t.end();
});

test("Ordinal should spell 111, masculine", (t) => {
    t.deepEqual(Ordinal.spell(111, OrdinalSuffix.masculine), ["centésimo undécimo", "centésimo onceno", "centésimo decimoprimero"]);
    t.end();
});

test("Ordinal should spell 114, masculine", (t) => {
    t.deepEqual(Ordinal.spell(114, OrdinalSuffix.masculine), ["centésimo décimo cuarto", "centésimo decimocuarto"]);
    t.end();
});

test("Ordinal should spell 114, feminine", (t) => {
    t.deepEqual(Ordinal.spell(114, OrdinalSuffix.feminine), ["centésima décima cuarta", "centésima decimocuarta"]);
    t.end();
});

test("Ordinal should spell 200, masculine", (t) => {
    t.deepEqual(Ordinal.spell(200, OrdinalSuffix.masculine), ["ducentésimo"]);
    t.end();
});

test("Ordinal should spell 200, feminine", (t) => {
    t.deepEqual(Ordinal.spell(200, OrdinalSuffix.feminine), ["ducentésima"]);
    t.end();
});

test("Ordinal should spell 550, feminine", (t) => {
    t.deepEqual(Ordinal.spell(550, OrdinalSuffix.feminine), ["quingentésima quincuagésima"]);
    t.end();
});

test("Ordinal should spell 999, masculine", (t) => {
    t.deepEqual(Ordinal.spell(999, OrdinalSuffix.masculine), ["noningentésimo nonagésimo noveno"]);
    t.end();
});

test("Ordinal should spell 999, feminine", (t) => {
    t.deepEqual(Ordinal.spell(999, OrdinalSuffix.feminine), ["noningentésima nonagésima novena"]);
    t.end();
});

test("Ordinal should spell 1000, masculine", (t) => {
    t.deepEqual(Ordinal.spell(1000, OrdinalSuffix.masculine), ["milésimo"]);
    t.end();
});

test("Ordinal should spell 1000, feminine", (t) => {
    t.deepEqual(Ordinal.spell(1000, OrdinalSuffix.feminine), ["milésima"]);
    t.end();
});

test("Ordinal should spell 1111, masculine", (t) => {
    t.deepEqual(Ordinal.spell(1111, OrdinalSuffix.masculine),
        ["milésimo centésimo undécimo", "milésimo centésimo onceno", "milésimo centésimo decimoprimero"]);
    t.end();
});

test("Ordinal should spell 1114, masculine", (t) => {
    t.deepEqual(Ordinal.spell(1114, OrdinalSuffix.masculine), ["milésimo centésimo décimo cuarto", "milésimo centésimo decimocuarto"]);
    t.end();
});

test("Ordinal should spell 1114, feminine", (t) => {
    t.deepEqual(Ordinal.spell(1114, OrdinalSuffix.feminine), ["milésima centésima décima cuarta", "milésima centésima decimocuarta"]);
    t.end();
});

test("Ordinal should spell 2000, masculine", (t) => {
    t.deepEqual(Ordinal.spell(2000, OrdinalSuffix.masculine), ["dosmilésimo"]);
    t.end();
});

test("Ordinal should spell 2000, feminine", (t) => {
    t.deepEqual(Ordinal.spell(2000, OrdinalSuffix.feminine), ["dosmilésima"]);
    t.end();
});

test("Ordinal should spell 3512, masculine", (t) => {
    t.deepEqual(Ordinal.spell(3512, OrdinalSuffix.masculine),
        ["tresmilésimo quingentésimo duodécimo", "tresmilésimo quingentésimo doceno", "tresmilésimo quingentésimo decimosegundo"]);
    t.end();
});

test("Ordinal should spell 3512, feminine", (t) => {
    t.deepEqual(Ordinal.spell(3512, OrdinalSuffix.feminine),
        ["tresmilésima quingentésima duodécima", "tresmilésima quingentésima docena", "tresmilésima quingentésima decimosegunda"]);
    t.end();
});

test("Ordinal should spell 9999, masculine", (t) => {
    t.deepEqual(Ordinal.spell(9999, OrdinalSuffix.masculine), ["nuevemilésimo noningentésimo nonagésimo noveno"]);
    t.end();
});

test("Ordinal should spell 9999, feminine", (t) => {
    t.deepEqual(Ordinal.spell(9999, OrdinalSuffix.feminine), ["nuevemilésima noningentésima nonagésima novena"]);
    t.end();
});

test("Ordinal should spell 10000, masculine", (t) => {
    t.deepEqual(Ordinal.spell(10000, OrdinalSuffix.masculine), ["diezmilésimo"]);
    t.end();
});

test("Ordinal should spell 10000, feminine", (t) => {
    t.deepEqual(Ordinal.spell(10000, OrdinalSuffix.feminine), ["diezmilésima"]);
    //t.deepEqual(Ordinal.spell(33333, Gender.masculine), ['treinta y tresmilésimo tricentésimo trigésimo tercero']);
    t.end();
});
