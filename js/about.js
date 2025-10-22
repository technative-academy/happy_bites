const aboutTabs = document.querySelectorAll(".about__tab");
const aboutApps = document.querySelectorAll(".about__app");
const aboutDishes = document.querySelectorAll(".about__dish");

aboutTabs.forEach(AddTabListener);

function AddTabListener(tabElement) {
    tabElement.addEventListener("click", updatePage);
}

function updatePage(event) {
    const clickedTab = event.currentTarget;

    if (clickedTab.classList.contains("about__app")) {
        // display app elements
        aboutApps.forEach(showElements);

        // hide dish elements
        aboutDishes.forEach(hideElements);
    } else if (clickedTab.classList.contains("about__dish")) {
        // display dish elements
        aboutDishes.forEach(showElements);

        // hide app elements
        aboutApps.forEach(hideElements);
    }
}

function showElements(element) {
    // if statement modifies (border only) the class of tab element
    // else applies to other elements
    if (element.classList.contains("about__tab")) {
        element.classList.add("about__tab-selected");
    } else {
        element.classList.remove("about__hidden");
        element.classList.add("about__visible");
    }
}

function hideElements(element) {
    // if statement modifies (border only) the class of tab element
    // else applies to other elements
    if (element.classList.contains("about__tab")) {
        element.classList.remove("about__tab-selected");
    } else {
        element.classList.remove("about__visible");
        element.classList.add("about__hidden");
    }
}
