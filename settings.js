// Create BookmarkSection
function createBookmarkSection(title, links, placeholder) {
	// Creates wrapper for easier recognition
	let sectionWrapper = document.createElement("div");

	// Creates header
	let bookmarkHeader = createHeader(title, placeholder);

	// Creates table
	let bookmarkTable = createTable(links);

	// hides table by default
	bookmarkTable.setAttribute("data-visibility", "invisible");

	// Give functionality to remove icon
	let headerRemoveIcon =
		bookmarkHeader.getElementsByClassName("remove_icon")[0];
	headerRemoveIcon.addEventListener("click", function () {
		settingsLinksWrapper.removeChild(sectionWrapper);
	});

	// Give functionality to toggle icon (and changes its source)
	let headerToggleIcon =
		bookmarkHeader.getElementsByClassName("toggle_icon")[0];
	headerToggleIcon.addEventListener("click", function () {
		if (bookmarkTable.getAttribute("data-visibility") == "invisible") {
			headerToggleIcon.src = "./icons/chevron-down.svg";
			bookmarkTable.setAttribute("data-visibility", "visible");
		} else {
			headerToggleIcon.src = "./icons/chevron-right.svg";
			bookmarkTable.setAttribute("data-visibility", "invisible");
		}
	});

	sectionWrapper.classList.add("bookmark_section");
	sectionWrapper.appendChild(bookmarkHeader);
	sectionWrapper.appendChild(bookmarkTable);

	// Appends them the section before add bookmark row;
	settingsLinksWrapper.appendChild(sectionWrapper);
	new Sortable(settingsLinksWrapper, {
		animation: 150,
		handle: ".drag_icon",
	});
	// settingsLinksSection.insertBefore(sectionWrapper, addBookmarkRow);
}

// Create Header
function createHeader(title, placeholder) {
	// Section headers have a wrapper div, an input, and 2 icons
	let columnTitleWrapper = document.createElement("div");
	let columnTitleElement = document.createElement("input");
	let columnRemoveIcon = document.createElement("img");
	let columnToggleIcon = document.createElement("img");
	let columnDraggableIcon = document.createElement("img");

	// adds classes
	columnTitleWrapper.classList.add("column_title");
	columnTitleElement.classList.add("input", "underline", "fakeh2");
	columnRemoveIcon.classList.add("main_icon", "remove_icon", "clickable");
	columnToggleIcon.classList.add("main_icon", "toggle_icon", "clickable");
	columnDraggableIcon.classList.add("main_icon", "drag_icon", "clickable");

	// Adds content
	columnTitleElement.value = title;
	columnTitleElement.placeholder = placeholder;
	columnToggleIcon.src = "./icons/chevron-right.svg";
	columnRemoveIcon.src = "./icons/trash-2.svg";
	columnDraggableIcon.src = "./icons/grip-vertical.svg";

	// Append Child
	columnTitleWrapper.appendChild(columnDraggableIcon);
	columnTitleWrapper.appendChild(columnTitleElement);
	columnTitleWrapper.appendChild(columnRemoveIcon);
	columnTitleWrapper.appendChild(columnToggleIcon);

	return columnTitleWrapper;
}

// Create Table
function createTable(links) {
	let wrapper = document.createElement("table");
	let bodyWrapper = document.createElement("tbody");

	// Header
	let headerWrapper = document.createElement("thead");
	let headerRow = document.createElement("tr");
	let headerTitle = document.createElement("th");
	let headerLink = document.createElement("th");

	// Footer
	let footerWrapper = document.createElement("tfoot");
	let addRow = document.createElement("tr");
	let addWrapper = document.createElement("td");
	let addText = document.createElement("p");
	let addIcon = document.createElement("img");

	// Sets class names
	addWrapper.classList.add("info", "clickable");
	addIcon.classList.add("main_icon");

	// Set content
	headerTitle.innerHTML = "Title";
	headerLink.innerHTML = "Link";
	addText.innerHTML = "Add Link";
	addIcon.src = "./icons/plus-circle.svg";

	// Append children to children, and finally children to wrapper
	headerRow.appendChild(document.createElement("td"));
	headerRow.appendChild(headerTitle);
	headerRow.appendChild(headerLink);
	headerRow.appendChild(document.createElement("td"));

	addWrapper.appendChild(addText);
	addWrapper.appendChild(addIcon);

	addRow.appendChild(document.createElement("td"));
	addRow.appendChild(addWrapper);
	addRow.appendChild(document.createElement("td"));

	headerWrapper.appendChild(headerRow);
	footerWrapper.appendChild(addRow);

	wrapper.appendChild(headerWrapper);
	wrapper.appendChild(bodyWrapper);
	wrapper.appendChild(footerWrapper);

	// Appends rows of links to the table
	for (let link of Object.entries(links)) {
		let linkTitle = link[0];
		let linkDestination = link[1];

		let linkRow = addTableRow(
			linkTitle,
			linkDestination,
			"Link Title",
			"Link Destination"
		);

		// Gives functionality to row's remove icon
		let linkRemoveIcon = linkRow.getElementsByClassName("remove_icon")[0];
		linkRemoveIcon.addEventListener("click", function () {
			bodyWrapper.removeChild(linkRow);
		});

		bodyWrapper.appendChild(linkRow);
	}

	new Sortable(bodyWrapper, {
		animation: 150,
		handle: ".drag_icon",
	});

	// Gives functionality to add link row
	addRow.addEventListener("click", function () {
		let newTableRow = addTableRow("", "", "Link Title", "Link Destination");

		// Gives functionality to row's remove icon
		let linkRemoveIcon = newTableRow.getElementsByClassName("remove_icon")[0];
		linkRemoveIcon.addEventListener("click", function () {
			bodyWrapper.removeChild(newTableRow);
		});
		bodyWrapper.appendChild(newTableRow);
	});

	return wrapper;
}

