export function createCarouselItem(imgSrc, imgAlt, imgId) {
  const template = document.querySelector("#carouselItemTemplate");
  const clone = template.content.firstElementChild.cloneNode(true);

  const img = clone.querySelector("img");
  img.src = imgSrc;
  img.alt = imgAlt;

  const favBtn = clone.querySelector(".favorite-button");
  favBtn.dataset.imgId = imgId

  favBtn.addEventListener("click", () => {

    // delete favorite
    if (favBtn.classList.contains('favorite')) {

      deleteFavorite(favBtn.dataset.favId)
      favBtn.classList.remove('favorite')
      delete favBtn.dataset.favId

    } else {
      setFavorite(imgId).then((favId) => {
        if (favId) {
          favBtn.dataset.favId = favId
          favBtn.classList.add('favorite')
        }
      })
    }

  });

  return clone;
}

export function clear() {
  const carousel = document.querySelector("#carouselInner");
  while (carousel.firstChild) {
    carousel.removeChild(carousel.firstChild);
  }
}

export function appendCarousel(element) {
  const carousel = document.querySelector("#carouselInner");

  const activeItem = document.querySelector(".carousel-item.active");
  if (!activeItem) element.classList.add("active");

  carousel.appendChild(element);
}

export function start() {
  const multipleCardCarousel = document.querySelector(
    "#carouselExampleControls"
  );
  if (window.matchMedia("(min-width: 768px)").matches) {
    const carousel = new bootstrap.Carousel(multipleCardCarousel, {
      interval: false
    });
    const carouselWidth = $(".carousel-inner")[0].scrollWidth;
    const cardWidth = $(".carousel-item").width();
    let scrollPosition = 0;
    $("#carouselExampleControls .carousel-control-next").unbind();
    $("#carouselExampleControls .carousel-control-next").on(
      "click",
      function () {
        if (scrollPosition < carouselWidth - cardWidth * 4) {
          scrollPosition += cardWidth;
          $("#carouselExampleControls .carousel-inner").animate(
            { scrollLeft: scrollPosition },
            600
          );
        }
      }
    );
    $("#carouselExampleControls .carousel-control-prev").unbind();
    $("#carouselExampleControls .carousel-control-prev").on(
      "click",
      function () {
        if (scrollPosition > 0) {
          scrollPosition -= cardWidth;
          $("#carouselExampleControls .carousel-inner").animate(
            { scrollLeft: scrollPosition },
            600
          );
        }
      }
    );
  } else {
    $(multipleCardCarousel).addClass("slide");
  }
}

async function setFavorite(imgId) {
  const response = await axios.post('https://api.thecatapi.com/v1/favourites', { 'image_id': imgId, 'sub_id': '508' })
  const { message, id } = response.data
  if (message === 'SUCCESS') {
    return id
  }
}



async function deleteFavorite(favoriteId) {
  axios.delete(`https://api.thecatapi.com/v1/favourites/${favoriteId}`)
    .then(console.log)
}


