document.getElementById('randomize-button').onclick = async function() {
    try {
        const genre = document.getElementById('genre-select').value;  // Get selected genre
        console.log('Selected genre:', genre);

        // Get the selected option (either "movie" or "tv") from the radio buttons
        const mediaType = document.querySelector('input[name="media-type"]:checked').value;
        console.log('Media type:', mediaType);

        /* const isTV = document.querySelector('input[name="media-type"]:checked').value === 'tv';
        console.log('Is TV selected:', isTV); */

        // Construct the endpoint based on movie or TV selection
        //const endpoint = isTV ? '/randomize-tv' : '/randomize';
        // Construct the endpoint based on movie or TV selection
        let endpoint;
        if (mediaType === 'tv') {
            endpoint = '/randomize-tv';
        } else {
            endpoint = '/randomize';
        }

        // Construct the query string
        const genreQuery = genre ? `?q=${encodeURIComponent(genre)}` : '';  // Only add `?q=` if genre is selected
        console.log('Query string:', genreQuery);

        // Make the request to the backend
        const response = await fetch(`${endpoint}${genreQuery}`);
        console.log('API Response Status:', response.status);

        if (response.ok) {
            const data = await response.json();
            console.log('Randomized Movie or TV Show:', data);

            const resultDiv = document.getElementById('random-selection');
            resultDiv.innerHTML = '';  // Clear previous result

            // Display the random selection
            if (data && data.title) {
                resultDiv.innerHTML = `
                    <strong>${data.title || 'Untitled'}</strong> (${data.year || 'Unknown Year'})<br>
                    Genre: ${data.genre || 'Unknown Genre'}<br>
                    Description: ${data.description || 'No description available.'}
                `;
            } else {
                resultDiv.innerHTML = '<p>No results found or invalid response.</p>';
            }
        } else {
            const errorData = await response.json();
            console.error('Backend Error:', errorData);
            alert(`Error: ${errorData.error}`);
        }
    } catch (err) {
        console.error('Error in JS Script:', err);
        alert('An unexpected error occurred.');
    }
};