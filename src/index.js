import * as helper from './helpers.js'

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");


// The get favorites button element.
const getFavoritesBtn = document.getElementById("getFavoritesBtn");

// fetch
// onload = helper.initialLoad
// breedSelect.onchange = helper.handleBreedChange


// axios
onload = helper.axiosInitialLoad
breedSelect.onchange = helper.axiosHandleBreedChange




