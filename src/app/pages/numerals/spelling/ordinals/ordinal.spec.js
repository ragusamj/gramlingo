import test from "tape";
import OrdinalSign from "./ordinal-sign";
import Ordinal from "./ordinal";

test("Ordinal should spell 1 - 1000 without crashing", (t) => {
    for(let i = 1; i <= 1000; i++) {
        Ordinal.spell(i, OrdinalSign.feminine);
    }
    t.end();
});

test("Ordinal should spell 1, neuter", (t) => {
    t.deepEqual(Ordinal.spell(1, OrdinalSign.neuter), ["primer"]);
    t.end();
});

test("Ordinal should spell 1, masculine", (t) => {
    t.deepEqual(Ordinal.spell(1, OrdinalSign.masculine), ["primero"]);
    t.end();
});

test("Ordinal should spell 1, feminine", (t) => {
    t.deepEqual(Ordinal.spell(1, OrdinalSign.feminine), ["primera"]);
    t.end();
});

test("Ordinal should spell 2, masculine", (t) => {
    t.deepEqual(Ordinal.spell(2, OrdinalSign.masculine), ["segundo"]);
    t.end();
});

test("Ordinal should spell 2, feminine", (t) => {
    t.deepEqual(Ordinal.spell(2, OrdinalSign.feminine), ["segunda"]);
    t.end();
});

test("Ordinal should spell 3, neuter", (t) => {
    t.deepEqual(Ordinal.spell(3, OrdinalSign.neuter), ["tercer"]);
    t.end();
});

test("Ordinal should spell 3, masculine", (t) => {
    t.deepEqual(Ordinal.spell(3, OrdinalSign.masculine), ["tercero"]);
    t.end();
});

test("Ordinal should spell 3, feminine", (t) => {
    t.deepEqual(Ordinal.spell(3, OrdinalSign.feminine), ["tercera"]);
    t.end();
});

test("Ordinal should spell 5, masculine", (t) => {
    t.deepEqual(Ordinal.spell(5, OrdinalSign.masculine), ["quinto"]);
    t.end();
});

test("Ordinal should spell 5, feminine", (t) => {
    t.deepEqual(Ordinal.spell(5, OrdinalSign.feminine), ["quinta"]);
    t.end();
});

test("Ordinal should spell 9, masculine", (t) => {
    t.deepEqual(Ordinal.spell(9, OrdinalSign.masculine), ["noveno"]);
    t.end();
});

test("Ordinal should spell 9, feminine", (t) => {
    t.deepEqual(Ordinal.spell(9, OrdinalSign.feminine), ["novena"]);
    t.end();
});

test("Ordinal should spell 11, masculine", (t) => {
    t.deepEqual(Ordinal.spell(11, OrdinalSign.masculine), ["undécimo", "onceno", "decimoprimero"]);
    t.end();
});

test("Ordinal should spell 11, feminine", (t) => {
    t.deepEqual(Ordinal.spell(11, OrdinalSign.feminine), ["undécima", "oncena", "decimoprimera"]);
    t.end();
});

test("Ordinal should spell 17, masculine", (t) => {
    t.deepEqual(Ordinal.spell(17, OrdinalSign.masculine), ["décimo séptimo", "decimoséptimo"]);
    t.end();
});

test("Ordinal should spell 17, feminine", (t) => {
    t.deepEqual(Ordinal.spell(17, OrdinalSign.feminine), ["décima séptima", "decimoséptima"]);
    t.end();
});

test("Ordinal should spell 20, masculine", (t) => {
    t.deepEqual(Ordinal.spell(20, OrdinalSign.masculine), ["vigésimo", "veinteno"]);
    t.end();
});

test("Ordinal should spell 20, feminine", (t) => {
    t.deepEqual(Ordinal.spell(20, OrdinalSign.feminine), ["vigésima", "veintena"]);
    t.end();
});

test("Ordinal should spell 24, masculine", (t) => {
    t.deepEqual(Ordinal.spell(24, OrdinalSign.masculine), ["vigésimo cuarto", "vigesimocuarto"]);
    t.end();
});

test("Ordinal should spell 24, feminine", (t) => {
    t.deepEqual(Ordinal.spell(24, OrdinalSign.feminine), ["vigésima cuarta", "vigesimocuarta"]);
    t.end();
});

