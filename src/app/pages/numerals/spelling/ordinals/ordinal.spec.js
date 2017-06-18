import test from "tape";
import Gender from "./gender";
import Ordinal from "./ordinal";

test("Ordinal should spell 1, neuter", (t) => {
    t.deepEqual(Ordinal.spell(1, Gender.neuter), ["primer"]);
    t.end();
});

test("Ordinal should spell 1, masculine", (t) => {
    t.deepEqual(Ordinal.spell(1, Gender.masculine), ["primero"]);
    t.end();
});

test("Ordinal should spell 1, feminine", (t) => {
    t.deepEqual(Ordinal.spell(1, Gender.feminine), ["primera"]);
    t.end();
});

test("Ordinal should spell 2, masculine", (t) => {
    t.deepEqual(Ordinal.spell(2, Gender.masculine), ["segundo"]);
    t.end();
});

test("Ordinal should spell 2, feminine", (t) => {
    t.deepEqual(Ordinal.spell(2, Gender.feminine), ["segunda"]);
    t.end();
});

test("Ordinal should spell 3, neuter", (t) => {
    t.deepEqual(Ordinal.spell(3, Gender.neuter), ["tercer"]);
    t.end();
});

test("Ordinal should spell 3, masculine", (t) => {
    t.deepEqual(Ordinal.spell(3, Gender.masculine), ["tercero"]);
    t.end();
});

test("Ordinal should spell 3, feminine", (t) => {
    t.deepEqual(Ordinal.spell(3, Gender.feminine), ["tercera"]);
    t.end();
});

test("Ordinal should spell 5, masculine", (t) => {
    t.deepEqual(Ordinal.spell(5, Gender.masculine), ["quinto"]);
    t.end();
});

test("Ordinal should spell 5, feminine", (t) => {
    t.deepEqual(Ordinal.spell(5, Gender.feminine), ["quinta"]);
    t.end();
});

test("Ordinal should spell 9, masculine", (t) => {
    t.deepEqual(Ordinal.spell(9, Gender.masculine), ["noveno"]);
    t.end();
});

test("Ordinal should spell 9, feminine", (t) => {
    t.deepEqual(Ordinal.spell(9, Gender.feminine), ["novena"]);
    t.end();
});

test("Ordinal should spell 11, masculine", (t) => {
    t.deepEqual(Ordinal.spell(11, Gender.masculine), ["undécimo", "onceno", "decimoprimero"]);
    t.end();
});

test("Ordinal should spell 11, feminine", (t) => {
    t.deepEqual(Ordinal.spell(11, Gender.feminine), ["undécima", "oncena", "decimoprimera"]);
    t.end();
});

test("Ordinal should spell 17, masculine", (t) => {
    t.deepEqual(Ordinal.spell(17, Gender.masculine), ["décimo séptimo", "decimoséptimo"]);
    t.end();
});

test("Ordinal should spell 17, feminine", (t) => {
    t.deepEqual(Ordinal.spell(17, Gender.feminine), ["décima séptima", "decimoséptima"]);
    t.end();
});

test("Ordinal should spell 20, masculine", (t) => {
    t.deepEqual(Ordinal.spell(20, Gender.masculine), ["vigésimo", "veinteno"]);
    t.end();
});

test("Ordinal should spell 20, feminine", (t) => {
    t.deepEqual(Ordinal.spell(20, Gender.feminine), ["vigésima", "veintena"]);
    t.end();
});

test("Ordinal should spell 24, masculine", (t) => {
    t.deepEqual(Ordinal.spell(24, Gender.masculine), ["vigésimo cuarto", "vigesimocuarto"]);
    t.end();
});

test("Ordinal should spell 24, feminine", (t) => {
    t.deepEqual(Ordinal.spell(24, Gender.feminine), ["vigésima cuarta", "vigesimocuarta"]);
    t.end();
});

