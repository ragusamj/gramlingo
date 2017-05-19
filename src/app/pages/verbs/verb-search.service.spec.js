import test from "tape";
import VerbSearchService from "./verb-search.service";

test("Verb search service should search", (t) => {
    let verbs = [{ name: "Ir" }];
    let service = new VerbSearchService(verbs);
    t.deepEqual(service.search("ir"), { matches: [ { index: 0, match: "ir", post: "", pre: "", weight: 100 } ], maxExceeded: false });
    t.end();
});
