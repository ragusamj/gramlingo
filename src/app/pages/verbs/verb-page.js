import Indices from "./indices";
import VerbSearch from "./verb-search";
import FieldBuilder from "../../exercise-area/field-builder";
import Http from "../../core/http";
import I18n from "../../core/i18n";

const defaultVerbIndex = 624;

class VerbPage {

    constructor() {
        this._fieldBuilder = new FieldBuilder();
    }

    destroy() {
        this._fieldBuilder.destroy();
        this._verbSearch.destroy();
    }

    load() {
        Http.loadJSON("/data/verbs.json", (verbs) => {
            this._verbs = verbs;
            this._verbSearch = new VerbSearch(verbs, this._buildPage.bind(this));
            this._buildPage(defaultVerbIndex);
        }, (event) => {
            // console.log("loading verbs, recieved", event.loaded, "bytes of", event.total);
            return event;
        });
    }

    _buildPage(index) {
        let verb = this._verbs[index];

        this._setHeader(verb);

        this._fieldBuilder.reset();

        this._fieldBuilder.add("presentparticiple", [verb[Indices.presentparticiple]]);
        this._fieldBuilder.add("pastparticiple", [verb[Indices.pastparticiple]]);

        this._fieldBuilder.add("indicative-present", verb[Indices.indicative.present]);
        this._fieldBuilder.add("indicative-imperfect", verb[Indices.indicative.imperfect]);
        this._fieldBuilder.add("indicative-preterite", verb[Indices.indicative.preterite]);
        this._fieldBuilder.add("indicative-future", verb[Indices.indicative.future]);
        this._fieldBuilder.add("indicative-conditional", verb[Indices.indicative.conditional]);

        this._fieldBuilder.add("subjunctive-present", verb[Indices.subjuntive.present]);
        this._fieldBuilder.add("subjunctive-imperfect", verb[Indices.subjuntive.imperfect]);
        this._fieldBuilder.add("subjunctive-future", verb[Indices.subjuntive.future]);

        this._fieldBuilder.add("imperative-affirmative", verb[Indices.imperative.affirmative]);
        this._fieldBuilder.add("imperative-negative", this._mapImperativeNegative(verb[Indices.subjuntive.present]));
    }

    _setHeader(verb) {
        document.getElementById("verb-name").innerHTML = verb[Indices.name];
        let mode = document.getElementById("verb-mode");
        mode.setAttribute("data-translate", (verb[Indices.regular] ? "verbs-header-regular" : "verbs-header-irregular"));
        I18n.translate(mode);
    }

    _mapImperativeNegative(subjuntivePresentPersons) {
        return subjuntivePresentPersons
        .map(function(person, index) {
            var variants = [];
            if(index > 0) {
                person.forEach(function(variant) {
                    if(variant) {
                        variants.push("no " + variant);
                    }
                });
            }
            return variants;
        });
    }
}

export default VerbPage;
