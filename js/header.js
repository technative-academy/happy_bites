const burgerOpen = document.querySelector("#burgerOpen");
const burgerClose = document.querySelector("#burgerClose");
const burgerMenu = document.querySelector("#burgerMenu");

burgerOpen.addEventListener("click", () => {
    burgerMenu.classList.add("burger-active");
});

burgerClose.addEventListener("click", () => {
    burgerMenu.classList.remove("burger-active");
});
