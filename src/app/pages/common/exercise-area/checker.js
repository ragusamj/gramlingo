import fastdiff from "fast-diff";
import Sanitizer from "../sanitizer";

class Checker {
    check(solutions, answer) {

        let result = {
            accepted: false,
            alternatives: [],
            answer: answer
        };

        solutions = this.map(solutions);
        answer = Sanitizer
            .sanitize(answer)
            .toLocaleLowerCase();

        this.compareSolutionsWithAnswer(solutions, answer, result);
        this.diffMostSimilarSolution(solutions, answer, result);

        return result;
    }

    map(solutions) {
        return solutions.map((solution) => {
            return {
                original: solution,
                lower: solution.toString().toLocaleLowerCase()
            };
        });
    }

    compareSolutionsWithAnswer(solutions, answer, result) {
        if(!answer) {
            result.accepted = true;
        }
        else {
            for(let solution of solutions) {
                if(answer === solution.lower) {
                    result.solution = solution.original;
                    result.accepted = true;
                }
                else if(solutions.length > 1) {
                    result.alternatives.push(solution.original);
                }
            }
        }
    }

    diffMostSimilarSolution(solutions, answer, result) {
        if(!result.accepted) {
            for(let solution of solutions) {
                let diff = fastdiff(solution.lower, answer);
                if(!(result.diff && result.diff.length < diff.length)) {
                    result.diff = diff;
                    result.solution = solution.original;
                }
            }
        }
    }
}

export default Checker;
