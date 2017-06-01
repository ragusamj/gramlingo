import test from "tape";
import PhoneticIndexer from "./phonetic-indexer";

const indexer = new PhoneticIndexer();

test("PhoneticIndexer should index ^A", (t) => {
    t.deepEqual(indexer.index("andar"), ["ANTR"]);
    t.end();
});

test("PhoneticIndexer should index ^Á", (t) => {
    t.deepEqual(indexer.index("árbol"), ["ARBL"]);
    t.end();
});

test("PhoneticIndexer should index *Á", (t) => {
    t.deepEqual(indexer.index("fácil"), ["FSL"]);
    t.end();
});

test("PhoneticIndexer should index ^E'", (t) => {
    t.deepEqual(indexer.index("estar"), ["ASTR", "ATR"]);
    t.end();
});

test("PhoneticIndexer should index ^É'", (t) => {
    t.deepEqual(indexer.index("ébano"), ["ABN"]);
    t.end();
});

test("PhoneticIndexer should index *É'", (t) => {
    t.deepEqual(indexer.index("bebé"), ["BB"]);
    t.end();
});

test("PhoneticIndexer should index ^I", (t) => {
    t.deepEqual(indexer.index("ir"), ["AR"]);
    t.end();
});

test("PhoneticIndexer should index ^Í", (t) => {
    t.deepEqual(indexer.index("ídolo"), ["ATL"]);
    t.end();
});

test("PhoneticIndexer should index *Í", (t) => {
    t.deepEqual(indexer.index("latín"), ["LTN"]);
    t.end();
});

test("PhoneticIndexer should index ^O", (t) => {
    t.deepEqual(indexer.index("ofrecer"), ["AFRSR"]);
    t.end();
});

test("PhoneticIndexer should index ^Ó", (t) => {
    t.deepEqual(indexer.index("óleo"), ["AL"]);
    t.end();
});

test("PhoneticIndexer should index *Ó", (t) => {
    t.deepEqual(indexer.index("región"), ["RXN"]);
    t.end();
});

test("PhoneticIndexer should index ^U", (t) => {
    t.deepEqual(indexer.index("unir"), ["ANR"]);
    t.end();
});

test("PhoneticIndexer should index ^Ú", (t) => {
    t.deepEqual(indexer.index("último"), ["ALTM"]);
    t.end();
});

test("PhoneticIndexer should index ^Ü", (t) => {
    t.deepEqual(indexer.index("unir"), ["ANR"]);
    t.end();
});

test("PhoneticIndexer should index B", (t) => {
    t.deepEqual(indexer.index("beber"), ["BBR"]);
    t.end();
});

test("PhoneticIndexer should index ^CA", (t) => {
    t.deepEqual(indexer.index("caer"), ["KR"]);
    t.end();
});

test("PhoneticIndexer should index ^CO", (t) => {
    t.deepEqual(indexer.index("cocer"), ["KSR"]);
    t.end();
});

test("PhoneticIndexer should index ^CU", (t) => {
    t.deepEqual(indexer.index("cumplir"), ["KMPLR"]);
    t.end();
});

test("PhoneticIndexer should index *CU", (t) => {
    t.deepEqual(indexer.index("acudir"), ["AKTR"]);
    t.end();
});

test("PhoneticIndexer should index ^CE", (t) => {
    t.deepEqual(indexer.index("cerrar"), ["SRR"]);
    t.end();
});

test("PhoneticIndexer should index *CE", (t) => {
    t.deepEqual(indexer.index("hacer"), ["ASR"]);
    t.end();
});

test("PhoneticIndexer should index ^CI", (t) => {
    t.deepEqual(indexer.index("circular"), ["SRKLR"]);
    t.end();
});

test("PhoneticIndexer should index CH", (t) => {
    t.deepEqual(indexer.index("hache"), ["AX"]);
    t.end();
});

test("PhoneticIndexer should index CHO", (t) => {
    t.deepEqual(indexer.index("hecho"), ["AX"]);
    t.end();
});

test("PhoneticIndexer should index D", (t) => {
    t.deepEqual(indexer.index("dedicar"), ["TTKR"]);
    t.end();
});

test("PhoneticIndexer should index F", (t) => {
    t.deepEqual(indexer.index("frenar"), ["FRNR"]);
    t.end();
});

test("PhoneticIndexer should index GA", (t) => {
    t.deepEqual(indexer.index("ganar"), ["GNR"]);
    t.end();
});

test("PhoneticIndexer should index GO", (t) => {
    t.deepEqual(indexer.index("gozar"), ["GSR"]);
    t.end();
});

test("PhoneticIndexer should index GU", (t) => {
    t.deepEqual(indexer.index("gustar"), ["GSTR", "GTR"]);
    t.end();
});

test("PhoneticIndexer should index GE", (t) => {
    t.deepEqual(indexer.index("coger"), ["KXR"]);
    t.end();
});

test("PhoneticIndexer should index GI", (t) => {
    t.deepEqual(indexer.index("girar"), ["XRR"]);
    t.end();
});

test("PhoneticIndexer should index ^GÜ", (t) => {
    t.deepEqual(indexer.index("güisqui"), ["ASK"]);
    t.end();
});

test("PhoneticIndexer should index *GÜ", (t) => {
    t.deepEqual(indexer.index("pingüino"), ["PNGN"]);
    t.end();
});