test("Ordinal should spell 26, masculine", (t) => {
    t.deepEqual(Ordinal.spell(26, Gender.masculine), ["vigésimo sexto", "vigesimosexto"]);
    t.end();
});

test("Ordinal should spell 26, feminine", (t) => {
    t.deepEqual(Ordinal.spell(26, Gender.feminine), ["vigésima sexta", "vigesimosexta"]);
    t.end();
});

test("Ordinal should spell 30, masculine", (t) => {
    t.deepEqual(Ordinal.spell(30, Gender.masculine), ["trigésimo"]);
    t.end();
});

test("Ordinal should spell 30, feminine", (t) => {
    t.deepEqual(Ordinal.spell(30, Gender.feminine), ["trigésima"]);
    t.end();
});

test("Ordinal should spell 31, masculine", (t) => {
    t.deepEqual(Ordinal.spell(31, Gender.masculine), ["trigésimo primero"]);
    t.end();
});

test("Ordinal should spell 31, feminine", (t) => {
    t.deepEqual(Ordinal.spell(31, Gender.feminine), ["trigésima primera"]);
    t.end();
});

test("Ordinal should spell 39, masculine", (t) => {
    t.deepEqual(Ordinal.spell(39, Gender.masculine), ["trigésimo noveno"]);
    t.end();
});

test("Ordinal should spell 39, feminine", (t) => {
    t.deepEqual(Ordinal.spell(39, Gender.feminine), ["trigésima novena"]);
    t.end();
});

test("Ordinal should spell 46, masculine", (t) => {
    t.deepEqual(Ordinal.spell(46, Gender.masculine), ["cuadragésimo sexto"]);
    t.end();
});

test("Ordinal should spell 46, feminine", (t) => {
    t.deepEqual(Ordinal.spell(46, Gender.feminine), ["cuadragésima sexta"]);
    t.end();
});

test("Ordinal should spell 55, masculine", (t) => {
    t.deepEqual(Ordinal.spell(55, Gender.masculine), ["quincuagésimo quinto"]);
    t.end();
});

test("Ordinal should spell 55, feminine", (t) => {
    t.deepEqual(Ordinal.spell(55, Gender.feminine), ["quincuagésima quinta"]);
    t.end();
});

test("Ordinal should spell 99, masculine", (t) => {
    t.deepEqual(Ordinal.spell(99, Gender.masculine), ["nonagésimo noveno"]);
    t.end();
});

test("Ordinal should spell 99, feminine", (t) => {
    t.deepEqual(Ordinal.spell(99, Gender.feminine), ["nonagésima novena"]);
    t.end();
});

test("Ordinal should spell 100, masculine", (t) => {
    t.deepEqual(Ordinal.spell(100, Gender.masculine), ["centésimo"]);
    t.end();
});

test("Ordinal should spell 100, feminine", (t) => {
    t.deepEqual(Ordinal.spell(100, Gender.feminine), ["centésima"]);
    t.end();
});

test("Ordinal should spell 101, masculine", (t) => {
    t.deepEqual(Ordinal.spell(101, Gender.masculine), ["centésimo primero"]);
    t.end();
});

test("Ordinal should spell 101, feminine", (t) => {
    t.deepEqual(Ordinal.spell(101, Gender.feminine), ["centésima primera"]);
    t.end();
});

test("Ordinal should spell 111, masculine", (t) => {
    t.deepEqual(Ordinal.spell(111, Gender.masculine), ["centésimo undécimo", "centésimo onceno", "centésimo decimoprimero"]);
    t.end();
});

test("Ordinal should spell 114, masculine", (t) => {
    t.deepEqual(Ordinal.spell(114, Gender.masculine), ["centésimo décimo cuarto", "centésimo decimocuarto"]);
    t.end();
});

test("Ordinal should spell 114, feminine", (t) => {
    t.deepEqual(Ordinal.spell(114, Gender.feminine), ["centésima décima cuarta", "centésima decimocuarta"]);
    t.end();
});

