const baseURL = 'https://api.rawg.io/api/games';
const apiKEY = 'fbef1dafd3904289b83a100d6d14e5ab';
const searchBtn = document.querySelector("#search-btn");
const prewBtn = document.querySelector("#prew");
const nextBtn = document.querySelector("#next");
let pageText = document.querySelector(".page");
let span = document.querySelector('span');
let indexBtm = document.querySelector("#index-btn")
const select = document.getElementById('genre-select');
let currentPage = 1;
let pageSize = 20;
let pagesCount = 0;
let searchQuery = '';

async function fetchData() {
try{

    let response = await fetch(`${baseURL}?key=${apiKEY}&page=${currentPage}&page_size=${pageSize}`)
        if(!response.ok){
            console.log('Ошибка');
        }
        console.log(response);
        
        let data = await response.json()
        displayGames(data.results);
        pageData(data.count )
        console.log(data);
        // let ids = data.results.map(game => game.id);
        // console.log(ids);
        //  newBody(ids)

    }
catch(err){
    console.log(err);
} 
}


async function platforms(id) {
    let response = await fetch(`https://api.rawg.io/api/games/${id}/youtube?key=${apiKEY}`);
    let plat = await response.json()
    console.log(plat);
}
platforms()
async function newBody(game) {
    platforms(game.id)
    let wrapper = document.querySelector('#main-body');
    let header  = document.getElementById('newBody-header');
    let footer = document.querySelector('.footer');
    
    wrapper.innerHTML = '';
    footer.innerHTML = '';
    try {
        let response = await fetch(`${baseURL}/${game.id}?key=${apiKEY}`);
    if (!response.ok) {
    throw new Error('Error fetching game details');
    }
    let gameDetails = await response.json();
console.log(gameDetails);
    let div = document.createElement('div');
    div.className = 'childs'
    let titleElement = document.createElement('h1');
    titleElement.textContent = gameDetails.name;
    let imageElement = document.createElement('img');
    imageElement.src = gameDetails.background_image;
    let releaseElement = document.createElement('p');
    releaseElement.textContent = `Release Date: ${gameDetails.released}`;
    let descriptionElement = document.createElement('p');
    descriptionElement.textContent = gameDetails.description_raw;
    
    displayGameVideo(game.id)
    div.appendChild(titleElement);
    div.appendChild(newBodyButton()); 
    div.appendChild(imageElement);
    div.appendChild(releaseElement);
    div.appendChild(descriptionElement);
    wrapper.appendChild(div)
    
    } catch (err) {
    console.error(err);
    }
    }

function newBodyButton () {
    let div = document.createElement('div');
    div.className = 'new-button';
    let myGames = document.createElement('button');
    myGames.className = 'my-games-btn';
    myGames.innerText = 'My games'
    let wishlist = document.createElement('button');
    wishlist.className = 'my-games-btn';
    wishlist.innerText = 'Wishlist'
    div.appendChild(wishlist)
    div.appendChild(myGames)
    return div
}

async function fetchGameVideo(gameId) {
    try {
        const response = await fetch(`${baseURL}/${gameId}/movies?key=${apiKEY}`);
    if (!response.ok) {
    throw new Error('Network response was not ok');
    }
    const gameVideos = await response.json();
    return gameVideos.results;
    } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
    }
    }

    async function displayGameVideo(gameId) {
        const videos = await fetchGameVideo(gameId);
        if (videos && videos.length > 0) {
        // Assuming the API returns an array of videos and each video has a 'clip' property with the video URL
        const videoUrl = videos[0].clip;
        if (videoUrl) {
        const videoElement = document.createElement('video');
        videoElement.src = videoUrl;
        videoElement.controls = true;
        // Append the video element to the wrapper or a specific container instead of document.body
        let wrapper = document.querySelector('#main-body');
        wrapper.appendChild(videoElement);
        } else {
        console.log('No video URL found for this game');
        }
        } else {
        console.log('No videos found for this game');
        }
        }