test("PhoneticIndexer should index ^HA", (t) => {
    t.deepEqual(indexer.index("haber"), ["ABR"]);
    t.end();
});

test("PhoneticIndexer should index *HA", (t) => {
    t.deepEqual(indexer.index("deshacer"), ["TSSR"]);
    t.end();
});

test("PhoneticIndexer should index J", (t) => {
    t.deepEqual(indexer.index("jugar"), ["XGR"]);
    t.end();
});

test("PhoneticIndexer should index K", (t) => {
    t.deepEqual(indexer.index("kiwi"), ["KW"]);
    t.end();
});

test("PhoneticIndexer should index L", (t) => {
    t.deepEqual(indexer.index("leer"), ["LR"]);
    t.end();
});

test("PhoneticIndexer should index M", (t) => {
    t.deepEqual(indexer.index("madrugar"), ["MTRGR"]);
    t.end();
});

test("PhoneticIndexer should index N", (t) => {
    t.deepEqual(indexer.index("navegar"), ["NBGR"]);
    t.end();
});

test("PhoneticIndexer should index Ñ", (t) => {
    t.deepEqual(indexer.index("bañar"), ["BNR"]);
    t.end();
});

test("PhoneticIndexer should index P", (t) => {
    t.deepEqual(indexer.index("parar"), ["PRR"]);
    t.end();
});

test("PhoneticIndexer should index Q", (t) => {
    t.deepEqual(indexer.index("quedar"), ["KTR"]);
    t.end();
});

test("PhoneticIndexer should index R", (t) => {
    t.deepEqual(indexer.index("regalar"), ["RGLR"]);
    t.end();
});

test("PhoneticIndexer should index S", (t) => {
    t.deepEqual(indexer.index("saber"), ["SBR"]);
    t.end();
});

test("PhoneticIndexer should index T", (t) => {
    t.deepEqual(indexer.index("tener"), ["TNR"]);
    t.end();
});

test("PhoneticIndexer should index ZA", (t) => {
    t.deepEqual(indexer.index("cazar"), ["KSR"]);
    t.end();
});

test("PhoneticIndexer should index ZU", (t) => {
    t.deepEqual(indexer.index("zumbar"), ["SMBR"]);
    t.end();
});

test("PhoneticIndexer should index X", (t) => {
    t.deepEqual(indexer.index("examinar"), ["AKSMNR"]);
    t.end();
});

test("PhoneticIndexer should index double consonants CC", (t) => {
    t.deepEqual(indexer.index("seleccionar"), ["SLKSNR"]);
    t.end();
});

test("PhoneticIndexer should index double consonants LL", (t) => {
    t.deepEqual(indexer.index("llover"), ["LLBR"]);
    t.end();
});

test("PhoneticIndexer should index double consonants NN", (t) => {
    t.deepEqual(indexer.index("innovar"), ["ANBR"]);
    t.end();
});

test("PhoneticIndexer should index double consonants RR", (t) => {
    t.deepEqual(indexer.index("arreglar"), ["ARGLR"]);
    t.end();
});

test("PhoneticIndexer should index YA", (t) => {
    t.deepEqual(indexer.index("apoyar"), ["APLLR"]);
    t.end();
});

// common spelling mistake
test("PhoneticIndexer should index LLA", (t) => {
    t.deepEqual(indexer.index("apollar"), ["APLLR"]);
    t.end();
});

test("PhoneticIndexer should index LLE", (t) => {
    t.deepEqual(indexer.index("llegar"), ["LLGR"]);
    t.end();
});

// common spelling mistake
test("PhoneticIndexer should index YE", (t) => {
    t.deepEqual(indexer.index("yegar"), ["LLGR"]);
    t.end();
});

test("PhoneticIndexer should index LLO", (t) => {
    t.deepEqual(indexer.index("rollo"), ["RLL"]);
    t.end();
});

// common spelling mistake
test("PhoneticIndexer should index YO", (t) => {
    t.deepEqual(indexer.index("royo"), ["RLL"]);
    t.end();
});

test("PhoneticIndexer should index YU", (t) => {
    t.deepEqual(indexer.index("yuxtaponer"), ["LLKSTPNR"]);
    t.end();
});

// common spelling mistake
test("PhoneticIndexer should index LLU", (t) => {
    t.deepEqual(indexer.index("lluxtaponer"), ["LLKSTPNR"]);
    t.end();
});

// different words, similar phonetics
test("PhoneticIndexer should index 'entender'", (t) => {
    t.deepEqual(indexer.index("entender"), ["ANTNTR"]);
    t.end();
});

test("PhoneticIndexer should index 'intentar'", (t) => {
    t.deepEqual(indexer.index("intentar"), ["ANTNTR"]);
    t.end();
});

// omitting D
test("PhoneticIndexer should index ADO without D", (t) => {
    t.deepEqual(indexer.index("doblado"), ["TBLT", "TBL"]);
    t.end();
});

test("PhoneticIndexer should index IDO without D", (t) => {
    t.deepEqual(indexer.index("dormido"), ["TRMT", "TRM"]);
    t.end();
});

test("PhoneticIndexer should index leading ADO with D", (t) => {
    t.deepEqual(indexer.index("adoro"), ["ATR"]);
    t.end();
});

// omitting S
test("PhoneticIndexer should index EST without S", (t) => {
    t.deepEqual(indexer.index("estado"), ["ASTT", "AT"]);
    t.end();
});
