let map;
let clickedLocation = null;
let geocoder;

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

    new google.maps.Marker({
        position: clickedLocation,
        map,
        title: "Start Digging",
        icon: {
          url: "https://cdn-icons-png.flaticon.com/512/808/808404.png",
          scaledSize: new google.maps.Size(40, 40)
        }
      });
      

    confirmBtn.disabled = false;
    status.textContent = "";
    result.innerHTML = "";
  });
}

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

    new google.maps.Marker({
        position: dest,
        map,
        title: "You dug here!",
        icon: {
          url: "https://em-content.zobj.net/thumbs/240/apple/354/rock_1faa8.png",
          scaledSize: new google.maps.Size(40, 40)
        }
      });
      

    getLocationInfo(lat, lng);
  }, 3000);
});

function getLocationInfo(lat, lng) {
  geocoder.geocode({ location: { lat, lng } }, (results, statusCode) => {
    if (statusCode === "OK") {
      const place = results[0]?.formatted_address || "Unknown location";
      getWeather(lat, lng, place);
    } else {
      result.innerHTML = "<p>Couldn't find the location name.</p>";
    }
  });
}

function getWeather(lat, lng, placeName) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${weatherKey}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const temp = Math.round(data.main.temp);
      const weather = data.weather[0].description;

      result.innerHTML = `
        <p>You reached: <strong>${placeName}</strong></p>
        <p>Temperature: ${temp}°C</p>
        <p>Weather: ${weather}</p>
      `;
      status.textContent = "You made it!";
    })
    .catch(() => {
      result.innerHTML = "<p>Weather info unavailable.</p>";
    });
}
