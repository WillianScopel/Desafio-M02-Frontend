const divMovies = document.querySelector('.movies')
const pageMovies = []
const btnPrev = document.querySelector('.btn-prev')
const btnNext = document.querySelector('.btn-next')
const maxPage = 2
const minPage = 0
let pageCount = 0
const highlightVideo = document.querySelector('.highlight__video')
const highlighTitle = document.querySelector('.highlight__title')
const highlightRating = document.querySelector('.highlight__rating')
const highlightGenres = document.querySelector('.highlight__genres')
const highlightLaunch = document.querySelector('.highlight__launch')
const highlightDescription = document.querySelector('.highlight__description')
const highlightVideoLink = document.querySelector('.highlight__video-link')
const divModal = document.querySelector('.modal')
const modalClose = document.querySelector('.modal__close')
const modalTitle = document.querySelector('.modal__title')
const modalImg = document.querySelector('.modal__img')
const modalDescription = document.querySelector('.modal__description')
const modalGenreAverage = document.querySelector('.modal__genre-average')
const modalGenres = document.querySelector('.modal__genres')
const modalAverage = document.querySelector('.modal__average')
const body = document.querySelector('body')
const root = document.querySelector(':root')
const headerLogo = document.querySelector('.header_logo');
const headerIcon = document.querySelector('.btn-theme')

async function getMovies() {
    const response = await api.get('/discover/movie?language=pt-BR', {})

    for (let i = 0; i < 18; i++) {
        pageMovies.push(response.data.results[i])
    }
    for (let index = 0; index < 24; index++) {
        const divCardMovie = document.createElement('div')
        divMovies.appendChild(divCardMovie)
        divCardMovie.classList.add('movie')
        divCardMovie.addEventListener('click', () => {
            divModal.classList.replace('hidden', 'visible')
            modalMovie(response.data.results[index].id)
        })

        const divMovieInfo = document.createElement('div')
        divCardMovie.appendChild(divMovieInfo)
        divMovieInfo.classList.add('movie__info')

        const spanMovieTitle = document.createElement('span')
        divMovieInfo.appendChild(spanMovieTitle)
        spanMovieTitle.classList.add('movie__title')

        const spanMovieRating = document.createElement('span')
        divMovieInfo.appendChild(spanMovieRating)
        spanMovieRating.classList.add('movie__rating')

        const imgStar = document.createElement('img')
        imgStar.src = './assets/estrela.svg'
        imgStar.alt = 'Estrela'

        if (index < 18) {
            divCardMovie.style.backgroundImage = `url(${pageMovies[index].poster_path})`
            spanMovieTitle.textContent = pageMovies[index].title
            spanMovieRating.textContent = pageMovies[index].vote_average
        }
        spanMovieRating.append(imgStar)
    }
    cardMovies()
}

const page0 = []
const page1 = []
const page2 = []
const pageSearch = []

const cardMovies = () => {
    const divCardMovies = document.querySelectorAll('.movies > .movie')

    for (let index = 0; index < 24; index++) {
        if (page0.length < 6) {
            page0.push(divCardMovies[index])
        } else if (page1.length < 6) {
            page1.push(divCardMovies[index])
        } else if (page2.length < 6) {
            page2.push(divCardMovies[index])
        } else if (pageSearch.length < 6) {
            pageSearch.push(divCardMovies[index])
        }
    }
    cardsToHidden(pageSearch, page2)
    if (pageCount == 0) {
        cardsToHidden(page1, page2)
        cardsVisible(page0)
    } else if (pageCount == 1) {
        cardsToHidden(page0, page2)
        cardsVisible(page1)
    } else if (pageCount == 2) {
        cardsVisible(page2)
        cardsToHidden(page0, page1)
    }

}

const cardsToHidden = (cardMovieHidden, cardMovieHidden2) => {
    for (const card of cardMovieHidden) {
        card.classList.add('hidden')
    }

    for (const card of cardMovieHidden2) {
        card.classList.add('hidden')
    }
}

const cardsVisible = (pageVisible) => {
    for (const card of pageVisible) {
        card.classList.replace('hidden', 'visible')
    }
}

btnPrev.addEventListener('click', (event) => {
    event.stopPropagation()

    pageCount--
    if (pageCount < minPage) {
        pageCount = 2
    }
    cardMovies()
})

btnNext.addEventListener('click', (event) => {
    event.stopPropagation()

    pageCount++
    if (pageCount > maxPage) {
        pageCount = 0
    }
    cardMovies()
})

getMovies()