function pageData(page) {
    pagesCount = Math.ceil(page / pageSize);
    pageText.innerHTML = ' ';
    let dotsSpan = document.createElement('span');
    dotsSpan.textContent = '...';
    pageText.appendChild(dotsSpan);
    pageNumbers();
    let totalSpan = document.createElement('span');
    totalSpan.textContent = pagesCount;
    pageText.appendChild(totalSpan);
    }
    
    function pageNumbers() {
        let pageNumbers = [currentPage, currentPage + 1, currentPage + 2, currentPage + 3];
        pageNumbers.reverse();
        pageNumbers.forEach((number, index) => {
        let pageSpan = document.createElement('span');
        if (number === currentPage) {
            let strong = document.createElement('strong');
            strong.textContent = `${number},  `;
            pageSpan.appendChild(strong);
        } else {
            pageSpan.textContent = `${number}, `;
        }
        pageText.insertBefore(pageSpan, pageText.firstChild);
    });
}


function displayGames(data) {
    let wrapper = document.querySelector("#main-body");
    wrapper.innerHTML = "";
    data.forEach(game => {
        let div = document.createElement("div");
        let img = document.createElement("img");
        let h1 = document.createElement("h3");
        let p = document.createElement("p"); 
        div.className = "child";
        img.src = game.background_image;
        h1.textContent = game.name;
        p.textContent = ` ${game.released}`; 
        div.appendChild(img);
        div.appendChild(h1);
        div.appendChild(p); 
        wrapper.appendChild(div);
        div.addEventListener('click', () => {
            newBody(game)
        });
    });
}


document.addEventListener("DOMContentLoaded",  fetchData) 

async function searchGame () {
    let input = document.querySelector('#input-search').value;
    searchQuery = input;
    let response = await fetch(
    `${baseURL}?key=${apiKEY}&search=${searchQuery}`
    );
    let resultResponse = await response.json();
    displayGames(resultResponse.results);
    pageData(resultResponse.count, searchQuery);
    console.log(resultResponse);
    replaceButtons()
}

searchBtn.addEventListener("click", searchGame)

select.addEventListener('change', function() {
    let genre = this.value; 
    if (genre === 'all') {
    fetchData();
    } else {
    fetchGenreData(genre);
    }
    });

    async function fetchGenreData(genre) {
        try {
            let response = await fetch(`${baseURL}?key=${apiKEY}&genres=${genre}&page=${currentPage}&page_size=${pageSize}`);
            if (!response.ok) {
                throw new Error('Ошибка при запросе данных по жанру');
            }
        let data = await response.json();
        displayGames(data.results);
        pageData(data.count); 
        } 
        catch (err) {
            console.error(err);
        }
    }

nextBtn.addEventListener("click", () => {
    currentPage++
    fetchData()
})

prewBtn.addEventListener("click", () => {
    currentPage--;
    fetchData()
})



function replaceButtons() {
    let existingPrewButton = document.getElementById('prew2');
    let existingNextButton = document.getElementById('next2');

    if (existingPrewButton && existingNextButton) {
        return;
    }

    if (prewBtn) prewBtn.style.display = "none";
    if (nextBtn) nextBtn.style.display = "none";

    const newPrewButton = document.createElement('button');
    newPrewButton.id = 'prew2';
    const prewImg = document.createElement('img');
    prewImg.src = 'Arrow 2.svg';
    newPrewButton.appendChild(prewImg);

    const newNextButton = document.createElement('button');
    newNextButton.id = 'next2';
    const nextImg = document.createElement('img');
    nextImg.src = 'Arrow 1.svg';
    newNextButton.appendChild(nextImg);

    const footer = document.querySelector('.footer');
    footer.appendChild(newPrewButton);
    footer.appendChild(document.querySelector('.page'));
    footer.appendChild(newNextButton);

    newNextButton.addEventListener("click", () => {
    currentPage++;
    searchGame();
    });

    newPrewButton.addEventListener("click", () => {
    currentPage--;
    searchGame();
    });
}

indexBtm.addEventListener("click", () => {
    if (prewBtn) prewBtn.style.display= "block"
    fetchData()
    if (nextBtn) nextBtn.style.display= "block";
    
    let newPrewButton = document.querySelector('#prew2');
    let newNextButton = document.querySelector('#next2');
    newPrewButton.style.display= "none";
    newNextButton.style.display= "none"
    const footer = document.querySelector('.footer');
    footer.appendChild(prewBtn);
    footer.appendChild(document.querySelector('.page'));
    footer.appendChild(nextBtn);

})
