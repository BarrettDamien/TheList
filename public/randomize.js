document.getElementById('randomize-button').onclick = async function() {
    try {
        // Get selected genre
        const genre = document.getElementById('genre-select').value;  
        console.log('Selected genre:', genre);

        // Get the selected option (either "movie" or "tv") from the radio buttons
        const mediaType = document.querySelector('input[name="media-type"]:checked').value;
        console.log('Media type:', mediaType);

        // Construct the endpoint based on movie or TV selection
        let endpoint;
        if (mediaType === 'tv') {
            endpoint = '/randomize-tv/randomize-tv';
        } else {
            endpoint = '/randomize/randomize';
        }

        // Construct the query string
        const genreQuery = genre ? `?q=${encodeURIComponent(genre)}` : '';  // Only add `?q=` if genre is selected
        console.log('Query string:', genreQuery);

        // Make the request to the backend
        try {
            const response = await fetch(`${endpoint}${genreQuery}`);
            console.log('Raw Response:', response);
    
            // Ensure the response is in JSON format
            if (response.ok && response.headers.get('Content-Type').includes('application/json')) {
                const data = await response.json(); // Parse JSON once
                console.log('Parsed JSON Response:', data);
    
                // Use the data to update your UI or handle as needed
                //document.getElementById('random-selection').textContent = JSON.stringify(data, null, 2);
                
                const resultDiv = document.getElementById('random-selection');
                resultDiv.innerHTML = ''; // Clear previous result
                
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
                    resultDiv.innerHTML = '<p>No results found or invalid response.</p>';
                }
            } else {
                console.error('Unexpected response format or status:', response);
            }
        } catch (error) {
            console.error('Error in fetch operation:', error);
        }

        /* const data = await response.json();
        console.log('Parsed JSON Response:', data);
        console.log('Random Movie:', data.data); // Access `data` field */

        //const response = await fetch(`${endpoint}${genreQuery}`);

        /* 
        // Bunch of logging to try and isolate the issue.
        console.log('Raw Response:', response);
        const responseBody = await response.text(); // Temporarily log raw text for debugging
        console.log('Raw Response Body:', responseBody);

        console.log('Response Headers:', [...response.headers]);
        console.log('API Response Status:', response.status);

        const rawResponse = await response.text(); // Fetch raw response
        console.log('Raw Response Body:', rawResponse);

        try {
            const data = JSON.parse(rawResponse); // Parse JSON manually
            console.log('Parsed Data:', data);
        } catch (err) {
            console.error('Failed to parse JSON:', err);
            alert('Unexpected response from the server.');
        }

        // Debugger to try and figure out why the response is not in JSON
        if (response.ok) {
            const contentType = response.headers.get('content-type');
            console.log('Content-Type:', contentType);
        
            if (contentType?.includes('application/json')) {
                const data = await response.json();
                console.log('Parsed JSON:', data);
                // Process data
            } else {
                const rawText = await response.text(); // Fallback for non-JSON response
                console.error('Non-JSON Response:', rawText);
                alert('Unexpected response from the server.');
            }
        } else {
            console.error('HTTP Error:', response.status, response.statusText);
            alert(`Error: ${response.status} - ${response.statusText}`);
        }
        // End of Debugger

        if (response.ok) {
            console.log('Raw response:', response);

            if (!response.headers.get('content-type')?.includes('application/json')) {
                throw new Error('Unexpected response format; expected JSON.');
            }

            try {
                const data = await response.json(); // Parse JSON
                console.log('Randomized Movie or TV Show:', data);
                
                const resultDiv = document.getElementById('random-selection');
                resultDiv.innerHTML = ''; // Clear previous result
                
                if (data && data.title) {
                    resultDiv.innerHTML = `
                        <strong>${data.title || 'Untitled'}</strong> (${data.year || 'Unknown Year'})<br>
                        Genre: ${data.genre || 'Unknown Genre'}<br>
                        Description: ${data.description || 'No description available.'}
                    `;
                } else {
                    resultDiv.innerHTML = '<p>No results found or invalid response.</p>';
                }
            } catch (err) {
                console.error('Failed to parse JSON:', err);
                alert('Unexpected response from the server. Please try again.');
            }
        } else {
            try {
                const errorData = await response.json(); // Parse error JSON
                console.error('Backend Error:', errorData);
                alert(`Error: ${errorData.error || 'Unknown error occurred'}`);
            } catch (err) {
                console.error('Failed to parse error response:', err);
                alert('Server returned an error but could not parse it.');
            }
        }*/
    } catch (err) {
        console.error('Error in JS Script:', err);
        alert('An unexpected error occurred.');
    } 
};