test("Ordinal should spell 26, masculine", (t) => {
    t.deepEqual(Ordinal.spell(26, OrdinalSign.masculine), ["vigésimo sexto", "vigesimosexto"]);
    t.end();
});

test("Ordinal should spell 26, feminine", (t) => {
    t.deepEqual(Ordinal.spell(26, OrdinalSign.feminine), ["vigésima sexta", "vigesimosexta"]);
    t.end();
});

test("Ordinal should spell 30, masculine", (t) => {
    t.deepEqual(Ordinal.spell(30, OrdinalSign.masculine), ["trigésimo"]);
    t.end();
});

test("Ordinal should spell 30, feminine", (t) => {
    t.deepEqual(Ordinal.spell(30, OrdinalSign.feminine), ["trigésima"]);
    t.end();
});

test("Ordinal should spell 31, masculine", (t) => {
    t.deepEqual(Ordinal.spell(31, OrdinalSign.masculine), ["trigésimo primero"]);
    t.end();
});

test("Ordinal should spell 31, feminine", (t) => {
    t.deepEqual(Ordinal.spell(31, OrdinalSign.feminine), ["trigésima primera"]);
    t.end();
});

test("Ordinal should spell 39, masculine", (t) => {
    t.deepEqual(Ordinal.spell(39, OrdinalSign.masculine), ["trigésimo noveno"]);
    t.end();
});

test("Ordinal should spell 39, feminine", (t) => {
    t.deepEqual(Ordinal.spell(39, OrdinalSign.feminine), ["trigésima novena"]);
    t.end();
});

test("Ordinal should spell 46, masculine", (t) => {
    t.deepEqual(Ordinal.spell(46, OrdinalSign.masculine), ["cuadragésimo sexto"]);
    t.end();
});

test("Ordinal should spell 46, feminine", (t) => {
    t.deepEqual(Ordinal.spell(46, OrdinalSign.feminine), ["cuadragésima sexta"]);
    t.end();
});

test("Ordinal should spell 55, masculine", (t) => {
    t.deepEqual(Ordinal.spell(55, OrdinalSign.masculine), ["quincuagésimo quinto"]);
    t.end();
});

test("Ordinal should spell 55, feminine", (t) => {
    t.deepEqual(Ordinal.spell(55, OrdinalSign.feminine), ["quincuagésima quinta"]);
    t.end();
});

test("Ordinal should spell 60, masculine", (t) => {
    t.deepEqual(Ordinal.spell(60, OrdinalSign.masculine), ["sexagésimo"]);
    t.end();
});

test("Ordinal should spell 99, masculine", (t) => {
    t.deepEqual(Ordinal.spell(99, OrdinalSign.masculine), ["nonagésimo noveno"]);
    t.end();
});

test("Ordinal should spell 99, feminine", (t) => {
    t.deepEqual(Ordinal.spell(99, OrdinalSign.feminine), ["nonagésima novena"]);
    t.end();
});

test("Ordinal should spell 100, masculine", (t) => {
    t.deepEqual(Ordinal.spell(100, OrdinalSign.masculine), ["centésimo"]);
    t.end();
});

test("Ordinal should spell 100, feminine", (t) => {
    t.deepEqual(Ordinal.spell(100, OrdinalSign.feminine), ["centésima"]);
    t.end();
});

test("Ordinal should spell 101, masculine", (t) => {
    t.deepEqual(Ordinal.spell(101, OrdinalSign.masculine), ["centésimo primero"]);
    t.end();
});

test("Ordinal should spell 101, feminine", (t) => {
    t.deepEqual(Ordinal.spell(101, OrdinalSign.feminine), ["centésima primera"]);
    t.end();
});

test("Ordinal should spell 111, masculine", (t) => {
    t.deepEqual(Ordinal.spell(111, OrdinalSign.masculine), ["centésimo undécimo", "centésimo onceno", "centésimo decimoprimero"]);
    t.end();
});

test("Ordinal should spell 114, masculine", (t) => {
    t.deepEqual(Ordinal.spell(114, OrdinalSign.masculine), ["centésimo décimo cuarto", "centésimo decimocuarto"]);
    t.end();
});

test("Ordinal should spell 114, feminine", (t) => {
    t.deepEqual(Ordinal.spell(114, OrdinalSign.feminine), ["centésima décima cuarta", "centésima decimocuarta"]);
    t.end();
});

