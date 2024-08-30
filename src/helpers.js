import * as Carousel from "./Carousel.js";
import { API_KEY } from "../apiKey.js";
const API_BASE_URL = 'https://api.thecatapi.com/v1';
const API_IMAGE_URL = 'images/search?limit=10&breed_ids='
const API_FAV_URL = 'https://api.thecatapi.com/v1/favourites'
const headers = { 'x-api-key': API_KEY }

// axios setup
axios.defaults.headers.common['x-api-key'] = API_KEY
axios.defaults.onDownloadProgress = updateProgress


const deleteFavBtn = document.getElementById('delFavBtn')
deleteFavBtn.onclick = deleteAllFavorites


// create paragraph in infoDump for breed description
const infoDump = document.getElementById('infoDump')
const infoPara = document.createElement('p')
infoDump.appendChild(infoPara)

// progress bar
const progressBar = document.getElementById("progressBar");


// request interceptor
axios.interceptors.request.use(request => {

    progressBar.classList.add('notransition')
    progressBar.style.width = '0%'
    document.body.style.cursor = 'progress'

    request.metadata = request.metadata || {};
    request.metadata.startTime = new Date().getTime();
    return request;
});


// response interceptor
axios.interceptors.response.use(
    (response) => {

        document.body.style.cursor = ''

        response.config.metadata.endTime = new Date().getTime();
        response.config.metadata.durationInMS = response.config.metadata.endTime - response.config.metadata.startTime;

        console.log(`Request took ${response.config.metadata.durationInMS} milliseconds.`)
        return response;
    },
    (error) => {
        error.config.metadata.endTime = new Date().getTime();
        error.config.metadata.durationInMS = error.config.metadata.endTime - error.config.metadata.startTime;

        console.log(`Request took ${error.config.metadata.durationInMS} milliseconds.`)
        throw error;
    });


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


export function createOption(id, value, text) {

    // create a new option
    const defaultOption = document.createElement('option')

    // set option attributes
    defaultOption.id = id
    defaultOption.value = value
    defaultOption.textContent = text

    return defaultOption
}



export async function handleBreedChange(e) {

    // extract breed from target option
    const breed = e.target.value
    const breedName = e.target.options[e.target.selectedIndex].text

    infoPara.textContent = ''

    //fetch breed data
    if (breed) {

        const data = await fetch(`${API_BASE_URL}/${API_IMAGE_URL}${breed}`, { headers })
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

        // create new description paragraph
        infoPara.textContent = data[0].breeds[0].description
    }
    // load favorites
    loadFavorites()
}



export async function axiosInitialLoad() {

    // fetch cat data as json
    const { data: catBreeds } = await axios.get(`${API_BASE_URL}/breeds`)

    // append default option
    const defaultOption = createOption('default', '', 'Please select a breed')
    breedSelect.appendChild(defaultOption)

    // append breed options
    catBreeds.forEach(breed => {
        const breedOption = createOption(breed.id, breed.id, breed.name)
        breedSelect.appendChild(breedOption)
    });
}

export async function axiosHandleBreedChange(e) {

    // extract breed from target option
    const breed = e.target.value
    const breedName = e.target.options[e.target.selectedIndex].text

    infoPara.textContent = ''

    //fetch breed data
    if (breed) {

        const { data: breedData } = await axios.get(`${API_BASE_URL}/${API_IMAGE_URL}${breed}`)

        // clear the carousel
        Carousel.clear()

        // populate the carousel with cat images
        for (const img of breedData) {
            const item = Carousel.createCarouselItem(img.url, `Picture of a ${breedName}`, img.id)
            Carousel.appendCarousel(item)
        }

        // start the carousel
        Carousel.start()

        // create new description paragraph
        const { description } = breedData[0].breeds
        infoPara.textContent = description
        loadFavorites()
    }
}


function updateProgress(progressEvent) {
    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    progressBar.classList.remove('notransition')
    progressBar.style.width = `${percentCompleted}%`;
}


async function loadFavorites() {

    const favorites = await getFavorites()

    // get all favorite buttons
    const favButtons = document.querySelectorAll('.favorite-button')

    // populate favorites
    for (const button of favButtons) {
        const favorite = favorites.find(obj => obj.image_id === button.dataset.imgId)
        if (favorite) {
            button.dataset.favId = favorite.id
            button.classList.add('favorite')
        }
    }
}


async function getFavorites() {
    const { data: favorites } = await axios.get('https://api.thecatapi.com/v1/favourites')
    return favorites
}

export async function deleteFavorite(favoriteId) {
    axios.delete(`https://api.thecatapi.com/v1/favourites/${favoriteId}`)
        .then(() => {
            const favBtn = document.querySelector(`[data-fav-id='${favoriteId}']`)
            favBtn.classList.remove('favorite')
            delete favBtn.dataset.favId
        })
}

async function deleteAllFavorites() {
    const favorites = await getFavorites()
    for (const favorite of favorites) {
        deleteFavorite(favorite.id)
    }
}

export async function setFavorite(imgId) {
    const response = await axios.post('https://api.thecatapi.com/v1/favourites', { 'image_id': imgId, 'sub_id': '508' })
    const { message, id: favId } = response.data

    if (message === 'SUCCESS') {
        const favBtn = document.querySelector(`[data-img-id='${imgId}']`)
        favBtn.dataset.favId = favId
        favBtn.classList.add('favorite')
    }
}


/**
 * 9. Test your favorite() function by creating a getfavorites() function.
 * - Use Axios to get all of your favorites from the cat API.
 * - Clear the carousel and display your favorites when the button is clicked.
 *  - You will have to bind this event listener to getFavoritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */
