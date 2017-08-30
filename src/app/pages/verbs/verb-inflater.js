class VerbInflater {

    static inflate(data) {
        return data
            .map((verb) => {
                return {
                    name: verb[0],
                    regular: !!verb[1],
                    presentparticiple: [verb[2]],
                    pastparticiple: [verb[3]],
                    indicative: {
                        present: verb[4],
                        imperfect: verb[5],
                        preterite: verb[6],
                        future: verb[7],
                        conditional: verb[8]
                    },
                    subjunctive: {
                        present: verb[9],
                        imperfect: verb[10],
                        future: verb[11]
                    },
                    imperative: {
                        affirmative: verb[12],
                        negative: verb[9].map((person, i) => {
                            return person.map((variant) => {
                                return (i > 0  && variant) ? ("no " + variant) : undefined;
                            });
                        })
                    }
                };
            })
            .sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
    }
}

export default VerbInflater;