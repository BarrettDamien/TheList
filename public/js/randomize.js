// Default media type on page load
let mediaType = 'movie'

// Listen for tab click events and update the media type
document.querySelectorAll('.nav-link').forEach(tab => {
    tab.addEventListener('click', (event) => {
        mediaType = event.target.id.includes('tv') ? 'tv' : 'movie' // Infer type from tab ID
        console.log('Media type updated:', mediaType)

        // Clear the result display when switching tabs
        document.getElementById('random-selection').innerHTML = ''
    })
})

// Handle the randomizer button click
document.getElementById('randomize-button').onclick = async function () {
    try {
        const genre = document.getElementById('genre-select').value || ''
        const endpoint = mediaType === 'tv' ? '/randomize-tv/randomize-tv' : '/randomize/randomize'
        const query = genre ? `?q=${encodeURIComponent(genre)}` : ''

        const response = await fetch(`${endpoint}${query}`)
        if (!response.ok) {
            const error = await response.json();
            alert(error.error || 'An error occurred.')
            return
        }

        const data = await response.json()
        if (mediaType === 'movie' && data.movie) {
            updateHeroSection({
                poster: data.movie.poster,
                title: data.movie.title,
                year: data.movie.year,
                genre: data.movie.genre,
                plot: data.movie.plot,
            })
        } else if (mediaType === 'tv' && data.tvshow) {
            updateHeroSection({
                poster: data.tvshow.poster,
                title: data.tvshow.title,
                year: data.tvshow.year,
                genre: data.tvshow.genre,
                plot: data.tvshow.plot || 'No description available.',
            })
        } else {
            alert('No results found or invalid response.')
        }
    } catch (error) {
        console.error('Error fetching random selection:', error)
        alert('An unexpected error occurred.')
    }
}

function updateHeroSection(data) {
    const heroSection = document.querySelector('.movie-hero')

    // Update the poster image
    document.getElementById('poster-image').src = data.poster || '/images/which_one_first.png'
    document.getElementById('poster-image').alt = `${data.title || 'Untitled'} Poster`

    // Update movie details
    document.getElementById('movie-title').textContent = data.title || 'Untitled'
    document.getElementById('movie-year').innerHTML = `<strong>Year:</strong> ${data.year || 'Unknown'}`
    document.getElementById('movie-genre').innerHTML = `<strong>Genre:</strong> ${data.genre || 'Unknown'}`
    document.getElementById('movie-description').innerHTML = `
        <strong>Plot:</strong> ${data.plot || 'No description available.'}
    `

    // Show the hero section
    heroSection.hidden = false
}


