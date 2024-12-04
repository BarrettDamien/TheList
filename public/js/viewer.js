// Frontend JS for removing options from watchlist
document.addEventListener('DOMContentLoaded', () => {
    const removeButtons = document.querySelectorAll('.remove-button');
    removeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const itemId = button.dataset.id;
            const type = button.dataset.type;
            console.log('Attempting to remove:', itemId, type);
            removeFromWatchlist(itemId, type);
        });
    });
});

async function removeFromWatchlist(itemId, type) {
    console.log('Attempting to remove:', itemId, type);
    try {
        const response = await fetch('/watchlist/remove', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemId, type }) // Pass both itemId (movieId or tvShowId) and type
        });

        if (!response.ok) {
            console.error('Error response from server:', response.status);
            const text = await response.text();
            console.error('Response body:', text);
            alert('Error removing item from watchlist');
            return;
        }

        const data = await response.json();
        alert(data.message); // Success message
        location.reload(); // Reload to reflect changes
    } catch (error) {
        console.error('Error removing from watchlist:', error);
        alert('Failed to remove from watchlist');
    }
}