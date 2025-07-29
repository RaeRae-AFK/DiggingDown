let map;
let clickedLocation = null;
let geocoder;
let allMarkers = [];
const weatherKey = "4bc0396732568dd45097d32338ec0411";

const confirmBtn = document.getElementById("confirmBtn");
const status = document.getElementById("status");
const result = document.getElementById("result");

function initMap() {
  geocoder = new google.maps.Geocoder();

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 0, lng: 0 },
    zoom: 2,
  });

  map.addListener("click", (event) => {
    clickedLocation = event.latLng;

    const startMarker = new google.maps.Marker({
        position: clickedLocation,
        map,
        title: "Start Digging",
        icon: {
          url: "images/shovel.png",
          scaledSize: new google.maps.Size(32, 32)
        }
      });
      allMarkers.push(startMarker);
      

    confirmBtn.disabled = false;
    // status.textContent = "";
    result.innerHTML = "";
  });
}

//reset button logic
document.getElementById("resetBtn").addEventListener("click", () => {
    // Remove all markers from the map
    allMarkers.forEach(marker => marker.setMap(null));
    allMarkers = [];
  
    // Reset interface
    clickedLocation = null;
    confirmBtn.disabled = true;
    status.textContent = "";
    result.innerHTML = "";
  });
  

confirmBtn.addEventListener("click", () => {
  if (!clickedLocation) return;

  confirmBtn.disabled = true;
  status.textContent = "Digging...";
  result.innerHTML = "";

  setTimeout(() => {
    const lat = -clickedLocation.lat();
    const lng = clickedLocation.lng() > 0
      ? clickedLocation.lng() - 180
      : clickedLocation.lng() + 180;

    const dest = { lat, lng };

    const rockMarker = new google.maps.Marker({
        position: dest,
        map,
        title: "You dug here!",
        icon: {
          url: "images/dirt.png",
          scaledSize: new google.maps.Size(40, 40)
        }
      });
      allMarkers.push(rockMarker);
      

    getLocationInfo(lat, lng);
  }, 3000);
});

function getLocationInfo(lat, lng) {
    geocoder.geocode({ location: { lat, lng } }, (results, statusCode) => {
      if (statusCode === "OK" && results.length > 0) {
        const place = results[0].formatted_address;
        getWeather(lat, lng, place);
      } else {
        getWeather(lat, lng, null);
      }
    });
  }
  

  function getWeather(lat, lng, placeName) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${weatherKey}`;
  
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.cod !== 200 || !data.main || !data.weather) {
          throw new Error("Invalid weather data");
        }
  
        const temp = Math.round(data.main.temp);
        const weather = data.weather[0].description;
  
        let locationText = "";
  
        if (placeName) {
          locationText = `<strong>${placeName}</strong>`;
        } else {
          locationText = `<strong>Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}</strong>`;
        }
  
        result.innerHTML = `
          <p>You reached: ${locationText}</p>
          <p>Temperature: ${temp}°C</p>
          <p>Weather: ${weather}</p>
        `;
        status.textContent = "You made it!";
      })
      .catch((err) => {
        console.error("Weather error:", err);
        result.innerHTML = `
          <p>You reached: <strong>Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}</strong></p>
          <p>Weather info unavailable.</p>
        `;
        status.textContent = "You made it!";
      });
  }
  
  
  
