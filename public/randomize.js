document.getElementById('randomize-button').onclick = async function() {
    const genre = document.getElementById('genre-select').value;  // Get selected genre
    const isTV = document.getElementById('tv-section').checked;  // Check if TV is selected

    // Construct the endpoint based on movie or TV selection
    const endpoint = isTV ? '/randomize-tv' : '/randomize';

    // Construct the query string
    const genreQuery = genre ? `?q=${encodeURIComponent(genre)}` : '';  // Only add `?q=` if genre is selected

    // Make the request to the backend
    const response = await fetch(`${endpoint}${genreQuery}`);

    if (response.ok) {
        const data = await response.json();
        const resultDiv = document.getElementById('random-selection');
        resultDiv.innerHTML = '';  // Clear previous result

        // Display the random selection
        if (data) {
            resultDiv.innerHTML = `
                <strong>${data.title}</strong> (${data.year})<br>
                Genre: ${data.genre}<br>
                Description: ${data.description || 'No description available.'}
            `;
        } else {
            resultDiv.innerHTML = '<p>No results found for this genre.</p>';
        }
    } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
    }
};