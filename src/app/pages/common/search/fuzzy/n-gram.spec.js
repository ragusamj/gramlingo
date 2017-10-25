import test from "tape";
import ngram from "./n-gram";

test("n-gram should create a bigram", (t) => {
    t.deepEqual(ngram("BIGRAM", 2), ["BI", "IG", "GR", "RA", "AM"]);
    t.end();
});

test("n-gram should create a bigram, one character", (t) => {
    t.deepEqual(ngram("2", 2), ["2"]);
    t.end();
});

test("n-gram should create a trigram", (t) => {
    t.deepEqual(ngram("TRIGRAM", 3), ["TRI", "RIG", "IGR", "GRA", "RAM", "AM"]);
    t.end();
});