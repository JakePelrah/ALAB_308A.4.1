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
        const data = await fetch(`https://api.thecatapi.com/v1/breeds/${breed}`)
            .then(res => res.json())
        console.log(data)
    }
}