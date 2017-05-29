class PhoneticIndexer {

    index(value) {

        let result = "";
        value = value.toUpperCase();

        for(let i = 0; i < value.length; i++) {

            if(["H","A","Á","E","É","I","Í","O","Ó","U","Ú","Ü"].indexOf(value[i]) > -1) {
                result += i === 0 ? "A" : "";
                continue;
            }

            if(value[i] === "Y" && ["A","E","O","U"].indexOf(value[i + 1]) > -1) {
                result += "LL";
                continue;
            }

            switch(value[i]) {
                case "B":
                case "P":
                case "V":
                    result += "B";
                    break;
                case "C":
                    if(["E", "I"].indexOf(value[i + 1]) > -1) {
                        result += "S";
                    }
                    else if(value[i + 1] === "H") {
                        result += "X";
                    }
                    else {
                        result += "K";
                    }
                    break;
                case "D":
                    result += "T";
                    break;
                case "G":
                    if(["E", "I"].indexOf(value[i + 1]) > -1) {
                        result += "X";
                    }
                    else if(i === 0 && value[i + 1] === "Ü") {
                        result += "A";
                    }
                    else {
                        result += "G";
                    }
                    break;
                case "J":
                    result += "X";
                    break;
                case "Q":
                    result += "K";
                    break;
                case "N":
                case "R":
                    if(value[i + 1] !== value[i]) {
                        result += value[i];
                    }
                    break;
                case "Ñ":
                    result += "N";
                    break;
                case "S":
                case "Z":
                    result += "S";
                    break;
                case "X":
                    result += "KS";
                    break;
                default:
                    result += value[i];
            }
        }

        return result;
    }
}

export default PhoneticIndexer;
