import * as Carousel from "./Carousel.js";

const API_KEY = "live_4MYP3nZ58BfE8rmxZuATDsNPzOcz28uVAdAwyrNmdtPWtnVIYNBWu4wuCpP3QlBp";
const API_BASE_URL = 'https://api.thecatapi.com/v1';
const API_IMAGE_URL = 'images/search?limit=10&breed_ids='
const headers = { 'x-api-key': API_KEY }


export async function initialLoad() {
    // fetch cat data as json
    const catBreeds = await fetch(`${API_BASE_URL}/breeds`)
        .then(res => res.json())

    // append default option
    const defaultOption = createOption('default', '', 'Please select a breed')
    breedSelect.appendChild(defaultOption)

    // append breed options
    catBreeds.forEach(breed => {
        const breedOption = createOption(breed.id, breed.id, breed.name)
        breedSelect.appendChild(breedOption)
    });
}

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
    const breedName = e.target.options[e.target.selectedIndex].text

    //fetch breed data
    if (breed) {

        const data = await fetch(`${API_BASE_URL}/${API_IMAGE_URL}${breed}`, headers)
            .then(res => res.json())

        // clear the carousel
        Carousel.clear()

        // populate the carousel with cat images
        for (const img of data) {
            const item = Carousel.createCarouselItem(img.url, `Picture of a ${breedName}`, img.id)
            Carousel.appendCarousel(item)
        }
        
        // start the carousel
        Carousel.start()
    }
}