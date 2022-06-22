// Foursquare API Info
const clientId = '1HCAOTKJGEM13JTZWUMRNGZER5HWH5NCYG0NLH2BYFADF3YI';
const clientSecret = 'WYROKEQGPZ1FFPZBP3F2MCD5SE1W5BCRSRRDZWZUYRS5NBHU';
const url = 'https://api.foursquare.com/v2/venues/explore?near=';

// OpenWeather Info
const openWeatherKey = '8e2786b1aa456d5120c40c6b7bcb40cf';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4")];
const $weatherDiv = $("#weather1");
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Add AJAX functions here:
const getVenues = async () => {
  const city = $input.val();
  const urlToFetch = `${url}${city}&limit=10&client_id=${clientId}&client_secret=${clientSecret}&v=20200101`;
  try{
    const response = await fetch(urlToFetch);
    if(response.ok){
      const jsonResponse = await response.json();
      const venues = jsonResponse.response.groups[0].items.map(x =>x.venue);
      console.log(venues);
      return venues;
    }
  }catch(error){
    console.log(error)
  }
}

const getForecast = async () => {
  const city = $input.val();
  const urlToFetch = `${weatherUrl}?q=${city}&appid=${openWeatherKey}`
  try{
    const response = await fetch(urlToFetch);
    if(response.ok){
      const jsonResponse = await response.json();
      console.log(jsonResponse)
      return jsonResponse;
    }
  }catch(error){
    console.log(error);
  }
}


// Render functions
const renderVenues = (venues) => {
  $venueDivs.forEach(($venue, index) => {
    // Add your code here:
    const venue = venues[index];
    const venueIcon = venue.categories[0].icon;
    console.log(venueIcon);
    const venueImgSrc = `${venueIcon.prefix}bg_64${venueIcon.suffix}`;
    let venueContent = `
    <h2>${venue.name}</h2>
    <img class="venueimage" src="${venueImgSrc}"/>
    <h3>Address:</h3>
    <p>${venue.location.formattedAddress[0]}</p>
    <p>>${venue.location.formattedAddress[1]}</p>
    <p>>${venue.location.formattedAddress[2]}</p>
    `;
    $venue.append(venueContent);
  });
  $destination.append(`<h2>${venues[0].location.city}</h2>`);
}

const renderForecast = (day) => {
  // Add your code here:
  const iconId = day.weather[0].icon;
  const iconSrc = `http://openweathermap.org/img/wn/${iconId}@2x.png`;
  const kelvinToFahrenheit = k => ((k - 273.15) * 9 / 5 + 32).toFixed(0);
	let weatherContent = `
  <h2> High: ${kelvinToFahrenheit(day.main.temp_max)}</h2>
  <h2> Low: ${kelvinToFahrenheit(day.main.temp_min)}</h2>
  <img src="${iconSrc}" class="weathericon" />
  <h2>${weekDays[(new Date()).getDay()]}</h2>
  `;
  $weatherDiv.append(weatherContent);
}

const executeSearch = () => {
  $venueDivs.forEach(venue => venue.empty());
  $weatherDiv.empty();
  $destination.empty();
  $container.css("visibility", "visible");
  getVenues().then(venues =>renderVenues(venues))
  getForecast().then(forecast =>renderForecast(forecast))
  return false;
}

$submit.click(executeSearch)