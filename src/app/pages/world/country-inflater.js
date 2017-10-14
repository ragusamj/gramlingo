class CountryInflater {
    
    inflate(data) {

        let countries = {};

        for(let country of data) {
            countries[country[0]] =  {
                name: country[1]
            };
        }

        return countries;
    }
}
    
export default CountryInflater;