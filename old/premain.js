// ==============================================
// Useful Variables (For Settings)
// ==============================================
let timePeriodEnabled = true;
let MilitaryTime = false;
let timeEnabled = true;

let dateEnabled = true;

let weatherEnabled = true;
let weatherIconEnabled = true;
let useFahrenheit = true;

let useDefaultTheme = false;

let useNewTab = false;
// ==============================================

// ==============================================
// Cookie Functions
// ==============================================
function setCookie(cname, cvalue, exmins) {
	const d = new Date();
	d.setTime(d.getTime() + exmins * 60 * 1000);
	let expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(";");
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == " ") {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
// ==============================================

const root = document.querySelector(":root");

// Sets default command
if (localStorage.getItem("currentCommand") == null) {
	localStorage.setItem("currentCommand", "google");
}

// Sets default bookmarks
if (localStorage.getItem("bookmarks") == null) {
	let defaultBookmarks = {
		General: {
			Gmail: "https://mail.google.com",
			Gdrive: "https://drive.google.com",
			Calendar: "https://calendar.google.com",
		},
		Entertainment: {
			Youtube: "https://www.youtube.com",
			Twitch: "https://www.twitch.tv",
			Netflix: "https://www.netflix.com",
		},
		Socials: {
			Reddit: "https://www.reddit.com",
			Discord: "https://discord.com",
			Twitter: "https://twitter.com",
		},
		Coding: {
			GitHub: "https://github.com",
			"Stack Overflow": "https://stackoverflow.com",
		},
	};

	localStorage.setItem("bookmarks", JSON.stringify(defaultBookmarks));
}

// Sets the style from the random image
if (getCookie("styleSet") != "") {
	root.style.setProperty(
		"--background-image",
		'url("' + localStorage.getItem("background-image") + '")'
	);
	root.style.setProperty(
		"--main-background-color",
		localStorage.getItem("main-background-color")
	);
	root.style.setProperty(
		"--main-foreground-color",
		localStorage.getItem("main-foreground-color")
	);
	root.style.setProperty(
		"--main-invert-value",
		localStorage.getItem("main-invert-value")
	);
	root.style.setProperty(
		"--secondary-background-color",
		localStorage.getItem("secondary-background-color")
	);
	root.style.setProperty(
		"--secondary-foreground-color",
		localStorage.getItem("secondary-foreground-color")
	);
	root.style.setProperty(
		"--secondary-invert-value",
		localStorage.getItem("secondary-invert-value")
	);
	root.style.setProperty(
		"--suggestion-color",
		localStorage.getItem("suggestion-color")
	);
}
