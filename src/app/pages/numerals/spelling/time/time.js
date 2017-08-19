import TimeDictionary from "../dictionaries/time-dictionary";

const singular = "es la";
const plural = "son las";

class Time {

    static spell(hour, minute) {

        let spelling = [];

        if (minute === 0) {
            return this.getHourSpelling(hour);
        }

        let hours = this.getHourSpelling(hour);
        let minutes = this.getMinuteSpelling(minute);

        this.createTimeSpans(hours, minutes, spelling, "y");

        if (minute > 30) {
            let hoursMenos = this.getHourSpelling((hour + 1) % 24);
            let minutesMenos = this.getMinuteSpelling(60 - minute);
            this.createTimeSpans(hoursMenos, minutesMenos, spelling, "menos");
        }

        return spelling;
    }

    static getHourSpelling(hour) {
        let spelling = this.getHour(hour);
        if (hour >= 13) {
            let twelveHourClock = this.getHour(hour - 12);
            spelling = spelling.concat(twelveHourClock);
        }
        return spelling;
    }

    static getHour(hour) {

        let spelling = [""];

        if (hour === 0) {
            spelling[0] = singular + " " + TimeDictionary[hour];
            spelling.push(plural + " " + TimeDictionary[12][0]); // doce
        }
        else if (hour === 1) {
            spelling[0] = singular + " " + TimeDictionary[hour][1]; // una, not uno
        }
        else if (hour === 12) {
            spelling[0] = plural + " " + TimeDictionary[hour][0]; // doce
            spelling.push(singular + " " + TimeDictionary[hour][1]); // mediodía
        }
        else if (hour === 15) {
            spelling[0] = plural + " " + TimeDictionary[hour][0]; // quince, not cuarto
        }
        else {
            spelling[0] = plural + " " + TimeDictionary[hour];
        }

        return spelling;
    }

    static getMinuteSpelling(minute) {

        let spelling = [""];

        if (minute === 1) {
            spelling[0] += TimeDictionary[minute][0]; // uno, not una
        }
        else if (minute === 12) {
            spelling[0] += TimeDictionary[minute][0]; // doce, not mediodía
        }
        else if (minute === 15 || minute === 30) {
            spelling.push(spelling[0]);
            spelling[0] += TimeDictionary[minute][0]; // quince, treinta
            spelling[1] += TimeDictionary[minute][1]; // cuarto, media
        }
        else if (minute >= 31 && minute <= 59) {

            let one = minute % 10;
            let ten = minute - one;

            if (ten === 30) {
                spelling[0] += TimeDictionary[ten][0];
            }
            else {
                spelling[0] += TimeDictionary[ten];
            }

            if (one >= 1) {
                let minuteSpelling = this.getMinuteSpelling(one);
                spelling[0] += " y " + minuteSpelling;
            }
        }
        else {
            spelling[0] += TimeDictionary[minute];
        }

        return spelling;
    }

    static createTimeSpans(hours, minutes, spelling, separator) {
        for (let hour of hours) {
            for (let minute of minutes) {
                spelling.push(hour + " " + separator + " " + minute);
            }
        }
    }
}

export default Time;
