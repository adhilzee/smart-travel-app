const apiKey = API_KEY;

// Crowd Monitoring

let crowdLevel = Math.floor(Math.random() * 100);

let crowdStatus = "";

if (crowdLevel < 30) {
  crowdStatus = "Low Crowd";
} else if (crowdLevel < 70) {
  crowdStatus = "Medium Crowd";
} else {
  crowdStatus = "High Crowd";
}

document.getElementById("crowd").innerHTML = `
<h2>Smart Crowd Monitoring</h2>
<p><strong>Crowd Level:</strong> ${crowdLevel}%</p>
<p><strong>Status:</strong> ${crowdStatus}</p>
`;

// Live Location Tracking

navigator.geolocation.watchPosition(

  (position) => {

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    console.log("Accuracy:", accuracy, "meters");

    // Weather

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {

        if (data.cod && data.cod != 200) {
          document.getElementById("weather").innerHTML =
            `<h2>Weather Error</h2><p>${data.message}</p>`;
          return;
        }

        document.getElementById("weather").innerHTML = `
        <h2>Weather Monitoring</h2>
        <p><strong>Place:</strong> ${data.name}</p>
        <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Condition:</strong> ${data.weather[0].description}</p>
        `;

        let alertMessage = "No Weather Alerts";

        if (data.weather[0].main === "Rain") {
          alertMessage = "Rain Alert - Carry Umbrella";
        }

        if (data.main.temp > 35) {
          alertMessage = "Heat Alert - Stay Hydrated";
        }

        document.getElementById("alert").innerHTML = `
        <h2>Smart Alert System</h2>
        <p>${alertMessage}</p>
        `;

        let recommendation = "";

        if (crowdLevel < 50 && data.main.temp < 30) {
          recommendation =
            "Perfect time to visit outdoor tourist attractions.";
        } else if (crowdLevel > 70) {
          recommendation =
            "Tourist area is crowded. Consider less busy locations.";
        } else {
          recommendation =
            "Good conditions for travel and sightseeing.";
        }

        document.getElementById("recommendation").innerHTML = `
        <h2>AI Travel Recommendation</h2>
        <p>${recommendation}</p>
        `;
      })
      .catch((error) => console.error(error));

    // AQI

    fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => {

        if (!data.list) return;

        const aqi = data.list[0].main.aqi;

        let quality = "";

        switch (aqi) {
          case 1:
            quality = "Good";
            break;
          case 2:
            quality = "Fair";
            break;
          case 3:
            quality = "Moderate";
            break;
          case 4:
            quality = "Poor";
            break;
          case 5:
            quality = "Very Poor";
            break;
        }

        document.getElementById("aqi").innerHTML = `
        <h2>Air Quality Monitoring</h2>
        <p><strong>AQI:</strong> ${aqi}</p>
        <p><strong>Status:</strong> ${quality}</p>
        `;
      })
      .catch((error) => console.error(error));

    // Reverse Geocoding

    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    )
      .then((response) => response.json())
      .then((data) => {

        const place =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.suburb ||
          "Unknown Location";

        document.getElementById("location").innerHTML = `
        <h2>Traveller Location</h2>
        <p><strong>Place:</strong> ${place}</p>
        <p><strong>Latitude:</strong> ${lat}</p>
        <p><strong>Longitude:</strong> ${lon}</p>
        <p><strong>Accuracy:</strong> ${accuracy.toFixed(0)} meters</p>
        <p><strong>Status:</strong> ${
          accuracy < 50 ? "High Accuracy GPS" : "Approximate Location"
        }</p>
        `;
      })
      .catch((error) => console.error(error));

    // Geofencing

    const touristSpot = {
      lat: 12.9716,
      lon: 77.5946
    };

    function distance(lat1, lon1, lat2, lon2) {

      const R = 6371;

      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    const dist = distance(
      lat,
      lon,
      touristSpot.lat,
      touristSpot.lon
    );

    if (dist < 5) {
      document.getElementById("geofence").innerHTML = `
      <h2>Geofencing Monitor</h2>
      <p>You are inside the Tourist Zone.</p>
      `;
    } else {
      document.getElementById("geofence").innerHTML = `
      <h2>Geofencing Monitor</h2>
      <p>You are outside the Tourist Zone.</p>
      `;
    }
  },

  (error) => {

    document.getElementById("weather").innerHTML =
      "Weather unavailable";

    document.getElementById("location").innerHTML =
      "Location access denied";

    console.error(error);
  },

  {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0
  }
);
