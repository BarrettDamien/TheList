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
    movieResultsDiv.innerHTML = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Year</th>
                    <th>Add?</th>
                </tr>
            </thead>
            <tbody>
                ${movies.length
                    ? movies
                            .map((movie) => `
                                <tr>
                                    <td>${movie.Title}</td>
                                    <td>${movie.Year}</td>
                                    <td><button class="btn btn-success btn-sm" onclick="addToWatchlist('${movie.imdbID}')">Add</button></td>
                                </tr>
                            `)
                            .join("")
                    : "<tr><td colspan='4'>No results found.</td></tr>"
                }
            </tbody>
        </table>
    `;
}

/* function renderPagination(totalResults, currentPage, callback) {
    const totalPages = Math.ceil(totalResults / 10); // Assuming 10 results per page
    moviePaginationDiv.innerHTML = `
        <ul class="pagination justify-content-center">
            ${Array.from({ length: totalPages }, (_, i) => {
                const page = i + 1;
                return `<li class="page-item ${currentPage === page ? "active" : ""}">
                    <button class="page-link" onclick="${callback.name}(${page})">${page}</button>
                </li>`;
            }).join("")}
        </ul>
    `;
} */

function renderPagination(totalResults, currentPage, callback) {
    const resultsPerPage = 10;
    const totalPages = Math.ceil(totalResults / resultsPerPage);
    const visiblePageCount = 10;  // Show 9 pages at a time
    
    // Calculate the start and end page numbers for the current visible range
    let startPage = Math.floor((currentPage - 1) / visiblePageCount) * visiblePageCount + 1;
    let endPage = Math.min(startPage + visiblePageCount - 1, totalPages);

    // Create "Previous" and "Next" buttons to navigate between page groups
    let paginationHTML = `<ul class="pagination justify-content-center">`;

    // "Previous" button to go back to the previous group of pages
    if (startPage > 1) {
        paginationHTML += `
            <li class="page-item">
                <button class="page-link" onclick="${callback.name}(${startPage - visiblePageCount})">&laquo;</button>
            </li>
        `;
    }

    // Loop through the range of pages to be shown and create buttons
    for (let page = startPage; page <= endPage; page++) {
        paginationHTML += `
            <li class="page-item ${currentPage === page ? "active" : ""}">
                <button class="page-link" onclick="${callback.name}(${page})">${page}</button>
            </li>
        `;
    }

    // "Next" button to go to the next group of pages
    if (endPage < totalPages) {
        paginationHTML += `
            <li class="page-item">
                <button class="page-link" onclick="${callback.name}(${endPage + 1})">&raquo;</button>
            </li>
        `;
    }

    paginationHTML += `</ul>`;
    moviePaginationDiv.innerHTML = paginationHTML;
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
    tvResultsDiv.innerHTML = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Year</th>
                    <th>Add?</th>
                </tr>
            </thead>
            <tbody>
                ${tvShows.length
                    ? tvShows
                            .map((tvShow) => `
                                <tr>
                                    <td>${tvShow.Title}</td>
                                    <td>${tvShow.Year}</td>
                                    <td><button class="btn btn-success btn-sm" onclick="addToTvWatchlist('${tvShow.imdbID}')">Add</button></td>
                                </tr>
                            `)
                            .join("")
                    : "<tr><td colspan='4'>No results found.</td></tr>"
                }
            </tbody>
        </table>
    `;
}

async function addToTvWatchlist(imdbID) {
    const response = await fetch("/tv-watchlist/add-to-watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imdbID }),
    });

    alert(response.ok ? "TV show added to watchlist!" : `Error: ${await response.text()}`);
}

