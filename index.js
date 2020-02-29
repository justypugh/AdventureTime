
// formats parameters to insert into the NPS URL
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
return queryItems.join('&');
}
// ////////////////////////////////////////////////

// Accesses the NPS API to request a park based off of the state(s) & number of results user inputs
function getParks(query, maxResults=10) {
    const searchURL = 'https://developer.nps.gov/api/v1/parks';
    let queryArray = query.split(", ");
    const params = {
        stateCode: queryArray,
        limit: maxResults,
        api_key: NpsApiKey,
        fields: ["images"]
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;

    fetch(url)
    .then(response => {
        if(response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(error => {
        $("#js-error-message").text(`Something went wrong: ${error.message}. Please enter a new search.`);
    });
}
// ///////////////////////////////////////////////////////////

// formats the national park name from the NPS API data to be able to be used in the Google Maps API url
function formatGoogleParams(fullName) {
    // split the string into individual words
    const stringName = fullName.split(" &").join("+");
    return stringName;
};

// displays the results of the search
function displayResults(responseJson) {
    $("#results-list").empty();
    if(responseJson.data.length === 0) {
        $("#results-list").append(
            "<div class='error-message'>Sorry, no results, please try again</div>"
        )
    }
    for(let i = 0; i < responseJson.data.length; i++) {
        let imageHTML;
        let latLongString;
        let weatherInfoString;
        if(responseJson.data[i].images.length > 0) {
             imageHTML = `<img src="${responseJson.data[i].images[0].url}" alt="${responseJson.data[i].images[0].altText}" />`;
        } else {
             imageHTML = "<div class='info'>Sorry, no image available.</div>";
        }
        if(responseJson.data[i].latLong) {
            latLongString = `<p class="info latLong">${responseJson.data[i].latLong}</p>`;
        } else {
            latLongString = "<div class='info'>Sorry, no coordinates available.</div>";
        }
        if(responseJson.data[i].weatherInfo) {
            weatherInfoString = `<p class="info">${responseJson.data[i].weatherInfo}</p>`;
        } else {
            weatherInfoString = "<div class='info'>Sorry, no weather data available.</div>";
        }
        let formattedGoogle =  formatGoogleParams(responseJson.data[i].fullName);
        $("#results-list").append(`
            <li>
                <h2 class="name">${responseJson.data[i].fullName}</h2>
                
                <h3>What are the coordinates for this place?</h3>
                ${latLongString}
                <h3>Can you tell me a little bit about it?</h3>
                <p class="info">${responseJson.data[i].description}</p>
                <h3>What is the weather like there?</h3>
                ${weatherInfoString}
                <h3>Is there a website I can visit?</h3>
                <a target='_blank' href='${responseJson.data[i].url}'>Visit the website here!</a>
                <br/>
                ${imageHTML}
                <iframe width="600" height="450" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/search?q=${formattedGoogle}&key=${googleApiKey}" allowfullscreen></iframe>
            </li>
            
        `)};
    $("#results").removeClass("hidden");    
};
// /////////////////////////////////////////////////

function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      const searchTerm = $('#js-search-term').val();
      const maxResults = $('#js-max-results').val();
      getParks(searchTerm, maxResults);
    });
  }
  
  $(watchForm);