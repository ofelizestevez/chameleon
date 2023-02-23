// ==============================================
// Command Functions
// ==============================================
function googleCommand(q) {
	q = encodeURIComponent(q);
	url = "http://www.google.com/search?q=" + q;
	window.open(url, "_self");
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

		window.open(url, "_self");
	}
	function gdrive(s) {
		if (!isNaN(s)) {
			url = "https://drive.google.com/drive/u/" + s + "/my-drive";
		} else {
			url = "https://drive.google.com/";
		}

		window.open(url, "_self");
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
	window.open(url, "_self");
}

function redditCommand(s) {
	q = encodeURIComponent(s);
	url = "https://www.reddit.com/r/" + q;
	window.open(url, "_self");
}

function youtubeCommand(s) {
	// get string
	// split
	// if split[0] == c
	// else search
	q = encodeURIComponent(s);
	url = "https://www.youtube.com/results?search_query=" + q;
	window.open(url, "_self");
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
	window.open(url, "_self");
}

function duckduckgoCommand(s) {
	q = encodeURIComponent(s);
	url = "https://duckduckgo.com/?q=" + q;
	window.open(url, "_self");
}

function bingCommand(s) {
	q = encodeURIComponent(s);
	url = "https://www.bing.com/search?q=" + q;
	window.open(url, "_self");
}

let suggestions;
let suggestionIndex = 0;

commandInput.addEventListener("keyup", function (event) {
	function clearInput() {
		commandInput.value = "";
		suggestionElement.innerHTML = "";
		suggestions = undefined;
		suggestionIndex = 0;
		suggestionElement.setAttribute("data-visibility", "invisible");
	}

	val = commandInput.value;

	// If event is tab or control and suggestions isn't empty, then set commandinput value and clean
	if (
		(event.key === "Tab" || event.key === "Control") &&
		suggestionElement.innerHTML != ""
	) {
		event.preventDefault();
		commandInput.value = suggestionElement.innerHTML;
		suggestionElement.innerHTML = "";
		suggestionElement.setAttribute("data-visibility", "invisible");
	}

	// If event is backspace and and commandinput is empty, clean input (and/or suggestions)
	else if (event.key === "Backspace" && commandInput.value == "") {
		clearInput();
	}

	// If event is arrow up and suggestions aren't undefined, increase through suggestion indexes
	else if (event.key === "ArrowUp" && suggestions != undefined) {
		if (suggestionIndex < suggestions.length - 1) {
			suggestionIndex += 1;
			suggestionElement.innerHTML = suggestions[suggestionIndex];
		} else {
			suggestionIndex = 0;
			suggestionElement.innerHTML = suggestions[suggestionIndex];
		}
	}

	// If event is arrow down and suggestions aren't undefined, decrease through suggestion indexes
	else if (event.key === "ArrowDown" && suggestions != undefined) {
		if (suggestionIndex == 0) {
			suggestionIndex = suggestions.length - 1;
			suggestionElement.innerHTML = suggestions[suggestionIndex];
		} else {
			suggestionIndex -= 1;
			suggestionElement.innerHTML = suggestions[suggestionIndex];
		}
	}

	// If event is enter, then do different types of things depending on what the dropdown value is
	else if (event.key === "Enter") {
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
			case "Subreddit":
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
            default:
                console.log(commandText.innerHTML);
		}
	}

	// If keydown isn't a special key, then it's normal text, which we could use for suggestion
	else {
		switch (commandText.innerHTML) {
			case "Google":
				fetch(
					"https://corsanywhere.herokuapp.com/" +
					"http://suggestqueries.google.com/complete/" +
					"search?client=chrome&q=" +
					val
				)
					.then((response) => response.json())
					.then((data) => {
						if (JSON.stringify(suggestions) != JSON.stringify(data[1])) {
							suggestions = data[1];
							if (suggestions[0] != undefined && val != "") {
								suggestionIndex = 0;
								suggestionElement.innerHTML = suggestions[suggestionIndex];
								suggestionElement.setAttribute("data-visibility", "visible");
							}
						}
					});

				break;
			case "Command":
				break;
			case "Browse":
				break;
			case "Subreddit":
                fetch("https://www.reddit.com/subreddits/search.json?limit=10&include_over_18=on&q=" + val)
                    .then((response) => response.json())
                    .then((data) => {
                        suggestions = Object.values(data["data"]["children"])
                                            .map(item => item["data"]["display_name"])
						if (suggestions[0] != undefined && val != "") {
                            console.log("HI?")
							suggestionIndex = 0;
							suggestionElement.innerHTML = suggestions[suggestionIndex];
							suggestionElement.setAttribute("data-visibility", "visible");
						}
                    })
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

suggestionElement.addEventListener("click", function () {
	commandInput.value = suggestionElement.innerHTML;
	suggestionElement.innerHTML = "";
	suggestionElement.setAttribute("data-visibility", "invisible");
	commandInput.focus();
});
