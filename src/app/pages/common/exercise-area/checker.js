import fastdiff from "fast-diff";
import dice from "../search/fuzzy/dice-coefficient";
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
            let last = 0;
            let mostSimilar;
            for(let solution of solutions) {
                let similarity = dice(answer, solution.lower);
                if(similarity > last) {
                    mostSimilar = solution;
                    last = similarity;
                }
            }
            result.diff = fastdiff(mostSimilar.lower, answer);
            result.solution = mostSimilar.original;
        }
    }
}

export default Checker;
