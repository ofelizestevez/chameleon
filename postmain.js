// ==============================================
// Initialize elements
// ==============================================
let timeElement = document.getElementById("time");
let dateElement = document.getElementById("date");

let weatherIconElement = document.getElementById("weather_icon");
let weatherTempElement = document.getElementById("weather_text");

let usernameElement = document.getElementById("username");
let commandDropdown = document.getElementById("dropdown_menu");
let dropdownButton = document.getElementById("currently_selected");
let commandText = document.getElementById("command_text");
let commandIcon = document.getElementById("command_icon");
let commandInput = document.getElementById("command_input");
let suggestionElement = document.getElementById("suggestion_text");

let dropdownMenu = document.getElementById("command_dropdown");
let dropdownElement = document.getElementById("dropdown_values");

let bookmarkElement = document.getElementById("bookmarks");
let imageElement = document.getElementById("image");

let mainContentSection = document.getElementById("main_content");
let settingsButton = document.getElementById("settings_icon");
let settingsSection = document.getElementById("settings");

let settingsNavHowTo = document.getElementById("settings_how_to");
let settingsNavLinks = document.getElementById("settings_links");
let settingsNavGeneral = document.getElementById("settings_general");
let settingsNavClose = document.getElementById("settings_close");

let settingsLinksSection = document.getElementById("links_section");
let settingsLinksWrapper = document.getElementById("links_wrapper");
// ==============================================
// Useful Functions
// ==============================================

// RGB to Hex
function rgbToHex(r, g, b) {
	function componentToHex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// Change Time
function setTime(userFormat = "") {
	let time;

	if (userFormat != "") {
		time = moment().format(userFormat);
	} else {
		time = MilitaryTime ? moment().format("HH:mm") : moment().format("hh:mm");
		time +=
			!MilitaryTime && timePeriodEnabled ? " " + moment().format("A") : "";
	}

	timeElement.innerHTML = time;
}

// Change Date
function setDate(userFormat = "") {
	let dateString;

	if (userFormat != "") {
		dateString = moment().format(userFormat);
	} else {
		dateString = moment().format("MMM D");
	}

	dateElement.innerHTML = dateString;
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
		let fetchString =
			"https://api.open-meteo.com/v1/forecast?latitude=" +
			lat +
			"&longitude=" +
			long +
			"&current_weather=true";
		fetchString += useFahrenheit ? "&temperature_unit=fahrenheit" : "";

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

				let codeToIconPath =
					time.getHours() > 7 && time.getHours() < 19
						? Object.assign({}, sun, otherWeatherCodes)
						: Object.assign({}, moon, otherWeatherCodes);
				let icon = codeToIconPath[weatherCode];
				weatherIconElement.src = "./weather icons/" + icon;

				let weatherString = Math.floor(temp) + "°";
				weatherString += useFahrenheit ? "F" : "C";
				weatherTempElement.innerHTML = weatherString;
			});
	}
}

// Make Dropdown Functional
function setDropdown() {
	let dropdownValues = {
		google: "search.svg",
		command: "arrow-right.svg",
		browse: "globe.svg",
		reddit: "user.svg",
		youtube: "tv.svg",
		twitch: "youtube.svg",
		duckduckgo: "search.svg",
		bing: "search.svg",
	};

	let currently_selected = localStorage.getItem("currentCommand");
	commandText.innerHTML =
		currently_selected.charAt(0).toLocaleUpperCase() +
		currently_selected.slice(1);

	commandIcon.src = "./icons/" + dropdownValues[currently_selected];

	for (let dropdownPair of Object.entries(dropdownValues)) {
		let dropdownValue = dropdownPair[0];
		let dropdownIconSrc = dropdownPair[1];

		// If dropdown value isn't currently selected, then add them to the menu
		if (
			dropdownValue.toLocaleLowerCase() !=
			currently_selected.toLocaleLowerCase()
		) {
			// Makes elements that will be used
			let dropdownWrapper = document.createElement("li");
			let dropdownTextElement = document.createElement("p");
			let dropdownIcon = document.createElement("img");

			// Append class names
			dropdownWrapper.classList.add("dropdown_option");
			dropdownIcon.classList.add("command_icon");

			// Edit Content
			dropdownTextElement.innerHTML =
				dropdownValue.charAt(0).toLocaleUpperCase() + dropdownValue.slice(1);
			dropdownIcon.src = "./icons/" + dropdownIconSrc;

			// Add JS Magic
			dropdownWrapper.addEventListener("click", function () {
				// This is used for the css values
				dropdownMenu.setAttribute("data-dropdown-active", "false");
				commandDropdown.setAttribute("data-dropdown-active", "false");

				// Sets new command and reruns function
				localStorage.setItem("currentCommand", dropdownValue);
				setDropdown();
			});

			// Append Content
			dropdownWrapper.appendChild(dropdownTextElement);
			dropdownWrapper.appendChild(dropdownIcon);
			dropdownElement.appendChild(dropdownWrapper);
		}
	}
}

// Change Image + Colors
function setImageUnsplash() {
	// Get Random Image From Unsplash
	fetch("https://source.unsplash.com/random/").then((response) => {
		let url = response.url;
		img.crossOrigin = "Anonymous";
		img.src = url;
	});
}

