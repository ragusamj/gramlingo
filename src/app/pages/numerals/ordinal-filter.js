export default (element, solutions) => {
    if(element.value) {
        for(let sign of ["ª", "º"]) {
            if(solutions[0].endsWith(sign) && !element.value.endsWith(sign)) {
                element.value += sign;
            }
        }
    }
};
