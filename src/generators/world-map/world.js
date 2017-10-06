const d3GeoProjection = require("d3-geo-projection");
const shapefile = require("shapefile");
const topojson = require("topojson");

const shp = __dirname + "/naturalearth/ne_110m_admin_0_countries/ne_110m_admin_0_countries.shp";
const height = 810;
const width = 1600;
const quantization = 1e3; // powers of ten, 1e4, 1e5, 1e6...
const simplificationMinWeight = 0.00000001;

shapefile
    .read(shp)
    .then((geojson) => {

        let projection = d3GeoProjection.geoRobinson().fitSize([width, height], geojson);
        let projected = d3GeoProjection.geoProject(geojson, projection);
        let topology = topojson.topology({ world: projected }, quantization);
        let transform = topology.transform;
        let presimplified = topojson.presimplify(topology, topology.planarTriangleArea);
        let simplified = topojson.simplify(presimplified, simplificationMinWeight);
        let quantized = topojson.quantize(simplified, transform);

        for(let geometry of quantized.objects.world.geometries) {
            let iso = geometry.properties.iso_a2;
            geometry.properties = {
                iso: iso,
                colorIndex: colors[iso] 
            };
        }

        process.stdout.write(JSON.stringify(quantized, null, 2) + "\n");
    })
    .catch(error => process.stderr.write(error.stack));

const colors = {
        
    // dark
    AL: 0,
    AR: 0,
    AT: 0,
    BG: 0,
    BN: 0,
    BW: 0,
    CM: 0,
    CD: 0,
    CO: 0,
    DJ: 0,
    FR: 0,
    GE: 0,
    GN: 0,
    GM: 0,
    GT: 0,
    GY: 0,
    HR: 0,
    HT: 0,
    IN: 0,
    IR: 0,
    IL: 0,
    KZ: 0,
    KE: 0,
    LV: 0,
    MZ: 0,
    MR: 0,
    NC: 0,
    NE: 0,
    NL: 0,
    NO: 0,
    OM: 0,
    PH: 0,
    PG: 0,
    PL: 0,
    KP: 0,
    QA: 0,
    SD: 0,
    TG: 0,
    TH: 0,
    TJ: 0,
    TN: 0,
    US: 0,
        
    // normal
    AE: 1,
    AZ: 1,
    BE: 1,
    BJ: 1,
    BD: 1,
    BS: 1,
    BZ: 1,
    CA: 1,
    CH: 1,
    CN: 1,
    CG: 1,
    DK: 1,
    EE: 1,
    ER: 1,
    FI: 1,
    FK: 1,
    GH: 1,
    GW: 1,
    GQ: 1,
    ID: 1,
    IE: 1,
    IS: 1,
    JM: 1,
    JO: 1,
    JP: 1,
    KH: 1,
    KW: 1,
    LB: 1,
    LR: 1,
    LY: 1,
    LK: 1,
    LS: 1,
    LT: 1,
    MA: 1,
    ML: 1,
    NA: 1,
    NI: 1,
    NZ: 1,
    PA: 1,
    PE: 1,
    PR: 1,
    PT: 1,
    PY: 1,
    RW: 1,
    SS: 1,
    SV: 1,
    SO: 1,
    RS: 1,
    SR: 1,
    SI: 1,
    TM: 1,
    TT: 1,
    TR: 1,
    UA: 1,
    UY: 1,
    VE: 1,
    VU: 1,
    YE: 1,
    ZM: 1,
        
    // light
    AO: 2,
    TF: 2,
    AU: 2,
    BR: 2,
    CF: 2,
    CL: 2,
    CI: 2,
    CR: 2,
    CU: 2,
    CY: 2,
    DE: 2,
    DO: 2,
    DZ: 2,
    EC: 2,
    EG: 2,
    ES: 2,
    ET: 2,
    FJ: 2,
    GA: 2,
    GB: 2,
    GR: 2,
    GL: 2,
    HN: 2,
    IT: 2,
    KR: 2,
    MG: 2,
    MX: 2,
    MM: 2,
    ME: 2,
    MY: 2,
    NG: 2,
    PK: 2,
    PS: 2,
    RO: 2,
    RU: 2,
    SA: 2,
    SN: 2,
    SB: 2,
    SL: 2,
    SK: 2,
    SE: 2,
    SY: 2,
    TL: 2,
    TW: 2,
    TZ: 2,
    UZ: 2,
    VN: 2,
    ZA: 2,
        
    // lighter
    AF: 3,
    AM: 3,
    AQ: 3,
    BA: 3,
    BI: 3,
    BF: 3,
    BY: 3,
    BO: 3,
    BT: 3,
    CZ: 3,
    HU: 3,
    IQ: 3,
    KG: 3,
    LA: 3,
    LU: 3,
    MD: 3,
    MK: 3,
    MN: 3,
    MW: 3,
    NP: 3,
    EH: 3,
    SZ: 3,
    TD: 3,
    UG: 3,
    ZW: 3
};