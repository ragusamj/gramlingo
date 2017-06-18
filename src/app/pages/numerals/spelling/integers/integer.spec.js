import test from "tape";
import Integer from "./integer";

test("Integer should spell zero", (t) => {
    t.equal(Integer.spell(0), "cero");
    t.end();
});

test("Integer should spell 1", (t) => {
    t.equal(Integer.spell(1), "uno");
    t.end();
});

test("Integer should spell 5", (t) => {
    t.equal(Integer.spell(5), "cinco");
    t.end();
});

test("Integer should spell 12", (t) => {
    t.equal(Integer.spell(12), "doce");
    t.end();
});

test("Integer should spell 18", (t) => {
    t.equal(Integer.spell(18), "dieciocho");
    t.end();
});

test("Integer should spell 23", (t) => {
    t.equal(Integer.spell(23), "veintitrés");
    t.end();
});

test("Integer should spell 33", (t) => {
    t.equal(Integer.spell(33), "treinta y tres");
    t.end();
});

test("Integer should spell 56", (t) => {
    t.equal(Integer.spell(56), "cincuenta y seis");
    t.end();
});

test("Integer should spell 60", (t) => {
    t.equal(Integer.spell(60), "sesenta");
    t.end();
});

test("Integer should spell 90", (t) => {
    t.equal(Integer.spell(90), "noventa");
    t.end();
});

test("Integer should spell 100", (t) => {
    t.equal(Integer.spell(100), "cien");
    t.end();
});

test("Integer should spell 101", (t) => {
    t.equal(Integer.spell(101), "ciento uno");
    t.end();
});

test("Integer should spell 123", (t) => {
    t.equal(Integer.spell(123), "ciento veintitrés");
    t.end();
});

test("Integer should spell 130", (t) => {
    t.equal(Integer.spell(130), "ciento treinta");
    t.end();
});

test("Integer should spell 143", (t) => {
    t.equal(Integer.spell(143), "ciento cuarenta y tres");
    t.end();
});

test("Integer should spell 200", (t) => {
    t.equal(Integer.spell(200), "doscientos");
    t.end();
});

test("Integer should spell 201", (t) => {
    t.equal(Integer.spell(201), "doscientos uno");
    t.end();
});

test("Integer should spell 209", (t) => {
    t.equal(Integer.spell(209), "doscientos nueve");
    t.end();
});

test("Integer should spell 300", (t) => {
    t.equal(Integer.spell(300), "trescientos");
    t.end();
});

test("Integer should spell 500", (t) => {
    t.equal(Integer.spell(500), "quinientos");
    t.end();
});

test("Integer should spell 999", (t) => {
    t.equal(Integer.spell(999), "novecientos noventa y nueve");
    t.end();
});

test("Integer should spell 1000", (t) => {
    t.equal(Integer.spell(1000), "mil");
    t.end();
});

test("Integer should spell 1001", (t) => {
    t.equal(Integer.spell(1001), "mil uno");
    t.end();
});

test("Integer should spell 1733", (t) => {
    t.equal(Integer.spell(1733), "mil setecientos treinta y tres");
    t.end();
});

test("Integer should spell 1857", (t) => {
    t.equal(Integer.spell(1857), "mil ochocientos cincuenta y siete");
    t.end();
});

test("Integer should spell 1901", (t) => {
    t.equal(Integer.spell(1901), "mil novecientos uno");
    t.end();
});

test("Integer should spell 1925", (t) => {
    t.equal(Integer.spell(1925), "mil novecientos veinticinco");
    t.end();
});

test("Integer should spell 1983", (t) => {
    t.equal(Integer.spell(1983), "mil novecientos ochenta y tres");
    t.end();
});

test("Integer should spell 1999", (t) => {
    t.equal(Integer.spell(1999), "mil novecientos noventa y nueve");
    t.end();
});

test("Integer should spell 2011", (t) => {
    t.equal(Integer.spell(2011), "dos mil once");
    t.end();
});

test("Integer should spell 2013", (t) => {
    t.equal(Integer.spell(2013), "dos mil trece");
    t.end();
});

test("Integer should spell 5555", (t) => {
    t.equal(Integer.spell(5555), "cinco mil quinientos cincuenta y cinco");
    t.end();
});

test("Integer should spell 9999", (t) => {
    t.equal(Integer.spell(9999), "nueve mil novecientos noventa y nueve");
    t.end();
});

