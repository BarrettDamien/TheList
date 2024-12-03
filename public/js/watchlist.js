// *** MOVIES ***
// Frontend for searching Movies
document.getElementById('movie-search-button').onclick = async function() {
    const searchTerm = document.getElementById('movie-search-input').value.trim()

    // Make a GET request to the server's search endpoint
    const response = await fetch(`/watchlist/search?q=${encodeURIComponent(searchTerm)}`)
    
    if (response.ok) {
        const data = await response.json()
        console.log(data); // Debugging: Log API response
        const resultsDiv = document.getElementById('movie-search-results')
        resultsDiv.innerHTML = ''; // Clear previous results

        if (data && data.length > 0) {
            data.forEach(movie => {
                const resultItem = document.createElement('div')
                resultItem.innerHTML = `
                    <strong>${movie.Title}</strong> (${movie.Year}) 
                    <button onclick="addToWatchlist('${movie.imdbID}')">Add to Movie Watchlist</button>
                `;
                resultsDiv.appendChild(resultItem);
            });
        } else {
            resultsDiv.innerHTML = `<p>No results found.</p>`
        }
    } else {
        const errorData = await response.json();
        console.error('Error fetching search results:', errorData.error)
        alert(`Error fetching search results: ${errorData.error}`)
    }
}

// Frontend for adding Movies to watchlist
async function addToWatchlist(imdbID) {
    const response = await fetch('/watchlist/add-to-watchlist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imdbID  })
    })

    if (response.ok) {
        alert('Movie added to watchlist!')
    } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error}`)
    }
}

// *** TV SHOWS ***
// Frontend for searching TV shows
document.getElementById('tv-search-button').onclick = async function () {
    const searchTerm = document.getElementById('tv-search-input').value.trim();

    const response = await fetch(`/tv-watchlist/search?q=${encodeURIComponent(searchTerm)}`);

    if (response.ok) {
        const data = await response.json();
        console.log(data); // Debugging: Log API response
        const resultsDiv = document.getElementById('tv-search-results');
        resultsDiv.innerHTML = ''; // Clear previous results

        if (data && data.length > 0) {
            data.forEach((tvShow) => {
                const resultItem = document.createElement('div');
                /* resultItem.innerHTML = `
                    <div class="card mb-2" style="width: 18rem;">
                        <img src="${tvShow.Poster !== 'N/A' ? tvShow.Poster : 'placeholder.jpg'}" 
                             class="card-img-top" alt="${tvShow.Title}">
                        <div class="card-body">
                            <h5 class="card-title">${tvShow.Title}</h5>
                            <p class="card-text">Year: ${tvShow.Year || 'N/A'}</p>
                            <button onclick="addToTVWatchlist('${tvShow.imdbID}')" 
                                    class="btn btn-primary">Add to Watchlist</button>
                        </div>
                    </div>
                    
                `; */
                resultItem.innerHTML = `
                    <strong>${tvShow.title}</strong> (${tvShow.year || 'N/A'}) 
                    <button onclick="addToTVWatchlist('${tvShow.imdbID}')">Add to TV Watchlist</button>
                `;
                resultsDiv.appendChild(resultItem);
            });
        } else {
            resultsDiv.innerHTML = '<p>No results found.</p>';
        }
    } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
    }
};

// Frontend for adding TV shows to the watchlist
async function addToTVWatchlist(imdbID) {
    const response = await fetch('/tv-watchlist/add-to-watchlist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imdbID }),
    });

    if (response.ok) {
        alert('TV show added to watchlist!');
    } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
    }
}
