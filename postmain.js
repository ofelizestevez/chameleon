// ==============================================
// Initialize elements
// ==============================================
let timeElement = document.getElementById("time");
let dateElement = document.getElementById("date");

let weatherIconElement = document.getElementById("weather_icon");
let weatherTempElement = document.getElementById("weather_text")

let commandDropdown = document.getElementById("dropdown_menu")
let commandButton = document.getElementById("currently_selected");
let commandText = document.getElementById("command_text");
let commandIcon = document.getElementById("command_icon");
let commandInput = document.getElementById("command_input");

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
function setTimeAndPeriod(time = new Date()) {
    let hour = time.getHours();
    let mins = time.getMinutes().toString();

    if (mins.length == 1) {
        mins = "0" + mins;
    }

    let am_pm = "AM";

    if (hour > 12) {
        am_pm = "PM"
    }

    if (hour == 0){
        hour = 12;
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
    let day = time.getDate();

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

                if (time.getHours() > 7 && time.getHours() < 19) {
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
function setDropdown() {
    let dropdownValues = ["google", "user", "browse", "reddit", "youtube", "twitch", "duckduckgo", "bing"];
    let dropdownValuesWithIcons = {
        "google": "search.svg",
        "user": "arrow-right.svg",
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

// ==============================================
// Main
// ==============================================
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
setBookmarks()

const colorThief = new ColorThief();
const img = new Image();

img.addEventListener("load", function () {
    let imagePalette = colorThief.getPalette(img,2)
    let imagePaletteHex = []
    for (let colorRGB of imagePalette){
        imagePaletteHex.push(rgbToHex(colorRGB[0],colorRGB[1],colorRGB[2]))
    }

    let mainForegroundColor = "";
    let mainInvertValue = "";
    let secondaryForegroundColor = "";
    let secondaryInvertValue = "";
    
    root.style.setProperty("--background-image", 'url("' + img.src + '")')
    root.style.setProperty("--main-background-color", imagePaletteHex[0])
    if ((0.299 * imagePalette[0][0] + 0.587 * imagePalette[0][1] + 0.114 * imagePalette[0][2])/255 > 0.5){
        mainForegroundColor = "#000000"
        mainInvertValue = "0%"
    }
    else {
        root.style.setProperty("--main-foreground-color", "#FFFFFF")
        mainForegroundColor = "#FFFFFF"
        mainInvertValue = "100%"
    }
    root.style.setProperty("--secondary-background-color", imagePaletteHex[1])
    if ((0.299 * imagePalette[1][0] + 0.587 * imagePalette[1][1] + 0.114 * imagePalette[1][2])/255 > 0.5){
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

    localStorage.setItem("background-image",img.src);
    localStorage.setItem("main-background-color",imagePaletteHex[0]);
    localStorage.setItem("main-foreground-color",mainForegroundColor);
    localStorage.setItem("main-invert-value",mainInvertValue);
    localStorage.setItem("secondary-background-color",imagePaletteHex[1]);
    localStorage.setItem("secondary-foreground-color",secondaryForegroundColor);
    localStorage.setItem("secondary-invert-value",secondaryInvertValue);
    setCookie("styleSet","true", 10)

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


commandInput.addEventListener("keyup", function(event) {
    switch(commandText.innerHTML){
        case "Google":
            console.log("A")
            break
        case "User":
            console.log("AA")
            break
        case "Browse":
            console.log("AAA")
            break
        case "Reddit":
            console.log("AAAA")
            break
        case "Youtube":
            console.log("AAAAA")
            break
        case "Twitch":
            console.log("AAAAAA")
            break
        case "Duckduckgo":
            console.log("AAAAAAA")
            break
        case "Bing":
            console.log("AAAAAAAA")
            break
    }

})

// fetch("http://suggestqueries.google.com/complete/search?client=chrome&q=cats")