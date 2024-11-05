

// Script for GET /search
document.getElementById('movie-search-button2').onclick = async function() {
    const searchTerm = document.getElementById('movie-search-input2').value.trim()

    // Make a GET request to the server's search endpoint
    const response = await fetch(`/watchlist/search?q=${encodeURIComponent(searchTerm)}`)
    
    if (response.ok) {
        const data = await response.json()
        const resultsDiv = document.getElementById('movie-search-results2')
        resultsDiv.innerHTML = ''; // Clear previous results

        if (data && data.length > 0) {
            data.forEach(movie => {
                const resultItem = document.createElement('div')
                resultItem.innerHTML = `
                    <strong>${movie.Title}</strong> (${movie.Year}) 
                    <button onclick="addToWatchlist('${movie.imdbID}')">Add to Watchlist</button>
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

// Script for POST /add-to-watchlist
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