test("Integer should spell 10000", (t) => {
    t.equal(Integer.spell(10000), "diez mil");
    t.end();
});

test("Integer should spell 10001", (t) => {
    t.equal(Integer.spell(10001), "diez mil uno");
    t.end();
});

test("Integer should spell 20000", (t) => {
    t.equal(Integer.spell(20000), "veinte mil");
    t.end();
});

test("Integer should spell 32795", (t) => {
    t.equal(Integer.spell(32795), "treinta y dos mil setecientos noventa y cinco");
    t.end();
});

test("Integer should spell 77707", (t) => {
    t.equal(Integer.spell(77707), "setenta y siete mil setecientos siete");
    t.end();
});

test("Integer should spell 88808", (t) => {
    t.equal(Integer.spell(88808), "ochenta y ocho mil ochocientos ocho");
    t.end();
});

test("Integer should spell 98209", (t) => {
    t.equal(Integer.spell(98209), "noventa y ocho mil doscientos nueve");
    t.end();
});

test("Integer should spell 99999", (t) => {
    t.equal(Integer.spell(99999), "noventa y nueve mil novecientos noventa y nueve");
    t.end();
});

test("Integer should spell 100000", (t) => {
    t.equal(Integer.spell(100000), "ciento mil");
    t.end();
});

test("Integer should spell 123456", (t) => {
    t.equal(Integer.spell(123456), "ciento veintitrés mil cuatrocientos cincuenta y seis");
    t.end();
});

test("Integer should spell 300001", (t) => {
    t.equal(Integer.spell(300001), "trescientos mil uno");
    t.end();
});

test("Integer should spell 999999", (t) => {
    t.equal(Integer.spell(999999), "novecientos noventa y nueve mil novecientos noventa y nueve");
    t.end();
});

test("Integer should spell 1200001", (t) => {
    t.equal(Integer.spell(1200001), "un millón doscientos mil uno");
    t.end();
});

test("Integer should spell 1234567", (t) => {
    t.equal(Integer.spell(1234567), "un millón doscientos treinta y cuatro mil quinientos sesenta y siete");
    t.end();
});

test("Integer should spell 3550000", (t) => {
    t.equal(Integer.spell(3550000), "tres millones quinientos cincuenta mil");
    t.end();
});

test("Integer should spell 7470000", (t) => {
    t.equal(Integer.spell(7470000), "siete millones cuatrocientos setenta mil");
    t.end();
});

test("Integer should spell 21000000", (t) => {
    t.equal(Integer.spell(21000000), "veintiún millones");
    t.end();
});

test("Integer should spell 31000000", (t) => {
    t.equal(Integer.spell(31000000), "treinta y un millones");
    t.end();
});
test("Integer should spell 16000000", (t) => {
    t.equal(Integer.spell(16000000), "dieciséis millones");
    t.end();
});

test("Integer should spell 70000000", (t) => {
    t.equal(Integer.spell(70000000), "setenta millones");
    t.end();
});

test("Integer should spell 75000000", (t) => {
    t.equal(Integer.spell(75000000), "setenta y cinco millones");
    t.end();
});

test("Integer should spell 101000000", (t) => {
    t.equal(Integer.spell(101000000), "ciento un millones");
    t.end();
});

test("Integer should spell 131000000", (t) => {
    t.equal(Integer.spell(131000000), "ciento treinta y un millones");
    t.end();
});

test("Integer should spell 200000000", (t) => {
    t.equal(Integer.spell(200000000), "doscientos millones");
    t.end();
});

test("Integer should spell 264000000", (t) => {
    t.equal(Integer.spell(264000000), "doscientos sesenta y cuatro millones");
    t.end();
});

test("Integer should spell 300000000", (t) => {
    t.equal(Integer.spell(300000000), "trescientos millones");
    t.end();
});

test("Integer should spell 877000000", (t) => {
    t.equal(Integer.spell(877000000), "ochocientos setenta y siete millones");
    t.end();
});

test("Integer should spell 999999999", (t) => {
    t.equal(Integer.spell(999999999), "novecientos noventa y nueve millones novecientos noventa y nueve mil novecientos noventa y nueve");
    t.end();
});

test("Integer should spell one billion", (t) => {
    t.equal(Integer.spell(1000000000), "mil millones");
    t.end();
});
