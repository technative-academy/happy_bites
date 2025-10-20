class Shop {
    constructor() {
        this.currentPage = 1;
        this.currentSort = "title-a-z";
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
        this.productsContainer.classList.remove("is-shown");
        this.searchResultCount.textContent = "";

        while (this.productsList.firstChild) {
            this.productsList.removeChild(this.productsList.lastChild);
        }

        const pageSize = 5;

        // resetting page to 1, to allow items to be sorted
        const sort = this.sortInput.value;
        if (sort !== this.currentSort) {
            this.currentSort = sort;
            this.currentPage = 1;
            this.results = [];
            this.showMoreButton.classList.remove("is-hidden");
            this.showMoreButton.classList.add("is-visible");
        }
        const APIsort = this.getAPISortValue(sort);

        // The API url
        const url = `https://ai-project.technative.dev.f90.co.uk/products/happybites?sort=${APIsort}&page-size=${pageSize}&page=${this.currentPage}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            // saving the products to this.results
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

    //using API filtering abilities to reverse for the additional sort
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

    moreResults() {
        this.currentPage += 1;
        this.search();

        if (this.currentPage === 2) {
            this.showMoreButton.classList.add("is-hidden");
        }
    }

    processProducts(data, reverseResults = false) {
        //using API filtering abilities to reverse for the additional sort
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
            productsItemStars.textContent = "⭐".repeat(product.stars);
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
