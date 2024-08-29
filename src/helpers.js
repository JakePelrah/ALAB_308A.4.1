const API_KEY = "live_4MYP3nZ58BfE8rmxZuATDsNPzOcz28uVAdAwyrNmdtPWtnVIYNBWu4wuCpP3QlBp";
const API_BASE_URL = 'https://api.thecatapi.com/v1';
const headers = { 'x-api-key': API_KEY }
import * as Carousel from "./Carousel.js";

/**

/**
 * Creates an HTML <option> element with the specified attributes.
 *
 * @param {string} id - The ID to set for the <option> element.
 * @param {string} value - The value attribute to set for the <option> element.
 * @param {string} text - The text content to display for the <option> element.
 * @returns {HTMLOptionElement} The newly created <option> element.
 */
export function createOption(id, value, text) {

    // create a new option
    const defaultOption = document.createElement('option')

    // set option attributes
    defaultOption.id = id
    defaultOption.value = value
    defaultOption.textContent = text

    return defaultOption
}

/**
 * Handles the change event for a breed selection. Fetches and logs breed data
 * from an external API based on the selected breed.
 *
 * @param {Event} e - The event object representing the change event.
 * @returns {Promise<void>} A promise that resolves when the breed data has been logged.
 */
export async function handleBreedChange(e) {

    // extract breed from target option
    const breed = e.target.value

    //fetch breed data
    if (breed) {
        const data = await fetch(`${API_BASE_URL}/images/search?limit=10&breed_ids=${breed}`, headers)
            .then(res => res.json())

        // clear the carousel
        Carousel.clear()

        // populate the carousel with cat images
        for (const img of data) {
            const item = Carousel.createCarouselItem(img.url, `Picture of a ${breed}`, img.id)
            Carousel.appendCarousel(item)
        }
        // start the carousel
        Carousel.start()
    }
}