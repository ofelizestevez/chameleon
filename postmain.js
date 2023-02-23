// ==============================================
// Initialize elements
// ==============================================
let startPageSection = document.getElementById("start-page");
let settingsSection = document.getElementById("start-page");

let usernameElement = document.getElementById("username");
let commandDropdown = document.getElementById("dropdown__menu");
let dropdownButton = document.getElementById("current-search-selection");
let commandTextElement = document.getElementById("current-search-type__text");
let commandIconElement = document.getElementById("current-search-type__icon");
let commandInputElement = document.getElementById("search-input");
let suggestionElement = document.getElementById("suggestion-text");

let timeElement = document.getElementById("time");
let dateElement = document.getElementById("date");

let weatherIconElement = document.getElementById("weather__icon");
let weatherTempElement = document.getElementById("weather__text");

let dropdownElement = document.getElementById("dropdown");
let dropdownMenuElement = document.getElementById("dropdown__menu");

let bookmarkElement = document.getElementById("bookmarks");
let imageWrapper = document.getElementById("image-wrapper");
let imageElement = document.getElementById("background-image");

// ==============================================
// Useful Functions
// ==============================================

// RGB to Hex
function rgbToHex(r, g, b) {
	function componentToHex(c) {
		var hex = Math.round(c).toString(16);
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
        setWeather();
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
				weatherIconElement.src = "./Icons/Weather/" + icon;
				let weatherString = Math.floor(temp) + "°";
				weatherString += useFahrenheit ? "F" : "C";
				weatherTempElement.innerHTML = weatherString;
			});
	}
}

// Change Image + Colors
function setImageUnsplash(img) {
	// Get Random Image From Unsplash
	fetch("https://source.unsplash.com/random/").then((response) => {
		let url = response.url;
		img.crossOrigin = "Anonymous";
		img.src = url;
	});
}

// ==============================================
// Main
// ==============================================
let currentTime = new Date();
let secondsLeftInMin = 60 - currentTime.getSeconds();

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

suggestionElement.setAttribute("data-visibility", "invisible")

const colorThief = new ColorThief();
const img = new Image();

img.addEventListener("load", function () {
	// Makes an image palatte from colorThief, and makes an empty array for the hex values
	let imagePalette = colorThief.getPalette(img, 2);
	let imagePaletteHex = [];

	// Gets hex values
	for (let colorRGB of imagePalette) {
		imagePaletteHex.push(rgbToHex(colorRGB[0], colorRGB[1], colorRGB[2]));
	}

	// Sets the values used later
	let primaryForegroundColor = "";
	let primaryInvertValue = "";
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
		primaryForegroundColor = "#000000";
		primaryInvertValue = "0%";
	} else {
		primaryForegroundColor = "#FFFFFF";
		primaryInvertValue = "100%";
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
	localStorage.setItem("primary-background-color", imagePaletteHex[0]);
	localStorage.setItem("primary-foreground-color", primaryForegroundColor);
	localStorage.setItem("primary-invert-value", primaryInvertValue);
	localStorage.setItem("secondary-background-color", imagePaletteHex[1]);
	localStorage.setItem("secondary-foreground-color", secondaryForegroundColor);
	localStorage.setItem("secondary-invert-value", secondaryInvertValue);
	setCookie("styleSet", "true", 10);

	let placeHolderElement = imageElement.cloneNode();
	placeHolderElement.style.backgroundImage = getComputedStyle(document.documentElement).getPropertyValue('--background-image')
	imageWrapper.appendChild(placeHolderElement)
	placeHolderElement.className += "fade-out-image"
	
	let oldPrimaryBgColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-background-color');
	let oldSecondaryBgColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-background-color');

	root.style.setProperty("--old-primary-background-color", oldPrimaryBgColor)
	root.style.setProperty("--old-secondary-background-color", oldSecondaryBgColor)

	root.style.setProperty(
		"--background-image",
		'url("' + localStorage.getItem("background-image") + '")'
	);
	root.style.setProperty(
		"--primary-background-color",
		localStorage.getItem("primary-background-color")
	);
	document.body.classList.add("primary-bg-animation")

	root.style.setProperty(
		"--primary-foreground-color",
		localStorage.getItem("primary-foreground-color")
	);
	
	root.style.setProperty(
		"--primary-invert-value",
		localStorage.getItem("primary-invert-value")
	);
	root.style.setProperty(
		"--secondary-background-color",
		localStorage.getItem("secondary-background-color")
	);
	dropdownButton.classList.add("secondary-bg-animation")


	root.style.setProperty(
		"--secondary-foreground-color",
		localStorage.getItem("secondary-foreground-color")
	);
	root.style.setProperty(
		"--secondary-invert-value",
		localStorage.getItem("secondary-invert-value")
	);
});