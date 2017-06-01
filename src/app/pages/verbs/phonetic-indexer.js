class PhoneticIndexer {

    index(value) {

        let primary = "";
        let secondary = "";
        value = value.toUpperCase();

        for(let i = 0; i < value.length; i++) {

            if(["H","A","Á","E","É","I","Í","O","Ó","U","Ú","Ü"].indexOf(value[i]) > -1) {
                let vowel = i === 0 ? "A" : "";
                primary += vowel;
                secondary += vowel;
                continue;
            }

            if(value[i] === "Y" && ["A","E","O","U"].indexOf(value[i + 1]) > -1) {
                primary += "LL";
                secondary += "LL";
                continue;
            }

            switch(value[i]) {
                case "B":
                case "V":
                    primary += "B";
                    secondary += "B";
                    break;
                case "C":
                    if(["E", "I"].indexOf(value[i + 1]) > -1) {
                        primary += "S";
                        secondary += "S";
                    }
                    else if(value[i + 1] === "H") {
                        primary += "X";
                        secondary += "X";
                    }
                    else {
                        primary += "K";
                        secondary += "K";
                    }
                    break;
                case "D":
                    primary += "T";
                    if(!(i !== 1 && ["A", "I"].indexOf(value[i - 1]) > -1 && ["A", "O"].indexOf(value[i + 1]) > -1)) {
                        secondary += "T";
                    }
                    break;
                case "G":
                    if(["E", "I"].indexOf(value[i + 1]) > -1) {
                        primary += "X";
                        secondary += "X";
                    }
                    else if(i === 0 && value[i + 1] === "Ü") {
                        primary += "A";
                        secondary += "A";
                    }
                    else {
                        primary += "G";
                        secondary += "G";
                    }
                    break;
                case "J":
                    primary += "X";
                    secondary += "X";
                    break;
                case "Q":
                    primary += "K";
                    secondary += "K";
                    break;
                case "N":
                case "R":
                    if(value[i + 1] !== value[i]) {
                        primary += value[i];
                        secondary += value[i];
                    }
                    break;
                case "Ñ":
                    primary += "N";
                    secondary += "N";
                    break;
                case "S":
                    primary += "S";
                    if(value[i + 1] !== "T") {
                        secondary += "S";
                    }
                    break;
                case "Z":
                    primary += "S";
                    secondary += "S";
                    break;
                case "X":
                    primary += "KS";
                    secondary += "KS";
                    break;
                default:
                    primary += value[i];
                    secondary += value[i];
            }
        }

        return primary === secondary ? [primary] : [primary, secondary];
    }
}

export default PhoneticIndexer;
