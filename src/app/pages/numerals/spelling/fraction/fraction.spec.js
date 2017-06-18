import test from "tape";
import Fraction from "./fraction";

test("Fraction should spell singular, 1/2", (t) => {
    t.deepEqual(Fraction.spell(1, 2), ["un medio"]);
    t.end();
});

test("Fraction should spell singular, 1/3", (t) => {
    t.deepEqual(Fraction.spell(1, 3), ["un tercio"]);
    t.end();
});

test("Fraction should spell singular, 1/4", (t) => {
    t.deepEqual(Fraction.spell(1, 4), ["un cuarto"]);
    t.end();
});

test("Fraction should spell singular, 1/9", (t) => {
    t.deepEqual(Fraction.spell(1, 9), ["un noveno"]);
    t.end();
});

test("Fraction should spell singular, 1/10", (t) => {
    t.deepEqual(Fraction.spell(1, 10), ["un décimo"]);
    t.end();
});

test("Fraction should spell plural, 2/4", (t) => {
    t.deepEqual(Fraction.spell(2, 4), ["dos cuartos"]);
    t.end();
});

test("Fraction should spell plural, 3/3", (t) => {
    t.deepEqual(Fraction.spell(3, 3), ["tres tercios"]);
    t.end();
});

test("Fraction should spell plural, 4/2", (t) => {
    t.deepEqual(Fraction.spell(4, 2), ["cuatro medios"]);
    t.end();
});

test("Fraction should spell plural, 5/7", (t) => {
    t.deepEqual(Fraction.spell(5, 7), ["cinco séptimos"]);
    t.end();
});

test("Fraction should spell plural, 11/5", (t) => {
    t.deepEqual(Fraction.spell(11, 5), ["once quintos"]);
    t.end();
});

test("Fraction should spell avo singular, 1/11", (t) => {
    t.deepEqual(Fraction.spell(1, 11), ["un onceavo", "un onzavo"]);
    t.end();
});

test("Fraction should spell avo singular, 1/15", (t) => {
    t.deepEqual(Fraction.spell(1, 15), ["un quinceavo", "un quinzavo"]);
    t.end();
});

test("Fraction should spell avo singular, 1/16", (t) => {
    t.deepEqual(Fraction.spell(1, 16), ["un dieciseisavo"]);
    t.end();
});

test("Fraction should spell avo singular, 1/17", (t) => {
    t.deepEqual(Fraction.spell(1, 17), ["un diecisieteavo"]);
    t.end();
});

test("Fraction should spell avo singular, 1/18", (t) => {
    t.deepEqual(Fraction.spell(1, 18), ["un dieciochavo"]);
    t.end();
});

test("Fraction should spell avo singular, 1/19", (t) => {
    t.deepEqual(Fraction.spell(1, 19), ["un diecinueveavo"]);
    t.end();
});

test("Fraction should spell avo singular, 1/30", (t) => {
    t.deepEqual(Fraction.spell(1, 30), ["un treintavo"]);
    t.end();
});

test("Fraction should spell avo singular, 1/40", (t) => {
    t.deepEqual(Fraction.spell(1, 40), ["un cuarentavo"]);
    t.end();
});

test("Fraction should spell avo singular, 1/56", (t) => {
    t.deepEqual(Fraction.spell(1, 56), ["un cincuenta y seis avo", "un cincuentaiseisavo"]);
    t.end();
});

test("Fraction should spell avo singular, 1/60", (t) => {
    t.deepEqual(Fraction.spell(1, 60), ["un sesentavo"]);
    t.end();
});

test("Fraction should spell avo singular, 1/100", (t) => {
    t.deepEqual(Fraction.spell(1, 100), ["un centavo"]);
    t.end();
});

test("Fraction should spell avo plural, 2/31", (t) => {
    t.deepEqual(Fraction.spell(2, 31), ["dos treinta y un avos", "dos treintaiunavos"]);
    t.end();
});

test("Fraction should spell avo plural, 3/41", (t) => {
    t.deepEqual(Fraction.spell(3, 41), ["tres cuarenta y un avos", "tres cuarentaiunavos"]);
    t.end();
});

test("Fraction should spell avo plural, 2/19", (t) => {
    t.deepEqual(Fraction.spell(2, 19), ["dos diecinueveavos"]);
    t.end();
});

test("Fraction should spell avo plural, 2/578", (t) => {
    t.deepEqual(Fraction.spell(2, 578), ["dos quinientos setenta y ocho avos", "dos quinientossetentaiochoavos"]);
    t.end();
});

test("Fraction should spell avo plural, 21/40", (t) => {
    t.deepEqual(Fraction.spell(21, 40), ["veintiún cuarentavos"]);
    t.end();
});

test("Fraction should spell avo plural, 22/15", (t) => {
    t.deepEqual(Fraction.spell(22, 15), ["veintidós quinceavos", "veintidós quinzavos"]);
    t.end();
});

test("Fraction should spell avo plural, 37/30", (t) => {
    t.deepEqual(Fraction.spell(37, 30), ["treinta y siete treintavos"]);
    t.end();
});

test("Fraction should spell avo plural, 99/100", (t) => {
    t.deepEqual(Fraction.spell(99, 100), ["noventa y nueve centavos"]);
    t.end();
});
