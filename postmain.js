let timeElement = document.getElementById("time");
let dateElement = document.getElementById("date");

let weatherIconElement = document.getElementById("weather_icon");
let weatherTempElement = document.getElementById("weather_text")

let commandDropdown = document.getElementById("dropdown_menu")
let commandButton = document.getElementById("currently_selected");
let commandText = document.getElementById("command_text");
let commandIcon = document.getElementById("command_icon");
let dropdownMenu = document.getElementById("command_dropdown");
let dropdownValuesElement = document.getElementById("dropdown_values");

let bookmarkElement = document.getElementById("bookmarks");
// Change Time
function setTimeAndPeriod(time = new Date()) {
    let hour = time.getHours();
    let mins = time.getMinutes();
    let am_pm = "AM";

    if (hour > 12) {
        am_pm = "PM"
    }

    timeElement.innerHTML = hour + ":" + mins + " " + am_pm;
}

function setTimeWithoutPeriod(time = new Date()) {
    let hour = time.getHours();
    let mins = time.getMinutes();

    timeElement.innerHTML = hour + ":" + mins;
}

// Change Date
function setDate(time = new Date()) {
    let month = time.getMonth();
    let day = time.getDay();

    let monthNumToText = {
        0: "Jan",
        1: "Feb",
        2: "Mar",
        3: "Apr",
        4: "May",
        5: "Jun",
        6: "Jul",
        7: "Aug",
        8: "Sep",
        9: "Oct",
        10: "Nov",
        11: "Dec",
    }

    dateElement.innerHTML = monthNumToText[month] + " " + day;
}

// Change Weather
function setWeather() {
    function success(position) {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;

        localStorage.setItem("lat", lat);
        localStorage.setItem("long", long);
    }

    if (navigator.geolocation && localStorage.getItem("lat") == null) {
        let location = navigator.geolocation.getCurrentPosition(success);
    }

    let lat = localStorage.getItem("lat");
    let long = localStorage.getItem("long");

    if (lat != null) {
        let fetchString = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + long + "&current_weather=true&temperature_unit=fahrenheit";
        console.log(fetchString)
        fetch(fetchString)
            .then((response) => response.json())
            .then((data) => {
                let temp = data["current_weather"]["temperature"]
                let weatherCode = data["current_weather"]["weathercode"]

                let time = new Date();
                sun = {
                    0: "sun.svg",
                    1: "cloud-sun.svg",
                    2: "cloud-sun.svg",
                    3: "cloud-sun.svg",
                };
                moon = {
                    0: "moon.svg",
                    1: "cloud-moon.svg",
                    2: "cloud-moon.svg",
                    3: "cloud-moon.svg",
                };
                otherWeatherCodes = {
                    45: "cloud-fog.svg",
                    48: "cloud-fog.svg",
                    51: "cloud-drizzle.svg",
                    53: "cloud-drizzle.svg",
                    55: "cloud-drizzle.svg",
                    56: "cloud-drizzle.svg",
                    57: "cloud-drizzle.svg",
                    61: "cloud-rain.svg",
                    63: "cloud-rain.svg",
                    65: "cloud-rain.svg",
                    66: "cloud-rain.svg",
                    67: "cloud-rain.svg",
                    71: "cloud-snow.svg",
                    73: "cloud-snow.svg",
                    75: "cloud-snow.svg",
                    77: "cloud-snow.svg",
                    80: "cloud-rain.svg",
                    81: "cloud-rain.svg",
                    82: "cloud-rain.svg",
                    85: "cloud-snow.svg",
                    86: "cloud-snow.svg",
                    95: "cloud-lightning.svg",
                    96: "cloud-lightning.svg",
                    99: "cloud-lightning.svg",
                };

                if(time.getHours() > 7 && time.getHours < 19){
                    var codeToIconPath = Object.assign({}, sun, otherWeatherCodes);
                }
                else {
                    var codeToIconPath = Object.assign({}, moon, otherWeatherCodes);
                }

                let icon = codeToIconPath[weatherCode];
                weatherIconElement.src = "./weather icons/" + icon;

                weatherTempElement.innerHTML = Math.floor(temp) + "°F";

            })
    }
}

// Make Dropdown Functional
function setDropdown(){
    let dropdownValues = ["google", "user", "browse", "reddit", "youtube" , "twitch", "duckduckgo", "bing"];
    let dropdownValuesWithIcons =  {
        "google": "search.svg",
        "user": "arrow-right.svg",
        "browse": "globe.svg",
        "reddit": "user.svg",
        "youtube" : "tv.svg",
        "twitch": "youtube.svg",
        "duckduckgo": "search.svg",
        "bing": "search.svg"
    }
    let currently_selected = commandText.innerHTML.toLowerCase();
    
    for (let dropdownValue of dropdownValues){
        if (dropdownValue.toLocaleLowerCase() != currently_selected.toLocaleLowerCase()){
            let dropdownElement = document.createElement("li");
            let dropdownElementText = document.createElement("p");
            let dropdownIcon = document.createElement("img");
        
            dropdownElement.className = "dropdown_option";
            dropdownElementText.innerHTML = dropdownValue.charAt(0).toLocaleUpperCase() + dropdownValue.slice(1);
            dropdownIcon.className = "icon";
            dropdownIcon.src = "./icons/" + dropdownValuesWithIcons[dropdownValue];
            
            dropdownElement.appendChild(dropdownElementText);
            dropdownElement.appendChild(dropdownIcon);
        
            dropdownElement.addEventListener("click", function() {
                dropdownMenu.setAttribute("data-dropdown-visibility","invisible");
                commandDropdown.setAttribute("data-dropdown-visibility","invisible");
        
                commandText.innerHTML = dropdownValue.charAt(0).toLocaleUpperCase() + dropdownValue.slice(1);
                commandIcon.src = "./icons/" + dropdownValuesWithIcons[dropdownValue];
                dropdownValuesElement.innerHTML = "";
                setDropdown();
            })
            dropdownValuesElement.appendChild(dropdownElement);
        }

    }
}

// Change Image + Colors
// Bookmarks

// Main
let time = new Date();
let secondsLeftInMin = 60 - time.getSeconds();

setTimeAndPeriod(time)
setDate(time)
setWeather()

setTimeout(() => {
    setTimeAndPeriod()
    setInterval(setTimeAndPeriod, 60000)
}, secondsLeftInMin * 1000);

setDropdown()

commandButton.addEventListener("click", function() {
    if (dropdownMenu.getAttribute("data-dropdown-visibility") == "invisible"){
        dropdownMenu.setAttribute("data-dropdown-visibility","visible")
        commandDropdown.setAttribute("data-dropdown-visibility","visible")
    }
    else {
        dropdownMenu.setAttribute("data-dropdown-visibility","invisible")
        commandDropdown.setAttribute("data-dropdown-visibility","invisible")
    }
  });
