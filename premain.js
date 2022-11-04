if (localStorage.getItem("currentCommand") == null) {
    localStorage.setItem("currentCommand", "google");
}

if (localStorage.getItem("bookmarks") == null) {
    let defaultBookmarks = {
        "General": {
            "Google":"https://www.google.com",
            "Gmail":"https://mail.google.com",
            "Gdrive":"https://drive.google.com",
            "Calendar":"https://drive.google.com",
        },
        "Entertainment": {
            "Youtube":"https://www.youtube.com",
            "Twitch":"https://www.twitch.tv",
            "Netflix":"https://www.netflix.com",
        },
        "Socials": {
            "Reddit":"https://www.reddit.com",
            "Discord":"https://discord.com",    
            "Twitter":"https://twitter.com",
        },
        "Coding": {
            "GitHub":"https://github.com",
            "Stack Overflow":"https://stackoverflow.com",
        },
    }

    localStorage.setItem("bookmarks", JSON.stringify(defaultBookmarks))

}