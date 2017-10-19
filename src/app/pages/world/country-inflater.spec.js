import test from "tape";
import CountryInflater from "./country-inflater";

const data = [
    ["CG",["República del Congo"],["Brazzaville"],["francés","lingala","kituba"],[["El congoleño","La congoleña"],["El congolés","La congolesa"]]]
];

test("CountryInflater should inflate countries with flattened demonyms", (t) => {
    t.deepEqual(CountryInflater.inflate(data), {
        CG: {
            name: ["República del Congo"],
            capital: [["Brazzaville"]],
            language: [["francés", "lingala", "kituba"]],
            demonym: [["El congoleño", "La congoleña", "El congolés", "La congolesa"]]
        }
    });
    t.end();
});
