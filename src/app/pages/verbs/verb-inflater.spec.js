import test from "tape";
import VerbInflater from "./verb-inflater";

const inflater = new VerbInflater();

const data = [
    ["Tener",0,["teniendo"],["tenido"],
        [["tengo"],["tienes"],["tiene"],["tenemos"],["tenéis"],["tienen"],["tenés"]],
        [["tenía"],["tenías"],["tenía"],["teníamos"],["teníais"],["tenían"],["tenías"]],
        [["tuve"],["tuviste"],["tuvo"],["tuvimos"],["tuvisteis"],["tuvieron"],["tuviste"]],
        [["tendré"],["tendrás"],["tendrá"],["tendremos"],["tendréis"],["tendrán"],["tendrás"]],
        [["tendría"],["tendrías"],["tendría"],["tendríamos"],["tendríais"],["tendrían"],["tendrías"]],
        [["tenga"],["tengas"],["tenga"],["tengamos"],["tengáis"],["tengan"],["tengas"]],
        [["tuviese","tuviera"],["tuvieses","tuvieras"],["tuviese","tuviera"],["tuviésemos","tuviéramos"],["tuvieseis","tuvierais"],["tuviesen","tuvieran"],["tuvieses","tuvieras"]],
        [["tuviere"],["tuvieres"],["tuviere"],["tuviéremos"],["tuviereis"],["tuvieren"],["tuvieres"]],
        [[],["ten"],["tenga"],["tengamos"],["tened"],["tengan"],["tené"]]],

    ["Hacer",0,["haciendo"],["hecho"],
        [["hago"],["haces"],["hace"],["hacemos"],["hacéis"],["hacen"],["hacés"]],
        [["hacía"],["hacías"],["hacía"],["hacíamos"],["hacíais"],["hacían"],["hacías"]],
        [["hice"],["hiciste"],["hizo"],["hicimos"],["hicisteis"],["hicieron"],["hiciste"]],
        [["haré"],["harás"],["hará"],["haremos"],["haréis"],["harán"],["harás"]],
        [["haría"],["harías"],["haría"],["haríamos"],["haríais"],["harían"],["harías"]],
        [["haga"],["hagas"],["haga"],["hagamos"],["hagáis"],["hagan"],["hagas","hagás"]],
        [["hiciese","hiciera"],["hicieses","hicieras"],["hiciese","hiciera"],["hiciésemos","hiciéramos"],["hicieseis","hicierais"],["hiciesen","hicieran"],["hicieses","hicieras"]],
        [["hiciere"],["hicieres"],["hiciere"],["hiciéremos"],["hiciereis"],["hicieren"],["hicieres"]],
        [[],["haz"],["haga"],["hagamos"],["haced"],["hagan"],["hacé"]]]
];

test("VerbInflater should inflate verbs with negative imperative and sort by verb name", (t) => {
    t.deepEqual(inflater.inflate(data), [
        { name: "Hacer", regular: false, presentparticiple: [["haciendo"]], pastparticiple: [["hecho"]], 
            indicative: {
                present: [["hago"], ["haces"], ["hace"], ["hacemos"], ["hacéis"], ["hacen"], ["hacés"]],
                imperfect: [["hacía"], ["hacías"], ["hacía"], ["hacíamos"], ["hacíais"], ["hacían"], ["hacías"]],
                preterite: [["hice"], ["hiciste"], ["hizo"], ["hicimos"], ["hicisteis"], ["hicieron"], ["hiciste"]],
                future: [["haré"], ["harás"], ["hará"], ["haremos"], ["haréis"], ["harán"], ["harás"]],
                conditional: [["haría"], ["harías"], ["haría"], ["haríamos"], ["haríais"], ["harían"], ["harías"]] },
            subjunctive: {
                present: [["haga"], ["hagas"], ["haga"], ["hagamos"], ["hagáis"], ["hagan"], ["hagas", "hagás"]],
                imperfect: [["hiciese", "hiciera"], ["hicieses", "hicieras"], ["hiciese", "hiciera"], ["hiciésemos", "hiciéramos"], ["hicieseis", "hicierais"], ["hiciesen", "hicieran"], ["hicieses", "hicieras"]],
                future: [["hiciere"], ["hicieres"], ["hiciere"], ["hiciéremos"], ["hiciereis"], ["hicieren"], ["hicieres"]] },
            imperative: {
                affirmative: [ [], ["haz"], ["haga"], ["hagamos"], ["haced"], ["hagan"], ["hacé"]],
                negative: [[undefined ], ["no hagas"], ["no haga"], ["no hagamos"], ["no hagáis"], ["no hagan"], ["no hagas", "no hagás"]] }
        },
        { name: "Tener", regular: false, presentparticiple: [["teniendo"]], pastparticiple: [["tenido"]],
            indicative: {
                present: [["tengo"], ["tienes"], ["tiene"], ["tenemos"], ["tenéis"], ["tienen"], ["tenés"]],
                imperfect: [["tenía"], ["tenías"], ["tenía"], ["teníamos"], ["teníais"], ["tenían"], ["tenías"]],
                preterite: [["tuve"], ["tuviste"], ["tuvo"], ["tuvimos"], ["tuvisteis"], ["tuvieron"], ["tuviste"]],
                future: [["tendré"], ["tendrás"], ["tendrá"], ["tendremos"], ["tendréis"], ["tendrán"], ["tendrás"]],
                conditional: [["tendría"], ["tendrías"], ["tendría"], ["tendríamos"], ["tendríais"], ["tendrían"], ["tendrías"]] },
            subjunctive: {
                present: [["tenga"], ["tengas"], ["tenga"], ["tengamos"], ["tengáis"], ["tengan"], ["tengas"]],
                imperfect: [["tuviese", "tuviera"], ["tuvieses", "tuvieras"], ["tuviese", "tuviera"], ["tuviésemos", "tuviéramos"], ["tuvieseis", "tuvierais"], ["tuviesen", "tuvieran"], ["tuvieses", "tuvieras"]],
                future: [["tuviere"], ["tuvieres"], ["tuviere"], ["tuviéremos"], ["tuviereis"], ["tuvieren"], ["tuvieres"]] },
            imperative: {
                affirmative: [ [], ["ten"], ["tenga"], ["tengamos"], ["tened"], ["tengan"], ["tené"]],
                negative: [[undefined ], ["no tengas"], ["no tenga"], ["no tengamos"], ["no tengáis"], ["no tengan"], ["no tengas"]] }
        }
    ]);
    t.end();
});
