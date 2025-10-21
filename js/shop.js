class Shop {
    constructor() {
        this.searchContainer = document.querySelector(".search");
        if (this.searchContainer) {
            this.searchInput =
                this.searchContainer.querySelector(".search__input");
            this.searchButton =
                this.searchContainer.querySelector(".search__submit");
            this.searchResultCount = this.searchContainer.querySelector(
                ".search__result-count"
            );
            this.loading =
                this.searchContainer.querySelector(".search__loading");

            this.productsContainer = document.querySelector(".products");
            this.productsList =
                this.productsContainer.querySelector(".products__list");
        }
    }

    init() {
        if (!this.searchContainer) return;
        let debounceTimeout;
        // allowing search to happen when user types. But delaying it enough that it doesn't overwhelm the api.
        this.searchInput.addEventListener("input", (e) => {
            this.checkInput(e);
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => this.search(), 500);
        });
        this.searchButton.addEventListener("click", (e) => this.search(e));
        this.checkInput();
        this.search();
    }

    checkInput() {
        this.searchButton.disabled = this.searchInput.value.length === 0;
    }

    async search(e) {
        if (e) e.preventDefault();

        this.loading.classList.add("is-loading");
        this.productsContainer.classList.remove("is-shown");
        this.searchResultCount.textContent = "";

        while (this.productsList.firstChild) {
            this.productsList.removeChild(this.productsList.lastChild);
        }

        // The API url
        const url = `https://ai-project.technative.dev.f90.co.uk/products/happybites`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            // saving the products to a data variable
            const data = json.products;

            // passing data down to proccessProducts
            this.processProducts(data);
            this.loading.classList.remove("is-loading");
        } catch (error) {
            console.error(error.message);
            this.loading.classList.remove("is-loading");
        }
    }

    processProducts(data) {
        const searchTerm = this.searchInput.value.toLowerCase();
        const filteredProducts = data.filter(
            (product) =>
                product.title.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
        );

        this.searchResultCount.textContent = `${filteredProducts.length} products found`;

        if (filteredProducts.length > 0) {
            this.productsContainer.classList.add("is-shown");
        } else {
            this.productsContainer.classList.remove("is-shown");
        }

        filteredProducts.forEach((product) => {
            console.log(product.image);
            const productsItem = document.createElement("div");
            productsItem.classList.add("products__item");
            this.productsList.appendChild(productsItem);

            const productsItemImage = document.createElement("img");
            productsItemImage.classList.add("products__item-image");
            productsItemImage.src = `https://ai-project.technative.dev.f90.co.uk${product.image}`;
            productsItemImage.alt = `A photo of ${product.title}`;
            productsItem.appendChild(productsItemImage);

            const productsItemTitle = document.createElement("h3");
            productsItemTitle.classList.add("products__item-title");
            productsItemTitle.textContent = product.title;
            productsItem.appendChild(productsItemTitle);

            const productsItemDescription = document.createElement("p");
            productsItemDescription.classList.add("products__item-description");
            productsItemDescription.textContent = product.description;
            productsItem.appendChild(productsItemDescription);

            const productsItemStars = document.createElement("p");
            productsItemStars.classList.add("products__item-stars");
            productsItemStars.textContent = " ⭐ ".repeat(product.stars);
            productsItem.appendChild(productsItemStars);

            const productsItemPrice = document.createElement("p");
            productsItemPrice.classList.add("products__item-price");
            productsItemPrice.textContent = `£${product.price}`;
            productsItem.appendChild(productsItemPrice);
        });
    }
}

// Expose an instance of the 'Shop' class
export default new Shop();
