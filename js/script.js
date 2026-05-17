var askPrompt = null;
var button = document.getElementById("install-button");

// CHECK IF INDEX PAGE
function isIndexPage() {
  return (
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname.endsWith("/traveller-pwa/") ||
    window.location.pathname === "/"
  );
}

$(document).ready(function () {
  // LOAD CATEGORIES
  $.ajax({
    url: "https://traveller.talrop.works/api/v1/places/categories/",
    success: function (response) {
      let categories = response.data;
      let html = "";

      categories.forEach((category) => {
        html += `
        <li>
          <a href="#">
            <img class="rest" src="${category.image}" alt="${category.name}" />
            <span>${category.name}</span>
          </a>
        </li>`;
      });

      $("div.head ul").append(html);
    },
  });

  // LOAD PLACES
  $.ajax({
    url: "https://traveller.talrop.works/api/v1/places/",
    success: function (response) {
      let places = response.data;
      let html = "";

      places.forEach((place) => {
        html += `
        <div class="item">
          <a href="detail.html?id=${place.id}">
            <div class="top">
              <img src="${place.image}" alt="${place.name}" />
            </div>
            <div class="middle">
              <h3>${place.name}</h3>
            </div>
            <div class="bottom">
              <img src="images/place.svg" alt="">
              <span>${place.location}</span>
            </div>
          </a>
        </div>`;
      });

      $("div.items").append(html);
    },
  });

  if (button) {
    // Hide if installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      button.style.display = "none";
    }

    button.addEventListener("click", installApp);
  }
});

// REGISTER SERVICE WORKER
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").then(function () {
    console.log("Service worker registered!");
  });
}

// INSTALL FUNCTION
function installApp() {
  if (askPrompt) {
    askPrompt.prompt();

    askPrompt.userChoice.then((result) => {
      if (result.outcome === "accepted") {
        console.log("User installed");
      } else {
        console.log("User dismissed");
      }

      askPrompt = null;
    });
  }
}

// INSTALL PROMPT EVENT
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  askPrompt = event;

  if (button) {
    button.style.display = "block";
  }
});

// AFTER INSTALL
window.addEventListener("appinstalled", () => {
  if (button) {
    button.style.display = "none";
  }
});