test("Ordinal should spell 200, masculine", (t) => {
    t.deepEqual(Ordinal.spell(200, OrdinalSign.masculine), ["ducentésimo"]);
    t.end();
});

test("Ordinal should spell 200, feminine", (t) => {
    t.deepEqual(Ordinal.spell(200, OrdinalSign.feminine), ["ducentésima"]);
    t.end();
});

test("Ordinal should spell 550, feminine", (t) => {
    t.deepEqual(Ordinal.spell(550, OrdinalSign.feminine), ["quingentésima quincuagésima"]);
    t.end();
});

test("Ordinal should spell 999, masculine", (t) => {
    t.deepEqual(Ordinal.spell(999, OrdinalSign.masculine), ["noningentésimo nonagésimo noveno"]);
    t.end();
});

test("Ordinal should spell 999, feminine", (t) => {
    t.deepEqual(Ordinal.spell(999, OrdinalSign.feminine), ["noningentésima nonagésima novena"]);
    t.end();
});

test("Ordinal should spell 1000, masculine", (t) => {
    t.deepEqual(Ordinal.spell(1000, OrdinalSign.masculine), ["milésimo"]);
    t.end();
});

test("Ordinal should spell 1000, feminine", (t) => {
    t.deepEqual(Ordinal.spell(1000, OrdinalSign.feminine), ["milésima"]);
    t.end();
});

test("Ordinal should spell 1111, masculine", (t) => {
    t.deepEqual(Ordinal.spell(1111, OrdinalSign.masculine),
        ["milésimo centésimo undécimo", "milésimo centésimo onceno", "milésimo centésimo decimoprimero"]);
    t.end();
});

test("Ordinal should spell 1114, masculine", (t) => {
    t.deepEqual(Ordinal.spell(1114, OrdinalSign.masculine), ["milésimo centésimo décimo cuarto", "milésimo centésimo decimocuarto"]);
    t.end();
});

test("Ordinal should spell 1114, feminine", (t) => {
    t.deepEqual(Ordinal.spell(1114, OrdinalSign.feminine), ["milésima centésima décima cuarta", "milésima centésima decimocuarta"]);
    t.end();
});

test("Ordinal should spell 2000, masculine", (t) => {
    t.deepEqual(Ordinal.spell(2000, OrdinalSign.masculine), ["dosmilésimo"]);
    t.end();
});

test("Ordinal should spell 2000, feminine", (t) => {
    t.deepEqual(Ordinal.spell(2000, OrdinalSign.feminine), ["dosmilésima"]);
    t.end();
});

test("Ordinal should spell 3512, masculine", (t) => {
    t.deepEqual(Ordinal.spell(3512, OrdinalSign.masculine),
        ["tresmilésimo quingentésimo duodécimo", "tresmilésimo quingentésimo doceno", "tresmilésimo quingentésimo decimosegundo"]);
    t.end();
});

test("Ordinal should spell 3512, feminine", (t) => {
    t.deepEqual(Ordinal.spell(3512, OrdinalSign.feminine),
        ["tresmilésima quingentésima duodécima", "tresmilésima quingentésima docena", "tresmilésima quingentésima decimosegunda"]);
    t.end();
});

test("Ordinal should spell 9999, masculine", (t) => {
    t.deepEqual(Ordinal.spell(9999, OrdinalSign.masculine), ["nuevemilésimo noningentésimo nonagésimo noveno"]);
    t.end();
});

test("Ordinal should spell 9999, feminine", (t) => {
    t.deepEqual(Ordinal.spell(9999, OrdinalSign.feminine), ["nuevemilésima noningentésima nonagésima novena"]);
    t.end();
});

test("Ordinal should spell 10000, masculine", (t) => {
    t.deepEqual(Ordinal.spell(10000, OrdinalSign.masculine), ["diezmilésimo"]);
    t.end();
});

test("Ordinal should spell 10000, feminine", (t) => {
    t.deepEqual(Ordinal.spell(10000, OrdinalSign.feminine), ["diezmilésima"]);
    //t.deepEqual(Ordinal.spell(33333, Gender.masculine), ['treinta y tresmilésimo tricentésimo trigésimo tercero']);
    t.end();
});
