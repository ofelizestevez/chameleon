// ==============================================
// Initialize elements
// ==============================================
let timeElement = document.getElementById("time");
let dateElement = document.getElementById("date");

let weatherIconElement = document.getElementById("weather_icon");
let weatherTempElement = document.getElementById("weather_text");

let usernameElement = document.getElementById("username");
let commandDropdown = document.getElementById("dropdown_menu");
let commandButton = document.getElementById("currently_selected");
let commandText = document.getElementById("command_text");
let commandIcon = document.getElementById("command_icon");
let commandInput = document.getElementById("command_input");
let suggestionElement = document.getElementById("suggestion_text");

let dropdownMenu = document.getElementById("command_dropdown");
let dropdownValuesElement = document.getElementById("dropdown_values");

let bookmarkElement = document.getElementById("bookmarks");

let imageElement = document.getElementById("image");

// ==============================================
// Useful Functions
// ==============================================

// RGB to Hex
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// Change Time
function setTime(uFormat = "") {
    let time;
    if(uFormat != ""){
        time = moment().format(uFormat);
    }
    else {
        time = MilitaryTime ? moment().format("HH:mm") : moment().format("hh:mm");
        time += !MilitaryTime && timePeriodEnabled ? " " + moment().format("A") : "";
    }

    timeElement.innerHTML = time;
}

// Change Date
function setDate(uFormat = "") {
    let retString;
    if (uFormat != ""){
        retString = moment().format(uFormat);
    }
    else {
        retString = moment().format("MMM D");
    }

    dateElement.innerHTML = retString;
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
        let fetchString = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + long + "&current_weather=true";
        fetchString += useFahrenheit ?  "&temperature_unit=fahrenheit" : "";

        fetch(fetchString)
            .then((response) => response.json())
            .then((data) => {
                let temp = data["current_weather"]["temperature"];
                let weatherCode = data["current_weather"]["weathercode"];

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
                
                let codeToIconPath = (time.getHours() > 7 && time.getHours() < 19) ? Object.assign({}, sun, otherWeatherCodes) : Object.assign({}, moon, otherWeatherCodes);
                let icon = codeToIconPath[weatherCode];
                weatherIconElement.src = "./weather icons/" + icon;

                let retString = Math.floor(temp) + "°";
                retString += useFahrenheit ? "F": "C";
                weatherTempElement.innerHTML = retString;

            })
    }
}

// Make Dropdown Functional
function setDropdown() {
    let dropdownValues = ["google", "command", "browse", "reddit", "youtube", "twitch", "duckduckgo", "bing"];
    let dropdownValuesWithIcons = {
        "google": "search.svg",
        "command": "arrow-right.svg",
        "browse": "globe.svg",
        "reddit": "user.svg",
        "youtube": "tv.svg",
        "twitch": "youtube.svg",
        "duckduckgo": "search.svg",
        "bing": "search.svg"
    }

    let currently_selected = localStorage.getItem("currentCommand");
    commandText.innerHTML = currently_selected.charAt(0).toLocaleUpperCase() + currently_selected.slice(1);
    commandIcon.src = "./icons/" + dropdownValuesWithIcons[currently_selected];

    for (let dropdownValue of dropdownValues) {
        if (dropdownValue.toLocaleLowerCase() != currently_selected.toLocaleLowerCase()) {
            let dropdownElement = document.createElement("li");
            let dropdownElementText = document.createElement("p");
            let dropdownIcon = document.createElement("img");

            dropdownElement.classList.add("dropdown_option");
            dropdownElementText.innerHTML = dropdownValue.charAt(0).toLocaleUpperCase() + dropdownValue.slice(1);
            dropdownIcon.classList.add("command_icon");
            dropdownIcon.src = "./icons/" + dropdownValuesWithIcons[dropdownValue];

            dropdownElement.appendChild(dropdownElementText);
            dropdownElement.appendChild(dropdownIcon);

            dropdownElement.addEventListener("click", function () {
                dropdownMenu.setAttribute("data-dropdown-visibility", "invisible");
                commandDropdown.setAttribute("data-dropdown-visibility", "invisible");

                commandText.innerHTML = dropdownValue.charAt(0).toLocaleUpperCase() + dropdownValue.slice(1);
                commandIcon.src = "./icons/" + dropdownValuesWithIcons[dropdownValue];
                dropdownValuesElement.innerHTML = "";
                localStorage.setItem("currentCommand", dropdownValue);
                setDropdown();
            })
            dropdownValuesElement.appendChild(dropdownElement);
        }
    }
}

