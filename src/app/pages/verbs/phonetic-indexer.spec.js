import test from "tape";
import PhoneticIndexer from "./phonetic-indexer";

const indexer = new PhoneticIndexer();

test("PhoneticIndexer should index ^A", (t) => {
    t.equal(indexer.index("andar"), "ANTR");
    t.end();
});

test("PhoneticIndexer should index ^E'", (t) => {
    t.equal(indexer.index("estar"), "ASTR");
    t.end();
});

test("PhoneticIndexer should index ^I", (t) => {
    t.equal(indexer.index("ir"), "AR");
    t.end();
});

test("PhoneticIndexer should index ^O", (t) => {
    t.equal(indexer.index("ofrecer"), "AFRSR");
    t.end();
});

test("PhoneticIndexer should index ^U", (t) => {
    t.equal(indexer.index("unir"), "ANR");
    t.end();
});

test("PhoneticIndexer should index B", (t) => {
    t.equal(indexer.index("beber"), "BBR");
    t.end();
});

test("PhoneticIndexer should index ^CA", (t) => {
    t.equal(indexer.index("caer"), "KR");
    t.end();
});

test("PhoneticIndexer should index ^CO", (t) => {
    t.equal(indexer.index("cocer"), "KSR");
    t.end();
});

test("PhoneticIndexer should index ^CU", (t) => {
    t.equal(indexer.index("cumplir"), "KMBLR");
    t.end();
});

test("PhoneticIndexer should index *CU", (t) => {
    t.equal(indexer.index("acudir"), "AKTR");
    t.end();
});

test("PhoneticIndexer should index ^CE", (t) => {
    t.equal(indexer.index("cerrar"), "SRR");
    t.end();
});

test("PhoneticIndexer should index *CE", (t) => {
    t.equal(indexer.index("hacer"), "ASR");
    t.end();
});

test("PhoneticIndexer should index ^CI", (t) => {
    t.equal(indexer.index("circular"), "SRKLR");
    t.end();
});

test("PhoneticIndexer should index CH", (t) => {
    t.equal(indexer.index("hache"), "AX");
    t.end();
});

test("PhoneticIndexer should index CHO", (t) => {
    t.equal(indexer.index("hecho"), "AX");
    t.end();
});

test("PhoneticIndexer should index D", (t) => {
    t.equal(indexer.index("dedicar"), "TTKR");
    t.end();
});

test("PhoneticIndexer should index F", (t) => {
    t.equal(indexer.index("frenar"), "FRNR");
    t.end();
});

test("PhoneticIndexer should index GA", (t) => {
    t.equal(indexer.index("ganar"), "GNR");
    t.end();
});

test("PhoneticIndexer should index GO", (t) => {
    t.equal(indexer.index("gozar"), "GSR");
    t.end();
});

test("PhoneticIndexer should index GU", (t) => {
    t.equal(indexer.index("gustar"), "GSTR");
    t.end();
});

test("PhoneticIndexer should index GE", (t) => {
    t.equal(indexer.index("coger"), "KXR");
    t.end();
});

test("PhoneticIndexer should index GI", (t) => {
    t.equal(indexer.index("girar"), "XRR");
    t.end();
});

test("PhoneticIndexer should index ^HA", (t) => {
    t.equal(indexer.index("haber"), "ABR");
    t.end();
});

test("PhoneticIndexer should index *HA", (t) => {
    t.equal(indexer.index("deshacer"), "TSSR");
    t.end();
});

test("PhoneticIndexer should index J", (t) => {
    t.equal(indexer.index("jugar"), "XGR");
    t.end();
});

test("PhoneticIndexer should index L", (t) => {
    t.equal(indexer.index("leer"), "LR");
    t.end();
});

test("PhoneticIndexer should index M", (t) => {
    t.equal(indexer.index("madrugar"), "MTRGR");
    t.end();
});

test("PhoneticIndexer should index N", (t) => {
    t.equal(indexer.index("navegar"), "NBGR");
    t.end();
});