// Add Row Function
function addTableRow(title, link, titlePlaceholder, linkPlaceholder) {
	// Row and its children
	let row = document.createElement("tr");
	let draggableElement = document.createElement("td");
	let titleElement = document.createElement("td");
	let linkElement = document.createElement("td");
	let deleteElement = document.createElement("td");

	// children of row children
	let draggableIcon = document.createElement("img");
	let titleInput = document.createElement("input");
	let linkInput = document.createElement("input");
	let deleteIcon = document.createElement("img");

	// adds content
	draggableIcon.src = "./icons/grip-vertical.svg";
	titleInput.value = title;
	titleInput.placeholder = titlePlaceholder;
	titleInput.spellcheck = "false";
	linkInput.value = link;
	linkInput.placeholder = linkPlaceholder;
	linkInput.spellcheck = "false";
	deleteIcon.src = "./icons/trash-2.svg";

	// add classes
	draggableIcon.classList.add("main_icon", "drag_icon", "clickable");
	titleInput.classList.add("input", "underline", "longer_input");
	linkInput.classList.add("input", "underline", "longer_input");
	deleteIcon.classList.add("main_icon", "remove_icon", "clickable");

	// append children to row children
	draggableElement.appendChild(draggableIcon);
	titleElement.appendChild(titleInput);
	linkElement.appendChild(linkInput);
	deleteElement.appendChild(deleteIcon);

	// append children to row
	row.appendChild(draggableElement);
	row.appendChild(titleElement);
	row.appendChild(linkElement);
	row.appendChild(deleteElement);

	return row;
}

// Add Section Element Function
function addBookmarkElement() {
	let wrapper = document.createElement("div");
	let textElement = document.createElement("h2");
	let iconElement = document.createElement("img");

	textElement.innerHTML = "Add Section";
	iconElement.src = "./icons/plus-circle.svg";

	wrapper.classList.add("info", "clickable");
	iconElement.classList.add("main_icon");

	wrapper.appendChild(iconElement);
	wrapper.appendChild(textElement);

	return wrapper;
}

// Adds the "add section" div and gives it functionality
let addBookmarkRow = addBookmarkElement();
addBookmarkRow.addEventListener("click", function () {
	createBookmarkSection("", "", "Section Title");
});
settingsLinksSection.appendChild(addBookmarkRow);

// Adds the save button
let saveButton = document.createElement("div");
let saveText = document.createElement("p");
let saveIcon = document.createElement("img");

saveButton.classList.add(
	"command_dropdown",
	"currently_selected",
	"fakeh2",
	"info",
	"save_button"
);
saveIcon.classList.add("secondary_icon");
saveText.innerHTML = "Save";
saveIcon.src = "./icons/save.svg";

saveButton.addEventListener("click", function () {
	let bookmarkSections =
		settingsLinksSection.getElementsByClassName("bookmark_section");

	let bookmarkDict = {};

	for (let bookmarkSection of bookmarkSections) {
		let bookmarkSectionTitle = bookmarkSection
			.getElementsByClassName("column_title")[0]
			.getElementsByClassName("input")[0].value;

		let bookmarkRows = bookmarkSection.getElementsByTagName("tr");
		let bookmarkLinks = {};

		let linkTitle = "";
		let linkDestination = "";
		for (let i = 1; i < bookmarkRows.length - 1; i++) {
			let bookmarkRowInputs = bookmarkRows[i].getElementsByTagName("input");

			for (let j = 0; j < bookmarkRowInputs.length; j++) {
				if (j % 2 == 0) {
					linkTitle = bookmarkRowInputs[j].value;
				} else {
					linkDestination = bookmarkRowInputs[j].value;
					if (linkTitle != "" && linkDestination != "") {
						bookmarkLinks[linkTitle] = linkDestination;
					}
					linkTitle = "";
					linkDestination = "";
				}
			}
		}

		if (bookmarkSectionTitle != "" && bookmarkLinks != {}) {
			bookmarkDict[bookmarkSectionTitle] = bookmarkLinks;
		}
	}

	localStorage.setItem("bookmarks", JSON.stringify(bookmarkDict));
	window.location.reload();
});

saveButton.appendChild(saveIcon);
saveButton.appendChild(saveText);
settingsLinksSection.appendChild(saveButton);

//
let bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
for (let column of Object.entries(bookmarks)) {
	let columnTitle = column[0];
	let columnLinks = column[1];

	createBookmarkSection(columnTitle, columnLinks, "Section Title");
}
