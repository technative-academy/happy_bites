class Shop {
    constructor() {
        // keeping track of search parameters
        this.currentPage = 1;
        this.currentSort = "title-a-z";
        this.currentSearch = "";
        this.results = [];
        this.searchContainer = document.querySelector(".search");
        if (this.searchContainer) {
            this.searchInput =
                this.searchContainer.querySelector(".search__input");
            this.searchButton =
                this.searchContainer.querySelector(".search__submit");
            this.searchResultCount = this.searchContainer.querySelector(
                ".search__result-count"
            );
            this.sortInput =
                this.searchContainer.querySelector(".search__sort");
            this.loading =
                this.searchContainer.querySelector(".search__loading");

            this.productsContainer = document.querySelector(".products");
            this.productsList =
                this.productsContainer.querySelector(".products__list");
            this.showMoreButton = this.productsContainer.querySelector(
                "#show-more-products-button"
            );
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
        this.sortInput.addEventListener("change", () => this.search());
        this.showMoreButton.addEventListener("click", () => this.moreResults());
        this.checkInput();
        this.search();
    }

    checkInput() {
        this.searchButton.disabled = this.searchInput.value.length === 0;
    }

    async search(e) {
        if (e) e.preventDefault();

        this.loading.classList.add("is-loading");
        this.searchResultCount.textContent = "";

        const pageSize = 5;

        const sort = this.sortInput.value;
        const sortChanged = sort !== this.currentSort;
        const search = this.searchInput.value;
        const searchChanged = search !== this.currentSearch;
        // resetting state when search or sort changes
        if (sortChanged || searchChanged) {
            this.currentPage = 1;
            this.results = [];
            this.showMoreButton.classList.remove("is-hidden");
            this.showMoreButton.classList.add("is-visible");
        }
        this.currentSort = sort;
        this.currentSearch = search;
        // the sort value to be used in the api url
        const APIsort = this.getAPISortValue(sort);

        // hiding show more button if page is greater than 1
        if (this.currentPage > 1) {
            this.showMoreButton.classList.add("is-hidden");
            this.showMoreButton.classList.remove("is-visible");
        }

        // The API url
        const url = `https://ai-project.technative.dev.f90.co.uk/products/happybites?sort=${APIsort}&page-size=${pageSize}&page=${this.currentPage}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            // handling pagiation
            if (this.currentPage === 1) {
                this.results = json.products;
            } else {
                this.results = this.results.concat(json.products);
            }

            // passing data down to proccessProducts
            this.processProducts(
                this.results,
                this.shouldReverseResults(sort, APIsort)
            );
            this.loading.classList.remove("is-loading");
        } catch (error) {
            console.error(error.message);
            this.loading.classList.remove("is-loading");
        }
    }

    //converting sort value to api equivalent
    getAPISortValue(sort) {
        if (sort === "title-a-z" || sort === "title-z-a") {
            return "title";
        }
        if (sort === "price-low" || sort === "price-high") {
            return "price";
        }
        if (sort === "rating-low" || sort == "rating-high") {
            return "rating";
        }
    }

    //checking if api supports current sort
    shouldReverseResults(sort, APIsort) {
        if (APIsort === "title" && sort === "title-z-a") {
            return true;
        }
        if (APIsort === "price" && sort === "price-high") {
            return true;
        }
        if (APIsort === "rating" && sort === "rating-low") {
            return true;
        }
        return false;
    }

    // loading more products
    moreResults() {
        this.currentPage += 1;
        this.search();
    }

    processProducts(data, reverseResults) {
        let productsData = data;
        if (reverseResults) {
            productsData = productsData.reverse();
        }
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

        while (this.productsList.firstChild) {
            this.productsList.removeChild(this.productsList.lastChild);
        }

        filteredProducts.forEach((product) => {
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
