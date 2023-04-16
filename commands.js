class searchType {
    constructor() {
        this._name;
        this._iconFolder = "./Icons/General/"
        this._icon;
    }

    get name() {
        return this._name;
    }

    get icon() {
        return this._iconFolder + this._icon;
    }

    query(s) {
    }

    suggestion(q) {
        return new Promise((q) => {
            return []
        })
    }
}

class google extends searchType {
    constructor() {
        super();
        this._name = "Google";
        this._icon = "search.svg";
    }

    query(s) {
        let q = encodeURIComponent(s);
        let url = "http://www.google.com/search?q=" + q;
        window.open(url, "_self");
    }

    suggestion(q) {
        return fetch(
            "https://corsanywhere.herokuapp.com/" +
            "http://suggestqueries.google.com/complete/" +
            "search?client=chrome&q=" +
            q
        )
            .then((response) => response.json())
            .then((data) => {
                let suggestions = data[1];
                return suggestions
            });
    }
}

class browse extends searchType {
    constructor() {
        super();
        this._name = "Browse";
        this._icon = "globe.svg"
    }

    query(s) {
        s = s.includes("https://") || s.includes("http://") ? s : "https://" + s;
        s = s.includes(".") ? s : s + ".com";
        let url = s;
        window.open(url, "_self");
    }
}

class subreddit extends searchType {
    constructor() {
        super();
        this._name = "Subreddit";
        this._icon = "user.svg"
    }

    query(s) {
        let q = encodeURIComponent(s);
        let url = "https://www.reddit.com/r/" + q;
        window.open(url, "_self");
    }

    suggestion(q) {
        return fetch("https://www.reddit.com/subreddits/search.json?limit=10&include_over_18=on&q=" + q)
            .then((response) => response.json())
            .then((data) => {
                let suggestions = Object.values(data["data"]["children"])
                    .map(item => item["data"]["display_name"])
                return suggestions
            })
    }
}

class youtube extends searchType {
    constructor() {
        super();
        this._name = "Youtube";
        this._icon = "tv.svg"
    }

    query(s) {
        let q = encodeURIComponent(s);
        let url = "https://www.youtube.com/results?search_query=" + q;
        window.open(url, "_self");
    }

}

class twitch extends searchType {
    constructor() {
        super();
        this._name = "Twitch";
        this._icon = "youtube.svg"
    }

    query(s) {
        let q = encodeURIComponent(s);
        let url = "https://www.twitch.tv/search?term=" + q;
        window.open(url, "_self");
    }

}

class duckduckgo extends searchType {
    constructor() {
        super();
        this._name = "Duckduckgo";
        this._icon = "search.svg"
    }

    query(s) {
        let q = encodeURIComponent(s);
        let url = "https://duckduckgo.com/?q=" + q;
        window.open(url, "_self");
    }

}

class bing extends searchType {
    constructor() {
        super();
        this._name = "Bing";
        this._icon = "search.svg"
    }

    query(s) {
        let q = encodeURIComponent(s);
        let url = "https://www.bing.com/search?q=" + q;
        window.open(url, "_self");
    }

}

function setDropdown() {
    let dropdownValues = [new google(), new browse(), new subreddit(), new youtube(), new twitch(), new duckduckgo(), new bing()]

    let current_search_type = eval("new " + localStorage.getItem("currentSearchType") + "()");
    commandTextElement.innerHTML = current_search_type.name
    commandIconElement.src = current_search_type.icon

    for (const dropdownItem of dropdownValues) {
        if (current_search_type.name != dropdownItem.name) {
            // Makes elements that will be used
            let dropdownWrapper = document.createElement("li");
            let dropdownTextElement = document.createElement("p");
            let dropdownIcon = document.createElement("img");

            // Append class names
            dropdownWrapper.classList.add("general-wrapper", "general-gap");
            dropdownIcon.classList.add("secondary-icon");

            // Edit Content
            dropdownTextElement.innerHTML = dropdownItem.name
            dropdownIcon.src = dropdownItem.icon

            dropdownWrapper.addEventListener("click", () => {
                localStorage.setItem("currentSearchType", dropdownItem.name.toLowerCase())
                dropdownMenuElement.innerHTML = ""
                setDropdown()
            })

            // Append Content
            dropdownWrapper.appendChild(dropdownIcon);
            dropdownWrapper.appendChild(dropdownTextElement);
            dropdownMenuElement.appendChild(dropdownWrapper);
        }
    }
}


commandInputElement.addEventListener("keydown", (event) => {
    if (event.key == "Tab") {
        event.preventDefault()
    }
})

dropdownElement.addEventListener("click", () => {
    function closeDropdown() {
        toggleVisibility([], [dropdownMenuElement], delay = 500);
        window.removeEventListener("click", closeDropdown);
    }

    let visibleTrue = "visible"
    let visibleFalse = "invisible"

    if (dropdownMenuElement.getAttribute("data-visibility") == visibleTrue) {
        closeDropdown()
    }
    else {
        toggleVisibility([dropdownMenuElement]);
        setTimeout(() => {
            window.addEventListener("click", closeDropdown);
        }, 1 * 100);
    }
})

async function getSuggestions(searchType, s) {
    return await searchType.suggestion(s)
}

let suggestionIndex = 0
let suggestions = []

commandInputElement.addEventListener("keyup", (event) => {
    let val = commandInputElement.value;
    let currentSeachType = eval("new " + commandTextElement.innerHTML.toLowerCase() + "()");


    switch (event.key) {
        case "Enter":
            currentSeachType.query(val)
            break;
        case "ArrowUp":
            if (suggestionIndex < suggestions.length - 1) {
                suggestionIndex++;
            }
            else if (suggestionIndex == suggestions.length - 1) {
                suggestionIndex = 0;
            }
            suggestionElement.innerHTML = suggestions[suggestionIndex];
            break
        case "ArrowDown":
            if (suggestionIndex == 0 && suggestions.length != 0) {
                suggestionIndex = suggestions.length - 1;
            }
            else if (suggestionIndex < suggestions.length) {
                suggestionIndex--;
            }
            suggestionElement.innerHTML = suggestions[suggestionIndex];
            break
        case "Tab":
            if (suggestions != []) {
                commandInputElement.value = suggestions[suggestionIndex];
            }
        case "Backspace":
            if (val == "") {
                suggestionIndex = 0;
                suggestions = "";

                setTimeout(() => {
                    suggestionElement.innerHTML = "";
                }, 600);
                toggleVisibility([], [suggestionElement], delay = 500);

            }
            break
        default:
            currentSeachType.suggestion(val)
                .then(response => {
                    suggestions = response;
                    suggestionElement.innerHTML = suggestions[suggestionIndex];
                    toggleVisibility([suggestionElement]);

                    if (suggestions.length == 0) {
                        toggleVisibility([], [suggestionElement]);
                    }
                })
            break
    }
})

setDropdown()

// This is bound to change when settings are added
if (getCookie("styleSet") == "") {
    setImageUnsplash(img);
}