"use strict";

(() => {

  const getData = async url => {
    return fetch(url).then(response => response.json());
  }

  const generateRegionTable = countries => [...new Set(countries.map(country => country.region))]
      .map(region => ({
        region,
        count: countries.filter(country => country.region === region).length
      }))
      .map(({region, count}) => `
          <tr>
            <td>${region}</td>
            <td>${count}</td>
          </tr>
      `)
      .reduce((acc, current) => `${acc}${current}`, '');

  const generateCurrencyTable = countries => [...new Set(countries
      .map(country => country.currencies ? Object.keys(country.currencies)[0] : undefined)
      .filter(currency => currency !== undefined)
    )]
    .map(currency => ({
      currency,
      count: countries.filter(country => country.currencies && Object.keys(country.currencies)[0] === currency).length
    }))
    .map(({currency, count}) => `
        <tr>
          <td>${currency}</td>
          <td>${count}</td>
        </tr>
    `)
    .reduce((acc, current) => `${acc}${current}`, '');
      
  const generateStatsTable = countries => {
    const totalCountries = countries.length;
    const totalPopulation = countries.reduce((acc, current) => acc + current.population, 0);
    const averagePopulation = totalPopulation/totalCountries;
    return `
        <tr>
          <td>Total Countries :</td>
          <td>${totalCountries}</td>
        </tr>

        <tr>
          <td>Total Countries Population: :</td>
          <td>${totalPopulation}</td>
        </tr>

        <tr>
          <td>Average Population :</td>
          <td>${averagePopulation}</td>
        </tr>
    `
  }

  const generateCountriesTable = countries => {
    const newHTML = countries
      .map(({name, population}) => `
          <tr>
            <td>${name.common}</td>
            <td>${population}</td>
          </tr>
      `)
      .reduce((acc, current) => `${acc}${current}`, '')
    return newHTML;
  }

  const renderCountriesTable = newHTML => document.getElementById("countriesContainer").innerHTML = newHTML;
  const renderStatsTable = newHTML => document.getElementById("countriesStats").innerHTML = newHTML;
  const renderStatsTablePerRegion = newHTML => document.getElementById("countriesStatsPerRegion").innerHTML = newHTML;
  const renderStatsTablePerCurrency = newHTML => document.getElementById("countriesStatsPerCurrency").innerHTML = newHTML;

  document.getElementById("displayCountries").addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      // Get data
      const countries = await getData("https://restcountries.com/v3.1/all");

      // Generate HTML
      const countriesHTML = generateCountriesTable(countries);
      const statsHTML = generateStatsTable(countries);
      const statsRegionHTML = generateRegionTable(countries);
      const statsCurrencyHTML = generateCurrencyTable(countries);

      // Render HTML
      renderCountriesTable(countriesHTML);
      renderStatsTable(statsHTML);
      renderStatsTablePerRegion(statsRegionHTML);
      renderStatsTablePerCurrency(statsCurrencyHTML);
    } catch (error) {
      console.warn(error);
    }
  })


  document.getElementById("displayCountry").addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      // Get Country
      const country = document.getElementById("country").value;

      // Get data
      const countries = await getData(`https://restcountries.com/v3.1/name/${country}`);

      // Generate HTML
      const countriesHTML = generateCountriesTable(countries);
      const statsHTML = generateStatsTable(countries);
      const statsRegionHTML = generateRegionTable(countries);
      const statsCurrencyHTML = generateCurrencyTable(countries);

      // Render HTML
      renderCountriesTable(countriesHTML);
      renderStatsTable(statsHTML);
      renderStatsTablePerRegion(statsRegionHTML);
      renderStatsTablePerCurrency(statsCurrencyHTML);
    } catch (error) {
      console.warn(error);
    }
  })
})();