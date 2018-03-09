class CountryInflater {
    
    static inflate(data) {
        let countries = {};
        for(let country of data) {
            countries[country[0]] = {
                name: country[1],
                capital: [country[2]],
                language: [country[3]],
                demonym: [this.flattenDemonyms(country[4])]
            };
        }
        return countries;
    }

    static flattenDemonyms(demonyms) {
        let flattened = [];
        for(let demonym of demonyms) {
            flattened.push(...demonym);
        }
        return flattened;
    }
}
    
export default CountryInflater;