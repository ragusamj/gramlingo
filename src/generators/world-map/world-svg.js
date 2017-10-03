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
    AL: { group: groups.dark, marker: "441.33x95.37" },
    AR: { group: groups.dark, marker: "263.58x284.21" },
    AT: { group: groups.dark, marker: "429.39x79.02" },
    BG: { group: groups.dark, marker: "451.28x91.47" },
    BN: { group: groups.dark, marker: "657.33x187.47" },
    BW: { group: groups.dark, marker: "452.41x257.07" },
    CM: { group: groups.dark, marker: "428.03x186.32" },
    CD: { group: groups.dark, marker: "452.74x204.95" },
    CO: { group: groups.dark, marker: "237.13x191.3" },
    DJ: { group: groups.dark, marker: "494.28x169.72" },
    FR: { group: groups.dark, marker: "405.5x81.85" },
    GE: { group: groups.dark, marker: "489.24x93.23" },
    GN: { group: groups.dark, marker: "374.89x171.42" },
    GM: { group: groups.dark, marker: "366.17x164.52" },
    GT: { group: groups.dark, marker: "200.45x159.84" },
    GY: { group: groups.dark, marker: "268.46x187.75" },
    HR: { group: groups.dark, marker: "433.03x83.96" },
    HT: { group: groups.dark, marker: "240.94x150.9" },
    IN: { group: groups.dark, marker: "575.86x143.51" },
    IR: { group: groups.dark, marker: "516.78x117.07" },
    IL: { group: groups.dark, marker: "475.08x120.7" },
    KZ: { group: groups.dark, marker: "534.72x77.13" },
    KE: { group: groups.dark, marker: "484.97x198.2" },
    LV: { group: groups.dark, marker: "447.62x56.28" },
    MZ: { group: groups.dark, marker: "483.82x237.67" },
    MR: { group: groups.dark, marker: "378.53x147.51" },
    NC: { group: groups.dark, marker: "764.22x253.64" },
    NE: { group: groups.dark, marker: "421.86x156.19" },
    NL: { group: groups.dark, marker: "411.06x67.15" },
    NO: { group: groups.dark, marker: "416.29x46.55" },
    OM: { group: groups.dark, marker: "524.67x148.54" },
    PH: { group: groups.dark, marker: "674.79x165.23" },
    PG: { group: groups.dark, marker: "722.44x215.54" },
    PL: { group: groups.dark, marker: "437.29x67.41" },
    KP: { group: groups.dark, marker: "662.37x98.67" },
    QA: { group: groups.dark, marker: "511.78x135.1" },
    SD: { group: groups.dark, marker: "466.72x159.95" },
    TG: { group: groups.dark, marker: "402.47x178.74" },
    TH: { group: groups.dark, marker: "625.65x160.85" },
    TJ: { group: groups.dark, marker: "551.21x103.24" },
    TN: { group: groups.dark, marker: "419.83x113.35" },
    US: { group: groups.dark, marker: "194.88x101.39" },

    // normal
    AE: { group: groups.normal, marker: "519.63x139.2" },
    AZ: { group: groups.normal, marker: "498.7x97.86" },
    BE: { group: groups.normal, marker: "409.34x71.38" },
    BJ: { group: groups.normal, marker: "405.37x173.97" },
    BD: { group: groups.normal, marker: "597.28x139.27" },
    BS: { group: groups.normal, marker: "232.1x132.47" },
    BZ: { group: groups.normal, marker: "203.66x156.29" },
    CA: { group: groups.normal, marker: "204.79x55" },
    CH: { group: groups.normal, marker: "416.35x80.91" },
    CN: { group: groups.normal, marker: "612.49x111.9" },
    CG: { group: groups.normal, marker: "435.63x200.01" },
    DK: { group: groups.normal, marker: "417.15x57.87" },
    EE: { group: groups.normal, marker: "446.96x52.31" },
    ER: { group: groups.normal, marker: "484.81x159.64" },
    FI: { group: groups.normal, marker: "446.12x42.99" },
    FK: { group: groups.normal, marker: "285.87x329.71" },
    GH: { group: groups.normal, marker: "397.88x179.59" },
    GW: { group: groups.normal, marker: "367.06x169.21" },
    GQ: { group: groups.normal, marker: "423.46x195.24" },
    ID: { group: groups.normal, marker: "656.98x204.04" },
    IE: { group: groups.normal, marker: "385.1x65.03" },
    IS: { group: groups.normal, marker: "369.33x38.09" },
    JM: { group: groups.normal, marker: "229.01x153.31" },
    JO: { group: groups.normal, marker: "478.22x120.89" },
    JP: { group: groups.normal, marker: "692.16x107.66" },
    KH: { group: groups.normal, marker: "633.88x167.64" },
    KW: { group: groups.normal, marker: "502.82x124.83" },
    LB: { group: groups.normal, marker: "476.03x113.47" },
    LR: { group: groups.normal, marker: "378.98x183" },
    LY: { group: groups.normal, marker: "439.51x133.03" },
    LK: { group: groups.normal, marker: "580.63x180.38" },
    LS: { group: groups.normal, marker: "460.96x274.83" },
    LT: { group: groups.normal, marker: "445.24x59.99" },
    MA: { group: groups.normal, marker: "387.08x117.86" },
    ML: { group: groups.normal, marker: "395.66x152.01" },
    NA: { group: groups.normal, marker: "438.26x258.23" },
    NI: { group: groups.normal, marker: "210.89x167.3" },
    NZ: { group: groups.normal, marker: "753.61x305.64" },
    PA: { group: groups.normal, marker: "219.26x178.19" },
    PE: { group: groups.normal, marker: "232.02x222.2" },
    PR: { group: groups.normal, marker: "253.21x152.96" },
    PT: { group: groups.normal, marker: "383.18x100.02" },
    PY: { group: groups.normal, marker: "272.91x259.31" },
    RW: { group: groups.normal, marker: "467.37x204.45" },
    SS: { group: groups.normal, marker: "467.98x182.06" },
    SV: { group: groups.normal, marker: "202.51x164.54" },
    SO: { group: groups.normal, marker: "500.29x191.47" },
    RS: { group: groups.normal, marker: "442.28x87.98" },
    SR: { group: groups.normal, marker: "275.35x189.75" },
    SI: { group: groups.normal, marker: "430.02x82.64" },
    TM: { group: groups.normal, marker: "522.44x100.27" },
    TT: { group: groups.normal, marker: "263.27x172.81" },
    TR: { group: groups.normal, marker: "474.23x100.44" },
    UA: { group: groups.normal, marker: "464.29x76.04" },
    UY: { group: groups.normal, marker: "280.91x283.09" },
    VE: { group: groups.normal, marker: "254.46x181.75" },
    VU: { group: groups.normal, marker: "770.67x238.01" },
    YE: { group: groups.normal, marker: "505.44x160.11" },
    ZM: { group: groups.normal, marker: "457.67x239.64" },

    // light
    AO: { group: groups.light, marker: "439.91x230.27" },
    TF: { group: groups.light, marker: "535.98x324.16" },
    AU: { group: groups.light, marker: "698x263.68" },
    BR: { group: groups.light, marker: "288.8x233.31" },
    CF: { group: groups.light, marker: "446.14x182.06" },
    CL: { group: groups.light, marker: "250.24x300.2" },
    CI: { group: groups.light, marker: "387.66x181.47" },
    CR: { group: groups.light, marker: "213.18x174.18" },
    CU: { group: groups.light, marker: "229.58x145.51" },
    CY: { group: groups.light, marker: "469.83x110.65" },
    DE: { group: groups.light, marker: "419.8x69.4" },
    DO: { group: groups.light, marker: "245.07x151.13" },
    DZ: { group: groups.light, marker: "406.48x129.1" },
    EC: { group: groups.light, marker: "225.13x203.97" },
    EG: { group: groups.light, marker: "463.83x133.03" },
    ES: { group: groups.light, marker: "392.61x98.35" },
    ET: { group: groups.light, marker: "488.92x176.38" },
    FJ: { group: groups.light, marker: "793.57x244.67" },
    GA: { group: groups.light, marker: "426.84x201.5" },
    GB: { group: groups.light, marker: "397.15x66.35" },
    GR: { group: groups.light, marker: "445.91x100.64" },
    GL: { group: groups.light, marker: "338.94x18.75" },
    HN: { group: groups.light, marker: "208.13x162.02" },
    IT: { group: groups.light, marker: "426.56x91.6" },
    KR: { group: groups.light, marker: "668.93x107.27" },
    MG: { group: groups.light, marker: "502.56x250.99" },
    MX: { group: groups.light, marker: "178.21x142.83" },
    MM: { group: groups.light, marker: "611.88x145.84" },
    ME: { group: groups.light, marker: "439.23x90.84" },
    MY: { group: groups.light, marker: "656.41x192.43" },
    NG: { group: groups.light, marker: "417.63x177.04" },
    PK: { group: groups.light, marker: "551.43x123.02" },
    PS: { group: groups.light, marker: "475.46x118.13" },
    RO: { group: groups.light, marker: "449.98x83.27" },
    RU: { group: groups.light, marker: "566.44x45.93" },
    SA: { group: groups.light, marker: "496.85x137.15" },
    SN: { group: groups.light, marker: "367.32x161.23" },
    SB: { group: groups.light, marker: "757.85x223.46" },
    SL: { group: groups.light, marker: "373.87x178.06" },
    SK: { group: groups.light, marker: "438.67x76.19" },
    SE: { group: groups.light, marker: "426.75x48.78" },
    SY: { group: groups.light, marker: "481.91x110.83" },
    TL: { group: groups.light, marker: "681.48x221.31" },
    TW: { group: groups.light, marker: "664.79x139.52" },
    TZ: { group: groups.light, marker: "477.73x215.8" },
    UZ: { group: groups.light, marker: "528.68x92.82" },
    VN: { group: groups.light, marker: "631.82x146.05" },
    ZA: { group: groups.light, marker: "453.56x273.19" },

    // lighter
    AF: { group: groups.lighter, marker: "540.54x114.39" },
    AM: { group: groups.lighter, marker: "492.33x96.62" },
    AQ: { group: groups.lighter, marker: "442.51x387.66" },
    BA: { group: groups.lighter, marker: "436.64x88.06" },
    BI: { group: groups.lighter, marker: "467.04x208.4" },
    BF: { group: groups.lighter, marker: "396.51x167.84" },
    BY: { group: groups.lighter, marker: "452.97x64.72" },
    BO: { group: groups.lighter, marker: "257.13x241.76" },
    BT: { group: groups.lighter, marker: "596.46x130.01" },
    CZ: { group: groups.lighter, marker: "430.49x73.68" },
    HU: { group: groups.lighter, marker: "437.95x80.33" },
    IQ: { group: groups.lighter, marker: "492.55x115.12" },
    KG: { group: groups.lighter, marker: "553.49x94.03" },
    LA: { group: groups.lighter, marker: "626.06x150.57" },
    LU: { group: groups.lighter, marker: "411.67x73.33" },
    MD: { group: groups.lighter, marker: "456.9x80.12" },
    MK: { group: groups.lighter, marker: "444.45x93.72" },
    MN: { group: groups.lighter, marker: "606.59x84.59" },
    MW: { group: groups.lighter, marker: "475.59x231.42" },
    NP: { group: groups.lighter, marker: "582.68x128.57" },
    EH: { group: groups.lighter, marker: "378.27x132.53" },
    SZ: { group: groups.lighter, marker: "468.19x266.45" },
    TD: { group: groups.lighter, marker: "441.74x163.12" },
    UG: { group: groups.lighter, marker: "472.8x196.72" },
    ZW: { group: groups.lighter, marker: "466.06x250.33" }
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
                let country = isocodes[match[1]];
                path = path.replace("/>", " data-marker=\"" + country.marker + "\"/>");
                country.group.push(path);
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