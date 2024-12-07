// Show toast function
function showToast(message, toastClass) {
    const toastElement = document.getElementById('toast-notification');
    const toastBody = document.getElementById('toast-message');
    toastBody.textContent = message;
    toastElement.className = `toast align-items-center text-white ${toastClass} border-0`;

    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 3000
    });

    toast.show();
}

// *** MOVIES ***
// Frontend for searching Movies
const movieResultsDiv = document.getElementById("movie-search-results")
const moviePaginationDiv = document.getElementById("movie-pagination")
let currentMoviePage = 1

document.getElementById("movie-search-button").onclick = () => {
    currentMoviePage = 1 // Reset to page 1 on new search
    fetchMovies()
};

document.addEventListener("DOMContentLoaded", () => {
    console.log("Initializing tabs and search functionality...")

    // Initialize default active tab's search functionality
    if (document.querySelector("#movie-tab").classList.contains("active")) {
        initializeMovieSearch()
    } else if (document.querySelector("#tv-tab").classList.contains("active")) {
        initializeTvSearch()
    }

    // Bind tab switch events
    document.querySelectorAll('.nav-link[data-bs-toggle="tab"]').forEach((tab) => {
        tab.addEventListener("shown.bs.tab", (event) => {
            console.log("Tab switched:", event.target.id)
            if (event.target.id === "movie-tab") {
                currentMoviePage = 1;
                initializeMovieSearch()
            } else if (event.target.id === "tv-tab") {
                currentTvPage = 1;
                initializeTvSearch()
            }
        })
    })
})

function initializeMovieSearch() {
    const movieSearchButton = document.getElementById("movie-search-button")
    if (!movieSearchButton.hasAttribute("data-initialized")) {
        movieSearchButton.setAttribute("data-initialized", "true");
        console.log("Initializing movie search...")
        movieSearchButton.addEventListener("click", (e) => {
            e.preventDefault()
            currentMoviePage = 1
            fetchMovies()
        })
    }
}

function initializeTvSearch() {
    const tvSearchButton = document.getElementById("tv-search-button")
    if (!tvSearchButton.hasAttribute("data-initialized")) {
        tvSearchButton.setAttribute("data-initialized", "true")
        console.log("Initializing TV search...")
        tvSearchButton.addEventListener("click", (e) => {
            e.preventDefault()
            currentTvPage = 1
            fetchTvShows()
        })
    }
}

async function fetchMovies(page = 1) {
    const searchTerm = document.getElementById("movie-search-input").value.trim()
    if (!searchTerm) return

    const response = await fetch(`/watchlist/search?q=${encodeURIComponent(searchTerm)}&page=${page}`)
    if (response.ok) {
        const data = await response.json()
        renderMovies(data.results || [])
        renderPagination(data.totalResults, page, fetchMovies)
    } else {
        console.error("Error fetching movie search results:", await response.text())
        movieResultsDiv.innerHTML = "<p>Error fetching movie results.</p>"
    }
}

/* Accordion Version of Render */
function renderMovies(movies) {
    const movieAccordionDiv = document.getElementById("movieAccordion");
    movieAccordionDiv.innerHTML = movies.length
        ? movies
                .map(
                    (movie, index) => `
                    <div class="accordion-item">
                        <div class="accordion-header d-flex justify-content-between align-items-center">
                            <h2 class="accordion-header col-10" id="heading${index}">
                                <button class="accordion-button  collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                                    ${movie.Title} (${movie.Year})
                                </button>
                            </h2>
                            <button class="btn btn-success btn-sm col-2 ml-2" onclick="addToWatchlist('${movie.imdbID}')">Add to Watchlist</button>
                        </div>
                        <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}" data-bs-parent="#movieAccordion">
                            <div class="accordion-body">
                                <p><strong>Genre:</strong> ${movie.Genre || "No genre available."}</p> 
                                <p><strong>Plot:</strong> ${movie.Plot || "No plot summary available."}</p>
                            </div>
                        </div>
                    </div>
                `
                )
                .join("")
        : "<p>No results found.</p>";
}

