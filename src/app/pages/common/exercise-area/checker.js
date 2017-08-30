import fastdiff from "fast-diff";
import Sanitizer from "../sanitizer";

class Checker {
    check(solutions, answer) {

        let result = {
            accepted: false,
            alternatives: [],
            answer: answer
        };

        answer = Sanitizer
            .sanitize(answer)
            .toLocaleLowerCase();

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
}

export default Checker;
