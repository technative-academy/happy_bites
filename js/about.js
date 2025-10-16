const aboutTabElements = document.querySelectorAll(".about__tab");
const aboutAppTextElements = document.querySelectorAll(".about__appText");
const aboutTeamTextElements = document.querySelectorAll(".about__teamText");
// const aboutImageElements = document.querySelectorAll("about__image");

const aboutAppImageElement = document.querySelector(".about__appImage");
const aboutTeamImageElement = document.querySelector(".about__teamImage");

aboutTabElements.forEach(addListenerAboutTab);

function addListenerAboutTab(aboutTabElement) {
    aboutTabElement.addEventListener("click", changeAboutPageContentText);
}

function changeAboutPageContentText(event) {
    const currentElement = event.currentTarget;
    if (currentElement.classList.contains("about__tab-app")) {
        aboutAppTextElements[0].classList.remove("about__appText-hidden");
        aboutAppTextElements[1].classList.remove("about__appText-hidden");

        aboutTeamTextElements[0].classList.remove("about__teamText-visible");
        aboutTeamTextElements[1].classList.remove("about__teamText-visible");

        aboutTabElements[0].classList.add("about__tab-selected");
        aboutTabElements[1].classList.remove("about__tab-selected");

        // app image
        aboutAppImageElement.classList.remove("about__appImage-hidden");
        aboutTeamImageElement.classList.remove("about__teamImage-visible");
    } else if (currentElement.classList.contains("about__tab-team")) {
        aboutAppTextElements[0].classList.add("about__appText-hidden");
        aboutAppTextElements[1].classList.add("about__appText-hidden");

        aboutTeamTextElements[0].classList.add("about__teamText-visible");
        aboutTeamTextElements[1].classList.add("about__teamText-visible");

        aboutTabElements[0].classList.remove("about__tab-selected");
        aboutTabElements[1].classList.add("about__tab-selected");

        // team image
        aboutAppImageElement.classList.add("about__appImage-hidden");
        aboutTeamImageElement.classList.add("about__teamImage-visible");
    }
}