async function movieOfTheDay() {
    const responseVideo = await api.get('/movie/436969?language=pt-BR', {})
    const videoData = await api.get('/movie/436969/videos?language=pt-BR', {})
    let genresNames = ""

    for (let index = 0; index < responseVideo.data.genres.length; index++) {
        genresNames += (responseVideo.data.genres[index].name) += ", "
    }

    highlightVideo.style.backgroundImage = `url(${responseVideo.data.backdrop_path})`
    highlightVideo.style.backgroundSize = 'cover'
    highlighTitle.textContent = responseVideo.data.title
    highlightRating.textContent = responseVideo.data.vote_average.toFixed(1)
    highlightGenres.textContent = `${genresNames.slice(0, -2)}`
    highlightLaunch.textContent = `${new Date(responseVideo.data.release_date).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    })}`
    highlightDescription.textContent = responseVideo.data.overview
    highlightVideoLink.href = `https://www.youtube.com/watch?v=${videoData.data.results[0].key}`
}

movieOfTheDay()

const input = document.querySelector('.input')

input.addEventListener('keydown', (event) => {
    const key = event.key

    if (!input.value && key === 'Enter') {
        pageCount = 0
        cardMovies()
    }

    if (key === 'Enter' && input.value != '') {
        searchMovies(input.value)
        cardsToHidden(page1, page2)
        cardsToHidden(page0, page2)
        cardsVisible(pageSearch)
        input.value = ''
    }
})

async function searchMovies(inputValue) {
    const searchLink = await api.get(`search/movie?language=pt-BR&include_adult=false&query=${inputValue}`, {})
    const { results } = searchLink.data
    const divCardMovies = document.querySelectorAll('.movies > .movie')
    const spanMovieTitle = document.querySelectorAll('.movie__title')
    const spanMovieRating = document.querySelectorAll('.movie__rating')
    const imgStar = document.querySelectorAll('.movie__rating > img')

    let pageSearchCount = 18
    for (let index = 0; index < 6; index++) {
        divCardMovies[pageSearchCount].style.backgroundImage = `url(${results[index].poster_path})`
        spanMovieTitle[pageSearchCount].textContent = results[index].title
        spanMovieRating[pageSearchCount].textContent = results[index].vote_average
        spanMovieRating[pageSearchCount].appendChild(imgStar[pageSearchCount])
        pageSearchCount++
    }

    pageSearchCount = 18
}

async function modalMovie(idMovie) {
    const response = await api.get(`/movie/${idMovie}?language=pt-BR`)
    const info = response.data

    modalTitle.textContent = response.data.title
    modalImg.src = response.data.backdrop_path
    modalDescription.textContent = response.data.overview
    modalAverage.textContent = response.data.vote_average.toFixed(1)
    modalGenres.textContent = ""

    info.genres.forEach((generoCard) => {
        const modalGenreSpan = document.createElement('span');
        modalGenreSpan.classList.add('modal__genre');

        modalGenreSpan.textContent = generoCard.name;

        modalGenres.appendChild(modalGenreSpan);
    });
}

const spanModalGenre = document.querySelector('.modal__genre')
divModal.addEventListener('click', () => {
    divModal.classList.replace('visible', 'hidden')
    modalGenres.classList.add('hidden')
})

function applyCurrentTheme() {
    const currentTheme = localStorage.getItem("theme");

    if (!currentTheme || currentTheme === "light") {
        headerLogo.src = './assets/logo-dark.png';
        headerIcon.src = 'assets/light-mode.svg';
        btnPrev.src = 'assets/arrow-left-dark.svg';
        btnNext.src = 'assets/arrow-right-dark.svg';
        modalClose.src = 'assets/close-dark.svg';
        root.style.setProperty("--background", "#fff");
        root.style.setProperty("--input-color", "#979797");
        root.style.setProperty("--input-bg-color", "#fff");
        root.style.setProperty("--text-color", "#1b2028");
        root.style.setProperty("--bg-secondary", "#ededed");
        root.style.setProperty("--rating-color", "#f1c40f");
        root.style.setProperty("--bg-modal", "#ededed");

        return;
    }

    headerLogo.src = './assets/logo.svg';
    headerIcon.src = './assets/dark-mode.svg';
    btnPrev.src = 'assets/arrow-left-light.svg';
    btnNext.src = 'assets/arrow-right-light.svg';
    modalClose.src = 'assets/close.svg';
    root.style.setProperty("--background", "rgba(27, 32, 40, 1)");
    root.style.setProperty("--input-color", "#665F5F");
    root.style.setProperty("--input-bg-color", "#3E434D");
    root.style.setProperty("--text-color", "#fff");
    root.style.setProperty("--bg-secondary", "rgba(45, 52, 64, 1)");
    root.style.setProperty("--rating-color", "#f1c40f");
    root.style.setProperty("--bg-modal", "black");
}

applyCurrentTheme();

headerIcon.addEventListener('click', () => {
    const currentTheme = localStorage.getItem("theme");

    if (!currentTheme || currentTheme === "light") {
        localStorage.setItem("theme", "dark");
        applyCurrentTheme();
        return;
    }

    localStorage.setItem("theme", "light");
    applyCurrentTheme();
});