test("PhoneticIndexer should index Ñ", (t) => {
    t.equal(indexer.index("bañar"), "BNR");
    t.end();
});

test("PhoneticIndexer should index P", (t) => {
    t.equal(indexer.index("parar"), "BRR");
    t.end();
});

test("PhoneticIndexer should index Q", (t) => {
    t.equal(indexer.index("quedar"), "KTR");
    t.end();
});

test("PhoneticIndexer should index R", (t) => {
    t.equal(indexer.index("regalar"), "RGLR");
    t.end();
});

test("PhoneticIndexer should index S", (t) => {
    t.equal(indexer.index("saber"), "SBR");
    t.end();
});

test("PhoneticIndexer should index T", (t) => {
    t.equal(indexer.index("tener"), "TNR");
    t.end();
});

test("PhoneticIndexer should index ZA", (t) => {
    t.equal(indexer.index("cazar"), "KSR");
    t.end();
});

test("PhoneticIndexer should index ZU", (t) => {
    t.equal(indexer.index("zumbar"), "SMBR");
    t.end();
});

test("PhoneticIndexer should index X", (t) => {
    t.equal(indexer.index("examinar"), "AKSMNR");
    t.end();
});

test("PhoneticIndexer should index double consonants CC", (t) => {
    t.equal(indexer.index("seleccionar"), "SLKSNR");
    t.end();
});

test("PhoneticIndexer should index double consonants LL", (t) => {
    t.equal(indexer.index("llover"), "LLBR");
    t.end();
});

test("PhoneticIndexer should index double consonants NN", (t) => {
    t.equal(indexer.index("innovar"), "ANBR");
    t.end();
});

test("PhoneticIndexer should index double consonants RR", (t) => {
    t.equal(indexer.index("arreglar"), "ARGLR");
    t.end();
});

test("PhoneticIndexer should index YA", (t) => {
    t.equal(indexer.index("apoyar"), "ABLLR");
    t.end();
});

// common spelling mistake
test("PhoneticIndexer should index LLA", (t) => {
    t.equal(indexer.index("apollar"), "ABLLR");
    t.end();
});

test("PhoneticIndexer should index LLE", (t) => {
    t.equal(indexer.index("llegar"), "LLGR");
    t.end();
});

// common spelling mistake
test("PhoneticIndexer should index YE", (t) => {
    t.equal(indexer.index("yegar"), "LLGR");
    t.end();
});

test("PhoneticIndexer should index LLO", (t) => {
    t.equal(indexer.index("rollo"), "RLL");
    t.end();
});

// common spelling mistake
test("PhoneticIndexer should index YO", (t) => {
    t.equal(indexer.index("royo"), "RLL");
    t.end();
});

test("PhoneticIndexer should index YU", (t) => {
    t.equal(indexer.index("yuxtaponer"), "LLKSTBNR");
    t.end();
});

// common spelling mistake
test("PhoneticIndexer should index LLU", (t) => {
    t.equal(indexer.index("lluxtaponer"), "LLKSTBNR");
    t.end();
});

// different words, similar phonetics
test("PhoneticIndexer should index 'entender'", (t) => {
    t.equal(indexer.index("entender"), "ANTNTR");
    t.end();
});

test("PhoneticIndexer should index 'intentar'", (t) => {
    t.equal(indexer.index("intentar"), "ANTNTR");
    t.end();
});

test("PhoneticIndexer should index 'pagar'", (t) => {
    t.equal(indexer.index("pagar"), "BGR");
    t.end();
});

test("PhoneticIndexer should index 'vagar'", (t) => {
    t.equal(indexer.index("vagar"), "BGR");
    t.end();
});

test("PhoneticIndexer should index 'besar'", (t) => {
    t.equal(indexer.index("besar"), "BSR");
    t.end();
});

test("PhoneticIndexer should index 'pasar'", (t) => {
    t.equal(indexer.index("pasar"), "BSR");
    t.end();
});
