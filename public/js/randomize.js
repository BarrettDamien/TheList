document.getElementById('randomize-button').onclick = async function() {
    try {
        // Get selected genre
        const genre = document.getElementById('genre-select').value
        console.log('Selected genre:', genre)

        // Get the selected option (either "movie" or "tv") from the radio buttons
        const mediaType = document.querySelector('input[name="media-type"]:checked').value
        console.log('Media type:', mediaType)

        // Construct the endpoint based on movie or TV selection
        let endpoint;
        if (mediaType === 'tv') {
            endpoint = '/randomize-tv/randomize-tv'
        } else {
            endpoint = '/randomize/randomize'
        }

        // Construct the query string
        const genreQuery = genre ? `?q=${encodeURIComponent(genre)}` : ''  // Only add `?q=` if genre is selected
        console.log('Query string:', genreQuery)

        // Make the request to the backend
        try {
            const response = await fetch(`${endpoint}${genreQuery}`)
            console.log('Raw Response:', response)

            // Check if the response is not OK (e.g., 404 for empty watchlist)
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error Response:', errorData);

                // Display error message to the user
                const resultDiv = document.getElementById('random-selection');
                resultDiv.innerHTML = `<p class="error-message">${errorData.error || 'An error occurred.'}</p>`;
                return;
            }
    
            // Ensure the response is in JSON format
            if (response.ok && response.headers.get('Content-Type').includes('application/json')) {
                const data = await response.json() // Parse JSON once
                console.log('Parsed JSON Response:', data)
                const resultDiv = document.getElementById('random-selection')
                resultDiv.innerHTML = '' // Clear previous result
                
                if (mediaType === 'movie' && data && data.movie && data.movie.title) {
                    resultDiv.innerHTML = `
                        <strong>${data.movie.title || 'Untitled'}</strong> (${data.movie.year || 'Unknown Year'})<br>
                        Genre: ${data.movie.genre || 'Unknown Genre'}<br>
                        Description: ${data.movie.description || 'No description available.'}
                    `;
                } else if (mediaType === 'tv' && data && data.tvshow && data.tvshow.title) {
                    resultDiv.innerHTML = `
                        <strong>${data.tvshow.title || 'Untitled'}</strong> (${data.tvshow.year || 'Unknown Year'})<br>
                        Genre: ${data.tvshow.genre || 'Unknown Genre'}<br>
                        Seasons: ${data.tvshow.seasons || 'Unknown Seasons'}<br>
                        Description: ${data.tvshow.description || 'No description available.'}
                    `;
                } else {
                    resultDiv.innerHTML = '<p>No results found or invalid response.</p>'
                }
            } else {
                console.error('Unexpected response format or status:', response)
            }
        } catch (error) {
            console.error('Error in fetch operation:', error)
        }
    } catch (err) {
        console.error('Error in JS Script:', err)
        alert('An unexpected error occurred.')
    } 
}