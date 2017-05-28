import fastdiff from "fast-diff";

class Checker {
    check(alternatives, answer) {

        let result = {
            accepted: false,
            alternatives: [],
            answer: answer
        };

        answer = this.sanitize(answer);

        this.compareAlternativesWithAnswer(alternatives, answer, result);
        this.diffMostSimilarAlternative(alternatives, answer, result);

        return result;
    }

    compareAlternativesWithAnswer(alternatives, answer, result) {
        if(!answer) {
            result.accepted = true;
        }
        else {
            for(let solution of alternatives) {
                if(answer === solution) {
                    result.solution = solution;
                    result.accepted = true;
                }
                else if(alternatives.length > 1) {
                    result.alternatives.push(solution);
                }
            }
        }
    }

    diffMostSimilarAlternative(alternatives, answer, result) {
        if(!result.accepted) {
            for(let solution of alternatives) {
                let diff = fastdiff(solution, answer);
                if(!(result.diff && result.diff.length < diff.length)) {
                    result.diff = diff;
                    result.solution = solution;
                }
            }
        }
    }

    sanitize(s) {
        return s
            .replace(/\s+/g, " ")
            .replace(/[^0-9a-z\s\u00E1-\u00FC]/ig, "")
            .trim()
            .toLocaleLowerCase();
    }
}

export default Checker;