// Change Image + Colors
function setImageUnsplash() {
    // Get Random Image From Unsplash
    fetch("https://source.unsplash.com/random/")
        .then((response) => {
            let url = response.url;
            img.crossOrigin = "Anonymous";
            img.src = url;
        })
}

// Bookmarks
function setBookmarks() {
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks"))

    for (let column of Object.entries(bookmarks)) {
        let columnTitle = column[0];
        let columnLinks = column[1];

        let columnTitleElement = document.createElement("h1");
        let columnWrapper = document.createElement("div");
        let columnLinkWrapper = document.createElement("ul");

        columnWrapper.classList.add("column");
        columnTitleElement.classList.add("title");
        columnLinkWrapper.classList.add("links");

        columnTitleElement.innerHTML = columnTitle;
        for (let link of Object.entries(columnLinks)) {
            let linkElement = document.createElement("li");
            let linkChildElement = document.createElement("a");

            linkChildElement.innerHTML = link[0];
            linkChildElement.href = link[1];

            linkElement.appendChild(linkChildElement);
            columnLinkWrapper.appendChild(linkElement);
        }

        columnWrapper.appendChild(columnTitleElement);
        columnWrapper.appendChild(columnLinkWrapper);

        bookmarkElement.appendChild(columnWrapper);
    }
}

// Username
function setUsername(){
    if (localStorage.getItem("username") != null){
        usernameElement.innerHTML = localStorage.getItem("username") + "@";
    
    }
}
// ==============================================
// Command Functions
// ==============================================
function googleCommand(q) {
    q = encodeURIComponent(q)
    url = 'http://www.google.com/search?q=' + q;
    window.open(url);
}

function userCommand(s){
    function username(s){
        // localstorage username
        localStorage.setItem("username", s)
        setUsername();
    }
    function gmail(s){
        // if s is num then use one link
        // else use normal link
    }
    function gdrive(s){
        // if s is num then use one link
        // else use normal link
    }
}

function browseCommand(s){
    s = s.includes("https://") || s.includes("http://") ? s : "https://" + s;
    s = s.includes('.') ? s : s + ".com";
    url = s;
    window.open(url);
    // get string
    // if missing https or http, then add it
    // if missing a dot, then add .com
    // run it
}

function redditCommand(s){
    // get string
    // split it into each word
    // if split [0] equals r
    // else if split[0] equals u
    // else search
}

function youtubeCommand(s){
    // get string
    // split 
    // if split[0] == c
    // else search
}

function twitchCommand(s){
    // get string
    // split
    // if split[0]
    // d = directory
    // c = channel
    // else search
}

function duckduckgoCommand(s){}

function bingCommand(s){}

// ==============================================
// Main
// ==============================================
let time = new Date();
let secondsLeftInMin = 60 - time.getSeconds();

setTime()
setDate()
setWeather()

setTimeout(() => {
    setTime()
    setInterval(setTime, 60000)
}, secondsLeftInMin * 1000);

setDropdown()
setBookmarks()
setUsername()

const colorThief = new ColorThief();
const img = new Image();

img.addEventListener("load", function () {
    let imagePalette = colorThief.getPalette(img, 2)
    let imagePaletteHex = []
    for (let colorRGB of imagePalette) {
        imagePaletteHex.push(rgbToHex(colorRGB[0], colorRGB[1], colorRGB[2]))
    }

    let mainForegroundColor = "";
    let mainInvertValue = "";
    let secondaryForegroundColor = "";
    let secondaryInvertValue = "";

    root.style.setProperty("--background-image", 'url("' + img.src + '")')
    root.style.setProperty("--main-background-color", imagePaletteHex[0])
    if ((0.299 * imagePalette[0][0] + 0.587 * imagePalette[0][1] + 0.114 * imagePalette[0][2]) / 255 > 0.5) {
        mainForegroundColor = "#000000"
        mainInvertValue = "0%"
    }
    else {
        root.style.setProperty("--main-foreground-color", "#FFFFFF")
        mainForegroundColor = "#FFFFFF"
        mainInvertValue = "100%"
    }
    root.style.setProperty("--secondary-background-color", imagePaletteHex[1])
    if ((0.299 * imagePalette[1][0] + 0.587 * imagePalette[1][1] + 0.114 * imagePalette[1][2]) / 255 > 0.5) {
        secondaryForegroundColor = "#000000";
        secondaryInvertValue = "0%";
    }
    else {
        secondaryForegroundColor = "#FFFFFF"
        secondaryInvertValue = "100%"
    }

    root.style.setProperty("--background-image", 'url("' + img.src + '")')
    root.style.setProperty("--main-background-color", imagePaletteHex[0])
    root.style.setProperty("--main-foreground-color", mainForegroundColor)
    root.style.setProperty("--main-invert-value", mainInvertValue)
    root.style.setProperty("--secondary-background-color", imagePaletteHex[1])
    root.style.setProperty("--secondary-foreground-color", secondaryForegroundColor)
    root.style.setProperty("--secondary-invert-value", secondaryInvertValue)
    root.style.setProperty("--suggestion-color", mainForegroundColor + "4D")

    localStorage.setItem("background-image", img.src);
    localStorage.setItem("main-background-color", imagePaletteHex[0]);
    localStorage.setItem("main-foreground-color", mainForegroundColor);
    localStorage.setItem("main-invert-value", mainInvertValue);
    localStorage.setItem("secondary-background-color", imagePaletteHex[1]);
    localStorage.setItem("secondary-foreground-color", secondaryForegroundColor);
    localStorage.setItem("secondary-invert-value", secondaryInvertValue);
    localStorage.setItem("suggestion-color", mainForegroundColor + "4D")
    setCookie("styleSet", "true", 10)

})

