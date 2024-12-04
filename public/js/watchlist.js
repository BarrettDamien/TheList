// *** MOVIES ***
// Frontend for searching Movies
const movieResultsDiv = document.getElementById("movie-search-results");
const moviePaginationDiv = document.getElementById("movie-pagination");
let currentMoviePage = 1;

document.getElementById("movie-search-button").onclick = () => {
    currentMoviePage = 1; // Reset to page 1 on new search
    fetchMovies();
};

async function fetchMovies(page = 1) {
    const searchTerm = document.getElementById("movie-search-input").value.trim();
    if (!searchTerm) return;

    const response = await fetch(`/watchlist/search?q=${encodeURIComponent(searchTerm)}&page=${page}`);
    if (response.ok) {
        const data = await response.json();
        renderMovies(data.results || []);
        renderPagination(data.totalResults, page, fetchMovies);
    } else {
        console.error("Error fetching movie search results:", await response.text());
        movieResultsDiv.innerHTML = "<p>Error fetching movie results.</p>";
    }
}

function renderMovies(movies) {
    movieResultsDiv.innerHTML = movies.length
        ? movies
              .map(
                  (movie) => `
            <div>
                <strong>${movie.Title}</strong> (${movie.Year}) 
                <button class="btn btn-secondary btn-sm" onclick="addToWatchlist('${movie.imdbID}')">Add to Movie Watchlist</button>
            </div>
        `
              )
              .join("")
        : "<p>No results found.</p>";
}

function renderPagination(totalResults, currentPage, callback) {
    const totalPages = Math.ceil(totalResults / 10); // Assuming 10 results per page
    moviePaginationDiv.innerHTML = Array.from({ length: totalPages }, (_, i) => {
        const page = i + 1;
        return `<li class="page-item ${currentPage === page ? "active" : ""}">
            <button class="page-link" onclick="${callback.name}(${page})">${page}</button>
        </li>`;
    }).join("");
}

async function addToWatchlist(imdbID) {
    const response = await fetch("/watchlist/add-to-watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imdbID }),
    });

    alert(response.ok ? "Movie added to watchlist!" : `Error: ${await response.text()}`);
}

// *** TV SHOWS ***
// Frontend for searching TV shows
const tvResultsDiv = document.getElementById("tv-search-results");
const tvPaginationDiv = document.getElementById("tv-pagination");
let currentTvPage = 1;

document.getElementById("tv-search-button").onclick = () => {
    currentTvPage = 1;
    fetchTvShows();
};

async function fetchTvShows(page = 1) {
    const searchTerm = document.getElementById("tv-search-input").value.trim();
    if (!searchTerm) return;

    const response = await fetch(`/tv-watchlist/search?q=${encodeURIComponent(searchTerm)}&page=${page}`);
    if (response.ok) {
        const data = await response.json();
        renderTvShows(data.results || []);
        renderPagination(data.totalResults, page, fetchTvShows);
    } else {
        console.error("Error fetching TV show results:", await response.text());
        tvResultsDiv.innerHTML = "<p>Error fetching TV show results.</p>";
    }
}

function renderTvShows(tvShows) {
    tvResultsDiv.innerHTML = tvShows.length
        ? tvShows
              .map(
                  (tvShow) => `
            <div>
                <strong>${tvShow.Title}</strong> (${tvShow.Year}) 
                <button class="btn btn-secondary btn-sm" onclick="addToTvWatchlist('${tvShow.imdbID}')">Add to TV Watchlist</button>
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

    alert(response.ok ? "TV show added to watchlist!" : `Error: ${await response.text()}`);
}

