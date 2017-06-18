import test from "tape";
import Time from "./time";

test("Time should spell one, 01:00", (t) => {
    t.deepEqual(Time.spell(1, 0), ["es la una"]);
    t.end();
});

test("Time should spell one, 01:01", (t) => {
    t.deepEqual(Time.spell(1, 1), ["es la una y uno"]);
    t.end();
});

test("Time should spell one, 01:03", (t) => {
    t.deepEqual(Time.spell(1, 3), ["es la una y tres"]);
    t.end();
});

test("Time should spell one, 01:59", (t) => {
    t.deepEqual(Time.spell(1, 59), ["es la una y cincuenta y nueve", "son las dos menos uno"]);
    t.end();
});

test("Time should spell two and up, 02:00", (t) => {
    t.deepEqual(Time.spell(2, 0), ["son las dos"]);
    t.end();
});

test("Time should spell two and up, 03:00", (t) => {
    t.deepEqual(Time.spell(3, 0), ["son las tres"]);
    t.end();
});

test("Time should spell two and up, 06:05", (t) => {
    t.deepEqual(Time.spell(6, 5), ["son las seis y cinco"]);
    t.end();
});

test("Time should spell two and up, 07:10", (t) => {
    t.deepEqual(Time.spell(7, 10), ["son las siete y diez"]);
    t.end();
});

test("Time should spell two and up, 11:19", (t) => {
    t.deepEqual(Time.spell(11, 19), ["son las once y diecinueve"]);
    t.end();
});

test("Time should spell two and up, 15:00", (t) => {
    t.deepEqual(Time.spell(15, 0), ["son las quince", "son las tres"]);
    t.end();
});

test("Time should spell two and up, 15:31", (t) => {
    t.deepEqual(Time.spell(15, 31),
        ["son las quince y treinta y uno", "son las tres y treinta y uno",
            "son las dieciséis menos veintinueve", "son las cuatro menos veintinueve"]);
    t.end();
});

test("Time should spell two and up, 04:51", (t) => {
    t.deepEqual(Time.spell(4, 51), ["son las cuatro y cincuenta y uno", "son las cinco menos nueve"]);
    t.end();
});

test("Time should spell two and up, 20:41", (t) => {
    t.deepEqual(Time.spell(20, 41),
        ["son las veinte y cuarenta y uno", "son las ocho y cuarenta y uno",
            "son las veintiuno menos diecinueve", "son las nueve menos diecinueve"]);
    t.end();
});

test("Time should spell cuarto, 01:15", (t) => {
    t.deepEqual(Time.spell(1, 15), ["es la una y quince", "es la una y cuarto"]);
    t.end();
});

test("Time should spell cuarto, 13:15", (t) => {
    t.deepEqual(Time.spell(13, 15), ["son las trece y quince", "son las trece y cuarto", "es la una y quince", "es la una y cuarto"]);
    t.end();
});

test("Time should spell cuarto, 15:15", (t) => {
    t.deepEqual(Time.spell(15, 15),
        ["son las quince y quince", "son las quince y cuarto", "son las tres y quince", "son las tres y cuarto"]);
    t.end();
});

test("Time should spell media, 01:30", (t) => {
    t.deepEqual(Time.spell(1, 30), ["es la una y treinta", "es la una y media"]);
    t.end();
});

test("Time should spell media, 04:30", (t) => {
    t.deepEqual(Time.spell(4, 30), ["son las cuatro y treinta", "son las cuatro y media"]);
    t.end();
});

test("Time should spell menos, 12:50", (t) => {
    t.deepEqual(Time.spell(12, 50),
        ["son las doce y cincuenta", "es la mediodía y cincuenta", "son las trece menos diez", "es la una menos diez"]);
    t.end();
});

test("Time should spell menos, 04:55", (t) => {
    t.deepEqual(Time.spell(4, 55), ["son las cuatro y cincuenta y cinco", "son las cinco menos cinco"]);
    t.end();
});

test("Time should spell menos, 09:40", (t) => {
    t.deepEqual(Time.spell(9, 40), ["son las nueve y cuarenta", "son las diez menos veinte"]); // 08, 09 are illegal literals...
    t.end();
});

test("Time should spell menos, 07:45", (t) => {
    t.deepEqual(Time.spell(7, 45), ["son las siete y cuarenta y cinco", "son las ocho menos quince", "son las ocho menos cuarto"]);
    t.end();
});

test("Time should spell menos, 23:45", (t) => {
    t.deepEqual(Time.spell(23, 45),
        ["son las veintitrés y cuarenta y cinco", "son las once y cuarenta y cinco", "es la medianoche menos quince",
            "es la medianoche menos cuarto", "son las doce menos quince", "son las doce menos cuarto"]);
    t.end();
});

test("Time should spell menos, 23:59", (t) => {
    t.deepEqual(Time.spell(23, 59),
        ["son las veintitrés y cincuenta y nueve", "son las once y cincuenta y nueve",
            "es la medianoche menos uno", "son las doce menos uno"]);
    t.end();
});

test("Time should spell noon, 12:00", (t) => {
    t.deepEqual(Time.spell(12, 0), ["son las doce", "es la mediodía"]);
    t.end();
});

test("Time should spell noon, 04:12", (t) => {
    t.deepEqual(Time.spell(4, 12), ["son las cuatro y doce"]);
    t.end();
});

test("Time should spell midnight, 00:00", (t) => {
    t.deepEqual(Time.spell(0, 0), ["es la medianoche", "son las doce"]);
    t.end();
});

test("Time should spell midnight, 00:10", (t) => {
    t.deepEqual(Time.spell(0, 10), ["es la medianoche y diez", "son las doce y diez"]);
    t.end();
});

test("Time should spell twenty four hour clock, 13:35", (t) => {
    t.deepEqual(Time.spell(13, 35),
        ["son las trece y treinta y cinco", "es la una y treinta y cinco",
            "son las catorce menos veinticinco", "son las dos menos veinticinco"]);
    t.end();
});

test("Time should spell twenty four hour clock, 22:10", (t) => {
    t.deepEqual(Time.spell(22, 10), ["son las veintidós y diez", "son las diez y diez"]);
    t.end();
});
