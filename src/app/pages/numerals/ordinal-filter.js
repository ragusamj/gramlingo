export default (element, solutions) => {
    if(element.value) {
        for(let sign of ["ª", "º"]) {
            if(solutions[0].indexOf(sign) === (solutions[0].length) -1 && element.value.indexOf(sign) === -1) {
                element.value += sign;
            }
        }
    }
};
