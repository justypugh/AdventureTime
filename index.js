const apiKey = 'ZqTk40zhb5FFd26wfUY80MBLeNA2TZ2Ug1XEB5Uq';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
return queryItems.join('&');
}

function getParks(query, maxResults=10) {
    let queryArray = query.split(", ");
    console.log(queryArray);
    const params = {
        stateCode: queryArray,
        limit: maxResults,
        api_key: apiKey,
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;

    console.log(url);

    fetch(url)
    .then(response => {
        if(response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(error => {
        $("#js-error-message").text(`Something went wrong: ${error.message}`);
    });
}

function displayResults(responseJson) {
    console.log(responseJson);
    $("#results-list").empty();
    for(let i = 0; i < responseJson.data.length; i++) {
        $("#results-list").append(`
            <li>
                <h2>${responseJson.data[i].fullName}</h2>
                <p>${responseJson.data[i].description}</p>
                <a target='_blank' href='${responseJson.data[i].url}'>Visit the website here!</a>
            </li>
            <iframe width="600" height="450" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?q=Golden%20Gate%20National%20Recreation%20Area&key=AIzaSyD8s0pdEnASwcTM6Sns0MkM33S5ZLsrRHQ" allowfullscreen></iframe>

        `)};
    $("#results").removeClass("hidden");    
};


function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      const searchTerm = $('#js-search-term').val();
      const maxResults = $('#js-max-results').val();
      getParks(searchTerm, maxResults);
    });
  }
  
  $(watchForm);