function renderPagination(totalResults, currentPage, callback) {
    const resultsPerPage = 10; // OMDB API limit
    const totalPages = Math.ceil(totalResults / resultsPerPage);
    const visiblePageCount = 10; // Number of page buttons to display

    const startPage = Math.floor((currentPage - 1) / visiblePageCount) * visiblePageCount + 1;
    const endPage = Math.min(startPage + visiblePageCount - 1, totalPages);

    let paginationHTML = `<ul class="pagination justify-content-center">`;

    // "Previous" button
    if (startPage > 1) {
        paginationHTML += `
            <li class="page-item">
                <button class="page-link" onclick="${callback.name}(${startPage - visiblePageCount})">&laquo;</button>
            </li>`;
    }

    // Page number buttons
    for (let page = startPage; page <= endPage; page++) {
        paginationHTML += `
            <li class="page-item ${currentPage === page ? "active" : ""}">
                <button class="page-link" onclick="${callback.name}(${page})">${page}</button>
            </li>`;
    }

    // "Next" button
    if (endPage < totalPages) {
        paginationHTML += `
            <li class="page-item">
                <button class="page-link" onclick="${callback.name}(${endPage + 1})">&raquo;</button>
            </li>`;
    }

    paginationHTML += `</ul>`;

    const paginationDiv = callback === fetchMovies ? moviePaginationDiv : tvPaginationDiv;
    paginationDiv.innerHTML = paginationHTML;
}


async function addToWatchlist(imdbID) {
    const response = await fetch("/watchlist/add-to-watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imdbID }),
    });

    if (response.ok) {
        showToast("Movie added to watchlist!", "bg-success");
    } else {
        showToast(`Error: ${await response.text()}`, "bg-danger");
    }
}

// *** TV SHOWS ***
// Frontend for searching TV shows
const tvResultsDiv = document.getElementById("tv-search-results")
const tvPaginationDiv = document.getElementById("tv-pagination")
let currentTvPage = 1;

document.getElementById("tv-search-button").onclick = () => {
    currentTvPage = 1
    fetchTvShows()
}

async function fetchTvShows(page = 1) {
    const searchTerm = document.getElementById("tv-search-input").value.trim()
    if (!searchTerm) return

    const response = await fetch(`/tv-watchlist/search?q=${encodeURIComponent(searchTerm)}&page=${page}`)
    if (response.ok) {
        const data = await response.json()
        renderTvShows(data.results || [])
        renderPagination(data.totalResults, page, fetchTvShows)
    } else {
        console.error("Error fetching TV show results:", await response.text())
        tvResultsDiv.innerHTML = "<p>Error fetching TV show results.</p>"
    }
}

/* Accordion Version of Render */
function renderTvShows(tvShows) {
    const tvAccordionDiv = document.getElementById("tvAccordion");
    tvAccordionDiv.innerHTML = tvShows.length
        ? tvShows
            .map(
                (tvShow, index) => `
                    <div class="accordion-item">
                        <div class="accordion-header d-flex justify-content-between align-items-center">
                            <h2 class="accordion-header col-10" id="headingTv${index}">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTv${index}" aria-expanded="false" aria-controls="collapseTv${index}">
                                    ${tvShow.Title} (${tvShow.Year})
                                </button>
                            </h2>
                            <button class="btn btn-success btn-sm col-2 ml-2" onclick="addToTvWatchlist('${tvShow.imdbID}')">Add to Watchlist</button>
                        </div>
                        <div id="collapseTv${index}" class="accordion-collapse collapse" aria-labelledby="headingTv${index}" data-bs-parent="#tvAccordion">
                            <div class="accordion-body">
                                <p><strong>Genre:</strong> ${tvShow.Genre || "No genre available."}</p>
                                <p><strong>Plot:</strong> ${tvShow.Plot || "No plot summary available."}</p>
                            </div>
                        </div>
                    </div>
                `
            )
            .join("")
        : "<p>No results found.</p>";
}

async function addToTvWatchlist(imdbID) {
    const response = await fetch("/tv-watchlist/add-to-watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imdbID }),
    });

    if (response.ok) {
        showToast("TV show added to watchlist!", "bg-success");
    } else {
        showToast(`Error: ${await response.text()}`, "bg-danger");
    }
}