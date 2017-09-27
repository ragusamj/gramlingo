const fs = require("fs");
const mapshaper = require("mapshaper");

const root = __dirname + "/naturalearth/ne_110m_admin_0_countries/ne_110m_admin_0_countries";

const input = {
    "world.dbf": fs.readFileSync(root + ".dbf"),
    "world.prj": fs.readFileSync(root + ".prj"),
    "world.shp": fs.readFileSync(root + ".shp")
};

const groups = {
    disputed: [],
    dark: [],
    normal: [],
    light: [],
    lighter: []
};

const isocodes = {

    // dark
    AL: groups.dark,
    AR: groups.dark,
    AT: groups.dark,
    BA: groups.dark,
    BG: groups.dark,
    BN: groups.dark,
    BW: groups.dark,
    CD: groups.dark,
    CM: groups.dark,
    CO: groups.dark,
    FR: groups.dark,
    GE: groups.dark,
    GN: groups.dark,
    GM: groups.dark,
    GT: groups.dark,
    GY: groups.dark,
    DJ: groups.dark,
    HK: groups.dark,
    HT: groups.dark,
    IL: groups.dark,
    IN: groups.dark,
    IR: groups.dark,
    KE: groups.dark,
    KP: groups.dark,
    KZ: groups.dark,
    LV: groups.dark,
    MR: groups.dark,
    NC: groups.dark,
    NE: groups.dark,
    NL: groups.dark,
    NO: groups.dark,
    MZ: groups.dark,
    OM: groups.dark,
    PG: groups.dark,
    PL: groups.dark,
    PH: groups.dark,
    QA: groups.dark,
    SD: groups.dark,
    TG: groups.dark,
    TH: groups.dark,
    TJ: groups.dark,
    TN: groups.dark,
    US: groups.dark,

    // normal
    AE: groups.normal,
    AX: groups.normal,
    AZ: groups.normal,
    BD: groups.normal,
    BE: groups.normal,
    BJ: groups.normal,
    BS: groups.normal,
    BZ: groups.normal,
    CA: groups.normal,
    CG: groups.normal,
    CH: groups.normal,
    CN: groups.normal,
    DK: groups.normal,
    EE: groups.normal,
    FI: groups.normal,
    FK: groups.normal,
    GH: groups.normal,
    GQ: groups.normal,
    GW: groups.normal,
    ID: groups.normal,
    IE: groups.normal,
    IM: groups.normal,
    IS: groups.normal,
    JM: groups.normal,
    JP: groups.normal,
    JO: groups.normal,
    KH: groups.normal,
    KW: groups.normal,
    LB: groups.normal,
    LK: groups.normal,
    LR: groups.normal,
    LS: groups.normal,
    LT: groups.normal,
    LY: groups.normal,
    MA: groups.normal,
    ML: groups.normal,
    NA: groups.normal,
    NI: groups.normal,
    NZ: groups.normal,
    PA: groups.normal,
    PE: groups.normal,
    PR: groups.normal,
    PT: groups.normal,
    PY: groups.normal,
    RS: groups.normal,
    RW: groups.normal,
    SI: groups.normal,
    SO: groups.normal,
    SR: groups.normal,
    SS: groups.normal,
    SV: groups.normal,
    TM: groups.normal,
    TR: groups.normal,
    TT: groups.normal,
    UA: groups.normal,
    UY: groups.normal,
    VU: groups.normal,
    VE: groups.normal,
    ZM: groups.normal,
    YE: groups.normal,

    // light
    AU: groups.light,
    AO: groups.light,
    BR: groups.light,
    CF: groups.light,
    CI: groups.light,
    CL: groups.light,
    CR: groups.light,
    CU: groups.light,
    CY: groups.light,
    DE: groups.light,
    DO: groups.light,
    DZ: groups.light,
    EC: groups.light,
    EG: groups.light,
    ER: groups.light,
    ES: groups.light,
    ET: groups.light,
    FJ: groups.light,
    GA: groups.light,
    GB: groups.light,
    GL: groups.light,
    GR: groups.light,
    HN: groups.light,
    HR: groups.light,
    IT: groups.light,
    KR: groups.light,
    ME: groups.light,
    MG: groups.light,
    MM: groups.light,
    MX: groups.light,
    MY: groups.light,
    NG: groups.light,
    PK: groups.light,
    PS: groups.light,
    RO: groups.light,
    RU: groups.light,
    SA: groups.light,
    SB: groups.light,
    SE: groups.light,
    SK: groups.light,
    SL: groups.light,
    SN: groups.light,
    SY: groups.light,
    TF: groups.light,
    TL: groups.light,
    TW: groups.light,
    TZ: groups.light,
    UZ: groups.light,
    VN: groups.light,
    ZA: groups.light,

    // lighter
    AF: groups.lighter,
    AM: groups.lighter,
    AQ: groups.lighter,
    BI: groups.lighter,
    BF: groups.lighter,
    BO: groups.lighter,
    BT: groups.lighter,
    BY: groups.lighter,
    CZ: groups.lighter,
    EH: groups.lighter,
    HU: groups.lighter,
    IQ: groups.lighter,
    KG: groups.lighter,
    LA: groups.lighter,
    LU: groups.lighter,
    MD: groups.lighter,
    MK: groups.lighter,
    MN: groups.lighter,
    MW: groups.lighter,
    NP: groups.lighter,
    SZ: groups.lighter,
    TD: groups.lighter,
    UG: groups.lighter,
    ZW: groups.lighter
};

mapshaper.applyCommands("-i world.shp -simplify 90% -proj robin -o format=svg id-field=iso_a2", input, function(error, output) {
    if(error) {
        throw new Error(error);
    }

    let svg = "";

    for(let line of output["world.svg"].split("\n")) {

        if(line.startsWith("<svg")) {
            let viewBox = line.match(/viewBox="[\d+\s]+"/);
            svg += "<svg id=\"worldmap\" " + viewBox + " stroke-linecap=\"round\" stroke-linejoin=\"round\">\n";
        }

        if(line.startsWith("<path")) {
            let path = line.replace("id=", "data-iso=");
            let match = line.match(/id="([A-Z]{2})"/);
            if(match) {
                isocodes[match[1]].push(path);
            }
            else {
                groups.disputed.push(path);
            }
        }
    }

    for(let key of Object.keys(groups)) {
        svg += "    <g class=\"" + key + "\">\n";

        for(let path of groups[key]) {
            svg += "        " + path + "\n";
        }

        svg += "    </g>\n";
    }

    svg += "</svg>\n";

    process.stdout.write(svg);
});