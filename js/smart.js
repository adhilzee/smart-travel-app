// API KEY

const apiKey = "afe2eb0d5a4738565795c7e0f87a18ec";

// LOCATION + WEATHER

navigator.geolocation.getCurrentPosition(
  (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // WEATHER API

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
    )
      .then((response) => response.json())

      .then((data) => {
        document.getElementById("weather").innerHTML = `

          <h2>Weather Monitoring</h2>

          <p><strong>Place:</strong> ${data.name}</p>

          <p><strong>Temperature:</strong> ${data.main.temp} °C</p>

          <p><strong>Humidity:</strong> ${data.main.humidity}%</p>

          <p><strong>Condition:</strong> ${data.weather[0].description}</p>

        `;
      })

      .catch(() => {
        document.getElementById("weather").innerHTML =
          "Unable to load weather data.";
      });

    // LIVE LOCATION

    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
    )
      .then((response) => response.json())

      .then((data) => {
        const place =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          "Unknown Location";

        document.getElementById("location").innerHTML = `

          <h2>Traveller Location</h2>

          <p><strong>Place:</strong> ${place}</p>

          <p><strong>Latitude:</strong> ${lat}</p>

          <p><strong>Longitude:</strong> ${lon}</p>

        `;
      })

      .catch(() => {
        document.getElementById("location").innerHTML =
          "Unable to load location data.";
      });
  },

  () => {
    document.getElementById("location").innerHTML = "Location access denied.";

    document.getElementById("weather").innerHTML =
      "Unable to load weather data.";
  },
);

// SIMULATED IOT SENSOR DATA

let crowdLevel = Math.floor(Math.random() * 100);

let status = "";

if (crowdLevel < 30) {
  status = "Low Crowd";
} else if (crowdLevel < 70) {
  status = "Medium Crowd";
} else {
  status = "High Crowd";
}

document.getElementById("crowd").innerHTML = `

    <h2>Smart Crowd Monitoring</h2>

    <p><strong>Crowd Level:</strong> ${crowdLevel}%</p>

    <p><strong>Status:</strong> ${status}</p>

`;