// Bookmarks
function setBookmarks() {
	let bookmarks = JSON.parse(localStorage.getItem("bookmarks"));

	// Bookmarks is a dictionary made up of dictionaries
	for (let column of Object.entries(bookmarks)) {
		let columnTitle = column[0];
		let columnLinks = column[1];

		// create elements being used
		let columnHeader = document.createElement("h1");
		let columnWrapper = document.createElement("div");
		let columnLinkWrapper = document.createElement("ul");

		// adds classes to to classnames
		columnWrapper.classList.add("column");
		columnHeader.classList.add("title");
		columnLinkWrapper.classList.add("links");

		// Adds Content
		columnHeader.innerHTML = columnTitle;
		// Goes through all column links (column[1] is a dict)
		for (let link of Object.entries(columnLinks)) {
			// Creates elements
			let linkElement = document.createElement("li");
			let linkChildElement = document.createElement("a");

			// Adds Content
			linkChildElement.innerHTML = link[0];
			linkChildElement.href = link[1];
			// Append
			linkElement.appendChild(linkChildElement);
			columnLinkWrapper.appendChild(linkElement);
		}

		// Append everything
		columnWrapper.appendChild(columnHeader);
		columnWrapper.appendChild(columnLinkWrapper);
		bookmarkElement.appendChild(columnWrapper);
	}
}

// Username
function setUsername() {
	if (localStorage.getItem("username") != null) {
		usernameElement.innerHTML = localStorage.getItem("username") + "@";
	}
}

// ==============================================
// Main
// ==============================================
let time = new Date();
let secondsLeftInMin = 60 - time.getSeconds();

// Sets Time, Date, Weather
setTime();
setDate();
setWeather();

// Waits the amount of seconds left in the minute, then sets the interval to reset time
// It syncs the minutes with the PC's clock.
setTimeout(() => {
	setTime();
	setInterval(setTime, 60000);
}, secondsLeftInMin * 1000);

setDropdown();

// Adds ability to dropdown button to turn on and off the menu.
dropdownButton.addEventListener("click", function () {
	if (dropdownMenu.getAttribute("data-dropdown-active") == "false") {
		dropdownMenu.setAttribute("data-dropdown-active", "true");
		commandDropdown.setAttribute("data-dropdown-active", "true");
	} else {
		dropdownMenu.setAttribute("data-dropdown-active", "false");
		commandDropdown.setAttribute("data-dropdown-active", "false");
	}
});

setBookmarks();
setUsername();

// Starts theme process
const colorThief = new ColorThief();
const img = new Image();

// set event listener for the image (used later)
img.addEventListener("load", function () {
	// Makes an image palatte from colorThief, and makes an empty array for the hex values
	let imagePalette = colorThief.getPalette(img, 2);
	let imagePaletteHex = [];

	// Gets hex values
	for (let colorRGB of imagePalette) {
		imagePaletteHex.push(rgbToHex(colorRGB[0], colorRGB[1], colorRGB[2]));
	}

	// Sets the values used later
	let mainForegroundColor = "";
	let mainInvertValue = "";
	let secondaryForegroundColor = "";
	let secondaryInvertValue = "";

	// PRIMARY COLORS: If else statement which decides if text and icons should be white or black
	if (
		(0.299 * imagePalette[0][0] +
			0.587 * imagePalette[0][1] +
			0.114 * imagePalette[0][2]) /
			255 >
		0.5
	) {
		mainForegroundColor = "#000000";
		mainInvertValue = "0%";
	} else {
		mainForegroundColor = "#FFFFFF";
		mainInvertValue = "100%";
	}
	// SECONDARY COLORS: same if else as before
	if (
		(0.299 * imagePalette[1][0] +
			0.587 * imagePalette[1][1] +
			0.114 * imagePalette[1][2]) /
			255 >
		0.5
	) {
		secondaryForegroundColor = "#000000";
		secondaryInvertValue = "0%";
	} else {
		secondaryForegroundColor = "#FFFFFF";
		secondaryInvertValue = "100%";
	}

	// Sets all localstorage values, sets the styleSet cookie
	localStorage.setItem("background-image", img.src);
	localStorage.setItem("main-background-color", imagePaletteHex[0]);
	localStorage.setItem("main-foreground-color", mainForegroundColor);
	localStorage.setItem("main-invert-value", mainInvertValue);
	localStorage.setItem("secondary-background-color", imagePaletteHex[1]);
	localStorage.setItem("secondary-foreground-color", secondaryForegroundColor);
	localStorage.setItem("secondary-invert-value", secondaryInvertValue);
	localStorage.setItem("suggestion-color", mainForegroundColor + "4D");
	setCookie("styleSet", "true", 10);

	// Reloads the window and lets premain.js handle theme changing
	window.location.reload();
});

// This is bound to change when settings are added
if (getCookie("styleSet") == "") {
	setImageUnsplash();
}

settingsButton.addEventListener("click", function () {
	if (mainContentSection.getAttribute("data-visibility") == "visible") {
		mainContentSection.setAttribute("data-visibility", "invisible");
		settingsSection.setAttribute("data-visibility", "visible");
	} else {
		mainContentSection.setAttribute("data-visibility", "visible");
		settingsSection.setAttribute("data-visibility", "invisible");
	}
});

settingsNavClose.addEventListener("click", function () {
	console.log("HUH");
	if (mainContentSection.getAttribute("data-visibility") == "invisible") {
		mainContentSection.setAttribute("data-visibility", "visible");
		settingsSection.setAttribute("data-visibility", "invisible");
	} else {
		mainContentSection.setAttribute("data-visibility", "invisible");
		settingsSection.setAttribute("data-visibility", "visible");
	}
});