if (getCookie("styleSet") == "") {
    setImageUnsplash();
}

commandButton.addEventListener("click", function () {
    if (dropdownMenu.getAttribute("data-dropdown-visibility") == "invisible") {
        dropdownMenu.setAttribute("data-dropdown-visibility", "visible")
        commandDropdown.setAttribute("data-dropdown-visibility", "visible")
    }
    else {
        dropdownMenu.setAttribute("data-dropdown-visibility", "invisible")
        commandDropdown.setAttribute("data-dropdown-visibility", "invisible")
    }
});



let suggestions;
let suggestionIndex = 0;
commandInput.addEventListener("keyup", function (event) {
    function clearInput(){
        commandInput.value = "";
        suggestionElement.innerHTML = "";
        suggestions = undefined;
        suggestionIndex = 0;
    }

    val = commandInput.value;
    console.log(event.key)
    if ((event.key === "Tab" || event.key === "Control") && suggestionElement.innerHTML != "") {
        event.preventDefault();
        commandInput.value = suggestionElement.innerHTML;
    }
    else if (event.key === "Backspace" && commandInput.value == "") {
        clearInput()
    }
    else if (event.key === "ArrowUp" && suggestions != undefined) {
        if (suggestionIndex < suggestions.length - 1) {
            suggestionIndex += 1;
            suggestionElement.innerHTML = suggestions[suggestionIndex];
        }
        else {
            suggestionIndex = 0;
            suggestionElement.innerHTML = suggestions[suggestionIndex];
        }
    }
    else if (event.key === "ArrowDown" && suggestions != undefined) {
        if (suggestionIndex == 0) {
            suggestionIndex = suggestions.length - 1;
            suggestionElement.innerHTML = suggestions[suggestionIndex];
        }
        else {
            suggestionIndex -= 1;
            suggestionElement.innerHTML = suggestions[suggestionIndex];
        }
    }
    else if (event.key === "Enter") {
        switch (commandText.innerHTML) {
            case "Google":
                googleCommand(val);
                clearInput();
                break
            case "Command":
                clearInput();
                break
            case "Browse":
                browseCommand(val);
                clearInput();
                break
            case "Reddit":
                clearInput();
                break
            case "Youtube":
                clearInput();
                break
            case "Twitch":
                clearInput();
                break
            case "Duckduckgo":
                clearInput();
                break
            case "Bing":
                clearInput();
                break
        }
    }

    else {
        switch (commandText.innerHTML) {
            case "Google":
                fetch("https://corsanywhere.herokuapp.com/http://suggestqueries.google.com/complete/search?client=chrome&q=" + val)
                    .then((response) => response.json())
                    .then((data) => {
                        if (JSON.stringify(suggestions) != JSON.stringify(data[1])) {
                            suggestions = data[1];
                            if (suggestions[0] != undefined && val != "") {
                                suggestionIndex = 0;
                                suggestionElement.innerHTML = suggestions[suggestionIndex];
                            }
                        }
                    })
    
                break
            case "Command":
                break
            case "Browse":
                break
            case "Reddit":
                break
            case "Youtube":
                break
            case "Twitch":
                break
            case "Duckduckgo":
                break
            case "Bing":
                break
        }
    }


})