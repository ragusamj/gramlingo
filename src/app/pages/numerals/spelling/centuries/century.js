const centuries = {
    0: "I",
    100: "II",
    200: "III",
    300: "IV",
    400: "V",
    500: "VI",
    600: "VII",
    700: "VIII",
    800: "IX",
    900: "X",

    1000: "XI",
    1100: "XII",
    1200: "XIII",
    1300: "XIV",
    1400: "XV",
    1500: "XVI",
    1600: "XVII",
    1700: "XVIII",
    1800: "XIX",
    1900: "XX",

    2000: "XXI",
    2100: "XXII",
    2200: "XXIII",
    2300: "XXIV",
    2400: "XXV",
    2500: "XXVI",
    2600: "XXVII",
    2700: "XXVIII",
    2800: "XXIX",
    2900: "XXX"
};

class Century {
    static spell(century) {
        return centuries[century];
    }
}

export default Century;