test("Ordinal should spell 200, masculine", (t) => {
    t.deepEqual(Ordinal.spell(200, Gender.masculine), ["ducentésimo"]);
    t.end();
});

test("Ordinal should spell 200, feminine", (t) => {
    t.deepEqual(Ordinal.spell(200, Gender.feminine), ["ducentésima"]);
    t.end();
});

test("Ordinal should spell 999, masculine", (t) => {
    t.deepEqual(Ordinal.spell(999, Gender.masculine), ["noningentésimo nonagésimo noveno"]);
    t.end();
});

test("Ordinal should spell 999, feminine", (t) => {
    t.deepEqual(Ordinal.spell(999, Gender.feminine), ["noningentésima nonagésima novena"]);
    t.end();
});

test("Ordinal should spell 1000, masculine", (t) => {
    t.deepEqual(Ordinal.spell(1000, Gender.masculine), ["milésimo"]);
    t.end();
});

test("Ordinal should spell 1000, feminine", (t) => {
    t.deepEqual(Ordinal.spell(1000, Gender.feminine), ["milésima"]);
    t.end();
});

test("Ordinal should spell 1111, masculine", (t) => {
    t.deepEqual(Ordinal.spell(1111, Gender.masculine),
        ["milésimo centésimo undécimo", "milésimo centésimo onceno", "milésimo centésimo decimoprimero"]);
    t.end();
});

test("Ordinal should spell 1114, masculine", (t) => {
    t.deepEqual(Ordinal.spell(1114, Gender.masculine), ["milésimo centésimo décimo cuarto", "milésimo centésimo decimocuarto"]);
    t.end();
});

test("Ordinal should spell 1114, feminine", (t) => {
    t.deepEqual(Ordinal.spell(1114, Gender.feminine), ["milésima centésima décima cuarta", "milésima centésima decimocuarta"]);
    t.end();
});

test("Ordinal should spell 2000, masculine", (t) => {
    t.deepEqual(Ordinal.spell(2000, Gender.masculine), ["dosmilésimo"]);
    t.end();
});

test("Ordinal should spell 2000, feminine", (t) => {
    t.deepEqual(Ordinal.spell(2000, Gender.feminine), ["dosmilésima"]);
    t.end();
});

test("Ordinal should spell 3512, masculine", (t) => {
    t.deepEqual(Ordinal.spell(3512, Gender.masculine),
        ["tresmilésimo quingentésimo duodécimo", "tresmilésimo quingentésimo doceno", "tresmilésimo quingentésimo decimosegundo"]);
    t.end();
});

test("Ordinal should spell 3512, feminine", (t) => {
    t.deepEqual(Ordinal.spell(3512, Gender.feminine),
        ["tresmilésima quingentésima duodécima", "tresmilésima quingentésima docena", "tresmilésima quingentésima decimosegunda"]);
    t.end();
});

test("Ordinal should spell 9999, masculine", (t) => {
    t.deepEqual(Ordinal.spell(9999, Gender.masculine), ["nuevemilésimo noningentésimo nonagésimo noveno"]);
    t.end();
});

test("Ordinal should spell 9999, feminine", (t) => {
    t.deepEqual(Ordinal.spell(9999, Gender.feminine), ["nuevemilésima noningentésima nonagésima novena"]);
    t.end();
});

test("Ordinal should spell 10000, masculine", (t) => {
    t.deepEqual(Ordinal.spell(10000, Gender.masculine), ["diezmilésimo"]);
    t.end();
});

test("Ordinal should spell 10000, feminine", (t) => {
    t.deepEqual(Ordinal.spell(10000, Gender.feminine), ["diezmilésima"]);
    //t.deepEqual(Ordinal.spell(33333, Gender.masculine), ['treinta y tresmilésimo tricentésimo trigésimo tercero']);
    t.end();
});
