// ==============================================
// Command Functions
// ==============================================
function googleCommand(q) {
	q = encodeURIComponent(q);
	url = "http://www.google.com/search?q=" + q;
	window.open(url);
}

function userCommand(s) {
	function username(s) {
		localStorage.setItem("username", s);
		setUsername();
	}
	function gmail(s) {
		if (!isNaN(s)) {
			url = "https://mail.google.com/mail/u/" + s + "/#inbox";
		} else {
			url = "https://mail.google.com/";
		}

		window.open(url);
	}
	function gdrive(s) {
		if (!isNaN(s)) {
			url = "https://drive.google.com/drive/u/" + s + "/my-drive";
		} else {
			url = "https://drive.google.com/";
		}

		window.open(url);
	}
	let commandString = s.split(" ");
	console.log(commandString);
	switch (commandString[0]) {
		// username
		case "u":
		case "user":
		case "username":
			username(commandString[1]);
			break;

		// gmail "gm" "gmail"
		case "gm":
		case "gmail":
			gmail(commandString[1]);
			break;

		// gdrive "gd" "gdrive" "drive"
		case "gd":
		case "drive":
		case "gdrive":
			gdrive(commandString[1]);
			break;

		// google "g" "google"
		case "g":
		case "google":
			googleCommand(commandString.slice(1).join(" "));
			break;

		// browse "b" "browse"
		case "b":
		case "browse":
			browseCommand(commandString[1]);
			break;

		// reddit "r" "reddit"
		case "r":
		case "reddit":
			redditCommand(commandString.slice(1).join(" "));
			break;

		// youtube "yt" "youtube"
		case "yt":
		case "youtube":
			youtubeCommand(commandString.slice(1).join(" "));
			break;

		// twitch "ttv" "twitch"
		case "ttv":
		case "twitch":
			twitchCommand(commandString.slice(1).join(" "));
			break;

		// duckduckgo "ddg" "duckduckgo"
		case "ddg":
		case "duckduckgo":
			duckduckgoCommand(commandString.slice(1).join(" "));
			break;

		// bing "b" "bing"
		case "b":
		case "bing":
			bingCommand(commandString.slice(1).join(" "));
			break;
	}
}

function browseCommand(s) {
	s = s.includes("https://") || s.includes("http://") ? s : "https://" + s;
	s = s.includes(".") ? s : s + ".com";
	url = s;
	window.open(url);
}

function redditCommand(s) {
	// get string
	// split it into each word
	// if split [0] equals r
	// else if split[0] equals u
	// else search
	q = encodeURIComponent(s);
	url = "https://www.reddit.com/search/?q=" + q;
	window.open(url);
}

function youtubeCommand(s) {
	// get string
	// split
	// if split[0] == c
	// else search
	q = encodeURIComponent(s);
	url = "https://www.youtube.com/results?search_query=" + q;
	window.open(url);
}

function twitchCommand(s) {
	// get string
	// split
	// if split[0]
	// d = directory
	// c = channel
	// else search
	q = encodeURIComponent(s);
	url = "https://www.twitch.tv/search?term=" + q;
	window.open(url);
}

function duckduckgoCommand(s) {
	q = encodeURIComponent(s);
	url = "https://duckduckgo.com/?q=" + q;
	window.open(url);
}

function bingCommand(s) {
	q = encodeURIComponent(s);
	url = "https://www.bing.com/search?q=" + q;
	window.open(url);
}

let suggestions;
let suggestionIndex = 0;
commandInput.addEventListener("keyup", function (event) {
	function clearInput() {
		commandInput.value = "";
		suggestionElement.innerHTML = "";
		suggestions = undefined;
		suggestionIndex = 0;
	}

	val = commandInput.value;
	if (
		(event.key === "Tab" || event.key === "Control") &&
		suggestionElement.innerHTML != ""
	) {
		event.preventDefault();
		commandInput.value = suggestionElement.innerHTML;
	} else if (event.key === "Backspace" && commandInput.value == "") {
		clearInput();
	} else if (event.key === "ArrowUp" && suggestions != undefined) {
		if (suggestionIndex < suggestions.length - 1) {
			suggestionIndex += 1;
			suggestionElement.innerHTML = suggestions[suggestionIndex];
		} else {
			suggestionIndex = 0;
			suggestionElement.innerHTML = suggestions[suggestionIndex];
		}
	} else if (event.key === "ArrowDown" && suggestions != undefined) {
		if (suggestionIndex == 0) {
			suggestionIndex = suggestions.length - 1;
			suggestionElement.innerHTML = suggestions[suggestionIndex];
		} else {
			suggestionIndex -= 1;
			suggestionElement.innerHTML = suggestions[suggestionIndex];
		}
	} else if (event.key === "Enter") {
		switch (commandText.innerHTML) {
			case "Google":
				googleCommand(val);
				clearInput();
				break;
			case "Command":
				userCommand(val);
				clearInput();
				break;
			case "Browse":
				browseCommand(val);
				clearInput();
				break;
			case "Reddit":
				redditCommand(val);
				clearInput();
				break;
			case "Youtube":
				youtubeCommand(val);
				clearInput();
				break;
			case "Twitch":
				twitchCommand(val);
				clearInput();
				break;
			case "Duckduckgo":
				duckduckgoCommand(val);
				clearInput();
				break;
			case "Bing":
				bingCommand(val);
				clearInput();
				break;
		}
	} else {
		switch (commandText.innerHTML) {
			case "Google":
				fetch(
					"https://corsanywhere.herokuapp.com/http://suggestqueries.google.com/complete/search?client=chrome&q=" +
						val
				)
					.then((response) => response.json())
					.then((data) => {
						if (JSON.stringify(suggestions) != JSON.stringify(data[1])) {
							suggestions = data[1];
							if (suggestions[0] != undefined && val != "") {
								suggestionIndex = 0;
								suggestionElement.innerHTML = suggestions[suggestionIndex];
							}
						}
					});

				break;
			case "Command":
				break;
			case "Browse":
				break;
			case "Reddit":
				break;
			case "Youtube":
				break;
			case "Twitch":
				break;
			case "Duckduckgo":
				break;
			case "Bing":
				break;
		}
	}
});
