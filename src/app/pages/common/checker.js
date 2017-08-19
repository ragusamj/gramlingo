import fastdiff from "fast-diff";

class Checker {
    check(solutions, answer) {

        let result = {
            accepted: false,
            alternatives: [],
            answer: answer
        };

        answer = this.sanitize(answer);

        this.compareSolutionsWithAnswer(solutions, answer, result);
        this.diffMostSimilarSolution(solutions, answer, result);

        return result;
    }

    compareSolutionsWithAnswer(solutions, answer, result) {
        if(!answer) {
            result.accepted = true;
        }
        else {
            for(let solution of solutions) {
                if(answer === solution.toString()) {
                    result.solution = solution;
                    result.accepted = true;
                }
                else if(solutions.length > 1) {
                    result.alternatives.push(solution);
                }
            }
        }
    }

    diffMostSimilarSolution(solutions, answer, result) {
        if(!result.accepted) {
            for(let solution of solutions) {
                let diff = fastdiff(solution.toString(), answer);
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
